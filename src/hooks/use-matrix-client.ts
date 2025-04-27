import { MatrixClient, RoomEvent } from 'matrix-js-sdk';
import { createContext, useContext, useEffect } from 'react';

export const MatrixClientContext = createContext<MatrixClient | null>(null);

export const useMatrixClient = (): MatrixClient => {
  const client = useContext(MatrixClientContext);
  if (!client) {
    throw new Error('useMatrixClient must be inside MatrixProvider');
  }

  useEffect(() => {
    if (!client) {
      return;
    }

    client.on(RoomEvent.Timeline, (event) => {
      if (event.getType() !== 'm.room.message') {
        return;
      }
      console.log('💥💥💥', event.event.content?.body);
    });
  }, [client]);

  return client;
};
