import { ReactNode, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { MdClose } from 'react-icons/md';
import { Separator } from '../ui/separator';

interface Props {
  trigger: ReactNode;
}

const RoomSettingsSheet = ({ trigger }: Props) => {
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

          <Button variant="ghost">{t('actions.save')}</Button>
        </div>

        <Separator />
      </SheetContent>
    </Sheet>
  );
};

export default RoomSettingsSheet;
