// TODO: Add remaining layout and functionality - below is a WIP

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useMatrixClient } from '../../hooks/shared.hooks';
import LoginForm from '../auth/login-form';
import Layout from './layout';

const App = () => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  useEffect(() => {
    if (matrixClient) {
      const init = async () => {
        const { total_room_count_estimate } = await matrixClient.publicRooms();
        console.log('Public room count:', total_room_count_estimate);
      };
      init();
    }
  }, [matrixClient]);

  // TODO: Move loading to layout

  // TODO: Move login to own page - redirect based on auth state

  return (
    <Layout>
      {!matrixClient ? (
        <>{t('prompts.loading')}</>
      ) : matrixClient.isLoggedIn() ? (
        <Outlet />
      ) : (
        <LoginForm />
      )}
    </Layout>
  );
};

export default App;
