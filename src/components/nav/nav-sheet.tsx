import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { UserAvatar } from '../users/user-avatar';
import { NavDrawer } from './nav-drawer';
import { NavDropdown } from './nav-dropdown';

interface Props {
  trigger: ReactNode;
}

export const NavSheet = ({ trigger }: Props) => {
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const matrixClient = useMatrixClient();

  const user = matrixClient.getUser(matrixClient.getUserId() ?? '');
  const displayName = user?.displayName ?? user?.userId ?? '';

  useEffect(() => {
    if (!matrixClient) {
      return;
    }
    const init = async () => {
      const rooms = matrixClient.getVisibleRooms();
      setVisibleRooms(rooms);
    };
    init();
  }, [matrixClient]);

  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className="min-w-[100%] border-r-0 bg-(--accent) px-0 pt-4 dark:bg-(--background)"
        hideCloseButton
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center justify-between pr-6">
            <NavDrawer
              trigger={
                <div className="flex cursor-pointer items-center gap-2 self-center px-6 font-medium tracking-[0.02em]">
                  <img
                    src={appIconImg}
                    alt={t('brand')}
                    className="size-9 self-center"
                  />
                  {t('brand')}
                  <LuChevronRight className="mt-0.5 ml-0.5 size-4" />
                </div>
              }
            />
            <NavDropdown
              trigger={
                <UserAvatar
                  name={displayName}
                  className="size-9"
                  fallbackClassName="text-[1.05rem]"
                />
              }
              displayName={displayName}
            />
          </SheetTitle>
          <SheetDescription className="text-left"></SheetDescription>
        </SheetHeader>

        <div className="bg-background h-full w-full rounded-t-2xl p-7 dark:bg-(--accent)">
          {visibleRooms.map((room) => (
            <Link to={`/rooms/${room.roomId}`} key={room.roomId}>
              <div>{room.name}</div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
