import { useMatrixClient } from '@/hooks/use-matrix-client';
import { cn } from '@/lib/utils';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExpandMore } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { Button } from '../ui/button/button';

export const LeftNavDesktop = () => {
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const { roomId } = useParams();
  const activeRoomId = roomId ?? visibleRooms[0]?.roomId;

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

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-[--color-border] bg-(--card)">
      <Button
        variant="ghost"
        className="flex h-[55px] justify-between rounded-none border-b border-[--color-border] has-[>svg]:pl-3.5"
      >
        <div className="flex items-center gap-2">
          <img
            src={appIconImg}
            alt={t('brand')}
            className="size-[1.55rem] self-center"
          />
          <div className="self-center text-base/tight font-medium tracking-[0.02em]">
            {t('brand')}
          </div>
        </div>

        <MdExpandMore className="size-[1.4rem] self-center" />
      </Button>
      <div className="flex flex-1 flex-col overflow-y-scroll py-2">
        {visibleRooms.map((room) => (
          <Link
            className={cn(
              'text-muted-foreground hover:bg-accent mx-2 mb-0.5 rounded-[4px] px-2.5 py-0.5',
              room.roomId === activeRoomId && 'bg-accent text-foreground',
            )}
            key={room.roomId}
            to={`/rooms/${room.roomId}`}
          >
            <div>{room.name}</div>
          </Link>
        ))}
      </div>
      <div className="h-[55px] border-t border-[--color-border]"></div>
    </div>
  );
};
