import { useEffect, useState } from "react";
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
            <p className="popup-message">You've entered the wrong date and time.</p>
          </div>
        );
      }else if(responseData === 'invalidDate'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">Start date/time must be today or later.</p>
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
              <p className="popup-message">Facility unavailable on this day.</p>
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
      setFieldMissing(error.response.data.errors);
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
        
        <div className="p-4 ppa-widget">

          {confirmation ? (
            "yes"
          ):(
            "no"
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