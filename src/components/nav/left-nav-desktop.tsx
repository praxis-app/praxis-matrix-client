import { NavigationPaths } from '@/constants/shared.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdAddCircle,
  MdExitToApp,
  MdExpandMore,
  MdSettings,
} from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import appIconImg from '../../assets/images/app-icon.png';
import LogOutDialogContent from '../auth/log-out-dialog-content';
import { RoomForm, RoomFormSubmitButton } from '../rooms/room-form';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserAvatar } from '../users/user-avatar';

export const LeftNavDesktop = () => {
  const { setMatrixClient } = useAppStore();
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const [showRoomFormDialog, setShowRoomFormDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const matrixClient = useMatrixClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { roomId } = useParams();
  const activeRoomId = roomId ?? visibleRooms[0]?.roomId;

  const userId = matrixClient.getUserId();
  const user = matrixClient.getUser(userId ?? '');
  const displayName = user?.displayName ?? userId ?? '';
  const isOnline = user?.presence === 'online';

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

  const handleLogout = async () => {
    await matrixClient.logout();
    localStorage.clear();
    setMatrixClient(null);
    setShowLogoutDialog(false);
    navigate(NavigationPaths.Home);
  };

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-[--color-border] bg-(--card)">
      <Dialog open={showRoomFormDialog} onOpenChange={setShowRoomFormDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 flex h-[55px] w-full cursor-pointer justify-between border-b border-[--color-border] pr-3 pl-4 select-none focus:outline-none">
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

      <div className="flex flex-1 flex-col overflow-y-scroll py-2 select-none">
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

      <div className="flex h-[60px] items-center justify-between border-t border-[--color-border] px-1.5">
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 mr-1 flex h-11.5 w-full cursor-pointer items-center justify-start gap-2 rounded-[4px] px-2 text-left select-none focus:outline-none">
              <UserAvatar
                className="size-8"
                fallbackClassName="text-sm"
                name={displayName}
                userId={userId}
                isOnline={isOnline}
                showOnlineStatus
              />
              <div className="flex flex-col pt-[0.16rem]">
                <div className="text-[0.81rem]/tight">{displayName}</div>
                <div className="text-muted-foreground text-[0.7rem]/[0.9rem] font-light">
                  {isOnline
                    ? t('users.presence.online')
                    : t('users.presence.offline')}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-52"
              align="start"
              alignOffset={10}
              side="top"
              sideOffset={18}
            >
              <DropdownMenuItem
                className="text-md"
                onClick={() => toast(t('prompts.inDev'))}
              >
                <UserAvatar
                  name={displayName}
                  userId={userId}
                  className="size-5"
                  fallbackClassName="text-[0.65rem]"
                  isOnline={isOnline}
                />
                {displayName}
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-md">
                  <MdExitToApp className="text-foreground size-5" />
                  {t('auth.actions.logOut')}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <LogOutDialogContent
            setShowLogoutDialog={setShowLogoutDialog}
            handleLogout={handleLogout}
          />
        </Dialog>

        <Button
          onClick={() => toast(t('prompts.inDev'))}
          variant="ghost"
          size="icon"
        >
          <MdSettings className="text-muted-foreground size-6" />
        </Button>
      </div>
    </div>
  );
};
