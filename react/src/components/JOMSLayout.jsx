import { useEffect, useState } from "react";
import { Menu, Transition } from '@headlessui/react';
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/ppa_logo.png';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars, faTachometerAlt, faList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function JOMSLayout() {

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  useEffect(() => {
    if (isSidebarMinimized) {
      setActiveAccordion(null);
    }
  }, [isSidebarMinimized, setActiveAccordion]);

  return (
    <div className="w-full h-full font-roboto">
      {/* Side Bar */}
      <div style={{ maxHeight: '100vh', position: 'fixed', overflowY: 'auto', overflowX: 'hidden'}} className={`w-72 bg-ppa-themecolor ppa-sidebar shadow flex transition-width duration-300 ${isSidebarMinimized ? 'sidebar-close' : 'sidebar-open'}`}>
        <div className={`transition-width duration-300 ${isSidebarMinimized ? 'minimized' : 'not-minimized'}`}>
          {/* Logo */}
          <div className="flex justify-center items-center py-4">
            <img src={ppaLogo} alt="PPA PMO/LNI" className={`transition-width duration-300 ${isSidebarMinimized ? 'w-10' : 'w-4/5 items-center'}`} />
          </div>
          {/* Title Text */}
          {!isSidebarMinimized ? (
              <div className="text-title mb-10">
                <span className="first-letter">J</span>ob <span className="first-letter">O</span>rder <br />
                <span className="first-letter">M</span>anagement <br />
                <span className="first-letter">S</span>ystem
              </div>
          ) : (
            <div className="text-title mb-10 vertical-text">
              <span className="block first-letter text-center">J</span>
              <span className="block first-letter text-center">O</span>
              <span className="block first-letter text-center">M</span>
              <span className="block first-letter text-center">S</span>
            </div>
          )}

          {/* Nav */}
          <ul className={`mt-10 ppa-accordion ${isSidebarMinimized ? 'nav-min':''}`}>

            {/* Dashboard */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/" className="flex items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Dashboard</p>}
                </Link>
              </div>
            </li>

            {/* My Request */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-6 mt-6">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to={`/myrequest/`} className="flex items-center">
                  <FontAwesomeIcon icon={faList} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">My Request</p>}
                </Link>
              </div>
            </li>

          </ul>

          {/* Logout */}
          <ul className='logout-area'>
            <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {!isSidebarMinimized && <a className="text-base  ml-4 leading-4 text-lg">Logout</a>}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className={`ppa-content transition-width duration-300 ${isSidebarMinimized ? 'adjust-content' : ''}`}>
        <div className="ppa-hamburger">
          <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} className="text-white">
            <FontAwesomeIcon icon={faBars} className="ham-haha" />
          </button>
        </div>
        <div style={{ minHeight: '100vh'}} className="w-full h-full content-here">
          <Outlet />
        </div>
      </div>
    </div>
  );
}