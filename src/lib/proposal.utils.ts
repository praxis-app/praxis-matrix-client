import { KnownPollKind, M_POLL_START, M_TEXT } from 'matrix-js-sdk';
import { NamespacedValue } from 'matrix-js-sdk/lib/NamespacedValue';
import { PollStartEvent } from 'matrix-js-sdk/src/extensible_events_v1/PollStartEvent';

export const getAnswerId = () => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return [...Array(16)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};

/**
 * Creates a new PollStartEvent for a proposal.
 * Reference: https://github.com/matrix-org/matrix-js-sdk/blob/develop/src/extensible_events_v1/PollStartEvent.ts
 *
 * TODO: Refactor to extend PollStartEvent instead of using utils
 */
export const createProposalStartEvent = (
  question: string,
  answers: { text: string; position: string }[],
  kind: KnownPollKind | string,
  maxSelections = 1,
) => {
  return new PollStartEvent({
    type: M_POLL_START.name,
    content: {
      [M_TEXT.name]: question,
      [M_POLL_START.name]: {
        question: { [M_TEXT.name]: question },
        kind: kind instanceof NamespacedValue ? kind.name : kind,
        max_selections: maxSelections,
        answers: answers.map((a) => ({
          id: getAnswerId(),
          [M_TEXT.name]: a.text,
          position: a.position,
        })),
      },
    },
  });
};
