import { RoomView } from '@/components/rooms/room-view';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';

export const HomePage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!matrixClient) {
      return;
    }
    const getRoom = async () => {
      const isGuest = matrixClient.isGuest();

      if (isGuest) {
        const { chunk } = await matrixClient.publicRooms();
        if (!chunk.length) {
          return null;
        }

        const roomId = chunk[0].room_id;
        await matrixClient.joinRoom(roomId);
        const room = matrixClient.getRoom(roomId);
        return room;
      }

      const rooms = matrixClient.getVisibleRooms();
      if (!rooms.length) {
        return null;
      }
      return rooms[0];
    };
    const init = async () => {
      const room = await getRoom();
      if (!room) {
        return;
      }
      setRoom(room);
    };
    init();
  }, [matrixClient]);

  if (!room) {
    return null;
  }

  return <RoomView room={room} />;
};
