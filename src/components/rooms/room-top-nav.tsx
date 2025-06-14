import { useIsMobile } from '@/hooks/use-mobile';
import { useRoomName } from '@/hooks/use-room-name';
import { Room } from 'matrix-js-sdk';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import { MdChevronRight, MdSearch } from 'react-icons/md';
import { toast } from 'sonner';
import { NavSheet } from '../nav/nav-sheet';
import { Button } from '../ui/button';
import { RoomDetailsDrawer } from './room-details-drawer';

interface Props {
  room: Room;
}

export const RoomTopNav = ({ room }: Props) => {
  const [navSheetOpen, setNavSheetOpen] = useState(false);
  const roomName = useRoomName(room);

  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <header className="flex h-[55px] items-center justify-between border-b border-[--color-border] px-2 md:pl-6">
      <div className="mr-1 flex flex-1 items-center gap-2.5">
        {isMobile && (
          <NavSheet
            trigger={
              <Button variant="ghost" size="icon">
                <LuArrowLeft className="size-6" />
              </Button>
            }
            open={navSheetOpen}
            setOpen={setNavSheetOpen}
          />
        )}

        <RoomDetailsDrawer
          room={room}
          trigger={
            <div className="flex flex-1 items-center text-[15px] font-medium select-none">
              {roomName}
              {isMobile && (
                <MdChevronRight className="text-muted-foreground mt-[0.07rem] size-5" />
              )}
            </div>
          }
        />
      </div>

      <Button
        onClick={() => toast(t('prompts.inDev'))}
        variant="ghost"
        size="icon"
      >
        <MdSearch className="size-6" />
      </Button>
    </header>
  );
};
