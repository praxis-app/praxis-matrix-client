import { timeAgo } from '@/lib/time.utils';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { MatrixEvent, Room } from 'matrix-js-sdk';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Props {
  message: MatrixEvent;
  room: Room;
}

export const Message = ({ message, room }: Props) => {
  const { body } = message.getContent();

  const userId = message.getSender() ?? '';
  const member = room?.getMember(userId);
  const displayName = member?.name ?? userId;
  const avatarFallback = displayName?.[0].toUpperCase();

  const createdAt = message.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  if (!body) {
    return null;
  }

  const getStringAvatarProps = () => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(userId);
    const color = chroma(baseColor).darken(1.3).hex();
    const backgroundColor = chroma(baseColor).brighten(1.2).hex();

    return {
      style: { color, backgroundColor },
    };
  };

  return (
    <div className="flex gap-4 pt-4">
      <Avatar>
        <AvatarFallback
          className="text-lg font-medium"
          {...getStringAvatarProps()}
        >
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div>
        <div className="flex gap-1.5">
          <div className="font-medium">{displayName}</div>
          <div className="text-muted-foreground mt-[1px] text-sm">
            {formattedDate}
          </div>
        </div>

        <div>{body}</div>
      </div>
    </div>
  );
};
