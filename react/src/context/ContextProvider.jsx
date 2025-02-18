import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext({
  currentUserId: null,
  currentUserName: null,
  currentUserAvatar: null,
  currentUserToken: null,
  currentUserCode: null,
  setCurrentUserId: () => {},
  setCurrentUserName: () => {},
  setCurrentUserAvatar: () => {},
  setCurrentUserToken: () => {},
  setCurrentUserCode: () => {},
  clearUserData: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('USER_ID') || null);
  const [currentUserToken, setCurrentUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [currentUserAvatar, setCurrentUserAvatar] = useState(localStorage.getItem('USER_AVATAR') || '');
  const [currentUserCode, setCurrentUserCode] = useState(localStorage.getItem('USER_CODE') || '');

  // Get the initial User Details from localStorage
  const [currentUserName, setCurrentUserName] = useState(() => {
    const storedUserDet = localStorage.getItem('USER_DET');
    return storedUserDet ? JSON.parse(storedUserDet) : null;
  });

  // Function to update both context and localStorage for userId
  const updateCurrentUserId = (userId) => {
    if (userId) {
      localStorage.setItem('USER_ID', userId);
    } else {
      localStorage.removeItem('USER_ID');
    }
    setCurrentUserId(userId);
  };

  // Function to update Token in both context and localStorage
  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token);
    } else {
      localStorage.removeItem('TOKEN');
    }
    setCurrentUserToken(token);
  };

  // Function to update User Code Clearance
  const updateUserCode = (code) => {
    if (code) {
      localStorage.setItem('USER_CODE', code);
    } else {
      localStorage.removeItem('USER_CODE');
    }
    setCurrentUserCode(code);
  };

  // Function to update User Details (Handles full object)
  const setUserDetail = (userDet) => {
    if (userDet) {
      localStorage.setItem('USER_DET', JSON.stringify(userDet)); // Store object as JSON
    } else {
      localStorage.removeItem('USER_DET');
    }
    setCurrentUserName(userDet); // Update state with object
  };

  // Function to update User Avatar
  const setUserAvatar = (userAvatar) => {
    if (userAvatar) {
      localStorage.setItem('USER_AVATAR', userAvatar);
    } else {
      localStorage.removeItem('USER_AVATAR');
    }
    setCurrentUserAvatar(userAvatar);
  };

  // Function to clear all user data from context and localStorage (for logout)
  const clearUserData = () => {
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER_CODE');
    localStorage.removeItem('USER_DET');
    localStorage.removeItem('USER_AVATAR');

    setCurrentUserId(null);
    setCurrentUserToken('');
    setCurrentUserCode('');
    setCurrentUserName(null);
    setCurrentUserAvatar(null);
  };

  return (
    <StateContext.Provider
      value={{
        currentUserId,
        setCurrentUserId: updateCurrentUserId,
        currentUserName,
        setCurrentUserName: setUserDetail,
        currentUserAvatar,
        setCurrentUserAvatar: setUserAvatar,
        currentUserToken,
        setCurrentUserToken: setUserToken,
        currentUserCode,
        setCurrentUserCode: updateUserCode,
        clearUserData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
  
};

export const useUserStateContext = () => useContext(StateContext);