import { PollAnswer } from 'matrix-js-sdk';

export type ProposalAnswer = PollAnswer & {
  position: string;
};

export interface ProposalVote {
  sender: string;
  answers: string[];
  ts: number;
}
