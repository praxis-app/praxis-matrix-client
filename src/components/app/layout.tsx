import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from '../ui/sonner';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <main>{children}</main>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
