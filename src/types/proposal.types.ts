import {
  PRAXIS_PROPOSAL_ANSWER_POSITION,
  ProposalAnswerPosition,
} from '@/constants/proposal.constants';
import { PollAnswer } from 'matrix-js-sdk';

export type ProposalAnswer = PollAnswer & {
  [PRAXIS_PROPOSAL_ANSWER_POSITION.name]: ProposalAnswerPosition;
};

export interface ProposalVote {
  sender: string;
  answers: string[];
  ts: number;
}
