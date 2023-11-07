import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUserStateContext } from '../context/ContextProvider';

// Define a PrivateRoute component that checks user roles
const PrivateRoute = ({ element, allowedRoles }) => {
  const { userRole } = useUserStateContext();

  // Check if the user has one of the allowed roles
  const isAuthorized = allowedRoles.includes(userRole);

  return (
    <Route
      element={isAuthorized ? element : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
