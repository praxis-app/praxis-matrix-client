import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from '../ui/sonner';
import { MatrixProvider } from './matrix-provider';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => (
  <ThemeProvider>
    <main>
      <MatrixProvider>{children}</MatrixProvider>
    </main>
    <Toaster />
  </ThemeProvider>
);
