import { useIsMobile } from '@/hooks/use-mobile';
import { NavDrawer } from '../nav/nav-drawer';

export function RoomTopNav() {
  const isMobile = useIsMobile();

  return (
    <header className="flex h-[55px] items-center justify-between border-b border-[--color-border] bg-(--card) px-2.5">
      <div className="flex flex-1 items-center">
        {isMobile && <NavDrawer />}
      </div>
    </header>
  );
}
