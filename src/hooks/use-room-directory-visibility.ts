import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';
import { Visibility } from 'matrix-js-sdk';

export const useRoomDirectoryVisibility = (roomId: string) => {
  const [visibility, setVisibility] = useState<Visibility>();
  const matrixClient = useMatrixClient();

  useEffect(() => {
    const init = async () => {
      const { visibility } =
        await matrixClient.getRoomDirectoryVisibility(roomId);
      setVisibility(visibility);
    };
    init();
  }, []);

  return visibility;
};
