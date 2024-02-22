import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useUserStateContext } from '../context/ContextProvider'
import axiosClient from '../axios'
import ppaLogo from '/ppa_logo.png';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DefaultLayout() {

  const [isLoading , setLoading] = useState(false);

  const { currentUser, userToken, userRole , setCurrentUser, setUserToken } = useUserStateContext();
  const [getSupNoti, setSupNoti] = useState([]);
  const [getGSONoti, setGSONoti] = useState([]);
  const [getAdminNoti, setAdminNoti] = useState([]);
  const [getPersoNoti, setPersoNoti] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navigate = useNavigate();

  // Function to format the date as "Month Day, Year"
  function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

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

  const navigation = [
    { name: 'Dashboard', to: '/' },
    { name: 'Request Form', 
      submenu: [
        { name: 'Pre/Post Repair Inspection Form', to: `/repairrequestform/${currentUser.id}` },
        { name: 'Facility / Venue Form', to: `/facilityrequestform/${currentUser.id}` },
        { name: 'Vehicle Slip Form', to: `/vehiclesliprequestform/${currentUser.id}` },
      ],
    },
    {
      name: 'My Request',
      submenu: [
        { name: 'Pre/Post Repair Inspection Form', to: `/myrequestinpectionform/${currentUser.id}` },
        { name: 'Facility / Venue Form', to: `/myrequestfacilityvenueform/${currentUser.id}` },
        { name: 'Vehicle Slip Form', to: `/myrequestvehicleslipform/${currentUser.id}` },
      ],
    },
    ...(currentUser.code_clearance == '1' || currentUser.code_clearance == '2' || currentUser.code_clearance == '3' || currentUser.code_clearance == '4' || currentUser.code_clearance == '10'
      ? [
          {
            name: 'Request List',
            submenu: [
              { name: 'Pre/Post Repair Inspection Form', to: '/repairrequestform' },
              { name: 'Facility / Venue Form', to: '/facilityvenuerequestform' },
              { name: 'Vehicle Slip Form', to: '/vehiclesliprequestform' },
            ],
          },
        ]
      : []),
      ...(currentUser.code_clearance == '6'
      ? [
          {
            name: 'Request List',
            submenu: [
              { name: 'Pre/Post Repair Inspection Form', to: '/repairrequestform' },
              // { name: 'Facility / Venue Form', to: '/facilityvenuerequestform' },
              // { name: 'Vehicle Slip Form', to: '/vehiclesliprequestform' },
            ],
          },
        ]
      : []),
    ...(currentUser.code_clearance == '10'
      ? [{ name: 'Personnel', to: '/account' }]
      : []),
  ].filter(Boolean);

  // Function to check if a submenu item is active
  const isSubmenuActive = (submenuItem) => {
    return window.location.pathname.startsWith(submenuItem.to);
  };

  // Function to determine if "Personnel" is active
  const isPersonnelActive = navigation.find((item) => {
    if (item.submenu) {
      return item.submenu.some(isSubmenuActive);
    } else {
      return isSubmenuActive(item);
    }
  });

  if(!userToken){
    return <Navigate to='login'/>
  }

  const logout = () => {
    // Perform the logout logic
    axiosClient.post('/logout').then((response) => {
      setCurrentUser({});
      setUserToken(null);

      // Redirect to the login page using the navigate function
      navigate('/login');
    });
  };

  
  

  

  const handleLinkClick = () => {
    setLoading(true);
    fetchSupNoti();
    fetchGSONoti();
    fetchAdminNoti();
    fetchPersonnelNoti();
  };

  //Notification Popup
  //Admin
  const haveAdminNotifications = (
    getAdminNoti?.mappedInsData?.length > 0 || 
    getAdminNoti?.mappedFacData?.length > 0 ||
    getAdminNoti?.mappedVehData?.length > 0
  );

  //GSO
  const haveGSONotifications = (
    getGSONoti?.mappedInsData?.length > 0 ||
    getGSONoti?.mappedFacData?.length > 0 ||
    getGSONoti?.mappedVehData?.length > 0
  );

  //Count Notification number
  //Admin
  const totalAdminNotifications = (
    getAdminNoti?.mappedInsData?.length +
    getSupNoti?.mappedInsSupData?.length +
    getAdminNoti?.mappedFacData?.length +
    getAdminNoti?.mappedVehData?.length
  );

  //GSO
  const totalGSONotifications = (
    getGSONoti?.mappedInsData?.length + 
    getGSONoti?.mappedFacData?.length +
    getGSONoti?.mappedVehData?.length
  );

  return isLoading ? (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
    <img
      className="mx-auto h-44 w-auto"
      src={loadingAnimation}
      alt="Your Company"
    />
    <span className="ml-2 animate-heartbeat">Loading</span>
  </div>
  ):(
  <>
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-ppa-themecolor">
      <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">

            {/* Logo */}
            <div className="flex-shrink-0">
              <img className="h-14 w-auto" src={ppaLogo} alt="PPA PMO/LNI" />
            </div>

            {/* Navigation Bar */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  if (item.submenu) {
                    const isSubmenuActive = activeSubmenu === item.name;

                    // Render submenu items based on activeSubmenu state
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onClick={() => {
                          setActiveSubmenu(isSubmenuActive ? null : item.name);
                        }}
                      >
                        {item.submenu ? (
                          <div className="cursor-pointer">
                            <div className="text-white rounded-md px-3 py-2 text-sm font-medium">
                              {item.name}
                            </div>
                          </div>
                        ) : (
                          <NavLink
                            to={item.to}
                            onClick={() => {
                              setActiveSubmenu(null); // Reset submenu when NavLink is clicked
                            }}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'ppa-theme-active text-white'
                                  : 'text-white',
                                  'rounded-md px-3 py-2 text-sm font-medium'
                              )
                            }
                          >
                            {item.name}
                          </NavLink>
                        )}
                        {isSubmenuActive && (
                          // For Submenu
                  
                          <ul className="absolute left-0 w-60 mt-2 py-2 bg-white rounded-md shadow-lg">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.name}>
                                <NavLink
                                  to={subItem.to}
                                  onClick={() => {
                                    setActiveSubmenu(null); // Reset submenu when NavLink in submenu is clicked
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {subItem.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else {
                    // Render regular navigation items
                    return (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={() => {
                          setActiveSubmenu(null); // Reset submenu when NavLink is clicked
                        }}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'ppa-theme-active text-white'
                              : 'text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    );
                  }
                })}
              </div>
            </div>

          </div>

          <div className="hidden md:block">

            <div className="ml-4 flex items-center md:ml-6">

              {/* Notification dropdown */}
              <div className="relative ml-3">
                <Menu as="div" className="relative ml-3">

                  {/* Notification Number */}
                  
                  
                  {/* Notification Message */}
                  
                </Menu>
                
              </div>       

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-5">
                <div>
                  <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <a
                          href="#"
                          onClick={logout}
                          className={'block px-4 py-2 text-sm text-gray-700 bg-gray-100'}
                        >
                          Sign out
                        </a>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </div>
              </Menu>

            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>

        </div>
      </div>

      <Disclosure.Panel className="md:hidden">

        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              href={item.href}
              className={({ isActive }) => classNames(
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="border-t border-gray-700 pb-3 pt-4">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
                <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
              {/* <img className="h-10 w-10 rounded-full" src={currentUser.imageUrl} alt="" /> */}
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-white">{currentUser.fname} {currentUser.lname}</div>
              <div className="text-sm font-medium leading-none text-gray-400">{currentUser.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
              <Disclosure.Button
                as="a"
                href="#"
                onClick={(ev) => logout(ev)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign Out
              </Disclosure.Button>
          </div>
        </div>

      </Disclosure.Panel>
      </>
      </Disclosure>

      <Outlet />
    </div>
  </>
  );
}
