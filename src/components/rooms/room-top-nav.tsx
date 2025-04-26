import { useIsMobile } from '@/hooks/use-mobile';
import { Room } from 'matrix-js-sdk';
import { NavDrawer } from '../nav/nav-drawer';

interface Props {
  room: Room;
}

export function RoomTopNav({ room }: Props) {
  const isMobile = useIsMobile();

  return (
    <header className="flex h-[55px] items-center justify-between border-b border-[--color-border] bg-(--card) px-2.5">
      <div className="flex flex-1 items-center">
        {isMobile && <NavDrawer />}
        <div className="flex flex-1 items-center">{room.name}</div>
      </div>
    </header>
  );
}
