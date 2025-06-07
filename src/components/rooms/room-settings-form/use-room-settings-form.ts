// TODO: Add support for Knock and Restricted join rule options

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { useRoomJoinRule } from '@/hooks/use-room-join-rule';
import { useRoomName } from '@/hooks/use-room-name';
import { useRoomTopic } from '@/hooks/use-room-topic';
import { getRoomTopic } from '@/lib/room.utilts';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventType, JoinRule, Room, Visibility } from 'matrix-js-sdk';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';

const roomSettingsFormSchema = zod.object({
  name: zod
    .string()
    .min(3, {
      message: t('rooms.errors.roomNameMin'),
    })
    .max(50, {
      message: t('rooms.errors.roomNameMax'),
    }),
  topic: zod.string().max(500, {
    message: t('rooms.errors.roomTopicMax'),
  }),
  visibility: zod.enum([Visibility.Public, Visibility.Private, ''], {
    required_error: t('rooms.errors.roomVisibility'),
  }),
  joinRule: zod.enum([JoinRule.Public, JoinRule.Invite], {
    required_error: t('rooms.errors.roomAccess'),
  }),
});

export type RoomSettingsFormValues = zod.infer<typeof roomSettingsFormSchema>;

export const useRoomSettingsForm = (
  room: Room,
  { onSuccess }: { onSuccess?: () => void } = {},
) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<RoomSettingsFormValues>({
    resolver: zodResolver(roomSettingsFormSchema),
    defaultValues: {
      name: room.name,
      topic: getRoomTopic(room),
      joinRule: room.getJoinRule() as RoomSettingsFormValues['joinRule'],
      visibility: '',
    },
  });

  const roomName = useRoomName(room, {
    onSuccess: (name) => form.setValue('name', name),
  });
  const roomTopic = useRoomTopic(room, {
    onSuccess: (topic) => form.setValue('topic', topic),
  });
  const roomVisibility = useRoomDirectoryVisibility(room, {
    onSuccess: (visibility) => form.setValue('visibility', visibility),
  });
  const roomJoinRule = useRoomJoinRule(room, {
    onSuccess: (joinRule) => {
      if (joinRule === JoinRule.Public || joinRule === JoinRule.Invite) {
        form.setValue('joinRule', joinRule);
      }
    },
  });

  const hasUnsupportedJoinRule =
    roomJoinRule !== JoinRule.Public && roomJoinRule !== JoinRule.Invite;

  const handleSubmit = async (values: RoomSettingsFormValues) => {
    try {
      if (values.name && values.name !== roomName) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomName,
          { name: values.name },
          '',
        );
      }
      const currentTopic = roomTopic || '';
      const newTopic = values.topic || '';
      if (newTopic !== currentTopic) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomTopic,
          { topic: newTopic },
          '',
        );
      }
      if (values.joinRule && values.joinRule !== roomJoinRule) {
        await matrixClient.sendStateEvent(
          room.roomId,
          EventType.RoomJoinRules,
          { join_rule: values.joinRule },
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
    } catch {
      toast(t('rooms.toasts.roomUpdatedError'), {
        description: t('rooms.toasts.roomUpdatedErrorDescription'),
      });
    }
  };

  return {
    form,
    handleSubmit,
    hasUnsupportedJoinRule,
  };
};
