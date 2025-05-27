import { EventTimeline, Room } from 'matrix-js-sdk';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BiDoorOpen } from 'react-icons/bi';
import { MdChevronRight, MdSettings } from 'react-icons/md';
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
import { LeaveRoomDialog } from './leave-room-dialog';
import RoomSettingsSheet from './room-settings-sheet';

interface Props {
  room: Room;
  trigger: ReactNode;
}

export const RoomDetailsDrawer = ({ room, trigger }: Props) => {
  const { t } = useTranslation();

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const topicEvent = roomState?.getStateEvents('m.room.topic', '');
  const topic = topicEvent ? topicEvent.getContent().topic : null;

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

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
          room={room}
        />

        <LeaveRoomDialog
          trigger={
            <Button
              className="text-destructive mx-auto mt-6 h-[3.2rem] w-[92%] justify-start gap-3"
              variant="secondary"
              size="lg"
            >
              <BiDoorOpen className="size-6.5" />
              {t('rooms.actions.leaveRoom')}
            </Button>
          }
          room={room}
        />
      </DrawerContent>
    </Drawer>
  );
};
