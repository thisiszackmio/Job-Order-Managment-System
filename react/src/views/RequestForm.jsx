import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import submitAnimation from '../assets/loading_nobg.gif';

export default function RequestForm(){

  const { currentUser } = useUserStateContext();
  const [activeTab, setActiveTab] = useState("tab1");

  const today = new Date().toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format

  const [DateEndMin, setDateEndMin] = useState(today);
  const [DateArrival, setDateArrival] = useState(today);

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [inputErrors, setInputErrors] = useState({});
  const [inputFacErrors, setInputFacErrors] = useState({});
  const [inputVechErrors, setInputVechErrors] = useState({});

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

  //For Inspection Form
  const [inspectionDate, setInspectionDate] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [BrandModel, setBrandModel] = useState('');
  const [SerialEngineNo, setSerialEngineNo] = useState('');
  const [typeOfProperty, setTypeOfProperty] = useState('');
  const [propertySpecify, setPropertySpecify] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [ComplainDefect, setComplainDefect] = useState('');
  const [supervisorApproval, setSupervisorApproval] = useState('');

  const handleSupervisorName= (event) => {
    const selectedValue = event.target.value;
    setSupervisorApproval(selectedValue);
  
    const selectedIndex = event.target.selectedIndex;
    const selectedLabel = event.target.options[selectedIndex].text;
    setSelectedOptionValue(selectedLabel);
  };

  // Submit the Inspection Form
  const SubmitInspectionForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
      .post("/inspectionformrequest",{
        // For Inspect Submission
        date_of_request: inspectionDate,
        property_number: propertyNo,
        acq_date: acquisitionDate,
        acq_cost: acquisitionCost,
        brand_model: BrandModel,
        serial_engine_no: SerialEngineNo,
        type_of_property: typeOfProperty,
        property_other_specific: propertySpecify,
        property_description: propertyDescription,
        location: propertyLocation,
        complain: ComplainDefect,
        supervisor_name: supervisorApproval,
        supervisor_approval: 0,
        admin_approval: 0,
        inspector_status: 0
      })
      .then((response) => { 
        setShowPopup(true);
        setPopupMessage("Form Submitted Successfully");    
        setSubmitLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          // If there are validation errors in the response, extract and store them.
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }
        console.error(error);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //For Request on Facility and Venue
  //Checkbox
  const [mphCheck, setMphCheck] = useState(0);
  const [confCheck, setConfCheck] = useState(0);
  const [dormCheck, setDormCheck] = useState(0);
  const [otherCheck, setOtherCheck] = useState(0);
  const [checkValidation, setCheckValidation] = useState(null);

  const handleCheckboxChange = (setStateFunction, isChecked) => {
    setStateFunction(isChecked ? 2 : 0);
  };

  //Main Form
  const [FVDate, setFVDate] = useState('');
  const [reqOffice, setRegOffice] = useState('');
  const [titleReq, setTitleReq] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [DateStart, setDateStart] = useState('');
  const [DateEnd, setDateEnd] = useState('');

  const SubmitFacilityForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    if(mphCheck === 2 || confCheck === 2 || dormCheck === 2|| otherCheck === 2){
      axiosClient
        .post("facilityformrequest", {
        date_requested: FVDate,
        request_office: reqOffice,
        title_of_activity: titleReq,
        date_start: DateStart,
        time_start: timeStart,
        date_end: DateEnd,
        time_end: timeEnd,
        mph: mphCheck,
        conference: confCheck,
        dorm: dormCheck,
        other: otherCheck,
        admin_approval: 3, // 3 For Pending (Continue Fillup the Form) // 2 For Waiting for Approval // 1 For Approve
        remarks: 'Pending'
      })
      .then((response) => { 
        setShowPopup(true);
        setPopupMessage("<p>Form Submitted Successfully.</p><p>You can continue to fill up the form on the My Request page</p>");    
        setSubmitLoading(false);
        setCheckValidation(null);
      })
      .catch((error) => {
        console.error(error);
        const responseErrors = error.response.data.errors;
        setInputFacErrors(responseErrors);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
      
    } else {
      setCheckValidation('Please select at least one Facility/Vwenue.');
      setSubmitLoading(false);
    }
  }

  //Vehicle Request
  const [VRDate, setVRDate] = useState('');
  const [VRPurpose, setVRPurpose] = useState('');
  const [VRPlace, setVRPlace] = useState('');
  const [VRDateArrival, setVRDateArrival] = useState('');
  const [VRTimeArrival, setVRTimeArrival] = useState('');
  const [VRPassenger, setVRPassenger] = useState('');
  const [VRVehicle, setVRVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const handleDriverName = (event) => {
    setSelectedDriver(event.target.value);
  };

  const handleVRVehicleChange = (event) => {
    setVRVehicle(event.target.value);
  };

  const SubmitVehicleForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
      .post("vehicleformrequest", {
      date_of_request: VRDate,
      purpose: VRPurpose,
      passengers: VRPassenger,
      place_visited: VRPlace,
      date_arrival: VRDateArrival,
      time_arrival: VRTimeArrival,
      vehicle_type: VRVehicle,
      driver: selectedDriver,
      admin_approval: 3,
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Form Submitted Successfully.");    
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
    <div className="flex">
        {/* Tab 1 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab1"
              ? "bg-gray-200 border-b-4 border-gray-800"
              : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Request for Repair/Inspection
        </button>
        {/* Tab 2 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab2"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Request for Facility/Venue
        </button>
        {/* Tab 3 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab3"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab3")}
        >
          Request for Vehicle
        </button>
        {/* Tab 4 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab4"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab4")}
        >
          Request for Equipment
        </button>
        {/* Tab 5 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab5"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab5")}
        >
          Other Request
        </button>
    </div>

    <div className="mt-4">

      {/* Tab 1 (Request For Repair Inspection) */}
      {activeTab === "tab1" && 
      <div className="mt-6">
        <form onSubmit={SubmitInspectionForm}>
          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
            <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
          </div>
        
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-1">

            {/* Date */}
            <div className="flex items-center mt-6">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="insp_date"
                  id="insp_date"
                  value= {inspectionDate}
                  onChange={ev => setInspectionDate(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.date_of_request && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Property Number */}
            <div className="flex items-center mt-4">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Property No. :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="property_no"
                  id="property_no"
                  autoComplete="property_no"
                  value={propertyNo}
                  onChange={ev => setPropertyNo(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.property_number && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Acquisition Date */}
            <div className="flex items-center mt-4">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Acquisition Date :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="acquisition_date"
                  id="acquisition_date"
                  value={acquisitionDate}
                  onChange={ev => setAcquisitionDate(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.acq_date && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Acquisition Cost */}
            <div className="flex items-center mt-4">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Acquisition Cost :
                </label> 
              </div>
              <div className="w-64">
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
                  ₱
                </span>
                <input
                  type="text"
                  name="acquisition_cost"
                  id="acquisition_cost"
                  autoComplete="acquisition_cost"
                  value={acquisitionCost}
                  onChange={ev => setAcquisitionCost(ev.target.value)}
                  className="pl-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
              {inputErrors.acq_cost && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
              </div>
            </div>

            {/* Brand/Model */}
            <div className="flex items-center mt-4">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Brand/Model :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="brand_model"
                  id="brand_model"
                  autoComplete="brand_model"
                  value={BrandModel}
                  onChange={ev => setBrandModel(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.brand_model && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Serial/Engine No */}
            <div className="flex items-center mt-4">
              <div className="w-36">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Serial/Engine No. :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="serial_engine_no"
                  id="serial_engine_no"
                  autoComplete="serial_engine_no"
                  value={SerialEngineNo}
                  onChange={ev => setSerialEngineNo(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.serial_engine_no && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            </div>

            <div className="col-span-1">

            {/* Type of Property */}
            <div className="flex items-center mt-6">
              <div className="w-60">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Type of Property :
                </label> 
              </div>
              <div className="w-64">
                <select 
                name="type_of_property" 
                id="type_of_property" 
                autoComplete="type_of_property"
                value={typeOfProperty}
                onChange={ev => {
                  setTypeOfProperty(ev.target.value);
                  if (ev.target.value !== 'Others') {
                    setPropertySpecify('');
                  }
                }}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                  <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                  <option value="Others">Others</option>
                </select>
                {inputErrors.type_of_property && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
                {typeOfProperty === 'Others' && (
                <div className="flex mt-4">
                  <div className="w-36">
                    <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">Specify:</label> 
                  </div>
                  <div className="w-64">
                    <input
                      type="text"
                      name="specify"
                      id="specify"
                      value={propertySpecify}
                      onChange={ev => setPropertySpecify(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center mt-4">
              <div className="w-60">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Description :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={propertyDescription}
                  onChange={ev => setPropertyDescription(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.property_description && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center mt-4">
              <div className="w-60">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Location (Div/Section/Unit) :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={propertyLocation}
                  onChange={ev => setPropertyLocation(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.location && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Complain / Defect */}
            <div className="flex items-center mt-4">
              <div className="w-60">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Complain/Defect :
                </label> 
              </div>
              <div className="w-64">
              <textarea
                id="complain"
                name="complain"
                rows={2}
                value={ComplainDefect}
                onChange={ev => setComplainDefect(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {inputErrors.complain && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
              </div>
            </div>

            {/* Supervisor Name */}
            <div className="flex items-center mt-4">
              <div className="w-60">
                <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Immediate Supervisor :
                </label> 
              </div>
              <div className="w-64">
              <select 
                name="plate_number" 
                id="plate_number" 
                autoComplete="request-name"
                value={supervisorApproval}
                onChange={handleSupervisorName}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {users.map(user => (
                <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                ))}
              </select>
              {inputErrors.supervisor_name && (
                <p className="text-red-500 text-xs italic">This is the important field</p>
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
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
              sumbitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
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

      {/* Tab  2 (Request For Facility and Venue) */}
      {activeTab === "tab2" && 
      <div className="mt-6">
        <form onSubmit={SubmitFacilityForm}>

        <div>
          <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-1">

            {/* Date of Activity */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="form_date" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="form_date"
                  id="form_date"
                  value= {FVDate}
                  onChange={ev => setFVDate(ev.target.value)}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.date_requested && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Request Office/Division */}
            <div className="flex items-center mt-4">
              <div className="w-56">
                <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Requesting Office/Division :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="rf_request"
                  id="rf_request"
                  autoComplete="rf_request"
                  value={reqOffice}
                  onChange={ev => setRegOffice(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.request_office && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-4">
              <div className="w-56">
                <label htmlFor="purpose" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Title/Purpose of Activity :
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="text"
                  name="purpose"
                  id="purpose"
                  autoComplete="purpose"
                  value={titleReq}
                  onChange={ev => setTitleReq(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date Time of Activity (Start) */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="act_date" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Date of Activity (Start):
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="date_start"
                  id="date_start"
                  value= {DateStart}
                  onChange={ev => {
                    setDateStart(ev.target.value);
                    setDateEndMin(ev.target.value);
                  }}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.date_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="act_date" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Time of Activity (Start):
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="time_start"
                  id="time_start"
                  value= {timeStart}
                  onChange={ev => setTimeStart(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date Time of Activity (End) */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="time_date" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Date of Activity (End)
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="date_end"
                  id="date_end"
                  value= {DateEnd}
                  onChange={ev => setDateEnd(ev.target.value)}
                  min={DateEndMin}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.date_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="time_date" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Time of Activity (End)
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="time_end"
                  id="time_end"
                  value= {timeEnd}
                  onChange={ev => setTimeEnd(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

          </div>

          <div className="col-span-1">

            <div className="mt-4">
              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                Facilities / Venue being Requested :
              </label> 
            </div>

            <div class="space-y-4 mt-6">

              {/* For MPH */}
              <div class="relative flex items-center">
                <div class="flex items-center h-5">
                  <input
                    id="mph-checkbox"
                    type="checkbox"
                    checked={mphCheck === 2}
                    onChange={(ev) => handleCheckboxChange(setMphCheck, ev.target.checked)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                    Multi-Purpose Hall (MPH)
                  </label> 
                </div>
              </div>

              {/* Conference Hall */}
              <div class="relative flex items-center">
                <div class="flex items-center h-5">
                  <input
                    id="conference-checkbox"
                    type="checkbox"
                    checked={confCheck === 2}
                    onChange={(ev) => handleCheckboxChange(setConfCheck, ev.target.checked)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                    Conference Hall
                  </label> 
                </div>
              </div>

              {/* Dormitory */}
              <div class="relative flex items-center">
                <div class="flex items-center h-5">
                  <input
                    id="dormitory-checkbox"
                    type="checkbox"
                    checked={dormCheck === 2}
                    onChange={(ev) => handleCheckboxChange(setDormCheck, ev.target.checked)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                    Dormitory
                  </label> 
                </div>
              </div>

              {/* Other */}
              <div class="relative flex items-center">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={otherCheck === 2}
                    onChange={(ev) => handleCheckboxChange(setOtherCheck, ev.target.checked)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                    Other
                  </label> 
                </div>
              </div>

            </div>
            {checkValidation && (
              <p className="text-red-500 text-xs italic">{checkValidation}</p>
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

        {/* Show Popup */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div
            className="fixed inset-0 bg-black opacity-40" // Close on overlay click
          ></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down">
          <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round"/></svg>
            <p className="text-lg text-center" dangerouslySetInnerHTML={{ __html: popupMessage }}></p>
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
      
      {/* Tab 3 (Request For Vehicle) */}
      {activeTab === "tab3" && 
      <div className="mt-6">
        <form onSubmit={SubmitVehicleForm}>
        
        <div>
          <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          
          <div className="col-span-1">

            {/* Date of Request */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="vr_date" className="block text-base font-medium leading-6 text-gray-900">
                <span className="text-red-500">*</span>
                  Date:
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="vr_date"
                  id="vr_date"
                  value= {VRDate}
                  onChange={ev => {
                    setDateArrival(ev.target.value);
                    setVRDate(ev.target.value);
                  }}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputVechErrors.date_of_request && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center mt-3">
              <div className="w-56">
                <label htmlFor="vr_purpose" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Purpose:
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
                {inputVechErrors.purpose && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Place */}
            <div className="flex items-center mt-3">
              <div className="w-56">
                <label htmlFor="vr_place" className="block text-base font-medium leading-6 text-gray-900">
                <span className="text-red-500">*</span>
                  Place/s To Be Visited:
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
                {inputVechErrors.place_visited && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date Time of Arrival) */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="vr_datearrival" className="block text-base font-medium leading-6 text-gray-900">
                  <span className="text-red-500">*</span>
                  Date of Arrival:
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
                {inputVechErrors.date_arrival && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="vr_timearrival" className="block text-base font-medium leading-6 text-gray-900">
                  {/* <span className="text-red-500">*</span> */}
                  Time of Arrival:
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
                {inputVechErrors.time_arrival && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

          </div>

          <div className="col-span-1">

          {/* Passengers */}
          <div className="flex mt-6">
            <div className="w-56">
              <label htmlFor="vr_passengers" className="block text-base font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
                Passengers:
              </label>
            </div>
            <div className="w-96">
              <textarea
                id="vr_passengers"
                name="vr_passengers"
                rows={5}
                value={VRPassenger}
                onChange={ev => setVRPassenger(ev.target.value)}
                style={{ resize: 'none' }}
                className="block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-gray-500 text-xs mt-2">Separate name on next line</p>
              {inputVechErrors.passengers && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>

          </div>

          {/* Type of Vehicle */}
          <div className="flex items-center mt-4">
            <div className="w-56">
              <label htmlFor="vr_vehicle" className="block text-base font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
                Type of Vehicle:
              </label> 
            </div>
            
            <div className="w-64">
              <select 
                name="vr_vehicle" 
                id="vr_vehicle" 
                autoComplete="vr_vehicle"
                value={VRVehicle}
                onChange={handleVRVehicleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a vehicle</option>
                <option value="" disabled class="font-bold text-black"><b>Admin Vehicle</b></option>
                <option value="Mitsubishi Adventure = SLF 432">Mitsubishi Adventure - SLF 432</option>
                <option value="Toyota Hi-Ace = SAB 4362">Toyota Hi-Ace - SAB 4362</option>
                <option value="Isuzu Van = SFT 545">Isuzu Van - SFT 545</option>
                <option value="Toyota Hi-Lux = SFM 708">Toyota Hi-Lux - SFM 708</option>
                <option value="Hyundai Sta Fe = Temp 101709">Hyundai Sta Fe - Temp 101709</option>
                <option value="Toyota Hi-Lux/Fx CS = Temp SOF 880">Toyota Hi-Lux/Fx CS - Temp SOF 880</option>
                <option value="" disabled class="font-bold text-black"><b>OPM Vehicle</b></option>
                <option value="Toyota Hi-Lux = NBG 9724">Toyota Hi-Lux - NBG 9724</option>
                <option value="Toyota Fortuner = D2S 454">Toyota Fortuner - D2S 454</option>
                <option value="" disabled class="font-bold text-black"><b>Port Police Vehicle</b></option>
                <option value="Mitsubishi Adventure = SLG 388">Mitsubishi Adventure - SLG 388</option>
                <option value="Mitsubishi Adventure = SHL 594">Mitsubishi Adventure - SHL 594</option>
                <option value="Toyota Hi-Lux Patrol = SAB 4394">Toyota Hi-Lux Patrol - SAB 4394</option>
                <option value="Toyota Hi-Lux Patrol = S6 H167">Toyota Hi-Lux Patrol - S6 H167</option>
                <option value="" disabled class="font-bold text-black"><b>TMO Tubod Vehicle</b></option>
                <option value="Toyota Innova = SHX 195">Toyota Innova - SHX 195</option>
              </select> 
              {inputVechErrors.vehicle_type && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Driver */}
          <div className="flex items-center mt-4">
            <div className="w-56">
              <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
              <span className="text-red-500">*</span>
                Driver:
              </label> 
            </div>
            <div className="w-64">
              <select
                name="plate_number"
                id="plate_number"
                autoComplete="request-name"
                value={selectedDriver}
                onChange={handleDriverName}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a Driver</option>
                {driverList.map(driver => (
                  <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                ))}
              </select>
              {inputVechErrors.driver && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
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

        </form>

        {/* Show Popup */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div
            className="fixed inset-0 bg-black opacity-40" // Close on overlay click
          ></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down">
          <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round"/></svg>
            <p className="text-lg text-center" dangerouslySetInnerHTML={{ __html: popupMessage }}></p>
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

      {activeTab === "tab4" && <div>Coming Soon</div>}
      {activeTab === "tab5" && <div>Coming Soon</div>}
    </div>
    </>  
    )}

      

    </PageComponent>
  );
};