import { RoomView } from '@/components/rooms/room-view';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const [room, setRoom] = useState<Room>();

  const matrixClient = useMatrixClient();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId && matrixClient) {
      const room = matrixClient.getRoom(roomId);
      if (room) {
        setRoom(room);
      }
    }
  }, [roomId, matrixClient]);

  if (!room) {
    return null;
  }

  return <RoomView room={room} />;
};
