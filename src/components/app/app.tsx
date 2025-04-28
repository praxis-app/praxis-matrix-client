// TODO: Add remaining layout and functionality - below is a WIP

import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useMatrixClient } from '../../hooks/use-matrix-client';
import { LoginForm } from '../auth/login-form';
import { Layout } from './layout';

export const App = () => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

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
