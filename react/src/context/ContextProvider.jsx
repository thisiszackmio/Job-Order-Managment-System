import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context with initial values
const StateContext = createContext({
  currentUser: {},
  userToken: null,
  userRole: 'member',
  setCurrentUser: () => {},
  setUserToken: () => {},
  setUserRole: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'member');

  // Use useEffect to set the initial user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('USER'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const setUserTokenAndLocalStorage = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token);
    } else {
      localStorage.removeItem('TOKEN');
    }
    setUserToken(token);
  };

  // Create a function to update both the context and localStorage
  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  const updateUserRole = (role) => {
    setUserRole(role);
  };

  // Create a function to update both the context and localStorage
  const updateCurrentUser = (userData) => {
    localStorage.setItem('USER', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser: updateCurrentUser,
        userToken,
        setUserToken: setUserTokenAndLocalStorage,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useUserStateContext = () => useContext(StateContext);
