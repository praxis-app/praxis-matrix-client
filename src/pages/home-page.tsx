import { useState } from 'react';

import { RoomView } from '@/components/rooms/room-view';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { useEffect } from 'react';

const HomePage = () => {
  const [room, setRoom] = useState<Room>();
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!matrixClient) {
      return;
    }
    const init = async () => {
      const rooms = matrixClient.getVisibleRooms();
      setRoom(rooms[0]);
    };
    init();
  }, [matrixClient]);

  if (!room) {
    return null;
  }

  return <RoomView room={room} />;
};

export default HomePage;
