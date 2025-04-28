import React, { useEffect, useState } from "react";
import TopNav from "./TopNav";
import axiosClient from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Maint from "./Maint";
import { useUserStateContext } from "../context/ContextProvider";

export default function PageComponent({ title, buttons = '', children }) {
  const { currentUserCode } = useUserStateContext();

  const [turnOff, setTurnOff] = useState(null);

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = ucode.includes("HACK");

  // Get Data
  useEffect(() => {
    axiosClient
    .get('/superadminsettings')
    .then((response) => {
      const maintainance = response.data.maintainance;

      setTurnOff(maintainance);
    });
  }, []);

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
        {turnOff === null ? (
          <div className="flex items-left h-20 space-x-4">
            {/* Loading Animation */}
            <FontAwesomeIcon
              icon={faGear}
              className="text-4xl text-blue-700 gear"
            />
            <span className="loading">Loading...</span>
          </div>
        ):( turnOff ? (
          SuperAdmin ? (
          <>
            {turnOff ? 1 : 0}
            {children}
          </>
          ):(
            <Maint />
          )
        ) : (
        <>
          {children}
        </>
        ) )}
      </div>
    </main>

  </>
  );
}