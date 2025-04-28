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

  const { userCode } = useUserStateContext();

  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = ucode.includes("HACK");

  const [turnOff, setTurnOff] = useState(null);

  // // Get Data
  // useEffect(() => {
  //   axiosClient
  //   .get('/superadminsettings')
  //   .then((response) => {
  //     const maintainance = response.data.maintainance;

  //     setTurnOff(maintainance);
  //   });
  // }, []);

  
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