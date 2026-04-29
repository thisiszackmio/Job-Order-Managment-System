import { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";
import { useNavigate } from "react-router-dom";

export default function FacilityVenueForm(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

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
  const SuperHacker = codes.includes("HACK");
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
            <p className="popup-message">You've entered an invalid date and time.</p>
          </div>
        );
      }else if(responseData === 'invalidDate'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">Start date and time must be today or later.</p>
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
              <p className="popup-title">Sorry</p>
              <p className="popup-message">
                {mphCheck ? ('Multipurpose Hall is unavailable on that day.'):null}
                {confCheck ? ('Conference Hall is unavailable on that day.'):null}
                {dormCheck ? ('Dormitory is unavailable on that day.'):null}
              </p>
            </div>
          );
        }else if(responseData === "facility"){
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Error</p>
              <p className="popup-message">Please enter on Facilities/Venue being Requested.</p>
            </div>
          );
        }else{
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">Pending for Approval</p>
              <p className="popup-message">Sorry, that schedule is pending approval by another requestor.</p>
            </div>
          );
        }
      }
    })
    .catch((error) => {
      const responseErrors = error.response.data.errors;
      setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.request_office ? "Please enter on Request Office/Division" : 
               responseErrors.title_of_activity ? "Please enter on Title/Purpose of Activity" :  
               responseErrors.date_start ? "Please enter on Date Start" :
               responseErrors.time_start ? "Please enter on Time Start" :
               responseErrors.date_end ? "Please enter on Date End" :
               responseErrors.time_end ? "Please enter on Time End" :
               (!mphCheck && !confCheck && !dormCheck && !otherCheck && checkFacility) ? "Please enter on Facilities/Venue being Requested" :  "There is something wrong"}
            </p>
          </div>
        );
        setShowPopup(true);
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
          <p className="popup-title">Invalid</p>
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
              <p className="popup-message">No checkbox selected. Please choose one.</p>
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
              <p className="popup-message">Please enter the guest’s details.</p>
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
            <p className="popup-message">Your form has been submitted.</p>
          ):(
            <p className="popup-message">Your form has been submitted. Please wait for the admin manager’s approval.</p>
          )}
        </div>
      );
    })
    .catch((error)=>{
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

    setGetMale('');
    setGetFemale('');
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
    navigate(`/joms/myrequest#facility`);
  }

  return(
    <PageComponent title="Request Form">
      
      {/* Form Content */}
      <div className="ppa-widget px-4 pb-10 mt-8">
        <div className="joms-user-info-header text-left"> Request for Facility / Venue Form </div>

        {/* Form Area */}
        <div className="form-container">
          {/* Title and Button */}
          <div className="flex justify-between items-center"> 
            {/* Title */}
            <div className="px-2">
              {disableForm ? (
                confirmation ? (
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
                )
              ):(
              <>
                <h2 className="text-base font-bold leading-7 text-gray-900"> 
                  Fill out the first form
                </h2>
                <p className="text-xs font-bold text-red-500">
                  * - fields that need to be filled out
                </p>
              </>
              )}
            </div>
            {/* Button */}
            <div className="px-2 pb-4 flex justify-start">
              {disableForm ? (
                confirmation ? (
                <>
                  {/* Submit */}
                  <button 
                    onClick={SubmitFacilityForm} 
                    type="submit"
                    className={`w-full md:w-auto py-1.5 px-4 text-base ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justif-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Loading</span>
                      </div>
                    ):(
                      'Confirm'
                    )}  
                  </button>

                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => setConfirmation(false)} className="w-full md:w-auto ml-2 py-1.5 px-4 text-base btn-cancel">
                      Revise
                    </button>
                  )}
                </>
                ):(
                <>
                  {/* Check Form */}
                  <button 
                    onClick={handleConfirm} 
                    className="w-full md:w-auto py-1.5 px-4 text-base btn-secondary">
                    Submit
                  </button>

                  {/* Cancel */}
                  <button onClick={handleCancel} className="w-full md:w-auto ml-2 py-1.5 px-4 text-base btn-cancel">
                    Cancel
                  </button>
                </>
                )
              ):(
              <>
                {/* Check Availability */}
                <button 
                  type="submit"
                  onClick={checkAvailability}
                  className={`w-full md:w-auto py-1.5 px-4 text-base ${ submitLoading ? 'btn-process' : 'btn-primary' }`}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <div className="flex justify-center">
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
          </div>

          {/* Date */}
          <div className="flex items-center mt-6">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Date
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                <div className="block w-full ppa-form-confirm h-[40px]">
                  {formatDate(today)}
                </div>
              )}
            </div>
          </div>

          {/* Requesting Office/Division */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Requesting Office/Division
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation? (
                  <input
                    type="text"
                    name="rf_request"
                    id="rf_request"
                    autoComplete="rf_request"
                    value={reqOffice}
                    onChange={ev => setRegOffice(ev.target.value)}
                    className="block w-full focus:ring-0 ppa-form-field"
                    maxLength={255}
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {reqOffice}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Title/Purpose of Activity */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Title/Purpose of Activity
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation ? (
                  <input
                    type="text"
                    name="rep_title"
                    id="rep_title"
                    autoComplete="rep_title"
                    value={titleReq}
                    onChange={ev => setTitleReq(ev.target.value)}
                    className="block w-full focus:ring-0 ppa-form-field"
                    maxLength={255}
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {titleReq}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Date of Activity (Start) */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Date of Activity (Start)
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation ? (
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
                    className="block w-full focus:ring-0 ppa-form-field"
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {formatDate(DateStart)}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Time of Activity (Start) */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Time of Activity (Start)
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation ? (
                  <input
                    type="time"
                    name="time_start"
                    id="time_start"
                    value={timeStart}
                    onChange={ev => setTimeStart(ev.target.value)}
                    min={today}
                    className="block w-full focus:ring-0 ppa-form-field"
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {formatTime(timeStart)}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Date of Activity (End) */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Date of Activity (End)
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation ? (
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
                    className="block w-full focus:ring-0 ppa-form-field"
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {formatDate(DateEnd)}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Time of Activity (End) */}
          <div className="flex items-center mt-2">
            <div className="w-56 form-title">
              <label htmlFor="rep_date"> 
                Time of Activity (End)
              </label> 
            </div>
            <div className="w-1/2">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
                !confirmation ? (
                  <input
                    type="time"
                    name="time_end"
                    id="time_end"
                    value={timeEnd}
                    onChange={ev => setTimeEnd(ev.target.value)}
                    className="block w-full focus:ring-0 ppa-form-field"
                    disabled={disableForm}
                  />
                ):(
                  <div className="w-full ppa-form-confirm h-[40px]">
                    {formatTime(timeEnd)}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center mt-2">
            <div className="w-80 form-title">
              <label htmlFor="rep_date"> 
                Facilities / Venue being Requested
              </label> 
            </div>
            <div className="w-3/4">
              {loading ? (
                <div className="skeleton-form"></div>
              ):(
              <div className="flex">

                {/* For MPH */}
                <div className="relative flex items-center">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${!mphCheck ? '' : 'checked'}`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="border-t border-b form-title-choose">
                    <label htmlFor="rf_request">
                      Multi-Purpose Hall (MPH)
                    </label> 
                  </div>
                </div>

                {/* Conference Hall */}
                <div className="relative flex items-center">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${!confCheck ? '' : 'checked'}`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="border-t border-b form-title-choose">
                    <label htmlFor="rf_request">
                      Conference Hall
                    </label> 
                  </div>
                </div>

                {/* Dormitory */}
                <div className="relative flex items-center">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${!dormCheck ? '' : 'checked'}`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="border-t border-b form-title-choose">
                    <label htmlFor="rf_request">
                      Dormitory
                    </label> 
                  </div>
                </div>

                {/* Other */}
                <div className="relative flex items-center">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${!otherCheck ? '' : 'checked'}`}
                      disabled={disableForm}
                    />
                  </div>
                  <div className="border-t border-b border-r form-title-choose">
                    <label htmlFor="rf_request">
                      Other
                    </label> 
                  </div>
                </div>

              </div>
              )}
            </div>
          </div>

          {/* For MPH / Conference Room / Others */}
          {enableFacility && (
          <div className="mt-8 border-t border-black">
            {/* Caption */}
            <div>
              <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
            </div>

            {/* Check Boxes */}
            <div className="w-3/5 grid grid-cols-2 mt-4">
              {/* 1st Column */}
              <div className="col-span-1">
                {/* Table */}
                <div className="relative flex items-center mt-2">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkTable ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${checkTable ? '' : 'border-r'}`}>
                    <label htmlFor="rf_request">
                      Table
                    </label> 
                  </div>
                  {checkTable && (
                    <div className="flex items-center">
                      {!confirmation ? (
                        <input
                          type="number"
                          name="no-of-table"
                          id="no-of-table"
                          value={NoOfTable}
                          onChange={handleInputTableChange}
                          className="focus:ring-0 check-field"
                          placeholder={confirmation ? NoOfTable ? NoOfTable : "" : "No. of table"}
                          disabled={confirmation}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {NoOfTable}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Chair */}
                <div className="relative flex items-center mt-2">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkChairs ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${checkChairs ? '' : 'border-r'}`}>
                    <label htmlFor="rf_request">
                      Chair
                    </label> 
                  </div>
                  {checkChairs && (
                    <div className="flex items-center">
                      {!confirmation ? (
                        <input
                          type="number"
                          name="no-of-chair"
                          id="no-of-chair"
                          value={NoOfChairs}
                          onChange={handleInputChairChange}
                          className="focus:ring-0 check-field"
                          placeholder={confirmation ? NoOfChairs ? NoOfChairs : "" : "No. of chairs"}
                          disabled={confirmation}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {NoOfChairs}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Projector */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkProjector}
                      onChange={ev => setCheckProjector(!checkProjector)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkProjector ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Projector
                    </label> 
                  </div>
                </div>

                {/* Projector Screen */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkProjectorScreen}
                      onChange={ev => setCheckProjectorScreen(!checkProjectorScreen)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkProjectorScreen ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Projector Screen
                    </label> 
                  </div>
                </div>

                {/* Document Camera */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkDocumentCamera}
                      onChange={ev => setCheckDocumentCamera(!checkDocumentCamera)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkDocumentCamera ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Document Camera
                    </label> 
                  </div>
                </div>
              </div>

              {/* 2nd Column */}
              <div className="col-span-1">
                {/* Laptop */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkLaptop}
                      onChange={ev => setCheckLaptop(!checkLaptop)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkLaptop ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Laptop
                    </label> 
                  </div>
                </div>

                {/* Television */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkTelevision}
                      onChange={ev => setCheckTelevision(!checkTelevision)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkTelevision ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Television
                    </label> 
                  </div>
                </div>

                {/* Sound System */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkSoundSystem}
                      onChange={ev => setCheckSoundSystem(!checkSoundSystem)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkSoundSystem ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Sound System
                    </label> 
                  </div>
                </div>

                {/* Videoke */}
                <div className="relative flex items-center mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="other-checkbox"
                      type="checkbox"
                      checked={checkVideoke}
                      onChange={ev => setCheckVideoke(!checkVideoke)}
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkVideoke ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                    <label htmlFor="rf_request">
                      Videoke
                    </label> 
                  </div>
                </div>

                {/* Microphone */}
                <div className="relative flex items-center mt-2">
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
                      className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkMicrphone ? 'checked' : ''}`}
                      disabled={confirmation}
                    />
                  </div>
                  <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${checkMicrphone ? '' : 'border-r'}`}>
                    <label htmlFor="rf_request">
                      Microphone
                    </label> 
                  </div>
                  {checkMicrphone && (
                    <div className="flex items-center">
                      {!confirmation ? (
                        <input
                          type="number"
                          name="no-of-microphone"
                          id="no-of-microphone"
                          value={NoOfMicrophone}
                          onChange={handleInputMicrophoneChange}
                          className="focus:ring-0 check-field"
                          placeholder={confirmation ? NoOfMicrophone ? NoOfMicrophone : "" : "No. of microphone"}
                          disabled={confirmation}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {NoOfMicrophone}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Others */}
            <div className="relative flex items-center mt-2 w-3/5">
              {/* Checkbox */}
              <input
                id="mph-checkmicrophone"
                name="mph-checkmicrophone"
                type="checkbox"
                checked={checkOther}
                onChange={() => setCheckOther(!checkOther)}
                className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkOther ? 'checked' : ''}`}
                disabled={confirmation}
              />
              {/* Label */}
              <div className={`w-1/5 h-[40px] form-title-choose border-t border-b ${checkOther ? '' : 'border-r'}`}>
                <label htmlFor="mph-checkmicrophone">Others</label>
              </div>
              {checkOther && (
                !confirmation ? (
                  <input
                    type="text"
                    name="other-specfic"
                    id="other-specfic"
                    placeholder={confirmation ? OtherField ? OtherField : "" : "Please Specify"}
                    value={OtherField}
                    onChange={ev => setOtherField(ev.target.value)}
                    className="flex-1 h-[40px] focus:ring-0 check-field border"
                    disabled={confirmation}
                  />
                ):(
                  <div className="ppa-form-confirm h-[40px]">
                    {OtherField}
                  </div>
                )
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

            {/* Form */}
            <div className="w-3/4 grid grid-cols-2 mt-4 gap-6">

              {/* Male */}
              <div className="col-span-1">
                <div className="mt-2">

                  <div className="form-title-dorm">
                    <label htmlFor="male_guest"> Input name of male guests </label>
                  </div>
                  {confirmation ? (
                    getMale?.trim() ? (
                      getMale.split("\n").map((name, index) => (
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
                  ):(
                  <>
                    {/* Show on the Form */}
                    <textarea
                      id="dorm-male-list"
                      name="dorm-male-list"
                      rows={5}
                      value={getMale}
                      onChange={ev => setGetMale(ev.target.value)}
                      style={{ resize: 'none' }}
                      className="block w-full focus:ring-0 ppa-form-field-dorm"
                    />
                    <p className="text-red-500 text-xs">Do not include number brackets in this form</p>
                  </>
                  )}
                </div>
              </div>

              {/* Female */}
              <div className="col-span-1">
                <div className="mt-2">

                  <div className="form-title-dorm">
                    <label htmlFor="male_guest"> Input name of female guests </label>
                  </div>
                  {confirmation ? (
                    getFemale?.trim() ? (
                      getFemale.split("\n").map((name, index) => (
                        <div key={index} className="mt-2 flex ppa-list-form">
                          <span className="numbering">{`${index + 1}.`}</span>
                          <div className="naming">
                            {name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mt-2 text-gray-500 italic">No Female Guest</div>
                    )
                  ):(
                  <>
                    {/* Show on the Form */}
                    <textarea
                      id="dorm-male-list"
                      name="dorm-male-list"
                      rows={5}
                      value={getFemale}
                      onChange={ev => setGetFemale(ev.target.value)}
                      style={{ resize: 'none' }}
                      className="block w-full focus:ring-0 ppa-form-field-dorm"
                    />
                    <p className="text-red-500 text-xs">Do not include number brackets in this form</p>
                  </>
                  )}
                </div>
              </div>

            </div>

            {/* For Other */}
            <div className="mt-6">
              <div className="w-40 form-title-dorm">
                <label htmlFor="recomendations">
                  Other Details
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
                  className="block w-full focus:ring-0 ppa-form-field-dorm"
                  disabled={confirmation}
                />
                {!confirmation && (
                  <p className="text-red-500 text-xs">Leave blank if none</p>
                )}
              </div>  
            </div>

          </div>
          )}

          {/* For OPR Instruction */}
          {(enableDormitory || enableFacility) && Admin && (
          <div className="mt-8 border-t border-black">

            {/* Caption */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900 mt-5"> * OPR Instruction </h2>
            </div>

            <div className="flex items-center mt-2">
              <div className="w-3/4">
                <textarea
                  id="recomendations"
                  name="recomendations"
                  rows={3}
                  style={{ resize: "none" }}
                  value={oprInstruct}
                  onChange={ev => setOprInstruct(ev.target.value)}
                  className="block w-full focus:ring-0 ppa-list-form"
                  placeholder="Input here"
                  maxLength={255}
                  disabled={confirmation}
                />
              </div>
            </div>

          </div>
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