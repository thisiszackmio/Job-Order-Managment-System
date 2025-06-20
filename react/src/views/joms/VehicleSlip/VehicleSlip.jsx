import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import Restrict from "../../../components/Restrict";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";
import ppa_logo from '/default/ppa_logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFilePdf, faHouse, faGear, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function VehicleSlip(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const PortManager = codes.includes("PM");
  const SuperAdmin = codes.includes("HACK");
  const roles = ["AM", "GSO", "HACK", "DM", "PM", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

  // Set Access
  const [Access, setAccess] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [dataAccess, setDataAccess] = useState(null);
  const [buttonHide, setButtonHide] = useState(false);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );
 
  // Get the ID
  const {id} = useParams();

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

  const [editDetail, setEditDetail] = useState(true);
  const [adminDisapproval, setAdminDisapproval] = useState(false);

  // Function
  const [vehicleData, setVehicleData] = useState([]);
  const [vacant, setVacant] = useState([]);
  const [passenger, setPassenger] = useState([]);
  const [requestor, setRequestor] = useState([]);
  const [admin, setAdmin] = useState([]);

  const [vehicleDet, setVehicleDet] = useState([]);
  const [driverName, setDriverName] = useState([]);

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
      const pmId = responseData.pmId;
      const pmName = responseData.pmName;
      const pmEsig = responseData.pmEsig;
      const driverEsig = responseData.driverEsig;
      const driverAvail = responseData.driverAvail;
      const vehicleDet = responseData.vehicleDet;

      setVehicleData(FormData);
      setVacant({driverAvail, vehicleDet})
      setPassenger(passengerData);
      setRequestor({requestorPosData, requestorEsig, driverEsig});
      setAdmin({adminName, adminEsig, pmName, pmId, pmEsig});

      // Restrictions Condition
      const myAccess = FormData?.user_id == currentUserId || accessOnly ? "Access" : "Denied";
      setDataAccess(null);

      setAccess(myAccess);
    })
    .catch((error) => {
      if(error.response?.data?.error == "No-Form"){
        setDataAccess('Not-Found');
        window.location = '/404';
      } else {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setLoading(false);
      setShowPopup(false);
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
    if(currentUserId){
      fetchData();
      fetchVehicle();
      fetchDriver();
    }
  }, [id, currentUserId]);

  // Variable
  const [vehicalName, setVehicleName] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });

  // Submit Vehicle Information
  function SubmitVehicleInfo(event){
    event.preventDefault();
    setSubmitLoading(true);

    const VehName = vehicalName?.split(/ \(([^)]+)\)/)?.[0];
    const VehPlate = vehicalName?.split(/ \(([^)]+)\)/)?.[1];

    const vehData = {
      assign: currentUserId,
      vehicle_type : vehicalName,
      driver_id : pointDriver.did, 
      driver : pointDriver.dname,
      vehicleName: VehName,
      vehiclePlate: VehPlate,
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
      .put(`/storevehinfo/${id}`, vehData)
      .then(() => {
        setButtonHide(true);
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
          setButtonHide(true);
          setPopupContent("error");
          setPopupMessage(
            <div>
              <p className="popup-title">Oops!</p>
              <p className="popup-message">This slip has already assign the vehicle and driver.</p>
            </div>
          );
          setShowPopup(true);
        } else {
          setButtonHide(true);
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

  // Update
  const [updatePurpose, setUpdatePurpose] = useState('');
  const [updateVisited, setUpdateVisited] = useState('');
  const [updateArrivalDate, setUpdateArrivalDate] = useState('');
  const [updateArrivalTime, setUpdateArrivalTime] = useState('');
  const [updateVehicle, setUpdateVehicle] = useState('');
  const [updatePassengers, setUpdatePassengers] = useState('');
  const [updatePointDriver, setUpdatePointDriver] = useState({ did: '', dname: '' });

  // Default Checkboxes
  useEffect(() => {
    setUpdatePurpose(vehicleData?.purpose ?? "");
    setUpdateVisited(vehicleData?.place_visited ?? "");
    setUpdateArrivalDate(vehicleData?.date_arrival ?? "");
    setUpdateArrivalTime(vehicleData?.time_arrival ?? "");
    setUpdatePassengers(vehicleData?.passengers ?? "");
  },[
    vehicleData?.purpose,
    vehicleData?.place_visited,
    vehicleData?.date_arrival,
    vehicleData?.time_arrival,
    vehicleData?.passengers,
  ]);

  // Update the Form
  function UpdateVehicleForm(){
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      purpose: updatePurpose,
      passengers: updatePassengers,
      place_visited: updateVisited,
      date_arrival: updateArrivalDate,
      time_arrival: updateArrivalTime,
      vehicle_type: updateVehicle ? updateVehicle : vehicleData?.vehicle_type,
      driver_id: updatePointDriver.did ? updatePointDriver.did : vehicleData?.driver_id,
      driver: updatePointDriver.dname ? updatePointDriver.dname : vehicleData?.driver 
    }

    axiosClient
    .put(`/updatevehicleslip/${id}`, data)
    .then(() => {
      setButtonHide(true);
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
        setEditDetail(true);
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Sorry!</p>
            <p className="popup-message">This request form is no longer editable.</p>
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

  // Approval Popup Confirmation
  function handleAdminConfirmation(){
    setShowPopup(true);
    setPopupContent('adminApproval');
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

    const VehName = vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[0];
    const VehPlate = vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[1];

    const data = {
      approver: currentUserId,
      vehicleName: VehName,
      vehiclePlate: VehPlate,
    }

    axiosClient
    .put(`/vehreqapprove/${id}`, data)
    .then(() => {
      setButtonHide(true);
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
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  const [adminReason, setAdminReason] = useState('');

  // Disapproval Confirmation
  const handleAdminDecline = () => {

    if(adminReason){
      setShowPopup(true);
      setPopupContent('adminDisapproval');
      setPopupMessage(
        <div>
          <p className="popup-title">Are you sure?</p>
          <p className="popup-message">Do you want to disapprove this request? This action cannot be undone.</p>
        </div>
      );
    }else{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Error!</p>
          <p className="popup-message">You have entered an empty field.</p>
        </div>
      );
    }
    
  }

  // Submit Disapproval
  function SubmitAdminReason(event){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      reason: adminReason,
      approver: currentUserId
    }

    axiosClient
      .put(`/admindecline/${id}`, data)
      .then(() => {
        setButtonHide(true);
        setAdminDisapproval(false);
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

  // Arrival Popup Confirm
  function handleArrivalCheck(){
    setShowPopup(true);
    setPopupContent('subAvailability');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">The driver and vehicle arrived at the permisis?</p>
      </div>
    );
  }

  // Arrival Function
  function SubmitAvailability(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/availvehicledriver/${id}`,{
      authority: currentUserName.name
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Availability Confirm</p>
          <p className="popup-message">The driver and vehicle are available for assignment.</p>
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

  // Cancel Form Confirmation
  function handleCancelForm(){
    setShowPopup(true);
    setPopupContent('cancelForm');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to cancel this form? It cannot be restore.</p>
      </div>
    );
  }

  // Cancel Form Function
  function cancelForm(){
    setSubmitLoading(true);

    axiosClient
    .put(`/cancelrequest/${id}`,{
      authority: currentUserName.name
    })
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The request has been canceled.</p>
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

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Vehicle-Slip-No:${id}`
  });

  const handlePDFClick = () => {
    setIsVisible(true); 
    setSeconds(3);
    setLoadingForm(true);
    setTimeout(() => {
      setLoadingForm(false);
      generatePDF();
      setIsVisible(false); 
    }, 2000);
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

  // Popup Button Function
  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
    fetchData();
  }

  //Close Popup on Success
  const closePopup = () => {
    setShowPopup(false);
    setSubmitLoading(false);
    setLoading(true);
    window.location.reload();
  }

  return (
    <PageComponent title="Vehicle Slip">
      {loading ? (
        <div className="flex items-left h-20 space-x-4">
          {/* Loading Animation */}
          <FontAwesomeIcon
            icon={faGear}
            className="text-4xl text-blue-700 gear"
          />
          <span className="loading">Loading...</span>
        </div>
      ):(
      dataAccess != 'Not-Found' ? (
        Access == "Denied" ? (
          <Restrict />
        ):(
          <>
            {/* Header */}
            <div className="ppa-form-header text-base flex justify-between items-center">
              <span>Slip No: <span className="px-2 ppa-form-view">{vehicleData?.id}</span></span> 
              <div className="flex space-x-4">
              {Admin && (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 7) ? (
                !buttonHide && !adminDisapproval && (
                  <div className="flex justify-end space-x-2">
                    {/* Approve */}
                    <button onClick={handleAdminConfirmation} className="px-4 btn-default-form text-sm">
                      Approve
                    </button>
                    {/* Decline */}
                    <button onClick={() => setAdminDisapproval(true)} className="ml-2 py-2 px-4 btn-cancel-form text-sm">
                      Disapprove
                    </button>
                  </div>
                )
              ):PortManager && (vehicleData?.admin_approval == 4 || vehicleData?.admin_approval == 7) ? (
                !buttonHide && !adminDisapproval && (
                  <div className="flex justify-end space-x-2">
                    {/* Approve */}
                    <button onClick={handleAdminConfirmation} className="px-4 btn-default-form text-sm">
                      Approve
                    </button>
                    {/* Decline */}
                    <button onClick={() => setAdminDisapproval(true)} className="ml-2 py-2 px-4 btn-cancel-form text-sm">
                      Disapprove
                    </button>
                  </div>
                )
              ):(
                <>
                {/* For the GSO and Authorize Person */}
                {/* Arrived Button */}
                {(vacant?.driverAvail || vacant?.driverAvail) && (GSO || PersonAuthority) && (
                  <FontAwesomeIcon onClick={handleArrivalCheck} className="icon-delete" title="Arrived" icon={faHouse} />
                )}
                {/* Editable */}
                {(GSO || SuperAdmin) && editDetail && vehicleData?.admin_approval != 0 && vehicleData?.admin_approval != 1 && vehicleData?.admin_approval != 2 && (
                  <FontAwesomeIcon  onClick={(event) => {event.preventDefault(); setEditDetail(false); }} className="icon-delete" title="Edit Form" icon={faPenToSquare} />
                )}
                {/* Generate PDF */}
                {(GSO || Admin) && editDetail && vehicleData?.admin_approval != 0 && (
                  <FontAwesomeIcon onClick={handlePDFClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                )}
                {/* Cancel Form */}
                {GSO && editDetail && vehicleData?.admin_approval != 0 && vehicleData?.admin_approval != 1 && vehicleData?.admin_approval != 2 && vehicleData?.admin_approval != 3 && vehicleData?.admin_approval != 4 && (
                  <FontAwesomeIcon onClick={() => handleCancelForm()} className="icon-delete" title="Cancel Form" icon={faCircleXmark} />
                )}
                {/* Cancel Form on Requestor */}
                {vehicleData?.user_id == currentUserId && [5, 6 , 7, 8].includes(vehicleData?.admin_approval) && (
                  <FontAwesomeIcon onClick={() => handleCancelForm()} className="icon-delete" title="Cancel Form" icon={faCircleXmark} />
                )}
                {/* For the Regular Requestor */}
                {(vehicleData?.user_id == currentUserId && vehicleData?.admin_approval == 1 && !GSO && (
                  <FontAwesomeIcon onClick={handlePDFClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                ))}
                </>
              )}
              </div>
            </div>

            {/* Form */}
            <div className="px-2 pt-4 pb-6 ppa-form-box bg-white mb-6">

              {loadingForm ? (
                <div className="flex justify-center text-lg font-bold items-center space-x-4">
                  Generating PDF
                </div>
              ):(
                adminDisapproval ? (
                <>
                  {/* Disapproved Function */}
                  <form id="vr_reason" onSubmit={SubmitAdminReason}>
                    <label htmlFor="rep_location" className="block text-base font-bold leading-6 text-black">
                      Reason for disapproval:
                    </label>
                    <div className="w-full mt-2">
                      <input
                        type="text"
                        name="rep_location"
                        id="rep_location"
                        value={adminReason}
                        onChange={ev => setAdminReason(ev.target.value)}
                        placeholder="Input the reason"
                        className="block w-full ppa-form"
                      />
                    </div>
                  </form>

                  {/* Button */}
                  <div className="mt-4">
                    {!buttonHide && (
                    <>
                      {/* Submit */}
                      <button onClick={handleAdminDecline} className="py-2 px-4 btn-default-form">
                        Submit
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { setAdminDisapproval(false); setAdminReason(''); }} className="ml-2 py-2 px-4 btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )}
                  </div>
                </>
                ):(
                <>
                  {/* Header */}
                  {editDetail ? (
                  <>
                    {/* Status */}
                    <div className="status-sec">
                      <strong>Status:</strong> {vehicleData?.remarks}
                    </div>
                  </>
                  ):(
                  <>
                    {/* Title */}
                    <div>
                      <h2 className="text-base font-bold leading-7 text-gray-900"> UPDATE THE FORM ENABLED </h2>
                    </div>
                  </>
                  )}    

                  {/* Date Request */}
                  <div className="flex items-center mt-4">
                    <div className="w-44">
                      <label className="block text-base font-bold leading-6 text-black">
                        Date of Request:
                      </label> 
                    </div>
                    <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
                      {!loading && formatDate(vehicleData?.created_at)}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="flex items-center mt-2">
                    <div className="w-44">
                      <label className={`block text-base font-bold leading-6 text-black ${editDetail ? '' : '' }`}>
                        Purpose:
                      </label> 
                    </div>
                    <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2' : '' }`}>
                      {editDetail ? (
                        !loading && vehicleData?.purpose
                      ):(
                        <input
                          type="text"
                          name="update_purpose"
                          id="update_purpose"    
                          value={updatePurpose}
                          onChange={ev => setUpdatePurpose(ev.target.value)}
                          className="block w-full ppa-form"
                        />
                      )}
                    </div>
                  </div>

                  {/* Place/s to be Visited */}
                  <div className="flex items-center mt-2">
                    <div className="w-44">
                      <label className="block text-base font-bold leading-6 text-black">
                        Place/s to be Visited:
                      </label> 
                    </div>
                    <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2' : '' }`}>
                      {editDetail ? (
                        !loading && vehicleData?.place_visited
                      ):(
                        <input
                          type="text"
                          name="update_visited"
                          id="update_visited"    
                          value={updateVisited}
                          onChange={ev => setUpdateVisited(ev.target.value)}
                          className="block w-full ppa-form"
                        />
                      )}
                    </div>
                  </div>

                  {/* Date/Time of Arrival */}
                  <div className="flex items-center mt-2">
                    <div className="w-44">
                      <label className="block text-base font-bold leading-6 text-black">
                        Date/Time of Arrival:
                      </label> 
                    </div>
                    <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : '' }`}>
                      {editDetail ? (
                      <> {!loading && `${formatDate(vehicleData?.date_arrival)} @ ${formatTime(vehicleData?.time_arrival)}`} </>
                      ):(
                      <>
                        {/* Date */}
                        <div>
                          <input
                            type="date"
                            name="update_date"
                            id="update_date"    
                            value={updateArrivalDate}
                            onChange={ev => setUpdateArrivalDate(ev.target.value)}
                            className="block w-full ppa-form"
                          />
                        </div>
                        
                        {/* Time */}
                        <div className="pt-2">
                          <input
                            type="time"
                            name="update_time"
                            id="update_time"    
                            value={updateArrivalTime}
                            onChange={ev => setUpdateArrivalTime(ev.target.value)}
                            className="block w-full ppa-form"
                          />
                        </div>
                      </>
                      )}
                    </div>
                  </div>

                  {(vehicleData?.vehicle_type && vehicleData?.driver) && (
                  <>
                    {/* Type of Vehicle */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-black">
                          {editDetail ? "Type of Vehicle:" : vehicleData?.vehicle_type ? "Type of Vehicle:" : null}
                        </label> 
                      </div>
                      <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : '' }`}>
                        {editDetail ? (
                          !loading && vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[0] : null
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
                              {vehicleDet
                                ?.filter(vehDet => `${vehDet.vehicle_name} (${vehDet.vehicle_plate})` !== vehicleData?.vehicle_type)
                                .map((vehDet) => (
                                  <option 
                                    key={vehDet.vehicle_id} 
                                    value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                                    disabled={vehDet.availability == 1}
                                    className={vehDet.availability == 1 ? "disable-form" : ''}
                                  >
                                    {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.availability == 1 ? "(On Travel)" : null}
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
                          <label className="block text-base font-bold leading-6 text-black">
                          Plate Number:
                          </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
                          {!loading && vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[1] : null}
                        </div>
                      </div>
                    )}

                    {/* Driver */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-black">
                        {editDetail ? "Driver:" : vehicleData?.driver ? "Driver:" : null}
                        </label> 
                      </div>
                      <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : '' }`}>
                        {editDetail ? (
                          vehicleData?.driver
                        ):(
                          vehicleData?.driver ? (
                            <select 
                              name="update_driver" 
                              id="update_driver" 
                              value={updatePointDriver.did}
                              onChange={ev => {
                                const personnelId = parseInt(ev.target.value);
                                const selectedPersonnel = driverName.find(staff => staff.driver_id === personnelId);

                                setUpdatePointDriver(
                                  selectedPersonnel 
                                    ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } 
                                    : { did: '', dname: '' }
                                );
                              }}
                              className="block w-full ppa-form"
                            >
                              <option value="" disabled>{vehicleData?.driver}</option>
                              {driverName
                                ?.filter(driverDet => driverDet.driver_name !== vehicleData?.driver)
                                .map((driverDet) => (
                                  <option 
                                    key={driverDet.driver_id} 
                                    value={driverDet.driver_id}
                                    disabled={driverDet.driver_status == 1}
                                    className={driverDet.driver_status == 1 ? "disable-form" : ''}
                                  >
                                    {driverDet.driver_name} {driverDet.driver_status == 1 ? "(On Travel)" : null}
                                  </option>
                              ))}
                            </select>
                          ):null
                        )}
                      </div>
                    </div>
          
                  </>
                  )}

                  {/* Requested By */}
                  {editDetail && (
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-black">
                        Requested By:
                        </label> 
                      </div>
                      <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
                        {!loading && vehicleData?.user_name}
                      </div>
                    </div>
                  )}

                  {/* Passengers */}
                  <div className="flex items-center mt-2">
                    <div className="w-44">
                      <label className="block text-base font-bold leading-6 text-black">
                      {editDetail ? (passenger == "None" ? null : 'Passengers:'):('Passengers:')}
                      </label> 
                    </div>
                    {editDetail ? (
                      passenger == "None" ? null:(
                        <div style={{ columnCount: passenger.length > 5 ? 2 : 1 }} className="w-1/2 ppa-form-view-border text-left">
                          {passenger?.map((data, index) => (
                              <div key={index} className="w-full ppa-form-view text-left h-6 mb-2">
                                <label className="block text-base leading-6 text-gray-900">
                                  <strong>{index + 1}.</strong> {data}
                                </label> 
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
                        value={updatePassengers}
                        onChange={ev => setUpdatePassengers(ev.target.value)}
                        style={{ resize: 'none' }}
                        maxLength={1000}
                        className="block w-1/2 ppa-form"
                      />
                    </>
                    )}
                  </div>

                  {/* Edit Button */}
                  {!editDetail && (
                    !buttonHide && (
                      <div className="mt-6">
                        {/* Submit */}
                        <button 
                          type="submit" 
                          onClick={() => UpdateVehicleForm()}
                          className={`py-2 px-3 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
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
                        {!submitLoading && (
                          <button 
                            type="button" 
                            onClick={() => setEditDetail(true)} 
                            className="ml-2 py-2 px-4 btn-cancel-form"
                          >
                            Close
                        </button>
                        )}
                        
                      </div>
                    )
                  )}

                  {/* Insert Vehicle and Driver Details */}
                  {!buttonHide && (vehicleData?.admin_approval == 8 || vehicleData?.admin_approval == 6 || vehicleData?.admin_approval == 5 ) && editDetail && (GSO || PersonAuthority) && (
                    <div className="mt-10 border-t border-gray-300">
                      <h2 className="text-base font-bold leading-7 text-black mt-2"> Assign Vehicle and Driver </h2>

                      <form id="vehicleInfo" onSubmit={SubmitVehicleInfo}>
                        <div className="grid grid-cols-2 mt-2">
                          {/* Vehicle Type */}
                          <div className="col-span-1">
                            <div className="flex items-center">
                              <div className="w-40">
                                <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
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
                                    <option 
                                      key={vehDet.vehicle_id} 
                                      value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                                      disabled={vehDet.availability == 1}
                                      className={`${vehDet.availability == 1 ? "disable-form":''}`}
                                    >
                                      {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.availability == 1 ? "(On Travel)":null}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div> 
                          </div>

                          {/* Driver Details */}
                          <div className="col-span-1">
                            <div className="flex items-center">
                              <div className="w-24">
                                <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
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
                                    <option 
                                      key={driverDet.driver_id} 
                                      value={driverDet.driver_id}
                                      disabled={driverDet.driver_status == 1}
                                      className={`${driverDet.driver_status == 1 ? "disable-form":''}`}
                                    >
                                      {driverDet.driver_name} {driverDet.driver_status == 1 ? "(On Travel)":null}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Button */}
                        <div className="mt-4">
                          {!buttonHide && (
                            <button 
                              type="submit"
                              form="vehicleInfo"
                              className={`py-2 px-4 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </>
                )
              )}

            </div>
          </>
        )
      ):(
        null
      )
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
          vehicle={vehicleData?.id}
          CancelForm={cancelForm}
          SubmitApproval={SubmitApproval}
          SubmitAvailability={SubmitAvailability}
          SubmitAdminReason={SubmitAdminReason}
          // form={"vr_reason"}
          // handleCloseForm={handleCloseForm}
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
                    <td className="border w-[80px] border-black p-1 text-center">
                      <img src={ppa_logo} alt="My Image" className="mx-auto w-[45px] absolute ml-3" />
                    </td>
                    <td className="border w-7/12 border-black p-1 font-arial">
                      <div className="text-center relative">
                        <div className="text-[18px]">VEHICLE REQUEST SLIP</div>
                        <div className="text-[10px]">PMO - LANAO DEL NORTE/ILIGAN</div>
                      </div>
                    </td>
                    <td className="border border-black font-arial">
                      <div className="text-[7px] border-black pl-1 mt-3">Doc.Ref.Code: PM:VEC:LNI:WEN:FM:01</div>
                      <div className="text-[7px] border-black pl-1 pt-1">Revision No.: 00</div>
                    </td>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        {/* Agency Name */}
                        <div className="text-center text-sm font-arial pt-3">
                          <p>Republic of the Philippines</p>
                          <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
                          <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                        </div>

                        {/* Date */}
                        <div className="flex justify-end mt-1">
                          <div className="flex flex-col items-center">
                            <p className="w-[150px] border-b border-black text-sm text-center font-arial">
                              {formatDate(vehicleData?.created_at)}
                            </p>
                            <p className="text-sm text-center font-arial">Date</p>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-3">
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
                        <div className="mt-1">
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
                        <div className="mt-1">
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
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>DATE/TIME OF ARRIVAL:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="grid grid-cols-3 gap-6">

                          {/* Vehicle */}
                          <div className="col-span-1 mt-8">
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                            <p className="text-sm text-center font-arial">Type of Vehicle</p>
                          </div>

                          {/* Plate Number */}
                          <div className="col-span-1 mt-8">
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                            <p className="text-sm text-center font-arial">Plate No.</p>
                          </div>

                          {/* Driver */}
                          <div className="col-span-1 mt-8 relative">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2 || vehicleData?.admin_approval == 10 || vehicleData?.admin_approval == 11) && (
                              <img
                                src={requestor?.driverEsig}
                                className="ppa-esig-driver-vs"
                                alt="Signature"
                              />
                            )}
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                            <p className="text-sm text-center font-arial">Driver</p>
                          </div>

                        </div>

                        {/* Requestor */}
                        <div className="mt-6">
                          <div className="text-sm font-arial font-bold">
                            REQUESTED BY:
                          </div>
                          <div className="w-[280px]">
                            <div className="relative pt-2">
                              <img
                                src={requestor?.requestorEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            </div>
                            <div className="text-center font-bold border-b border-black text-sm relative mt-4">
                              {vehicleData?.user_name}
                            </div>
                            <div className="text-center text-sm relative">
                              {requestor?.requestorPosData}
                            </div> 
                          </div>
                        </div>

                        {/* Approver */}
                        <div className="mt-5 mb-5">
                          <div className="text-sm font-arial font-bold">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                            (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                          </div>
                          <div className="w-[280px]">
                            {vehicleData?.type_of_slip == 'within' ? (
                            <>
                              <div className="relative pt-2">
                                {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                                  vehicleData.user_id == admin?.pmId ? (
                                    <img
                                      src={admin?.pmEsig}
                                      className="ppa-esig-user-vs"
                                      alt="Signature"
                                  />
                                  ):(
                                    <img
                                    src={admin?.adminEsig}
                                    className="ppa-esig-user-vs"
                                    alt="Signature"
                                  />
                                  )
                                )}
                              </div>
                              <div className="text-center font-bold border-b border-black text-sm relative mt-5">
                                {vehicleData.user_id == admin?.pmId ? admin?.pmName : admin?.adminName}
                              </div> 
                              <div className="text-center text-sm relative">
                                {vehicleData.user_id == admin?.pmId ? 'Acting Port Manager' : 'Acting Adminstrative Division Manager'}
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
                              <div className="text-center font-bold border-b border-black text-sm relative mt-5">
                                {admin?.pmName}
                              </div> 
                              <div className="text-center text-sm relative">
                                Acting Port Manager
                              </div> 
                            </>
                            )}
                          </div>
                        </div>

                        <span className="system-generated">Job Order Management System - This is system-generated.</span>

                      </td>
                    </tr>

                  </table>
                </div>

                {/* Copy for GSO */}
                <div className="col-span-1">
                  <table className="w-full mt-4 mb-10">

                    {/* Header */}
                    <td className="border w-[80px] border-black p-1 text-center">
                      <img src={ppa_logo} alt="My Image" className="mx-auto w-[45px] absolute ml-3" />
                    </td>
                    <td className="border w-7/12 border-black p-1 font-arial">
                      <div className="text-center relative">
                        <div className="text-[18px]">VEHICLE REQUEST SLIP</div>
                        <div className="text-[10px]">PMO - LANAO DEL NORTE/ILIGAN</div>
                      </div>
                    </td>
                    <td className="border border-black font-arial">
                      <div className="text-[7px] border-black pl-1 mt-3">Doc.Ref.Code: PM:VEC:LNI:WEN:FM:01</div>
                      <div className="text-[7px] border-black pl-1 pt-1">Revision No.: 00</div>
                    </td>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        {/* Agency Name */}
                        <div className="text-center text-sm font-arial pt-3">
                          <p>Republic of the Philippines</p>
                          <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
                          <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                        </div>

                        {/* Date */}
                        <div className="flex justify-end mt-1">
                          <div className="flex flex-col items-center">
                            <p className="w-[150px] border-b border-black text-sm text-center font-arial">
                              {formatDate(vehicleData?.created_at)}
                            </p>
                            <p className="text-sm text-center font-arial">Date</p>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-3">
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
                        <div className="mt-1">
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
                        <div className="mt-1">
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
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-72 font-arial text-sm">
                              <span>DATE/TIME OF ARRIVAL:</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-xs">
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="grid grid-cols-3 gap-6">

                          {/* Vehicle */}
                          <div className="col-span-1 mt-8">
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                            <p className="text-sm text-center font-arial">Type of Vehicle</p>
                          </div>

                          {/* Plate Number */}
                          <div className="col-span-1 mt-8">
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                            <p className="text-sm text-center font-arial">Plate No.</p>
                          </div>

                          {/* Driver */}
                          <div className="col-span-1 mt-8 relative">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2 || vehicleData?.admin_approval == 10 || vehicleData?.admin_approval == 11) && (
                              <img
                                src={requestor?.driverEsig}
                                className="ppa-esig-driver-vs"
                                alt="Signature"
                              />
                            )}
                            <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                            <p className="text-sm text-center font-arial">Driver</p>
                          </div>

                        </div>

                        {/* Requestor */}
                        <div className="mt-6">
                          <div className="text-sm font-arial font-bold">
                            REQUESTED BY:
                          </div>
                          <div className="w-[280px]">
                            <div className="relative pt-2">
                              <img
                                src={requestor?.requestorEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            </div>
                            <div className="text-center font-bold border-b border-black text-sm relative mt-4">
                              {vehicleData?.user_name}
                            </div>
                            <div className="text-center text-sm relative">
                              {requestor?.requestorPosData}
                            </div> 
                          </div>
                        </div>

                        {/* Approver */}
                        <div className="mt-5 mb-5">
                          <div className="text-sm font-arial font-bold">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                            (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                          </div>
                          <div className="w-[280px]">
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
                              <div className="text-center font-bold border-b border-black text-sm relative mt-5">
                                {admin?.adminName}
                              </div> 
                              <div className="text-center text-sm relative">
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
                              <div className="text-center font-bold border-b border-black text-sm relative mt-5">
                                {admin?.pmName}
                              </div> 
                              <div className="text-center text-sm relative">
                                Acting Port Manager
                              </div> 
                            </>
                            )}
                          </div>
                        </div>

                        <span className="system-generated">Job Order Management System - This is system-generated.</span>

                      </td>
                    </tr>

                  </table>
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