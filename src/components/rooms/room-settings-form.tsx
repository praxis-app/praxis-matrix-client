import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EventTimeline,
  EventType,
  Method,
  Room,
  Visibility,
} from 'matrix-js-sdk';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const formSchema = zod.object({
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

interface Props {
  room: Room;
}

export const RoomSettingsForm = ({ room }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisibilityLoading, setIsVisibilityLoading] = useState(true);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const topicEvent = roomState?.getStateEvents(EventType.RoomTopic, '');
  const topic: string | undefined = topicEvent
    ? topicEvent.getContent().topic
    : undefined;

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const handleSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!matrixClient) {
      return;
    }
    setIsSubmitting(true);

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
    } catch (error) {
      console.error('Error updating room:', error);
      toast(t('rooms.toasts.roomUpdatedError'), {
        description: t('rooms.toasts.roomUpdatedErrorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVisibilityLoading) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('rooms.placeholders.name')}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('rooms.descriptions.roomName')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.topic')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('rooms.placeholders.topic')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('rooms.prompts.roomTopic')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('rooms.labels.visibility')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t('rooms.placeholders.visibility')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Visibility.Public}>
                    {t('rooms.options.public')}
                  </SelectItem>
                  <SelectItem value={Visibility.Private}>
                    {t('rooms.options.private')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('rooms.descriptions.roomVisibility')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            disabled={isSubmitting || !form.formState.isDirty}
            className="w-22"
            type="submit"
          >
            {t('actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
