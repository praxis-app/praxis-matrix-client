import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { useRoomName } from '@/hooks/use-room-name';
import { useRoomTopic } from '@/hooks/use-room-topic';
import { getRoomTopic } from '@/lib/room.utilts';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventType, Room, Visibility } from 'matrix-js-sdk';
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
    .enum([Visibility.Public, Visibility.Private], {
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

  const form = useForm<zod.infer<typeof roomSettingsFormSchema>>({
    resolver: zodResolver(roomSettingsFormSchema),
    defaultValues: {
      name: room.name,
      topic: getRoomTopic(room),
    },
  });

  const roomName = useRoomName({
    room,
    onSuccess: (name) => {
      form.setValue('name', name);
    },
  });

  const roomTopic = useRoomTopic({
    room,
    onSuccess: (topic) => {
      form.setValue('topic', topic);
    },
  });

  const roomVisibility = useRoomDirectoryVisibility({
    room,
    onSuccess: (visibility) => {
      form.setValue('visibility', visibility);
      setIsVisibilityLoading(false);
    },
  });

  const handleSubmit = async (
    values: zod.infer<typeof roomSettingsFormSchema>,
  ) => {
    try {
      if (values.name !== roomName) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomName,
          {
            name: values.name,
          },
          '',
        );
      }
      const currentTopic = roomTopic || '';
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
      if (values.visibility && values.visibility !== roomVisibility) {
        await matrixClient.setRoomDirectoryVisibility(
          room.roomId,
          values.visibility,
        );
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
