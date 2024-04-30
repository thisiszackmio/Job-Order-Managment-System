import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import ppaLogo from '/ppa_logo.png';
import { Outlet } from 'react-router';
import { useUserStateContext } from '../context/ContextProvider';
import axiosClient from '../axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestList, setRequestList] = useState(false);
  const { currentUser, setCurrentUser, setUserToken  } = useUserStateContext();

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleList = () => {
    setRequestList(!requestList);
  };

  const logout = () => {
    // Perform the logout logic
    axiosClient.post('/logout').then((response) => {
      setCurrentUser({});
      setUserToken(null);

      // Redirect to the login page using the navigate function
      navigate('/login');
    });
  };

  return (
    <div className="w-full h-full font-roboto">
      <div>
        {/* Side Bar */}
        <div style={{ minHeight: '100vh', position: 'fixed', overflowY: 'auto', overflowX: 'hidden'}} className="w-72 bg-ppa-themecolor shadow md:h-full flex">
          <div className="px-8">
            {/* Logo */}
            <div className="h-30 w-full flex items-center">
              <img style={{ width: '80%', margin: 'auto', marginTop: '15px' }} src={ppaLogo} alt="PPA PMO/LNI" width="144" height="30" viewBox="0 0 144 30"/>
            </div>

            <div className="text-title">
              <span className="first-letter">J</span>ob <span className="first-letter">O</span>rder <br />
              <span className="first-letter">M</span>anagement <br />
              <span className="first-letter">S</span>ystem
            </div>

            {/* Nav */}
            <ul className="mt-10">

              {/* Dashboard */}
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6">
                <Link to="/" className="flex items-center">
                  <p className="text-base leading-4 text-lg">Dashboard</p>
                </Link>
              </li>

              {/* Request Forms */}
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6" data-toggle="collapse" onClick={toggleMenu}>
                <div className="flex items-center">
                  <p className="text-base leading-4 text-lg">Request Forms</p>
                </div>
              </li>
              <CSSTransition
                in={menuOpen}
                timeout={300}
                classNames="dropdown"
                unmountOnExit
              >
                {/* Dropdown menu */}
                <ul id="menu1" className={`pl-4 mb-6 menu ${menuOpen ? "menuOpen" : "hidden"}`}>
                  <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                    <Link to="/requestinspectionform">Pre/Post Repair Inspection Form</Link>
                  </li>
                  <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                    <Link to="/facilityrequestform">Facility / Venue Request Form</Link>
                  </li>
                  <li className="flex w-full justify-between text-white cursor-pointer items-center">
                    <Link to="/vehiclesliprequestform">Vehicle Slip Form</Link>
                  </li>
                </ul>
              </CSSTransition>

              {/* My request */}
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6">
                <Link to={`/myrequest/${currentUser.id}`} className="flex items-center">
                  <p className="text-base leading-4 text-lg">My Request</p>
                </Link>
              </li>

              {/* Request List */}
              {currentUser.code_clearance == '1' || currentUser.code_clearance == '3' || currentUser.code_clearance == '4' || currentUser.code_clearance == '10' ? (
                <>
                  <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6" data-toggle="collapse" onClick={toggleList}>
                    <div className="flex items-center">
                      <p className="text-base leading-4 text-lg">Request List</p>
                    </div>
                  </li>
                  <CSSTransition
                    in={requestList}
                    timeout={300}
                    classNames="dropdown"
                    unmountOnExit
                  >
                    {/* Dropdown menu */}
                    <ul id="menu1" className={`pl-4 mb-6 menu ${requestList ? "requestList" : "hidden"}`}>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/repairrequestform">Pre/Post Repair Inspection Form</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/facilityvenuerequestform">Facility / Venue Request Form</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center">
                        <Link to="/form2">Vehicle Slip Form</Link>
                      </li>
                    </ul>
                  </CSSTransition>
                </>
              ) : null}
            </ul>

            {/* Buttom Nav */}
            <ul className="buttom-nav">
              <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-6" data-toggle="collapse">
                <div className="flex items-center">
                  <a onClick={logout} className="text-base leading-4 text-lg">Logout</a>
                </div>
              </li>
              <li className="flex w-full justify-between text-gray-300 cursor-pointer items-center mb-6" data-toggle="collapse" onClick={toggleList}>
                <div className="flex items-center">
                  <p className="text-base leading-4 text-sm">User: {currentUser.fname} {currentUser.mname}. {currentUser.lname}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="ppa-content">
          <div style={{ minHeight: '100vh'}} className="w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default Sidebar;
