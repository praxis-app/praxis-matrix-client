import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventTimeline, EventType, Method, Room } from 'matrix-js-sdk';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';

interface UseRoomSettingsFormProps {
  room: Room;
  onSuccess?(): void;
}

export const roomSettingsFormSchema = zod.object({
  name: zod
    .string()
    .min(3, {
      message: t('rooms.errors.roomNameMin'),
    })
    .max(50, {
      message: t('rooms.errors.roomNameMax'),
    }),
  topic: zod
    .string()
    .max(500, {
      message: t('rooms.errors.roomTopicMax'),
    })
    .optional(),
  visibility: zod
    .enum(['public', 'private'], {
      required_error: t('rooms.errors.roomVisibility'),
    })
    .optional(),
});

export const useRoomSettingsForm = ({
  room,
  onSuccess,
}: UseRoomSettingsFormProps) => {
  const [isVisibilityLoading, setIsVisibilityLoading] = useState(true);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const topicEvent = roomState?.getStateEvents(EventType.RoomTopic, '');
  const topic: string | undefined = topicEvent
    ? topicEvent.getContent().topic
    : undefined;

  const form = useForm<zod.infer<typeof roomSettingsFormSchema>>({
    resolver: zodResolver(roomSettingsFormSchema),
    defaultValues: {
      name: room.name,
      topic,
    },
  });

  const visibility = useRoomDirectoryVisibility({
    roomId: room.roomId,
    onSuccess: (visibility) => {
      form.setValue('visibility', visibility);
      setIsVisibilityLoading(false);
    },
  });

  const handleSubmit = async (
    values: zod.infer<typeof roomSettingsFormSchema>,
  ) => {
    try {
      if (values.name !== room.name) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomName,
          {
            name: values.name,
          },
          '',
        );
      }
      const currentTopic = topic || '';
      const newTopic = values.topic || '';
      if (newTopic !== currentTopic) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomTopic,
          {
            topic: newTopic,
          },
          '',
        );
      }
      if (values.visibility !== visibility) {
        const url = `/directory/list/room/${encodeURIComponent(room.roomId)}`;
        await matrixClient.http.authedRequest(Method.Put, url, undefined, {
          visibility: values.visibility,
        });
      }

      toast(t('rooms.toasts.roomUpdated'));
      onSuccess?.();
    } catch (error) {
      console.error('Error updating room:', error);
      toast(t('rooms.toasts.roomUpdatedError'), {
        description: t('rooms.toasts.roomUpdatedErrorDescription'),
      });
    }
  };

  return {
    form,
    handleSubmit,
    isInitializing: isVisibilityLoading,
  };
};
