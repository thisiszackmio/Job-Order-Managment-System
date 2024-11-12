import React, { useEffect, useCallback, useState, useRef } from "react";
import TopNav from "./TopNav";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";

const MAIN_LOGOUT_TIME = 300 * 1000; // 500 seconds
const POPUP_GRACE_PERIOD = 120 * 1000; // 120 seconds
const INACTIVITY_LIMIT = 120000; // Inactivity limit in milliseconds

export default function PageComponent({ title, buttons = '', children }) {
  const { currentUserId, userCode, setCurrentId, setUserToken } = useUserStateContext();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(MAIN_LOGOUT_TIME);
  const [popupCountdown, setPopupCountdown] = useState(POPUP_GRACE_PERIOD);

  const timeoutRef = useRef(null);
  const popupRef = useRef(null);

  // Logout function
  const logout = useCallback(() => {
    axiosClient.post("/logout").then(() => {
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('USER_CODE');
      localStorage.removeItem('loglevel');
      setUserToken(null);
      navigate("/login");
    });
  }, [navigate, setCurrentId, setUserToken]);

  // Save the last activity timestamp to localStorage
  const saveLastActivity = () => {
    const currentTime = Date.now();
    localStorage.setItem("LAST_ACTIVITY", currentTime);
  };

  // Check if the user has exceeded inactivity limit
  const isInactivityLimitExceeded = () => {
    const lastActivity = parseInt(localStorage.getItem("LAST_ACTIVITY"), 10);
    return lastActivity && Date.now() - lastActivity > INACTIVITY_LIMIT;
  };

  // Handle page visibility change for tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleActivity(); // Reset the timer when returning to the tab
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showPopup]);

  // Check inactivity on page load
  useEffect(() => {
    if (isInactivityLimitExceeded()) {
      logout();
    } else {
      // Reset the last activity on page load if still within the limit
      saveLastActivity();
    }
  }, [logout]);

  // Check Code Clearance
  useEffect(() => {
    axiosClient
      .get(`/checkcc/${currentUserId?.id}`)
      .then((response) => {
        const CodeClearanceData = response.data; // e.g., "MEM", "HACK"
        const CurrentCodeClearance = userCode;   // e.g., "HACK", "MEM"

        // Function to check if two strings contain the same characters in any order
        const areStringsEqual = (str1, str2) => {
          if (str1.length !== str2.length) return false;
          return str1.split('').sort().join('') === str2.split('').sort().join('');
        };

        // If they don't match, log the user out
        if (!areStringsEqual(CodeClearanceData, CurrentCodeClearance)) {
          logout();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [currentUserId?.id, logout, userCode]);

  // Main countdown function
  const startMainCountdown = () => {
    timeoutRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timeoutRef.current);
          setShowPopup(true); // Show popup when main timer expires
          startPopupCountdown(); // Start the popup countdown
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
  };

  // Popup countdown function
  const startPopupCountdown = () => {
    setPopupCountdown(POPUP_GRACE_PERIOD); // Reset popup countdown
    clearInterval(popupRef.current);
    popupRef.current = setInterval(() => {
      setPopupCountdown((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(popupRef.current);
          logout(); // Logout when popup countdown expires
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
  };

  // Reset both main and popup timers
  const resetTimeout = () => {
    setShowPopup(false); // Hide popup if visible
    clearInterval(timeoutRef.current);
    clearInterval(popupRef.current);
    setTimeRemaining(MAIN_LOGOUT_TIME);
    setPopupCountdown(POPUP_GRACE_PERIOD);
    startMainCountdown(); // Restart the main timer
  };

  // Handle reset on user activity
  const handleActivity = () => {
    //saveLastActivity()
    if (!showPopup) {
      resetTimeout();
    }
  };

  // Handle button click to reset both timers
  const handleButtonClick = () => {
    resetTimeout();
  };

  useEffect(() => {
    // Add event listeners for user activity
    const activityEvents = ["mousemove", "keydown", "click"];
    activityEvents.forEach((event) => window.addEventListener(event, handleActivity));

    // Initialize the main timer on component mount
    startMainCountdown();

    // Handle visibility change for tab focus
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
      if (!document.hidden) {
        handleActivity(); // Reset the timer when returning to the tab
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on component unmount
    return () => {
      clearInterval(timeoutRef.current);
      clearInterval(popupRef.current);
      activityEvents.forEach((event) => window.removeEventListener(event, handleActivity));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTabActive, showPopup]);

  return (
  <>
    <header className="bg-white shadow flex justify-between items-center">
      <div className="px-4 py-6 sm:px-4 lg:px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-roboto">{title}</h1>
      </div>
      <TopNav />
    </header>

    <main>
      <div className="px-4 py-6 sm:px-4 lg:px-4">
        {children}
      </div>
    </main>

    {/* For Popup */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Semi-transparent black overlay with blur effect */}
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

        {/* Popup content */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>

          {/* Notification Icons */}
          <div className="f-modal-alert">
            <div className="f-modal-icon f-modal-warning scaleWarning">
              <span className="f-modal-body pulseWarningIns"></span>
              <span className="f-modal-dot pulseWarningIns"></span>
            </div>
          </div>

          {/* Popup Message */}
          <p className="text-lg text-center">
            <p className="popup-title">Are you still there?</p>
            <p className="popup-message">
              You will be logged out soon due to inactivity.
              <br /> Time remaining: {Math.floor(popupCountdown / 1000)}
            </p>
          </p>
          
          {/* Button */}
          <div className="flex justify-center mt-4">
            <button onClick={handleButtonClick} className="w-full py-2 btn-default">
              I'm Still Here
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
