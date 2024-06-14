import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

const TopNav = () =>{
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

              <span className="notifications">10</span>

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
                <Menu.Items className="absolute font-arial right-0 z-10 mt-2 w-96 max-h-[445px] overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <p className="text-xs font-bold text-center leading-7 text-red-500 ml-2">Notifications</p>

                  <div className="font-roboto">
                    <Link 
                      to={`/repairinspectionform/`}
                      // onClick={handleLinkClick} 
                      className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                    >
                      <h4 className="noti-type">Facility Form Request</h4>
                      <h3 className="noti-message">
                        There is a request for <span className="noti-requestor">Requestor</span>, and it requires your approval.
                      </h3>
                      <h4 className="text-sm text-blue-500 font-bold">1 hour ago</h4>
                    </Link>
                  </div>
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