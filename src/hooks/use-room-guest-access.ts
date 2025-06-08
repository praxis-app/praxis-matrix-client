import { Room, GuestAccess } from 'matrix-js-sdk';
import { useRoomState } from './use-room-state';

interface UseRoomGuestAccessOptions {
  onSuccess?: (guestAccess: GuestAccess) => void;
}

export function useRoomGuestAccess(
  room: Room,
  { onSuccess }: UseRoomGuestAccessOptions = {},
) {
  return useRoomState(room, {
    getValue: (room) => room.getGuestAccess(),
    onUpdate: onSuccess,
  });
}
