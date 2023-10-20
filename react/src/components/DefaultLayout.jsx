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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DefaultLayout() {
  const { currentUser, userToken, userRole , setCurrentUser, setUserToken } = useUserStateContext();
  const[displayRequest, setDisplayRequest] = useState([]);

  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', to: '/' },
    { name: 'Request Form', to: '/request_form' },
    { name: 'My Request', to: `/my_request/${currentUser.id}` },
    currentUser.code_clearance === 6 || 
    currentUser.code_clearance === 3 || 
    currentUser.code_clearance === 1 ? 
    { name: 'Request List', to: '/request_list' } : null
  ].filter(Boolean);


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

  // const GetNotification = () => {
  //   axiosClient
  //   .get('/getnotification')
  //   .then((response) => {
  //     const responseData = response.data;

  //     // Filter notifications where receiver_id matches currentUser.id
  //     const filteredData = responseData.filter((dataItem) => {
  //       return dataItem.receiver_id === currentUser.id;
  //     });

  //     const mappedData = filteredData.map((dataItem) => {
  //       return {
  //         id: dataItem.id,
  //         receiver_id: dataItem.receiver_id,
  //         message: dataItem.message,
  //         subject: dataItem.subject,
  //         url: dataItem.url,
  //         status: dataItem.get_status,
  //       };
  //     });

  //     setDisplayRequest(mappedData);
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching notifications:', error);
  //   });
  // };

  // useEffect(() => { 
  //   GetNotification(); 
  // }, []);

  // const handleLinkClick = (id, url) => {
  //   axiosClient
  //     .put(`/setstatus/${id}`)
  //     .then((response) => {
  //       GetNotification();
  //       //setDisplayRequest();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )
                            }
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Notification dropdown (Temp Shut down) */}
                      {/* <div className="relative ml-3">
                        <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          </Menu.Button>
                          {
                            displayRequest.filter(
                              (item) => item.receiver_id === currentUser.id && item.status === 0
                            ).length > 0 ? (
                              <span
                                style={{
                                  color: '#ffff',
                                  backgroundColor: '#ff0000',
                                  borderRadius: '25px',
                                  padding: '12px 8px',
                                  lineHeight: '0px',
                                  fontSize: '14px',
                                  display: 'inline',
                                  position: 'absolute',
                                  left: '17px',
                                  top: '-6px',
                                }}
                              >
                                {displayRequest.filter((item) => item.receiver_id === currentUser.id && item.status === 0).length}
                              </span>
                            ) : null
                          }

                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {displayRequest.length > 0 ? (
                            <>
                              <div>
                                {displayRequest.some((getData) => getData.status === 0) && (
                                  <p className="text-xs font-bold leading-7 text-red-500 ml-2">New Notifications</p>
                                )}

                                {displayRequest.map((getData) => (
                                  getData.status === 0 && (
                                    <Menu.Item key={getData.id}>
                                      <Link
                                        to={getData.url}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleLinkClick(getData.id, getData.url);
                                        }}
                                        className={`block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-blue-200 hover:text-blue-800`}
                                        title="View Request"
                                      >
                                        <b>{getData.subject}:</b>
                                        <p>{getData.message}</p>
                                      </Link>
                                    </Menu.Item>
                                  )
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-bold leading-7 text-red-500 ml-2">Recent Notifications</p>
                                {displayRequest.map((getData) => (
                                  getData.status === 1 && (
                                    <Menu.Item key={getData.id}>
                                      
                                      <a
                                        href="#"
                                        onClick={() => handleLinkClick(getData.id, getData.url)}
                                        className={`block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-blue-200 hover:text-blue-800`}
                                      >
                                        <b>{getData.subject}:</b>
                                        <p>{getData.message}</p>
                                      </a>
                                    </Menu.Item>
                                  )
                                ))}
                              </div>
                            </>
                          ) : (
                            <Menu.Item>
                              <a className={'block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200'}>
                                No Notifications
                              </a>
                            </Menu.Item>
                          )}
                        </Menu.Items>
                        </Transition>
                      </Menu>
                        
                      </div>        */}

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                          </Menu.Button>
                        </div>
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
          )}
        </Disclosure>
        
        <Outlet />

      </div>
    </>
  )
}
