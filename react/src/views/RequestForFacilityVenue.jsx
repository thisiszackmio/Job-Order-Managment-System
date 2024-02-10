import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import submitAnimation from '../assets/loading_nobg.gif';
import { useNavigate, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';

export default function RequestFormFacility(){

  const {id} = useParams();
  const { currentUser } = useUserStateContext();
  const [isLoading , setLoading] = useState(false);
  const [sumbitLoading, setSubmitLoading] = useState(false);

  const [inputFacErrors, setInputFacErrors] = useState({});
  const [notifications, setNototifications] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const navigate = useNavigate ();

  useEffect(() => {
    // Check the condition and redirect if necessary
    if (id !== currentUser.id) {
      navigate(`/facilityrequestform/${currentUser.id}`);
    }
  }, [id, currentUser.id, navigate]);

  const [DateEndMin, setDateEndMin] = useState(today);

  //Main Form
  const [reqOffice, setRegOffice] = useState('');
  const [titleReq, setTitleReq] = useState('');
  const [DateStart, setDateStart] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [DateEnd, setDateEnd] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const [mphCheck, setMphCheck] = useState(false);
  const [confCheck, setConfCheck] = useState(false);
  const [dormCheck, setDormCheck] = useState(false);
  const [otherCheck, setOtherCheck] = useState(false);

  const handleCheckboxChange = (setStateFunction, isChecked, ...otherStateFunctions) => {
    setStateFunction(isChecked);

    if (isChecked) {
      // Uncheck other checkboxes if "Other" is checked
      otherStateFunctions.forEach((otherStateFunction) => {
        if (otherStateFunction !== null) {
          otherStateFunction(0);
        }
      });
    } else {
      // Enable MPH and Conference Hall if "Other" is unchecked
      setMphCheck(0);
      setConfCheck(0);
    }

  };

  const getStartDateTimestamp = () => {
    // Check if DateStart and timeStart are not empty
    if (DateStart && timeStart) {
      // Combine DateStart and timeStart into a single string
      const combinedDateTimeString = `${DateStart}T${timeStart}`;
      
      // Create a Date object from the combined string
      const combinedDateTime = new Date(combinedDateTimeString);
      
      // Get the timestamp
      const timestamp = combinedDateTime.getTime();

      return timestamp;
    }

    // Return null if DateStart or timeStart is empty
    return null;
  }

  const getEndDateTimestamp = () => {
    // Check if DateEnd and timeEnd are not empty
    if (DateEnd && timeEnd) {
      // Combine DateEnd and timeEnd into a single string
      const combinedDateTimeString = `${DateEnd}T${timeEnd}`;
      
      // Create a Date object from the combined string
      const combinedDateTime = new Date(combinedDateTimeString);
      
      // Get the timestamp
      const timestamp = combinedDateTime.getTime();
  
      return timestamp;
    }
  
    // Return null if DateEnd or timeEnd is empty
    return null;
  };
  
  const timestampstart = getStartDateTimestamp();
  const timestampend = getEndDateTimestamp();

  //Facility Room
  const [checkTable, setCheckTable] = useState(false);
  const [checkChairs, setCheckChairs] = useState(false);
  const [checkProjector, setCheckProjector] = useState(false);
  const [checkProjectorScreen, setCheckProjectorScreen] = useState(false);
  const [checkDocumentCamera, setCheckDocumentCamera] = useState(false);
  const [checkLaptop, setCheckLaptop] = useState(false);
  const [checkTelevision, setCheckTelevision] = useState(false);
  const [checkSoundSystem, setCheckSoundSystem] = useState(false);
  const [checkVideoke, setCheckVideoke] = useState(false);
  const [checkMicrphone, setCheckMicrphone] = useState(false);
  const [checkOther, setCheckOther] = useState(false);
  const [NoOfTable, setNoOfTable] = useState('');
  const [NoOfChairs, setNoOfChairs] = useState('');
  const [NoOfMicrophone, setNoOfMicrophone] = useState('');
  const [OtherField, setOtherField] = useState('');

 //Count checked table
 const [checkedCount, setCheckedCount] = useState(0);

 useEffect(()=>{
   const totalChecked = [
     checkTable, 
     checkChairs,
     checkProjector,
     checkProjectorScreen,
     checkDocumentCamera,
     checkLaptop,
     checkTelevision,
     checkSoundSystem,
     checkVideoke,
     checkMicrphone,
     checkOther
   ].filter(Boolean).length;
   setCheckedCount(totalChecked);
 },[checkTable, 
   checkChairs,
   checkProjector,
   checkProjectorScreen,
   checkDocumentCamera,
   checkLaptop,
   checkTelevision,
   checkSoundSystem,
   checkVideoke,
   checkMicrphone,
   checkOther]);

  const handleInputTableChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfTable(inputValue);
  };

  const handleInputChairChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfChairs(inputValue);
  };

  const handleInputMicrophoneChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfMicrophone(inputValue);
  };

  //For Dorm
  const [malelineCount, setMaleLineCount] = useState(0);
  const [femalelineCount, setFemaleLineCount] = useState(0);

  const [maleList, setMaleList] = useState('');
  const [getMaleList, setGetMaleList] = useState('');
  const [femaleList, setFemaleList] = useState('');
  const [getFemaleList, setGetFemaleList] = useState('');

  const [DormOtherField, setDormOtherField]= useState('');

  //OPR Instruction (For Admin Manager Only)
  const [OprInstruct, setOprInstruct] = useState('');

  const oprInstrucValue = currentUser.code_clearance === 1
    ? OprInstruct === null || OprInstruct.trim() === "" 
      ? "None" 
      : OprInstruct
    : "";

  //Count Male Guest
  const generateNumberedText = (lines) => {
    return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  };

  const countMaleList = (text) => {
    const lines = text.split('\n');
    const newLineCount = lines.length;
    setMaleLineCount(newLineCount);
    setGetMaleList(generateNumberedText(lines));
  };

  const handleMaleTextChange = (e) => {
    const newText = e.target.value;
    setMaleList(newText);
    countMaleList(newText);
  };

  //Count Female Guest
  const countFemaleList = (text) => {
    const lines = text.split('\n');
    const newLineCount = lines.length;
    setFemaleLineCount(newLineCount);
    setGetFemaleList(generateNumberedText(lines));
  };

  const handleFemaleTextChange = (e) => {
    const newText = e.target.value;
    setFemaleList(newText);
    countFemaleList(newText);
  };

  const none = 'N/A';

  //Notifications
  const Confirmation = (
    <div>
      <p>Form Submit Successfully!</p>
    </div>
  ); 

  const Clarification = (
    <div>
      <p>Do you want to proceed</p>
      <p>if there is no OPR instruction?</p>
    </div>
  );

  const DateTimeError = (
    <div>
      <p><strong>Form cannot submit!</strong></p>
      <p>The end time of activity must not be</p>
      <p>before the start time of activity.</p>
    </div>
  ); 

  // Auto Approval for Supervisors and Manager
  let output;

  if (currentUser.code_clearance === 1 ) {
    output = 2;
  } else {
    output = 4;
  }

  function handleClarification(){

    setSubmitLoading(true);

    if(dormCheck == true && currentUser.code_clearance == 1){
      if(!maleList && !femaleList){
        setShowPopup(true);
        setPopupMessage("Fillup the Dormitory form please!");
        setNototifications("warningnull"); 
        setSubmitLoading(false);
      }else if(oprInstrucValue == "None"){
        setShowPopup(true);
        setPopupMessage(Clarification);
        setNototifications("warning"); 
        setSubmitLoading(false);
      }
    }else if(dormCheck == true && currentUser.code_clearance != 1){
      if(!maleList && !femaleList){
        setShowPopup(true);
        setPopupMessage("Fillup the Dormitory form please!");
        setNototifications("warningnull"); 
        setSubmitLoading(false);
      }
    }
    else{
      setShowPopup(true);
      setPopupMessage(Clarification);
      setNototifications("warning"); 
      setSubmitLoading(false);
    }

  };

  //Submit the Form
  const SubmitFacilityForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    const requestData = {
      date_requested: today,
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
      table: checkTable,
      no_table: NoOfTable,
      chair: checkChairs,
      no_chair: NoOfChairs,
      microphone: checkMicrphone,
      no_microphone: NoOfMicrophone,
      others: checkOther,
      specify: OtherField,
      projector: checkProjector,
      projector_screen: checkProjectorScreen,
      document_camera: checkDocumentCamera,
      laptop: checkLaptop,
      television: checkTelevision,
      sound_system: checkSoundSystem,
      videoke: checkVideoke,
      name_male: none,
      name_female: none,
      other_details: none,
      obr_instruct: oprInstrucValue,
      admin_approval: output,
      remarks: 'Pending',
    };

    if(timestampstart > timestampend){
      setShowPopup(true);
      setPopupMessage(DateTimeError);
      setNototifications("error");
      setSubmitLoading(false);
      return;
    }

    if (dormCheck) {
      requestData.name_male = getMaleList;
      requestData.name_female = getFemaleList;
      requestData.other_details = DormOtherField;
    }

    axiosClient
    .post("facilityformrequest", requestData)
    .then((response) => {
      setShowPopup(true);
      setPopupMessage(Confirmation);
      setNototifications("success");
      setSubmitLoading(false);
      setCheckValidation(null);
    })
    .catch((error) => {
      console.error(error);
      const responseErrors = error.response.data.errors;
      setInputFacErrors(responseErrors);
      setSubmitLoading(false);
      setShowPopup(false);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
    
  }

  const closeError = () => {
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    window.location.assign(`/myrequestfacilityvenueform/${currentUser.id}`);
  };

  return (
  <PageComponent title="Request for use of Facility / Venue Form">
  {currentUser.id == id && (
  <>
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
    <>
      <form id="fac-submit" onSubmit={SubmitFacilityForm}>

        {/* Title */}
        <div>
          <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
          <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
        </div>

        {/* Main form */}
        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-1">

            {/* Date */}
            <div className="flex items-center mt-6">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                  Date:<span className="text-red-500">*</span>
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="rep_date"
                  id="rep_date"
                  defaultValue= {today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  readOnly
                />
              </div>
            </div>

            {/* Requesting Office/Division */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                  Requesting Office/Division:<span className="text-red-500">*</span>
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
                {inputFacErrors?.request_office && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                Title/Purpose of Activity:<span className="text-red-500">*</span>
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
                {inputFacErrors?.title_of_activity && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date Start */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                  Date of Activity (Start):<span className="text-red-500">*</span>
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="date_start"
                  id="date_start"
                  value={DateStart}
                  onChange={ev => {
                    setDateStart(ev.target.value);
                    setDateEndMin(ev.target.value);
                  }}
                  min={today}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors?.date_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time Start */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                  Time of Activity (Start):<span className="text-red-500">*</span>
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="time_start"
                  id="time_start"
                  value={timeStart}
                  onChange={ev => setTimeStart(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors?.time_start && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Date End */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                  Date of Activity (End):<span className="text-red-500">*</span>
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="date"
                  name="date_end"
                  id="date_end"
                  value={DateEnd}
                  onChange={ev => {
                    setDateEnd(ev.target.value);
                    if (ev.target.value < DateStart) {
                      // If DateEnd is before DateStart, set DateEnd to DateStart
                      setDateEnd(DateStart);
                    }
                  }}
                  min={DateEndMin}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors?.date_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

            {/* Time End */}
            <div className="flex items-center mt-2">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                  Time of Activity (End):<span className="text-red-500">*</span>
                </label> 
              </div>
              <div className="w-64">
                <input
                  type="time"
                  name="time_end"
                  id="time_end"
                  value={timeEnd}
                  onChange={ev => setTimeEnd(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputFacErrors?.time_end && (
                  <p className="text-red-500 text-xs italic">This field must be required</p>
                )}
              </div>
            </div>

          </div>

          <div className="col-span-1">

            <div className="mt-6">
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
                    checked={mphCheck}
                    onChange={(ev) => handleCheckboxChange(setMphCheck, ev.target.checked, setConfCheck, setOtherCheck)}
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
                    checked={confCheck}
                    onChange={(ev) => handleCheckboxChange(setConfCheck, ev.target.checked, setMphCheck, setOtherCheck)}
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
                    checked={dormCheck}
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
                    checked={otherCheck}
                    onChange={(ev) => handleCheckboxChange(setOtherCheck, ev.target.checked, setConfCheck, setMphCheck)}
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

          </div>

        </div>

        {/* Facility Form */}
        {(mphCheck || confCheck || otherCheck) ? (
        <>
        <div className="mt-8 border-t border-black">

          <div>
            <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-1">

              {/* Table */}
              <div class="relative flex items-center mt-4">
                <div class="flex items-center h-5">
                  <input
                    id="mph-checktable"
                    name="mph-checktable"
                    type="checkbox"
                    checked={checkTable}
                    onChange={() => {
                      setCheckTable(!checkTable);
                      setInputFacErrors(null);
                    }}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                    Tables
                  </label> 
                </div>
                {checkTable && (
                  <div className="flex items-center w-32 ml-2">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      (No. 
                    </label> 
                    <input
                      type="number"
                      name="no-of-table"
                      id="no-of-table"
                      value={NoOfTable}
                      onChange={handleInputTableChange}
                      className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                      ) 
                    </label>
                  </div>
                )}
              </div>
              {inputFacErrors?.no_table && (
                <p className="text-red-500 text-xs">No. of table is required</p>
              )}

              {/* Chair */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="mph-checkchair"
                    name="mph-checkchair"
                    type="checkbox"
                    checked={checkChairs}
                    onChange={() => {
                      setCheckChairs(!checkChairs);
                      setinputFacErrors(null);
                    }}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                    Chair
                  </label> 
                </div>
                {checkChairs && (
                  <div className="flex items-center w-32 ml-2">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      (No. 
                    </label> 
                    <input
                      type="number"
                      name="no-of-chair"
                      id="no-of-chair"
                      value={NoOfChairs}
                      onChange={handleInputChairChange}
                      className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                      ) 
                    </label>
                  </div>
                )}
              </div>
              {inputFacErrors?.no_chair && (
                <p className="text-red-500 text-xs">No. of chair is required</p>
              )}

              {/* Projector */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkProjector}
                    onChange={ev => setCheckProjector(!checkProjector)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Projector
                  </label> 
                </div>
              </div>

              {/* Projector Screen */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkProjectorScreen}
                    onChange={ev => setCheckProjectorScreen(!checkProjectorScreen)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Projector Screen
                  </label> 
                </div>
              </div>
              
              {/* Document Camera */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkDocumentCamera}
                    onChange={ev => setCheckDocumentCamera(!checkDocumentCamera)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Document Camera
                  </label> 
                </div>
              </div>

            </div>

            <div className="col-span-1">

              {/* Laptop */}
              <div class="relative flex items-center mt-4">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkLaptop}
                    onChange={ev => setCheckLaptop(!checkLaptop)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Laptop
                  </label> 
                </div>
              </div>

              {/* Television */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkTelevision}
                    onChange={ev => setCheckTelevision(!checkTelevision)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Television
                  </label> 
                </div>
              </div>

              {/* Sound System */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkSoundSystem}
                    onChange={ev => setCheckSoundSystem(!checkSoundSystem)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Sound System
                  </label> 
                </div>
              </div>

              {/* Videoke */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="other-checkbox"
                    type="checkbox"
                    checked={checkVideoke}
                    onChange={ev => setCheckVideoke(!checkVideoke)}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Videoke
                  </label> 
                </div>
              </div>

              {/* Microphone */}
              <div class="relative flex items-center mt-2">
                <div class="flex items-center h-5">
                  <input
                    id="mph-checkmicrophone"
                    name="mph-checkmicrophone"
                    type="checkbox"
                    checked={checkMicrphone}
                    onChange={() => {
                      setCheckMicrphone(!checkMicrphone);
                      setinputFacErrors(null);
                    }}
                    class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
                  />
                </div>
                <div class="ml-3">
                  <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                  Microphone
                  </label> 
                </div>
                {checkMicrphone && (
                  <div className="flex items-center w-32 ml-2">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      (No. 
                    </label> 
                    <input
                      type="number"
                      name="no-of-microphone"
                      id="no-of-microphone"
                      value={NoOfMicrophone}
                      onChange={handleInputMicrophoneChange}
                      className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                      ) 
                    </label>
                  </div>
                )}
              </div>
              {inputFacErrors?.no_microphone && (
                <p className="text-red-500 text-xs">No. of microphone is required</p>
              )}

            </div>

          </div>

          {/* Other */}
          <div class="relative flex items-center mt-2">
            <div class="flex items-center h-5">
              <input
                id="mph-checkmicrophone"
                name="mph-checkmicrophone"
                type="checkbox"
                checked={checkOther}
                onChange={() => {
                  setCheckOther(!checkOther);
                  setinputFacErrors(null);
                }}
                class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-black-500 rounded"
              />
            </div>
            <div class="ml-3">
              <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
              Others
              </label> 
            </div>
            {checkOther && (
              <div className="flex items-center w-full ml-2">
                <input
                  type="text"
                  name="other-specfic"
                  id="other-specfic"
                  placeholder="Please Specify"
                  value={OtherField}
                  onChange={ev => setOtherField(ev.target.value)}
                  className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                </label>
              </div>
            )}
          </div>
          {inputFacErrors?.specify && (
            <p className="text-red-500 text-xs">This form is required</p>
          )}

          {/* For OPR Instruction */}
          {dormCheck ? null:(
          <>
          {currentUser.code_clearance == 1 && (
          <>
          <div>
            <h2 className="pt-4 text-base font-bold leading-7 text-gray-900 border-t border-black mt-9"> * For OPR Instruction (Admin Manager Only) </h2>
          </div>

            <div className="flex mt-6">
              <div className="w-56">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Instruction for the OPR for Action:
                </label> 
              </div>
              <div className="w-96 pl-1">

                <textarea
                  id="findings"
                  name="findings"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {OprInstruct}
                  onChange={ev => setOprInstruct(ev.target.value)}
                  className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-gray-500 text-xs mt-0 mb-2">If you have no instructions, please submit the form</p>

              </div>
            </div>
          </> 
          )}
          </>
          )}

        </div>
        </>
        ):null}

        {/* Dormitory Form */}
        {dormCheck ? (
        <>
        <div className="mt-8 border-t border-black">

          <div>
            <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Dormitory </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Male */}
            <div className="col-span-1">

              {/* No of Male Guest */}
              <div className="mt-6">
                <div className="flex">
                  <div className="w-24 border-b border-black font-bold text-center">
                    <span>
                      {malelineCount}
                    </span>
                  </div>
                  <div className="w-full ml-2">
                    <strong>No. of Male Guests</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6">

                <div className="mb-4">
                  <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Name of Guests:</strong> </label>
                </div>

                <textarea
                  id="dorm-male-list"
                  name="dorm-male-list"
                  rows={5}
                  value={maleList}
                  onChange={handleMaleTextChange}
                  style={{ resize: 'none' }}
                  className="block w-10/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-red-500 text-xs mt-1">Separate name on next line (Leave blank if none)</p>

                {/* For displaying the number of guest */}
                <div>
                  <textarea
                    id="output-male-list"
                    name="output-male-list"
                    rows={5}
                    value={getMaleList}
                    readOnly
                    style={{ resize: 'none', display: 'none' }}
                  />
                </div>

              </div>

            </div>

            {/* Female */}
            <div className="col-span-1">

              {/* No of Females */}
              <div className="mt-6">
                <div className="flex">
                  <div className="w-24 border-b border-black font-bold text-center">
                    <span>
                      {femalelineCount}
                    </span>
                  </div>
                  <div className="w-full ml-2">
                    <strong>No. of Female Guests</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6">

                <div className="mb-4">
                  <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Name of Guests:</strong> </label>
                </div>

                <textarea
                  id="dorm-female-list"
                  name="dorm-female-list"
                  rows={5}
                  value={femaleList}
                  onChange={handleFemaleTextChange}
                  style={{ resize: 'none' }}
                  className="block w-10/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-red-500 text-xs mt-1">Separate name on next line (Leave blank if none)</p>

                {/* For displaying the number of guest */}
                <div>
                  <textarea
                    id="output-female-list"
                    name="output-female-list"
                    rows={5}
                    value={getFemaleList}
                    readOnly
                    style={{ resize: 'none', display: 'none' }}
                  />
                </div>

              </div>

            </div>

          </div>

          {/* For Other */}
          <div className="flex mt-10 ml-40">
            <div className="w-40">
              <label htmlFor="recomendations" className="block text-base font-bold leading-6 text-gray-900">
                Other Details :
              </label>
            </div>
            <div className="w-1/2">
              <textarea
                id="recomendations"
                name="recomendations"
                rows={3}
                style={{ resize: "none", borderColor: "#272727" }}
                value={DormOtherField}
                onChange={(ev) => setDormOtherField(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-xs mt-2">Leave blank if none</p>
            </div>  
          </div>

          {currentUser.code_clearance == 1 && (
          <>
          <div>
            <h2 className="pt-4 text-base font-bold leading-7 text-gray-900 border-t border-black mt-9"> * For OPR Instruction (Admin Manager Only) </h2>
          </div>

            <div className="flex mt-6">
              <div className="w-56">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Instruction for the OPR for Action:
                </label> 
              </div>
              <div className="w-96 pl-1">

                <textarea
                  id="findings"
                  name="findings"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {OprInstruct}
                  onChange={ev => setOprInstruct(ev.target.value)}
                  className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-gray-500 text-xs mt-0 mb-2">If you have no instructions, please submit the form</p>

              </div>
            </div>
          </> 
          )}

        </div>
        </>
        ):null}

      </form>
      
      {/* Button */}
      <div className="flex mt-8">

        {/* For Admin Manager User Only */}
        {currentUser.code_clearance == 1 && (mphCheck || confCheck || otherCheck || dormCheck) && (
        <>
          {/* If the user choose between the Facility and Dorm Form */}
          {(mphCheck || confCheck || otherCheck) && dormCheck ? (
          <>
            {/* Condition if the user choose the field on the Facility will appear the button */}
            {checkedCount ? (
              (!maleList && !femaleList) || oprInstrucValue === "None" ? (
                <button
                  onClick={() => handleClarification()}
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
                  ) : 'Submit'}
                </button>
              ):null
            ):null}
          </>
          ):(
          <>
            {/* if user choose only Dormitory */}
            {dormCheck ? (
              (!maleList && !femaleList) || oprInstrucValue === "None" ? (
                <button
                  onClick={() => handleClarification()}
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
                  ) : 'Submit'}
                </button>
              ):(
                <button
                  form="fac-submit"
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
                  ) : 'Submit'}
                </button>
              )
            ):(
              checkedCount ? (
                oprInstrucValue === "None" ? (
                  <button
                    onClick={() => handleClarification()}
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
                    ) : 'Submit'}
                  </button>
                ):(
                  <button
                    form="fac-submit"
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
                    ) : 'Submit'}
                  </button>
                )
              ):null
            )}
          </>
          )}

        </>
        )}

        {/* For Other Users */}
        {currentUser.code_clearance != 1 && (mphCheck || confCheck || otherCheck || dormCheck) && (
        <>
        
          {(mphCheck || confCheck || otherCheck) && dormCheck ? (
            checkedCount ? (
              (!maleList && !femaleList) ? (
                <button
                  onClick={() => handleClarification()}
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
                  ) : 'Submit'}
                </button>
              ):(
                <button
                  form="fac-submit"
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
                  ) : 'Submit'}
                </button>
              )
            ):null
          ):(
            dormCheck ? (
              (!maleList && !femaleList) ? (
                <button
                  onClick={() => handleClarification()}
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
                  ) : 'Submit'}
                </button>
              ):(
                <button
                  form="fac-submit"
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
                  ) : 'Submit'}
                </button>
              )
            ):(
              checkedCount ? (
                <button
                  form="fac-submit"
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
                  ) : 'Submit'}
                </button>
              ):null 
            )
          )}

        </>
        )}

      </div>

      {/* Popup */}
      {showPopup && (
      <>
      <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div
        className="fixed inset-0 bg-black opacity-40" // Close on overlay click
      ></div>

      {/* Popup content with background blur */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down">

      {/* Notification Icons */}
      <div class="f-modal-alert">

        {/* Error */}
        {notifications == "error" && (
        <>
        <div className="f-modal-icon f-modal-error animate">
          <span className="f-modal-x-mark">
            <span className="f-modal-line f-modal-left animateXLeft"></span>
            <span className="f-modal-line f-modal-right animateXRight"></span>
          </span>
        </div>
        </>
        )}

        {/* Warning */} 
        {(notifications == "warning" || 
        notifications == "warningnull") && (
        <>
          <div class="f-modal-icon f-modal-warning scaleWarning">
            <span class="f-modal-body pulseWarningIns"></span>
            <span class="f-modal-dot pulseWarningIns"></span>
          </div>
        </> 
        )}

        {/* Success */}
        {notifications == "success" && (
        <>
        <div class="f-modal-icon f-modal-success animate">
          <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
          <span class="f-modal-line f-modal-long animateSuccessLong"></span>
        </div>
        </>
        )}

      </div>
      
        <p className="text-lg text-center">{popupMessage}</p>

        <div className="flex justify-center mt-4">

        {/* Notice / Warning */}
        {notifications == "warning" && (
        <>
        {!sumbitLoading && (
            <button
              form="fac-submit"
              type="submit"
              className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Yes
            </button>
          )}

          {!sumbitLoading && (
            <button
              onClick={closeError}
              className="w-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
            >
              No
            </button>
          )}

          {sumbitLoading && (
            <button className="w-full px-4 py-2 bg-blue-300 text-white rounded cursor-not-allowed">
              <div className="flex items-center justify-center">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Loading</span>
              </div>
            </button>
          )}
        </>
        )}

        {/* Error / Warning*/}
        {(notifications == "warningnull" || 
        notifications == "error") && (
        <>
          <button
            onClick={() => (closeError())}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </>
        )}

        {/* Success */}
        {notifications == "success" && (
          <button
            onClick={() => (closePopup())}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View My Request
          </button>
        )}

        </div>

      </div>

      </div>
      </>  
      )}
    </>
    )}
  </>
  )}
  </PageComponent>
  );
}