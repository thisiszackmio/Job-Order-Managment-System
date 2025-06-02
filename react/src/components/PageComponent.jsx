import React, { useEffect, useState } from "react";
import TopNav from "./TopNav";
import axiosClient from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Maint from "./Maint";
import { useUserStateContext } from "../context/ContextProvider";

export default function PageComponent({ title, buttons = '', children }) {
  const { currentUserCode } = useUserStateContext();

  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = ucode.includes("HACK");

  // For Maintenance Mode
  useEffect(() => {
    axiosClient.get("/settings/maintenance").then(response => {
      setMaintenance(response.data.maintenance);
      setLoading(false);
    }).catch(() => setLoading(false));
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
        {loading ? (
          <div className="flex items-left h-20 space-x-4">
            {/* Loading Animation */}
            <FontAwesomeIcon
              icon={faGear}
              className="text-4xl text-blue-700 gear"
            />
            <span className="loading">Loading...</span>
          </div>
        ) : (
          maintenance ? (
            SuperAdmin ? (
            <>
              {maintenance && (
              <>
                {/* Status */}
                <div className="status-sec mb-4">
                  <strong>Enable Maintenance Mode!</strong>
                </div>
              </>
              )}
              {children}
            </>
            ):(
              <Maint />
            )
          ):(
            <>
              {children}
            </>
          )
        )}
      </div>
    </main>

  </>
  );
}