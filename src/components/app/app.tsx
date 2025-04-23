// TODO: Add remaining layout and functionality - below is a WIP

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatrixClient } from '../../hooks/shared.hooks';
import LoginForm from '../auth/login-form';
import RoomForm from '../rooms/room-form';
import { Button } from '../ui/button/button';
import Layout from './layout';

const App = () => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

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
      {!matrixClient ? (
        <>{t('prompts.loading')}</>
      ) : matrixClient.isLoggedIn() ? (
        <div className="absolute top-4 left-4">
          <RoomForm
            trigger={<Button variant="outline">Create Room</Button>}
            open={open}
            setOpen={setOpen}
          />
        </div>
      ) : (
        <LoginForm />
      )}
    </Layout>
  );
};

export default App;
