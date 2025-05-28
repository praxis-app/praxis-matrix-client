import { cn } from '@/lib/utils';
import { Room } from 'matrix-js-sdk';
import { useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { ContextMenuContent, ContextMenuItem } from '../ui/context-menu';
import { ContextMenu, ContextMenuTrigger } from '../ui/context-menu';
import { useTranslation } from 'react-i18next';

interface Props {
  activeRoomId: string;
  room: Room;
}

const RoomListItem = ({ activeRoomId, room }: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const isActive = room.roomId === activeRoomId;
  const showSettingsBtn = isHovering || isActive;

  const roomPath = `/rooms/${room.roomId}`;
  const settingsPath = `${roomPath}/settings`;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            'text-muted-foreground hover:bg-accent mx-2 mb-0.5 flex items-center justify-between rounded-[4px] px-2.5 py-0.5',
            isActive && 'bg-accent text-foreground',
          )}
          key={room.roomId}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Link to={roomPath} className="mr-1.5 truncate">
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
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RoomListItem;
