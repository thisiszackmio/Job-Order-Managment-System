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
      </div>
    </aside>

    {/* --- MAIN CONTENT WRAPPER --- */}
    <main className={`ppa-content transition-width duration-300 relative ${isSidebarMinimized ? 'minimized' : 'not-minimized'}`}>
      <div className="navigation-area z-50 transition-transform duration-300" >

      </div>
    </main>
  </div>
  );
}