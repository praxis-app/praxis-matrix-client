import { AuthWrapper } from '../auth/auth-wrapper';
import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from '../ui/sonner';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => (
  <ThemeProvider>
    <main>
      <AuthWrapper>{children}</AuthWrapper>
    </main>
    <Toaster />
  </ThemeProvider>
);
