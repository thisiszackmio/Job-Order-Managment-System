import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/default/ppa_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars, faTachometerAlt, faList, faSignOutAlt, faTableList, faClipboardUser, faVanShuttle, faScroll, faUserTie, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../axios";
import Footer from "./Footer";
import Popup from "./Popup";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function JOMSLayout() {
  const { currentUserId, currentUserName, currentUserAvatar, setCurrentUserToken, currentUserCode } = useUserStateContext();

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date("2025-09-25");
    const endDate = new Date("2025-10-02");

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

  // Variable
  const [pendingCount, getPendingCount] = useState(null);

  // Get the Data
  const PendingCount = () => {
    axiosClient
    .get(`/pendingrequestcount/${currentUserId}`)
    .then((response) => {
      const responsePenData = response.data.pending_count ?? null;

      getPendingCount(responsePenData);
    });
  }

  const OnTravelSet = () => {
    axiosClient
    .put(`/ontravelset/${currentUserId}`)
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // Custom handling for 404
        console.warn("No Driver and Vehicle to be available");
        // Optional: Show a popup or notification here
      } else {
        // Handle other errors
        console.error("Unexpected error occurred:", error);
      }
    });
  }

  // Get the useEffect
  useEffect(() => {
    OnTravelSet();
    if(currentUserId){
      PendingCount();
    }
  }, [currentUserId]);

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
          ):(
            <div className="text-title mb-10 vertical-text">
              <span className="block first-letter text-center">J</span>
              <span className="block first-letter text-center">O</span>
              <span className="block first-letter text-center">M</span>
              <span className="block first-letter text-center">S</span>
            </div>
          )}

          {/* Nav */}
          <ul className={`mt-10 ppa-accordion ${isSidebarMinimized ? 'nav-min':''}`}>

            {/* Relase Note */}
            {showLink && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/systemupdate" className="flex items-center">
                    <FontAwesomeIcon icon={faUserGear} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">System Update <span className="ml-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">Hi</span></p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Dashboard */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/joms/dashboard" onClick={() => { PendingCount(); OnTravelSet(); }} className="flex items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Dashboard</p>}
                </Link>
              </div>
            </li>

            {/* My Request */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-4 mt-4">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to={`/joms/myrequest`} onClick={() => { PendingCount(); OnTravelSet(); }} className="flex items-center">
                  <FontAwesomeIcon icon={faTableList} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">My Request</p>}
                </Link>
              </div>
            </li>

            {/* Pending Request */}
            {(SuperAdmin || GSO || AdminManager || DivisionManager || AssignPersonnel || PortManager ) && (
            <li className="w-full justify-between text-white cursor-pointer items-center mb-4 mt-4">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full' : ''}`}>
                <Link to={`/joms/pending`} onClick={() => { PendingCount(); OnTravelSet(); }} className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTableList} />
                    {!isSidebarMinimized && (
                      <p className="ml-4 text-lg">Pending Request</p>
                    )}
                  </div>
                  {!isSidebarMinimized && (
                    pendingCount && (
                      <span className="ml-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {pendingCount}
                      </span>
                    )
                  )}
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
              
              {(activeAccordion === 1 || !isSidebarMinimized) && (
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/joms/inspection/form" onClick={() => { PendingCount(); OnTravelSet(); }} >Pre/Post Repair Inspection Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/joms/facilityvenue/form" onClick={() => { PendingCount(); OnTravelSet(); }}>Facility / Venue Request Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center">
                      <Link to="/joms/vehicle/form" onClick={() => { PendingCount(); OnTravelSet(); }}>Vehicle Slip Form</Link>
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

                {(activeAccordion === 2 || !isSidebarMinimized) && (
                  <section>
                    <ul id="menu2" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/inspection" onClick={() => { PendingCount(); OnTravelSet(); }}>Pre/Post Repair Inspection Form</Link>
                      </li>
                      {(!AssignPersonnel || !Authority) && (
                        <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                          <Link to="/joms/facilityvenue" onClick={() => { PendingCount(); OnTravelSet(); }}>Facility / Venue Request Form</Link>
                        </li>
                      )}
                      {(!AssignPersonnel || Authority || SuperAdmin) && (
                        <li className="flex w-full justify-between text-white cursor-pointer items-center">
                          <Link to="/joms/vehicle" onClick={() => { PendingCount(); OnTravelSet(); }}>Vehicle Slip Form</Link>
                        </li>
                      )}
                    </ul>
                  </section>
                )}
              </li>
            )}

            {/* Vehicle */}
            {/* {(SuperAdmin || GSO || AssignPersonnel) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/vehicleavail" onClick={() => { PendingCount(); }} className="flex items-center">
                    <FontAwesomeIcon icon={faList} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Vehicle Slip</p>}
                  </Link>
                </div>
              </li>
            )} */}

            {/* Personnel */}
            {(SuperAdmin || GSO || AssignPersonnel) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/personnel" onClick={() => { PendingCount(); }} className="flex items-center">
                    <FontAwesomeIcon icon={faClipboardUser} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Personnel</p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Vehicle */}
            {(SuperAdmin || GSO || AssignPersonnel) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
                <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                  <Link to="/joms/vehicletype" onClick={() => { PendingCount(); }} className="flex items-center">
                    <FontAwesomeIcon icon={faVanShuttle} />
                    {!isSidebarMinimized && <p className="ml-4 text-lg">Vehicle</p>}
                  </Link>
                </div>
              </li>
            )}

            {/* Announcements */}
            {(SuperAdmin || PortManager || AdminManager || DivisionManager || GSO) && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
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

                {(activeAccordion === 3 || !isSidebarMinimized) && (
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/allannouncement" onClick={() => { PendingCount(); }}>All Announcements Lists</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/addannouncement" onClick={() => { PendingCount(); }}>Add Announcements Data</Link>
                      </li>
                    </ul>
                  </section>
                )}
                
              </li>
            )}

            {/* Superadmin Settings */}
            {SuperAdmin && (
              <li className="w-full justify-between text-white cursor-pointer items-center mb-4">
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

                {(activeAccordion === 4 || !isSidebarMinimized) && (
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/systemstat" onClick={() => { PendingCount(); }}>System Status</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/settings" onClick={() => { PendingCount(); }}>General Settings</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/logs" onClick={() => { PendingCount(); }}>Logs</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/userlist" onClick={() => { PendingCount(); }}>All Employee Lists</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/joms/addemployee" onClick={() => { PendingCount(); }}>Add Employee Data</Link>
                      </li>
                    </ul>
                  </section>
                )}
              </li>
            )}


          </ul>

          {/* Logout Area */}
          <ul className="logout-position mt-10">
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
                  <Link to="/joms/user">{currentUserName?.name}</Link>
                </p> 
              : null }  
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