import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FacilityRequest() {
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

    // Function
    const [submitLoading, setSubmitLoading] = useState(false);
    const [disableForm, setDisableForm] = useState(false);

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
        alert("Check Availability")   
    }

    // Check Availability
    function SubmitFacilityForm(event){
        alert("Hi");
    }

    // Close Button
    function handleCancel(){
        alert("Cancel")
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
                        </>
                        ):(
                        <>
                            {/* Check Form */}
                            <button 
                                onClick={checkAvailability} 
                                className="w-full md:w-auto py-1.5 px-4 text-sm btn-secondary"
                            >
                                Check Availability
                            </button>
                        </>
                        )}

                    </div>
                </div>
            
                {/* Main Form Fields */}
                <div className="form-container mt-4">
                    {/* 1st Column */}
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
                    </div>

                    {/* 2nd Column */}
                    <div>
                        {/* Date */}
                        <div>
                            <div className={`ppa-form-title pro-title-width-fac-check ${isMobile ? 'border-form-title-mobile' : 'border-form-title-full'}`}>
                                <label>Facilities / Venue being Requested:</label>
                            </div>  
                            {/* Check Area */}
                            <div className="mt-3">
                                {/* For MPH */}
                                <div className="facility-options">
                                    <div>
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
                                            className={`checkbox-input`}
                                        />
                                    </div>
                                    <div className="facility-options">
                                        <label htmlFor="rf_request" className="form-title-check">
                                        Multi-Purpose Hall (MPH)
                                        </label> 
                                    </div>
                                </div>

                                {/* For Conference Hall */}
                                <div className="facility-options">
                                    <div>
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
                                            className={`checkbox-input`}
                                        />
                                    </div>
                                    <div className="facility-options">
                                        <label htmlFor="rf_request" className="form-title-check">
                                        Conference Hall
                                        </label> 
                                    </div>
                                </div>

                                {/* For Dormitory */}
                                <div className="facility-options">
                                    <div>
                                        <input
                                            id="dormitory-checkbox"
                                            type="checkbox"
                                            checked={dormCheck}
                                            onChange={(ev) => {
                                                const isChecked = ev.target.checked ? 1 : 0;
                                                handleCheckboxChange(setDormCheck, ev.target.checked, setOtherCheck, setMphCheck, setConfCheck);
                                                setDormCheck(isChecked);
                                            }}
                                            className={`checkbox-input`}
                                        />
                                    </div>
                                    <div className="facility-options">
                                        <label htmlFor="rf_request" className="form-title-check">
                                            Dormitory
                                        </label> 
                                    </div>
                                </div>

                                {/* For Other */}
                                <div className="facility-options">
                                    <div>
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
                                            className={`checkbox-input`}
                                        />
                                    </div>
                                    <div className="facility-options">
                                        <label htmlFor="rf_request" className="form-title-check">
                                            Other
                                        </label> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </>
    );
}