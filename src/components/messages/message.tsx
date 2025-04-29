import { timeAgo } from '@/lib/time.utils';
import { MatrixEvent } from 'matrix-js-sdk';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Props {
  message: MatrixEvent;
}

export const Message = ({ message }: Props) => {
  const { body } = message.getContent();

  const { sender } = message;
  const avatarFallback = sender?.name?.[0].toUpperCase();
  const createdAt = message.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  return (
    <div className="flex gap-2 pb-2">
      <Avatar>
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <div>
        <div className="flex gap-1">
          <div>{sender?.name}</div>
          <div>{formattedDate}</div>
        </div>

        <div>{body}</div>
      </div>
    </div>
  );
};
