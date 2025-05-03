import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircle } from 'react-icons/md';
import { RoomFormDialog } from '../rooms/room-form-dialog';
import { Button } from '../ui/button/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

interface Props {
  trigger: ReactNode;
}

export const NavDrawer = ({ trigger }: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="flex min-h-[calc(100vh-68px)] flex-col items-start rounded-t-2xl border-0">
        {/* TODO: Determine how to handle header requirements */}
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4">
          <RoomFormDialog
            trigger={
              <Button
                variant="ghost"
                className="text-md flex items-center gap-6 font-normal"
              >
                <MdAddCircle className="size-6" />
                {t('rooms.actions.create')}
              </Button>
            }
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
