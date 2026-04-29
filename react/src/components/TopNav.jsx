import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline'
import axiosClient from '../axios';
import loading_table from "/default/img/ring-loading.gif";
import VehicleSlip from "/default/img/van.png";
import repair from "/default/img/mechanic.png"
import facilityicon from "/default/schedule.png"
import submitAnimation from '/default/ring-loading.gif';
import { useUserStateContext } from '../context/ContextProvider';
import Popup from './Popup';

const TopNav = () =>{
  const { currentUserId, currentUserAvatar, setCurrentUserToken }= useUserStateContext();

  // For Sticky Nav
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down
        setShowNav(false);
      } else {
        // scrolling up
        setShowNav(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [count, setCount] = useState([]);

  const [maintenance, setMaintenance] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);

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
  useEffect(() => {
    axiosClient.get("settings/maintenance").then(response => {
      setMaintenance(response.data.maintenance);
    });
  }, []);

  // Get Notification Request
  const fetchNotification = () => {
    axiosClient
    .get(`/notification/${currentUserId}`)
    .then((response) => {
      const responseData = response.data;
      const notification = responseData.notifications;
      const count = responseData.count;

      //setSupervisor({supervisorData});
      setNotifications(notification);
      setCount({count});
    })
    .finally(() => {
      setLoadingNotifications(false);
    });
  }

  // Unread Notification Request
  const fetchUnreadNotification = () => {
    axiosClient
    .put(`/unread/${currentUserId}`)
    .then(response => {
      console.log(response.data.message); // Show success message
    })
    .catch(error => {
      console.error("Error updating notifications:", error);
    });
  }

  useEffect(()=>{
    if(currentUserId){
      fetchNotification();
      fetchUnreadNotification();
    }
  },[currentUserId]);

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

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

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

  return (
    <div
      className={`navigation-area fixed z-50 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full top-0"
      }`}
    >
      <div className="topnav-area sticky top-0 z-50">
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

                {!maintenance && (
                  count?.count ? (
                    <span className="notifications">
                      
                        {count?.count > 10 ? '10+' : count?.count}
                    </span>
                  ) : null
                )}

              </div>

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
                      {loadingNotifications ? (
                        <div className="flex p-8 justify-center items-center">
                          <img className="h-7 w-auto mr-1" src={loading_table} alt="Loading" />
                          <span className="loading-table">Loading Notification</span>
                        </div>
                      ):(
                        notifications?.length > 0 ? (
                          notifications?.map((NofiData) => (
                            <div>
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
                                      } className="notification_icon" alt={`${NofiData?.sender_name}'s avatar`} /> 
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
                            </div>
                          ))
                        ):(
                          <p className="text-base font-bold text-center leading-7 py-4">No Notifications</p>
                        )
                      )}
                    </>
                    )}
                  </Menu.Items>

                </Transition>
              </div>

            </Menu>
          </div>
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
};

export default TopNav;