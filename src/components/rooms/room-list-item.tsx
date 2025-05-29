import { cn } from '@/lib/utils';
import { Room } from 'matrix-js-sdk';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSettings } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { LeaveRoomDialogContent } from './leave-room-dialog-content';

interface Props {
  activeRoomId: string;
  room: Room;
}

const RoomListItem = ({ activeRoomId, room }: Props) => {
  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const isActive = room.roomId === activeRoomId;
  const showSettingsBtn = isHovering || isActive;

  const roomPath = `/rooms/${room.roomId}`;
  const settingsPath = `${roomPath}/settings`;

  return (
    <Dialog open={showLeaveRoomDialog} onOpenChange={setShowLeaveRoomDialog}>
      <ContextMenu modal={false}>
        <ContextMenuTrigger>
          <div
            className={cn(
              'text-muted-foreground hover:bg-accent mx-2 mb-0.5 flex items-center justify-between rounded-[4px] pr-2.5',
              isActive && 'bg-accent text-foreground',
            )}
            key={room.roomId}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Link
              to={roomPath}
              className="mr-1.5 flex-1 truncate py-0.5 pl-2.5"
            >
              {room.name}
            </Link>
            {showSettingsBtn && (
              <Link to={settingsPath}>
                <MdSettings
                  className={cn(
                    'hover:text-foreground text-muted-foreground size-4.5',
                    isActive && 'text-foreground',
                  )}
                />
              </Link>
            )}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => navigate(settingsPath)}>
            {t('rooms.labels.settings')}
          </ContextMenuItem>

          <DialogTrigger asChild>
            <ContextMenuItem className="text-destructive">
              {t('rooms.actions.leaveRoom')}
            </ContextMenuItem>
          </DialogTrigger>
        </ContextMenuContent>
      </ContextMenu>

      <LeaveRoomDialogContent
        setShowLeaveRoomDialog={setShowLeaveRoomDialog}
        room={room}
      />
    </Dialog>
  );
};

export default RoomListItem;
