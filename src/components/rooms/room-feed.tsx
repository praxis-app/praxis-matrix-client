import { useMatrixClient } from '@/hooks/use-matrix-client';
import { EventType, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { AuthMessage } from '../auth/auth-message';
import { Message } from '../messages/message';
import { InlineProposal } from '../proposals/inline-proposal';

const RoomEventItem = ({ event, room }: { event: MatrixEvent; room: Room }) => {
  if (event.getType() === EventType.PollStart) {
    return <InlineProposal proposal={event} room={room} />;
  }
  return <Message message={event} room={room} />;
};

export const RoomFeed = (props: { room: Room }) => {
  const [events, setEvents] = useState<MatrixEvent[]>([]);
  const matrixClient = useMatrixClient();

  const isGuest = matrixClient.isGuest();
  const sortedEvents = events.sort((a, b) => {
    return b.getTs() - a.getTs();
  });

  useEffect(() => {
    const roomEvents = props.room.getLiveTimeline().getEvents();

    // TODO: Remove once no longer needed for testing
    console.log(
      'last event content',
      roomEvents[roomEvents.length - 1].getContent(),
    );

    setEvents(
      roomEvents.filter(
        (e) =>
          e.getType() === EventType.RoomMessage ||
          e.getType() === EventType.PollStart,
      ),
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
      setEvents((prev) => {
        const filtered = prev.filter((e) => e.getId() !== event.getId());
        return [...filtered, event];
      });
    });
  }, [matrixClient, props.room.roomId]);

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-scroll p-2.5 pb-4">
      {isGuest && <AuthMessage />}

      {sortedEvents.map((event) => (
        <RoomEventItem key={event.getId()} event={event} room={props.room} />
      ))}
    </div>
  );
};
