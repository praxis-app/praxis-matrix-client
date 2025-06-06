import { getRoomState, getRoomTopic } from '@/lib/room.utilts';
import { Room, RoomStateEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

interface UseRoomTopicProps {
  room?: Room;
  onSuccess?: (name: string) => void;
}

export function useRoomTopic({ room, onSuccess }: UseRoomTopicProps) {
  const [roomTopic, setRoomTopic] = useState(getRoomTopic(room));
  const roomState = getRoomState(room);

  useEventEmitter(roomState, RoomStateEvent.Events, () => {
    setRoomTopic(getRoomTopic(room));
    onSuccess?.(getRoomTopic(room));
  });

  useEffect(() => {
    setRoomTopic(getRoomTopic(room));
  }, [room]);

  return roomTopic;
}
