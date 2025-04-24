import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button/button';

export function RoomTopNav() {
  return (
    <header className="flex h-[55px] items-center justify-between bg-neutral-800 px-2.5">
      <div className="flex flex-1 items-center">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="size-6" />
        </Button>
      </div>
    </header>
  );
}
