// TODO: Add i18n for all messages

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useRoomDirectoryVisibility } from '@/hooks/use-room-directory-visibility';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventTimeline, Room, Visibility } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
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
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Textarea } from '../ui/textarea';

interface Props {
  trigger: ReactNode;
  room: Room;
}

const formSchema = zod.object({
  name: zod
    .string()
    .min(3, {
      message: 'Room name must be at least 3 characters.',
    })
    .max(50, {
      message: 'Room name must not exceed 50 characters.',
    }),
  description: zod
    .string()
    .max(500, {
      message: 'Description must not exceed 500 characters.',
    })
    .optional(),
  visibility: zod.enum(['public', 'private'], {
    required_error: 'Please select room visibility.',
  }),
});

const RoomSettingsSheet = ({ trigger, room }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const topicEvent = roomState?.getStateEvents('m.room.topic', '');
  const topic = topicEvent ? topicEvent.getContent().topic : null;

  const visibility = useRoomDirectoryVisibility(room.roomId);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: room.name,
      description: topic,
      visibility: visibility ?? Visibility.Private,
    },
  });

  const handleSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!matrixClient) {
      return;
    }
    setIsSubmitting(true);

    try {
      // TODO: Implement room update
      console.log(values);

      toast(t('rooms.toasts.roomUpdated'));

      form.reset();
    } catch (error) {
      toast(t('rooms.toasts.roomUpdatedError'), {
        description: t('rooms.toasts.roomUpdatedErrorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="mt-14 min-w-[100%] rounded-t-2xl border-0 px-0 pt-3.5"
        hideCloseButton
      >
        <div className="flex justify-between px-2 pb-3.5">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <MdClose className="size-6" />
          </Button>

          <SheetHeader className="self-center">
            <SheetTitle className="text-md mb-0 font-medium">
              {t('rooms.labels.settings')}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <Button variant="ghost">{t('actions.save')}</Button>
        </div>

        <Separator className="mb-7" />

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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('rooms.labels.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('rooms.placeholders.description')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('rooms.prompts.roomDescription')}
                  </FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t('actions.save')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default RoomSettingsSheet;
