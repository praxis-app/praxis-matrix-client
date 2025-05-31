import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';

const getLastEventTs = (room: Room) => {
  const events = room.getLiveTimeline().getEvents();
  return events[events.length - 1].getTs();
};

const sortRoomsByLastEventTs = (rooms: Room[]) =>
  rooms.sort((a, b) => {
    return getLastEventTs(b) - getLastEventTs(a);
  });

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
      const sortedRooms = sortRoomsByLastEventTs(filteredRooms);
      setJoinedRooms(sortedRooms);
    };
    syncRooms();
  }, [matrixClient, visibleRooms.length]);

  return joinedRooms;
};
