import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import ppaLogo from '/ppa_logo.png';
import { Outlet } from 'react-router'

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div class="w-full h-full flex">
      <dh-component>
        <div class="flex flex-no-wrap">

          {/* Side Bar */}
          <div style={{ minHeight: '1000px', position: 'relative', top: '-65px'}} className="w-72 bg-ppa-themecolor shadow md:h-full flex">
            <div className="px-8">

              {/* Logo */}
              <div className="h-16 w-full flex items-center">
                <img style={{ width: '80%', margin: 'auto', marginTop: '15px' }} src={ppaLogo} alt="PPA PMO/LNI" width="144" height="30" viewBox="0 0 144 30"/>
              </div>

              {/* Nav */}
              <ul className="mt-32">

                {/* Dashboard */}
                <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-6">
                  <Link to="/" className="flex items-center">
                    <p className="text-base leading-4">Dashboard</p>
                  </Link>
                </li>

                {/* Request Forms */}
                <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-5" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <p className="text-base leading-4">Request Forms</p>
                  </div>
                </li>
                <CSSTransition
                  in={menuOpen}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <ul id="menu1" className={`pl-4 ${menuOpen ? "menuOpen" : "hidden"}`}>
                    <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-4">
                      <Link to="/form1">Pre/Post Repair Inspection Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-4">
                      <Link to="/form2">Facility / Venue Request Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center">
                      <Link to="/form2">Vehicle Slip Form</Link>
                    </li>
                  </ul>
                </CSSTransition>
                
                
              </ul>

            </div>
          </div>

          {/* Main Content */}
          <div class="container mx-auto md:w-4/5 w-11/12 px-2 flex-grow">
            <div class="w-full h-full">
            <Outlet />
            </div>
          </div>
        </div>

      </dh-component>
    </div>
  );
};

export default Sidebar;
