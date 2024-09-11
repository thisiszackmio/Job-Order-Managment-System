import React, { useEffect, useState } from "react";
import submitAnimation from '../../../assets/loading_nobg.gif';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";

export default function FacilityVenueForm(){
  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Popup
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const popupClass = 'popup-show';
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else if(loading) {
      addLoadingClass();
    }
    else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
      removeLoadingClass();
    };
  }, [showPopup, loading]);

  const today = new Date().toISOString().split('T')[0];
  const [DateEndMin, setDateEndMin] = useState(today);

  const [fieldMissing, setFieldMissing] = useState({});
  const [checkFacility, setCheckFacility] = useState(false);
  const [enableFacility, setEnableFacility] = useState(false);
  const [enableDormitory, setEnableDormitory] = useState(false);
  const [disableForm, setDisableForm] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

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

  const [oprInstruct, setOprInstruct] = useState('');

  const [inputErrors, setInputErrors] = useState({});

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

  // Dormitory
  const [maleList, setMaleList] = useState('');
  const [getMaleList, setGetMaleList] = useState('');
  const [femaleList, setFemaleList] = useState('');
  const [getFemaleList, setGetFemaleList] = useState('');
  const [otherDetails, setOtherDetails] = useState('');

  const generateNumberedText = (lines) => {
    return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  };

  //Count Male Guest
  const countMaleList = (text) => {
    const lines = text.split('\n');
    setGetMaleList(generateNumberedText(lines));
  };

  const handleMaleTextChange = (e) => {
    const newText = e.target.value;
    setMaleList(newText);
    countMaleList(newText);

    if (newText.trim() === '') {
      setGetMaleList('');
    }
  };

  //Count Female Guest
  const countFemaleList = (text) => {
    const lines = text.split('\n');
    setGetFemaleList(generateNumberedText(lines));
  };

  const handleFemaleTextChange = (e) => {
    const newText = e.target.value;
    setFemaleList(newText);
    countFemaleList(newText);

    if (newText.trim() === '') {
      setGetFemaleList('');
    }
  };

  // Check Availability
  const checkAvailability = (event) => {
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

      // If the result us vacant
      if(responseData === "Vacant"){
        if(mphCheck || confCheck || otherCheck){
          setEnableFacility(true);
          setDisableForm(true);
        } else {
          setEnableDormitory(true);
          setDisableForm(true);
        }
      }
      else{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Sorry</p>
            <p className="popup-message">The venue is not yet available.</p>
          </div>
        );
      }
      
    })
    .catch((error)=>{
      // alert(error.response.data.error);
      if(error.response.data.error == "facility"){
        setCheckFacility(true);
      } 
      else if(error.response.data.error == "invalidDate"){
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">The date you entered is invalid.</p>
          </div>
        );
        setShowPopup(true);
      }
      else if(error.response.data.error == "checkDate"){
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">The date you entered is invalid. Please check the Date of Activity (End) and Time of Activity (End).</p>
          </div>
        );
        setShowPopup(true);
      }
      else {
        const responseErrors = error.response.data.errors;
        setFieldMissing(responseErrors);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

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

  // Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");

  // Submit the form
  const SubmitFacilityForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    const remark = Admin ? "The Admin Manager has approved this request." : "Waiting for admin manager's approval.";

    const data = {
      user_id: currentUserId.id,
      user_name: currentUserId.name,
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
      name_male: getMaleList ? getMaleList : null,
      name_female: getFemaleList ? getFemaleList : null,
      other_details: otherDetails ? otherDetails: null,
      admin_approval: Admin ? 1 : 3,
      obr_instruct: Admin ? oprInstruct : null,
      date_approve: Admin ? today : null,
      remarks: remark,
      //Notifications
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      joms_type: "Facility / Venue Request Form",
      notif_status: 2,
    };

    if(enableFacility){
      if(checkedCount <= 0){
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Wait Wait Wait!</p>
            <p className="popup-message">You didn't select any of the checkboxes.</p>
          </div>
        );
        setSubmitLoading(false);
      }else{
        axiosClient
        .post('/submitfacrequest', data)
        .then(() => {
          setShowPopup(true);
          setPopupContent('success');
          setPopupMessage(
            <div>
              <p className="popup-title">Submission Complete!</p>
              <p className="popup-message">Form submitted successfully. Please wait for the admin manager's approval.</p>
            </div>
          );
        })
        .catch(()=>{
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        })
        .finally(() => {
          setSubmitLoading(false);
        });
      }
    }else{
      if(maleList || femaleList ){
        axiosClient
        .post('/submitfacrequest', data)
        .then(() => {
          setShowPopup(true);
          setPopupContent('success');
          setPopupMessage(
            <div>
              <p className="popup-title">Submission Complete!</p>
              <p className="popup-message">Form submitted successfully. Please wait for the admin manager's approval.</p>
            </div>
          );
        })
        .catch(()=>{
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        })
        .finally(() => {
          setSubmitLoading(false);
        });
      }else{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Wait Wait Wait!</p>
            <p className="popup-message">Please enter the details of the guest.</p>
          </div>
        );
        setSubmitLoading(false);
      }
    }    

  }

  // Close Button
  function handleCancel(){
    setDisableForm(false);
    setEnableFacility(false);
    setEnableDormitory(false);
  }

  // Popup Button Function
  //Close Popup on Error
  function justclose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.href = '/joms/myrequest';
  }

  return(
    <PageComponent title="Request Form">

      {/* Form Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Facility / Venue Request Form </div>

        <div className="p-4">

          <form id="fac_submit" onSubmit={SubmitFacilityForm}>

            {/* Title */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
              <p className="text-xs font-bold text-red-500">Please double check the form before submitting</p>
            </div>

            {/* Forms */}
            <div className="grid grid-cols-2">

              {/* Left Side (Details) */}
              <div className="col-span-1">

                {/* Date */}
                <div className="flex items-center mt-6 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black">
                      Date:
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="date"
                      name="rep_date"
                      id="rep_date"
                      defaultValue= {today}
                      className="block w-full ppa-form"
                      readOnly
                    />
                  </div>
                </div>

                {/* Requesting Office/Division */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rf_request" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!reqOffice && fieldMissing.request_office && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Title/Purpose of Activity */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_title" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!titleReq && fieldMissing.title_of_activity && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Date Start */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!DateStart && fieldMissing.date_start && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Time Start */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!timeStart && fieldMissing.time_start && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Date End */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!DateEnd && fieldMissing.date_end && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Time End */}
                <div className="flex items-center mt-4 font-roboto">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black">
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
                      className={`block w-full ppa-form ${disableForm ? '' : 'disable-ppa-form'}`}
                      readOnly={disableForm}
                    />
                    {!timeEnd && fieldMissing.time_end && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Checkbox */}
              <div className="col-span-1">

                <div className="mt-6 font-roboto">
                  <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                    Facilities / Venue being Requested :
                  </label> 
                </div>

                <div className="space-y-4 mt-6">

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
                          className={`focus:ring-gray-400 h-6 w-6 ${mphCheck ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                          disabled={disableForm}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          Multi-Purpose Hall (MPH)
                        </label> 
                      </div>
                    </div>

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
                          className={`focus:ring-gray-400 h-6 w-6 ${confCheck ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                          disabled={disableForm}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          Conference Hall
                        </label> 
                      </div>
                    </div>

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
                          className={`focus:ring-gray-400 h-6 w-6 ${dormCheck ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
                          disabled={disableForm}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          Dormitory
                        </label> 
                      </div>
                    </div>

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
                          className={`focus:ring-gray-400 h-6 w-6 ${otherCheck ? 'text-gray-400' : 'text-indigo-600'} border-black-500 rounded`}
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
                {(!mphCheck && !confCheck && !dormCheck && !otherCheck && checkFacility) && (
                  <p className="font-roboto form-validation mt-2">Don't forget this field!</p>
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
                        value={maleList}
                        onChange={handleMaleTextChange}
                        style={{ resize: 'none' }}
                        className="block w-10/12 ppa-form"
                      />
                      <p className="text-red-500 text-xs mt-1">Separate name on next line</p>

                      {/* For displaying the number of guest */}
                      <div>
                        <textarea
                          id="output-male-list"
                          name="output-male-list"
                          rows={5}
                          value={getMaleList}
                          style={{ resize: 'none', display: 'none' }}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Female */}
                  <div className="col-span-1">
                    <div className="mt-6">

                      <div className="mb-4">
                        <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Input name of female guests:</strong> </label>
                      </div>

                      {/* Show on the Form */}
                      <textarea
                        id="dorm-female-list"
                        name="dorm-female-list"
                        rows={5}
                        value={femaleList}
                        onChange={handleFemaleTextChange}
                        style={{ resize: 'none' }}
                        className="block w-10/12 ppa-form"
                      />
                      <p className="text-red-500 text-xs mt-1">Separate name on next line</p>

                      {/* For displaying the number of guest */}
                      <div>
                        <textarea
                          id="output-female-list"
                          name="output-female-list"
                          rows={5}
                          value={getFemaleList}
                          style={{ resize: 'none', display: 'none' }}
                        />
                      </div>

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
                    />
                  </div>
                </div>
              </div>
            )}


          </form>

          {/* Button */}
          <div className="mt-10">
            {/* Check Availability */}
            {!disableForm ? (
              // Check Availability
              <button 
                type="submit"
                onClick={checkAvailability}
                className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Loading</span>
                  </div>
                ):(
                  'Check Availability'
                )}
              </button>
            ):(
            <>
              {/* Submit */}
              <button 
                form="fac_submit"
                type="submit"
                className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Loading</span>
                  </div>
                ):(
                  'Submit'
                )}
              </button>
              
              {/* Delete Account User */}
              {!submitLoading && (
                <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                  Cancel
                </button>
              )}
            </>
            )}
          </div>

        </div>

      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay with blur effect */}
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
          {/* Popup content */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
            {/* Notification Icons */}
            <div className="f-modal-alert">

              {/* Error */}
              {popupContent == 'error' && (
                <div className="f-modal-icon f-modal-error animate">
                  <span className="f-modal-x-mark">
                    <span className="f-modal-line f-modal-left animateXLeft"></span>
                    <span className="f-modal-line f-modal-right animateXRight"></span>
                  </span>
                </div>
              )}

              {/* Success */}
              {popupContent == 'success' && (
                <div class="f-modal-icon f-modal-success animate">
                  <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                  <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                </div>
              )}

            </div>
            {/* Popup Message */}
            <p className="text-lg text-center"> {popupMessage} </p>
            {/* Buttons */}
            <div className="flex justify-center mt-4">
              {/* Error Button */}
              {popupContent == 'error' && (
                <button onClick={justclose} className="w-full py-2 btn-cancel">
                  Close
                </button>
              )}

              {/* Success */}
              {popupContent == 'success' && (
                <button onClick={closePopup} className="w-full py-2 btn-default">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </PageComponent>
  );
}