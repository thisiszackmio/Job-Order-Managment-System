import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";

export default function FacilityVenueForm(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

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

  // Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");

  const today = new Date().toISOString().split('T')[0];
  const [disableForm, setDisableForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fieldMissing, setFieldMissing] = useState({});
  const [confirmation, setConfirmation] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Function
  const [buttonHide, setButtonHide] = useState(false);

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
  const [DateEndMin, setDateEndMin] = useState(today);

  // Function
  const [checkFacility, setCheckFacility] = useState(false);
  const [enableFacility, setEnableFacility] = useState(false);
  const [enableDormitory, setEnableDormitory] = useState(false);

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
  const [checkedCount, setCheckedCount] = useState(0);

  // Dormitory
  const [getMale, setGetMale] = useState('');
  const [getFemale, setGetFemale] = useState('');
  const [otherDetails, setOtherDetails] = useState('');

  const [oprInstruct, setOprInstruct] = useState('');

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

  // For checkbox
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

  // Check Availability
  function checkAvailability(event){
    event.preventDefault();

    setSubmitLoading(true);

    const checkRequest = {
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
    };

    axiosClient
    .post('checkavailability', checkRequest)
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'checkDate'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">Oops! It looks like the end time is earlier than the start time. Please double-check your inputs.</p>
          </div>
        );
      }else if(responseData === 'invalidDate'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">Please select a start date and time that’s not in the past.</p>
            <p className="popup-message"><i><b>Don’t look back—focus on the present!</b></i></p>
          </div>
        );
      }else{
        if(responseData === "Vacant"){
          if(mphCheck || confCheck || otherCheck){
            setEnableFacility(true);
            setDisableForm(true);
          } else {
            setEnableDormitory(true);
            setDisableForm(true);
          }
        }else if(responseData === "Not Vacant"){
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Not Available</p>
              <p className="popup-message">Sorry, that facility is not yet available.</p>
            </div>
          );
        }else{
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Pending for Approval</p>
              <p className="popup-message">Sorry, that schedule is pending approval from another requestor.</p>
            </div>
          );
        }
      }
    })
    .finally(() => {
      setSubmitLoading(false);
      setButtonHide(false);
    });
  }

  // Confirm
  function handleConfirm(event){
    event.preventDefault();

    if(!oprInstruct && Admin){
      setShowPopup(true);
      setPopupContent('check-error');
      setPopupMessage(
        <div>
          <p className="popup-title">Error</p>
          <p className="popup-message">Please fill up the OPR Intruction.</p>
        </div>
      );
    }else{
      if(enableFacility){
        if(checkedCount <= 0){
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Invalid</p>
              <p className="popup-message">You haven’t selected any checkboxes.</p>
            </div>
          );
          setSubmitLoading(false);
        }else{
          setConfirmation(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      else{
        if(getMale || getFemale){
          setConfirmation(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }else{
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Invalid</p>
              <p className="popup-message">Please enter the details of the guest.</p>
            </div>
          );
        }
      }
    }
  }

  // Submit the form
  function SubmitFacilityForm(event){
    event.preventDefault();
    setSubmitLoading(true);

    const remark = Admin ? "The Admin Manager has submit the request." : "Waiting for admin manager's approval.";

    const data = {
      user_id: currentUserId,
      user_name: currentUserName.name,
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
      name_male: getMale ? getMale : null,
      name_female: getFemale ? getFemale : null,
      other_details: otherDetails ? otherDetails: null,
      admin_approval: PortManager ? 5 : Admin ? 6 : 7,
      obr_instruct: Admin ? oprInstruct : null,
      date_approve: Admin ? today : null,
      remarks: remark
    };

    axiosClient
    .post('/submitfacrequest', data)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          {Admin ? (
            <p className="popup-message">Form submitted successfully.</p>
          ):(
            <p className="popup-message">Form submitted successfully. Please wait for the admin manager's approval.</p>
          )}
        </div>
      );
    })
    .catch(()=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Close Button
  function handleCancel(){
    setDisableForm(false);
    setEnableFacility(false);
    setEnableDormitory(false);

    // setMaleList('');
    // setFemaleList('');
    setOtherDetails('');

    // Reset all checkboxes
    setCheckTable(false);
    setCheckChairs(false);
    setCheckProjector(false);
    setCheckProjectorScreen(false);
    setCheckDocumentCamera(false);
    setCheckLaptop(false);
    setCheckTelevision(false);
    setCheckSoundSystem(false);
    setCheckVideoke(false);
    setCheckMicrphone(false);
    setCheckOther(false);
    setNoOfTable('');
    setNoOfChairs('');
    setNoOfMicrophone('');
    setOtherCheck('');
  }

  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    setEnableFacility(false);
    setEnableDormitory(false);
    setDisableForm(false);
    window.location.href = '/joms/myrequest';
  }

  return(
    <PageComponent title="Request Form">
      {/* Form Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Facility / Venue Request Form </div>
        
        <div className="p-4">
        {confirmation ? (
        <>
          <form id="fac_submit" onSubmit={SubmitFacilityForm}>

            {/* Title */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900">KINDLY double check your form PLEASE! </h2>
              <p className="text-xs font-bold text-red-500">This will not be editable once submitted.</p>
            </div>

            {/* Form */}
            <div className="mr-28 pb-10">
              {/* Date */}
              <div className="flex items-center mt-4">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Date:
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {formatDate(today)}
                </div>
              </div>

              {/* Requesting Office/Division */}
              <div className="flex items-center mt-3">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Requesting Office/Division:
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {reqOffice}
                </div>
              </div>

              {/* Title/Purpose of Activity */}
              <div className="flex items-center mt-3">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Title/Purpose of Activity:
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {titleReq}
                </div>
              </div>

              {/* Date and Time of Activity (Start) */}
              <div className="flex items-center mt-3">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Date and Time of Activity (Start):
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {formatDate(DateStart)} @ {formatTime(timeStart)}
                </div>
              </div>

              {/* Date and Time of Activity (End) */}
              <div className="flex items-center mt-3">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Date and Time of Activity (End):
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {formatDate(DateEnd)} @ {formatTime(timeEnd)}
                </div>
              </div>

              {/* Facility */}
              <div className="flex items-center mt-3">
                <div className="w-[380px]">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Facility:
                  </label> 
                </div>
                <div className="w-full ppa-form-view h-6">
                  {mphCheck ? ("Multi-Purpose Hall"):null}
                  {confCheck ? ("Conference Room"):null}
                  {dormCheck ? ("Dormitory"):null}
                  {otherCheck ? ("Others"):null}
                </div>
              </div>

            </div>

            {/* For Facility */}
            {mphCheck || confCheck || otherCheck ? (
              <div className="border-t border-gray">
                {/* Caption */}
                <div>
                  <h2 className="text-base font-bold leading-7 text-gray-900 mt-5"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
                </div>

                <div className="grid grid-cols-2">
                  {/* Left */}
                  <div className="col-span-1 ml-10">
                    {/* Table */}
                    <div className="mt-4">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkTable ? 'X':null}
                        </div>
                        <div className="w-12 ml-1 font-bold justify-center">
                          <span>Tables</span>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 font-bold text-center"> 
                          {NoOfTable ? NoOfTable : null} 
                        </span>)
                        </div>
                      </div>
                    </div>

                    {/* Chair */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkChairs ? 'X':null}
                        </div>
                        <div className="w-12 ml-1 font-bold justify-center">
                          <span>Chairs</span>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 font-bold text-center"> 
                          {NoOfChairs ? NoOfChairs : null} 
                        </span>)
                        </div>
                      </div>
                    </div>

                    {/* Projector */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkProjector ? 'X':null}
                        </div>
                        <div className="w-12 ml-1 font-bold justify-center">
                          <span>Projector</span>
                        </div>
                      </div>
                    </div>

                    {/* Projector Screen */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkProjectorScreen ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Projector Screen</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Camera */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkDocumentCamera ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Document Camera</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="col-span-1">
                    {/* Laptop */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkLaptop ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Laptop</span>
                        </div>
                      </div>
                    </div>

                    {/* Television */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkTelevision ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Television</span>
                        </div>
                      </div>
                    </div>

                    {/* Sound System */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkSoundSystem ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Sound System</span>
                        </div>
                      </div>
                    </div>

                    {/* Videoke */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkVideoke ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Videoke</span>
                        </div>
                      </div>
                    </div>

                    {/* Microphone */}
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="ppa-checklist">
                        {checkMicrphone ? 'X':null}
                        </div>
                        <div className="w-22 ml-1 font-bold justify-center">
                          <span>Microphone</span>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 font-bold text-center"> 
                          {NoOfMicrophone ? NoOfMicrophone : null} 
                        </span>)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Others */}
                <div className="mt-2 m-10">
                  <div className="w-full">
                    <div className="mt-1">
                      <div className="flex items-center">
                        <div className="w-12 ppa-checklist">
                          {checkOther ? 'X':null}
                        </div>
                        <div className="w-12 ml-1 font-bold justify-center">
                          <span>Others</span>
                        </div>
                        <div className="w-1/2 h-6 border-b p-0 pl-2 border-black text-sm text-left ml-4 ">
                        <span className=""> {OtherField ? OtherField : null} </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ):null}

            {/* For Dormitory */}
            {dormCheck ? (
              <div className="border-t border-gray">
                {/* Caption */}
                <div>
                  <h2 className="text-base font-bold leading-7 text-gray-900 mt-5"> * For the Dormitory </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* For Male */}
                  <div className="col-span-1">
                    <div className="font-bold mt-5">
                      Male Guest:
                    </div>
                    <div className="w-3/4 p-2">
                    {getMale?.trim() ? (
                      getMale.split("\n").map((name, index) => (
                        <div key={index} className="mt-2 flex">
                          <span className="font-bold">{`${index + 1}.`}</span>
                          <div className="w-full ppa-form-list ml-2 pl-1 h-6">
                            {name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mt-2 text-gray-500 italic">No Male Guest</div>
                    )}
                    </div>
                  </div>

                  {/* For Female */}
                  <div className="col-span-1">
                    <div className="font-bold mt-5">
                      Female Guest:
                    </div>
                    <div className="w-3/4 p-2">
                    {getFemale?.trim() ? (
                      getFemale.split("\n").map((name, index) => (
                        <div key={index} className="mt-2 flex">
                          <span className="font-bold">{`${index + 1}.`}</span>
                          <div className="w-full ppa-form-list ml-2 pl-1 h-6">
                            {name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mt-2 text-gray-500 italic">No Female Guest</div>
                    )}
                    </div>
                  </div>
                </div>
                {/* Other */}
                <div className="mt-4 ml-16">
                  <div className="flex">
                    <div className="w-28 text-base">
                      <span>Other Details:</span>
                    </div>
                    <div className="w-3/4 border-b border-black font-regular text-base text-left pl-2">
                    {otherDetails}
                    </div>
                  </div>
                </div>
              </div>
            ):null}

            {/* For OPR Instruction */}
            {(enableDormitory || enableFacility) && Admin && (
              <div className="border-t border-gray">
                {/* Caption */}
                <div>
                  <h2 className="text-base font-bold leading-7 text-gray-900 mt-5"> * OPR Instruction </h2>
                </div>
                <div className="w-full ppa-form-view h-6 mt-4">
                {oprInstruct}
                </div>
              </div>
            )}

            {/* Button */}
            <div className="mt-10">
            {!buttonHide && (
            <>
              {/* Submit */}
              <button 
                // form="fac_submit"
                type="submit"
                className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-1">Loading</span>
                  </div>
                ):(
                  'Confirm'
                )}
              </button>

              {/* Cancel */}
              {!submitLoading && (
                <button onClick={() => setConfirmation(false)} className="ml-2 py-2 px-4 text-sm btn-cancel-form">
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
            <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
            <p className="text-xs font-bold text-red-500">Please double check the form before submitting</p>
          </div>

          {/* Form */}
          <div>

            {/* Date */}
            <div className="flex items-center mt-6 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                  Date:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="date"
                  name="rep_date"
                  id="rep_date"
                  defaultValue={today}
                  className="block w-full ppa-form"
                  readOnly
                />
              </div>
            </div>

            {/* Requesting Office/Division */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-black">
                  Requesting Office/Division:
                </label>
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="rf_request"
                  id="rf_request"
                  autoComplete="rf_request"
                  value={reqOffice}
                  onChange={ev => setRegOffice(ev.target.value)}
                  className={`block w-full ${(!reqOffice && fieldMissing.request_office) ? "ppa-form-error":"ppa-form"}`}
                  maxLength={255}
                />
                {!reqOffice && fieldMissing.request_office && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_title" className="block text-base font-bold leading-6 text-black">
                Title/Purpose of Activity:
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="rep_title"
                  id="rep_title"
                  autoComplete="rep_title"
                  value={titleReq}
                  onChange={ev => setTitleReq(ev.target.value)}
                  className={`block w-full ${(!titleReq && fieldMissing.title_of_activity) ? "ppa-form-error":"ppa-form"}`}
                  maxLength={255}
                />
                {!titleReq && fieldMissing.title_of_activity && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Date Start */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                  Date of Activity (Start):
                </label> 
              </div>
              <div className="w-1/2">
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
                  className={`block w-full ${(!titleReq && fieldMissing.title_of_activity) ? "ppa-form-error":"ppa-form"} ${disableForm ? 'disable-ppa-form' : ''}`}
                  readOnly={disableForm}
                />
                {!DateStart && fieldMissing.date_start && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Time Start */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                  Time of Activity (Start):
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="time"
                  name="time_start"
                  id="time_start"
                  value={timeStart}
                  onChange={ev => setTimeStart(ev.target.value)}
                  className={`block w-full ${(!timeStart && fieldMissing.time_start) ? "ppa-form-error":"ppa-form"} ${disableForm ? 'disable-ppa-form' : ''}`}
                  readOnly={disableForm}
                />
                {!timeStart && fieldMissing.time_start && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Date End */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base leading-6 font-bold text-black">
                  Date of Activity (End):
                </label> 
              </div>
              <div className="w-1/2">
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
                  className={`block w-full ${(!DateEnd && fieldMissing.date_end) ? "ppa-form-error":"ppa-form"} ${disableForm ? 'disable-ppa-form' : ''}`}
                  readOnly={disableForm}
                />
                {!DateEnd && fieldMissing.date_end && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Time End */}
            <div className="flex items-center mt-2 font-roboto">
              <div className="w-56">
                <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                  Time of Activity (End):
                </label> 
              </div>
              <div className="w-1/2">
                <input
                  type="time"
                  name="time_end"
                  id="time_end"
                  value={timeEnd}
                  onChange={ev => setTimeEnd(ev.target.value)}
                  className={`block w-full ${(!timeEnd && fieldMissing.time_end) ? "ppa-form-error":"ppa-form"} ${disableForm ? 'disable-ppa-form' : ''}`}
                  readOnly={disableForm}
                />
                {!timeEnd && fieldMissing.time_end && (
                  <p className="form-validation">This form is required</p>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-6 font-roboto">
              <label htmlFor="rf_request" className="block text-base leading-6 font-bold text-black">
                Facilities / Venue being Requested :
              </label> 
            </div>

            <div className="grid grid-cols-4 mt-4">
              {/* 1st Column */}
              <div className="col-span-1">
                {/* For MPH */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="mph-checkbox"
                      type="checkbox"
                      checked={mphCheck}
                      onChange={(ev) => {
                        const isChecked = ev.target.checked ? 1 : 0;
                        handleCheckboxChange(setMphCheck, ev.target.checked, setConfCheck, setOtherCheck, setDormCheck);
                        if (!ev.target.checked) {
                          setCheckTable(false);
                          setNoOfTable(null);
                          setCheckChairs(false);
                          setNoOfChairs(null);
                          setCheckOther(false);
                          setOtherField(null);
                          setCheckMicrphone(false);
                          setNoOfMicrophone(null);
                          setCheckVideoke(false);
                          setCheckSoundSystem(false);
                          setCheckTelevision(false);
                          setCheckLaptop(false);
                          setCheckDocumentCamera(false);
                          setCheckProjectorScreen(false);
                          setCheckProjector(false);
                        }
                        setMphCheck(isChecked);
                      }}
                      className={`focus:ring-gray-400 h-6 w-6 ${!mphCheck ? 'text-indigo-600' : 'text-gray-400'} border-black-500 rounded`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      Multi-Purpose Hall (MPH)
                    </label> 
                  </div>
                </div>
              </div>

              {/* 2nd Column */}
              <div className="col-span-1">
                {/* Conference Hall */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="conference-checkbox"
                      type="checkbox"
                      checked={confCheck}
                      onChange={(ev) => {
                        const isChecked = ev.target.checked ? 1 : 0;
                        handleCheckboxChange(setConfCheck, ev.target.checked, setOtherCheck, setDormCheck, setMphCheck);
                        if (!ev.target.checked) {
                          setCheckTable(false);
                          setNoOfTable(null);
                          setCheckChairs(false);
                          setNoOfChairs(null);
                          setCheckOther(false);
                          setOtherField(null);
                          setCheckMicrphone(false);
                          setNoOfMicrophone(null);
                          setCheckVideoke(false);
                          setCheckSoundSystem(false);
                          setCheckTelevision(false);
                          setCheckLaptop(false);
                          setCheckDocumentCamera(false);
                          setCheckProjectorScreen(false);
                          setCheckProjector(false);
                        }
                        setConfCheck(isChecked);
                      }}
                      className={`focus:ring-gray-400 h-6 w-6 ${!confCheck ? 'text-indigo-600' : 'text-gray-400'} border-black-500 rounded`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      Conference Hall
                    </label> 
                  </div>
                </div>
              </div>

              {/* 3rd Column */}
              <div className="col-span-1">
                {/* Dormitory */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="dormitory-checkbox"
                      type="checkbox"
                      checked={dormCheck}
                      onChange={(ev) => {
                        const isChecked = ev.target.checked ? 1 : 0;
                        handleCheckboxChange(setDormCheck, ev.target.checked, setOtherCheck, setMphCheck, setConfCheck);
                        setDormCheck(isChecked);
                      }}
                      className={`focus:ring-gray-400 h-6 w-6 ${!dormCheck ? 'text-indigo-600' : 'text-gray-400'} border-black-500 rounded`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      Dormitory
                    </label> 
                  </div>
                </div>
              </div>

              {/* 4th Column */}
              <div className="col-span-1">
                {/* Other */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={otherCheck}
                      onChange={(ev) => {
                        const isChecked = ev.target.checked ? 1 : 0;
                        handleCheckboxChange(setOtherCheck, ev.target.checked, setMphCheck, setConfCheck, setDormCheck);
                        if (!ev.target.checked) {
                          setCheckTable(false);
                          setNoOfTable(null);
                          setCheckChairs(false);
                          setNoOfChairs(null);
                          setCheckOther(false);
                          setOtherField(null);
                          setCheckMicrphone(false);
                          setNoOfMicrophone(null);
                          setCheckVideoke(false);
                          setCheckSoundSystem(false);
                          setCheckTelevision(false);
                          setCheckLaptop(false);
                          setCheckDocumentCamera(false);
                          setCheckProjectorScreen(false);
                          setCheckProjector(false);
                        }
                        setOtherCheck(isChecked);
                      }}
                      className={`focus:ring-gray-400 h-6 w-6 ${!otherCheck ? 'text-indigo-600' : 'text-gray-400'} border-black-500 rounded`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                      Other
                    </label> 
                  </div>
                </div>
              </div>

            </div>
            {(!mphCheck && !confCheck && !dormCheck && !otherCheck && checkFacility) && (
              <p className="font-roboto form-validation mt-2">Don't forget this field!</p>
            )}

          </div>

          {/* For MPH / Conference Room / Others */}
          {enableFacility && (
            <div className="mt-8 border-t border-black">
              {/* Caption */}
              <div>
                <h2 className="pt-4 text-lg font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
              </div>

              {/* Check Boxes */}
              <div className="grid grid-cols-2">
                {/* 1st Column */}
                <div className="col-span-1">

                  {/* Table */}
                  <div className="relative flex items-center mt-4">
                    <div className="flex items-center h-5">
                      <input
                        id="mph-checktable"
                        name="mph-checktable"
                        type="checkbox"
                        checked={checkTable}
                        onChange={() => {
                          setCheckTable(!checkTable);
                          if (checkTable) {
                            setNoOfTable('');
                          }
                        }}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkTable ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
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

                  {/* Chair */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="mph-checkchair"
                        name="mph-checkchair"
                        type="checkbox"
                        checked={checkChairs}
                        onChange={() => {
                          setCheckChairs(!checkChairs);
                          if (checkChairs) {
                            setNoOfChairs('');
                          }
                        }}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkChairs ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
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

                  {/* Projector */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkProjector}
                        onChange={ev => setCheckProjector(!checkProjector)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkProjector ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Projector
                      </label> 
                    </div>
                  </div>

                  {/* Projector Screen */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkProjectorScreen}
                        onChange={ev => setCheckProjectorScreen(!checkProjectorScreen)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkProjectorScreen ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Projector Screen
                      </label> 
                    </div>
                  </div>

                  {/* Document Camera */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkDocumentCamera}
                        onChange={ev => setCheckDocumentCamera(!checkDocumentCamera)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkDocumentCamera ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Document Camera
                      </label> 
                    </div>
                  </div>
                  
                </div>

                {/* 2nd Column */}
                <div className="col-span-1">

                  {/* Laptop */}
                  <div className="relative flex items-center mt-4">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkLaptop}
                        onChange={ev => setCheckLaptop(!checkLaptop)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkLaptop ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Laptop
                      </label> 
                    </div>
                  </div>

                  {/* Television */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkTelevision}
                        onChange={ev => setCheckTelevision(!checkTelevision)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkTelevision ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Television
                      </label> 
                    </div>
                  </div>

                  {/* Sound System */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkSoundSystem}
                        onChange={ev => setCheckSoundSystem(!checkSoundSystem)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkSoundSystem ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Sound System
                      </label> 
                    </div>
                  </div>

                  {/* Videoke */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkVideoke}
                        onChange={ev => setCheckVideoke(!checkVideoke)}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkVideoke ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                      Videoke
                      </label> 
                    </div>
                  </div>
                  
                  {/* Microphone */}
                  <div className="relative flex items-center mt-3">
                    <div className="flex items-center h-5">
                      <input
                        id="mph-checkmicrophone"
                        name="mph-checkmicrophone"
                        type="checkbox"
                        checked={checkMicrphone}
                        onChange={() => {
                          setCheckMicrphone(!checkMicrphone);
                          if (checkMicrphone) {
                            setNoOfMicrophone('');
                          }
                        }}
                        className={`focus:ring-gray-400 h-6 w-6 ${checkMicrphone ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="rf_request" className="block text-base leading-6 text-black">
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

                </div>
              </div>
              {/* Other */}
              <div className="relative flex items-center mt-3">
                <div className="flex items-center h-5">
                  <input
                    id="mph-checkmicrophone"
                    name="mph-checkmicrophone"
                    type="checkbox"
                    checked={checkOther}
                    onChange={() => {
                      setCheckOther(!checkOther);
                    }}
                    className={`focus:ring-gray-400 h-6 w-6 ${checkOther ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="rf_request" className="block text-base leading-6 text-black">
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
            </div>
          )}

          {/* For Dormitory */}
          {enableDormitory && (
            <div className="mt-8 border-t border-black">

              {/* Caption */}
              <div>
                <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Dormitory </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* Male */}
                <div className="col-span-1">
                  <div className="mt-6">

                    <div className="mb-4">
                      <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Input name of male guests:</strong> </label>
                    </div>

                    {/* Show on the Form */}
                    <textarea
                      id="dorm-male-list"
                      name="dorm-male-list"
                      rows={5}
                      value={getMale}
                      onChange={ev => setGetMale(ev.target.value)}
                      style={{ resize: 'none' }}
                      className="block w-10/12 ppa-form"
                    />
                    <p className="text-red-500 text-xs mt-1">Separate name on next line</p>

                  </div>
                </div>

                {/* FeMale */}
                <div className="col-span-1">
                  <div className="mt-6">

                    <div className="mb-4">
                      <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Input name of female guests:</strong> </label>
                    </div>

                    {/* Show on the Form */}
                    <textarea
                      id="dorm-male-list"
                      name="dorm-male-list"
                      rows={5}
                      value={getFemale}
                      onChange={ev => setGetFemale(ev.target.value)}
                      style={{ resize: 'none' }}
                      className="block w-10/12 ppa-form"
                    />
                    <p className="text-red-500 text-xs mt-1">Separate name on next line</p>

                  </div>
                </div>

              </div>

              {/* For Other */}
              <div className="flex mt-10">
                <div className="w-40">
                  <label htmlFor="recomendations" className="block text-base font-bold leading-6 text-gray-900">
                    Other Details :
                  </label>
                </div>
                <div className="w-3/4">
                  <textarea
                    id="recomendations"
                    name="recomendations"
                    rows={3}
                    style={{ resize: "none" }}
                    value={otherDetails}
                    onChange={(ev) => setOtherDetails(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                  <p className="text-red-500 text-xs mt-2">Leave blank if none</p>
                </div>  
              </div>
              
            </div>
          )}

          {/* For OPR */}
          {(enableDormitory || enableFacility) && Admin && (
            <div className="mt-8 border-t border-black">
              {/* Caption */}
              <div>
                <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * OPR Instruction </h2>
              </div>

              <div className="flex items-center mt-4 font-roboto">
                <div className="w-1/2">
                  <textarea
                    id="recomendations"
                    name="recomendations"
                    rows={2}
                    style={{ resize: "none" }}
                    value={oprInstruct}
                    onChange={ev => setOprInstruct(ev.target.value)}
                    className="block w-full ppa-form"
                    placeholder="Input here"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          <div className="mt-10">
            {disableForm ? (
            <>
              {/* Check Form */}
              <button 
                onClick={handleConfirm} 
                className="py-2 px-4 text-sm btn-default-form">
                Submit
              </button>

              {/* Cancel */}
              <button onClick={handleCancel} className="ml-2 py-2 px-4 text-sm btn-cancel-form">
                Cancel
              </button>
            </>
            ):(
            <>
              {/* Check Availability */}
              <button 
                type="submit"
                onClick={checkAvailability}
                className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-1">Loading</span>
                  </div>
                ):(
                  'Check Availability'
                )}
              </button>
            </>
            )}            
          </div>
        </>
        )}
  
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          justClose={justClose}
          closePopup={closePopup}
        />
      )}
    </PageComponent>
  )
}