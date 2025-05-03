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
    const deviceId = localStorage.getItem('device_id') ?? undefined;

    const initClient = async () => {
      let client = createClient({
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        accessToken,
        deviceId,
        userId,
      });
      if (!accessToken || !userId) {
        const { access_token, user_id, device_id } =
          await client.registerGuest();

        localStorage.setItem('access_token', access_token!);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('device_id', device_id!);

        client = createClient({
          baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
          accessToken: access_token,
          userId: user_id,
          deviceId: device_id,
        });
      }

      const isGuest = localStorage.getItem('device_id') === 'guest_device';
      if (isGuest) {
        // Join public rooms if the user is a guest
        const { chunk } = await client.publicRooms();
        if (chunk.length) {
          // TODO: Figure out why only one room is being returned
          for (const { room_id } of chunk) {
            await client.joinRoom(room_id);
          }
        }
        client.setGuest(true);
      }

      await client.startClient({
        initialSyncLimit: 10,
      });

      // Make client available once it's ready
      client.on(ClientEvent.Sync, (state) => {
        if (state === SyncState.Prepared) {
          setMatrixClient(client);
          setIsLoading(false);
        }
      });
    };

    initClient();
  }, [matrixClient, setMatrixClient]);

  if (isLoading) {
    return <RoomSkeleton />;
  }

  return children;
}
