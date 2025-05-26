import { cn } from '@/lib/utils';
import { Room } from 'matrix-js-sdk';
import { useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface Props {
  activeRoomId: string;
  room: Room;
}

const RoomListItem = ({ activeRoomId, room }: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const isActive = room.roomId === activeRoomId;
  const showSettingsBtn = isHovering || isActive;

  return (
    <Link
      className={cn(
        'text-muted-foreground hover:bg-accent mx-2 mb-0.5 flex items-center justify-between rounded-[4px] px-2.5 py-0.5',
        isActive && 'bg-accent text-foreground',
      )}
      key={room.roomId}
      to={`/rooms/${room.roomId}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mr-1.5 truncate">{room.name}</div>
      {showSettingsBtn && (
        <MdSettings className="hover:text-foreground text-muted-foreground size-4.5" />
      )}
    </Link>
  );
};

export default RoomListItem;
