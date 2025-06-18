// TODO: Add remaining layout and functionality - below is a WIP

import { useMatrixClient } from '@/hooks/use-matrix-client';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

const PROPOSAL_BODY_MAX = 6000;

interface ProposalFormSubmitButtonProps {
  isSubmitting: boolean;
}

interface CreateProposalFormProps {
  roomId: string;
  submitButton: (props: ProposalFormSubmitButtonProps) => ReactNode;
}

const proposalFormSchema = zod.object({
  body: zod.string().max(PROPOSAL_BODY_MAX, {
    message: t('proposals.errors.longBody'),
  }),
});

export const ProposalFormSubmitButton = ({
  isSubmitting,
}: ProposalFormSubmitButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting
        ? t('proposals.prompts.creatingProposal')
        : t('proposals.actions.create')}
    </Button>
  );
};

export const CreateProposalForm = ({
  roomId,
  submitButton,
}: CreateProposalFormProps) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const form = useForm<zod.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      body: '',
    },
  });

  const onSubmit = async (values: zod.infer<typeof proposalFormSchema>) => {
    if (!matrixClient || !values.body.trim()) {
      return;
    }
    try {
      toast('TODO: Implement proposal creation', {
        description: values.body + ' ' + roomId,
      });
    } catch {
      toast(t('proposals.errors.errorCreatingProposal'), {
        description: t('prompts.tryAgain'),
      });
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('proposals.labels.body')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t('proposals.placeholders.body')}
                  className="w-full resize-none md:min-w-md"
                  rows={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitButton({ isSubmitting: form.formState.isSubmitting })}
      </form>
    </Form>
  );
};
