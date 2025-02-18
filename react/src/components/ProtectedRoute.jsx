import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStateContext } from '../context/ContextProvider';

const ProtectedRoute = ({ children }) => {
  const { currentUserToken } = useUserStateContext();

  if (!currentUserToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;