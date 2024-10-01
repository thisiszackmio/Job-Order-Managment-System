import React, { useEffect, useState } from "react";
import submitAnimation from '../../../assets/loading_nobg.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";
import moment from 'moment-timezone';
import loadingAnimation from '/ppa_logo_animationn_v4.gif';

export default function FacilityVenueForm(){
  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const GSO = codes.includes("GSO");
  const Admin = codes.includes("AM");

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

  const today = moment().tz('Asia/Manila').format('YYYY-MM-DD');
  const time = moment().tz('Asia/Manila').format('HH:mm');

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  //Vehicle Request
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');
  const [vehicalName, setVehicleName] = useState('');
  const [driver, setDriver] = useState('');

  const [inputErrors, setInputErrors] = useState({});
  const [vehicleDet, setVehicleDet] = useState([]);
  const [driverName, setDriverName] = useState([]);

  // Get Vehicle Details
  const fetchVehicle = () => {
    axiosClient
    .get(`/getvehdet`)
    .then((response) => {
      const responseData = response.data;

      setVehicleDet(responseData)
      
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
    fetchVehicle();
    fetchDriver();
  }, []);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const popupClass = 'popup-show';
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else if(loading) {
      addLoadingClass();
    }
    else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
      removeLoadingClass();
    };
  }, [showPopup, loading]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit the Form
  function SubmitVehicleForm(event){
    event.preventDefault();

    setSubmitLoading(true);

    const remarks = GSO ? "Waiting for the Admin Manager's Approval." : Admin ? "Waiting for the assign vehicle and driver." : 'Awaiting the GSO to assign a vehicle and driver.';
    const message = GSO ? `The request for ${currentUserId.name} needs your approval.` : `There is a request for ${currentUserId.name}`;

    const data = {
      user_id : currentUserId.id,
      user_name : currentUserId.name,
      purpose : VRPurpose,
      passengers : VRPassenger ? VRPassenger : 'None',
      place_visited : VRPlace,
      date_arrival : VRDateArrival,
      time_arrival : VRTimeArrival,
      vehicle_type : vehicalName,
      driver : driver,
      admin_approval: GSO ? 3 : Admin ? 6 : 4,
      remarks : remarks,
      // Notifications
      code_clearance : ucode,
      avatar : dpname,
      sender_id : currentUserId.id,
      sender_name : currentUserId.name,
      notif_message : message,
    }

    if(GSO && (!vehicalName && !driver)){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered. (Vehicle Type and Driver)</p>
        </div>
      );
      setSubmitLoading(false);
    } else {
      axiosClient
      .post('/submitvehrequest', data)
      .then(() => {
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Submission Complete!</p>
            <p className="popup-message">Form submitted successfully.</p>
          </div>
        );
      })
      .catch((error)=>{
        if (error.response.status === 422 && error.response.data.error === 'invalidDate') {
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">Error</p>
              <p className="popup-message">The Date and Time of arrival must be {formatDate(today)} {formatTime(time)} or later</p>
            </div>
          );
        }
        else if (error.response.status === 500) {
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }else{
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
    
  }

  // Popup Button Function
  //Close Popup on Error
  function justclose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.href = '/joms/myrequest';
  }

  return loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="loading-text loading-animation">
      {Array.from("Loading...").map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
      ))}
      </span>
    </div>
  ):(
    <PageComponent title="Request Form">

      {/* Form Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Vehicle Slip Request </div>

        <div className="p-4">

          <form id="vehicleslip" onSubmit={SubmitVehicleForm}>

            {/* Title */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
              <p className="text-xs font-bold text-red-500">Please double check the form before submitting</p>
            </div>

            {/* Date */}
            <div className="flex items-center mt-6 font-roboto">
              <div className="w-60">
                <label htmlFor="rep_date" className="block text-base leading-6 text-black">
                  Date:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="date"
                  name="vr_date"
                  id="vr_date"
                  defaultValue={today}
                  className="block w-full ppa-form"
                  readOnly
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center mt-4 font-roboto">
              <div className="w-60">
                <label htmlFor="vr_purpose" className="block text-base font-medium leading-6 text-gray-900">
                  Purpose:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="vr_purpose"
                  id="vr_purpose"
                  autoComplete="vr_purpose"
                  value={VRPurpose}
                  onChange={ev => setVRPurpose(ev.target.value)}
                  maxLength={500}
                  className="block w-full ppa-form"
                />
                {!VRPurpose && inputErrors.purpose && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Place */}
            <div className="flex items-center mt-4 font-roboto">
              <div className="w-60">
                <label htmlFor="vr_place" className="block text-base font-medium leading-6 text-gray-900">
                  Place/s To Be Visited:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="vr_place"
                  id="vr_place"
                  autoComplete="vr_place"
                  value={VRPlace}
                  onChange={ev => setVRPlace(ev.target.value)}
                  className="block w-full ppa-form"
                  maxLength={255}
                />
                {!VRPlace && inputErrors.place_visited && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Date of Arrival */}
            <div className="flex items-center mt-4 font-roboto">
              <div className="w-60">
                <label htmlFor="vr_datearrival" className="block text-base font-medium leading-6 text-gray-900">
                  Date of Arrival:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="date"
                  name="vr_datearrival"
                  id="vr_datearrival"
                  value= {VRDateArrival}
                  onChange={ev => setVRDateArrival(ev.target.value)}
                  min={today}
                  className="block w-full ppa-form"
                />
                {!VRDateArrival && inputErrors.date_arrival && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Time of Arrival */}
            <div className="flex items-center mt-4 font-roboto">
              <div className="w-60">
                <label htmlFor="vr_timearrival" className="block text-base font-medium leading-6 text-gray-900">
                  Time of Arrival:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="time"
                  name="vr_timearrival"
                  id="vr_timearrival"
                  value= {VRTimeArrival}
                  onChange={ev => setVRTimeArrival(ev.target.value)}
                  className="block w-full ppa-form"
                />
                {!VRTimeArrival && inputErrors.time_arrival && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>
            
            {GSO && (
            <>
              {/* Vehicle Type */}
              <div className="flex items-center mt-4">
                <div className="w-60">
                  <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                    Vehicle Type:
                  </label> 
                </div>
                <div className="w-1/2">
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
              <div className="flex items-center mt-4">
                <div className="w-60">
                  <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                    Driver:
                  </label> 
                </div>
                <div className="w-1/2">
                  <select 
                  name="rep_type_of_property" 
                  id="rep_type_of_property" 
                  autoComplete="rep_type_of_property"
                  value={driver}
                  onChange={ev => { setDriver(ev.target.value); }}
                  className="block w-full ppa-form"
                  >
                    <option value="" disabled>Driver Select</option>
                    {driverName?.map((driverDet) => (
                      <option key={driverDet.driver_id} value={driverDet.driver_name}>
                        {driverDet.driver_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
            )}

            {/* Passengers */}
            <div className="flex mt-6 font-roboto">
              <div className="w-60">
                <label htmlFor="vr_passengers" className="block text-base font-medium leading-6 text-gray-900">
                  Passengers:
                </label>
              </div>
              <div className="w-1/2">
                <textarea
                  id="vr_passengers"
                  name="vr_passengers"
                  rows={7}
                  value={VRPassenger}
                  onChange={ev => setVRPassenger(ev.target.value)}
                  style={{ resize: 'none' }}
                  maxLength={1000}
                  className="block w-full ppa-form"
                />
                <p className="text-gray-500 text-xs mt-2">Separate name on next line (If no passengers just leave it blank)</p>
              </div>
            </div>

          </form>

          {/* Submit Button */}
          <div className="mt-10 font-roboto">
            <button
              type="submit"
              form="vehicleslip"
              className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay with blur effect */}
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
          {/* Popup content */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
            {/* Notification Icons */}
            <div className="f-modal-alert">

              {/* Error */}
              {popupContent == 'error' && (
                <div className="f-modal-icon f-modal-error animate">
                  <span className="f-modal-x-mark">
                    <span className="f-modal-line f-modal-left animateXLeft"></span>
                    <span className="f-modal-line f-modal-right animateXRight"></span>
                  </span>
                </div>
              )}

              {/* Success */}
              {popupContent == 'success' && (
                <div class="f-modal-icon f-modal-success animate">
                  <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                  <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                </div>
              )}

            </div>
            {/* Popup Message */}
            <p className="text-lg text-center"> {popupMessage} </p>
            {/* Buttons */}
            <div className="flex justify-center mt-4">
              {/* Error Button */}
              {popupContent == 'error' && (
                <button onClick={justclose} className="w-full py-2 btn-cancel">
                  Close
                </button>
              )}

              {/* Success */}
              {popupContent == 'success' && (
                <button onClick={closePopup} className="w-full py-2 btn-default">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </PageComponent>
  );
}