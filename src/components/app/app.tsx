// TODO: Add remaining layout and functionality - below is a WIP

import { useEffect } from 'react';
import Layout from './layout';
import LoginForm from '../auth/login-form';
import { useMatrixClient } from '../../hooks/shared.hooks';

const App = () => {
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (matrixClient) {
      const init = async () => {
        const { total_room_count_estimate } = await matrixClient.publicRooms();
        console.log('Public room count:', total_room_count_estimate);
      };
      init();
    }
  }, [matrixClient]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-24">
        {!matrixClient ? (
          <>Loading...</>
        ) : matrixClient.isLoggedIn() ? (
          <>Logged in</>
        ) : (
          <LoginForm />
        )}
      </div>
    </Layout>
  );
};

export default App;
