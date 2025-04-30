import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { Button } from '../ui/button/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface Props {
  trigger?: ReactNode;
}

export const NavSheet = ({ trigger }: Props) => {
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const matrixClient = useMatrixClient();

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
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon">
            <LuArrowLeft className="size-[1.45rem]" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="min-w-[100%] border-r-0 bg-(--accent) px-0 pt-4 dark:bg-(--background)"
        hideCloseButton
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 px-6 pb-2 font-medium tracking-[0.02em]">
            <img src={appIconImg} alt={t('brand')} className="size-9" />
            {t('brand')}
            <LuChevronRight className="mt-0.5 ml-0.5 size-4" />
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
