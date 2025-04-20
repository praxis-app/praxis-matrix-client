import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

// import * as sdk from 'matrix-js-sdk';

// const client = sdk.createClient({
//   baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
// });

// (async () => {
//   const loginResponse = await client.loginRequest({
//     type: 'm.login.password',
//     user: 'forrest',
//     password: 'reeds',
//   });
//   console.log(loginResponse);

//   await client.startClient({ initialSyncLimit: 10 });
//   const publicRooms = await client.publicRooms();
//   console.log(publicRooms);
// })();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
