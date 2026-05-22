import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { BellIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faClipboard, faUsers, faFileLines, faBars, faTachometerAlt, faUserPlus, faAddressBook, faVanShuttle, faUserGear, faGears, faGear, faList } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";
import Footer from "./Footer";
import ppalogomini from '/default/img/logo-no-words.png';
import axiosClient from "../axios";
import { Menu, Transition } from "@headlessui/react";
import loading_table from "/default/img/ring-loading.gif";
import VehicleSlip from "/default/img/van.png";
import repair from "/default/img/mechanic.png"
import facilityicon from "/default/img/booking.png"
import Popup from "./Popup";

export default function JOMSLayout() {
  const { currentUserId, currentUserAvatar, setCurrentUserToken, currentUserCode } = useUserStateContext();

  //Time stamp notification
  function formatTimeDifference(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
  
    const diffMilliseconds = now - date;
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
  
    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }
  
  // For Maintenance Mode
  const [maintenance, setMaintenance] = useState(false);
  useEffect(() => {
    axiosClient.get("settings/maintenance").then(response => {
      setMaintenance(response.data.maintenance);
    });
  }, []);

  // For Sticky Nav
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false); // scroll down
      } else {
        setShowNav(true); // scroll up
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const title = currentMatch?.handle?.title || "";

  useEffect(() => {
    if (title) {
      document.title = `${title} | JOMS`;
    }
  }, [title]);

  // --- For the Notification --- //
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const fetchNotification = async () => {
    try{
      const response = await axiosClient.get(`/notification/${currentUserId}`);
      const dataNotification = response.data;

      // console.log(dataNotification.count);
      if(dataNotification){
        setNotifications(dataNotification.notifications);
        setCount(dataNotification.count)
      }

    } catch(error){
      console.error(error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  useEffect(() => {
    if(!currentUserId) return;

    fetchNotification();

    const interval = setInterval(() => {
      fetchNotification();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);

  }, [currentUserId]);

  // Click the notification
  const OpenLink = (id, redirect_id, type) => {
    axiosClient
      .put(`/read/${id}`)
      .then(() => {
        if (type === 'JOMS_Inspection') {
          window.location.href = `/joms/inspection/form/${redirect_id}`;
        }
      
        if (type === 'JOMS_Vehicle') {
          window.location.href = `/joms/vehicle/form/${redirect_id}`;
        }

        if (type === 'JOMS_Facility') {
          window.location.href = `/joms/facilityvenue/form/${redirect_id}`;
        }
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState(null);

  const isSidebarExpanded = !isSidebarMinimized || isSidebarHovered;
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  // Detect Mobile Screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkScreen(); // run on load
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  //Force close the sidebar
  useEffect(() => {
    if (isMobile) {
      setIsSidebarMinimized(true);
      setActiveAccordion(null);
    }
  }, [isMobile]);

  // Showlink Date
  useEffect(() => {
    const now = new Date();
    const startDate = new Date("2025-02-13");
    const endDate = new Date("2026-02-28");

    if (now >= startDate && now <= endDate) {
      setShowLink(true);
    }
  }, []);

  // JOMS
  const words = [
    { letter: "J", word: "ob" },
    { letter: "O", word: "rder" },
    { letter: "M", word: "anagement" },
    { letter: "S", word: "ystem" }
  ];

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

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

  function logout(ev){
    if (ev) ev.preventDefault();
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

  // Close Accordion of sidebar
  useEffect(() => {
    if (isSidebarMinimized) {
      setActiveAccordion(null);
    }
  }, [isSidebarMinimized, setActiveAccordion]);

  // Restrictions
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = codes.includes("HACK");
  const ITAdmin = codes.includes("AUS");
  const AuthorizePersonnel = codes.includes("AP");
  const PortManager = codes.includes("PM");
  const AdminManager = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const DivisionManager = codes.includes("DM");
  const InspectionAuthorize = codes.includes("AUI");
  const FacilityAuthorize = codes.includes("AUF");
  const VehicleAuthorize = codes.includes("AUV");

  return(
  <div className="ppa-page font-roboto">
    {/* Sidebar */}
    <aside 
      className={`
        ppa-sidebar shadow-xl flex transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? "sidebar-open" : "sidebar-close"}
      `}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <div className={`${isSidebarMinimized ? 'minimized' : 'not-minimized'} w-full`}>
        {/* Logo Area */}
        <div className={`themelogo ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <img
            src={ppalogomini}
            alt="Mini Logo"
            className="ppa-logo"
          />
          <span className={`logo-text ${isSidebarExpanded ? "show" : "hide"}`}>
            PPA PMO LNI
          </span>
        </div>
        <hr className={`line-separate ${isSidebarExpanded ? "full" : "mini"}`} />
        {/* System Name */}
        <div className={`text-title mb-5 mt-5 ${isSidebarExpanded ? "full" : "mini"}`}>
          {words.map((item, index) => (
            <div key={index} className="title-row">
              <span className="first-letter">{item.letter}</span>
              <span className={`word-part ${isSidebarExpanded ? "show" : "hide"}`}>
                {item.word}
              </span>
            </div>
          ))}
        </div>
        <hr className={`line-separate ${isSidebarExpanded ? "full" : "mini"}`} />
        {/* Navigation */}
        <ul className={`ppa-accordion mt-5 ${isSidebarMinimized ? 'nav-min':''}`}>
          {/* Relase Note */}
          {showLink && (
            <li className={`sidebar-item ${
              isSidebarExpanded ? "full" : "mini"
              } ${pathname === "/joms/systemupdate" ? "nav-active" : "not-active"}`}
            >
              <Link to="/joms/systemupdate" className="sidebar-link">
                <FontAwesomeIcon icon={faUserGear} className="ppa-icon" />
                <span className="sidebar-text">System Update</span>
              </Link>
            </li>
          )}

          {/* Dashboard */}
          <li className={`sidebar-item mt-1 ${
              isSidebarExpanded ? "full" : "mini"
            } ${pathname === "/joms/dashboard" ? "nav-active" : "not-active"}`}
          >
            <Link to="/joms/dashboard" className="sidebar-link">
              <FontAwesomeIcon icon={faTachometerAlt} className="ppa-icon" />
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>

          {/* My Request */}
          <li className={`sidebar-item mt-1 ${
              isSidebarExpanded ? "full" : "mini"
            } ${pathname === "/joms/myrequest" ? "nav-active" : "not-active"}`}
          >
            <Link to="/joms/myrequest" className="sidebar-link">
              <FontAwesomeIcon icon={faClipboard} className="ppa-icon" />
              <span className="sidebar-text">My Request</span>
            </Link>
          </li>

          {/* Pending Request */}
          {(SuperAdmin || ITAdmin || AuthorizePersonnel || PortManager || AdminManager || DivisionManager || GSO ) && (
            <li className={`sidebar-item mt-1 ${
                isSidebarExpanded ? "full" : "mini"
              } ${pathname === "/joms/pending" ? "nav-active" : "not-active"}`}
            >
              <Link to="/joms/pending" className="sidebar-link">
                <FontAwesomeIcon icon={faClipboard} className="ppa-icon" />
                <span className="sidebar-text">Pending Request</span>
              </Link>
            </li>
          )}

          {/* Request Form */}
          <li className={`sidebar-item cursor-pointer mt-1 ${
              isSidebarExpanded ? "full" : "mini"
            } 
            ${location.pathname === "/joms/inspection/form" || 
              location.pathname === "/joms/facilityvenue/form" || 
              location.pathname === "/joms/vehicle/form" || 
              location.pathname === "/joms/locator/form" ? "nav-active" : "not-active"}
            `}
          >
            <div className="sidebar-link" onClick={() => isSidebarExpanded && handleToggle(1)} >
              <FontAwesomeIcon icon={faClipboard} className="ppa-icon" />
              <span className="sidebar-text">Request Forms</span>

              {isSidebarExpanded && (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`icon-arrow ${activeAccordion === 1 ? "rotate" : ""}`}
                />
              )}
            </div>
          </li>

          {/* For Request Form Section */}
          <section className={`accordion-content ${activeAccordion === 1 ? "open" : "" } ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
            <ul>
              {/* Pre/Post Repair Inspection Form */}
              <li className="mt-2">
                <Link to="/joms/inspection/form"
                  className={`submenu-item 
                    ${isSidebarExpanded ? "full" : "mini"}
                    ${location.pathname === "/joms/inspection/form" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                  {isSidebarExpanded && (
                    <span className="submenu-text">Pre/Post Repair Inspection Form</span>
                  )}
                </Link>
              </li>

              {/* Facility / Venue Request Form */}
              <li className="mt-1">
                <Link to="/joms/facilityvenue/form"
                  className={`submenu-item 
                    ${isSidebarExpanded ? "full" : "mini"}
                    ${location.pathname === "/joms/facilityvenue/form" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                  {isSidebarExpanded && (
                    <span className="submenu-text">Facility / Venue Request Form</span>
                  )}
                </Link>
              </li>

              {/* Vehicle Slip Form */}
              <li className="mt-1">
                <Link  to="/joms/vehicle/form" 
                  className={`submenu-item 
                    ${isSidebarExpanded ? "full" : "mini"}
                    ${location.pathname === "/joms/vehicle/form" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                  {isSidebarExpanded && (
                    <span className="submenu-text">Vehicle Slip Form</span>
                  )}
                  
                </Link>
              </li>

              {/* Locator Slip Form */}
              {/* <li className="mt-1">
                <Link  to="/joms/locator/form" 
                  className={`submenu-item 
                  ${isSidebarExpanded ? "full" : "mini"}
                  ${location.pathname === "/joms/locator/form" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                  <span className="submenu-text">Locator Slip Form</span>
                </Link>
              </li> */}
            </ul>
          </section>

          {/* Request List */}
          {(SuperAdmin || ITAdmin || AuthorizePersonnel || PortManager || AdminManager || DivisionManager || GSO || InspectionAuthorize || FacilityAuthorize || VehicleAuthorize ) && (
            <li className={`sidebar-item cursor-pointer mt-1 ${
                isSidebarExpanded ? "full" : "mini"
              } 
              ${location.pathname === "/joms/inspection" || 
                location.pathname === "/joms/facilityvenue" || 
                location.pathname === "/joms/vehicle" || 
                location.pathname === "/joms/locator" ? "nav-active" : "not-active"}
              `}
            >
              <div className="sidebar-link" onClick={() => isSidebarExpanded && handleToggle(2)} >
                <FontAwesomeIcon icon={faClipboard} className="ppa-icon" />
                <span className="sidebar-text">Request List</span>

                {isSidebarExpanded && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`icon-arrow ${activeAccordion === 2 ? "rotate" : ""}`}
                  />
                )}
              </div>
            </li>
          )}

          {/* For Request List Section */}
          <section className={`accordion-content ${activeAccordion === 2 ? "open" : "" } ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
            <ul>
              {/* Pre/Post Repair Inspection Form */}
              {(SuperAdmin || ITAdmin || PortManager || AdminManager || DivisionManager || GSO || InspectionAuthorize) && (
                <li className="mt-2">
                  <Link to="/joms/inspection"
                    className={`submenu-item 
                      ${isSidebarExpanded ? "full" : "mini"}
                      ${location.pathname === "/joms/inspection" ? "sub-active" : "not-active"}`}
                  >
                    <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                    <span className="submenu-text">Pre/Post Repair Inspection Form</span>
                  </Link>
                </li>
              )}

              {/* Facility / Venue Request Form */}
              {(SuperAdmin || ITAdmin || PortManager || AdminManager || DivisionManager || GSO || FacilityAuthorize) && (
                <li className="mt-1">
                  <Link to="/joms/facilityvenue"
                    className={`submenu-item 
                      ${isSidebarExpanded ? "full" : "mini"}
                      ${location.pathname === "/joms/facilityvenue" ? "sub-active" : "not-active"}`}
                  >
                    <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                    <span className="submenu-text">Facility / Venue Request Form</span>
                  </Link>
                </li>
              )}

              {/* Vehicle Slip Form */}
              {(SuperAdmin || ITAdmin || PortManager || AdminManager || DivisionManager || GSO || VehicleAuthorize || AuthorizePersonnel) && (
                <li className="mt-1">
                  <Link  to="/joms/vehicle" 
                    className={`submenu-item 
                      ${isSidebarExpanded ? "full" : "mini"}
                      ${location.pathname === "/joms/vehicle" ? "sub-active" : "not-active"}`}
                  >
                    <FontAwesomeIcon icon={faFileLines} className="ppa-icon" />
                    <span className="submenu-text">Vehicle Slip Form</span>
                  </Link>
                </li>
              )}
            </ul>
          </section>

          {/* Users */}
          {(SuperAdmin || ITAdmin) && (
            <li className={`sidebar-item cursor-pointer mt-1 ${
                isSidebarExpanded ? "full" : "mini"
              } 
              ${location.pathname === "/joms/userlist" || 
                location.pathname === "/joms/addemployee" ? "nav-active" : "not-active"}
              `}
            >
              <div className="sidebar-link" onClick={() => isSidebarExpanded && handleToggle(3)} >
                <FontAwesomeIcon icon={faUsers} className="ppa-icon" />
                <span className="sidebar-text">Users</span>

                {isSidebarExpanded && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`icon-arrow ${activeAccordion === 3 ? "rotate" : ""}`}
                  />
                )}
              </div>
            </li>
          )}

          {/* For User's List Section */}
          <section className={`accordion-content ${activeAccordion === 3 ? "open" : "" } ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
            <ul>
              {/* Add User */}
              <li className="mt-2">
                <Link to="/joms/addemployee"
                  className={`submenu-item 
                    ${isSidebarExpanded ? "full" : "mini"}
                    ${location.pathname === "/joms/addemployee" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="ppa-icon" />
                  <span className="submenu-text">Add User</span>
                </Link>
              </li>

              {/* All User */}
              <li className="mt-1">
                <Link to="/joms/userlist"
                  className={`submenu-item 
                    ${isSidebarExpanded ? "full" : "mini"}
                    ${location.pathname === "/joms/userlist" ? "sub-active" : "not-active"}`}
                >
                  <FontAwesomeIcon icon={faAddressBook} className="ppa-icon" />
                  <span className="submenu-text">All User</span>
                </Link>
              </li>
            </ul>
          </section>

          {/* Users */}
          {(SuperAdmin || ITAdmin || VehicleAuthorize || AuthorizePersonnel || GSO || PortManager || AdminManager) && (
            <li className={`sidebar-item mt-1 ${
                isSidebarExpanded ? "full" : "mini"
              } ${pathname === "/joms/traveldetails" ? "nav-active" : "not-active"}`}
            >
              <Link to="/joms/traveldetails" className="sidebar-link">
                <FontAwesomeIcon icon={faVanShuttle} className="ppa-icon" />
                <span className="sidebar-text">Vehicle & Personnel <br/> Details</span>
              </Link>
            </li>
          )}

          {/* Superadmin Settings */}
          {SuperAdmin && (
            <li className={`sidebar-item cursor-pointer mt-1 ${
                isSidebarExpanded ? "full" : "mini"
              } 
              ${location.pathname === "/joms/settings" ||
                location.pathname === "/joms/logs"  ? "nav-active" : "not-active"}
              `}
            >
              <div className="sidebar-link" onClick={() => isSidebarExpanded && handleToggle(4)} >
                <FontAwesomeIcon icon={faGears} className="ppa-icon" />
                <span className="sidebar-text">Settings</span>

                {isSidebarExpanded && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`icon-arrow ${activeAccordion === 4 ? "rotate" : ""}`}
                  />
                )}
              </div>
            </li>
          )}

          {/* For Settings Section */}
          <section className={`accordion-content ${activeAccordion === 4 ? "open" : "" } ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
            <li className="mt-2">
              <Link to="/joms/settings"
                className={`submenu-item 
                  ${isSidebarExpanded ? "full" : "mini"}
                  ${location.pathname === "/joms/settings" ? "sub-active" : "not-active"}`}
              >
                <FontAwesomeIcon icon={faGear} className="ppa-icon" />
                <span className="submenu-text">General Settings</span>
              </Link>
            </li>

            <li className="mt-2">
              <Link to="/joms/logs"
                className={`submenu-item 
                  ${isSidebarExpanded ? "full" : "mini"}
                  ${location.pathname === "/joms/logs" ? "sub-active" : "not-active"}`}
              >
                <FontAwesomeIcon icon={faList} className="ppa-icon" />
                <span className="submenu-text">Logs</span>
              </Link>
            </li>
          </section>

        </ul>
      </div>
    </aside>

    {/* --- MAIN CONTENT WRAPPER --- */}
    <main className={`ppa-content transition-width duration-300 relative ${isSidebarMinimized ? 'minimized' : 'not-minimized'}`}>
      <div className="navigation-area z-50 transition-transform duration-300" >
        <h1 className="page-title">{title}</h1>
        {/* Notification Icon */}
        <div className="notification-area">
          <div className="relative">
            <Menu as="div" className="relative">
              {/* Display number of Notification */}
              <div>
                <Menu.Button className="notification-icon">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="bell-icon" aria-hidden="true" />
                </Menu.Button>
              </div>
              {/* Count */}
              {!maintenance && (
                !loadingNotifications ? (
                  count ? (
                    count > 10 ? (
                      <span className="notification-count">9+</span>
                    ):(
                      <span className="notification-count">{count}</span>
                    )
                  ) : null
                ):null
              )}
              {/* Display the message of notification */}
              <div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="mobile-nav absolute right-0 z-10 mt-2 w-[450px] max-h-[450px] overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {maintenance ? (
                      <p className="text-base font-bold text-center leading-7 py-4">Notification is disable on Maint Mode</p>
                    ):(
                    <>
                      <p className="notification-text font-roboto pl-3">Notifications</p>
                      {notifications?.length > 0 ? (
                        notifications?.map(NofiData => (
                          <div key={NofiData?.id} className="notification-item">
                            <a onClick={() => OpenLink(NofiData?.id, NofiData?.joms_id, NofiData?.joms_type)} className="noti-link">
                              <div className="flex notification-container p-3 font-roboto">
                                {/* Image and Icon */}
                                <div className="w-32 items-center relative">
                                  <img src={NofiData?.sender_avatar} className="notification_avatar" alt={`${NofiData?.sender_name}'s avatar`} />
                                  <img src={
                                    NofiData?.joms_type == "JOMS_Vehicle" ? VehicleSlip : 
                                    NofiData?.joms_type == "JOMS_Inspection" ? repair : 
                                    NofiData?.joms_type == "JOMS_Facility" ? facilityicon : 
                                    null
                                  } className="notification_icon" alt='Avatar' /> 
                                </div>
                                {/* Message */}
                                <div className="w-full">
                                  <h4 className={`noti-type ${ NofiData?.status === 1 ? 'noti-read' : ''} `}>
                                    {NofiData?.joms_type == 'JOMS_Vehicle' && `Vehicle Slip Request (Vehicle Slip No ${NofiData?.joms_id})`}
                                    {NofiData?.joms_type == 'JOMS_Inspection' && `Pre/Post Repair Inspection Form: (Control No ${NofiData?.joms_id})`}
                                    {NofiData?.joms_type == 'JOMS_Facility' && `Facility / Venue Form: (Control No ${NofiData?.joms_id})`}
                                  </h4>
                                  <h3 className={`noti-message ${ NofiData?.status === 1 ? 'noti-read' : ''} `}>{NofiData?.message}</h3>
                                  <h4 className="text-sm text-blue-500 font-bold">{formatTimeDifference(NofiData?.date_request)}</h4>
                                </div>
                              </div>
                            </a>
                          </div>
                        ))
                      ):(
                        <p className="text-base font-bold text-center leading-7 py-4">No Notifications</p>
                      )}
                    </>
                    )}
                  </Menu.Items>
                </Transition>
              </div>
            </Menu>
          </div>
        </div>
        {/* Hamburger */}
        <div className="ppa-hamburger">
          <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} className="text-white">
            <FontAwesomeIcon icon={faBars} className="ham-haha" />
          </button>
        </div>
        {/* Profile */}
        <div className="profile">
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
      </div>

      {/* For the main content */}
      <div className="content-here">
        <Outlet />
      </div>
      <Footer />
    </main>
    
    {showPopup && (
    <Popup 
      popupContent={popupContent}
      popupMessage={popupMessage}
      submitLoading={submitLoading}
      submitAnimation={loading_table}
      logout={logout}
      justClose={justClose}
      userId={currentUserId}
    />
    )}
  </div>
  );
}