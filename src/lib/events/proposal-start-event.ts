// TODO: Clean up ProposalStartEvent and ProposalAnswerSubevent, remove unneeded code - the following is a WIP

import {
  ExtensibleAnyMessageEventContent,
  IPartialEvent,
  KnownPollKind,
  M_POLL_KIND_DISCLOSED,
  M_POLL_KIND_UNDISCLOSED,
  M_POLL_START,
  M_TEXT,
  PollStartEventContent,
  PollStartSubtype,
} from 'matrix-js-sdk';
import { NamespacedValue } from 'matrix-js-sdk/lib/NamespacedValue';
import { InvalidEventError } from 'matrix-js-sdk/src/extensible_events_v1/InvalidEventError';
import { MessageEvent } from 'matrix-js-sdk/src/extensible_events_v1/MessageEvent';
import {
  PollAnswerSubevent,
  PollStartEvent,
} from 'matrix-js-sdk/src/extensible_events_v1/PollStartEvent';

const PRAXIS_PROPOSAL_KIND = new NamespacedValue(
  'com.praxis-app.proposal.kind',
);
const PRAXIS_PROPOSAL_ANSWER_POSITION = new NamespacedValue(
  'com.praxis-app.proposal.answer.position',
);

export type ProposalAnswer = ExtensibleAnyMessageEventContent & {
  id: string;
  position?: string;
};

class ProposalAnswerSubevent extends PollAnswerSubevent {
  public readonly id: string;
  public readonly position?: string;

  public constructor(wireFormat: IPartialEvent<ProposalAnswer>) {
    super(wireFormat);

    const id = wireFormat.content.id;
    if (!id || typeof id !== 'string') {
      throw new InvalidEventError('Answer ID must be a non-empty string');
    }
    this.id = id;

    const position = wireFormat.content.position;
    if (!position || typeof position !== 'string') {
      throw new InvalidEventError('Answer position must be a non-empty string');
    }
    this.position = position;
  }

  public serialize(): IPartialEvent<object> {
    return {
      type: 'org.matrix.sdk.poll.answer',
      content: {
        id: this.id,
        [PRAXIS_PROPOSAL_ANSWER_POSITION.name]: this.position,
        ...this.serializeMMessageOnly(),
      },
    };
  }
}

export class ProposalStartEvent extends PollStartEvent {
  public readonly answers: ProposalAnswerSubevent[];
  public readonly kind: KnownPollKind;
  public readonly maxSelections: number;
  public readonly question: MessageEvent;
  public readonly rawKind: string;

  public constructor(wireFormat: IPartialEvent<PollStartEventContent>) {
    super(wireFormat);

    const poll = M_POLL_START.findIn<PollStartSubtype>(this.wireContent);

    if (!poll?.question) {
      throw new InvalidEventError('A question is required');
    }

    this.question = new MessageEvent({
      type: 'org.matrix.sdk.poll.question',
      content: poll.question,
    });

    this.rawKind = poll.kind;
    if (M_POLL_KIND_DISCLOSED.matches(this.rawKind)) {
      this.kind = M_POLL_KIND_DISCLOSED;
    } else {
      this.kind = M_POLL_KIND_UNDISCLOSED; // default & assumed value
    }

    this.maxSelections =
      Number.isFinite(poll.max_selections) && poll.max_selections! > 0
        ? poll.max_selections!
        : 1;

    if (!Array.isArray(poll.answers)) {
      throw new InvalidEventError('Poll answers must be an array');
    }
    const answers = poll.answers.slice(0, 20).map(
      (a) =>
        new ProposalAnswerSubevent({
          type: 'org.matrix.sdk.poll.answer',
          content: a,
        }),
    );
    if (answers.length <= 0) {
      throw new InvalidEventError('No answers available');
    }
    this.answers = answers;
  }

  public static from(
    question: string,
    answers: { text: string; position: string }[] | string[],
    kind: KnownPollKind | string = PRAXIS_PROPOSAL_KIND.name,
    maxSelections = 1,
  ): ProposalStartEvent {
    const processedAnswers = answers.map((a) => ({
      id: this.getAnswerId(),
      [M_TEXT.name]: typeof a === 'string' ? a : a.text,
      position: typeof a === 'string' ? undefined : a.position,
    }));

    return new ProposalStartEvent({
      type: M_POLL_START.name,
      content: {
        [M_TEXT.name]: question,
        [M_POLL_START.name]: {
          question: { [M_TEXT.name]: question },
          kind: kind instanceof NamespacedValue ? kind.name : kind,
          max_selections: maxSelections,
          answers: processedAnswers,
        },
      },
    });
  }

  private static getAnswerId = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return [...Array(16)]
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  };
}
