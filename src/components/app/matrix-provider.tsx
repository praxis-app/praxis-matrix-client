import { MatrixClientContext } from '@/hooks/use-matrix-client';
import {
  ClientEvent,
  createClient,
  MatrixClient,
  SyncState,
} from 'matrix-js-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { RoomSkeleton } from '../rooms/room-skeleton';

interface Props {
  children: ReactNode;
}

export function MatrixProvider({ children }: Props) {
  const [matrixClient, setMatrixClient] = useState<MatrixClient | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (matrixClient || !accessToken || !userId) {
      return;
    }

    const initClient = async () => {
      const client = createClient({
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        accessToken,
        userId,
      });
      await client.startClient({
        initialSyncLimit: 10,
      });

      // Make client available once it's ready
      client.once(ClientEvent.Sync, (state) => {
        if (state === SyncState.Prepared) {
          setMatrixClient(client);
        }
      });
    };

    initClient();
  }, [matrixClient]);

  if (!matrixClient) {
    return <RoomSkeleton />;
  }

  return (
    <MatrixClientContext.Provider value={matrixClient}>
      {children}
    </MatrixClientContext.Provider>
  );
}
