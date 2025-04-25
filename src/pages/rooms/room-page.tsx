import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const { roomId } = useParams();

  return <div>{roomId}</div>;
};
