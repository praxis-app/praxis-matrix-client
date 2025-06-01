import { Room } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { RoomSettingsForm } from './room-settings-form';

interface Props {
  trigger: ReactNode;
  room: Room;
}

const RoomSettingsSheet = ({ trigger, room }: Props) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="mt-14 min-w-[100%] rounded-t-2xl border-0 px-0 pt-3.5"
        hideCloseButton
      >
        <div className="flex justify-between px-2 pb-3.5">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <MdClose className="size-6" />
          </Button>

          <SheetHeader className="self-center">
            <SheetTitle className="text-md mb-0 font-medium">
              {t('rooms.labels.settings')}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          {/* TODO: Make this a submit button */}
          <Button variant="ghost">{t('actions.save')}</Button>
        </div>

        <Separator className="mb-7" />

        <RoomSettingsForm room={room} />
      </SheetContent>
    </Sheet>
  );
};

export default RoomSettingsSheet;
