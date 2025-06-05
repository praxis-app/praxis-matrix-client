import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

const EMPTY_ROOM_NAME = 'Empty room';

const getRoomName = (room?: Room) => room?.name || '';

interface UseRoomNameProps {
  room?: Room;
  onSuccess?: (name: string) => void;
}

export function useRoomName({ room, onSuccess }: UseRoomNameProps) {
  const [roomName, setRoomName] = useState(getRoomName(room));

  useEventEmitter(room, RoomEvent.Name, () => {
    setRoomName(getRoomName(room));
    onSuccess?.(getRoomName(room));
  });

  useEffect(() => {
    setRoomName(getRoomName(room));
  }, [room]);

  if (roomName === EMPTY_ROOM_NAME) {
    return '';
  }

  return roomName;
}
