import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useIsMobile } from '@/hooks/use-mobile';
import { MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { Message } from '../messages/message';
import { MessageForm } from '../messages/message-form';
import { LeftNav } from '../nav/left-nav';
import { RoomTopNav } from './room-top-nav';

interface Props {
  room: Room;
}

export const RoomView = (props: Props) => {
  const roomEvents = props.room.getLiveTimeline().getEvents();
  const [messages, setMessages] = useState<MatrixEvent[]>(
    roomEvents.filter((e) => e.getType() === 'm.room.message'),
  );

  const matrixClient = useMatrixClient();
  const isMobile = useIsMobile();

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
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {!isMobile && <LeftNav />}

      <div className="flex flex-1 flex-col">
        <RoomTopNav room={props.room} />

        <div className="flex flex-1 flex-col p-2">
          {messages.map((message) => (
            <Message key={message.getId()} message={message} />
          ))}
        </div>

        <MessageForm roomId={props.room.roomId} />
      </div>
    </div>
  );
};
