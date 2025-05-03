import { RoomSkeleton } from '@/components/rooms/room-skeleton';
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
      const rooms = matrixClient.getVisibleRooms();
      if (!rooms.length) {
        return null;
      }
      return rooms[0];
    };
    const init = async () => {
      const room = await getRoom();
      setRoom(room);
    };
    init();
  }, [matrixClient]);

  if (!room) {
    return <RoomSkeleton />;
  }

  return <RoomView room={room} />;
};
