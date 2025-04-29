import { timeAgo } from '@/lib/time.utils';
import { MatrixEvent, Room } from 'matrix-js-sdk';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Props {
  message: MatrixEvent;
  room: Room;
}

export const Message = ({ message, room }: Props) => {
  const { body } = message.getContent();

  const userId = message.getSender();
  const member = room?.getMember(userId ?? '');
  const displayName = member?.name ?? userId;
  const avatarFallback = displayName?.[0].toUpperCase();

  const createdAt = message.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-2 pb-2">
      <Avatar>
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <div>
        <div className="flex gap-1">
          <div>{displayName}</div>
          <div>{formattedDate}</div>
        </div>

        <div>{body}</div>
      </div>
    </div>
  );
};
