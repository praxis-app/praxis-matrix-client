import { useMatrixClient } from '@/hooks/use-matrix-client';
import { EventType, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { AuthMessage } from '../auth/auth-message';
import { Message } from '../messages/message';

interface Props {
  room: Room;
}

export const RoomFeed = (props: Props) => {
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  const matrixClient = useMatrixClient();

  const isGuest = matrixClient.isGuest();
  const sortedMessages = messages.sort((a, b) => {
    return b.getTs() - a.getTs();
  });

  useEffect(() => {
    const roomEvents = props.room.getLiveTimeline().getEvents();

    // TODO: Remove once no longer needed for testing
    console.log(
      'last event content',
      roomEvents[roomEvents.length - 1].getContent(),
    );

    setMessages(
      roomEvents.filter((e) => e.getType() === EventType.RoomMessage),
    );
  }, [props.room, props.room.roomId]);

  useEffect(() => {
    matrixClient.on(RoomEvent.Timeline, (event, room, toStart) => {
      if (
        event.getType() !== EventType.RoomMessage ||
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
  }, [matrixClient, props.room.roomId]);

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-scroll p-2.5 pb-4">
      {isGuest && <AuthMessage />}

      {sortedMessages.map((message) => (
        <Message key={message.getId()} message={message} room={props.room} />
      ))}
    </div>
  );
};
