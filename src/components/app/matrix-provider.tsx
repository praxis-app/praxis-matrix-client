import { useAppStore } from '@/store/app.store';
import { ClientEvent, createClient, SyncState } from 'matrix-js-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { RoomSkeleton } from '../rooms/room-skeleton';

interface Props {
  children: ReactNode;
}

export function MatrixProvider({ children }: Props) {
  const { matrixClient, setMatrixClient } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (matrixClient) {
      return;
    }
    const accessToken = localStorage.getItem('access_token') ?? undefined;
    const userId = localStorage.getItem('user_id') ?? undefined;

    const initClient = async () => {
      const client = createClient({
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        accessToken,
        userId,
      });
      if (!accessToken || !userId) {
        // TODO: Remove once no longer needed for testing
        const test = await client.publicRooms();
        console.log(test);

        setMatrixClient(client);
        setIsLoading(false);
        return;
      }

      await client.startClient({
        initialSyncLimit: 10,
      });

      // Make client available once it's ready
      client.once(ClientEvent.Sync, (state) => {
        if (state === SyncState.Prepared) {
          setMatrixClient(client);
          setIsLoading(false);
        }
      });
    };

    initClient();
  }, [matrixClient]);

  if (isLoading) {
    return <RoomSkeleton />;
  }

  return children;
}
