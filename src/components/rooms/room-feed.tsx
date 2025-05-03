import { useMatrixClient } from '@/hooks/use-matrix-client';
import { MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { Message } from '../messages/message';
import { AuthMessage } from '../auth/auth-message';

interface Props {
  room: Room;
}

export const RoomFeed = (props: Props) => {
  const roomEvents = props.room.getLiveTimeline().getEvents();
  const [messages, setMessages] = useState<MatrixEvent[]>(
    roomEvents.filter((e) => e.getType() === 'm.room.message'),
  );

  const sortedMessages = messages.sort((a, b) => {
    return b.getTs() - a.getTs();
  });

  const matrixClient = useMatrixClient();
  const isGuest = matrixClient.isGuest();

  useEffect(() => {
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
    <div className="flex flex-1 flex-col-reverse overflow-y-scroll p-2.5 pb-4">
      {isGuest && <AuthMessage />}

      {sortedMessages.map((message) => (
        <Message key={message.getId()} message={message} room={props.room} />
      ))}
    </div>
  );
};
