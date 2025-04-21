import { getRoomState } from '@/lib/room.utilts';
import { GuestAccess, Room, RoomStateEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

interface UseRoomGuestAccessOptions {
  onSuccess?: (guestAccess: GuestAccess) => void;
}

export function useRoomGuestAccess(
  room: Room,
  { onSuccess }: UseRoomGuestAccessOptions = {},
) {
  const [roomGuestAccess, setRoomGuestAccess] = useState(
    room?.getGuestAccess(),
  );
  const roomState = getRoomState(room);

  useEventEmitter(roomState, RoomStateEvent.Events, () => {
    if (room) {
      setRoomGuestAccess(room.getGuestAccess());
      onSuccess?.(room.getGuestAccess());
    }
  });

  useEffect(() => {
    if (room) {
      setRoomGuestAccess(room.getGuestAccess());
    }
  }, [room]);

  return roomGuestAccess;
}
