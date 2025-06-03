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
import { NavigationPaths } from '@/constants/shared.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventType, Method, Visibility } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';

interface CreateRoomFormSubmitButtonProps {
  isSubmitting: boolean;
}

interface CreateRoomFormProps {
  submitButton: (props: CreateRoomFormSubmitButtonProps) => ReactNode;
  onSubmit(): void;
}

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
  visibility: zod.enum(['public', 'private'], {
    required_error: t('rooms.errors.roomVisibility'),
  }),
});

export const RoomFormSubmitButton = ({
  isSubmitting,
}: CreateRoomFormSubmitButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting
        ? t('rooms.prompts.creatingRoom')
        : t('rooms.actions.create')}
    </Button>
  );
};

export const CreateRoomForm = ({
  submitButton,
  onSubmit,
}: CreateRoomFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      topic: '',
      visibility: Visibility.Private,
    },
  });

  const matrixClient = useMatrixClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!matrixClient) {
      return;
    }
    setIsSubmitting(true);

    try {
      const room = await matrixClient.createRoom({
        name: values.name,
        topic: values.topic,
        room_alias_name: values.name.toLowerCase().replace(/ /g, '-'),

        // TODO: Test wether this is actually needed
        visibility: values.visibility as Visibility,

        initial_state: [
          {
            type: EventType.RoomGuestAccess,
            content: { guest_access: 'can_join' },
          },
        ],
      });

      // Ensure the room is public if requested
      if (values.visibility === Visibility.Public) {
        await matrixClient.http.authedRequest(
          Method.Put,
          `/directory/list/room/${encodeURIComponent(room.room_id)}`,
          undefined,
          { visibility: Visibility.Public },
        );
      }

      form.reset();
      onSubmit();

      navigate(`${NavigationPaths.Rooms}/${room.room_id}`);
    } catch {
      toast(t('rooms.toasts.roomCreatedError'), {
        description: t('rooms.toasts.roomCreatedErrorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        {submitButton({ isSubmitting })}
      </form>
    </Form>
  );
};
