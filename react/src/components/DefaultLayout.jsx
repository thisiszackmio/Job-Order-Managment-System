import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from "react-router-dom";
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

  const id = currentUser.id;

  const [Notification, setNotification] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navigate = useNavigate();

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
        { name: 'Equipment Form', to: `/equipmentrequestform/${currentUser.id}` },
      ],
    },
    {
      name: 'My Request',
      submenu: [
        { name: 'Pre/Post Repair Inspection Form', to: `/myrequestinpectionform/${currentUser.id}` },
        { name: 'Facility / Venue Form', to: `/myrequestfacilityvenueform/${currentUser.id}` },
        { name: 'Vehicle Slip Form', to: `/myrequestvehicleslipform/${currentUser.id}` },
        { name: 'Equipment Form', to: `/myequipmentform/${currentUser.id}` }
      ],
    },
    ...(currentUser.code_clearance == '1' || currentUser.code_clearance == '3' || currentUser.code_clearance == '4' || currentUser.code_clearance == '10'
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

  // Get Notification
  const fetchNotification = () => {
  axiosClient
    .get(`/notification/${id}`)
    .then((response) => {
      const responseData = response.data;

      const supNotiCount = responseData.Sup_Not.supCount;
      const supRepairDet = responseData.Sup_Not.supRepairDetail;

      const gsoNotiCount = responseData.GSO_Not.gsoCount;
      const gsoRepairDet = responseData.GSO_Not.gsoRepairDet;
      const gsoFacilityDet = responseData.GSO_Not.gsoFacilityDet;
      const gsoVehicleDet = responseData.GSO_Not.gsoVehicleDet;

      const adminNotiCount = responseData.Admin_Not.adminCount;
      const adminRepairDet = responseData.Admin_Not.adminRepairDet;
      const adminFacilityDet = responseData.Admin_Not.adminFacilityDet;
      const adminVehicleDet = responseData.Admin_Not.adminVehicleDet;

      const personnelCount = responseData.Personnel_Not.personnelCount;
      const peronnelRepairDet = responseData.Personnel_Not.personnelRepairDet;

      // ----- Supervisor Notification ----- //

      // For Inspection Request
      const mappedInsSupData = supRepairDet
      ? supRepairDet.map((SInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: SInspItem.repair_id,
            user_id: SInspItem.repair_reqID,
            requestor: SInspItem.repair_requestor,
            supervisor_name: SInspItem.repair_supID,
            datetimerequest: SInspItem.repair_date,
          };
        })
      : null;

      // ----- GSO Notification ----- //

      // For Inspection Request
      const mappedInsGSOData = gsoRepairDet
      ? gsoRepairDet.map((GInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: GInspItem.repair_id,
            requestor: GInspItem.repair_requestor,
            code: GInspItem.requestor_code,
            datetimerequest: GInspItem.repair_date,
          };
        })
      : null;

      // For Facility Request
      const mappedFacGSOData = gsoFacilityDet
      ? gsoFacilityDet.map((GFacItem) => {
          return {
            type: 'Faciity / Venue Request Form',
            id: GFacItem.facility_id,
            datetimerequest: GFacItem.facility_date,
            requestor: GFacItem.requestor,
            req_id: GFacItem.requestor_code,
          }
      })
      : null

      // For Vehicle Request
      const mappedVehGSOData = gsoVehicleDet
      ? gsoVehicleDet.map((GVehItem) => {
        return {
          type: 'Vehicle Request Slip',
          id: GVehItem.vehicle_id,
          datetimerequest: GVehItem.vehicle_date,
          requestor: GVehItem.requestor,
          status: GVehItem.vehicle_approval,
          req_id: GVehItem.vehicle_userID,
        }
      })
      : null

      // ----- Admin Notification ----- //

      // For Inspection Request
      const mappedInsAdminData = adminRepairDet
      ? adminRepairDet.map((AInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: AInspItem.repair_id,
            supervisor_name: AInspItem.repair_supID,
            requestor: AInspItem.repair_requestor,
            datetimerequest: AInspItem.repair_date,
          }
        })
      : null;

      // For Facility / Venue Request
      const mappedFacAdminData = adminFacilityDet
      ? adminFacilityDet.map((AFacItem) => {
        return {
          type: 'Faciity / Venue Request Form',
          id: AFacItem.facility_id,
          datetimerequest: AFacItem.facility_date,
          requestor: AFacItem.requestor,
        }
      })
      :null

      // For Vehicle Request
      const mappedVehAdminData = adminVehicleDet
      ? adminVehicleDet.map((AVehItem) => {
        return {
          type: 'Vehicle Request Slip',
          id: AVehItem.vehicle_id,
          datetimerequest: AVehItem.vehicle_date,
          requestor: AVehItem.requestor,
          req_id: AVehItem.vehicle_userID,
        }
      })
      : null

      // ----- Personnel Notification ----- //

      //For Inspection Request
      const mappedInsPersonnelData = peronnelRepairDet
      ? peronnelRepairDet.map((PInspItem) => {
          return{
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: PInspItem.repair_id,
            datetimerequest: PInspItem.repair_date,
            status: PInspItem.close,
            assign: PInspItem.assign_personnel,
            requestor: PInspItem.requestor,
          }
      })
      : null;

      //console.log({mappedVehGSOData});
      setNotification({
        mappedInsSupData,
        mappedInsGSOData,
        mappedFacGSOData,
        mappedVehGSOData,
        mappedInsAdminData,
        mappedFacAdminData,
        mappedVehAdminData,
        mappedInsPersonnelData,
        adminNotiCount,
        gsoNotiCount,
        supNotiCount,
        personnelCount
      });

    })
    .catch((error) => {
      console.error('Error fetching Supervisor Notification data:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchNotification();
    }
  }, [currentUser]);
  

  const handleLinkClick = () => {
    setLoading(true);
    fetchSupNoti();
    fetchGSONoti();
    fetchAdminNoti();
    fetchPersonnelNoti();
  };


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
                  {(userRole == 'h4ck3rZ@1Oppa' || userRole == '4DmIn@Pp4' || userRole == 'Pm@PP4' || userRole == 'P3rs0nn3lz@pPa') && (
                  <div>
                    <Menu.Button className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </Menu.Button>

                    {/* Display the count for Supervisor */}
                    {Notification.supNotiCount ? (
                    <div>
                      {Notification?.mappedInsSupData?.map((SupDet) => (
                        <div key={SupDet.id}>
                          {SupDet.supervisor_name === currentUser.id && (<span className="notifications">{Notification.supNotiCount}</span>)}
                        </div>
                      ))}
                    </div>
                    ):null}

                    {/* Display the count for GSO */}
                    {Notification.gsoNotiCount ? (
                    <div>
                      {currentUser.code_clearance == 3 && (
                        <span className="notifications">{Notification.gsoNotiCount}</span>
                      )}
                    </div>
                    ):null}

                    {/* Admin Count Notification */}
                    {Notification.adminNotiCount ? (
                    <div>
                      {currentUser.code_clearance == 1 && (
                        <span className="notifications">{Notification.adminNotiCount}</span>
                      )}
                    </div>
                    ):null}

                    {/* Display the count for Personnel */}
                    {Notification.personnelCount ? (
                    <>
                      {Notification?.mappedInsPersonnelData?.map((PeDet) => (
                        <div key={PeDet.id}>
                          {PeDet.assign == currentUser.id && (
                            <span className="notifications">{Notification.personnelCount}</span>
                          )}
                        </div>
                      ))}
                    </>  
                    ):null}

                  </div>
                  )}
                  {/* End of Notification Number */}
                  
                  {/* Notification Message */}
                  {(userRole == 'h4ck3rZ@1Oppa' || userRole == '4DmIn@Pp4' || userRole == 'Pm@PP4' || userRole == 'P3rs0nn3lz@pPa') && (
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

                        {/* Supervisor Message */}
                        {currentUser.code_clearance == 4 && (
                        <>
                          {Notification.supNotiCount ? (
                          <>
                            {/* Inspection Notification */}
                            {Notification?.mappedInsSupData?.map((SupIntDet)=> (
                              <div key={SupIntDet.id}>
                                {SupIntDet.supervisor_name == currentUser.id && (
                                  <Link 
                                    to={`/repairinspectionform/${SupIntDet.id}`}
                                    onClick={handleLinkClick} 
                                    className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                                  >
                                    <h4 className="text-sm text-gray-400">
                                      {SupIntDet.type}
                                    </h4>
                                    <h3 className="text-l font-normal leading-6 text-gray-900">
                                      There is a request on <strong>{SupIntDet.requestor}</strong>, and it requires your approval.
                                    </h3>
                                    <h4 className="text-sm text-blue-500 font-bold">
                                      {formatTimeDifference(SupIntDet.datetimerequest)}
                                    </h4>
                                  </Link>
                                )}
                              </div>                            
                            ))}
                          </>
                          ):(
                            <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                          )}
                        </>
                        )}

                        {/* GSO Message */}
                        {currentUser.code_clearance == 3 && (
                        <>
                          {Notification?.gsoNotiCount ? (
                          <>
                            {/* Inspection Notification */}
                            {Notification?.mappedInsGSOData?.map((GSOItem) => (
                            <div key={GSOItem.id}>
                              <Link 
                                to={`/repairinspectionform/${GSOItem.id}`} 
                                onClick={handleLinkClick}
                                className="hover:bg-gray-100 block p-4 transition duration-300"
                              >
                                <h4 className="text-sm text-gray-400"> {GSOItem.type} </h4>
                                <h3 className="text-l font-normal leading-6 text-gray-900">
                                  {(GSOItem.code == 1 || GSOItem.code == 2 || GSOItem.code == 4) && (
                                  <><strong>{GSOItem.requestor}</strong>  has a request </>
                                  )}

                                  {GSOItem.code == 3 && (
                                    <><strong>{GSOItem.requestor}</strong>, your request has been approved by your supervisor</>
                                  )}

                                  {(GSOItem.code == 5 || GSOItem.code == 6 || GSOItem.code == 10) && (
                                    <><strong>{GSOItem.requestor}</strong>  has a request and it has already been approved by the supervisor.</>
                                  )}
                                  
                                </h3>
                                <h4 className="text-sm text-blue-500 font-bold">
                                  {formatTimeDifference(GSOItem.datetimerequest)}
                                </h4>
                              </Link>
                            </div>
                            ))}

                            {/* Facility Notification */}
                            {Notification?.mappedFacGSOData?.map((GSOFItem) => (
                            <div key={GSOFItem.id}>
                              <Link 
                                to={`/facilityvenueform/${GSOFItem.id}`} 
                                onClick={handleLinkClick}
                                className="hover:bg-gray-100 block p-4 transition duration-300"
                              >
                                <h4 className="text-sm text-gray-400"> {GSOFItem.type} </h4>
                                <h3 className="text-l font-normal leading-6 text-gray-900">
                                {GSOFItem.req_id == 3 ? (
                                  <div><strong>Your</strong> request has been approved by the admin manager.</div>
                                ):GSOFItem.req_id == 1 ? (
                                  <div>Here's the request on <strong>{GSOFItem.requestor}</strong>.</div>
                                ):
                                (
                                  <div>A request for <strong>{GSOFItem.requestor}</strong> has been approved by the admin manager.</div>
                                )}
                                </h3>
                                <h4 className="text-sm text-blue-500 font-bold">
                                  {formatTimeDifference(GSOFItem.datetimerequest)}
                                </h4>
                              </Link>
                            </div>
                            ))}

                            {/* Vehicle Notification */}
                            {Notification?.mappedVehGSOData?.map((GSOVItem) => (
                            <div key={GSOVItem.id}>
                              <Link 
                                to={`/vehicleslipform/${GSOVItem.id}`} 
                                onClick={handleLinkClick}
                                className="hover:bg-gray-100 block p-4 transition duration-300"
                              >
                                <h4 className="text-sm text-gray-400"> {GSOVItem.type} </h4>
                                <h3 className="text-l font-normal leading-6 text-gray-900">
                                {GSOVItem.status == 5 ? (
                                <>
                                  {GSOVItem.req_id == currentUser.id ? (
                                    <div>Here's the request link <strong>{GSOVItem.requestor}</strong></div>
                                  ):(
                                    <div>There is a request for <strong>{GSOVItem.requestor}</strong>.</div>
                                  )}
                                </>
                                ):(
                                <>
                                  {GSOVItem.req_id == currentUser.id ? (
                                    <div><strong>Your</strong> request has been approved</div>
                                  ):(
                                    <div><strong>{GSOVItem.requestor}</strong>'s request has been approved.</div>
                                  )}
                                </>  
                                )}
                                </h3>
                                <h4 className="text-sm text-blue-500 font-bold">
                                  {formatTimeDifference(GSOVItem.datetimerequest)}
                                </h4>
                              </Link>
                            </div>
                            ))}
                          </>
                          ):(
                            <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                          )}
                          
                        </>
                        )}

                        {/* Admin Message */}
                        {currentUser.code_clearance == 1 && (
                        <>
                          {Notification.adminNotiCount ? (
                          <>
                            {/* For Inspection Repair Request */}
                            {Notification?.mappedInsAdminData?.map((AdminItem) => (
                              <div key={AdminItem.id}>
                                <Link 
                                  to={`/repairinspectionform/${AdminItem.id}`} 
                                  onClick={handleLinkClick}
                                  className="hover:bg-gray-100 block p-4 transition duration-300"
                                >
                                  <h4 className="text-sm text-gray-400"> {AdminItem.type} </h4>
                                  <h3 className="text-l font-normal leading-6 text-gray-900">
                                    {AdminItem.supervisor_name == currentUser.id ? (
                                      <div><strong>{AdminItem.requestor}</strong>, your request has been completed by the GSO.</div>
                                    ):(
                                      <div><strong>{AdminItem.requestor}'s</strong> request has been completed by the GSO and now requires your approval.</div>
                                    )}
                                  </h3>
                                  <h4 className="text-sm text-blue-500 font-bold">
                                    {formatTimeDifference(AdminItem.datetimerequest)}
                                  </h4>
                                </Link>
                              </div>
                            ))}

                            {/* For Facility / Venue Request */}
                            {Notification?.mappedFacAdminData?.map((AdminFacItem) => (
                              <div key={AdminFacItem.id}>
                                <Link 
                                  to={`/facilityvenueform/${AdminFacItem.id}`} 
                                  onClick={handleLinkClick}
                                  className="hover:bg-gray-100 block p-4 transition duration-300"
                                >
                                  <h4 className="text-sm text-gray-400"> {AdminFacItem.type} </h4>
                                  <h3 className="text-l font-normal leading-6 text-gray-900">
                                    There is a request for <strong>{AdminFacItem.requestor}</strong>, and it requires your approval. 
                                  </h3>
                                  <h4 className="text-sm text-blue-500 font-bold">
                                    {formatTimeDifference(AdminFacItem.datetimerequest)}
                                  </h4>
                                </Link>
                              </div>  
                            ))}

                            {/* For Vehicle Request */}
                            {Notification?.mappedVehAdminData?.map((AdminVehItem) => (
                              <div key={AdminVehItem.id}>
                                <Link 
                                  to={`/vehicleslipform/${AdminVehItem.id}`} 
                                  onClick={handleLinkClick}
                                  className="hover:bg-gray-100 block p-4 transition duration-300"
                                >
                                  <h4 className="text-sm text-gray-400"> {AdminVehItem.type} </h4>
                                  <h3 className="text-l font-normal leading-6 text-gray-900">
                                  {AdminVehItem.req_id == currentUser.id ? (
                                    <div><strong>Your</strong> request has been completed by the GSO and now requires your approval.</div>
                                  ):(
                                    <div>The request for <strong>{AdminVehItem.requestor}</strong> has been completed by the GSO and now requires your approval.</div>
                                  )}
                                  </h3>
                                  <h4 className="text-sm text-blue-500 font-bold">
                                    {formatTimeDifference(AdminVehItem.datetimerequest)}
                                  </h4>
                                </Link>
                              </div>
                            ))}
                          </>
                          ):(
                            <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                          )}
                        </>
                        )}

                        {/* Personnel Message */}
                        {currentUser.code_clearance == 6 || currentUser.code_clearance == 10 && (
                        <>
                          {Notification.personnelCount ? (
                          <>
                            {Notification?.mappedInsPersonnelData?.map((PInspItem) => (
                              <div key={PInspItem.id}>
                                {PInspItem.assign == currentUser.id && (
                                <>
                                  {/* For Part C Status */}
                                  {PInspItem.status == 4 && (
                                    <Link 
                                      to={`/repairinspectionform/${PInspItem.id}`} 
                                      onClick={handleLinkClick}
                                      className="hover:bg-gray-100 block p-4 transition duration-300"
                                    >
                                      <h4 className="text-sm text-gray-400"> {PInspItem.type} </h4>
                                      <h3 className="text-l font-normal leading-6 text-gray-900">
                                        Hello <strong>{currentUser.fname}</strong>, there a task for you on {PInspItem.requestor}'s request (Control No: {PInspItem.id})
                                      </h3>
                                      <h4 className="text-sm text-blue-500 font-bold">
                                        {formatTimeDifference(PInspItem.datetimerequest)}
                                      </h4>
                                    </Link>
                                  )}

                                  {/* For Part D status */}
                                  {PInspItem.status == 3 && (
                                    <Link 
                                      to={`/repairinspectionform/${PInspItem.id}`} 
                                      onClick={handleLinkClick}
                                      className="hover:bg-gray-100 block p-4 transition duration-300"
                                    >
                                      <h4 className="text-sm text-gray-400"> {PInspItem.type} </h4>
                                      <h3 className="text-l font-normal leading-6 text-gray-900">
                                        Hello <strong>{currentUser.fname}</strong>, you still need to fill up PART D (Control No: {PInspItem.id})
                                      </h3>
                                      <h4 className="text-sm text-blue-500 font-bold">
                                      {formatTimeDifference(PInspItem.datetimerequest)}
                                      </h4>
                                    </Link>
                                  )}
                                </> 
                                )}
                              </div>
                            ))}
                          </>
                          ):(
                            <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                          )}
                        </>
                        )}

                      </Menu.Items>
                    </Transition>
                  </div>  
                  )}
                  {/* End of Notification Message */}
                  
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
