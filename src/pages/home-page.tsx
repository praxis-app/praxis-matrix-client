import RoomForm from '@/components/rooms/room-form';
import Button from '@/components/ui/button/button';
import { useState } from 'react';

const HomePage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4">
      <RoomForm
        trigger={<Button variant="outline">Create Room</Button>}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default HomePage;
