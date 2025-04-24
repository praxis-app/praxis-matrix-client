import { SheetContent } from '../ui/sheet';

import { Menu } from 'lucide-react';
import { Button } from '../ui/button/button';
import { Sheet, SheetTrigger } from '../ui/sheet';

export const NavDrawer = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        Content
      </SheetContent>
    </Sheet>
  );
};
