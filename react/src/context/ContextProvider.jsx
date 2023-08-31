import { useContext, useEffect } from "react";
import { useState, createContext } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    setCurrentUser: () => {},
    setUserToken: () => {},
});

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');

    const setUserTokenAndLocalStorage = (token) => {
        if (token) {
            localStorage.setItem('TOKEN', token);
        } else {
            localStorage.removeItem('TOKEN');
        }
        setUserToken(token);
    };

    return (
        <StateContext.Provider value={{
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken: setUserTokenAndLocalStorage,
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useUserStateContext = () => useContext(StateContext);
