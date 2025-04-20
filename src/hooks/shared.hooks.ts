import { createClient, type MatrixClient } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';

export const useMatrixClient = () => {
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
      setMatrixClient(client);
    };

    initClient();
  }, []);

  return matrixClient;
};
