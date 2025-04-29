import { MatrixClient } from 'matrix-js-sdk';
import { createContext, useContext } from 'react';

export const MatrixClientContext = createContext<MatrixClient | null>(null);

export const useMatrixClient = () => {
  const client = useContext(MatrixClientContext);
  if (!client) {
    throw new Error('useMatrixClient must be inside MatrixProvider');
  }
  return client;
};
