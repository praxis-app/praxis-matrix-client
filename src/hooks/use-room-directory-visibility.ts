import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';
import { Visibility } from 'matrix-js-sdk';

interface UseRoomDirectoryVisibilityProps {
  roomId: string;
  onSuccess?(visibility: Visibility | undefined): void;
}

// TODO: Decide whether this is needed
export const useRoomDirectoryVisibility = ({
  roomId,
  onSuccess,
}: UseRoomDirectoryVisibilityProps) => {
  const [visibility, setVisibility] = useState<Visibility>();
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!roomId || visibility) {
      return;
    }

    const init = async () => {
      const { visibility } =
        await matrixClient.getRoomDirectoryVisibility(roomId);
      setVisibility(visibility);
      onSuccess?.(visibility);
    };
    init();
  }, [roomId, matrixClient, onSuccess]);

  return visibility;
};
