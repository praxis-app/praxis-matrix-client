import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

const getRoomName = (room?: Room): string => room?.name || '';

export function useRoomName(room?: Room): string {
  const [name, setName] = useState(getRoomName(room));

  useEventEmitter(room, RoomEvent.Name, () => {
    setName(getRoomName(room));
  });

  useEffect(() => {
    setName(getRoomName(room));
  }, [room]);

  return name;
}
