import { useIsMobile } from '@/hooks/use-mobile';
import { EventTimeline, Room } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import { MdChevronRight, MdSearch, MdSettings } from 'react-icons/md';
import { toast } from 'sonner';
import { NavSheet } from '../nav/nav-sheet';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Separator } from '../ui/separator';
import RoomSettingsSheet from './room-settings-sheet';

interface Props {
  room: Room;
}

export const RoomTopNav = ({ room }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const topicEvent = roomState?.getStateEvents('m.room.topic', '');
  const topic = topicEvent ? topicEvent.getContent().topic : null;

  return (
    <header className="bg-card flex h-[55px] items-center justify-between border-b border-[--color-border] px-2 md:pl-6">
      <div className="mr-1 flex flex-1 items-center gap-2.5">
        {isMobile && (
          <NavSheet
            trigger={
              <Button variant="ghost" size="icon">
                <LuArrowLeft className="size-6" />
              </Button>
            }
          />
        )}

        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-1 items-center text-[15px] font-medium">
              {room.name}
              {isMobile && (
                <MdChevronRight className="text-muted-foreground mt-[0.07rem] size-5" />
              )}
            </div>
          </DrawerTrigger>

          <DrawerContent className="flex min-h-[calc(100vh-55px)] flex-col items-start rounded-t-2xl border-0">
            <DrawerHeader className="w-full pt-5 pb-6">
              <DrawerTitle className="text-center text-[1.3rem]">
                {room.name}
              </DrawerTitle>
              <DrawerDescription>{topic}</DrawerDescription>
            </DrawerHeader>

            <Separator />

            <RoomSettingsSheet
              trigger={
                <Button
                  className="text-primary mx-auto mt-6 h-[3.2rem] w-[92%] justify-between"
                  variant="secondary"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <MdSettings className="text-muted-foreground size-6.5" />
                    <div>{t('rooms.labels.settings')}</div>
                  </div>

                  <MdChevronRight className="text-muted-foreground size-5.5" />
                </Button>
              }
            />
          </DrawerContent>
        </Drawer>
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
