import { useIsMobile } from '@/hooks/use-mobile';
import { Room } from 'matrix-js-sdk';
import { LuArrowLeft } from 'react-icons/lu';
import { NavSheet } from '../nav/nav-sheet';
import { Button } from '../ui/button/button';

interface Props {
  room: Room;
}

export const RoomTopNav = ({ room }: Props) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-card flex h-[55px] items-center justify-between border-b border-[--color-border] px-2.5">
      <div className="flex flex-1 items-center">
        {isMobile && (
          <NavSheet
            trigger={
              <Button variant="ghost" size="icon">
                <LuArrowLeft className="size-[1.45rem]" />
              </Button>
            }
          />
        )}
        <div className="flex flex-1 items-center">{room.name}</div>
      </div>
    </header>
  );
};
