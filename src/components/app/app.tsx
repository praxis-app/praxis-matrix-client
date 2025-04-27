import { Outlet } from 'react-router-dom';
import Layout from './layout';
import { MatrixProvider } from './matrix-provider';

const App = () => {
  return (
    <MatrixProvider>
      <Layout>
        <Outlet />
      </Layout>
    </MatrixProvider>
  );
};

export default App;
