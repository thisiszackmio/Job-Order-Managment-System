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

  const [isLoading , setLoading] = useState(true);

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
      ],
    },
    {
      name: 'My Request',
      submenu: [
        { name: 'Pre/Post Repair Inspection Form', to: `/myrequestinpectionform/${currentUser.id}` },
        { name: 'Facility / Venue Form', to: `/myrequestfacilityvenueform/${currentUser.id}` },
      ],
    },
    ...(userRole == 'admin' || userRole == 'hackers' || userRole == 'personnels'
      ? [
          {
            name: 'Request List',
            submenu: [
              { name: 'Pre/Post Repair Inspection Form', to: '/repairrequestform' },
              { name: 'Facility / Venue Form', to: '/facilityvenuerequestform' },
            ],
          },
        ]
      : []),
    ...(userRole == 'hackers'
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

  //Get Supervisor Notification
  const fetchSupNoti = () => {
    axiosClient
    .get(`/supnotification/${currentUser.id}`)
    .then((response) => {
      const responseData = response.data;
      const getSupInspDet = responseData.supInsDet;

      const mappedInsData = getSupInspDet.map((SInspItem) => {
        const inspectionForm = SInspItem.inspection_form;
        const user = SInspItem.user;

        return {
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: inspectionForm.id,
          user_id: inspectionForm.user_id,
          date_request: inspectionForm.date_of_request,
          requestor: `${user.fname} ${user.mname}. ${user.lname}`,
          supervisor_name: inspectionForm.supervisor_name,
          datetimerequest: inspectionForm.created_at
        };
      });

      setSupNoti({mappedInsData});
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Get GSO Notification
  const fetchGSONoti = () => {
    axiosClient
    .get(`/gsonotification/${currentUser.id}`)
    .then((response) => {
      const responseData = response.data;
      const getGSOInspDet = responseData.gsoDet;
      const getGSOFacDet = responseData.gsoFacDet;
      const adminName = responseData.adminName;

      const mappedInsData = getGSOInspDet.map((GInspItem) => {
        const inspectionForm = GInspItem.inspection_form;
        const user = GInspItem.user;

        return {
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: inspectionForm.id,
          date_request: inspectionForm.date_of_request,
          requestor: `${user.fname} ${user.mname}. ${user.lname}`,
          code: user.code_clearance,
          rgender: user.gender,
          dateapprove: inspectionForm.updated_at
        };
      });

      const mappedFacData = getGSOFacDet.map((GFacItem) => {
        const facilityForm = GFacItem.facility_form;
        const fuser = GFacItem.user;

        return {
          type: 'Facility/Venue Form',
          id: facilityForm.id,
          user_id: fuser.id,
          date_request: facilityForm.date_requested,
          requestor: `${fuser.fname} ${fuser.mname}. ${fuser.lname}`,
          code: fuser.code_clearance,
          rgender: fuser.gender,
          dateapprove: facilityForm.updated_at
        };
      });

      setGSONoti({
        mappedInsData,
        mappedFacData,
        adminName
      });

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Get Admin Manager Notification
  const fetchAdminNoti = () => {
    axiosClient
    .get(`/adminnotification/${currentUser.id}`)
    .then((response) => {
      const responseData = response.data;
      const getAdminInspDet = responseData.adminDet;
      const getAdminFacDet = responseData.adminFacDet;

      //For Inspection Notification
      const mappedInsData = getAdminInspDet.map((AInspItem) => {
        const inspectionForm = AInspItem.inspection_form;
        const user = AInspItem.user;
        return{
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: inspectionForm.id,
          date_request: inspectionForm.date_of_request,
          requestor: `${user.fname} ${user.mname}. ${user.lname}`,
          code: user.code_clearance,
          admin_id: inspectionForm.user_id,
          dateapprove: inspectionForm.updated_at
        };
      });
      
      //For Facility Notification
      const mappedFacData = getAdminFacDet.map((AFacItem) => {
        const facilityForm = AFacItem.facility_form;
        const auser = AFacItem.user;

        return {
          type: 'Facility/Venue Form',
          id: facilityForm.id,
          date_request: facilityForm.date_requested,
          requestor: `${auser.fname} ${auser.mname}. ${auser.lname}`,
          fgender: auser.gender,
          code: auser.code_clearance,
          obr: facilityForm.obr_instruct,
          dateapprove: facilityForm.updated_at
        };
      });

      setAdminNoti({
        mappedInsData, 
        mappedFacData
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Get Assign Personnel Notification
  const fetchPersonnelNoti = () => {
    axiosClient
    .get(`/personnelnotification/${currentUser.id}`)
    .then((response) => {
      const responseData = response.data;
      const inspDet = responseData.inspectionDet;
      const personnelDet = responseData.inspectorDet;
      const personnelID = responseData.assignID;

      const mappedInsData = personnelDet.map((PInspItem) => {
        return{
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: PInspItem.inspection__form_id,
          status: PInspItem.close
        };
      });

      const mappedInspData = inspDet.map((InspItem) => {
        return{
          id: InspItem.id,
          dateapprove: InspItem.updated_at,
        };
      });

      setPersoNoti({
        personnelID:personnelID,
        mappedInspData:mappedInspData,
        mappedInsData:mappedInsData
      });

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(() => {
    fetchSupNoti();
    fetchGSONoti();
    fetchAdminNoti();
    fetchPersonnelNoti();
  }, [currentUser.id]);

  //Notification Popup
  //Admin
  const haveAdminNotifications = (
    getAdminNoti?.mappedInsData?.length > 0 || 
    getAdminNoti?.mappedFacData?.length > 0
  );

  //GSO
  const haveGSONotifications = (
    getGSONoti?.mappedInsData?.length > 0 ||
    getGSONoti?.mappedFacData?.length > 0
  );

  //Count Notification number
  //Admin
  const totalAdminNotifications = (
    getAdminNoti?.mappedInsData?.length +
    getSupNoti?.mappedInsData?.length +
    getAdminNoti?.mappedFacData?.length
  );

  //GSO
  const totalGSONotifications = (
    getGSONoti?.mappedInsData?.length + 
    getGSONoti?.mappedFacData?.length
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
                  <div>
                    <Menu.Button className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </Menu.Button>

                    {/* Display the count for Sup/Manager */}
                    {getSupNoti?.mappedInsData?.length > 0 && 
                    currentUser.code_clearance == 4 && (
                    <>
                      {/* For Inspection Form */}
                      {getSupNoti.mappedInsData.map((SupDet) => (
                        SupDet.supervisor_name === currentUser.id && (
                          <span key={SupDet.id} className="notifications">
                            {getSupNoti?.mappedInsData?.length}
                          </span>
                        )
                      ))}
                    </>
                    )}

                    {/* Display the count for GSO */}
                    {haveGSONotifications && currentUser.code_clearance == 3 && (
                      <span className="notifications"> {totalGSONotifications} </span>
                    )}

                    {/* Display the count for Admin */}
                    {haveAdminNotifications && currentUser.code_clearance == 1 && (
                      <span className="notifications"> {totalAdminNotifications} </span>
                    )}

                    {/* Display the count for APM */}
                    {currentUser.code_clearance == 2 ? (
                    <>
                    {getSupNoti?.mappedInsData?.length > 0 && (
                      getSupNoti.mappedInsData.map((SupDet)=> (
                        SupDet.supervisor_name === currentUser.id ? (
                          <span
                            style={{
                              color: '#ffff',
                              backgroundColor: '#ff0000',
                              borderRadius: '25px',
                              padding: '12px 8px',
                              lineHeight: '0px',
                              fontSize: '14px',
                              position: 'absolute',
                              left: '17px',
                              top: '-6px',
                            }}
                          >
                            {getSupNoti?.mappedInsData?.length}
                          </span>
                        ):null
                      ))
                    )}
                    </>
                    ):null}

                    {/* Display the count for Personel */}
                    {getPersoNoti?.mappedInsData?.length > 0 && (
                      currentUser.code_clearance == 6 || currentUser.code_clearance == 10 ? (
                        <span className="notifications"> {getPersoNoti?.mappedInsData?.length} </span>
                      ):null
                    )}

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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <p className="text-xs font-bold text-center leading-7 text-red-500 ml-2">Notifications</p>
                    
                    {/* SuperVisor Notification */}
                    {currentUser.code_clearance == 4 ? (
                    <>
                      {/* For Inspection Form */}
                      {getSupNoti?.mappedInsData?.length > 0 && (
                      <>
                        {getSupNoti?.mappedInsData?.map((SupIntDet)=> (
                          <div key={SupIntDet.id}>
                            <Link 
                              to={`/repairinspectionform/${SupIntDet.id}`} 
                              className="hover:bg-gray-100 p-4 border-b border-gray-300 block p-4 transition duration-300"
                            >
                              <h4 className="text-sm text-gray-400">
                                {SupIntDet.type}
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, There is a request for <strong>{SupIntDet.requestor}</strong> and it has need your approval
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(SupIntDet.datetimerequest)}
                              </h4>
                            </Link>
                          </div>
                        ))}
                      </>
                      )}

                      {/* No Data */}
                      {getSupNoti?.mappedInsData?.length == 0 && (
                        <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                      )}
                    </> 
                    ):null}

                    {/* GSO Notification */}
                    {currentUser.code_clearance === 3 && (
                    <>

                      {/* For Inspection Request */}
                      {getGSONoti?.mappedInsData?.length > 0 && (
                      <>
                        {getGSONoti?.mappedInsData?.map((GSOItem) => (
                        <>
                        <div key={GSOItem.id}>

                          {/* If you receive your own request */}
                          {GSOItem.code === 3 && (
                            <Link to={`/repairinspectionform/${GSOItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400"> {GSOItem.type} </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, your request is already approved by your supervisor.
                              </h3>
                            </Link>
                          )}

                          {/* If the OPM, Supervisor , Division and Admin Manager was the requestor */}
                          {(GSOItem.code === 1 || GSOItem.code === 4 || GSOItem.code === 2) && (
                            <Link to={`/repairinspectionform/${GSOItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400"> {GSOItem.type} </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's the request for <strong>{GSOItem.rgender == "Male" ? ("Sir"):("Maam")} {GSOItem.requestor}</strong>.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(GSOItem.dateapprove)}
                              </h4>
                            </Link>
                          )}

                          {/* For COS and Regular Personnels */}
                          {(GSOItem.code === 5 || GSOItem.code === 6 || GSOItem.code === 10) && (
                            <Link to={`/repairinspectionform/${GSOItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {GSOItem.type} 
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, the request for <strong>{GSOItem.requestor}</strong> and it has been approved by {GSOItem.rgender == "Male" ? ("his"):("her")} supervisor.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(GSOItem.dateapprove)}
                              </h4>
                            </Link>
                          )}

                        </div>
                        </>

                        ))}
                      </>
                      )}

                      {/* For Facility Request*/}
                      {getGSONoti?.mappedFacData?.length > 0 && (
                      <>
                        {getGSONoti?.mappedFacData?.map((GSOFac) => (
                        <>
                        <div key={GSOFac.id}>

                          {/* If the Admin Manager was the requestor */}
                          {GSOFac.code == 1 && (
                            <Link to={`/facilityvenueform/${GSOFac.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {GSOFac.type} 
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's the request for <strong>{GSOFac.rgender == "Male" ? ("Sir"):("Maam")} {GSOFac.requestor}</strong>.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(GSOFac.dateapprove)}
                              </h4>
                            </Link>
                          )}

                          {/* If not Admin Manager */}
                          {GSOFac.code != 1 && (
                            <Link to={`/facilityvenueform/${GSOFac.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {GSOFac.type} 
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                {(currentUser.id == GSOFac.user_id) && currentUser.code_clearance == 3 ? (
                                  <span>Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, Your request has been approved.</span>
                                ):(
                                  <span>Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's the request for <strong>{GSOFac.rgender == "Male" ? ("Sir"):("Maam")} {GSOFac.requestor}</strong> and it has already approved by <strong>{getGSONoti?.adminName?.gender == "Male" ? ("Sir"):("Maam")} {getGSONoti?.adminName?.fname}</strong>.</span>
                                )}
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(GSOFac.dateapprove)}
                              </h4>
                            </Link>
                          )}

                        </div>
                        </> 
                        ))}
                      </>
                      )}

                      {/* No Data */}
                      {(getGSONoti?.mappedInsData?.length === 0 && getGSONoti?.mappedFacData?.length === 0) && (
                        <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                      )}

                    </>
                    )}

                    {/* Admin Notification */}
                    {currentUser.code_clearance == 1 && (
                    <>

                      {/* For Inspection Form */}
                      {getAdminNoti?.mappedInsData?.length > 0 && (
                      <>
                        {getAdminNoti?.mappedInsData?.map((AdminItem) => (
                        <>
                        <div key={AdminItem.id}>

                          {/* Admin Manager Receive his/her notification */}
                          {AdminItem.code == 1 && (
                            <Link to={`/repairinspectionform/${AdminItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400"> {AdminItem.type} </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello, <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's your request; PART B has been completed by the GSO.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(AdminItem.dateapprove)}
                              </h4>
                            </Link>
                          )}

                          {/* Request Inspection Form */}
                          {AdminItem.code != 1 && (
                            <Link to={`/repairinspectionform/${AdminItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {AdminItem.type}
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's the request for <strong>{AdminItem.requestor}</strong> and needs your approval.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                                {formatTimeDifference(AdminItem.dateapprove)}
                              </h4>
                            </Link>
                          )}
                          
                        </div>
                        </>

                        ))}
                      </>
                      )}

                      {/* For Facility Request*/}
                      {getAdminNoti?.mappedFacData?.length > 0 && (
                      <>
                        {getAdminNoti?.mappedFacData?.map((AdminFac) => (
                        <>
                          <div key={AdminFac.id}>

                            {AdminFac.obr ? (
                            <>
                              {/* For Approval */}
                              {AdminFac.code != 1 && (
                                <Link to={`/facilityvenueform/${AdminFac.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                                  <h4 className="text-sm text-gray-400">
                                    {AdminFac.type}
                                  </h4>
                                  <h3 className="text-l font-normal leading-6 text-gray-900">
                                    Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>! <strong>{AdminFac.fgender === 'Male' ? 'Sir' : 'Maam'} {AdminFac.requestor}</strong> is waiting for your approval.
                                  </h3>
                                  <h4 className="text-sm text-blue-500 font-bold">
                                    {formatTimeDifference(AdminFac.dateapprove)}
                                  </h4>
                                </Link>
                              )}
                            </>
                            ):(
                            <>
                              {AdminFac.code != 1 && (
                                <Link to={`/facilityvenueform/${AdminFac.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                                  <h4 className="text-sm text-gray-400">
                                    {AdminFac.type}
                                  </h4>
                                  <h3 className="text-l font-normal leading-6 text-gray-900">
                                    Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, there is the request for <strong>{AdminFac.fgender === 'Male' ? 'Sir' : 'Maam'} {AdminFac.requestor}</strong>.
                                  </h3>
                                  <h4 className="text-sm text-blue-500 font-bold">
                                    {formatTimeDifference(AdminFac.dateapprove)}
                                  </h4>
                                </Link>
                              )}
                            </>
                            )}

                            

                          </div>
                        </>
                        ))}
                
                      </>
                      )}

                      {/* No Data */}
                      {(getAdminNoti?.mappedInsData?.length == 0 && getAdminNoti?.mappedFacData?.length == 0) && (
                        <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                      )}

                    </>
                    )}

                    {/* Personnel Notification */}
                    {currentUser.code_clearance == 6 || currentUser.code_clearance == 10 ? (
                    <>

                      {/* For Inspection Form */}
                      {getPersoNoti?.mappedInsData?.length > 0 && (
                      <>
                        {getPersoNoti?.mappedInsData?.map((PerItem) => (
                          <div key={PerItem.id}>

                            {/* For Part C notification */}
                            {PerItem.status == 4 && (
                              <Link to={`/repairinspectionform/${PerItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {PerItem.type}
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, here's the assign for you <i>( Control No.  <u style={{ textDecoration: 'underline' }}>{PerItem.id}</u> )</i>
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                              {getPersoNoti?.mappedInspData?.map((InspecData) => (
                                <div key={InspecData.id}>
                                  {formatTimeDifference(InspecData.dateapprove)}
                                </div>
                              ))}
                              </h4>
                              </Link>
                            )}

                            {/* For Part D notification */}
                            {PerItem.status == 3 && (
                              <Link to={`/repairinspectionform/${PerItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                              <h4 className="text-sm text-gray-400">
                                {PerItem.type}
                              </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}</strong>, there's a pending task on <i>( Control No.  <u style={{ textDecoration: 'underline' }}>{PerItem.id}</u> )</i>
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">
                              {getPersoNoti?.mappedInspData?.map((InspecData) => (
                                <div key={InspecData.id}>
                                  {formatTimeDifference(InspecData.dateapprove)}
                                </div>
                              ))}
                              </h4>
                              </Link>
                            )}

                          </div>
                        ))}
                      </>
                      )}

                      {/* No data */}
                      {getPersoNoti?.mappedInsData?.length == 0 && (
                        <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification Today</h3>
                      )}

                    </>
                    ):null}
                    
                  </Menu.Items>
                  </Transition>
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
