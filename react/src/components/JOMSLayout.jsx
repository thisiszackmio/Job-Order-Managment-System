import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars, faTachometerAlt, faList, faSignOutAlt, faTableList, faClipboardUser, faVanShuttle, faScroll, faUserTie, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";
import TopNav from "./TopNav";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../axios";
import Footer from "./Footer";
import Popup from "./Popup";
import ppaLogo from '/default/ppa_logo.png';
import moment from "moment-timezone";

export default function JOMSLayout() {
  const { currentUserId, currentUserAvatar, setCurrentUserToken, currentUserCode } = useUserStateContext();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const today = moment().tz('Asia/Manila').format('YYYY-MM-DD');

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date("2025-12-27");
    const endDate = new Date("2026-01-10");

    if (now >= startDate && now <= endDate) {
      setShowLink(true);
    }
  }, []);

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  useEffect(() => {
    if (isSidebarMinimized) {
      setActiveAccordion(null);
    }
  }, [isSidebarMinimized, setActiveAccordion]);

  const isRequestFormsActive =
  location.pathname.includes("/joms/inspection/form") ||
  location.pathname.includes("/joms/facilityvenue/form") ||
  location.pathname.includes("/joms/vehicle/form") ||
  location.pathname.includes("/joms/inspection") || 
  location.pathname.includes("/joms/facilityvenue") ||
  location.pathname.includes("/joms/vehicle") ||
  location.pathname.includes("/joms/allannouncement") ||
  location.pathname.includes("/joms/addannouncement") ||
  location.pathname.includes("/joms/systemstat") || 
  location.pathname.includes("/joms/settings") ||
  location.pathname.includes("/joms/logs") ||
  location.pathname.includes("/joms/userlist") ||
  location.pathname.includes("/joms/addemployee");

  // For the Profile
  function handleProfile(){
    setActiveAccordion(null);
    navigate(`/joms/user`);
  }

  // Logout
  function handleLogout(){
    setActiveAccordion(null);
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
  const AssignPersonnel = codes.includes("AP");
  const Authority = codes.includes("AU");
  const SuperHacker = codes.includes("NERD");

  return(
    <div className="w-full h-full font-roboto">

      {/* Side Bar */}
      <div style={{ maxHeight: '100vh', position: 'fixed', overflowY: 'auto', overflowX: 'hidden'}} className={`w-72 bg-ppa-themecolor ppa-sidebar shadow flex transition-width duration-300 ${isSidebarMinimized ? 'sidebar-close' : 'sidebar-open'}`}>
        <div className={`transition-width duration-300 ${isSidebarMinimized ? 'minimized' : 'not-minimized'}`}>

          {/* Logo */}
          <div className="flex justify-center items-center pt-4">
            <img src={ppaLogo} alt="PPA PMO/LNI" className={`transition-width duration-300 ${isSidebarMinimized ? 'w-10' : 'w-3/4 items-center'}`} />
          </div>

          {/* Title Text */}
          {!isSidebarMinimized ? (
              <div className="text-title mb-8">
                <span className="first-letter">J</span>ob <span className="first-letter">O</span>rder <br />
                <span className="first-letter">M</span>anagement <br />
                <span className="first-letter">S</span>ystem
              </div>
          ):(
            <div className="text-title mb-8 vertical-text">
              <span className="block first-letter text-center">J</span>
              <span className="block first-letter text-center">O</span>
              <span className="block first-letter text-center">M</span>
              <span className="block first-letter text-center">S</span>
            </div>
          )}

          {/* Nav */}
          <ul className={`ppa-accordion ${isSidebarMinimized ? 'nav-min':''}`}>

            {/* Relase Note */}
            {showLink && (
              <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/systemupdate" ? "nav-active" : ""}`}>
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/systemupdate" className="flex items-center">
                    <FontAwesomeIcon icon={faUserGear} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">System Update </p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Dashboard */}
            <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/dashboard" ? "nav-active" : ""}`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/joms/dashboard" className="flex items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Dashboard</p>}
                </Link>
              </div>
            </li>

            {/* My Request */}
            <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/myrequest" ? "nav-active" : ""}`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full ':''}`}>
                <Link to={`/joms/myrequest`} className="flex items-center">
                  <FontAwesomeIcon icon={faTableList} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">My Request</p>}
                </Link>
              </div>
            </li>

            {/* Pending Request */}
            {(SuperAdmin || GSO || AdminManager || DivisionManager || AssignPersonnel || PortManager ) && (
            <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/pending" ? "nav-active" : ""}`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full' : ''}`}>
                <Link to={`/joms/pending`} className="flex items-center">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTableList} />
                    {!isSidebarMinimized && (
                      <p className="ml-4 text-lg">Pending Request</p>
                    )}
                  </div>
                  {/* {!isSidebarMinimized && (
                    pendingCount && (
                      <span className="absolute right-9 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {pendingCount}
                      </span>
                    )
                  )} */}
                </Link>
              </div>
            </li>
            )}

            {/* Request Forms */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-4 mt-4"> 
              <FontAwesomeIcon icon={faList} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
              {!isSidebarMinimized && 
              <>
                <input id="toggle1" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 1} onChange={() => handleToggle(1)} />
                <label htmlFor="toggle1" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                  <span className="ml-4">Request Forms</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
              </>
              }

              {(activeAccordion === 1 || !isSidebarMinimized || isRequestFormsActive ) && (
                <section className={`accordion-content ${(activeAccordion === 1 || isRequestFormsActive) && !isSidebarMinimized ? "open" : "" }`} >
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/joms/inspection/form" className={`${location.pathname === "/joms/inspection/form" ? "active-submenu" : ""}`}>Pre/Post Repair Inspection Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/joms/facilityvenue/form" className={`${location.pathname === "/joms/facilityvenue/form" ? "active-submenu" : ""}`}>Facility / Venue Request Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center">
                      <Link to="/joms/vehicle/form" className={`${location.pathname === "/joms/vehicle/form" ? "active-submenu" : ""}`}>Vehicle Slip Form</Link>
                    </li>
                  </ul>
                </section>
              )}
            </li>

            {/* Request List */}
            {(SuperAdmin || GSO || AssignPersonnel || Authority || DivisionManager || PortManager || AdminManager) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
                <FontAwesomeIcon icon={faList} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
                {!isSidebarMinimized && 
                <>
                  <input id="toggle2" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 2} onChange={() => handleToggle(2)}/>
                  <label htmlFor="toggle2" className="w-full justify-between text-white cursor-pointer items-center fle text-lg">
                    <span className="ml-4">Request List</span>
                    <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                  </label>
                </>
                }

                {(activeAccordion === 2 || !isSidebarMinimized || isRequestFormsActive) && (
                  <section className={`accordion-content ${(activeAccordion === 2 || isRequestFormsActive) && !isSidebarMinimized ? "open" : "" }`} >
                    <ul id="menu2" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/inspection" className={`${location.pathname === "/joms/inspection" ? "active-submenu" : ""}`}>Pre/Post Repair Inspection Form</Link>
                      </li>
                      {(!AssignPersonnel || !Authority) && (
                        <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                          <Link to="/joms/facilityvenue" className={`${location.pathname === "/joms/facilityvenue" ? "active-submenu" : ""}`}>Facility / Venue Request Form</Link>
                        </li>
                      )}
                      {(!AssignPersonnel || Authority || SuperAdmin) && (
                        <li className="flex w-full justify-between text-white cursor-pointer items-center">
                          <Link to="/joms/vehicle" className={`${location.pathname === "/joms/vehicle" ? "active-submenu" : ""}`}>Vehicle Slip Form</Link>
                        </li>
                      )}
                    </ul>
                  </section>
                )}
              </li>
            )}

            {/* Personnel */}
            {(SuperAdmin || GSO || AssignPersonnel) && (
              <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/personnel" ? "nav-active" : ""}`}>
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/personnel" className="flex items-center">
                    <FontAwesomeIcon icon={faClipboardUser} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Personnel</p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Vehicle */}
            {(SuperAdmin || GSO || AssignPersonnel) && (
              <li className={`w-full justify-between text-white cursor-pointer items-center mb-4 ${pathname === "/joms/vehicletype" ? "nav-active" : ""}`}>
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/vehicletype" className="flex items-center">
                    <FontAwesomeIcon icon={faVanShuttle} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Vehicle</p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Announcements */}
            {(SuperAdmin || PortManager || AdminManager || DivisionManager || GSO) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4 ">
                <FontAwesomeIcon icon={faScroll} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
                {!isSidebarMinimized && 
                  <>
                    <input id="toggle3" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 3} onChange={() => handleToggle(3)} />
                    <label htmlFor="toggle3" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                      <span className="ml-4">Announcements</span>
                      <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                    </label>
                  </>
                }

                {(activeAccordion === 3 || !isSidebarMinimized || isRequestFormsActive) && (
                  <section className={`accordion-content ${(activeAccordion === 3 || isRequestFormsActive) && !isSidebarMinimized ? "open" : "" }`} >
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/addannouncement" className={`${location.pathname === "/joms/addannouncement" ? "active-submenu" : ""}`}>Add Announcements Data</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/allannouncement" className={`${location.pathname === "/joms/allannouncement" ? "active-submenu" : ""}`}>All Announcements Lists</Link>
                      </li>
                    </ul>
                  </section>
                )}
                
              </li>
            )}

            {/* Superadmin Settings */}
            {SuperAdmin && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4 ">
                <FontAwesomeIcon icon={faUserTie} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
                {!isSidebarMinimized && 
                  <>
                    <input id="toggle4" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 4} onChange={() => handleToggle(4)} />
                    <label htmlFor="toggle4" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                      <span className="ml-4">Hacker Settings</span>
                      <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                    </label>
                  </>
                }

                {(activeAccordion === 4 || !isSidebarMinimized || isRequestFormsActive) && (
                  <section className={`accordion-content ${(activeAccordion === 4 || isRequestFormsActive) && !isSidebarMinimized ? "open" : "" }`} >
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/settings" className={`${location.pathname === "/joms/settings" ? "active-submenu" : ""}`}>General Settings</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/logs" className={`${location.pathname === "/joms/logs" ? "active-submenu" : ""}`}>Logs</Link>
                      </li>
                      {SuperHacker && (
                      <>
                        <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                          <Link to="/joms/userlist" className={`${location.pathname === "/joms/userlist" ? "active-submenu" : ""}`}>All Employee Lists</Link>
                        </li>
                        <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                          <Link to="/joms/addemployee" className={`${location.pathname === "/joms/addemployee" ? "active-submenu" : ""}`}>Add Employee Data</Link>
                        </li>
                      </>
                      )}
                    </ul>
                  </section>
                )}
              </li>
            )}

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
        <div className="nav-btn">
          <TopNav />
        </div>
        <div className="profile relative">
          <ul>
            <li className="relative">
              <img src={currentUserAvatar} className="ppa-display-picture cursor-pointer" alt="" onClick={() => handleToggle(5)} />

              {/* Dropdown Container */}
              <div className={`profile-dropdown ${activeAccordion === 5 ? "open" : ""}`}>
                <ul className="profile-menu">
                  <li>
                    <button className="profile-item logout-btn" onClick={handleProfile}>
                      Profile
                    </button>
                  </li>

                  <li>
                    <button className="profile-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div style={{ minHeight: '100vh'}} className="w-full h-full content-here">
          <Outlet />
        </div>
        <Footer />
      </div>

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