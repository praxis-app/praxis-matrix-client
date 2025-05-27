import { TopNav } from '@/components/nav/top-nav';
import { RoomSettingsForm } from '@/components/rooms/room-settings-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

export const RoomSettings = () => {
  const [room, setRoom] = useState<Room>();

  const matrixClient = useMatrixClient();
  const { t } = useTranslation();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId || !matrixClient) {
      return;
    }
    const init = async () => {
      const room = matrixClient.getRoom(roomId);
      if (room) {
        setRoom(room);
      }
    };
    init();
  }, [roomId, matrixClient]);

  if (!room) {
    return null;
  }

  return (
    <>
      <TopNav
        backBtnIcon={<MdClose className="size-6" />}
        header={t('rooms.labels.settings')}
      />

      <div className="flex h-full flex-col items-center justify-center p-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="hidden space-y-1">
            <CardTitle className="text-xl font-bold">
              {t('rooms.labels.settings')}
            </CardTitle>
            <CardDescription>
              {t('rooms.descriptions.roomSettings')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RoomSettingsForm room={room} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
