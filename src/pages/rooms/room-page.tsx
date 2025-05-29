import { RoomView } from '@/components/rooms/room-view';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const { roomId } = useParams();
  const room = useMatrixClient().getRoom(roomId);

  if (!room) {
    return null;
  }

  return <RoomView room={room} />;
};
