import { Button } from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Room name must be at least 3 characters.',
    })
    .max(50, {
      message: 'Room name must not exceed 50 characters.',
    }),
  description: z
    .string()
    .max(500, {
      message: 'Description must not exceed 500 characters.',
    })
    .optional(),
  visibility: z.enum(['public', 'private'], {
    required_error: 'Please select room visibility.',
  }),
});

interface Props {
  trigger: React.ReactNode;
  open?: boolean;
  setOpen?(open: boolean): void;
}

function RoomForm({ trigger, open, setOpen }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'public',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Here you would integrate with Matrix API to create the room
      console.log('Creating room with values:', values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast('Room created successfully', {
        description: `Room "${values.name}" has been created.`,
      });

      // Close the dialog
      if (setOpen) {
        setOpen(false);
      }

      // Reset the form
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a New Chat Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed for your chat room.
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter room description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the room's purpose.
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
                    Public rooms can be found in the room directory. Private
                    rooms require an invitation.
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
}

export default RoomForm;
