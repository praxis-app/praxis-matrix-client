import { useIsMobile } from '@/hooks/use-mobile';
import { Room } from 'matrix-js-sdk';
import { LeftNav } from '../nav/left-nav';
import { RoomTopNav } from './room-top-nav';

interface Props {
  room: Room;
}

export const RoomView = ({ room }: Props) => {
  const isMobile = useIsMobile();

  const allEvents = room?.getLiveTimeline().getEvents() || [];
  const messages = allEvents.filter(
    (evt) => evt.getType() === 'm.room.message',
  );

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {!isMobile && <LeftNav />}

      <div className="flex flex-1 flex-col">
        <RoomTopNav room={room} />

        <div className="flex flex-1 flex-col">
          {messages.map((message) => (
            <div key={message.getId()}>
              {JSON.stringify(message.getContent())}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
