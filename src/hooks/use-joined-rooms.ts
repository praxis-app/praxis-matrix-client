import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';

export const useJoinedRooms = () => {
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const matrixClient = useMatrixClient();

  const visibleRooms = matrixClient.getVisibleRooms();

  useEffect(() => {
    const syncRooms = async () => {
      const { joined_rooms } = await matrixClient.getJoinedRooms();
      const filteredRooms = visibleRooms.filter((room) =>
        joined_rooms.includes(room.roomId),
      );
      setJoinedRooms(filteredRooms);
    };
    syncRooms();
  }, [matrixClient, visibleRooms.length]);

  return joinedRooms;
};
