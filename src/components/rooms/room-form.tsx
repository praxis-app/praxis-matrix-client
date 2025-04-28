import { Button } from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility } from 'matrix-js-sdk';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';

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

interface Props {
  trigger: React.ReactNode;
  open?: boolean;
  setOpen?(open: boolean): void;
}

// TODO: Add i18n

export const RoomForm = ({ trigger, open, setOpen }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'public',
    },
  });

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!matrixClient) {
      return;
    }
    setIsSubmitting(true);

    try {
      const room = await matrixClient.createRoom({
        name: values.name,
        topic: values.description,
        visibility:
          values.visibility === 'public'
            ? Visibility.Public
            : Visibility.Private,
      });

      toast('Room created successfully', {
        description: `Room "${values.name}" has been created with ID ${room.room_id}.`,
      });

      if (setOpen) {
        setOpen(false);
      }
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('rooms.prompts.createRoom')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t('rooms.prompts.startConversation')}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('rooms.labels.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('rooms.placeholders.name')}
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
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('rooms.placeholders.visibility')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        {t('rooms.options.public')}
                      </SelectItem>
                      <SelectItem value="private">
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

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? t('rooms.prompts.creatingRoom')
                  : t('rooms.actions.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
