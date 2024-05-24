import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline'
import { useUserStateContext } from '../context/ContextProvider';
import axiosClient from '../axios';
import { Link } from 'react-router-dom';

const TopNav = () => {

  const { currentUser } = useUserStateContext();

  const [notification, setNotification] = useState([]);

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

  // Get Notification
  const fetchNotification = () => {
    axiosClient
    .get(`/notification/${currentUser.id}`)
    .then((response) => {
      const responseData = response.data;

      // SuperVisor //
      const supNotiCount = responseData.Sup_Not.supCount;
      const supRepairDet = responseData.Sup_Not.supRepairDetail;

      // GSO //
      const gsoNotiCount = responseData.GSO_Not.gsoCount;
      const gsoRepairDet = responseData.GSO_Not.gsoRepairDet;
      const gsoFacilityDet = responseData.GSO_Not.gsoFacilityDet;
      const gsoVehicleDet = responseData.GSO_Not.gsoVehicleDet;
      const gsoCloseReq = responseData.GSO_Not.gsoCloseInspReq;

      // Admin //
      const adminNotiCount = responseData.Admin_Not.adminCount;
      const adminRepairDet = responseData.Admin_Not.adminRepairDet;
      const adminFacilityDet = responseData.Admin_Not.adminFacilityDet;
      const adminVehicleDet = responseData.Admin_Not.adminVehicleDet;

      // Assign Personnel //
      const personnelCount = responseData.Personnel_Not.personnelCount;
      const peronnelRepairDet = responseData.Personnel_Not.personnelRepairDet;

      // Supervisor Function //
      // -- Inspection Request -- //
      const mappedInsSupData = supRepairDet
      ? supRepairDet.map((SInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: SInspItem.repair_id,
            user_id: SInspItem.repair_reqID,
            requestor: SInspItem.repair_requestor,
            supervisor_name: SInspItem.repair_supID,
            datetimerequest: formatTimeDifference(SInspItem.repair_date),
          };
        })
      : null;

      // GSO Function //
      // -- Inspection Request -- //
      const mappedInsGSOData = gsoRepairDet
      ? gsoRepairDet.map((GInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: GInspItem.repair_id,
            requestor: GInspItem.repair_requestor,
            code: GInspItem.requestor_code,
            datetimerequest:formatTimeDifference(GInspItem.repair_date),
          };
        })
      : null;

      // -- Facility Request -- //
      const mappedFacGSOData = gsoFacilityDet
      ? gsoFacilityDet.map((GFacItem) => {
          return {
            type: 'Faciity / Venue Request Form',
            id: GFacItem.facility_id,
            datetimerequest: GFacItem.facility_date,
            requestor: GFacItem.requestor,
            obrComment: GFacItem.facility_obr,
            req_id: GFacItem.requestor_code,
          }
      })
      : null

      // -- Vehicle Slip Request -- //
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
      
      // -- closeRequest -- //
      const closeRequestData = gsoCloseReq 
      ? gsoCloseReq.map((GsoClose) => {
        return {
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: GsoClose.id,
          insp_id: GsoClose.insp_id,
          datetimerequest:formatTimeDifference(GsoClose.date_update),
        }
      }): null;

      // Admin Function //
      // -- Inspection Request -- //
      const mappedInsAdminData = adminRepairDet
      ? adminRepairDet.map((AInspItem) => {
          return {
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: AInspItem.repair_id,
            supervisor_name: AInspItem.repair_supID,
            requestor: AInspItem.repair_requestor,
            datetimerequest: formatTimeDifference(AInspItem.repair_date),
          }
        })
      : null;

      // -- Facility Form -- //
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

      // -- Vehicle Slip Request -- //
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


      // Personnel Function //
      const mappedInsPersonnelData = peronnelRepairDet
      ? peronnelRepairDet.map((PInspItem) => {
          return{
            type: 'Pre-Repair/Post Repair Inspect Form',
            id: PInspItem.repair_id,
            datetimerequest: formatTimeDifference(PInspItem.repair_date),
            status: PInspItem.close,
            assign: PInspItem.assign_personnel,
            requestor: PInspItem.requestor,
          }
      })
      : null;

      //console.log(mappedVehAdminData);
      setNotification({
        supNotiCount,
        mappedInsSupData,
        gsoNotiCount,
        mappedInsGSOData,
        mappedFacGSOData,
        mappedVehGSOData,
        adminNotiCount,
        mappedInsAdminData,
        mappedFacAdminData,
        mappedVehAdminData,
        personnelCount,
        mappedInsPersonnelData,
        closeRequestData
      });

    })
    .catch((error) => {
      console.error('Error fetching Supervisor Notification data:', error);
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

  const NotificationCondition = 
    notification?.mappedInsSupData?.length > 0 ||
    (notification?.mappedInsGSOData?.length > 0 && currentUser.code_clearance === 3) ||
    (notification?.closeRequestData?.length > 0 && currentUser.code_clearance === 3) ||
    (notification?.mappedFacGSOData?.length > 0 && currentUser.code_clearance === 3) ||
    (notification?.mappedVehGSOData?.length > 0 && currentUser.code_clearance === 3) ||
    (notification?.mappedInsAdminData?.length > 0 && currentUser.code_clearance === 1) ||
    (notification?.mappedFacAdminData?.length > 0 && currentUser.code_clearance === 1) ||
    (notification?.mappedVehAdminData?.length > 0 && currentUser.code_clearance === 1) ||
    (notification?.mappedInsPersonnelData?.length > 0 && notification?.mappedInsPersonnelData?.some(PersonnelData => PersonnelData.assign === currentUser.id));
      

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">

        {/* Notification Icon */}
        <div className="hidden md:flex items-center ml-4">
          <div className="relative">
            <Menu as="div" className="relative">

              {/* Display number of Notification */}
              <div>
                {currentUser.pwd_change != 1 && (
                <>
                  <Menu.Button className="notification-icon">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </Menu.Button>
                </>  
                )}

                {/* For Supervisor */}
                {notification?.mappedInsSupData?.map((SupData) => (
                  <div key={SupData.id}>
                    {SupData.supervisor_name == currentUser.id && (
                      <span className="notifications">{notification?.supNotiCount}</span>
                    )}
                  </div>
                ))}

                {/* ----------------------------------------------- */}

                {/* For GSO */}
                {currentUser.code_clearance == 3 && (
                  notification?.gsoNotiCount ? (<span className="notifications">{notification?.gsoNotiCount}</span>):null
                )}

                {/* ----------------------------------------------- */}
                
                {/* For Admin */}
                {currentUser.code_clearance == 1 && (
                  notification?.adminNotiCount ? (<span className="notifications">{notification?.adminNotiCount}</span>):null
                )}

                {/* ----------------------------------------------- */}

                {/* For Personnel */}
                {notification?.mappedInsPersonnelData?.map((PersonnelData) => (
                  <div key={PersonnelData.id}>
                    {PersonnelData.assign === currentUser.id ? (
                      <span className="notifications">{notification?.personnelCount}</span>
                    ):null}   
                  </div>
                ))}

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

                  {NotificationCondition ? (
                  <>

                    {/* For Supervisor */}
                    {currentUser.code_clearance == 4 ? (
                    <>
                      {notification?.mappedInsSupData?.map((SupData) => (
                        <div key={SupData.id}>
                          {SupData.supervisor_name == currentUser.id ? (
                            <Link 
                              to={`/repairinspectionform/${SupData.id}`}
                              onClick={handleLinkClick} 
                              className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                            >
                              <h4 className="text-sm text-gray-400">{SupData.type}</h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                There is a request for <strong>{SupData.requestor}</strong>, and it requires your approval.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">{SupData.datetimerequest}</h4>
                            </Link>
                          ):(
                            <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification</h3>
                          )}
                        </div>
                      ))}
                    </>
                    ):null}

                    {/* ---------------------------------------------------------------------------------------------------- */}

                    {/* For GSO */}
                    {currentUser.code_clearance == 3 ? (
                    <>
                      {/* ==== For Inspection Request ==== */}
                      {notification?.mappedInsGSOData?.map((GSOData) => (
                        <div key={GSOData.id}>
                          <Link 
                            to={`/repairinspectionform/${GSOData.id}`}
                            onClick={handleLinkClick} 
                            className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                          >
                            <h4 className="text-sm text-gray-400"> {GSOData.type} </h4>
                            <h3 className="text-l font-normal leading-6 text-gray-900">

                              {/* For Division Managers and Port Manager */}
                              {(GSOData.code == 1 || GSOData.code == 2 || GSOData.code == 4) && 
                              (
                                <div>There is a request on <strong>{GSOData.requestor}</strong></div>
                              )}

                              {/* For GSO */}
                              {GSOData.code == 3 && 
                              (
                                <div>Your request has been approved by your supervisor</div>
                              )}

                              {/* For Regular and COS */}
                              {(GSOData.code == 5 || GSOData.code == 6 || GSOData.code == 10) && 
                              (
                                <div>The request for <strong>{GSOData.requestor}</strong> has been approved by the supervisor</div>
                              )}

                            </h3>
                            <h4 className="text-sm text-blue-500 font-bold">{GSOData.datetimerequest}</h4>
                          </Link>
                        </div>
                      ))}

                      {/* === Close Request on Inpection Form === */}
                      {(notification?.closeRequestData?.length > 0 && currentUser.code_clearance == 3) ? (
                        notification?.closeRequestData?.map((CloseReq) => (
                          <div key={CloseReq.id}>
                            <Link 
                            to={`/repairinspectionform/${CloseReq.insp_id}`}
                            onClick={handleLinkClick} 
                            className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                            >
                              <h4 className="text-sm text-gray-400"> {CloseReq.type} </h4>
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello {currentUser.gender == 'Female' ? ("Ma'am"):("Sir")} {currentUser.fname}. <strong>(Control No. {CloseReq.insp_id})</strong> is complete and ready for closure.
                              </h3>
                              <h4 className="text-sm text-blue-500 font-bold">{CloseReq.datetimerequest}</h4>
                            </Link>
                          </div>
                        ))
                      ):null}

                      {/* === For Facility Request === */}
                      {notification?.mappedFacGSOData?.map((GSOFItem) => (
                        <div key={GSOFItem.id}>
                          <Link 
                            to={`/facilityvenueform/${GSOFItem.id}`} 
                            onClick={handleLinkClick}
                            className="hover:bg-gray-100 block p-4 transition duration-300"
                          >
                            <h4 className="text-sm text-gray-400"> {GSOFItem.type} </h4>
                            {GSOFItem.obrComment == null ? (
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
                            ):(
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                <div>
                                  Hello {currentUser.gender == 'Male' ? "Sir":"Maam"} {currentUser.fname}. This form needs to be close <strong>(Control No. {GSOFItem.id})</strong>.
                                </div>
                              </h3>
                            )}
                            <h4 className="text-sm text-blue-500 font-bold">
                              {formatTimeDifference(GSOFItem.datetimerequest)}
                            </h4>
                          </Link>
                        </div>
                      ))}

                      {/* === For Vehicle Slip Request === */}
                      {notification?.mappedVehGSOData?.map((GSOVItem) => (
                        <div key={GSOVItem.id}>
                          {currentUser.code_clearance == 3 ? (
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
                          ):null}
                        </div>
                      ))}
                    </>
                    ):null}

                    {/* ---------------------------------------------------------------------------------------------------- */}

                    {/* For Admin */}
                    {currentUser.code_clearance == 1 ? (
                    <>
                      {/* ==== For Inspection Request ==== */}
                      {notification?.mappedInsAdminData?.map((AdminData) => (
                        <div key={AdminData.id}>
                          <Link 
                            to={`/repairinspectionform/${AdminData.id}`}
                            onClick={handleLinkClick} 
                            className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                          >
                            <h4 className="text-sm text-gray-400"> {AdminData.type} </h4>
                            <h3 className="text-l font-normal leading-6 text-gray-900">
                              {AdminData.supervisor_name == currentUser.id ? (
                                <div>Your request has been filled out by the GSO</div>
                              ):(
                                <div>The request for <strong>{AdminData.requestor}</strong> has been filled out by the GSO and now requires your approval</div>
                              )}
                            </h3>
                            <h4 className="text-sm text-blue-500 font-bold">{AdminData.datetimerequest}</h4>
                          </Link>
                        </div>
                      ))}

                      {/* === For Facility Request === */}
                      {notification?.mappedFacAdminData?.map((AdminFacItem) => (
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

                      {/* === For Vehicle Request === */}
                      {notification?.mappedVehAdminData?.map((AdminVehItem) => (
                        <div key={AdminVehItem.id}>
                          {currentUser.code_clearance == 1 ? (
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
                          ):null}
                          
                        </div>
                      ))}
                    </>
                    ):null}

                    {/* ---------------------------------------------------------------------------------------------------- */}

                    {/* For Personnel */}
                    {notification?.mappedInsPersonnelData?.map((PersonnelData) => (
                      <div key={PersonnelData.id}>
                        {PersonnelData.assign == currentUser.id && (
                          <Link 
                          to={`/repairinspectionform/${PersonnelData.id}`}
                          onClick={handleLinkClick} 
                          className="hover:bg-gray-100 p-4 block p-4 transition duration-300"
                          >
                            <h4 className="text-sm text-gray-400"> {PersonnelData.type} </h4>
                            {PersonnelData.status == 4 && (
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                There is a assign for you on {PersonnelData.requestor}'s request (Control No: {PersonnelData.id})
                              </h3>
                            )}
                            {PersonnelData.status == 3 && (
                              <h3 className="text-l font-normal leading-6 text-gray-900">
                                Hello <strong>{currentUser.fname}</strong>, you still need to fill up PART D (Control No: {PersonnelData.id})
                              </h3>
                            )}
                            <h4 className="text-sm text-blue-500 font-bold">{PersonnelData.datetimerequest}</h4>
                          </Link>  
                        )}
                      </div>
                    ))}

                  </>  
                  ):(
                    <h3 className="text-l font-normal leading-6 text-gray-900 p-5 text-center">No Notification</h3>
                  )}



                </Menu.Items>
              </Transition>
              </div>

            </Menu>
          </div>
        </div>

      </div>
    </div>

  );
};

export default TopNav;
