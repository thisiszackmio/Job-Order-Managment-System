import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStateContext } from '../context/ContextProvider';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useUserStateContext();

  if (!userToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;