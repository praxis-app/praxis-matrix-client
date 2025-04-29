import { useMatrixClient } from '@/hooks/use-matrix-client';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './login-form';

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const matrixClient = useMatrixClient();
  const { t } = useTranslation();

  if (!matrixClient) {
    return <div>{t('prompts.loading')}</div>;
  }

  if (!matrixClient.isLoggedIn()) {
    return <LoginForm />;
  }

  return <>{children}</>;
};
