// TODO: Add remaining layout and functionality - below is a WIP
// TODO: Translate for all messages

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { translate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, SendHorizonal } from 'lucide-react';
import { MsgType } from 'matrix-js-sdk';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button/button';
import { Form, FormField } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { useEffect, useRef } from 'react';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (
        ['Space', 'Enter', 'Key', 'Digit'].some((key) =>
          e.code.includes(key),
        ) &&
        // Allow for Ctrl + C to copy
        e.code !== 'KeyC'
      ) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    if (!matrixClient) {
      return;
    }

    matrixClient
      .sendMessage(roomId, {
        body: values.body,
        msgtype: MsgType.Text,
      })
      .catch((error) => {
        toast('Error sending message', { description: 'Please try again.' });
        console.error('Error sending message:', error);
      });

    form.reset();
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
                {...field}
                placeholder={t('messages.placeholders.sendMessage')}
                className="resize-none border-none"
                ref={inputRef}
                rows={1}
              />
            )}
          />

          <div className="flex justify-between">
            <Button variant="ghost" disabled={form.formState.isSubmitting}>
              <Image />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              disabled={form.formState.isSubmitting}
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
