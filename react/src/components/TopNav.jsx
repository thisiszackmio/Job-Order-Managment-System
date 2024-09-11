import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import axiosClient from '../axios';
import loading_table from "/public/load_hehe.gif"
import repair from "/public/mechanic.png"
import facilityicon from "/public/request.png"
import { useUserStateContext } from '../context/ContextProvider';

const TopNav = () =>{

  const { currentUserId }= useUserStateContext();

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [count, setCount] = useState([]);

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

  // Get Notification Request
  const fetchNotification = () => {
    axiosClient
    .get(`/notification/${currentUserId.id}`)
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
  
  useEffect(()=>{
    if(currentUserId && currentUserId.id){
      fetchNotification();
    }
  },[currentUserId]);

  // Click the notification
  const OpenLink = (id, redirect_id, type) => {
    axiosClient
      .put(`/read/${id}`)
      .then(() => {
        if (type === 'Request For Pre/Post Inspection Repair') {
          window.location.href = `/joms/inspection/form/${redirect_id}`;
        }
        
        if (type === 'Facility / Venue Request Form') {
          window.location.href = `/joms/facilityvenue/form/${redirect_id}`;
        }
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };


  return (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between" style={{ position: 'relative', left: '-25px' }}>

      {/* Notification Icon */}
      <div className="hidden md:flex items-center">
        <div className="relative">
          <Menu as="div" className="relative">

            {/* Display number of Notification */}
            <div>
              <Menu.Button className="notification-icon">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-7 w-7" aria-hidden="true" />
              </Menu.Button>

              {count.count ? 
                <span className="notifications">{count.count}</span> : 
              null}

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
                <Menu.Items className="absolute font-arial right-0 z-10 mt-2 w-[450px] max-h-[445px] overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <p className="text-xs font-bold text-center leading-7 text-red-500 ml-2">Notifications</p>

                  {loadingNotifications ? (
                    <div className="flex p-8 justify-center items-center">
                      <img className="h-10 w-auto mr-2" src={loading_table} alt="Loading" />
                      <span className="loading-table">Loading Notification</span>
                    </div>
                  ):(
                    <div className="font-roboto">
                    {notifications.length > 0 ? (
                    <>
                      {/* Display "New" title only once */}
                      {notifications.some((NofiData) => NofiData.status === 2) && (
                        <p className="text-base font-bold text-left leading-7 p-4">Unread</p>
                      )}

                      {notifications.map((NofiData, index) => (
                        <div key={NofiData.id} className="notification-item">
                          {NofiData.status === 2 && (
                            <a onClick={() => OpenLink(NofiData.id, NofiData.joms_id, NofiData.joms_type)} className="noti-link">
                              <div className="flex notification-container p-4">
                                <div className="w-32 items-center relative">
                                  <img src={NofiData.sender_avatar} className="notification_avatar" alt={`${NofiData.sender_name}'s avatar`} />
                                  <img src={
                                    NofiData.joms_type == "Request For Pre/Post Inspection Repair" ? repair : 
                                    NofiData.joms_type == "Facility / Venue Request Form" ? facilityicon :
                                    null 
                                    } className="notification_icon" alt={`${NofiData.sender_name}'s avatar`} /> 
                                </div>
                                <div className="w-full">
                                  <h4 className="noti-type">{NofiData.joms_type}</h4>
                                  <h3 className="noti-message">{NofiData.message}</h3>
                                  <h4 className="text-sm text-blue-500 font-bold">{formatTimeDifference(NofiData.date_request)}</h4>
                                </div>
                              </div>
                            </a>
                          )}
                        </div>
                      ))}

                      {/* Display "Recent" title only once */}
                      {notifications.some((NofiData) => NofiData.status === 1) && (
                        <p className="text-base font-bold text-left leading-7 p-4">Recent</p>
                      )}

                      {notifications.map((NofiData, index) => (
                        <div key={NofiData.id} className="notification-item">
                          {NofiData.status === 1 && (
                            <a onClick={() => window.location.href = `/joms/inspection/form/${NofiData.joms_id}`}className="noti-link">
                              <div className="flex notification-container p-4">
                                <div className="w-32 items-center relative">
                                  <img src={NofiData.sender_avatar} className="notification_avatar" alt={`${NofiData.sender_name}'s avatar`} />
                                  <img src={
                                    NofiData.joms_type == "Request For Pre/Post Inspection Repair" ? repair : 
                                    NofiData.joms_type == "Facility / Venue Request Form" ? facilityicon :
                                    null
                                  } className="notification_icon" alt={`${NofiData.sender_name}'s avatar`} /> 
                                </div>
                                <div className="w-full">
                                  <h4 className="noti-type">{NofiData.joms_type}</h4>
                                  <h3 className="noti-message">{NofiData.message}</h3>
                                  <h4 className="text-sm text-blue-500 font-bold">{formatTimeDifference(NofiData.date_request)}</h4>
                                </div>
                              </div>
                            </a>
                          )}
                        </div>
                      ))}

                    </>
                    ):(
                    <>
                      <p className="text-base font-bold text-center leading-7">No Notifications</p>
                    </>
                    )}
                    </div>
                  )}

                </Menu.Items>
              </Transition>
            </div>
            
          </Menu>
        </div>
      </div>

    </div>
  </div>
  )
};

export default TopNav;