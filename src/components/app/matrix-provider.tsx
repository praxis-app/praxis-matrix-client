import { MatrixClientContext } from '@/hooks/use-matrix-client';
import {
  ClientEvent,
  createClient,
  MatrixClient,
  SyncState,
} from 'matrix-js-sdk';
import { ReactNode, useEffect, useState } from 'react';

export function MatrixProvider({ children }: { children: ReactNode }) {
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

      // client.on(RoomEvent.Timeline, (event) => {
      //   if (event.getType() !== 'm.room.message') {
      //     return;
      //   }
      //   console.log('💥💥💥', event.event.content?.body);
      // });
    };

    initClient();
  }, [matrixClient]);

  if (!matrixClient) {
    return null;
  }

  return (
    <MatrixClientContext.Provider value={matrixClient}>
      {children}
    </MatrixClientContext.Provider>
  );
}
