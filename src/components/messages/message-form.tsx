// TODO: Add remaining layout and functionality - below is a WIP
// TODO: Translate for all messages

import { KeyCodes } from '@/constants/shared.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { translate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MsgType } from 'matrix-js-sdk';
import { KeyboardEventHandler, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdImage, MdSend } from 'react-icons/md';
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

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!matrixClient || !values.body.trim()) {
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
  };

  const handleInputKeyDown: KeyboardEventHandler = (e) => {
    if (e.code !== KeyCodes.Enter) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full overflow-y-auto border-t bg-(--card) p-2 pb-4"
      >
        <div className="bg-input/30 rounded-2xl p-1 transition-colors duration-200">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={t('messages.placeholders.sendMessage')}
                className="min-h-12 resize-none border-none bg-transparent shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent"
                onKeyDown={handleInputKeyDown}
                ref={inputRef}
                rows={1}
              />
            )}
          />

          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              disabled={form.formState.isSubmitting}
            >
              <MdImage className="text-muted-foreground size-6" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-full"
              disabled={form.formState.isSubmitting}
            >
              <MdSend className="text-muted-foreground size-5" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
