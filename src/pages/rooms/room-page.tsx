import { RoomSkeleton } from '@/components/rooms/room-skeleton';
import { RoomView } from '@/components/rooms/room-view';
import { useRoomStore } from '@/store/room.store';
import { Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const { waitForRoom } = useRoomStore();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) {
      return;
    }
    const init = async () => {
      const room = await waitForRoom(roomId);
      setRoom(room);
    };
    init();
  }, [roomId, waitForRoom]);

  if (!room) {
    return <RoomSkeleton />;
  }

  return <RoomView room={room} />;
};
