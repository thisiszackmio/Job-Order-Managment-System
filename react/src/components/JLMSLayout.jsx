import { useEffect, useState } from "react";
import axiosClient from '../axios';
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/default/ppa_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBars, faSignOutAlt, faFileLines, faUserPlus, faChevronRight, faScroll } from '@fortawesome/free-solid-svg-icons';
import Footer from "./Footer";
import submitAnimation from '/default/ring-loading.gif';
import { useUserStateContext } from "../context/ContextProvider";
import { useNavigate } from 'react-router-dom';
import Popup from "./Popup";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function JLMSLayout() {
  const { currentUserId, currentUserName, currentUserAvatar, setCurrentUserToken, currentUserCode } = useUserStateContext();

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  useEffect(() => {
    if (isSidebarMinimized) {
      setActiveAccordion(null);
    }
  }, [isSidebarMinimized, setActiveAccordion]);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const popupClass = 'popup-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else {
      removePopupClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup]);

  // Logout
  function handleLogout(){
    setShowPopup(true);
    setPopupContent('Logout');
    setPopupMessage(
      <div>
        <p className="popup-title">Logout Confirmation</p>
        <p className="popup-message">Are you sure you want to log out?</p>
      </div>
    );
  }

  function logout(){
    setSubmitLoading(true);
    
    axiosClient
      .post('/logout')
      .then(() => {
        localStorage.removeItem('USER_ID');
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USER_CODE');
        localStorage.removeItem('USER_DET');
        localStorage.removeItem('USER_AVATAR');
        setCurrentUserToken(null);
        navigate('/login');
      });
  }

  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  // Restrictions
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = codes.includes("HACK");
  const PortManager = codes.includes("PM");
  const AdminManager = codes.includes("AM");
  const DivisionManager = codes.includes("DM");
  const GSO = codes.includes("GSO");

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
                <span className="first-letter">J</span>oint <span className="first-letter">L</span>ocal <br />
                <span className="first-letter">M</span>anagement <br />
                <span className="first-letter">S</span>ystem
              </div>
          ):(
            <div className="text-title mb-10 vertical-text">
              <span className="block first-letter text-center">J</span>
              <span className="block first-letter text-center">L</span>
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

            {/* Employee Details */}
            {(SuperAdmin || PortManager || AdminManager || DivisionManager || GSO) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
                <FontAwesomeIcon icon={faUserPlus} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`}/>
                {!isSidebarMinimized && 
                  <>
                    <input id="toggle1" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 1} onChange={() => handleToggle(1)} />
                    <label htmlFor="toggle1" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                      <span className="ml-4">Employees</span>
                      <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                    </label>
                  </>
                }
                {(activeAccordion === 1 || !isSidebarMinimized) && (
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/userlist">All Employee Lists</Link>
                      </li>
                      {SuperAdmin && (
                        <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                          <Link to="/addemployee">Add Employee Data</Link>
                        </li>
                      )}
                    </ul>
                  </section>
                )}
              </li>
            )}

            {/* Announcements */}
            {(SuperAdmin || PortManager || AdminManager || DivisionManager || GSO) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
                <FontAwesomeIcon icon={faScroll} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
                {!isSidebarMinimized && 
                  <>
                    <input id="toggle2" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 2} onChange={() => handleToggle(2)} />
                    <label htmlFor="toggle2" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                      <span className="ml-4">Announcements</span>
                      <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                    </label>
                  </>
                }

                {(activeAccordion === 2 || !isSidebarMinimized) && (
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/allannouncement">All Announcements Lists</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/addannouncement">Add Announcements Data</Link>
                      </li>
                    </ul>
                  </section>
                )}
                
              </li>
            )}

            {/* Logs */}
            {SuperAdmin && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/logs" className="flex items-center">
                    <FontAwesomeIcon icon={faFileLines} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Logs</p>}
                  </Link>
                </div>
              </li>
            )}

          </ul>

          {/* Logout Area */}
          <ul className="logout-position mt-6">
            {/* Logout */}
            <li className={`w-full justify-between text-white cursor-pointer items-center mb-3 mt-3`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {!isSidebarMinimized && <a onClick={() => handleLogout()} className="text-base  ml-4 leading-4 text-lg">Logout</a>}
              </div>
            </li>
            {/* Account */}
            <li className={`w-full justify-between text-white cursor-pointer items-center mb-3 ${isSidebarMinimized ? 'mt-5':'mt-3'}`}>
              <div className="flex items-center">
              <img src={currentUserAvatar} className="ppa-display-picture" alt="" />
              {!isSidebarMinimized ? 
                <p className="text-base leading-4 text-sm">
                  <Link to="/user">{currentUserName?.name}</Link>
                </p> 
              : null }  
              </div>
            </li>
          </ul>

        </div>
      </div>

      {/* Main Content */}
      <div className={`ppa-content transition-width duration-300 ${isSidebarMinimized ? 'adjust-content' : ''}`}>
        {/* Top Nav */}
        <div className="ppa-hamburger">
          <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} className="text-white">
            <FontAwesomeIcon icon={faBars} className="ham-haha" />
          </button>
        </div>
        {/* Content */}
        <div style={{ minHeight: '100vh'}} className="w-full h-full content-here">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          logout={logout}
          justClose={justClose}
          userId={currentUserId}
        />
      )}
    </div>
  );
}