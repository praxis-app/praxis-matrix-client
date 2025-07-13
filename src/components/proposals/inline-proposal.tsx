import { timeAgo } from '@/lib/time.utils';
import { M_POLL_START, MatrixEvent, Room } from 'matrix-js-sdk';
import FormattedText from '../shared/formatted-text';
import { Card } from '../ui/card';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  proposal: MatrixEvent;
  room: Room;
}

export const InlineProposal = ({ proposal, room }: Props) => {
  const { [M_POLL_START.name]: pollStart } = proposal.getContent();
  const { body } = pollStart.question;

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

      <div className="w-full">
        <div className="flex items-center gap-1.5 pb-1">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <Card className="w-full p-3">
          <FormattedText text={body} />
        </Card>
      </div>
    </div>
  );
};
