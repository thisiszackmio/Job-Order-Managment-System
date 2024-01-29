import React from "react";
import PageComponent from "../components/PageComponent";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';

export default function PrePostRepairForm(){

  const { currentUser } = useUserStateContext();

  const closePopup = () => {
    fetchMPHForm();
    fetchConferenceForm();
    fetchDormForm();
    setIsLoading(true);
    fetchFacilityForm();
    setShowPopup(false);
  };

  //Set Errors
  const [MPHErrors, setMPHErrors] = useState({});
  const [ConferenceErrors, setConferenceErrors] = useState({});

  //Date Format 
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Date Format Short Like (Jan 1, 1970)
  function formatDateS(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(timeString) {
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

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const {id} = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [displayRequestFacility, setDisplayRequestFacility] = useState([]);
  const [displayMPHFacility, setDisplayMPHFacility] = useState([]);
  const [displayConferenceFacility, setDisplayConferenceFacility] = useState([]);
  const [displayDormFacility, setDisplayDormFacility] = useState([]);

  //Fields for MPH
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

  //Fields for Conference
  const [checkConferenceTable, setCheckConferenceTable] = useState(false);
  const [checkConferenceChairs, setCheckConferenceChairs] = useState(false);
  const [checkConferenceProjector, setCheckConferenceProjector] = useState(false);
  const [checkConferenceProjectorScreen, setCheckConferenceProjectorScreen] = useState(false);
  const [checkConferenceDocumentCamera, setCheckConferenceDocumentCamera] = useState(false);
  const [checkConferenceLaptop, setConferenceCheckLaptop] = useState(false);
  const [checkConferenceTelevision, setCheckConferenceTelevision] = useState(false);
  const [checkConferenceSoundSystem, setCheckConferenceSoundSystem] = useState(false);
  const [checkConferenceVideoke, setCheckConferenceVideoke] = useState(false);
  const [checkConferenceMicrphone, setCheckConferenceMicrphone] = useState(false);
  const [checkConferenceOther, setCheckConferenceOther] = useState(false);
  const [conferenceNoOfTable, setConferenceNoOfTable] = useState('');
  const [conferenceNoOfChairs, setConferenceNoOfChairs] = useState('');
  const [conferenceNoOfMicrophone, setConferenceNoOfMicrophone] = useState('');
  const [conferenceOtherField, setConferenceOtherField] = useState('');

  //For Dormitory
  const [malelineCount, setMaleLineCount] = useState(0);
  const [femalelineCount, setFemaleLineCount] = useState(0);

  const [maleList, setMaleList] = useState('');
  const [getMaleList, setGetMaleList] = useState('');
  const [femaleList, setFemaleList] = useState('');
  const [getFemaleList, setGetFemaleList] = useState('');

  const [DormOtherField, setDormOtherField]= useState('');

  //Other
  const [OprInstruct, setOprInstruct] = useState('');
  const [OprAction, setOprAction] = useState('');
  

  //Show Part A
  const fetchFacilityForm = () => {
    axiosClient
    .get(`/facilityformrequest/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewFacilityData = responseData.main_form;
        const requestor = responseData.requestor;
        const manager = responseData.manager;

        setDisplayRequestFacility({
          viewFacilityData: viewFacilityData,
          requestor:requestor,
          manager:manager
        });

        setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  //Show MPH Form
  const fetchMPHForm = () => {

    setIsLoading(true);

    axiosClient
    .get(`/facilitymphrequest/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewMPHFacilityData = responseData.mph_form;

        setDisplayMPHFacility({
          viewMPHFacilityData: viewMPHFacilityData
        });

        setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  //Show Conference Form
  const fetchConferenceForm = () => {

    setIsLoading(true);

    axiosClient
    .get(`/getconferencefacilityform/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewConferenceFacilityData = responseData.conference_form;

        setDisplayConferenceFacility({
          viewConferenceFacilityData: viewConferenceFacilityData
        });

        setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  //Show Dorm Form
  const fetchDormForm = () => {

    setIsLoading(true);

    axiosClient
    .get(`/getdormfacilityform/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewDormFacilityData = responseData.dorm_form;

        const maleNamesString = responseData.dorm_form.name_male;
        const maleNamesArray = maleNamesString.split('\n');

        const femaleNamesString = responseData.dorm_form.name_female;
        const femaleNamesArray = femaleNamesString.split('\n');

        setDisplayDormFacility({
          viewDormFacilityData: viewDormFacilityData,
          maleNamesArray: maleNamesArray,
          femaleNamesArray: femaleNamesArray,
          femaleNamesString:femaleNamesString,
          maleNamesString:maleNamesString
        });

        setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchFacilityForm();
    fetchMPHForm();
    fetchConferenceForm();
    fetchDormForm();
  },[id]);

  //For MPH
  const [checkedCountMPH, setCheckedCountMPH] = useState(0);

  useEffect(()=>{
    const totalCheckedMPH = [
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
    setCheckedCountMPH(totalCheckedMPH);
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

  //For Conference Room
  const [checkedCountConference, setCheckedCountConference] = useState(0);

  useEffect(()=>{
    const totalCheckedConference = [
      checkConferenceTable, 
      checkConferenceChairs,
      checkConferenceProjector,
      checkConferenceProjectorScreen,
      checkConferenceDocumentCamera,
      checkConferenceLaptop,
      checkConferenceTelevision,
      checkConferenceSoundSystem,
      checkConferenceVideoke,
      checkConferenceMicrphone,
      checkConferenceOther
    ].filter(Boolean).length;
    setCheckedCountConference(totalCheckedConference);
  },[checkConferenceTable, 
    checkConferenceChairs,
    checkConferenceProjector,
    checkConferenceProjectorScreen,
    checkConferenceDocumentCamera,
    checkConferenceLaptop,
    checkConferenceTelevision,
    checkConferenceSoundSystem,
    checkConferenceVideoke,
    checkConferenceMicrphone,
    checkConferenceOther]);

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

  const handleInputTableConferenceChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setConferenceNoOfTable(inputValue);
  };

  const handleInputChairConferenceChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setConferenceNoOfChairs(inputValue);
  };

  const handleInputMicrophoneConferenceChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setConferenceNoOfMicrophone(inputValue);
  };

  const generateNumberedText = (lines) => {
    return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  };

  const countMaleList = (text) => {
    const lines = text.split('\n');
    const newLineCount = lines.length;
    setMaleLineCount(newLineCount);
    setGetMaleList(generateNumberedText(lines));
  };

  const countFemaleList = (text) => {
    const lines = text.split('\n');
    const newLineCount = lines.length;
    setFemaleLineCount(newLineCount);
    setGetFemaleList(generateNumberedText(lines));
  };

  const handleMaleTextChange = (e) => {
    const newText = e.target.value;
    setMaleList(newText);
    countMaleList(newText);
  };

  const handleFemaleTextChange = (e) => {
    const newText = e.target.value;
    setFemaleList(newText);
    countFemaleList(newText);
  };

  const SubmitMPHForm = (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient.post(`/mphfacilityform/${id}`,{
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
      videoke: checkVideoke
    })
    .then((response) => {
      setPopupMessage('Submit Successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      //console.error(error);
      const responseErrors = error.response.data.errors;
      setMPHErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  const SubmitConferenceForm = (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient.post(`/conferencefacilityform/${id}`,{
      table: checkConferenceTable,
      no_table: conferenceNoOfTable,
      chair: checkConferenceChairs,
      no_chair: conferenceNoOfChairs,
      microphone: checkConferenceMicrphone,
      no_microphone: conferenceNoOfMicrophone,
      others: checkConferenceOther,
      specify: conferenceOtherField,
      projector: checkConferenceProjector,
      projector_screen: checkConferenceProjectorScreen,
      document_camera: checkConferenceDocumentCamera,
      laptop: checkConferenceLaptop,
      television: checkConferenceTelevision,
      sound_system: checkConferenceSoundSystem,
      videoke: checkConferenceVideoke
    })
    .then((response) => {
      setPopupMessage('Submit Successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      const responseErrors = error.response.data.errors;
      setConferenceErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  const SubmitDormForm = (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient.post(`/dormfacilityform/${id}`, {
      name_male: getMaleList,
      name_female: getFemaleList,
      other_details: DormOtherField
    })
    .then((response) => {
      setPopupMessage('Submit Successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      //const responseErrors = error.response.data.errors;
      //setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

  const SubmitOPRInstruc = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`saveoprinstruction/${id}`,{
      obr_instruct: OprInstruct
    })
    .then((response) => {
      setPopupMessage('Submit Successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      //const responseErrors = error.response.data.errors;
      //setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  const SubmitOPRAction = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`saveopraction/${id}`,{
      obr_comment: OprAction
    })
    .then((response) => {
      setPopupMessage('Submit Successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      //const responseErrors = error.response.data.errors;
      //setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  function handleApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/facilityapproval/${id}`)
      .then((response) => {
        setPopupMessage('Form Approve Successfully');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }
    else{
      alert('You change your mind');
    }

  };

  function handleDisapproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/facilitydisapproval/${id}`)
    .then((response) => {
      setPopupMessage('Form Disapprove Successfully');
      setShowPopup(true);
    })
    .catch((error) => {
      console.error(error);
      setPopupMessage('Failed to approve the form. Please try again later.');
      setShowPopup(true);
    });
    }
    else{
      alert('You change your mind');
    }

  };

  const componentRef= useRef();

  //Generate PDF
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Facility-Venue-Control-No:${id}`
  });

  //Count down
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const handleButtonClick = () => {
    setIsVisible(true); 
    setSeconds(3);
    setSubmitLoading(true);
    setTimeout(() => {
      generatePDF();
      setSubmitLoading(false);
      setIsVisible(false); 
    }, 1000);
  };

  useEffect(() => {
    let timer;

    if (isVisible && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isVisible, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsVisible(false);
      setSubmitLoading(false);
    }
  }, [seconds]);

  return(
    <PageComponent title="Request For The Use Of Facility / Venue">
    <div>
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
    <div>

      {/* Display View */}
      <div>

        
        {/* Control Number */}
        <div className="font-arial text-right">
          <span>Control No:</span>{" "}
          <span style={{ textDecoration: "underline", fontWeight: "900" }}>
            __________
            {displayRequestFacility?.viewFacilityData?.id}
            __________
          </span>
        </div>

        <table className="w-full border-collapse border border-black mt-4">

          {/* Title and Logo */}
          <tr>
            <td className="border border-black w-40 p-2 text-center">
              <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '80px' }} />
            </td>
            <td className="border text-2xl w-3/5 border-black font-arial text-center">
              <b>REQUEST FOR THE USE OF FACILITY / VENUE</b>
            </td>
            <td className="border border-black p-0 font-arial">
              <div className="border-b border-black px-3 py-3" style={{ fontWeight: 'bold' }}>RF 03-2018 ver 1</div>
              <div className="border-black px-3 py-3" style={{ fontWeight: 'bold' }}>DATE: {formatDate(displayRequestFacility?.viewFacilityData?.date_requested)}</div>
            </td>
          </tr>

          {/* Black */}
          <tr>
            <td colSpan={3} className="border border-black p-2 font-arial"></td>
          </tr>

          {/* Main Form */}
          <tr>
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

            {/* Request Office/Division */}
            <div className="mt-6">
              <div className="flex">
                <div className="w-72">
                  <strong>Request Office/Division:</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                  <span>{displayRequestFacility.viewFacilityData.request_office}</span>
                </div>
              </div>
            </div>

            {/* Title/Purpose of Activity */}
            <div className="mt-4">
              <div className="flex">
                <div className="w-72">
                  <strong>Title/Purpose of Activity:</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                  <span> {displayRequestFacility.viewFacilityData.title_of_activity} </span>
                </div>
              </div>
            </div>

            {/* Date of Activity */}
            <div className="mt-4">
              <div className="flex">
                <div className="w-72">
                  <strong>Date of Activity:</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                {displayRequestFacility.viewFacilityData.date_start === displayRequestFacility.viewFacilityData.date_end ? (
                <span> {formatDate(displayRequestFacility.viewFacilityData.date_start)} </span>
                ):(
                <span> {formatDate(displayRequestFacility.viewFacilityData.date_start)} to {formatDate(displayRequestFacility.viewFacilityData.date_end)} </span>
                )}
                </div>
              </div>
            </div>

            {/* Time of Activity */}
            <div className="mt-4">
              <div className="flex">
                <div className="w-72">
                  <strong>Time of Activity (START and END):</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                {displayRequestFacility.viewFacilityData.date_start === displayRequestFacility.viewFacilityData.date_end ? (
                <span> {formatTime(displayRequestFacility.viewFacilityData.time_start)} to {formatTime(displayRequestFacility.viewFacilityData.time_end)}</span>
                ):(
                <span> {formatDateS(displayRequestFacility.viewFacilityData.date_start)} ({formatTime(displayRequestFacility.viewFacilityData.time_start)}) to {formatDateS(displayRequestFacility.viewFacilityData.date_end)} ({formatTime(displayRequestFacility.viewFacilityData.time_end)}) </span>
                )}
                </div>
              </div>
            </div>

            {/* Type of Facility */}
            <div className="mt-4">
              <div className="flex">
                <div className="w-full">
                  <strong>Facility/ies Venue being Requested:</strong>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full">
                <div className="grid grid-cols-4 gap-4">

                  {/* MPH */}
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold"> 
                        {displayRequestFacility.viewFacilityData.mph == 1 || 
                        displayRequestFacility.viewFacilityData.mph == 2 || 
                        displayRequestFacility.viewFacilityData.mph == 3
                        ? 'X' : null} 
                      </div>
                      <span style={{ fontWeight: 'bold' }}>Multi-Purpose Hall (MPH)</span>
                    </div>
                  </div>

                  {/* Conference */}
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold">
                        {displayRequestFacility.viewFacilityData.conference == 1 || 
                        displayRequestFacility.viewFacilityData.conference == 2 ||
                        displayRequestFacility.viewFacilityData.conference == 3
                        ? 'X' : null}
                      </div>
                      <span style={{ fontWeight: 'bold' }}>Conference Room</span>
                    </div>
                  </div>

                  {/* Dorm */}
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold">
                        {displayRequestFacility.viewFacilityData.dorm == 1 || 
                        displayRequestFacility.viewFacilityData.dorm == 2 ||
                        displayRequestFacility.viewFacilityData.dorm == 3
                        ? 'X' : null}
                      </div>
                      <span style={{ fontWeight: 'bold' }}>Dormitory</span>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold">
                        {displayRequestFacility.viewFacilityData.other == 1 || 
                        displayRequestFacility.viewFacilityData.other == 2 ||
                        displayRequestFacility.viewFacilityData.other == 3
                        ? 'X' : null}
                      </div>
                      <span style={{ fontWeight: 'bold' }}>Others</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            </td>
          </tr>
              
        </table>
        
        {/* For MPH Table */}
        {displayRequestFacility?.viewFacilityData.mph == 2 && 
        displayRequestFacility?.viewFacilityData?.user_id == currentUser.id ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          {/* Forms */}
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

            <div>
              <b>* For the Multi-Purpose Hall (check atleast 3 checkbox)</b>
            </div>

            <form onSubmit={SubmitMPHForm}>

              <div className="mt-4">
                <div className="w-full">

                  <div className="grid grid-cols-2 gap-4">
                    
                    <div className="col-span-1 ml-40">

                      {/* Table */}
                      <div class="relative flex items-center">
                        <div class="flex items-center h-5">
                          <input
                            id="mph-checktable"
                            name="mph-checktable"
                            type="checkbox"
                            checked={checkTable}
                            onChange={() => setCheckTable(!checkTable)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                      {MPHErrors.no_table && (
                        <p className="text-red-500 text-xs mt-1">No. of table is required</p>
                      )}

                      {/* Chair */}
                      <div class="relative flex items-center mt-2">
                        <div class="flex items-center h-5">
                          <input
                            id="mph-checkchair"
                            name="mph-checkchair"
                            type="checkbox"
                            checked={checkChairs}
                            onChange={ev => setCheckChairs(!checkChairs)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3">
                          <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                            Chairs
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
                      {MPHErrors.no_chair && (
                        <p className="text-red-500 text-xs mt-1">No. of chair is required</p>
                      )}

                      {/* Projector */}
                      <div class="relative flex items-center mt-2">
                        <div class="flex items-center h-5">
                          <input
                            id="other-checkbox"
                            type="checkbox"
                            checked={checkProjector}
                            onChange={ev => setCheckProjector(!checkProjector)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3">
                          <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                            Document Camera
                          </label> 
                        </div>
                      </div>

                      {/* Others */}
                      <div class="relative flex items-center mt-2">
                        <div class="flex items-center h-5">
                          <input
                            id="mph-checkmicrophone"
                            name="mph-checkmicrophone"
                            type="checkbox"
                            checked={checkOther}
                            onChange={ev => setCheckOther(!checkOther)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3">
                          <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                            Others
                          </label> 
                        </div>
                        {checkOther && (
                          <div className="flex items-center w-full ml-0">
                            <label htmlFor="rf_request" className="block w-48 text-base font-medium leading-6 text-gray-900">
                              , please specify
                            </label> 
                            <input
                              type="text"
                              name="other-specfic"
                              id="other-specfic"
                              value={OtherField}
                              onChange={ev => setOtherField(ev.target.value)}
                              className="block w-full border-l-0 border-t-0 border-r-0 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                            />
                          </div>
                        )}
                      </div>
                      {MPHErrors.specify && (
                        <p className="text-red-500 text-xs mt-1">please specify your request</p>
                      )}

                    </div>

                    <div className="col-span-1">
                      
                      {/* Laptop */}
                      <div class="relative flex items-center mt-2">
                        <div class="flex items-center h-5">
                          <input
                            id="other-checkbox"
                            type="checkbox"
                            checked={checkLaptop}
                            onChange={ev => setCheckLaptop(!checkLaptop)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                            onChange={ev => setCheckMicrphone(!checkMicrphone)}
                            class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                      {MPHErrors.no_microphone && (
                        <p className="text-red-500 text-xs mt-1">No. of microphone is required</p>
                      )}

                    </div>

                  </div>

                </div>
              </div>

              <div className="flex mt-10 pl-1 justify-center">
                {checkedCountMPH >= 3 ? (
                <>
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                  disabled={isLoading}
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
                </>
                ):null}
                
              </div>

            </form>

            </td>
          </tr>
        </table>      
        </>
        ):displayRequestFacility?.viewFacilityData.mph == 2 ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">
              
              <div>
                <b>* For the Multi-Purpose Hall</b>
              </div>

              <div className="mt-4 mb-6">
                <div className="w-full">

                  <div className="grid grid-cols-2 gap-4">

                    <div className="col-span-1 ml-40">

                      {/* Table */}
                      <div className="mt-0">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Tables</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> </span>)
                          </div>
                        </div>
                      </div>

                      {/* Chair */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Chairs</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> </span>)
                          </div>
                        </div>
                      </div>

                      {/* Projector */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Projector</strong>
                          </div>
                        </div>
                      </div>

                      {/* Projector Screen */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Projector Screen</strong>
                          </div>
                        </div>
                      </div>

                      {/* Document Camera */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Document Camera</strong>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="col-span-1">

                      {/* Laptop */}
                      <div className="mt-0">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Laptop</strong>
                          </div>
                        </div>
                      </div>

                      {/* Television */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Television</strong>
                          </div>
                        </div>
                      </div>

                      {/* Sound System */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-32 ml-1">
                            <strong>Sound System</strong>
                          </div>
                        </div>
                      </div>

                      {/* Videoke */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-32 ml-1">
                            <strong>Videoke</strong>
                          </div>
                        </div>
                      </div>

                      {/* Microphone */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Microphone</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> </span>)
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="mt-2 mb-6">
                    <div className="w-full">

                    {/* Others */}
                    <div className="mt-1 ml-40">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Others</strong>, please specify
                        </div>
                        <div className="w-1/2 border-b p-0 pl-2 border-black text-left ml-3">
                        <span className=""> </span>
                        </div>
                      </div>
                    </div>

                    </div>
                  </div>

                </div>
              </div>

            </td>
          </tr>
        </table>
        </>
        ):displayRequestFacility?.viewFacilityData.mph == 1 ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">
              
              <div>
                <b>* For the Multi-Purpose Hall</b>
              </div>

              <div className="mt-4 mb-6">
                <div className="w-full">

                  <div className="grid grid-cols-2 gap-4">

                    <div className="col-span-1 ml-40">

                      {/* Table */}
                      <div className="mt-0">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.table === 1 ? 'X':null}
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Tables</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> {displayMPHFacility?.viewMPHFacilityData?.no_table ? displayMPHFacility?.viewMPHFacilityData?.no_table:null} </span>)
                          </div>
                        </div>
                      </div>

                      {/* Chair */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.chair === 1 ? 'X':null}
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Chairs</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> {displayMPHFacility?.viewMPHFacilityData?.no_chair ? displayMPHFacility?.viewMPHFacilityData?.no_chair:null} </span>)
                          </div>
                        </div>
                      </div>

                      {/* Projector */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.projector === 1 ? 'X':null}
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Projector</strong>
                          </div>
                        </div>
                      </div>

                      {/* Projector Screen */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.projector === 1 ? 'X':null}
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Projector Screen</strong>
                          </div>
                        </div>
                      </div>

                      {/* Document Camera */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.document_camera === 1 ? 'X':null}
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Document Camera</strong>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="col-span-1">

                      {/* Laptop */}
                      <div className="mt-0">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.laptop === 1 ? 'X':null}
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Laptop</strong>
                          </div>
                        </div>
                      </div>

                      {/* Television */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.television === 1 ? 'X':null}
                          </div>
                          <div className="w-12 ml-1">
                            <strong>Television</strong>
                          </div>
                        </div>
                      </div>

                      {/* Sound System */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.sound_system === 1 ? 'X':null}
                          </div>
                          <div className="w-32 ml-1">
                            <strong>Sound System</strong>
                          </div>
                        </div>
                      </div>

                      {/* Videoke */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.videoke === 1 ? 'X':null}
                          </div>
                          <div className="w-32 ml-1">
                            <strong>Videoke</strong>
                          </div>
                        </div>
                      </div>

                      {/* Microphone */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-20 border-b border-black pl-1 font-bold text-center">
                            {displayMPHFacility?.viewMPHFacilityData?.microphone === 1 ? 'X':null}
                          </div>
                          <div className="w-22 ml-1">
                            <strong>Microphone</strong>
                          </div>
                          <div className="w-30 ml-2">
                          (No.<span className="border-b border-black px-5 text-center"> {displayMPHFacility?.viewMPHFacilityData?.no_microphone ? displayMPHFacility?.viewMPHFacilityData?.no_microphone:null} </span>)
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="mt-2 mb-6">
                    <div className="w-full">

                    {/* Others */}
                    <div className="mt-1 ml-40">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayMPHFacility?.viewMPHFacilityData?.others === 1 ? 'X':null}
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Others</strong>, please specify
                        </div>
                        <div className="w-1/2 border-b p-0 pl-2 border-black text-left ml-3">
                        <span className=""> {displayMPHFacility?.viewMPHFacilityData?.specify ? displayMPHFacility?.viewMPHFacilityData?.specify:null} </span>
                        </div>
                      </div>
                    </div>

                    </div>
                  </div>

                </div>
              </div>

            </td>
          </tr>
        </table>
        </>
        ):null}

        {/* For Conference Table */}
        {displayRequestFacility?.viewFacilityData.conference == 2 && 
        displayRequestFacility?.viewFacilityData?.user_id == currentUser.id ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

            <div>
              <b>* For Conference Room (check atleast 3 checkbox)</b>
            </div>

            <form onSubmit={SubmitConferenceForm}>

              <div className="mt-4">
                <div className="w-full">

                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-1 ml-40">

                  {/* Table */}
                  <div class="relative flex items-center">
                    <div class="flex items-center h-5">
                      <input
                        id="mph-checktable"
                        name="mph-checktable"
                        type="checkbox"
                        checked={checkConferenceTable}
                        onChange={() => setCheckConferenceTable(!checkConferenceTable)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                        Tables
                      </label> 
                    </div>
                    {checkConferenceTable && (
                      <div className="flex items-center w-32 ml-2">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          (No. 
                        </label> 
                        <input
                          type="number"
                          name="no-of-table"
                          id="no-of-table"
                          value={conferenceNoOfTable}
                          onChange={handleInputTableConferenceChange}
                          className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                          ) 
                        </label>
                      </div>
                    )}
                  </div>
                  {ConferenceErrors.no_table && (
                    <p className="text-red-500 text-xs mt-1">No. of table is required</p>
                  )}

                  {/* Chair */}
                  <div class="relative flex items-center mt-2">
                    <div class="flex items-center h-5">
                      <input
                        id="mph-checkchair"
                        name="mph-checkchair"
                        type="checkbox"
                        checked={checkConferenceChairs}
                        onChange={ev => setCheckConferenceChairs(!checkConferenceChairs)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                        Chairs
                      </label> 
                    </div>
                    {checkConferenceChairs && (
                      <div className="flex items-center w-32 ml-2">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          (No. 
                        </label> 
                        <input
                          type="number"
                          name="no-of-chair"
                          id="no-of-chair"
                          value={conferenceNoOfChairs}
                          onChange={handleInputChairConferenceChange}
                          className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                          ) 
                        </label>
                      </div>
                    )}
                  </div>
                  {ConferenceErrors.no_chair && (
                    <p className="text-red-500 text-xs mt-1">No. of table is required</p>
                  )}

                  {/* Projector */}
                  <div class="relative flex items-center mt-2">
                    <div class="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkConferenceProjector}
                        onChange={ev => setCheckConferenceProjector(!checkConferenceProjector)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                          checked={checkConferenceProjectorScreen}
                          onChange={ev => setCheckConferenceProjectorScreen(!checkConferenceProjectorScreen)}
                          class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                        checked={checkConferenceDocumentCamera}
                        onChange={ev => setCheckConferenceDocumentCamera(!checkConferenceDocumentCamera)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                        Document Camera
                      </label> 
                    </div>
                  </div>

                  {/* Others */}
                  <div class="relative flex items-center mt-2">
                    <div class="flex items-center h-5">
                      <input
                        id="mph-checkmicrophone"
                        name="mph-checkmicrophone"
                        type="checkbox"
                        checked={checkConferenceOther}
                        onChange={ev => setCheckConferenceOther(!checkConferenceOther)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                        Others
                      </label> 
                    </div>
                    {checkConferenceOther && (
                      <div className="flex items-center w-full ml-0">
                        <label htmlFor="rf_request" className="block w-48 text-base font-medium leading-6 text-gray-900">
                          , please specify
                        </label> 
                        <input
                          type="text"
                          name="other-specfic"
                          id="other-specfic"
                          value={conferenceOtherField}
                          onChange={ev => setConferenceOtherField(ev.target.value)}
                          className="block w-full border-l-0 border-t-0 border-r-0 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                      </div>
                    )}
                  </div>
                  {ConferenceErrors.specify && (
                    <p className="text-red-500 text-xs mt-1">please specify your request</p>
                  )}

                  </div>

                  <div className="col-span-1">

                  {/* Laptop */}
                  <div class="relative flex items-center mt-2">
                    <div class="flex items-center h-5">
                      <input
                        id="other-checkbox"
                        type="checkbox"
                        checked={checkConferenceLaptop}
                        onChange={ev => setConferenceCheckLaptop(!checkConferenceLaptop)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                        checked={checkConferenceTelevision}
                        onChange={ev => setCheckConferenceTelevision(!checkConferenceTelevision)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                        checked={checkConferenceSoundSystem}
                        onChange={ev => setCheckConferenceSoundSystem(!checkConferenceSoundSystem)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                        checked={checkConferenceVideoke}
                        onChange={ev => setCheckConferenceVideoke(!checkConferenceVideoke)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
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
                        checked={checkConferenceMicrphone}
                        onChange={ev => setCheckConferenceMicrphone(!checkConferenceMicrphone)}
                        class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-gray-900">
                        Microphone
                      </label> 
                    </div>
                    {checkConferenceMicrphone && (
                      <div className="flex items-center w-32 ml-2">
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                          (No. 
                        </label> 
                        <input
                          type="number"
                          name="no-of-microphone"
                          id="no-of-microphone"
                          value={conferenceNoOfMicrophone}
                          onChange={handleInputMicrophoneConferenceChange}
                          className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                        />
                        <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                          ) 
                        </label>
                      </div>
                    )}
                  </div>
                  {ConferenceErrors.no_microphone && (
                    <p className="text-red-500 text-xs mt-1">No. of microphone is required</p>
                  )}

                  </div>

                </div>

                </div>
              </div>

              <div className="flex mt-10 mb-2 pl-1 justify-center">
              {checkedCountConference >= 3 ? (
              <>
              <button
                type="submit"
                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
                disabled={isLoading}
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
              </>
              ):null}
              </div>

            </form>

            </td>
          </tr>
        </table>
        </>
        ):displayRequestFacility?.viewFacilityData.conference == 2 ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

            <div>
              <b>* For Conference Room</b>
            </div>

            <div className="mt-4 mb-6">
              <div className="w-full">

                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-1 ml-40">

                    {/* Table */}
                    <div className="mt-0">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Tables</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> </span>)
                        </div>
                      </div>
                    </div>

                    {/* Chair */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Chairs</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> </span>)
                        </div>
                      </div>
                    </div>

                    {/* Projector */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Projector</strong>
                        </div>
                      </div>
                    </div>

                    {/* Projector Screen */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Projector Screen</strong>
                        </div>
                      </div>
                    </div>

                    {/* Document Camera */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Document Camera</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="col-span-1">

                    {/* Laptop */}
                    <div className="mt-0">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Laptop</strong>
                        </div>
                      </div>
                    </div>

                    {/* Television */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Television</strong>
                        </div>
                      </div>
                    </div>

                    {/* Sound System */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-32 ml-1">
                          <strong>Sound System</strong>
                        </div>
                      </div>
                    </div>

                    {/* Videoke */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-32 ml-1">
                          <strong>Videoke</strong>
                        </div>
                      </div>
                    </div>

                    {/* Microphone */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Microphone</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> </span>)
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Others */}
                <div className="mt-1 ml-40">
                  <div className="flex">
                    <div className="w-20 border-b border-black pl-1 font-bold text-center">
                      {displayConferenceFacility?.viewConferenceFacilityData?.others === 1 ? 'X':null}
                    </div>
                    <div className="w-22 ml-1">
                      <strong>Others</strong>, please specify
                    </div>
                    <div className="w-1/2 border-b p-0 pl-2 border-black text-left ml-3">
                    <span className=""> {displayConferenceFacility?.viewConferenceFacilityData?.specify ? displayConferenceFacility?.viewConferenceFacilityData?.specify:null} </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            </td>
          </tr>
        </table>
        </>
        ):displayRequestFacility?.viewFacilityData.conference == 1 ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

            <div>
              <b>* For Conference Room</b>
            </div>

            <div className="mt-4 mb-6">
              <div className="w-full">

                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-1 ml-40">

                    {/* Table */}
                    <div className="mt-0">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.table === 1 ? 'X':null}
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Tables</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> {displayConferenceFacility?.viewConferenceFacilityData?.no_table ? displayConferenceFacility.viewConferenceFacilityData.no_table:null} </span>)
                        </div>
                      </div>
                    </div>

                    {/* Chair */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.chair === 1 ? 'X':null}
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Chairs</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> {displayConferenceFacility?.viewConferenceFacilityData?.no_chair ? displayConferenceFacility?.viewConferenceFacilityData?.no_chair:null} </span>)
                        </div>
                      </div>
                    </div>

                    {/* Projector */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.projector === 1 ? 'X':null}
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Projector</strong>
                        </div>
                      </div>
                    </div>

                    {/* Projector Screen */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.projector === 1 ? 'X':null}
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Projector Screen</strong>
                        </div>
                      </div>
                    </div>

                    {/* Document Camera */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.document_camera === 1 ? 'X':null}
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Document Camera</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="col-span-1">

                    {/* Laptop */}
                    <div className="mt-0">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.laptop === 1 ? 'X':null}
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Laptop</strong>
                        </div>
                      </div>
                    </div>

                    {/* Television */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.television === 1 ? 'X':null}
                        </div>
                        <div className="w-12 ml-1">
                          <strong>Television</strong>
                        </div>
                      </div>
                    </div>

                    {/* Sound System */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.sound_system === 1 ? 'X':null}
                        </div>
                        <div className="w-32 ml-1">
                          <strong>Sound System</strong>
                        </div>
                      </div>
                    </div>

                    {/* Videoke */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.videoke === 1 ? 'X':null}
                        </div>
                        <div className="w-32 ml-1">
                          <strong>Videoke</strong>
                        </div>
                      </div>
                    </div>

                    {/* Microphone */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-20 border-b border-black pl-1 font-bold text-center">
                          {displayConferenceFacility?.viewConferenceFacilityData?.microphone === 1 ? 'X':null}
                        </div>
                        <div className="w-22 ml-1">
                          <strong>Microphone</strong>
                        </div>
                        <div className="w-30 ml-2">
                        (No.<span className="border-b border-black px-5 text-center"> {displayConferenceFacility?.viewConferenceFacilityData?.no_microphone ? displayConferenceFacility.viewConferenceFacilityData.no_microphone:null} </span>)
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Others */}
                <div className="mt-1 ml-40">
                  <div className="flex">
                    <div className="w-20 border-b border-black pl-1 font-bold text-center">
                      {displayConferenceFacility?.viewConferenceFacilityData?.others === 1 ? 'X':null}
                    </div>
                    <div className="w-22 ml-1">
                      <strong>Others</strong>, please specify
                    </div>
                    <div className="w-1/2 border-b p-0 pl-2 border-black text-left ml-3">
                    <span className=""> {displayConferenceFacility?.viewConferenceFacilityData?.specify ? displayConferenceFacility?.viewConferenceFacilityData?.specify:null} </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            </td>
          </tr>
        </table>
        </>
        ):null}

        {/* For Dormitort Table */}
        {displayRequestFacility?.viewFacilityData.dorm == 2 && 
        displayRequestFacility?.viewFacilityData?.user_id == currentUser.id ? (
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

              <div>
                <b>* For Dormitory</b>
              </div>

              <form onSubmit={SubmitDormForm}>

                <div className="mt-4">
                  <div className="w-full">

                    <div className="grid grid-cols-2 gap-4">

                      <div className="col-span-1 ml-40">

                        {/* No of Male Guest */}
                        <div className="mt-0">
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
                          <p className="text-red-500 text-xs mt-2">Separate name on next line (Leave blank if none)</p>

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

                      <div className="col-span-1">

                        {/* No of Female Guest */}
                        <div className="mt-0">
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
                            className="block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                          <p className="text-red-500 text-xs mt-2">Separate name on next line (Leave blank if none)</p>

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

                    <div className="mt-4">
                      <div className="w-full">

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
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex mt-10 pl-1 justify-center">
                  <button
                    type="submit"
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                      isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                    disabled={isLoading}
                  >
                    {submitLoading ? (
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
            
            </td>
          </tr>
        </table>
        </>
        ):displayRequestFacility?.viewFacilityData.dorm == 2 ?(
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

              <div>
                <b>* For Dormitory</b>
              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* For Male Guest */}
                <div className="col-span-1 ml-40">

                  <div className="mt-0 mb-6">
                    <div className="flex">
                      <div className="w-24 border-b border-black font-bold text-center">
                        <span>
                        
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
                  </div>
                  <span className="font-meduim">No Data</span>

                </div>

                {/* For Female Guest */}
                <div className="col-span-1">

                  <div className="mt-0 mb-6">
                    <div className="flex">
                      <div className="w-24 border-b border-black font-bold text-center">
                        <span>
                        
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
                  </div>
                    <span className="font-meduim">No Data</span>

                </div>

              </div>

              {/* Other Details */}
              <div className="mt-8 ml-40">
                <div className="flex">
                  <div className="w-full">
                    <strong>Other Details:</strong>
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-8 ml-40">
                <div className="w-full">
                  <div className="w-10/12 border-b border-black font-regular text-left pl-2">
                  No Data
                  </div>
                </div>
              </div>

            </td>
          </tr>
        </table>
        </>
        ):displayRequestFacility?.viewFacilityData.dorm == 1 ?(
        <>
        <table className="w-full border-collapse border border-black mt-4">
          <tr>
            <td colSpan={3} className="text-base w-full border-black font-arial text-left p-2">

              <div>
                <b>* For Dormitory</b>
              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* For Male Guest */}
                <div className="col-span-1 ml-40">

                  <div className="mt-0 mb-6">
                    <div className="flex">
                      <div className="w-24 border-b border-black font-bold text-center">
                        <span>
                        {displayDormFacility?.maleNamesString === "N/A" ? null:(
                          displayDormFacility?.maleNamesArray?.length
                        )}
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
                  </div>
                  {displayDormFacility?.maleNamesString === "N/A" ? (
                    <span className="font-meduim">No Male Guest</span>
                  ):(
                    displayDormFacility?.maleNamesArray?.map((maleName, index) => (
                      <div key={index} className="flex">
                        <span className="font-bold">{`${index + 1}.`}</span>
                        <div className="w-1/2 border-b border-black pl-1 text-left ml-1 pl-2">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
                      </div>
                    ))
                  )}
                  

                </div>

                {/* For Female Guest */}
                <div className="col-span-1">

                  <div className="mt-0 mb-6">
                    <div className="flex">
                      <div className="w-24 border-b border-black font-bold text-center">
                        <span>
                        {displayDormFacility?.femaleNamesString === "N/A" ? null:(
                          displayDormFacility?.femaleNamesArray?.length
                        )}
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
                  </div>
                  {displayDormFacility?.femaleNamesString === "N/A" ? (
                    <span className="font-meduim">No Female Guest</span>
                  ):(
                    displayDormFacility?.femaleNamesArray?.map((femaleName, index) => (
                      <div key={index} className="flex">
                        <span className="font-bold">{`${index + 1}.`}</span>
                        <div className="w-1/2 border-b border-black pl-1 text-left ml-1 pl-2">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
                      </div>
                    ))
                  )}

                </div>

              </div>

              {/* Other Details */}
              <div className="mt-8 ml-40">
                <div className="flex">
                  <div className="w-full">
                    <strong>Other Details:</strong>
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-8 ml-40">
                <div className="w-full">
                  <div className="w-10/12 border-b border-black font-regular text-left pl-2">
                  {displayDormFacility?.viewDormFacilityData?.other_details}
                  </div>
                </div>
              </div>

            </td>
          </tr>
        </table>
        </>
        ):null}

        <table className="w-full border-collapse border border-black mt-4">

          {/* Title and Logo */}
          <tr>
            {/* Requestor */}
            <td className="border border-black w-1/2 p-2">
              <div className="text-base font-arial">
                Requested by:
              </div>
              <div className="relative mt-12">
                <img
                    src={displayRequestFacility?.requestor?.signature}
                    style={{ position: 'absolute', width: '300px', top: '-60px', left: '135px' }}
                    alt="Signature"
                />
            </div>
            <div className="text-center font-bold text-xl relative mt-12">
                {displayRequestFacility?.requestor?.name}
            </div>
            </td>

            {/* Admin Manager */}
            <td className="border w-1/2 border-black">
              <div className="text-base font-arial ml-10">
              {displayRequestFacility?.viewFacilityData?.admin_approval === 1 ? 'Approved' 
              : displayRequestFacility?.viewFacilityData?.admin_approval === 2 ? 'Disapproved'
              : 'Approved / Disapproved by:' }
              </div>
              {displayRequestFacility?.viewFacilityData?.admin_approval === 1 || displayRequestFacility.viewFacilityData.admin_approval === 2  ? (
                <div className="relative mt-12">
                  <img
                      src={displayRequestFacility?.manager?.signature}
                      style={{ position: 'absolute', width: '300px', top: '-60px', left: '135px' }}
                      alt="Signature"
                  />
                </div>
              ):null}
              
            <div className="text-center font-bold text-xl relative mt-12">
                {displayRequestFacility?.manager?.name}
            </div>
            </td>
          </tr>

          <tr>
            <td className="border border-black w-1/2"></td>
            <td className="border border-black w-1/2 text-center">Admin. Division Manager</td>
          </tr>

          <tr>
            <td className="border text-base border-black w-1/2 text-center"><b>DATE: </b> {formatDateS(displayRequestFacility?.viewFacilityData?.date_requested)}</td>
            <td className="border text-base border-black w-1/2 text-center"><b>DATE: </b> 
              {displayRequestFacility?.viewFacilityData?.date_approve ? formatDateS(displayRequestFacility?.viewFacilityData?.date_approve) : null}
            </td>
          </tr>

        </table>

        <table className="w-full border-collapse border border-black mt-4">
          <tr>

            {/* For Admin Manager */}
            <td className="border border-black w-1/2 p-2" style={{ verticalAlign: 'top' }}>
              <div className="font-bold font-arial">
                Instruction for the OPR for Action
              </div>

              {displayRequestFacility?.viewFacilityData?.obr_instruct ? (
                <div className="px-5 font-arial mt-2" style={{ textDecoration: 'underline' }}>
                {displayRequestFacility?.viewFacilityData?.obr_instruct}
                </div>
              ):
              currentUser.code_clearance === 1 && (
                <form onSubmit={SubmitOPRInstruc}>
                  <textarea
                    id="findings"
                    name="findings"
                    rows={3}
                    style={{ resize: "none" }}
                    value= {OprInstruct}
                    onChange={ev => setOprInstruct(ev.target.value)}
                    className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-gray-500 text-xs mt-0 mb-2">Leave black if N/A</p>

                  <button
                    type="submit"
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                      submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              )
              
              }

            </td>
            
            {/* For GSO */}
            <td className="border border-black w-1/2 p-2 " style={{ verticalAlign: 'top' }}>
              <div className="font-bold font-arial">
                OPR Action
              </div>
              <div className="px-5 font-arial">
                Comments / Concerns
              </div>
              <div className="px-5 font-arial">
                {displayRequestFacility.viewFacilityData.obr_comment ? (
                  <div className="px-5 font-arial mt-2" style={{ textDecoration: 'underline' }}>
                  {displayRequestFacility.viewFacilityData.obr_comment}
                  </div>
                ):
                currentUser.code_clearance === 3 && 
                (
                  <form onSubmit={SubmitOPRAction}>
                  <textarea
                    id="findings"
                    name="findings"
                    rows={3}
                    style={{ resize: "none" }}
                    value= {OprAction}
                    onChange={ev => setOprAction(ev.target.value)}
                    className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-gray-500 text-xs mt-0 mb-2">Leave black if N/A</p>

                  <button
                    type="submit"
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                      submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
                )
                
                }
              </div>
            </td>

          </tr>
        </table>

        {currentUser.code_clearance === 1 && displayRequestFacility?.viewFacilityData?.admin_approval === 3 ? (
          <div className="flex mt-2">
            <button 
              onClick={() => handleApproveClick(displayRequestFacility?.viewFacilityData?.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
              title="Approve"
            >
              Approve
            </button>
            <button 
              onClick={() => handleDisapproveClick(displayRequestFacility?.viewFacilityData?.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
              title="Disapprove"
            >
              Disapprove
            </button>
          </div>
        ) : null}
        
        {/* Button */}
        <div className="mt-4 flex">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link to="/">Back to Dashboard</Link>
          </button>
          {currentUser.code_clearance === 3 && displayRequestFacility?.viewFacilityData?.admin_approval === 1 || currentUser.code_clearance === 6 && displayRequestFacility?.viewFacilityData?.admin_approval === 1 ? (
            <button
            type="button"
            onClick={handleButtonClick}
            className={`rounded-md px-3 py-2 ml-2 font-bold text-white shadow-sm focus:outline-none ${
              submitLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Generating</span>
              </div>
            ) : (
              'Generate PDF'
            )}
          </button>
          ):null}
        </div>

      </div>

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
          <p className="text-lg text-center">{popupMessage}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
        </div>
      )}

      {/* PDF Converter */}
      {isVisible && (
      <div>
        <div className="hidden md:none">

          <div ref={componentRef}>
            <div style={{ width: '216mm', height: '330mm', paddingLeft: '60px', paddingRight: '60px', paddingTop: '10px', border: '0px solid' }}>
            
              {/* Control Number */}
              <div className="title-area font-arial pr-6 text-right">
                <span>Control No:</span>{" "}
                <span style={{ textDecoration: "underline", fontWeight: "900" }}>
                  __________
                  {displayRequestFacility?.viewFacilityData?.id}
                  __________
                </span>
              </div>

              {/* First Table */}
              <table className="w-full mt-1 border-collapse border border-black">
                
                {/* Title and Logo */}
                <tr>
                  <td className="border border-black w-32 p-2 text-center">
                    <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '65px' }} />
                  </td>
                  <td className="border text-lg w-3/5 border-black font-arial text-center">
                    <b>REQUEST FOR THE USE OF FACILITY / VENUE</b>
                  </td>
                  <td className="border border-black p-0 font-arial">
                    <div className="border-b text-xs border-black px-3 py-3" style={{ fontWeight: 'bold' }}>RF 03-2018 ver 1</div>
                    <div className="border-black text-xs px-3 py-3" style={{ fontWeight: 'bold' }}>DATE: {formatDateS(displayRequestFacility?.viewFacilityData?.date_requested)}</div>
                  </td>
                </tr>

                {/* Black */}
                <tr>
                  <td colSpan={3} className="border border-black p-1 font-arial"></td>
                </tr>

                {/* Main Form */}
                <tr>
                  <td colSpan={3} className="border border-black pl-2 pr-2 pb-2 font-arial">

                    {/* Request Office/Division */}
                    <div className="mt-2">
                      <div className="flex">
                        <div className="w-60 text-xs">
                          <span>Request Office/Division:</span>
                        </div>
                        <div className="w-96 border-b border-black pl-1 text-xs">
                          <span>{displayRequestFacility.viewFacilityData.request_office}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title/Purpose of Activity */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-60 text-sm">
                          <span>Title/Purpose of Activity:</span>
                        </div>
                        <div className="w-96 border-b border-black pl-1 text-sm">
                          <span> {displayRequestFacility.viewFacilityData.title_of_activity} </span>
                        </div>
                      </div>
                    </div>

                    {/* Date of Activity */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-60 text-sm">
                          <span>Date of Activity:</span>
                        </div>
                        <div className="w-96 border-b border-black pl-1 text-sm">
                        {displayRequestFacility.viewFacilityData.date_start === displayRequestFacility.viewFacilityData.date_end ? (
                        <span> {formatDate(displayRequestFacility.viewFacilityData.date_start)} </span>
                        ):(
                        <span> {formatDate(displayRequestFacility.viewFacilityData.date_start)} to {formatDate(displayRequestFacility.viewFacilityData.date_end)} </span>
                        )}
                        </div>
                      </div>
                    </div>

                    {/* Time of Activity */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-60 text-sm">
                          <span>Time of Activity (START and END):</span>
                        </div>
                        <div className="w-96 border-b border-black pl-1 text-sm">
                        {displayRequestFacility.viewFacilityData.date_start === displayRequestFacility.viewFacilityData.date_end ? (
                        <span> {formatTime(displayRequestFacility.viewFacilityData.time_start)} to {formatTime(displayRequestFacility.viewFacilityData.time_end)}</span>
                        ):(
                        <span> {formatDateS(displayRequestFacility.viewFacilityData.date_start)} ({formatTime(displayRequestFacility.viewFacilityData.time_start)}) to {formatDateS(displayRequestFacility.viewFacilityData.date_end)} ({formatTime(displayRequestFacility.viewFacilityData.time_end)}) </span>
                        )}
                        </div>
                      </div>
                    </div>

                    {/* Type of Facility */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-full text-sm">
                          <span>Facility/ies Venue being Requested:</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full">
                        <div className="grid grid-cols-4 gap-1">

                          {/* MPH */}
                          <div className="col-span-1">
                            <div className="flex items-start text-sm">
                              <div className="w-5 h-5 border border-black mr-2 flex items-start justify-center text-black"> 
                                {displayRequestFacility.viewFacilityData.mph == 1 ? 'X' : null} 
                              </div>
                              <span style={{ fontWeight: 'bold' }}>Multi-Purpose Hall (MPH)</span>
                            </div>
                          </div>

                          {/* Conference */}
                          <div className="col-span-1">
                            <div className="flex items-center text-sm">
                              <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                                {displayRequestFacility.viewFacilityData.conference == 1 ? 'X' : null}
                              </div>
                              <span style={{ fontWeight: 'bold' }}>Conference Room</span>
                            </div>
                          </div>

                          {/* Dorm */}
                          <div className="col-span-1">
                            <div className="flex items-center text-sm">
                              <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                                {displayRequestFacility.viewFacilityData.dorm == 1 ? 'X' : null}
                              </div>
                              <span style={{ fontWeight: 'bold' }}>Dormitory</span>
                            </div>
                          </div>

                          {/* Other */}
                          <div className="col-span-1">
                            <div className="flex items-center text-sm">
                              <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                                {displayRequestFacility.viewFacilityData.other == 1 ? 'X' : null}
                              </div>
                              <span style={{ fontWeight: 'bold' }}>Others</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </td>
                </tr>

              </table>

              {/* For MPH */}
              {displayRequestFacility?.viewFacilityData.mph == 1 ? (
              <table className="w-full border-collapse border border-black mt-1">
                <tr>
                  <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2">
                  
                  <div className="text-sm mt-1">
                    <span>* For the Multi-Purpose Hall</span>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="w-full">

                      <div className="grid grid-cols-2 gap-4">

                        <div className="col-span-1 ml-36">

                          {/* Table */}
                          <div className="mt-0">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.table === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Tables</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayMPHFacility?.viewMPHFacilityData?.no_table ? displayMPHFacility?.viewMPHFacilityData?.no_table:null} </span> )
                              </div>
                            </div>
                          </div>

                          {/* Chair */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-xs pl-1 text-center h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.chair === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Chairs</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayMPHFacility?.viewMPHFacilityData?.no_chair ? displayMPHFacility?.viewMPHFacilityData?.no_chair:null} </span>)
                              </div>
                            </div>
                          </div>

                          {/* Projector */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-xs text-center h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.projector === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Projector</span>
                              </div>
                            </div>
                          </div>

                          {/* Projector Screen */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-xs text-center h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.projector === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Projector Screen</span>
                              </div>
                            </div>
                          </div>

                          {/* Document Camera */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-xs text-center h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.document_camera === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Document Camera</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="col-span-1">

                          {/* Laptop */}
                          <div className="mt-0">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.laptop === 1 ? 'X':null}
                              </div>
                              <div className="w-12 text-sm mr-1 ml-1">
                                <span>Laptop</span>
                              </div>
                            </div>
                          </div>

                          {/* Television */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.television === 1 ? 'X':null}
                              </div>
                              <div className="w-12 text-sm mr-1 ml-1">
                                <span>Television</span>
                              </div>
                            </div>
                          </div>

                          {/* Sound System */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.sound_system === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Sound System</span>
                              </div>
                            </div>
                          </div>

                          {/* Videoke */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.videoke === 1 ? 'X':null}
                              </div>
                              <div className="w-32 text-sm mr-1 ml-1">
                                <span>Videoke</span>
                              </div>
                            </div>
                          </div>

                          {/* Microphone */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayMPHFacility?.viewMPHFacilityData?.microphone === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Microphone</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 mr-1 text-center"> {displayMPHFacility?.viewMPHFacilityData?.no_microphone ? displayMPHFacility?.viewMPHFacilityData?.no_microphone:null} </span>)
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Others */}
                      <div className="mt-2">
                        <div className="w-full">

                        <div className="mt-1 ml-36">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {displayMPHFacility?.viewMPHFacilityData?.others === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Others</span>, please specify
                            </div>
                            <div className="w-1/2 border-b p-0 pl-2 border-black text-sm text-left ml-1">
                            <span className=""> {displayMPHFacility?.viewMPHFacilityData?.specify ? displayMPHFacility?.viewMPHFacilityData?.specify:null} </span>
                            </div>
                          </div>
                        </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  </td>
                </tr>
              </table>
              ):null}               

              {/* For Conference Room */}
              {displayRequestFacility?.viewFacilityData.conference == 1 ? (
              <table className="w-full border-collapse border border-black mt-1">
                <tr>
                  <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2">
                  
                  <div className="text-sm mt-1">
                    <span>* For the Conference Room</span>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="w-full">

                      <div className="grid grid-cols-2 gap-4">

                        <div className="col-span-1 ml-36">

                          {/* Table */}
                          <div className="mt-0">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.table === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Tables</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayConferenceFacility?.viewConferenceFacilityData?.no_table ? displayConferenceFacility.viewConferenceFacilityData.no_table:null} </span> )
                              </div>
                            </div>
                          </div>

                          {/* Chair */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.chair === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Chairs</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayConferenceFacility?.viewConferenceFacilityData?.no_chair ? displayConferenceFacility?.viewConferenceFacilityData?.no_chair:null} </span>)
                              </div>
                            </div>
                          </div>

                          {/* Projector */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-xs text-center h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.projector === 1 ? 'X':null}
                              </div>
                              <div className="w-20 text-sm mr-1 ml-1">
                                <span>Projector</span>
                              </div>
                            </div>
                          </div>

                          {/* Projector Screen */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-xs text-center h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.projector === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Projector Screen</span>
                              </div>
                            </div>
                          </div>

                          {/* Document Camera */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-center text-xs H-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.document_camera === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Document Camera</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="col-span-1">

                          {/* Laptop */}
                          <div className="mt-0">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.laptop === 1 ? 'X':null}
                              </div>
                              <div className="w-12 text-sm mr-1 ml-1">
                                <span>Laptop</span>
                              </div>
                            </div>
                          </div>

                          {/* Television */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.television === 1 ? 'X':null}
                              </div>
                              <div className="w-12 text-sm mr-1 ml-1">
                                <span>Television</span>
                              </div>
                            </div>
                          </div>

                          {/* Sound System */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.sound_system === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Sound System</span>
                              </div>
                            </div>
                          </div>

                          {/* Videoke */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.videoke === 1 ? 'X':null}
                              </div>
                              <div className="w-32 text-sm mr-1 ml-1">
                                <span>Videoke</span>
                              </div>
                            </div>
                          </div>

                          {/* Microphone */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayConferenceFacility?.viewConferenceFacilityData?.microphone === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Microphone</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 mr-1 text-center"> {displayConferenceFacility?.viewConferenceFacilityData?.no_microphone ? displayConferenceFacility.viewConferenceFacilityData.no_microphone:null} </span>)
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Others */}
                      <div className="mt-2">
                        <div className="w-full">

                        <div className="mt-1 ml-36">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-sm h-4">
                              {displayConferenceFacility?.viewConferenceFacilityData?.others === 1 ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 text-sm">
                              <span>Others</span>, please specify
                            </div>
                            <div className="w-1/2 border-b p-0 pl-2 border-black text-left text-sm ml-3">
                            <span className=""> {displayConferenceFacility?.viewConferenceFacilityData?.specify ? displayConferenceFacility?.viewConferenceFacilityData?.specify:null} </span>
                            </div>
                          </div>
                        </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  </td>
                </tr>
              </table>
              ):null}

              {/* For Dormitory */}
              {displayRequestFacility?.viewFacilityData.dorm == 1 ? (
              <table className="w-full border-collapse border border-black mt-1">
                <tr>
                  <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2">

                    <div className="text-sm mt-1">
                      <span>* For the Dormitory</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-4">

                      {/* For Male Guest */}
                      <div className="col-span-1 ml-16">

                        {/* Male Count */}
                        <div>
                          <div className="flex">
                            <div className="w-10 border-b border-black font-normal text-center text-sm">
                              <span>
                              {displayDormFacility?.maleNamesString === "N/A" ? null:(
                                displayDormFacility?.maleNamesArray?.length
                              )}
                              </span>
                            </div>
                            <div className="w-full ml-2 text-sm">
                              <span>No. of Male Guests</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Male List */}
                        <div className="mt-2">
                          <div>
                            <label htmlFor="type_of_property" className="block text-base font-normal leading-6 text-sm"> <span>Name of Guests:</span> </label>
                          </div>
                        </div>
                        {displayDormFacility?.maleNamesString === "N/A" ? (
                          <span className="font-normal text-sm">No Male Guest</span>
                        ):(
                          displayDormFacility?.maleNamesArray?.map((maleName, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
                            </div>
                          ))
                        )}

                      </div>

                      {/* For Female Guest */}
                      <div className="col-span-1">

                        {/* Female Count */}
                        <div>
                          <div className="flex">
                            <div className="w-10 border-b border-black font-normal text-center text-sm">
                              <span>
                              {displayDormFacility?.femaleNamesString === "N/A" ? null:(
                                displayDormFacility?.femaleNamesArray?.length
                              )}
                              </span>
                            </div>
                            <div className="w-full ml-2 text-sm">
                              <span>No. of Female Guests</span>
                            </div>
                          </div>
                        </div>

                        {/* Female List */}
                        <div className="mt-2">
                          <div>
                            <label htmlFor="type_of_property" className="block text-base font-normal leading-6 text-sm"> <span>Name of Guests:</span> </label>
                          </div>
                        </div>
                        {displayDormFacility?.femaleNamesString === "N/A" ? (
                          <span className="font-normal text-sm">No Female Guest</span>
                        ):(
                          displayDormFacility?.femaleNamesArray?.map((femaleName, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-3/4 text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
                            </div>
                          ))
                        )}

                      </div>

                    </div>

                    {/* Other Details */}
                    <div className="mt-4 ml-36">
                      <div className="flex">
                        <div className="w-full text-sm">
                          <span>Other Details:</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 mb-4 ml-40">
                      <div className="w-full">
                        <div className="w-10/12 border-b border-black font-regular text-sm text-left pl-2">
                        {displayDormFacility?.viewDormFacilityData?.other_details}
                        </div>
                      </div>
                    </div>

                  </td>
                </tr>
              </table>
              ):null}
              
              {/* Signature */}
              <table className="w-full border-collapse border border-black mt-2">
                <tr>

                  {/* Requestor */}
                  <td className="border border-black w-1/2 p-2">
                    <div className="text-sm font-arial">
                      Requested by:
                    </div>
                    <div className="relative">
                      <img
                          src={displayRequestFacility?.requestor?.signature}
                          style={{ position: 'absolute', width: '200px', top: '-19px', left: '60px' }}
                          alt="Signature"
                      />
                  </div>
                  <div className="text-center font-bold text-base relative mt-5">
                      {displayRequestFacility?.requestor?.name}
                  </div>
                  </td>

                  {/* Admin Manager */}
                  <td className="border w-1/2 border-black">
                    <div className="text-sm font-arial ml-6">
                    {displayRequestFacility?.viewFacilityData?.admin_approval === 1 ? 'Approved' 
                    : displayRequestFacility?.viewFacilityData?.admin_approval === 2 ? 'Disapproved'
                    : 'Approved / Disapproved by:' }
                    </div>
                    {displayRequestFacility?.viewFacilityData?.admin_approval === 1 || displayRequestFacility.viewFacilityData.admin_approval === 2  ? (
                      <div className="relative">
                        <img
                            src={displayRequestFacility?.manager?.signature}
                            style={{ position: 'absolute', width: '200px', top: '-19px', left: '60px' }}
                            alt="Signature"
                        />
                      </div>
                    ):null}
                    
                  <div className="text-center font-bold text-base relative mt-5">
                      {displayRequestFacility?.manager?.name}
                  </div>
                  </td>

                </tr>
                <tr>
                  <td className="border border-black w-1/2"></td>
                  <td className="border border-black w-1/2 text-center text-sm">Admin. Division Manager</td>
                </tr>
                <tr>
                  <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> {formatDateS(displayRequestFacility?.viewFacilityData?.date_requested)}</td>
                  <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> 
                    {displayRequestFacility?.viewFacilityData?.date_approve ? formatDateS(displayRequestFacility?.viewFacilityData?.date_approve) : null}
                  </td>
                </tr>
              </table>

              <table className="w-full border-collapse border border-black mt-1">
                <tr>

                  {/* For Admin Manager */}
                  <td className="border border-black w-1/2 p-2" style={{ verticalAlign: 'top' }}>
                    <div className="font-bold font-arial text-sm">
                      Instruction for the OPR for Action
                    </div>

                    <div className="px-5 font-arial mt-2 text-sm">
                      {displayRequestFacility?.viewFacilityData?.obr_instruct == 'N/A' ? (
                        displayRequestFacility?.viewFacilityData?.obr_instruct
                      ):(
                        <span style={{ textDecoration: 'underline' }}>{displayRequestFacility?.viewFacilityData?.obr_instruct}</span>
                      )}
                    </div>
                    
                  </td>

                  {/* For GSO */}
                  <td className="border border-black w-1/2 p-2 " style={{ verticalAlign: 'top' }}>
                    <div className="font-bold font-arial text-sm">
                      OPR Action
                    </div>
                    <div className="px-5 font-arial text-sm">
                      Comments / Concerns
                    </div>
                    <div className="px-5 font-arial">
                      
                      <div className="px-5 font-arial mt-2 text-sm">
                      {displayRequestFacility.viewFacilityData.obr_comment == 'N/A' ? (
                        displayRequestFacility.viewFacilityData.obr_comment
                      ):(
                        <span style={{ textDecoration: 'underline' }}>{displayRequestFacility.viewFacilityData.obr_comment}</span>
                      )}
                      </div>
                  
                    </div>
                  </td>
                </tr>
              </table>

            </div>
          </div>

        </div>
      </div>
      )}

    </div>
    )}
    </div>
    </PageComponent>
  );
}