import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router';
import { RouterProvider } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';
import AutoLogout from './components/AutoLogout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={AppRouter} />
      <AutoLogout />
    </ContextProvider>
  </React.StrictMode>
);
