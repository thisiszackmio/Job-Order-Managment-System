import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosClient from "../../api/axios";
import Popup from "../../components/popup";

export default function FacilityRequest() {
    // Error sound
    const playErrorSound = () => {
        const audio = new Audio("/sound/error.mp3");

        audio.volume = 1;
        audio.play().catch((error) => {
            console.warn("Unable to play error sound:", error);
        });
    };

    // Mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreen = () => {
        setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
        };

        checkScreen(); // run on load
        window.addEventListener('resize', checkScreen);

        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    // Date
    const today = new Date().toISOString().split('T')[0];

    //Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupMessage, setPopupMessage] = useState("");

    // Function
    const [submitLoading, setSubmitLoading] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const [enableFacility, setEnableFacility] = useState(false);
    const [enableDormitory, setEnableDormitory] = useState(false);

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

            // console.log(responseData);
            if(!mphCheck && !confCheck && !dormCheck && !otherCheck){
                setShowPopup(true);
                setPopupContent("check-error");
                playErrorSound();
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">
                       Please enter the Facility Request Details.
                    </p>
                    </div>
                );
            }else{
                if(responseData === 'invalidDate'){
                    setShowPopup(true);
                    setPopupContent('check-error');
                    playErrorSound();
                    setPopupMessage(
                        <div>
                        <p className="popup-title">Invalid!</p>
                        <p className="popup-message">
                            Start date and time must be today or later.
                        </p>
                        </div>
                    );
                }else if(responseData === 'checkDate'){
                    setShowPopup(true);
                    setPopupContent('check-error');
                    playErrorSound();
                    setPopupMessage(
                        <div>
                        <p className="popup-title">Invalid!</p>
                        <p className="popup-message">
                            You've entered an invalid date and time.
                        </p>
                        </div>
                    );
                }else{
                    if(responseData === "Vacant"){
                        if(mphCheck || confCheck || otherCheck){
                            setEnableFacility(true);
                            setDisableForm(true);
                        }else{
                            alert("Dormitory");
                        }
                    }
                    else if(responseData === "Not Vacant"){
                        alert("Not Vacant")
                    }else{
                        alert("pending approval")
                    }
                }
            }
        })
        .catch((error) => {
            if(error.response && error.response.status === 422){
                const responseErrors = error.response.data.errors || {};
                setShowPopup(true);
                setPopupContent("check-error");
                playErrorSound();
                setPopupMessage(
                    <div>
                        <p className="popup-title">Error</p>
                        <p className="popup-message">
                            {responseErrors.request_office ? 'Please enter the Requesting Office/Division.' : 
                            responseErrors.title_of_activity ? 'Please enter the Title/Purpose of Activity.' :
                            responseErrors.date_start ? 'Please select the Date of Activity (Start).' :
                            responseErrors.time_start ? 'Please select the Time of Activity (Start).' :
                            responseErrors.date_end ? 'Please select the Date of Activity (End).' :
                            responseErrors.time_end ? 'Please select the Time of Activity (End).' :
                                'There something wrong with your request. Please check the form and try again.'
                            }
                        </p>
                    </div>
                );
            }else if(error.response){
                setShowPopup(true);
                setPopupContent('error');
                playErrorSound();
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">
                        An issue occurred. Please contact the developer. <strong>Error code: {error.response.status}</strong>
                    </p>
                    </div>
                );
            }else{
                if(error.request){
                    setShowPopup(true);
                    setPopupContent('error');
                    playErrorSound();
                    setPopupMessage(
                        <div>
                            <p className="popup-title">Network Error</p>
                            <p className="popup-message">Cannot connect to server. Please check your connection or try again later.</p>
                        </div>
                    );
                }
            }
        })
        .finally(() => {
            setSubmitLoading(false);
            // setButtonHide(false);
        });
    }

    // Check Availability
    function SubmitFacilityForm(event){
        alert("Hi");
    }

    // Close Button
    function handleCancel(){
        setEnableFacility(false);
        setDisableForm(false);
    }

    //Close Popup on Success
    const successPopup = () => {
        setSubmitLoading(false);
        setShowPopup(false);
        navigate(`/joms/myrequest#facility`);
    }

    //Close Popup on Error
    const justClose = () => {
        setShowPopup(false);
    }

    return(
    <>
        {/* Form Content */}
        <div className="ppa-widget mt-4">
            <div className="joms-user-info-header">Request for Facility / Venue Form</div>
                {/* Title and Button */}
                <div className="form-header">
                    <div>
                        <div className="form-title-header">
                            Fill up the Form
                        </div>
                        <div className="form-title-description">
                            * - fields that need to be filled out
                        </div>
                    </div>
                    <div>
                        {/* Button */}
                        {disableForm ? (
                        <>
                            <div className="form-btn-align">
                                {/* Check Form */}
                                <button 
                                    onClick={SubmitFacilityForm} 
                                    className="w-full md:w-auto py-1.5 px-4 text-sm btn-secondary">
                                    Submit
                                </button>

                                {/* Cancel */}
                                <button onClick={handleCancel} className="w-full md:w-auto ml-2 py-1.5 px-4 text-sm btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </>
                        ):(
                        <>
                            {/* Check Form */}
                            <button 
                                onClick={checkAvailability} 
                                className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                <div className="flex justify-center">
                                    <span className="ml-1">Checking</span>
                                </div>
                                ):(
                                    'Check Availability'
                                )}
                            </button>
                        </>
                        )}

                    </div>
                </div>
            
                {/* Main Form Fields */}
                <div>
                    <div className="form-container-facility mt-4">
                        <div>
                            {/* Date */}
                            <div className="ppa-form-container">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Date</label>
                                </div>  
                                <div className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                    {formatDate(today)}
                                </div>
                            </div>

                            {/* Requesting Office/Division */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Requesting Office/Division</label>
                                </div>  
                                <input
                                    type="text"
                                    name="rf_request"
                                    id="rf_request"
                                    autoComplete="rf_request"
                                    value={reqOffice}
                                    onChange={ev => setRegOffice(ev.target.value)}
                                    maxLength={255}
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Enter Requesting Office/Division"
                                />
                            </div>

                            {/* Title/Purpose of Activity */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Title/Purpose of Activity</label>
                                </div>  
                                <input
                                    type="text"
                                    name="rep_title"
                                    id="rep_title"
                                    autoComplete="rep_title"
                                    value={titleReq}
                                    onChange={ev => setTitleReq(ev.target.value)}
                                    maxLength={255}
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Enter Title/Purpose of Activity"
                                />
                            </div>

                            {/* Date of Activity (Start) */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Date of Activity (Start)</label>
                                </div>  
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
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Date of Activity"
                                />
                            </div>

                            {/* Time of Activity (Start) */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Time of Activity (Start)</label>
                                </div>  
                                <input
                                    type="time"
                                    name="time_start"
                                    id="time_start"
                                    value={timeStart}
                                    onChange={ev => setTimeStart(ev.target.value)}
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Time of Activity"
                                />
                            </div>

                            {/* Date of Activity (End) */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Date of Activity (End)</label>
                                </div>  
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
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Date of Activity"
                                />
                            </div>

                            {/* Time of Activity (End) */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Time of Activity (End)</label>
                                </div>  
                                <input
                                    type="time"
                                    name="time_end"
                                    id="time_end"
                                    value={timeEnd}
                                    onChange={ev => setTimeEnd(ev.target.value)}
                                    className={`ppa-form-field pro-form-full-width-fac ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                    placeholder="Time of Activity"
                                />
                            </div>

                            {/* Facility */}
                            <div className="ppa-form-container mt-2">
                                <div className={`ppa-form-title pro-title-width-fac ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                    <label>Facility Being Requested</label>
                                </div>
                                {/* Checkbox */}
                                <div className="facility-request-row">
                                    <input
                                        id="mph-checkbox"
                                        type="checkbox"
                                        checked={Boolean(mphCheck)}
                                        onChange={(ev) => {
                                            const isChecked = ev.target.checked;
                                            setMphCheck(isChecked ? 1 : 0);

                                            // Keep your existing reset code here
                                        }}
                                        className="facility-checkbox"
                                    />

                                    <label
                                        htmlFor="mph-checkbox"
                                        className="facility-request-label"
                                    >
                                        Multi-Purpose Hall (MPH)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>


                    {enableFacility && (
                    <div className="form-alignment mt-4">
                        <div className="divider"></div>
                        {/* Caption */}
                        <div>
                            <h2 className="fac-form-caption mt-3"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
                        </div>

                    </div>
                    )}
                </div>
                
        </div>

        {/* Popup */}
        <Popup
            show={showPopup}
            popupContent={popupContent}
            popupMessage={popupMessage}
            onSuccess={successPopup}
            onClose={justClose}
        />
    </>
    );
}