import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext({
  currentUserId: null,
  userToken: null,
  userCode: null,
  setCurrentId: () => {},
  setUserToken: () => {},
  setUserCode: () => {},
  clearUserData: () => {},
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

  // Create a function to update both the context and localStorage
  const updateCurrentUserId = (id) => {
    localStorage.setItem('USER_ID', JSON.stringify(id));
    setCurrentId(id);
  };

  // Get Token
  const setUserTokenAndLocalStorage = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token);
    } else {
      localStorage.removeItem('TOKEN');
    }
    setUserToken(token);
  };

  // Get Code Clearance
  const updateUserCode = (code) => {
    if(code) {
      localStorage.setItem('USER_CODE', code);
    } else {
      localStorage.removeItem('USER_CODE');
    }
    setUserCode(code);
  };

  // Clear all user data from context and localStorage (for logout)
  const clearUserData = () => {
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER_CODE');
    setCurrentId(null);
    setUserToken('');
    setUserCode('');
    setTimeActivity(null);
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
        clearUserData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useUserStateContext = () => useContext(StateContext);