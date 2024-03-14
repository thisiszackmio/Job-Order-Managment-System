import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function EquipmentForm(){

  const {id} = useParams();
  const { currentUser } = useUserStateContext();

  const navigate = useNavigate ();

  const today = new Date().toISOString().split('T')[0];

  const [users, setUsers] = useState([]);
  const [inputEquipErrors, setInputEquipErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [sumbitLoading, setSubmitLoading] = useState(false);
  const [notifications, setNototifications] = useState('');

  const fetchUsers = () => {
    axiosClient
    .get(`/getsupervisor/${id}`)
    .then((response) => {
      const responseData = response.data;
      const supDet = responseData.personnel_details;
      setUsers(supDet);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
  };

  useEffect(()=>{
    fetchUsers();
  },[]);

  //Restrictions
  useEffect(() => {
    // Check the condition and redirect if necessary
    if (id !== currentUser.id) {
      navigate(`/equipmentrequestform/${currentUser.id}`);
    }
  }, [id, currentUser.id, navigate]);

  const closeError = () => {
    setShowPopup(false);
  };

  const [selectEquipmentOption, setSelectEquipmentOption] = useState('');

  const handleSelectEquipment = (event) => {
    setSelectEquipmentOption(event.target.value);
  }

  //For Firetruck
  const [RFPurpose, setRFPurpose] = useState('');
  const [RFDateActivity, setRFDateActivity] = useState('');
  const [RFTimeActivityStart, setRFTimeActivityStart] = useState('');
  const [RFTimeActivityEnd, setRFTimeActivityEnd] = useState('');

  // For Firetruck
  const SubmitEquipmentForm = (event) => {
    event.preventDefault();

    if(RFTimeActivityStart > RFTimeActivityEnd){
      setShowPopup(true);
        setPopupMessage(
          <div>
            <p className="popup-title">Warning</p>
            <p>Date Time Invalid!</p>
          </div>
        );
        setNototifications('warning'); 
        setSubmitLoading(false);
    }else{
      setSubmitLoading(true);

      axiosClient
      .post("equipmentformrequest", {
        type_of_equipment: selectEquipmentOption,
        date_request: today,
        title_of_activity: RFPurpose,
        date_of_activity: RFDateActivity,
        time_start: RFTimeActivityStart,
        time_end: RFTimeActivityEnd,
        division_manager_id: 
        currentUser.code_clearance === 1 ? currentUser.id.toString() :
        currentUser.code_clearance === 2 ? currentUser.id.toString() : users.id.toString(),
        division_manager_approval: 0,
        admin_manager_approval: 0,
        harbor_master_approval: 0,
        port_manager_approval: 0
      })
      .then(() => { 
        setShowPopup(true);
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>Form submit successfully</p>
          </div>
        );   
        setNototifications('success'); 
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.error(error);
        const responseErrors = error.response.data.errors;
        setInputEquipErrors(responseErrors);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }

  };

  return (
  <PageComponent title="Request on Equipment Form">
  <div>

    {/* Type of Vehicle */}
    <div className="flex items-center mt-4">
      <div className="w-56">
        <label htmlFor="get_equipment" className="block text-base font-medium leading-6 text-gray-900">
          Type of Equipment:
        </label> 
      </div>
      
      <div className="w-64">
        <select 
          name="get_equipment" 
          id="get_equipment" 
          autoComplete="get_equipment"
          value={selectEquipmentOption}
          onChange={handleSelectEquipment}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="">Select Here</option>
          <option value="Firetruck">Firetruck</option>
          <option value="Manlift">Manlift</option>
          <option value="Rescue Boat">Rescue Boat</option>
        </select> 
      </div>
    </div>

    <form onSubmit={SubmitEquipmentForm}>

      {selectEquipmentOption && (
        <div className="mt-10">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Request For the use of Firetruck </h2>
            <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
          </div>

            {/* Date of Request */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="firetruck_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="firetruck_date"
                  id="firetruck_date"
                  defaultValue= {today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  readOnly
                />
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-2">
              <div className="w-72">
                <label htmlFor="firetruck_purpose" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Title/Purpose of Activity :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="firetruck_purpose"
                  id="firetruck_purpose"
                  autoComplete="firetruck_purpose"
                  value={RFPurpose}
                  onChange={ev => setRFPurpose(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {!RFPurpose && inputEquipErrors.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date of Activity */}
            <div className="flex items-center mt-2">
              <div className="w-72">
                <label htmlFor="firetruck_act_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date of Activity:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="firetruck_act_date"
                  id="firetruck_act_date"
                  value= {RFDateActivity}
                  onChange={ev => setRFDateActivity(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {!RFDateActivity && inputEquipErrors.date_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time of Activity */}
            <div className="flex items-center mt-2">
              <div className="w-72">
                <label htmlFor="firetruck_act_time" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Time of Activity (START):
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="firetruck_act_time"
                  id="firetruck_act_time"
                  value= {RFTimeActivityStart}
                  onChange={ev => setRFTimeActivityStart(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {!RFTimeActivityStart && inputEquipErrors.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-2">
              <div className="w-72">
                <label htmlFor="firetruck_act_time" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Time of Activity (END):
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="firetruck_act_time"
                  id="firetruck_act_time"
                  value= {RFTimeActivityEnd}
                  onChange={ev => setRFTimeActivityEnd(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {!RFTimeActivityEnd && inputEquipErrors.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
                <p className="text-xs mb-4"><span className="text-red-500">*</span> Indicates required field</p>
              <button
                type="submit"
                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                  sumbitLoading ? 'bg-gray-400 cursor-not-allowed arrange' : 'bg-indigo-600 hover:bg-indigo-500'
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

        </div>  
      )}

    </form>

    {/* Show Popup */}
    {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div className="fixed inset-0 bg-black opacity-40"></div>

        {/* Popup content with background blur */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>
      
        {/* Notification Icons */}
        <div class="f-modal-alert">

        {/* Success */}
        {notifications == 'success' && (
          <div class="f-modal-icon f-modal-success animate">
            <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
            <span class="f-modal-line f-modal-long animateSuccessLong"></span>
          </div>
        )}

        {/* Warning */} 
        {notifications == 'warning' && (
          <div class="f-modal-icon f-modal-warning scaleWarning">
            <span class="f-modal-body pulseWarningIns"></span>
            <span class="f-modal-dot pulseWarningIns"></span>
          </div>
        )}

        </div>

        {/* Message */}
        <p className="text-lg text-center">{popupMessage}</p>

        {/* Button */}
        <div className="flex justify-center mt-4">

          {/* Success */}
          {notifications == 'success' && (
            <button
              onClick={() => {
                window.location.href = `/myequipmentform/${currentUser.id}`;
              }}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded"
            >
              View my request
            </button>
          )}

          {/* Warning */}
          {notifications == 'warning' && (
            <button
              onClick={() => (closeError())}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-blue-500"
            >
              Close
            </button>
          )}
          
        </div>

      </div>
    </div>
    )}

  </div>
  </PageComponent>
  );

}