import {
  PRAXIS_PROPOSAL_ANSWER_POSITION,
  PROPOSAL_ANSWER_LABELS,
} from '@/constants/proposal.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { cn } from '@/lib/shared.utils';
import { ProposalAnswer, ProposalVote } from '@/types/proposal.types';
import { TimelineEvents } from 'matrix-js-sdk';
import { PollResponseEvent } from 'matrix-js-sdk/src/extensible_events_v1/PollResponseEvent';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface Props {
  answer: ProposalAnswer;
  myVote?: ProposalVote;
  roomId: string;
  proposalId: string;
}

export const ProposalVoteButton = ({
  answer,
  myVote,
  roomId,
  proposalId,
}: Props) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const position = answer[PRAXIS_PROPOSAL_ANSWER_POSITION.name];
  const label = PROPOSAL_ANSWER_LABELS[position];

  const isSelected = myVote?.answers.includes(answer.id);

  const handleClick = async () => {
    const response = PollResponseEvent.from(
      [answer.id],
      proposalId,
    ).serialize();

    const result = await matrixClient.sendEvent(
      roomId,
      null,
      response.type as keyof TimelineEvents,
      response.content as TimelineEvents[keyof TimelineEvents],
    );

    console.info(t('votes.prompts.voteCast'), result);
    toast(t('votes.prompts.voteCast'), {
      description: JSON.stringify(result),
    });
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn('flex-1', isSelected && '!bg-primary/15')}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};
