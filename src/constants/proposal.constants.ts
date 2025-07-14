import { t } from '@/lib/shared.utils';
import { NamespacedValue } from 'matrix-js-sdk/lib/NamespacedValue';

export const PRAXIS_PROPOSAL_KIND = new NamespacedValue(
  'com.praxis-app.proposal.kind',
);
export const PRAXIS_PROPOSAL_ANSWER_POSITION = new NamespacedValue(
  'com.praxis-app.proposal.answer.position',
);

export enum ProposalAnswerPosition {
  Agree = 'agree',
  Disagree = 'disagree',
  Abstain = 'abstain',
  Block = 'block',
}

export const PROPOSAL_ANSWER_LABELS = {
  [ProposalAnswerPosition.Agree]: t('proposals.actions.agree'),
  [ProposalAnswerPosition.Disagree]: t('proposals.actions.disagree'),
  [ProposalAnswerPosition.Abstain]: t('proposals.actions.abstain'),
  [ProposalAnswerPosition.Block]: t('proposals.actions.block'),
};
