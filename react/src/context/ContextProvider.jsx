import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext({
  currentUserId: null,
  userToken: null,
  userCode: null,
  setCurrentId: () => {},
  setUserToken: () => {},
  setUserCode: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUserId, setCurrentId] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [userCode, setUserCode] = useState(localStorage.getItem('USER_CODE') || '');

  // Use useEffect to set the initial user data from localStorage
  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem('USER_ID'));
    if (storedUserId) {
      setCurrentId(storedUserId);
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
    localStorage.setItem('USER_CODE', userCode);
  }, [userCode]);

  const updateUserCode = (code) => {
    setUserCode(code);
  };

  // Create a function to update both the context and localStorage
  const updateCurrentUserId = (id) => {
    localStorage.setItem('USER_ID', JSON.stringify(id));
    setCurrentId(id);
  };

  return (
    <StateContext.Provider
      value={{
        currentUserId,
        setCurrentId: updateCurrentUserId,
        userToken,
        setUserToken: setUserTokenAndLocalStorage,
        userCode,
        setUserCode: updateUserCode,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useUserStateContext = () => useContext(StateContext);