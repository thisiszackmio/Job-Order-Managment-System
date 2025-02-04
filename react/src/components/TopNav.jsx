import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline'
import axiosClient from '../axios';
import loading_table from "/default/ring-loading.gif";
import VehicleSlip from "/default/Vehicle_Slip.png";
import repair from "/default/mechanic.png"
import facilityicon from "/default/schedule.png"

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

  // Get Notification Request
  const fetchUnreadNotification = () => {
    axiosClient
    .put(`/unread/${currentUserId.id}`)
    .then(response => {
      console.log(response.data.message); // Show success message
    })
    .catch(error => {
      console.error("Error updating notifications:", error);
    });
  }
  
  useEffect(()=>{
    if(currentUserId && currentUserId.id){
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

  const handleIconClick = () => {
    // Reset the notification count
    setCount(null);
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
              <Menu.Button className="notification-icon" onClick={handleIconClick}>
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-7 w-7" aria-hidden="true" />
              </Menu.Button>

              {count?.count ? (
                <span className="notifications">
                    {count?.count > 9 ? '9+' : count?.count}
                </span>
              ) : null}

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

                <Menu.Items className="absolute right-0 z-10 mt-2 w-[450px] max-h-[450px] overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <p className="notification-text font-roboto pl-3">Notifications</p>
                  {loadingNotifications ? (
                    <div className="flex p-8 justify-center items-center">
                      <img className="h-7 w-auto mr-1" src={loading_table} alt="Loading" />
                      <span className="loading-table">Loading Notification</span>
                    </div>
                  ):(
                  <>
                    {notifications?.length > 0 ? (
                      <div>
                        {notifications?.map((NofiData) => (
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
                        ))}
                      </div>
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

    </div>
  </div>
  )
};

export default TopNav;