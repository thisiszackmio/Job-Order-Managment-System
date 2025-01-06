import React, { useEffect, useCallback, useState, useRef } from "react";
import TopNav from "./TopNav";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";

const MAIN_LOGOUT_TIME = 3 * 60 * 1000; // 180 seconds
const POPUP_GRACE_PERIOD = 2 * 60 * 1000; // 120 seconds
const LOGOUT_DELAY = 5 * 60 * 1000; // Inactivity limit in milliseconds
const LOGOUT_KEY = "logout-timestamp";
const RELOAD_KEY = "pending-logout";

export default function PageComponent({ title, buttons = '', children }) {

  const { currentUserId, userCode, setCurrentId, setUserToken } = useUserStateContext();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(MAIN_LOGOUT_TIME);
  const [popupCountdown, setPopupCountdown] = useState(POPUP_GRACE_PERIOD);

  const [loading, setLoading] = useState(true);

  const timeoutRef = useRef(null);
  const popupRef = useRef(null);

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  // Logout function for Close the TAB
  const logoutCloseTab = useCallback(() => {
    // Perform the logout logic
    const logMessage = `has been logged out of the system due to closing the browser.`;

    // Set a logout reason in localStorage
    localStorage.setItem("logoutReason", "You have been logged out of the system due to inactivity.");

    axiosClient.post("/logout", { logMessage }).then(() => {
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('USER_CODE');
      localStorage.removeItem(LOGOUT_KEY);
      localStorage.removeItem(RELOAD_KEY);
      setUserToken(null);
      navigate("/login");
    });
  }, [navigate, setCurrentId, setUserToken]);

  // Logout function for Idle
  const logout = useCallback(() => {
    // Perform the logout logic
    const logMessage = `has been logged out of the system due to inactivity.`;

    // Set a logout reason in localStorage
    localStorage.setItem("logoutReason", "You have been logged out of the system due to inactivity.");

    axiosClient.post("/logout", { logMessage }).then(() => {
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('USER_CODE');
      localStorage.removeItem('loglevel');
      localStorage.removeItem('LAST_ACTIVITY');
      setUserToken(null);
      navigate("/login");
    });
  }, [navigate, setCurrentId, setUserToken]);

  const checkLogoutTimer = () => {
    const logoutTimestamp = localStorage.getItem(LOGOUT_KEY);
    const isPendingLogout = localStorage.getItem(RELOAD_KEY);
  
    // Case 1: Logout timer has expired
    if (logoutTimestamp && Date.now() - logoutTimestamp > LOGOUT_DELAY) {
      if (!isPendingLogout) {
        // Set flag to indicate the page is reloading for logout
        localStorage.setItem(RELOAD_KEY, "true");
        window.location.reload(); // Reload the page
      } else {
        // After reload, execute logout
        logoutCloseTab();
      }
    }
  };

  // Logout if the Browser is Closed
  useEffect(() => {
    const handleUnload = () => {
      console.log("Tab is being closed. Setting logout timer...");
      localStorage.setItem(LOGOUT_KEY, Date.now());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When the tab is reopened, check if the logout timer has passed
        console.log("Tab is active again. Checking logout timer...");
        checkLogoutTimer();
      }
    };

    // Check immediately if the app is opened after being closed
    checkLogoutTimer();

    // Event listeners for tab close and visibility change
    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("unload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, []);

  // Handle reset on user activity
  const handleActivity = () => {
    //saveLastActivity()
    if (!showPopup) {
      resetTimeout();
    }
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