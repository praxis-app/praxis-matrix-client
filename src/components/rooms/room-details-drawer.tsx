import { EventTimeline, Room } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiDoorOpen } from 'react-icons/bi';
import { MdChevronRight, MdSettings } from 'react-icons/md';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
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
  trigger: ReactNode;
}

export const RoomDetailsDrawer = ({ room, trigger }: Props) => {
  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);
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

        <Dialog
          open={showLeaveRoomDialog}
          onOpenChange={setShowLeaveRoomDialog}
        >
          <DialogTrigger asChild>
            <Button
              className="text-destructive mx-auto mt-6 h-[3.2rem] w-[92%] justify-start gap-3"
              variant="secondary"
              size="lg"
            >
              <BiDoorOpen className="size-6.5" />
              {t('rooms.actions.leaveRoom')}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader className="pb-0.5">
              <DialogTitle className="text-center">
                {t('rooms.headers.leaveRoom')}
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="pb-2">
              {t('rooms.prompts.leaveRoom')}
            </DialogDescription>

            <DialogFooter className="flex w-full flex-row gap-2 self-center">
              <Button
                variant="outline"
                onClick={() => setShowLeaveRoomDialog(false)}
                className="flex-1"
              >
                {t('actions.cancel')}
              </Button>
              <Button variant="destructive" className="flex-1">
                {t('rooms.actions.leave')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DrawerContent>
    </Drawer>
  );
};
