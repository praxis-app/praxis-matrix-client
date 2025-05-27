import { NavigationPaths } from '@/constants/shared.constants';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

interface Props {
  trigger: ReactNode;
  room: Room;
}

export const LeaveRoomDialog = ({ trigger, room }: Props) => {
  const [showLeaveRoomDialog, setShowLeaveRoomDialog] = useState(false);

  const { t } = useTranslation();
  const matrixClient = useMatrixClient();
  const navigate = useNavigate();

  const handleLeaveRoom = async () => {
    await matrixClient.leave(room.roomId);
    matrixClient.store.removeRoom(room.roomId);
    setShowLeaveRoomDialog(false);
    navigate(NavigationPaths.Home);
  };

  return (
    <Dialog open={showLeaveRoomDialog} onOpenChange={setShowLeaveRoomDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader className="pb-0.5">
          <DialogTitle className="text-center">
            {t('rooms.headers.leaveRoom')}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="pb-2">
          {t('rooms.prompts.leaveRoom')}
        </DialogDescription>

        <DialogFooter className="flex w-full flex-row gap-2 self-center">
          <Button
            variant="outline"
            onClick={() => setShowLeaveRoomDialog(false)}
            className="flex-1"
          >
            {t('actions.cancel')}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleLeaveRoom}
          >
            {t('rooms.actions.leave')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
