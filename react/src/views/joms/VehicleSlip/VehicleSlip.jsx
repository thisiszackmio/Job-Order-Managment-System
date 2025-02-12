import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import Restrict from "../../../components/Restrict";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import loadingAnimation from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";

export default function VehicleSlip(){

  // Get the ID
  const {id} = useParams();

  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const PortManager = codes.includes("PM");
  const roles = ["AM", "GSO", "HACK", "DM", "PM", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(timeString) {
    if (!timeString) {
      return ''; // or handle the case when timeString is undefined
    }
  
    const [hours, minutes, seconds] = timeString.split(':');
    let amOrPm = 'am';
    let formattedHours = parseInt(hours, 10);
  
    if (formattedHours >= 12) {
      amOrPm = 'pm';
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }
  
    const formattedTime = `${formattedHours}:${minutes}${amOrPm}`;
    return formattedTime;
  }

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Variable
  const [vehicalName, setVehicleName] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });

  // Set Access
  const [Access, setAccess] = useState('');
  const [dataAccess, setDataAccess] = useState(null);

  // Function
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleDet, setVehicleDet] = useState([]);
  const [driverName, setDriverName] = useState([]);
  const [passenger, setPassenger] = useState([]);
  const [requestor, setRequestor] = useState([]);
  const [admin, setAdmin] = useState([]);

  const [editDetail, setEditDetail] = useState(true);
  const [adminApproval, setAdminApproval] = useState(false);

  // Update
  const [updatePurpose, setUpdatePurpose] = useState('');
  const [updateVisited, setUpdateVisited] = useState('');
  const [updateArrivalDate, setUpdateArrivalDate] = useState('');
  const [updateArrivalTime, setUpdateArrivalTime] = useState('');
  const [updateVehicle, setUpdateVehicle] = useState('');
  const [updatePassengers, setUpdatePassengers] = useState('');

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

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

  // Get the Data
  const fetchData = () => {
    axiosClient
    .get(`/showvehrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const FormData = responseData.form;
      const passengerData = FormData?.passengers?.split('\n');
      const requestorPosData = responseData.requestorPosition;
      const requestorEsig = responseData.requestorEsig;
      const adminName = responseData.adminName;
      const adminEsig = responseData.adminEsig;
      const pmName = responseData.pmName;
      const pmEsig = responseData.pmEsig;
      const driverEsig = responseData.driverEsig;

      setVehicleData(FormData);
      setPassenger(passengerData);
      setRequestor({requestorPosData, requestorEsig, driverEsig});
      setAdmin({adminName, adminEsig, pmName, pmEsig});

      // Restrictions Condition
      const myAccess = FormData?.user_id == currentUserId?.id || accessOnly ? "Access" : "Denied";
      setDataAccess(null);
      //console.log(myAccess)

      setAccess(myAccess);
    })
    .catch((error) => {
      if(error.response.data.error == "No-Form"){ // The Form doesn't exist
        setDataAccess('Not-Found');
        window.location = '/404';
      } else { // Developer Issue
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get Vehicle Details
  const fetchVehicle = () => {
    axiosClient
    .get('/getvehdet')
    .then((response) => {
      const responseData = response.data;

      setVehicleDet(responseData);
      
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get Driver Details
  const fetchDriver = () => {
    axiosClient
    .get(`/getdriverdet`)
    .then((response) => {
      const responseData = response.data;

      setDriverName(responseData)
      
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => { 
    if(currentUserId?.id){
      fetchData();
      fetchVehicle();
      fetchDriver();
    }
  }, [id, currentUserId]);

  // Force Remove Form
  const handleRemovalConfirmation = () => {
    setShowPopup(true);
    setPopupContent('gsovcf');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want delete this form? It cannot be restore.</p>
      </div>
    );
  }

  // Force Closed Function
  const handleCloseForm = (id) => {
    setSubmitLoading(true);

    const logs = `${currentUserId.name} has force-closed the request (Vehicle Slip No. ${vehicleData.id}).`;
    const remarks = `This has been deleted by the GSO.`

    axiosClient
    .put(`/forceclose/${id}`,{
      logs:logs,
      remarks:remarks,
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The request has been deleted.</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else {
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);
      }   
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Vehicle Information
  function SubmitVehicleInfo(event){
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has assigned the driver and vehicle (Vehicle Slip No. ${vehicleData?.id}).`
    const notif_message = `${currentUserId.name} has assigned the driver and vehicle for (Vehicle Slip No. ${vehicleData?.id}), and is now awaiting your approval.`;

    const data = {
      vehicle_type : vehicalName,
      driver_id : pointDriver.did, 
      driver : pointDriver.dname,
      assign: currentUserId.name,
      // Logs
      logs: logs,
      // Notification
      avatar : dpname,
      sender_id : currentUserId.id,
      sender_name : currentUserId.name,
      notif_message : notif_message,
    }

    if(!vehicalName && !pointDriver.did){
      setPopupContent("error");
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You left a field empty. Please enter a value.</p>
        </div>
      );
      setShowPopup(true);
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/storevehinfo/${id}`, data)
      .then(() => {
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Submission Complete!</p>
            <p className="popup-message">The driver and the vehicle have been assigned.</p>
          </div>
        );
      })
      .catch((error)=>{
        if (error.response.status === 409) {
          setPopupContent("error");
          setPopupMessage(
            <div>
              <p className="popup-title">Oops!</p>
              <p className="popup-message">This slip has already assign the vehicle and driver. Please reload the page.</p>
            </div>
          );
          setShowPopup(true);
        } else {
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
  }

  // Disapproval Confirmation
  const handleAdminDecline = () => {
    setShowPopup(true);
    setPopupContent('amdv');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to disapprove this request? This action cannot be undone.</p>
      </div>
    );
  }

  // Submit the Disapproval Reason
  function SubmitAdminReason(event){
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has dispprove the request (Vehicle Slip No. ${vehicleData?.id}).`;
    const message = `Your request has been disapproved by ${currentUserId.name}. Please see the reason.`;
    const remarks = vehicleData?.type_of_slip == 'within' ? `Disapproved by the Admin Manager. (Reason: ${adminReason})` : `Disapproved by the Port Manager. (Reason: ${adminReason})`;
    
    const data = {
      remarks: remarks,
      // Logs
      logs: logs,
      // Notifications
      avatar : dpname,
      sender_id : currentUserId.id,
      sender_name : currentUserId.name,
      notif_message : message,
      receiver_id : vehicleData?.user_id,
      receiver_name : vehicleData?.user_name
    }

    if(!adminReason){
      setPopupContent("error");
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered.</p>
        </div>
      );
      setShowPopup(true);
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/admindecline/${id}`, data)
      .then(() => {
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Submission Complete!</p>
            <p className="popup-message">The request has been disapproved</p>
          </div>
        );
      })
      .catch(()=>{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }

  }

  // Approval Confirmation
  const handleAdminConfirmation = () => {
    setShowPopup(true);
    setPopupContent('amav');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to approve this request?</p>
      </div>
    );
  }

  // Submit Approval
  function SubmitApproval(event){
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has approve the request (Vehicle Slip No. ${vehicleData?.id}).`
    const notif_message = `${currentUserId.name} has approved your request.`;
    const remarks = vehicleData?.type_of_slip == 'within' ? "Approved by the Admin Manager." : "Approved by the Port Manager.";

    const data = {
      remarks: remarks,
      // Logs
      logs: logs,
      // Notification
      avatar : dpname,
      sender_id : currentUserId.id,
      sender_name : currentUserId.name,
      notif_message : notif_message,
    }

    axiosClient
    .put(`/vehreqapprove/${id}`, data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Approve Confirm</p>
          <p className="popup-message">The request has been confirmed.</p>
        </div>
      );
    })
    .catch(()=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Submit Updated Form
  function UpdateVehicleForm(event, id){
    event.preventDefault();

    const hasFilledFields = [updatePurpose, updateVisited, updateArrivalDate, updateArrivalTime, updateVehicle, updateVehicle, pointDriver.did, pointDriver.dname, updatePassengers].some(Boolean);
    const logs = `${currentUserId.name} has updated the Vehicle Slip No. ${id}`;
    
    const data = {
      purpose : updatePurpose ? updatePurpose : vehicleData?.purpose ,
      place_visited : updateVisited ? updateVisited : vehicleData?.place_visited,
      date_arrival : updateArrivalDate ? updateArrivalDate : vehicleData?.date_arrival,
      time_arrival : updateArrivalTime ? updateArrivalTime : vehicleData?.time_arrival,
      vehicle_type : updateVehicle ? updateVehicle : vehicleData?.vehicle_type,
      driver_id : pointDriver.did ? pointDriver.did : vehicleData?.driver_id, 
      driver : pointDriver.dname ? pointDriver.dname : vehicleData?.driver,
      passengers : updatePassengers ? updatePassengers : vehicleData?.passengers,
      // Logs
      logs : logs
    }

    if(!hasFilledFields){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered.</p>
        </div>
      );
    } else {
      setSubmitLoading(true);

      axiosClient
      .put(`/updatevehicleslip/${id}`, data)
      .then(() => {
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success!</p>
            <p className="popup-message">The form has been updated.</p>
          </div>
        );
        setShowPopup(true);
        setEditDetail(true);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setPopupContent("error");
          setPopupMessage(
            <div>
              <p className="popup-title">Oops!</p>
              <p className="popup-message">This form is already closed!</p>
            </div>
          );
          setShowPopup(true);
        } else {
          setPopupContent("error");
          setPopupMessage(DevErrorText);
          setShowPopup(true); 
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
  }

  // Popup Button Function
  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    setLoading(true);
    fetchData();
  }

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Inspection-Control-No:${id}`
  });

  const handleButtonClick = () => {
    setIsVisible(true); 
    setSeconds(3);
    setSubmitLoading(true);
    setTimeout(() => {
      generatePDF();
      setSubmitLoading(false);
      setIsVisible(false); 
    }, 1000);
  };

  useEffect(() => {
    let timer;

    if (isVisible && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isVisible, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsVisible(false);
      setSubmitLoading(false);
    }
  }, [seconds]);

  return (
    <PageComponent title="Vehicle Slip">
      
      {(loading || vehicleData === undefined) ? (
        <div className="flex justify-center items-center py-4">
          <img className="h-8 w-auto mr-1" src={loadingAnimation} alt="Loading" />
          <span className="loading-table">Loading Vehicle Slip</span>
        </div>
      ):(
        dataAccess != 'Not-Found' ? (
          Access === "Access" ? 
            <div className="font-roboto">

              {/* Header */}
              <div className="ppa-form-header text-base flex justify-between items-center">
                <span>Slip No: <span className="px-2 ppa-form-view">{vehicleData?.id}</span></span> 
                
                {!loading && (
                <>
                  {[1, 2, 3, 4, 9, 10, 11].includes(vehicleData?.admin_approval) ? null : (
                    GSO && editDetail && (
                      <button onClick={() => handleRemovalConfirmation()} className="py-1.5 px-3 text-base btn-cancel">
                        Delete Form
                      </button>
                    )
                  )}
                </>
                )}
              </div>

              {/* Form */}
              <div className="pl-2 pt-6 pb-6 ppa-form-box bg-white mb-6">
                <form id="editVehicleSlip" onSubmit={event => UpdateVehicleForm(event, vehicleData?.id)}>
                  <div className="grid grid-cols-2">
                    {/* 1st Column */}
                    <div className="col-span-1">
                      {/* Date Request */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                            Date of Request:
                          </label> 
                        </div>
                        <div className="w-7/12 ppa-form-view text-left pl-2 h-6">
                          {formatDate(vehicleData?.created_at)}
                        </div>
                      </div>
                      {/* Purpose */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                            Purpose:
                          </label> 
                        </div>
                        <div className={`w-7/12 ${vehicleData?.purpose ? '' : 'h-6'} ${editDetail ? 'ppa-form-view text-left pl-2' : 'pt-1' }`}>
                          {editDetail ? (
                            vehicleData?.purpose
                          ):(
                            <input
                              type="text"
                              name="update_purpose"
                              id="update_purpose"    
                              value={updatePurpose ? updatePurpose : vehicleData?.purpose}
                              onChange={ev => setUpdatePurpose(ev.target.value)}
                              placeholder="Enter a purpose"
                              className="block w-full ppa-form-edit"
                            />
                          )}
                        </div>
                      </div>
                      {/* Place/s to be Visited */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                            Place/s to be Visited:
                          </label> 
                        </div>
                        <div className={`w-7/12 ${vehicleData?.place_visited ? '' : 'h-6'} ${editDetail ? 'ppa-form-view text-left pl-2' : 'pt-1' }`}>
                          {editDetail ? (
                            vehicleData?.place_visited
                          ):(
                            <input
                              type="text"
                              name="update_visited"
                              id="update_visited"    
                              value={updateVisited ? updateVisited : vehicleData?.place_visited}
                              onChange={ev => setUpdateVisited(ev.target.value)}
                              placeholder={vehicleData?.place_visited}
                              className="block w-full ppa-form-edit"
                            />
                          )}
                        </div>
                      </div>
                      {/* Date/Time of Arrival */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                            Date/Time of Arrival:
                          </label> 
                        </div>
                        <div className={`w-7/12 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
                          {editDetail ? (
                          <> {formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)} </>
                          ):(
                          <>
                            {/* Date */}
                            <div>
                              <input
                                type="date"
                                name="update_date"
                                id="update_date"    
                                value={updateArrivalDate ? updateArrivalDate : vehicleData?.date_arrival}
                                onChange={ev => setUpdateArrivalDate(ev.target.value)}
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                            
                            {/* Time */}
                            <div className="pt-4">
                              <input
                                type="time"
                                name="update_time"
                                id="update_time"    
                                value={updateArrivalTime ? updateArrivalTime : vehicleData?.time_arrival}
                                onChange={ev => setUpdateArrivalTime(ev.target.value)}
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          </>
                          )}
                        </div>
                      </div>
                      {/* Type of Vehicle */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                            {editDetail ? "Type of Vehicle:" : vehicleData?.vehicle_type ? "Type of Vehicle:" : null}
                          </label> 
                        </div>
                        <div className={`w-7/12 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
                          {editDetail ? (
                          vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[0] : null
                          ):(
                            vehicleData?.vehicle_type ? (
                              <select 
                                name="update_vehicle" 
                                id="update_vehicle" 
                                value={updateVehicle}
                                onChange={ev => { setUpdateVehicle(ev.target.value); }}
                                className="block w-full ppa-form"
                              >
                                <option value="" disabled>{vehicleData?.vehicle_type}</option>
                                {vehicleDet?.map((vehDet) => (
                                  <option key={vehDet.vehicle_id} value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`}>
                                    {vehDet.vehicle_name} ({vehDet.vehicle_plate})
                                  </option>
                                ))}
                              </select>
                            ) : null
                          )}
                        </div>
                      </div>
                      {/* Plate Number */}
                      {editDetail && (
                        <div className="flex items-center mt-2">
                          <div className="w-44">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                            Plate Number:
                            </label> 
                          </div>
                          <div className="w-7/12 ppa-form-view text-left pl-2 h-6">
                            {vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[1] : null}
                          </div>
                        </div>
                      )}
                      {/* Driver */}
                      <div className="flex items-center mt-2">
                        <div className="w-44">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          {editDetail ? "Driver:" : vehicleData?.driver ? "Driver:" : null}
                          </label> 
                        </div>
                        <div className={`w-7/12 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
                          {editDetail ? (
                            vehicleData?.driver
                          ):(
                            vehicleData?.driver ? (
                              <select 
                                name="update_driver" 
                                id="update_driver" 
                                value={pointDriver.did}
                                onChange={ev => {
                                  const personnelId = parseInt(ev.target.value);
                                  const selectedPersonnel = driverName.find(staff => staff.driver_id === personnelId);

                                  setPointDriver(selectedPersonnel ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } : { did: '', dname: '' });
                                }}
                                className="block w-full ppa-form"
                              >
                                <option value="" disabled>{vehicleData?.driver}</option>
                                {driverName?.map((driverDet) => (
                                  <option key={driverDet.driver_id} value={driverDet.driver_id}>
                                    {driverDet.driver_name}
                                  </option>
                                ))}
                              </select>
                            ):null
                          )}
                        </div>
                      </div>
                      {/* Requested By */}
                      {editDetail && (
                        <div className="flex items-center mt-2">
                          <div className="w-44">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                            Requested By:
                            </label> 
                          </div>
                          <div className="w-7/12 ppa-form-view text-left pl-2 h-6">
                            {vehicleData?.user_name}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 2nd Column */}
                    <div className="col-span-1">
                      {/* Passengers */}
                      <div className={`mt-2 ${editDetail ? '' : 'w-11/12'}`}>
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          {editDetail ? (passenger == "None" ? null : 'Passengers:'):('Passengers:')}
                        </label> 
                        {editDetail ? (
                          passenger == "None" ? null:(
                            <div style={{ columnCount: passenger.length > 10 ? 2 : 1 }} className="w-full ppa-form-view-border text-left mt-2">
                              {passenger?.map((data, index) => (
                                <div key={index} className="flex mt-1.5">
                                  <div className="w-6">
                                    <label className="block text-base font-bold leading-6 text-gray-900">
                                    {index + 1}.
                                    </label> 
                                  </div>
                                  <div className="w-7/12 ppa-form-view text-left h-6 mr-2">
                                    {data}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ):(
                        <>
                          <textarea
                            id="vr_passengers"
                            name="vr_passengers"
                            rows={7}
                            value={updatePassengers ? updatePassengers : vehicleData?.passengers}
                            onChange={ev => setUpdatePassengers(ev.target.value)}
                            style={{ resize: 'none' }}
                            maxLength={1000}
                            className="block w-full ppa-form"
                          />
                          <p className="text-gray-500 text-xs mt-2">Separate name on next line (If no passengers just leave it blank)</p>
                        </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                <div className={` ${editDetail ? 'pt-4' : 'pt-10'}`}>
                  {(GSO || PersonAuthority) && [10, 8, 7, 6, 5].includes(vehicleData?.admin_approval) && (
                    editDetail ? (
                      <button 
                        type="button"
                        onClick={(event) => {
                          event.preventDefault(); // Prevent any default behavior
                          setEditDetail(false); // Toggle the state
                        }}
                        className="py-1.5 px-3 text-base btn-edit"
                      >
                        Edit Form
                      </button>
                    ) : (
                      <>
                        {/* Approve */}
                        <button 
                          type="submit" 
                          form="editVehicleSlip"
                          className={`py-2 px-3 ${submitLoading ? 'process-btn' : 'btn-default'}`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-2">Loading</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                        </button>

                        {/* Decline */}
                        <button 
                          type="button" 
                          onClick={() => setEditDetail(true)} 
                          className="ml-2 py-2 px-4 btn-cancel"
                        >
                          Close
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div>
                {/* Header */}
                <div className="ppa-form-header text-base">
                  {(!vehicleData?.vehicle_type && !vehicleData?.driver) && 
                  [8, 6, 5].includes(vehicleData?.admin_approval) && 
                  GSO && editDetail ? (
                    "Vehicle Info"
                  ):(
                    "Remarks"
                  )}
                </div>
                <div className="pl-2 pt-6 pb-6 pr-2 ppa-form-box bg-white">
                {Admin && ((vehicleData?.admin_approval === 10 || vehicleData?.admin_approval === 7) && vehicleData?.type_of_slip == 'within') ? ( // For the Admin
                    adminApproval ? (
                    <>
                      {/* Form */}
                      <form id="vr_reason" onSubmit={SubmitAdminReason}>
                        <label htmlFor="rep_location" className="block text-base font-bold leading-6 text-black">
                          Reasons:
                        </label>
                        <div className="w-full mt-2">
                          <input
                            type="text"
                            name="rep_location"
                            id="rep_location"
                            value={adminReason}
                            onChange={ev => setAdminReason(ev.target.value)}
                            className="block w-full ppa-form"
                          />
                        </div>
                      </form>

                      {/* Button */}
                      <div className="mt-4">

                        {/* Submit */}
                        <button onClick={handleAdminDecline} className="py-2 px-4 btn-default">
                          Submit
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { setAdminApproval(false); setAdminReason(''); }} className="ml-2 py-2 px-4 btn-cancel">
                            Cancel
                          </button>
                        )}

                        </div>
                    </>
                    ):(
                    <>
                      <div className="w-full ppa-form-remarks">
                        Waiting for your approval
                      </div>

                      {/* Button */}
                      <div className="mt-4">

                        {/* Approve */}
                        <button onClick={handleAdminConfirmation} className="py-2 px-4 btn-default">
                          Approve
                        </button>

                        {/* Decline */}
                        <button onClick={() => setAdminApproval(true)} className="ml-2 py-2 px-4 btn-cancel">
                          Decline
                        </button>

                      </div>
                    </>
                    )
                  ): PortManager && ((vehicleData?.admin_approval === 11 || vehicleData?.admin_approval === 10 || vehicleData?.admin_approval === 7) && vehicleData?.type_of_slip == 'outside') ? ( // For the Port Manager
                    adminApproval ? (
                      <>
                        {/* Form */}
                        <form id="vr_reason" onSubmit={SubmitAdminReason}>
                          <label htmlFor="rep_location" className="block text-base font-bold leading-6 text-black">
                            Reasons:
                          </label>
                          <div className="w-full mt-2">
                            <input
                              type="text"
                              name="rep_location"
                              id="rep_location"
                              value={adminReason}
                              onChange={ev => setAdminReason(ev.target.value)}
                              className="block w-full ppa-form"
                            />
                          </div>
                        </form>

                        {/* Button */}
                        <div className="mt-4">

                          {/* Submit */}
                          <button onClick={handleAdminDecline} className="py-2 px-4 btn-default">
                            Submit
                          </button>

                          {/* Cancel */}
                          {!submitLoading && (
                            <button onClick={() => { setAdminApproval(false); setAdminReason(''); }} className="ml-2 py-2 px-4 btn-cancel">
                              Cancel
                            </button>
                          )}

                          </div>
                      </>
                    ):(
                    <>
                      <div className="w-full ppa-form-remarks">
                        Waiting for your approval
                      </div>

                      {/* Button */}
                      <div className="mt-4">

                        {/* Approve */}
                        <button onClick={handleAdminConfirmation} className="py-2 px-4 btn-default">
                          Approve
                        </button>

                        {/* Decline */}
                        <button onClick={() => setAdminApproval(true)} className="ml-2 py-2 px-4 btn-cancel">
                          Decline
                        </button>

                      </div>
                    </>
                    )
                  ):(
                    <>
                      {/* For the GSO */}
                      {(GSO || PersonAuthority) && [8, 6, 5].includes(vehicleData?.admin_approval) && editDetail ? (
                      <>
                        <form id="vehicleInfo" onSubmit={SubmitVehicleInfo}>

                          {/* Vehicle Type */}
                          <div className="flex items-center">
                            <div className="w-40">
                              <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                                Vehicle Type:
                              </label> 
                            </div>
                            <div className="w-3/5">
                              <select 
                              name="rep_type_of_property" 
                              id="rep_type_of_property" 
                              autoComplete="rep_type_of_property"
                              value={vehicalName}
                              onChange={ev => { setVehicleName(ev.target.value); }}
                              className="block w-full ppa-form"
                              >
                                <option value="" disabled>Vehicle Select</option>
                                {vehicleDet?.map((vehDet) => (
                                  <option key={vehDet.vehicle_id} value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`}>
                                    {vehDet.vehicle_name} ({vehDet.vehicle_plate})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Driver Details */}
                          <div className="flex items-center mt-2">
                            <div className="w-40">
                              <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                                Driver:
                              </label> 
                            </div>
                            <div className="w-3/5">
                              <select 
                              name="rep_type_of_property" 
                              id="rep_type_of_property" 
                              autoComplete="rep_type_of_property"
                              value={pointDriver.did}
                              onChange={ev => {
                                const personnelId = parseInt(ev.target.value);
                                const selectedPersonnel = driverName.find(staff => staff.driver_id === personnelId);

                                setPointDriver(selectedPersonnel ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } : { did: '', dname: '' });
                              }}
                              className="block w-full ppa-form"
                              >
                                <option value="" disabled>Driver Select</option>
                                {driverName?.map((driverDet) => (
                                  <option key={driverDet.driver_id} value={driverDet.driver_id}>
                                    {driverDet.driver_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                        </form>

                        {/* Button */}
                        <div className="mt-4">
                        <button 
                          type="submit"
                          form="vehicleInfo"
                          className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-2">Loading</span>
                            </div>
                          ):(
                            'Submit'
                          )}
                        </button>
                        </div>
                      </>
                      ):(
                      <>
                      
                        <div className="w-full ppa-form-remarks">
                          {vehicleData?.remarks}
                        </div>

                        {/* Button on Generate PDF */}
                        {GSO && vehicleData?.admin_approval != 9 && (
                          <div className="mt-4">
                            <button type="button" onClick={handleButtonClick}
                            className={`px-4 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
                            disabled={submitLoading}
                          >
                            {submitLoading ? (
                              <div className="flex items-center justify-center">
                                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                <span className="ml-2">Generating</span>
                              </div>
                            ) : (
                              'Get PDF'
                            )}
                          </button>
                        </div>
                        )}

                      </>
                      )}
                    </>
                )}

                {/* For Request Prints the form */}
                {(Access) && (vehicleData?.admin_approval ==1 || vehicleData?.admin_approval == 2) && (
                  GSO || PersonAuthority ? null :(
                    <div className="mt-4"> 
                      <button type="button" onClick={handleButtonClick}
                      className={`px-4 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <div className="flex items-center justify-center">
                          <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                          <span className="ml-2">Generating</span>
                        </div>
                      ) : (
                        'Get PDF'
                      )}
                    </button>
                </div>
                  )
                )}
                </div>
              </div>

            </div> 
          : <Restrict />
        ):null
      )}

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          justClose={justClose}
          closePopup={closePopup}
          SubmitApproval={SubmitApproval}
          form={"vr_reason"}
          handleCloseForm={handleCloseForm}
          vehicle={vehicleData?.id}
        />
      )}

      {/* PDF */}
      {isVisible && (
        <div>
          <div className="hidden md:none">
            <div ref={componentRef}>

            <div className="relative" style={{ width: '297mm', height: '210mm', paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', border: '0px solid' }}>

              <div className="grid grid-cols-2 gap-4">

                {/* Copy for the Admin Manager */}
                <div className="col-span-1">

                  <table className="w-full mt-4 mb-10">

                    {/* Header */}
                    <tr>
                      <td colSpan={2} className="w-1/3 text-left text-sm font-arial">
                        <span>Doc. Ref. Code:PM:VEC:LNI:WEN:FM:01</span>
                      </td>
                      <td className="w-1/3 text-right text-sm font-arial">
                        <span>"Annex D"</span>
                      </td>
                    </tr>

                    {/* Agency Name */}
                    <tr>
                      <td colSpan={3} className="text-center text-sm font-arial pt-6">
                        <p>Republic of the Philippines</p>
                        <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
                        <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                      </td>
                    </tr>

                    {/* Date */}
                    <tr>
                      <td className="w-1/3"></td>
                      <td className="w-1/3"></td>
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleData?.created_at)}</p>
                        <p className="text-sm text-center font-arial">Date</p>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PASSENGERS/s:</span>
                            </div>
                            <div className="w-full">
                              {passenger == "None" ? (
                                <div style={{ columnCount: 2, borderBottom: '1px solid black', display: 'block', padding: '1px', height: '18px' }}></div> 
                              ):(
                                <div style={{ columnCount: 2, display: 'block', padding: '1px' }}>
                                  {passenger?.map((data, index) => (
                                    <span key={index} className="flex text-xs border-b border-black mb-1">
                                      {`${index + 1}. ${data }`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Purpose */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PURPOSE:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{vehicleData?.purpose}</span>
                            </div>
                          </div>
                        </div>

                        {/* Place */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>PLACE/s TO BE VISITED:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{vehicleData?.place_visited}</span>
                            </div>
                          </div>
                        </div>

                        {/* Date Time */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>DATE/TIME OF ARRIVAL:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>

                    {/* Driver Information */}
                    <tr>

                      {/* Vehicle Type */}
                      <td className="w-1/3 pt-10">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                        <p className="text-sm text-center font-arial">Type of Vehicle</p>
                      </td>

                      {/* Plate No */}
                      <td className="w-1/3 pt-10 px-8">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                        <p className="text-sm text-center font-arial">Plate No.</p>
                      </td>

                      {/* Driver */}
                      <td className="w-1/3 pt-10 relative">
                        <img
                          src={requestor?.driverEsig}
                          className="ppa-esig-driver-vs"
                          alt="Signature"
                        />
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                        <p className="text-sm text-center font-arial">Driver</p>
                      </td>

                    </tr>

                    {/* Requestor */}
                    <tr>
                      <td colSpan={2} className="w-1/3 pt-5">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          REQUESTED BY:
                        </div>

                        <div className="relative pt-2">
                          <img
                            src={requestor?.requestorEsig}
                            className="ppa-esig-user-vs"
                            alt="Signature"
                          />
                        </div>
                        <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                          {vehicleData?.user_name}
                        </div>
                        <div className="w-3/4 text-center text-sm relative">
                          {requestor?.requestorPosData}
                        </div> 
                        
                      </td>
                    </tr>

                    {/* Admin Manager or Port Manager */}
                    <tr>
                      <td colSpan={2} className="pt-4">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                          (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                        </div>
                        
                        {vehicleData?.type_of_slip == 'within' ? (
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.adminEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.adminName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Adminstrative Division Manager
                          </div> 
                        </>
                        ):(
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.pmEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.pmName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Port Manager
                          </div> 
                        </>
                        )}

                      </td>
                    </tr>

                  </table>

                  <span className="system-generated">Joint Local Management System - This is system-generated.</span>

                </div>

                {/* Copy for GSO */}
                <div className="col-span-1">

                  <table className="w-full mt-4 mb-10">

                    {/* Header */}
                    <tr>
                      <td colSpan={2} className="w-1/3 text-left text-sm font-arial">
                        <span>Doc. Ref. Code:PM:VEC:LNI:WEN:FM:01</span>
                      </td>
                      <td className="w-1/3 text-right text-sm font-arial">
                        <span>"Annex D"</span>
                      </td>
                    </tr>

                    {/* Agency Name */}
                    <tr>
                      <td colSpan={3} className="text-center text-sm font-arial pt-6">
                        <p>Republic of the Philippines</p>
                        <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
                        <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                      </td>
                    </tr>

                    {/* Date */}
                    <tr>
                      <td className="w-1/3"></td>
                      <td className="w-1/3"></td>
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleData?.created_at)}</p>
                        <p className="text-sm text-center font-arial">Date</p>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PASSENGERS/s:</span>
                            </div>
                            <div className="w-full">
                              {passenger == "None" ? (
                                <div style={{ columnCount: 2, borderBottom: '1px solid black', display: 'block', padding: '1px', height: '18px' }}></div> 
                              ):(
                                <div style={{ columnCount: 2, display: 'block', padding: '1px' }}>
                                  {passenger?.map((data, index) => (
                                    <span key={index} className="flex text-xs border-b border-black mb-1">
                                      {`${index + 1}. ${data }`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Purpose */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PURPOSE:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{vehicleData?.purpose}</span>
                            </div>
                          </div>
                        </div>

                        {/* Place */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>PLACE/s TO BE VISITED:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{vehicleData?.place_visited}</span>
                            </div>
                          </div>
                        </div>

                        {/* Date Time */}
                        <div className="mt-2">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>DATE/TIME OF ARRIVAL:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>

                    {/* Driver Information */}
                    <tr>

                      {/* Vehicle Type */}
                      <td className="w-1/3 pt-10">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                        <p className="text-sm text-center font-arial">Type of Vehicle</p>
                      </td>

                      {/* Plate No */}
                      <td className="w-1/3 pt-10 px-8">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                        <p className="text-sm text-center font-arial">Plate No.</p>
                      </td>

                      {/* Driver */}
                      <td className="w-1/3 pt-10 relative">
                        <img
                          src={requestor?.driverEsig}
                          className="ppa-esig-driver-vs"
                          alt="Signature"
                        />
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                        <p className="text-sm text-center font-arial">Driver</p>
                      </td>

                    </tr>

                    {/* Requestor */}
                    <tr>
                      <td colSpan={2} className="w-1/3 pt-5">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          REQUESTED BY:
                        </div>

                        <div className="relative pt-2">
                          <img
                            src={requestor?.requestorEsig}
                            className="ppa-esig-user-vs"
                            alt="Signature"
                          />
                        </div>
                        <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                          {vehicleData?.user_name}
                        </div>
                        <div className="w-3/4 text-center text-sm relative">
                          {requestor?.requestorPosData}
                        </div> 
                        
                      </td>
                    </tr>

                    {/* Admin Manager or Port Manager */}
                    <tr>
                      <td colSpan={2} className="pt-4">

                        <div className="w-3/4 text-sm font-arial font-bold">
                        {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                          (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                        </div>
                        
                        {vehicleData?.type_of_slip == 'within' ? (
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.adminEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.adminName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Adminstrative Division Manager
                          </div> 
                        </>
                        ):(
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.pmEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.pmName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Port Manager
                          </div> 
                        </>
                        )}

                      </td>
                    </tr>

                  </table>

                  <span className="system-generated">Joint Local Management System - This is system-generated.</span>

                </div>

              </div>
            
            </div>

            </div>
          </div>
        </div>
      )}

    </PageComponent>
  );
}