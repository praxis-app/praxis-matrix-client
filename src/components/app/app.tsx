// TODO: Add remaining layout and functionality - below is a WIP

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

  return (
    <Layout>
      {/* TODO: Move styling to layout */}
      <div className="flex flex-col items-center justify-center p-24">
        {!matrixClient ? (
          <>{t('prompts.loading')}</>
        ) : matrixClient.isLoggedIn() ? (
          <>{t('auth.prompts.loggedIn')}</>
        ) : (
          <LoginForm />
        )}
      </div>
    </Layout>
  );
};

export default App;
