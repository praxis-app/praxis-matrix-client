import { useMatrixClient } from '@/hooks/use-matrix-client';
import { cn } from '@/lib/utils';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircle, MdExpandMore } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { RoomForm, RoomFormSubmitButton } from '../rooms/room-form';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const LeftNavDesktop = () => {
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const [showRoomFormDialog, setShowRoomFormDialog] = useState(false);
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
      <Dialog open={showRoomFormDialog} onOpenChange={setShowRoomFormDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 flex h-[55px] w-full cursor-pointer justify-between border-b border-[--color-border] pr-3 pl-4 focus:outline-none">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="w-52">
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-md">
                <MdAddCircle className="text-foreground size-5" />
                {t('rooms.actions.create')}
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rooms.prompts.createRoom')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {t('rooms.prompts.startConversation')}
          </DialogDescription>
          <RoomForm
            submitButton={(props) => (
              <DialogFooter>
                <RoomFormSubmitButton {...props} />
              </DialogFooter>
            )}
            onSubmit={() => setShowRoomFormDialog(false)}
          />
        </DialogContent>
      </Dialog>

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
