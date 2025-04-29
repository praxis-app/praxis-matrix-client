import { MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { Message } from '../messages/message';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMatrixClient } from '@/hooks/use-matrix-client';

interface Props {
  room: Room;
}

export const RoomFeed = (props: Props) => {
  const roomEvents = props.room.getLiveTimeline().getEvents();
  const [messages, setMessages] = useState<MatrixEvent[]>(
    roomEvents.filter((e) => e.getType() === 'm.room.message'),
  );

  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!matrixClient) {
      return;
    }

    matrixClient.on(RoomEvent.Timeline, (event, room, toStart) => {
      if (
        event.getType() !== 'm.room.message' ||
        props.room.roomId !== room?.roomId ||
        toStart
      ) {
        return;
      }
      setMessages((prev) => {
        const filtered = prev.filter((e) => e.getId() !== event.getId());
        return [...filtered, event];
      });
    });
  }, [matrixClient, props.room]);

  return (
    <div className="flex flex-1 flex-col p-2.5">
      {messages.map((message) => (
        <Message key={message.getId()} message={message} room={props.room} />
      ))}
    </div>
  );
};
