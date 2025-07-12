// TODO: Implement ProposalStartEvent in proposal form - the following is a WIP

import {
  IPartialEvent,
  KnownPollKind,
  M_POLL_START,
  M_TEXT,
} from 'matrix-js-sdk';
import { NamespacedValue } from 'matrix-js-sdk/lib/NamespacedValue';
import { PollStartEvent } from 'matrix-js-sdk/src/extensible_events_v1/PollStartEvent';

export class ProposalStartEvent extends PollStartEvent {
  public static from(
    question: string,
    answers: string[],
    kind: KnownPollKind | string,
    maxSelections = 1,
  ): ProposalStartEvent {
    return new ProposalStartEvent({
      type: M_POLL_START.name,
      content: {
        [M_TEXT.name]: question,
        [M_POLL_START.name]: {
          question: { [M_TEXT.name]: question },
          kind: kind instanceof NamespacedValue ? kind.name : kind,
          max_selections: maxSelections,
          answers: answers.map((a) => ({
            id: this.getAnswerId(),
            [M_TEXT.name]: a,
          })),
        },
      },
    });
  }

  public serialize(): IPartialEvent<object> {
    return {
      type: M_POLL_START.name,
      content: {
        [M_POLL_START.name]: {
          question: this.question.serialize().content,
          kind: this.rawKind,
          max_selections: this.maxSelections,
          answers: this.answers.map((a) => a.serialize().content),
        },
        [M_TEXT.name]: `${this.question.text}\n${this.answers.map((a, i) => `${i + 1}. ${a.text}`).join('\n')}`,
      },
    };
  }

  private static getAnswerId = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return [...Array(16)]
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  };
}
