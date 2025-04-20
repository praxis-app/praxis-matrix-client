import { useEffect } from 'react';
import LoginForm from './components/auth/login-form';
import { useMatrixClient } from './hooks/shared.hooks';

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
    <main className="flex flex-col items-center justify-center p-24">
      {!matrixClient ? (
        <>Loading...</>
      ) : matrixClient.isLoggedIn() ? (
        <>Logged in</>
      ) : (
        <LoginForm />
      )}
    </main>
  );
};

export default App;
