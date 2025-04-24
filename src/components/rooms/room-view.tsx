import { useIsMobile } from '@/hooks/use-mobile';
import { RoomTopNav } from './room-top-nav';
import { LeftNav } from '../nav/left-nav';

export const RoomView = () => {
  const isMobile = useIsMobile();
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {!isMobile && <LeftNav />}

      <div className="flex flex-1 flex-col">
        <RoomTopNav />
      </div>
    </div>
  );
};
