import { useMatrixClient } from '@/hooks/use-matrix-client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect } from 'react';
import { MessageForm } from '../messages/message-form';
import { LeftNav } from '../nav/left-nav';
import { RoomTopNav } from './room-top-nav';

interface Props {
  room: Room;
}

export const RoomView = ({ room }: Props) => {
  const matrixClient = useMatrixClient();
  const isMobile = useIsMobile();

  const messages = room
    .getLiveTimeline()
    .getEvents()
    .filter((e) => e.getType() === 'm.room.message');

  useEffect(() => {
    if (!matrixClient) {
      return;
    }

    matrixClient.on(RoomEvent.Timeline, (event) => {
      if (event.getType() !== 'm.room.message') {
        return;
      }
      console.log('💥💥💥', event.event.content?.body);
    });
  }, [matrixClient]);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {!isMobile && <LeftNav />}

      <div className="flex flex-1 flex-col">
        <RoomTopNav room={room} />

        <div className="flex flex-1 flex-col">
          {messages.map((message) => (
            <div key={message.getId()}>{message.getContent().body}</div>
          ))}
        </div>

        <MessageForm roomId={room.roomId} />
      </div>
    </div>
  );
};
