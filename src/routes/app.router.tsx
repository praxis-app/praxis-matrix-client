import HomePage from '@/pages/home-page';
import { createBrowserRouter } from 'react-router-dom';
import App from '../components/app/app';
import { roomRouter } from './room.router';

// TODO: Add error and 404 pages

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <>Error</>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <>404</>,
      },
      roomRouter,
    ],
  },
]);
