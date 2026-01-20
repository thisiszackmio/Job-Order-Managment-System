import ppalogo from '/default/ppa_logo-st.png';
import { Link } from "react-router-dom";

export default function JLMS(){
  return(
  <>
    <header className="ppa-logo-name">
      <div className="ppa-wrap space-x-4">
        <img src={ppalogo} alt="PPA PMO/LNI" className="ppa-img-logo" />
        <div className="ppa-ld-text">
          <div className="ppa-ltitle">
            JLMS
          </div>
          <h1 className="ppa-lword">
            Joint Local Management System
          </h1>
        </div>
      </div>
    </header>

    {/* System Link Section */}
    {/* 1st Row */}
    <div className="ppa-system-wrap-3">
      
      {/* AMS */}
      <Link to={`/ams/`}> 
        <div className="relative text-center">
          <div className="ppa-system-abbr">
            <img className="mx-auto jlms-icons w-40 h-40 object-contain" src="default/asset.gif" alt="Your Company" />
            <div className="text-5xl font-bold mt-2">AMS</div>
          </div>
          <div className="ppa-system-text">
            Asset Management System
          </div>
        </div>
      </Link>

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

        <div className="ppa-system-text">
          Personnel Profiling System
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 animate-pulse shadow-sm">
          🚧 Coming Soon
        </div>
      </div>

    </div>

    {/* 2nd Row */}
    <div className="ppa-system-wrap-2">
      
      {/* DTS Row */}
      <div className="ppa-system-2">
        <div className="">
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
      <div className="ppa-system-2">
        <div className="">
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

    <footer className="footer-content">
      <p>&copy; 2026 All rights reserved. Developed by PPA PMO/LNI - IT Team </p>
    </footer>
  </>
  );
}