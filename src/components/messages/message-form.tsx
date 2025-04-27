// TODO: Add remaining layout and functionality - below is a WIP
// TODO: Translate for all messages

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { translate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, SendHorizonal } from 'lucide-react';
import { EventType, MsgType } from 'matrix-js-sdk';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button/button';
import { Form, FormField } from '../ui/form';
import { Textarea } from '../ui/textarea';

const MESSAGE_BODY_MAX = 6000;

const formSchema = zod.object({
  body: zod.string().max(MESSAGE_BODY_MAX, {
    message: translate('messages.errors.longBody'),
  }),
});

interface Props {
  roomId: string;
}

export const MessageForm = ({ roomId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
  });

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    if (!matrixClient) {
      return;
    }
    setIsSubmitting(true);

    try {
      // TODO: Convert back to sendMessage
      const messageResponse = await matrixClient.sendEvent(
        roomId,
        EventType.RoomMessage,
        {
          body: values.body,
          msgtype: MsgType.Text,
        },
      );

      toast('Message sent successfully', {
        description: `Message ID: ${messageResponse.event_id}`,
      });
      console.log(messageResponse);

      form.reset();

      // Redirect to the rooms list or the new room
      // router.push("/rooms");
    } catch (error) {
      console.error('Error creating room:', error);
      toast('Error creating room', {
        description:
          'There was a problem creating your room. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full overflow-y-auto border-t bg-(--card) p-1 px-1.5"
      >
        <div className="rounded-md p-1 transition-colors duration-200">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <Textarea
                placeholder={t('messages.placeholders.sendMessage')}
                className="resize-none border-none"
                rows={1}
                {...field}
              />
            )}
          />

          <div className="flex justify-between">
            <Button variant="ghost" disabled={isSubmitting}>
              <Image />
            </Button>
            <Button type="submit" variant="ghost" disabled={isSubmitting}>
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
