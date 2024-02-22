import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import submitAnimation from '../assets/loading_nobg.gif';

export default function RequestFormInspection(){

  const { currentUser } = useUserStateContext();
  const [activeTab, setActiveTab] = useState("tab1");

  const today = new Date().toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format

  const [DateEndMin, setDateEndMin] = useState(today);
  

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  
  
  const [inputEquipErrors, setInputEquipErrors] = useState({});

  //Get data from the database on PPD Regular Employees on requesting vehicles
  const [users, setUsers] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [sumbitLoading, setSubmitLoading] = useState(false);
  const [isLoading , setLoading] = useState(true);

  // Use useEffect to fetch data when the component mounts
  const fetchUsers = () => {
    axiosClient.get('/ppausers')
    .then(response => {
      const usersData = response.data;
      setUsers(usersData); // Update state when data arrives
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const fetchDriver = () => {
    axiosClient.get('/getdriver')
    .then(response => {
      const driversData = response.data;
      setDriverList(driversData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchUsers();
    fetchDriver();
  },[]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //Equipment Request
  const [selectEquipmentOption, setSelectEquipmentOption] = useState('');

  const handleSelectEquipment = (event) => {
    setSelectEquipmentOption(event.target.value);
  }

  //For Firetruck
  const [RFDateRequest, setRFDateRequest] = useState('');
  const [RFPurpose, setRFPurpose] = useState('');
  const [RFDateActivity, setRFDateActivity] = useState('');
  const [RFTimeActivityStart, setRFTimeActivityStart] = useState('');
  const [RFTimeActivityEnd, setRFTimeActivityEnd] = useState('');

  //For Manlift
  const [MFDateRequest, setMFDateRequest] = useState('');
  const [MFPurpose, setMFPurpose] = useState('');
  const [MFDateActivity, setMFDateActivity] = useState('');
  const [MFTimeActivityStart, setMFTimeActivityStart] = useState('');
  const [MFTimeActivityEnd, setMFTimeActivityEnd] = useState('');

  //For Recue Boat
  const [RBDateRequest, setRBDateRequest] = useState('');
  const [RBPurpose, setRBPurpose] = useState('');
  const [RBDateActivity, setRBDateActivity] = useState('');
  const [RBTimeActivityStart, setRBTimeActivityStart] = useState('');
  const [RBTimeActivityEnd, setRBTimeActivityEnd] = useState('');

  const [getDivManager, setDivManager] = useState('');

  const SubmitFiretruckForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .post("equipmentformrequest", {
      type_of_equipment: selectEquipmentOption,
      date_request: RFDateRequest,
      title_of_activity: RFPurpose,
      date_of_activity: RFDateActivity,
      time_start:RFTimeActivityStart,
      time_end: RFTimeActivityEnd,
      division_manager_id: getDivManager,
      division_manager_approval: 0,
      admin_manager_approval: 0,
      harbor_master_approval: 0,
      port_manager_approval: 0
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Form Submitted Successfully.");    
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

  const SubmitManlilftForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .post("equipmentformrequest", {
      type_of_equipment: selectEquipmentOption,
      date_request: MFDateRequest,
      title_of_activity: MFPurpose,
      date_of_activity: MFDateActivity,
      time_start:MFTimeActivityStart,
      time_end: MFTimeActivityEnd,
      division_manager_id: getDivManager,
      division_manager_approval: 0,
      admin_manager_approval: 0,
      harbor_master_approval: 0,
      port_manager_approval: 0
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Form Submitted Successfully.");    
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

  const SubmitRescueBoatForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .post("equipmentformrequest", {
      type_of_equipment: selectEquipmentOption,
      date_request: RBDateRequest,
      title_of_activity: RBPurpose,
      date_of_activity: RBDateActivity,
      time_start:RBTimeActivityStart,
      time_end: RBTimeActivityEnd,
      division_manager_id: getDivManager,
      division_manager_approval: 0,
      admin_manager_approval: 0,
      harbor_master_approval: 0,
      port_manager_approval: 0
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Form Submitted Successfully.");    
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

  return(
    <PageComponent title="Request Form">

    {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src="ppa_logo_animationn_v4.gif"
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Form</span>
    </div>
    ):(
    <>

      {/* Tab 4 (Request for Equipment) */}
      {activeTab === "tab4" && 
      <div className="mt-6">

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

        {/* For Firetruck */}
        {selectEquipmentOption === 'Firetruck' && (
          <div className="mt-10">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Request For the use of Firetruck </h2>
            <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
          </div>

          <form onSubmit={SubmitFiretruckForm}>

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
                  value= {RFDateRequest}
                  onChange={ev => setRFDateRequest(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.date_request && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-4">
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
                {inputEquipErrors.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date of Activity */}
            <div className="flex items-center mt-6">
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
                {inputEquipErrors.date_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time of Activity */}
            <div className="flex items-center mt-6">
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
                {inputEquipErrors.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
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
                {inputEquipErrors.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Supervisor Name */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                    Division Manager Concerned :
                </label> 
              </div>
              <div className="w-64">
              <select 
                name="plate_number" 
                id="plate_number" 
                autoComplete="request-name"
                value={getDivManager}
                onChange={ev => setDivManager(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {users.map(user => (
                <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                ))}
              </select>
              {inputEquipErrors.division_manager_id && (
                <p className="text-red-500 text-xs italic">This is the important field</p>
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

          </form>

          </div>
        )}

        {/* For Manlift */}
        {selectEquipmentOption === 'Manlift' && (
          <div className="mt-10">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Request For the use of Manlift </h2>
            <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
          </div>

          <form onSubmit={SubmitManlilftForm}>

            {/* Date of Request */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="manlift_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="manlift_date"
                  id="manlift_date"
                  value= {MFDateRequest}
                  onChange={ev => setMFDateRequest(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.date_request && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-4">
              <div className="w-72">
                <label htmlFor="manlift_purpose" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Title/Purpose of Activity :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="manlift_purpose"
                  id="manlift_purpose"
                  autoComplete="manlift_purpose"
                  value={MFPurpose}
                  onChange={ev => setMFPurpose(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date of Activity */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="manlift_act_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date of Activity:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="manlift_act_date"
                  id="manlift_act_date"
                  value= {MFDateActivity}
                  onChange={ev => setMFDateActivity(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.date_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time of Activity */}
            <div className="flex items-center mt-6">
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
                  value= {MFTimeActivityStart}
                  onChange={ev => setMFTimeActivityStart(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
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
                  value= {MFTimeActivityEnd}
                  onChange={ev => setMFTimeActivityEnd(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Supervisor Name */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                    Division Manager Concerned :
                </label> 
              </div>
              <div className="w-64">
              <select 
                name="plate_number" 
                id="plate_number" 
                autoComplete="request-name"
                value={getDivManager}
                onChange={ev => setDivManager(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {users.map(user => (
                <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                ))}
              </select>
              {inputEquipErrors.division_manager_id && (
                <p className="text-red-500 text-xs italic">This is the important field</p>
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

          </form>

          </div>
        )}

        {/* For Rescue Boat */}
        {selectEquipmentOption === 'Rescue Boat' && (
          <div className="mt-10">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Request For the use of Rescue Boat </h2>
            <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
          </div>

          <form onSubmit={SubmitRescueBoatForm}>

            {/* Date of Request */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="rescue_boat_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="rescue_boat_date"
                  id="rescue_boat_date"
                  value= {RBDateRequest}
                  onChange={ev => setRBDateRequest(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.date_request && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-4">
              <div className="w-72">
                <label htmlFor="rescue_boat_purpose" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Title/Purpose of Activity :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="rescue_boat_purpose"
                  id="rescue_boat_purpose"
                  autoComplete="rescue_boat_purpose"
                  value={RBPurpose}
                  onChange={ev => setRBPurpose(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date of Activity */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="rescue_boat_act_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date of Activity:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="rescue_boat_act_date"
                  id="rescue_boat_act_date"
                  value= {RBDateActivity}
                  onChange={ev => setRBDateActivity(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.date_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time of Activity */}
            <div className="flex items-center mt-6">
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
                  value= {RBTimeActivityStart}
                  onChange={ev => setRBTimeActivityStart(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
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
                  value= {RBTimeActivityEnd}
                  onChange={ev => setRBTimeActivityEnd(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputEquipErrors.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Supervisor Name */}
            <div className="flex items-center mt-6">
              <div className="w-72">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                    Division Manager Concerned :
                </label> 
              </div>
              <div className="w-64">
              <select 
                name="plate_number" 
                id="plate_number" 
                autoComplete="request-name"
                value={getDivManager}
                onChange={ev => setDivManager(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {users.map(user => (
                <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                ))}
              </select>
              {inputEquipErrors.division_manager_id && (
                <p className="text-red-500 text-xs italic">This is the important field</p>
              )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              {/* <p className="text-xs mb-4"><span className="text-red-500">*</span> Indicates required field</p> */}
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

          </form>

          </div>
        )}

        {/* Show Popup */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div className="fixed inset-0 bg-black opacity-40"></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down">
          <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round"/></svg>
            <p className="text-lg">{popupMessage}</p>
            <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                window.location.href = `/my_request/${currentUser.id}`;
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
          </div>
        </div>
        )}

      </div>
      }

      {activeTab === "tab5" && <div>Coming Soon</div>}
    </>  
    )}

    
    </PageComponent>
  );
};