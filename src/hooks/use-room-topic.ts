import { getRoomTopic } from '@/lib/room.utilts';
import { Room } from 'matrix-js-sdk';
import { useRoomState } from './use-room-state';

interface UseRoomTopicOptions {
  onSuccess?: (topic: string) => void;
}

export function useRoomTopic(
  room: Room,
  { onSuccess }: UseRoomTopicOptions = {},
) {
  return useRoomState(room, {
    getValue: getRoomTopic,
    onUpdate: onSuccess,
  });
}
