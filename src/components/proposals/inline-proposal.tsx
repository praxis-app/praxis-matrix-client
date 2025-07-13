import { timeAgo } from '@/lib/time.utils';
import { M_TEXT, MatrixEvent, Room } from 'matrix-js-sdk';
import FormattedText from '../shared/formatted-text';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  proposal: MatrixEvent;
  room: Room;
}

export const InlineProposal = ({ proposal, room }: Props) => {
  const { [M_TEXT.name]: body } = proposal.getContent();

  const userId = proposal.getSender() ?? '';
  const member = room?.getMember(userId);
  const name = member?.name ?? userId;

  const createdAt = proposal.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar name={name} userId={userId} className="mt-0.5" />

      <div>
        <div className="flex items-center gap-1.5">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <FormattedText text={body} />
      </div>
    </div>
  );
};
