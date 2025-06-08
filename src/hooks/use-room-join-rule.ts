import { Room, JoinRule } from 'matrix-js-sdk';
import { useRoomState } from './use-room-state';

interface UseRoomJoinRuleOptions {
  onSuccess?: (joinRule: JoinRule) => void;
}

export function useRoomJoinRule(
  room: Room,
  { onSuccess }: UseRoomJoinRuleOptions = {},
) {
  return useRoomState(room, {
    getValue: (room) => room.getJoinRule(),
    onUpdate: onSuccess,
  });
}
