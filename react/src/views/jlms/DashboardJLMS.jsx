import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

export default function DashboardJLMS(){
  return(
    <div className="font-roboto">

    <header className="flex justify-between items-center px-4 py-6 sm:px-4 lg:px-4">
      {/* Logo and Title container */}
      <div className="flex items-center space-x-4">
        <img
          src={ppalogo}
          alt="PPA PMO/LNI"
          className="transition-width duration-300 w-40 h-40 object-contain"
        />
        <div className="flex flex-col">
          <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none">
            JLMS
          </div>
          <h1 className="text-2xl font-regular tracking-tight text-gray-900 font-roboto">
            Joint Local Management System
          </h1>
        </div>
      </div>
    </header>


      {/* System Link Section */}

      {/* First Row: AMS, JOMS, PPS */}
      <div className="grid grid-cols-3 gap-4">
        {/* AMS */}
        <div className="relative text-center">
          <div className="ppa-system-abbr">
            <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/asset.gif" alt="Your Company" />
            <div className="text-5xl font-bold mt-2">AMS</div>
          </div>

          <div className="ppa-system-text text-lg text-gray-700">
            Asset Management System
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 animate-pulse shadow-sm">
            🚧 Coming Soon
          </div>
        </div>

        {/* JOMS */}
        <Link to={`/joms`}> 
        <div className="relative">
          <div className="ppa-system-abbr joms">
            <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/task-unscreen.gif" alt="Your Company" />
            <div className="text-5xl font-bold mt-2">JOMS</div>
          </div>
          <div className="ppa-system-text">
            Job Order Management System
          </div>
        </div>
        </Link>

        {/* PPS */}
        <div className="relative text-center">
          <div className="ppa-system-abbr">
            <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/personnel-unscreen.gif" alt="Your Company" />
            <div className="text-5xl font-bold mt-2">PPS</div>
          </div>

          <div className="ppa-system-text px-4">
            Personnel Profiling System
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 animate-pulse shadow-sm">
            🚧 Coming Soon
          </div>
        </div>
      </div>

      {/* Second Row: DTS, DIS */}
      <div className="grid grid-cols-2 gap-4 mt-20">
        {/* DTS Row */}
        <div className="flex justify-end w-full text-center">
          <div className="w-1/2">
            <div className="ppa-system-abbr">
              <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/folder-unscreen.gif" alt="Your Company" />
              <div className="text-5xl font-bold mt-2">DTS</div>
            </div>

            <div className="ppa-system-text">
              Document Tracking System
            </div>

            {/* Coming Soon Badge */}
            <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 animate-pulse shadow-sm">
              🚧 Coming Soon
            </div>
          </div>
        </div>


        {/* DIS */}
        <div className="flex justify-start w-full text-center">
          <div className="w-1/2">
            <div className="ppa-system-abbr">
              <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/file-info-unscreen.gif" alt="Your Company" />
              <div className="text-5xl font-bold mt-2">DIS</div>
            </div>

            <div className="ppa-system-text">
              Database of Issuance System
            </div>

            {/* Coming Soon Badge */}
            <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 animate-pulse shadow-sm">
              🚧 Coming Soon
            </div>
          </div>
        </div>

      </div>

      <footer className="text-sm font-bold p-5 text-right font-roboto mt-10">
        <p>&copy; 2025 All rights reserved. Developed by PPA PMO/LNI - IT Team (v.1.2.0) </p>
      </footer>

    </div>
  );
}