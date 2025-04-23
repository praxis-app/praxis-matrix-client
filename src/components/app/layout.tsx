import { ModeToggle } from '../theme/mode-toggle';
import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from '../ui/sonner';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="praxis-theme">
      <main>
        <ModeToggle className="absolute top-4 right-4" />
        {children}
      </main>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
