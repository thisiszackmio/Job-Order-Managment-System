import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterProvider } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={AppRouter} />
    </ContextProvider>
  </React.StrictMode>
);
