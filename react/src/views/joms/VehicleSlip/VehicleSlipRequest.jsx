import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";
import moment from 'moment-timezone';
import Popup from "../../../components/Popup";

export default function FacilityVenueForm(){
  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar from the sender on notification
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

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

  //Vehicle Request
  const [selectedTravelType, setSelectedTravelType] = useState('');
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');
  const [vehicalName, setVehicleName] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [inputErrors, setInputErrors] = useState({});
  const [travelType, setTravelType] = useState(false);
  const [vehicleDet, setVehicleDet] = useState([]);
  const [driver, setDriver] = useState([]);

  // Get Vehicle Details
  const fetchVehicle = () => {
    axiosClient
    .get(`/getvehdet`)
    .then((response) => {
      const responseData = response.data;

      setVehicleDet(responseData)    
    });
  }

  // Get Driver Details
  const fetchDriver = () => {
    axiosClient
    .get(`/getdriverdet`)
    .then((response) => {
      const responseData = response.data;

      setDriver(responseData)
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

  // Submit the Form
  function SubmitVehicleForm(event){
    event.preventDefault();
    setSubmitLoading(true);

    // For the Remarks
    const remarks = GSO || PersonAuthority ? 
    selectedTravelType == 'within' ? "Waiting for the Admin's Approval" : "Waiting for the Port Manager's Approval" :
    Admin || PortManager ? 'Waiting for the assign vehicle and driver.' :
    "Awaiting the assignment of a vehicle and driver.";

    // For the notification message
    const message = GSO || PersonAuthority ?
    selectedTravelType == 'within' ? `There is a request for ${currentUserId.name} and needs your approval` : `There is a request for ${currentUserId.name} and needs your approval` :
    `There is a request for ${currentUserId.name}`;

    const data = {
      user_type : GSO || PersonAuthority ? 'authorize' : 'member',
      type_of_slip : selectedTravelType,
      user_id : currentUserId.id,
      user_name : currentUserId.name,
      purpose : VRPurpose,
      passengers : VRPassenger ? VRPassenger : 'None',
      place_visited : VRPlace,
      date_arrival : VRDateArrival,
      time_arrival : VRTimeArrival,
      vehicle_type : vehicalName,
      driver_id : pointDriver.did,
      driver : pointDriver.dname,
      admin_approval : GSO || PersonAuthority ? 7 : Admin ? 5 : PortManager ? 6 : 8,
      remarks : remarks,

      // Notifications
      code_clearance : ucode,
      avatar : dpname,
      sender_id : currentUserId.id,
      sender_name : currentUserId.name,
      notif_message : message,
    }

    if(!selectedTravelType){
      setTravelType(true);
      setSubmitLoading(false);
    } else {
      setTravelType(false);

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
        if(error.response.data.error === 'invalidDate'){
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">Error</p>
              <p className="popup-message">The Date and Time of arrival must be {formatDate(today)} {formatTime(time)} or later</p>
            </div>
          );
        }
        else if(error.response.status === 422){
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
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

  // Popup Button Function
  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.href = '/joms/myrequest';
  }

  return (
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

            {/* Type of Travel */}
            <div className="flex items-center mt-10 font-roboto">
              <div className="font-roboto w-60">
                <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                  Type of Travel:
                </label>
              </div>
              <div className="w-1/2 flex items-center space-x-6">

                {/* Within City */}
                <div className="flex items-center">
                  <input
                    id="within-city-checkbox"
                    type="checkbox"
                    checked={selectedTravelType === "within"}
                    onChange={() => setSelectedTravelType("within")}
                    className="h-6 w-6 text-indigo-600 border-black-500 rounded focus:ring-gray-400"
                  />
                  <label
                    htmlFor="within-city-checkbox"
                    className="ml-2 text-base leading-6 text-black"
                  >
                    Within the City
                  </label>
                </div>

                {/* Outside City */}
                <div className="flex items-center">
                  <input
                    id="outside-city-checkbox"
                    type="checkbox"
                    checked={selectedTravelType === "outside"}
                    onChange={() => setSelectedTravelType("outside")}
                    className="h-6 w-6 text-indigo-600 border-black-500 rounded focus:ring-gray-400"
                  />
                  <label
                    htmlFor="outside-city-checkbox"
                    className="ml-2 text-base leading-6 text-black"
                  >
                    Outside the City
                  </label>
                </div>
                {travelType && (
                  <p className="form-validation">Don't forget on this one</p>
                )}
              </div>
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

            {(GSO || PersonAuthority) && (
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
                  {!vehicalName && inputErrors.vehicle_type && (
                    <p className="form-validation">This form is required</p>
                  )}
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
                  value={pointDriver.did}
                  onChange={ev => {
                    const personnelId = parseInt(ev.target.value);
                    const selectedPersonnel = driver.find(staff => staff.driver_id === personnelId);

                    setPointDriver(selectedPersonnel ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } : { did: '', dname: '' });
                  }}
                  className="block w-full ppa-form"
                  >
                    <option value="" disabled>Driver Select</option>
                    {driver?.map((driverDet) => (
                      <option key={driverDet.driver_id} value={driverDet.driver_id}>
                        {driverDet.driver_name}
                      </option>
                    ))}
                  </select>
                  {!pointDriver.did && inputErrors.driver && (
                    <p className="form-validation">This form is required</p>
                  )}
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
                <p className="text-gray-500 text-xs mt-2">List each name on a separate line without numbering. If there are no passengers, leave it blank.</p>
              </div>
            </div>

          </form>

          {/* Submit Button */}
          <div className="mt-10 font-roboto">
            <button type="submit" form="vehicleslip"
              className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-1">Processing...</span>
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
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          justClose={justClose}
          closePopup={closePopup}
        />
      )}

    </PageComponent>
  );
}