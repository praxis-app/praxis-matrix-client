import { Toaster } from '../ui/sonner';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
      <Toaster />
    </>
  );
};

export default Layout;
