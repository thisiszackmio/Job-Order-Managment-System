import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function VehicleSlipForm(){

  const {id} = useParams();
  const { currentUser } = useUserStateContext();

  const navigate = useNavigate ();

  useEffect(() => {
    // Check the condition and redirect if necessary
    if (id !== currentUser.id) {
      navigate(`/vehiclesliprequestform/${currentUser.id}`);
    }
  }, [id, currentUser.id, navigate]);

  const [isLoading , setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [DateArrival, setDateArrival] = useState(today);
  const [sumbitLoading, setSubmitLoading] = useState(false);

  const [inputVechErrors, setInputVechErrors] = useState({});

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //Vehicle Request
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');

  let output;

  if(VRPassenger == 'none') {
    output = 'None';
  }else{
    output = VRPassenger
  }

  // Submit Form
  const SubmitVehicleForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
      .post("vehicleformrequest", {
      date_of_request: today,
      purpose: VRPurpose,
      passengers: output,
      place_visited: VRPlace,
      date_arrival: VRDateArrival,
      time_arrival: VRTimeArrival,
      vehicle_type: 'None',
      driver: 'None',
      admin_approval: 5,
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title"><strong>Success</strong></p>
          <p>Form submit successfully</p>
        </div>
      );    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      const responseErrors = error.response.data.errors;
      setInputVechErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  return (
  <PageComponent title="Request on Vehicle Slip Form">
  {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Form</span>
    </div>
  ):(
  <div>
    <form onSubmit={SubmitVehicleForm}>

      {/* Title */}
      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
        <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date of Request */}
          <div className="flex items-center mt-6">
            <div className="w-56">
              <label htmlFor="vr_date" className="block text-base font-medium leading-6 text-gray-900">
                Date:
              </label> 
            </div>
            <div className="w-64">
              <input
                type="date"
                name="vr_date"
                id="vr_date"
                value= {today}
                onChange={ev => {
                  setDateArrival(ev.target.value);
                  setVRDate(ev.target.value);
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                readOnly
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-center mt-2">
            <div className="w-56">
              <label htmlFor="vr_purpose" className="block text-base font-medium leading-6 text-gray-900">
                Purpose:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="vr_purpose"
                id="vr_purpose"
                autoComplete="vr_purpose"
                value={VRPurpose}
                onChange={ev => setVRPurpose(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!VRPurpose && inputVechErrors.purpose && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Place */}
          <div className="flex items-center mt-2">
            <div className="w-56">
              <label htmlFor="vr_place" className="block text-base font-medium leading-6 text-gray-900">
                Place/s To Be Visited:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="vr_place"
                id="vr_place"
                autoComplete="vr_place"
                value={VRPlace}
                onChange={ev => setVRPlace(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!VRPlace && inputVechErrors.place_visited && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Date of Arrival */}
          <div className="flex items-center mt-2">
            <div className="w-56">
              <label htmlFor="vr_datearrival" className="block text-base font-medium leading-6 text-gray-900">
                Date of Arrival:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="date"
                name="vr_datearrival"
                id="vr_datearrival"
                value= {VRDateArrival}
                onChange={ev => setVRDateArrival(ev.target.value)}
                min={DateArrival}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!VRDateArrival && inputVechErrors.date_arrival && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Time of Arrival */}
          <div className="flex items-center mt-2">
            <div className="w-56">
              <label htmlFor="vr_timearrival" className="block text-base font-medium leading-6 text-gray-900">
                Time of Arrival:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="time"
                name="vr_timearrival"
                id="vr_timearrival"
                value= {VRTimeArrival}
                onChange={ev => setVRTimeArrival(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!VRTimeArrival && inputVechErrors.time_arrival && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Passengers */}
          <div className="flex mt-6">
            <div className="w-44">
              <label htmlFor="vr_passengers" className="block text-base font-medium leading-6 text-gray-900">
                Passengers:<span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-full">
              <textarea
                id="vr_passengers"
                name="vr_passengers"
                rows={7}
                value={VRPassenger}
                onChange={ev => setVRPassenger(ev.target.value)}
                style={{ resize: 'none' }}
                className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-gray-500 text-xs mt-2">Separate name on next line (if no passenger, please type "None")</p>
              {!VRPassenger && inputVechErrors.passengers && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <p className="text-xs mb-4"><span className="text-red-500">*</span> Indicates required field</p>
        <button
          type="submit"
          className={`rounded-md px-3 py-2 text-base text-white shadow-sm focus:outline-none ${
            sumbitLoading ? 'bg-indigo-400 cursor-not-allowed arrange' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          disabled={sumbitLoading}
        >
          {sumbitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </div>

    </form>

    {/* Show Popup */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50">

        {/* Semi-transparent black overlay */}
        <div className="fixed inset-0 bg-black opacity-40"></div>

        {/* Popup content with background blur */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '400px' }}>

          {/* Notification Icons */}
          <div class="f-modal-alert">
            <div class="f-modal-icon f-modal-success animate">
              <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
              <span class="f-modal-line f-modal-long animateSuccessLong"></span>
            </div>
          </div>

          {/* Message */}
          <p className="text-lg text-center">{popupMessage}</p>

          {/* Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                window.location.href = `/myrequestvehicleslipform/${currentUser.id}`;
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    )}

  </div>
  )}
  </PageComponent>
  );

}