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

  </>
  );
}