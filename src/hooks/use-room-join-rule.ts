import { getRoomState } from '@/lib/room.utilts';
import { JoinRule, Room, RoomStateEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

interface UseRoomJoinRuleOptions {
  onSuccess?: (joinRule: JoinRule) => void;
}

export function useRoomJoinRule(
  room: Room,
  { onSuccess }: UseRoomJoinRuleOptions = {},
) {
  const [roomJoinRule, setRoomJoinRule] = useState(room?.getJoinRule());
  const roomState = getRoomState(room);

  useEventEmitter(roomState, RoomStateEvent.Events, () => {
    setRoomJoinRule(room.getJoinRule());
    onSuccess?.(room.getJoinRule());
  });

  useEffect(() => {
    setRoomJoinRule(room.getJoinRule());
  }, [room]);

  return roomJoinRule;
}
