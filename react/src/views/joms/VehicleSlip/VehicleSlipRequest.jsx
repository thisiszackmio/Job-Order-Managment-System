import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";
import moment from 'moment-timezone';
import Popup from "../../../components/Popup";

export default function FacilityVenueForm(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  const [vehicleDet, setVehicleDet] = useState([]);
  const [driver, setDriver] = useState([]);

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
  const currentDateTime = moment().tz('Asia/Manila');

  const [confirmation, setConfirmation] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  //Vehicle Request
  const [selectedTravelType, setSelectedTravelType] = useState('');
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');
  const [vehicalName, setVehicleName] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });

  const [inputErrors, setInputErrors] = useState({});

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

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

  // Confirm Function
  function handleConfirm(event){
    event.preventDefault();

    const selectedDateTime = moment.tz(`${VRDateArrival} ${VRTimeArrival}`, 'YYYY-MM-DD HH:mm', 'Asia/Manila');

    const formData = {
      form: "Check",
      user_type : GSO || PersonAuthority ? 'authorize' : 'member',
      type_of_slip : selectedTravelType,
      user_id : currentUserId,
      user_name : currentUserName.name,
      purpose : VRPurpose,
      passengers : VRPassenger ? VRPassenger : 'None',
      place_visited : VRPlace,
      date_arrival : VRDateArrival,
      time_arrival : VRTimeArrival,
      vehicle_type : vehicalName,
      driver_id : pointDriver.did,
      driver : pointDriver.dname,
      admin_approval : GSO || PersonAuthority ? 7 : Admin ? 5 : PortManager ? 6 : 8,
      remarks : "Check",
    }

    if (selectedDateTime.isBefore(currentDateTime)) {
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Error</p>
          <p className="popup-message">The Date and Time of arrival must be {formatDate(today)} {formatTime(time)} or later</p>
        </div>
      );
    }else{
      axiosClient
      .post('/submitvehrequest', formData)
      .then((response)=>{
        console.log();
        if(response.data.message === "Check"){
          setConfirmation(true);
        }
      })
      .catch((error)=>{
        if(error.response.status === 500) {
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }else{
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }
      });
    }
  }

  // Submit the Form
  function SubmitVehicleForm(event){
    event.preventDefault();
    setSubmitLoading(true);

    // For the Remarks
    const remarks = GSO || PersonAuthority ? 
    selectedTravelType == 'within' ? "Waiting for the Admin's Approval" : "Waiting for the Port Manager's Approval" :
    Admin || PortManager ? 'Waiting for the assign vehicle and driver.' :
    "Awaiting the assignment of a vehicle and driver.";

    const formData = {
      form: "Uncheck",
      user_type : GSO || PersonAuthority ? 'authorize' : 'member',
      type_of_slip : selectedTravelType,
      user_id : currentUserId,
      user_name : currentUserName.name,
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
    }

    axiosClient
    .post('/submitvehrequest', formData)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Submission Complete!</p>
          <p className="popup-message">Form submitted successfully.</p>
        </div>
      );
    })
    .catch(()=>{
      setButtonHide(true)
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

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

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");

  return(
    <PageComponent title="Request Form">
      {/* Form Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Vehicle Slip Request </div>

        <div className="p-4">
        {confirmation ? (
        <>
          <form id="vehicleslip" onSubmit={SubmitVehicleForm}>
            {/* Title */}
            <div>
              <h2 className="text-lg font-bold leading-7 text-gray-900">KINDLY double check your form PLEASE! </h2>
              <p className="text-sm font-bold text-red-500">NOTE: This will not be editable once submitted.</p>
            </div>

            {/* Date */}
            <div className="flex items-center mt-4">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900">
                Date:
                </label> 
              </div>
              <div className="w-1/2 ppa-form-view h-6">
                {formatDate(today)}
              </div>
            </div>

            {/* Travel Type */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Travel Type: </label> 
              </div>
              <div className="w-1/2 ppa-form-view">
              {selectedTravelType == 'within' ? "Within the City" : "Outside the City"}
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Purpose: </label> 
              </div>
              <div className="w-1/2 ppa-form-view">
              {VRPurpose}
              </div>
            </div>

            {/* Place/s to be Visited */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Place/s to be Visited: </label> 
              </div>
              <div className="w-1/2 ppa-form-view">
              {VRPlace}
              </div>
            </div>

            {/* Date of Arrival */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Date of Arrival: </label> 
              </div>
              <div className="w-1/2 ppa-form-view">
              {formatDate(VRDateArrival)}
              </div>
            </div>

            {/* Time of Arrival */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Time of Arrival: </label> 
              </div>
              <div className="w-1/2 ppa-form-view">
              {formatTime(VRTimeArrival)}
              </div>
            </div>

            {(GSO || PersonAuthority) && (
            <>
              {/* Vehicle Type */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Vehicle Type: </label> 
                </div>
                <div className="w-1/2 ppa-form-view">
                {vehicalName}
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Driver: </label> 
                </div>
                <div className="w-1/2 ppa-form-view">
                {pointDriver.dname}
                </div>
              </div>
            </>
            )}

            {/* Passenger/s */}
            {VRPassenger ? (
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-bold leading-6 text-gray-900"> Passenger/s: </label> 
              </div>
            
              {/* Render columns based on passenger count */}
              <div 
                style={{ columnCount: VRPassenger?.split("\n").filter(name => name.trim()).length > 5 ? 2 : 1 }} 
                className="w-1/2 ppa-form-view-border"
              >
                {VRPassenger
                  ?.split("\n")                   // Split passengers by newline
                  .filter(name => name.trim())    // Remove empty lines
                  .map((passenger, index) => (
                    <div key={index} className="flex mt-1.5">
                      <label className="block text-base font-bold leading-6 text-gray-900">
                        {index + 1}.
                      </label> 
                      <div className="w-full ppa-form-view text-left mr-2">
                        {passenger}
                      </div>
                    </div>
                ))}
              </div>
            </div>
            ):null}

            {/* Button */}
            <div className="mt-10 font-roboto">
              {!buttonHide && (
                <>
                {/* Submit */}
                <button type="submit"
                  className={`py-2 px-4 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => setConfirmation(false)} className="ml-2 py-2 px-4 btn-cancel-form">
                      Revise
                    </button>
                  )}
                </>
              )}
            </div>
          </form>
        </>
        ):(
        <>
          {/* Title */}
          <div>
            <h2 className="text-lg font-bold leading-7 text-gray-900"> Fill up the Form </h2>
            <p className="text-sm font-bold text-red-500">NOTE: This form cannot be edited after you submit your request.</p>
          </div>

          {/* Date */}
          <div className="flex items-center mt-4 font-roboto">
            <div className="w-48">
              <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
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

          {/* Type of Travel */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="font-roboto w-48">
              <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-black">
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
                  className="h-6 w-6 text-indigo-900 border-black-500 rounded focus:ring-gray-400"
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
                  className="h-6 w-6 text-indigo-900 border-black-500 rounded focus:ring-gray-400"
                />
                <label
                  htmlFor="outside-city-checkbox"
                  className="ml-2 text-base leading-6 text-black"
                >
                  Outside the City
                </label>
              </div>
              {!selectedTravelType && inputErrors.type_of_slip && (
                <p className="form-validation">This form is required</p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-48">
              <label htmlFor="vr_purpose" className="block text-base font-bold leading-6 text-black">
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
                onChange={(ev) => {
                  const input = ev.target.value;
                  const formatted =
                    input.charAt(0).toUpperCase() + input.slice(1);
                    setVRPurpose(formatted);
                }}
                maxLength={500}
                className={`block w-full ${(!VRPurpose && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
              />
              {!VRPurpose && inputErrors.purpose && (
                <p className="form-validation">This form is required</p>
              )}
            </div>
          </div>

          {/* Place */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-48">
              <label htmlFor="vr_place" className="block text-base font-bold leading-6 text-black">
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
                onChange={(ev) => {
                  const input = ev.target.value;
                  const formatted =
                  input.charAt(0).toUpperCase() + input.slice(1);
                    setVRPlace(formatted);
                }}
                className={`block w-full ${(!VRPlace && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
                maxLength={255}
              />
              {!VRPlace && inputErrors.place_visited && (
                <p className="form-validation">This form is required</p>
              )}
            </div>
          </div>

          {/* Date of Arrival */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-48">
              <label htmlFor="vr_datearrival" className="block text-base font-bold leading-6 text-black">
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
                className={`block w-full ${(!VRDateArrival && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
              />
              {!VRDateArrival && inputErrors.date_arrival && (
                <p className="form-validation">This form is required</p>
              )}
            </div>
          </div>

          {/* Time of Arrival */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-48">
              <label htmlFor="vr_timearrival" className="block text-base font-bold leading-6 text-black">
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
                className={`block w-full ${(!VRTimeArrival && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
              />
              {!VRTimeArrival && inputErrors.time_arrival && (
                <p className="form-validation">This form is required</p>
              )}
            </div>
          </div>

          {(GSO || PersonAuthority) && (
          <>
            {/* Vehicle Type */}
            <div className="flex items-center mt-2">
              <div className="w-48">
                <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
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
                className={`block w-full ${(!vehicalName && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
                >
                  <option value="" disabled>Vehicle Select</option>
                  {vehicleDet?.map((vehDet) => (
                    <option 
                      key={vehDet.vehicle_id} 
                      value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                      disabled={vehDet.availability == 1}
                      className={`${vehDet.availability == 1 ? "disable-form":''}`}
                    >
                      {vehDet.vehicle_name} - {vehDet.vehicle_plate} {vehDet.availability == 1 ? "(On Travel)":null}
                    </option>
                  ))}
                </select>
                {!vehicalName && inputErrors.vehicle_type && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Driver Details */}
            <div className="flex items-center mt-2">
              <div className="w-48">
                <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
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
                className={`block w-full ${(!pointDriver.did && inputErrors.purpose) ? "ppa-form-error":"ppa-form"}`}
                >
                  <option value="" disabled>Driver Select</option>
                  {driver?.map((driverDet) => (
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
                {!pointDriver.did && inputErrors.driver && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>
          </>  
          )}

          {/* Passengers */}
          <div className="flex mt-2 font-roboto">
            <div className="w-48">
              <label htmlFor="vr_passengers" className="block text-base font-bold leading-6 text-black">
                Passengers:
              </label>
            </div>
            <div className="w-1/2">
              <textarea
                id="vr_passengers"
                name="vr_passengers"
                rows={7}
                value={VRPassenger}
                onChange={(ev) => {
                  const formattedValue = ev.target.value
                    .split('\n')
                    .map(line =>
                      line
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                    )
                    .join('\n');
              
                  setVRPassenger(formattedValue);
                }}
                style={{ resize: 'none' }}
                maxLength={1000}
                className="block w-full ppa-form"
                placeholder="Input name of passenger (press 'Enter' for another passenger)"
              />
              <p className="text-gray-500 text-xs">List each name on a separate line without numbering. If there are no passengers, leave it blank.</p>
            </div>
          </div>

          {/* Button */}
          <button 
            onClick={handleConfirm} 
            className="py-2 px-4 btn-default-form">
            Submit
          </button>

        </>
        )}
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
  )
}