import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import moment from 'moment-timezone';
import Popup from "../../components/Popup";
import { useNavigate } from "react-router-dom";

export default function FacilityVenueForm(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  const today = moment().tz('Asia/Manila').format('YYYY-MM-DD');
  const time = moment().tz('Asia/Manila').format('HH:mm');
  const currentDateTime = moment().tz('Asia/Manila');

  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  //Vehicle Request
  const [selectedTravelType, setSelectedTravelType] = useState('');
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');
  const [vehicalName, setVehicleName] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });
  const [VRNote, setVRNote] = useState('');

  const [inputErrors, setInputErrors] = useState({});

  const [vehicleDet, setVehicleDet] = useState([]);
  const [driver, setDriver] = useState([]);

  const [buttonHide, setButtonHide] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // On travel
  function checkAvailability(){
    axiosClient.put("/checktsavailability", {
      date: VRDateArrival,
    })
    .then((response) => {
      const responseData = response.data;
      // console.log(responseData.vehicles);
      
      setDriver(responseData.drivers);
      setVehicleDet(responseData.vehicles);
    });
  }

  // Check if there is on travel schedule
  function checkTravelSchedule(){
    if(GSO || VehicleAuthorize){
      axiosClient.put("/checktravelschedule")
      .then(res => {
        console.log("Travel Schedule:", res.data);
        // optional: set state here
        // setSchedule(res.data);
      })
      .catch(err => {
        console.error("Error:", err);
      });
    }
  }

  useEffect(() => {
    if(VRDateArrival && VRTimeArrival){
      checkTravelSchedule();
      checkAvailability();
    } 
  }, [VRDateArrival, VRTimeArrival]);

  const [confirmation, setConfirmation] = useState(false);

  // Confirm Function
  function handleConfirm(event){
    event.preventDefault();

    const selectedDateTime = moment.tz(`${VRDateArrival} ${VRTimeArrival}`, 'YYYY-MM-DD HH:mm', 'Asia/Manila');

    const formData = {
      form: "Check",
      user_type : GSO || VehicleAuthorize ? 'authorize' : 'member',
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
      admin_approval : GSO || VehicleAuthorize ? 8 : Admin ? 6 : PortManager ? 7 : 9,
      remarks : "Check",
    }

    if (selectedDateTime.isBefore(currentDateTime)) {
      setShowPopup(true);
      setPopupContent('check-error');
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
        if(error.response.status === 422) {
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }else{
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(error.response.status);
        }
      });
    }
  }

  // Submit the Form
  function SubmitVehicleForm(event){
    event.preventDefault();
    setSubmitLoading(true);

    // For the Remarks
    const remarks = GSO || VehicleAuthorize ? 
    selectedTravelType == 'within' ? "Waiting for the Admin's Approval" : "Waiting for the Port Manager's Approval" :
    Admin || PortManager ? 'Waiting for the assign vehicle and driver.' :
    "Awaiting the assignment of a vehicle and driver.";

    const formData = {
      form: "Uncheck",
      user_type : GSO || VehicleAuthorize ? 'authorize' : 'member',
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
      admin_approval : GSO || VehicleAuthorize ? 8 : Admin ? 6 : PortManager ? 7 : 9,
      remarks : remarks,
      notes: VRNote
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
    .catch((error)=>{
      setButtonHide(true)
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
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
    navigate(`/joms/myrequest#vehicle`);
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  // const SuperAdmin = codes.includes("HACK");
  const GSO = codes.includes("GSO");
  const VehicleAuthorize = codes.includes("AUV");
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");

  return(
    <PageComponent title="Request Form">
      {/* Form Content */}
      <div className="ppa-widget px-4 pb-5 mt-10">
        <div className="joms-user-info-header text-left"> Request for Vehicle Slip Request </div>
        {/* Form Area */}
        <div className="form-container">
          {/* Title and Button */}
          <div className="flex justify-between items-center"> 
            {/* Title */}
            <div className="px-2">
              {confirmation ? (
                <>
                  <h2 className="text-base font-bold leading-7 text-gray-900"> 
                    Form Review
                  </h2>
                  <p className="text-xs font-bold text-red-500">
                    Please double check your FORM before submitting
                  </p>
                </>
                ):(
                  <>
                    <h2 className="text-base font-bold leading-7 text-gray-900"> 
                      Fill out the other form
                    </h2>
                    <p className="text-xs font-bold text-red-500">
                      * - fields that need to be filled out
                    </p>
                  </>
                )}
            </div>
            {/* Button */}
            <div className="px-2 pb-4 flex justify-start">
              {confirmation ? (
                !buttonHide && (
                  <>
                  {/* Submit */}
                  <button 
                    onClick={SubmitVehicleForm}
                    className={`w-full md:w-auto py-2 px-4 text-sm ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
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
                      <button onClick={() => setConfirmation(false)} className="w-full md:w-auto ml-2 py-2 px-4 text-sm btn-cancel">
                        Revise
                      </button>
                    )}
                  </>
                )
              ):(
                <button 
                  onClick={handleConfirm} 
                  className="w-auto py-1.5 px-6 text-base btn-primary">
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* Field */}
          <div className="grid grid-cols-2 gap-10 px-2">
            {/* 1st Column */}
            <div className="col-span-1">

              {/* Date */}
              <div className="flex items-center mt-6">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Date
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    <div className="block w-full ppa-form-confirm h-[40px]">
                      {formatDate(today)}
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Type */}
              <div className="flex items-center mt-2">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Travel Type
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                  <>
                    <div className="flex">
                      {/* Within City */}
                      <div className="flex items-center">
                        <input
                          id="within-city-checkbox"
                          type="checkbox"
                          checked={selectedTravelType === "within"}
                          onChange={() =>
                            setSelectedTravelType(prev =>
                              prev === "within" ? "" : "within"
                            )
                          }
                          className="focus:ring-0 h-[40px] w-[40px] form-check checked"
                          disabled={confirmation}
                        />
                        <label
                          htmlFor="within-city-checkbox"
                          className="border-t border-b form-title-choose"
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
                          onChange={() =>
                            setSelectedTravelType(prev =>
                              prev === "outside" ? "" : "outside"
                            )
                          }
                          className="focus:ring-0 h-[40px] w-[40px] form-check checked"
                          disabled={confirmation}
                        />
                        <label
                          htmlFor="outside-city-checkbox"
                          className="border-t border-b border-r form-title-choose"
                        >
                          Outside the City
                        </label>
                      </div>
                    </div>
                  </>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div className="flex items-center mt-2">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Purpose
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
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
                        className="block w-full focus:ring-0 ppa-form-field"
                        disabled={confirmation}
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {VRPurpose}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Place */}
              <div className="flex items-center mt-2">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Place
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
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
                        maxLength={255}
                        className="block w-full focus:ring-0 ppa-form-field"
                        disabled={confirmation}
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {VRPlace}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Date of Arrival */}
              <div className="flex items-center mt-2">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Date of Arrival
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="date"
                        name="vr_datearrival"
                        id="vr_datearrival"
                        value= {VRDateArrival}
                        onChange={ev => setVRDateArrival(ev.target.value)}
                        min={today}
                        className="block w-full focus:ring-0 ppa-form-field"
                        disabled={confirmation}
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {formatDate(VRDateArrival)}
                      </div>
                    )
                  )}
                </div>
              </div>
              {!confirmation && (<p className="text-gray-500 text-xs">Please enter the date of arrival at your destination.</p>)}

              {/* Time of Arrival */}
              <div className="flex items-center mt-2">
                <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Time of Arrival
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="time"
                        name="vr_timearrival"
                        id="vr_timearrival"
                        value= {VRTimeArrival}
                        onChange={ev => setVRTimeArrival(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                        disabled={confirmation}
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {formatTime(VRTimeArrival)}
                      </div>
                    )
                  )}
                </div>
              </div>
              {!confirmation && (<p className="text-gray-500 text-xs">Please enter the time of arrival at your destination.</p>)}

              {/* Driver and Vehicle Assignment */}
              {(GSO || VehicleAuthorize) && (
              <>
                {/* Vehicle Type */}
                <div className="flex items-center mt-2">
                  <div className="w-56 form-title">
                    <label htmlFor="rep_date"> 
                      Vehicle Type
                    </label> 
                  </div>
                  <div className="w-full">
                    {loading ? (
                      <div className="skeleton-form"></div>
                    ):(
                      !confirmation ? (
                        <select 
                          name="rep_type_of_property" 
                          id="rep_type_of_property" 
                          autoComplete="rep_type_of_property"
                          value={vehicalName}
                          onChange={ev => { setVehicleName(ev.target.value); }}
                          className={`block w-full focus:ring-0 ${(!vehicalName && inputErrors.purpose) ? "ppa-form-error":"ppa-form-field"}`}
                          disabled={!VRDateArrival || !VRTimeArrival}
                        >
                          <option value="" disabled>Vehicle Select</option>
                          {vehicleDet?.map((vehDet) => (
                            <option
                              key={vehDet.id} 
                              value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                              className={`${vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel" ? "disable-form":''}`}
                              disabled={vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel"}
                            >
                              {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.status == "Reserve" ? "- Reserve" : vehDet.status == "Not Available" ? "- Not Available" : vehDet.status == "On Travel" ? "- On Travel" : "" }
                            </option>
                          ))}
                        </select>
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {vehicalName}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Driver Details */}
                <div className="flex items-center mt-2">
                  <div className="w-56 form-title">
                    <label htmlFor="rep_date"> 
                      Driver Details
                    </label> 
                  </div>
                  <div className="w-full">
                    {loading ? (
                      <div className="skeleton-form"></div>
                    ):(
                      !confirmation ? (
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
                          className={`block w-full focus:ring-0 ${(!pointDriver.did && inputErrors.purpose) ? "ppa-form-error":"ppa-form-field"}`}
                          disabled={!VRDateArrival || !VRTimeArrival}
                        >
                          <option value="" disabled>Driver Select</option>
                          {driver?.map((driverDet) => (
                            <option
                              key={driverDet.id} 
                              value={driverDet.id}
                              className={`${driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel" ? "disable-form":''}`}
                              disabled={driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel"}
                            >
                              {driverDet.name} {driverDet.status == "Reserve" ? "- Reserve" : driverDet.status == "Not Available" ? "- Not Available" : driverDet.status == "On Travel" ? "- On Travel" : "" }
                            </option>
                          ))}
                        </select>
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {pointDriver.dname}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">Leave it blank if no driver or vehicle has been assigned. Let the assigned personnel or GSO handle the assignment.</p>
              </>
              )}
            </div>

            {/* 1st Column */}
            <div className="col-span-1">
      
              {/* Passengers */}
              <div className="mt-6">
                <div className="w-[20%] form-title-dorm">
                  <label htmlFor="male_guest"> Passenger/s </label>
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form h-[50px]"></div>
                  ):(
                    !confirmation ? (
                    <textarea
                    id="vr_passengers"
                    name="vr_passengers"
                    rows={5}
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
                    className="block w-full focus:ring-0 ppa-form-field-dorm"
                    />
                    ):(
                      VRPassenger?.trim() ? (
                        VRPassenger.split("\n").map((name, index) => (
                          <div key={index} className="mt-2 flex ppa-list-form">
                            <span className="numbering">{`${index + 1}.`}</span>
                            <div className="naming">
                              {name}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="mt-2 ppa-list-form">No Male Guest</div>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Note */}
              {selectedTravelType == 'outside' && (
                <div className="flex items-center mt-2">
                  <div className="w-56 form-title">
                  <label htmlFor="rep_date"> 
                    Note
                  </label> 
                  </div>
                  <div className="w-full">
                    {loading ? (
                      <div className="skeleton-form"></div>
                    ):(
                      !confirmation ? (
                        <input
                          id="vr_notes"
                          name="vr_notes"
                          value={VRNote}
                          onChange={(ev) => {
                            const input = ev.target.value;
                            const formatted =
                            input.charAt(0).toUpperCase() + input.slice(1);
                              setVRNote(formatted);
                          }}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled={confirmation}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {VRNote}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            </div>
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