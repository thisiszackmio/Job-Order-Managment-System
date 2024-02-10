import React from "react";
import PageComponent from "../components/PageComponent";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import Forbidden from "../components/403";

export default function FacilityFormForm(){

  const {id} = useParams();
  const { currentUser, userRole } = useUserStateContext();

  //Date
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time
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

  const [submitLoading, setSubmitLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [displayRequestFacility, setDisplayRequestFacility] = useState([]);

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('Test');
  const [popupContent, setPopupContent] = useState('');

  //OPR
  const [OprInstruct, setOprInstruct] = useState('');
  const [OprAction, setOprAction] = useState('');

  //Show Data List
  const fetchFacilityForm = () => {
    axiosClient
    .get(`/facilityform/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewFacilityData = responseData.main_form;
        const requestor = responseData.requestor;
        const manager = responseData.manager;

        const maleNamesString = viewFacilityData.name_male;
        const maleNamesArray = maleNamesString.split('\n');

        const femaleNamesString = viewFacilityData.name_female;
        const femaleNamesArray = femaleNamesString.split('\n');

        setDisplayRequestFacility({
          viewFacilityData: viewFacilityData,
          requestor:requestor,
          manager:manager,
          maleNamesArray:maleNamesArray,
          maleNamesString:maleNamesString,
          femaleNamesString:femaleNamesString,
          femaleNamesArray:femaleNamesArray
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
  },[id]);

  const oprInstrucValue = OprInstruct === null || OprInstruct.trim() === "" ? "None" : OprInstruct;
  const oprActionValue = OprAction === null || OprAction.trim() === "" ? "None" : OprAction;

  //Popup Notification
  const DevErrorText = (
    <div>
      <p>There is something wrong!</p>
      <p>Please contact the developer</p>
    </div>
  );

  const OPRInstructSuccessMessage = (
    <div>
      <p>Form submit successfully!</p>
      <p>Thank You {currentUser.gender == "Male" ? "Sir":"Maam"} {currentUser.fname}!</p>
    </div>
  );

  const OPRActionSuccessMessage = (
    <div>
      <p>Form submit successfully!</p>
      <p>Thank You {currentUser.gender == "Male" ? "Sir":"Maam"} {currentUser.fname}!</p>
    </div>
  );

  const AdminConfirmText = (
    <div>
      <p>Do you want to approve</p>
      {displayRequestFacility?.viewRequestData?.user_id == currentUser.id ? null:(
        <p><strong>{displayRequestFacility?.requestor?.name}'s</strong> request?</p>
      )}
    </div>
  );

  const AdminApproveText = (
    <div>
      <p>Form Request Approved!</p>
      <p>Thank You {currentUser.gender == "Male" ? "Sir":"Maam"} {currentUser.fname}!</p>
    </div>
  );

  const AdminDeclineText = (
    <div>
      <p>Do you want to disapprove</p>
      {displayRequestFacility?.viewRequestData?.user_id == currentUser.id ? null:(
        <p><strong>{displayRequestFacility?.requestor?.name}'s</strong> request?</p>
      )}
    </div>
  );

  const AdminDisapproveText = (
    <div>
      <p>Form Request Disapproved!</p>
      <p>Thank You {currentUser.gender == "Male" ? "Sir":"Maam"} {currentUser.fname}!</p>
    </div>
  );

  //Submit OPR Instruction
  const SubmitOPRInstruct = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`facilityopradmin/${id}`,{
      obr_instruct: oprInstrucValue
    })
    .then((response) => {
      setPopupContent("success");
      setPopupMessage(OPRInstructSuccessMessage); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Submit OPR Action Comment
  const SubmitOPRAction = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`facilityopr/${id}`,{
      obr_comment: oprActionValue
    })
    .then((response) => {
      setPopupContent("success");
      setPopupMessage(OPRActionSuccessMessage); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  //Admin Approval
  function handleAdminApproveConfirmation(){
    setPopupContent("warning");
    setShowPopup(true);
    setPopupMessage(AdminConfirmText);
  };

  function handleApproveClick(id){

    setSubmitLoading(true);

    axiosClient.put(`/facilityapproval/${id}`)
    .then((response) => {
      setPopupContent("yehey");
      setPopupMessage(AdminApproveText);
      setShowPopup(true);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
      setSubmitLoading(false);
    });
  };

  //Admin Disapproval
  function handleDisapproveConfirmation(){
    setPopupContent("warningD");
    setShowPopup(true);
    setPopupMessage(AdminDeclineText);
  };
  
  function handleDisapproveClick(id){

    setSubmitLoading(true);

    axiosClient.put(`/facilitydisapproval/${id}`)
    .then((response) => {
      setPopupContent("success");
      setPopupMessage(AdminDisapproveText);
      setShowPopup(true);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
      setSubmitLoading(false);
    });

  };

  const justclose = () => {
    setShowPopup(false);
  };

  const closePopup = () => {
    window.location.reload();
    setIsLoading(true);
    setShowPopup(false);
  };

  //Generate PDF Section
  const componentRef= useRef();

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

  //Restrictions
  const Users = userRole == 'hackers' || userRole == 'admin';
  const Facility_Room = displayRequestFacility?.viewFacilityData?.mph || displayRequestFacility?.viewFacilityData?.conference || displayRequestFacility?.viewFacilityData?.other;
  const Facility_Dorm = displayRequestFacility?.viewFacilityData?.dorm;
  
  return Users ? (
  <PageComponent title="Facility/Venue Form">
  {isLoading ? (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
    <img
      className="mx-auto h-44 w-auto"
      src={loadingAnimation}
      alt="Your Company"
    />
    <span className="ml-2 animate-heartbeat">Loading Facility/Venue Form</span>
  </div>
  ):(
  <>
    {/* Main Form */}
    <div className="border-b border-black pb-10">

      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Main Form </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date */}
          <div className="flex items-center mt-6">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(displayRequestFacility?.viewFacilityData?.date_requested)}
            </div>
          </div>

          {/* Request Office */}
          <div className="flex items-center mt-2">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Request Office/Division:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequestFacility?.viewFacilityData?.request_office}
            </div>
          </div>

          {/* Title/Purpose of Activity */}
          <div className="flex items-center mt-2">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Title/Purpose of Activity:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequestFacility?.viewFacilityData?.title_of_activity}
            </div>
          </div>

          {/* Date of Activity */}
          <div className="flex items-center mt-2">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date of Activity:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
              {displayRequestFacility?.viewFacilityData?.date_start === displayRequestFacility?.viewFacilityData?.date_end ? (
              <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} </span>
              ):(
              <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} to {formatDate(displayRequestFacility?.viewFacilityData?.date_end)} </span>
              )}
            </div>
          </div>

          {/* Time of Activity */}
          <div className="flex items-center mt-2">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Time of Activity (START and END):
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
              {displayRequestFacility?.viewFacilityData?.date_start === displayRequestFacility?.viewFacilityData?.date_end ? (
              <span> {formatTime(displayRequestFacility?.viewFacilityData?.time_start)} to {formatTime(displayRequestFacility?.viewFacilityData?.time_end)}</span>
              ):(
              <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} ({formatTime(displayRequestFacility?.viewFacilityData?.time_start)}) to {formatDate(displayRequestFacility?.viewFacilityData?.date_end)} ({formatTime(displayRequestFacility?.viewFacilityData?.time_end)}) </span>
              )}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Type of Facility */}
          <div className="flex items-center mt-6">
            <div className="w-64">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Facility/ies Venue being Requested:
              </label> 
            </div>
          </div>

          {/* Multi-Purpose Hall */}
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-6 h-6 border border-black mr-2 flex items-center justify-center text-black font-bold"> 
                {displayRequestFacility?.viewFacilityData?.mph == 1 || 
                displayRequestFacility?.viewFacilityData?.mph == 2 || 
                displayRequestFacility?.viewFacilityData?.mph == 3
                ? 'X' : null} 
              </div>
              <span style={{ fontWeight: 'bold' }}>Multi-Purpose Hall (MPH)</span>
            </div>
          </div>

          {/* Conference Room */}
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-6 h-6 border border-black mr-2 flex items-center justify-center text-black font-bold">
                {displayRequestFacility?.viewFacilityData?.conference == 1 || 
                displayRequestFacility?.viewFacilityData?.conference == 2 ||
                displayRequestFacility?.viewFacilityData?.conference == 3
                ? 'X' : null}
              </div>
              <span style={{ fontWeight: 'bold' }}>Conference Room</span>
            </div>
          </div>

          {/* Dormitory */}
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-6 h-6 border border-black mr-2 flex items-center justify-center text-black font-bold">
                {displayRequestFacility?.viewFacilityData?.dorm == 1 || 
                displayRequestFacility?.viewFacilityData?.dorm == 2 ||
                displayRequestFacility?.viewFacilityData?.dorm == 3
                ? 'X' : null}
              </div>
              <span style={{ fontWeight: 'bold' }}>Dormitory</span>
            </div>
          </div>

          {/* Others */}
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-6 h-6 border border-black mr-2 flex items-center justify-center text-black font-bold">
                {displayRequestFacility?.viewFacilityData?.other == 1 || 
                displayRequestFacility?.viewFacilityData?.other == 2 ||
                displayRequestFacility?.viewFacilityData?.other == 3
                ? 'X' : null}
              </div>
              <span style={{ fontWeight: 'bold' }}>Others</span>
            </div>
          </div>

        </div>

      </div>

    </div>

    {/* For Facility Room */}
    {Facility_Room ? (
    <div className="mt-4 border-b border-black pb-10">

      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others  </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">
          
          {/* Table */}
          <div className="mt-4">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.table ? 'X':null}
              </div>
              <div className="w-12 ml-1">
                <span>Tables</span>
              </div>
              <div className="w-30 ml-2">
              (No.<span className="border-b border-black px-5 font-bold text-center"> 
                {displayRequestFacility?.viewFacilityData?.no_table ? displayRequestFacility?.viewFacilityData?.no_table:null} 
              </span>)
              </div>
            </div>
          </div>

          {/* Chair */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.chair ? 'X':null}
              </div>
              <div className="w-12 ml-1">
                <span>Chair</span>
              </div>
              <div className="w-30 ml-2">
              (No.<span className="border-b border-black px-5 font-bold text-center"> 
                {displayRequestFacility?.viewFacilityData?.no_chair ? displayRequestFacility?.viewFacilityData?.no_chair:null} 
              </span>)
              </div>
            </div>
          </div>

          {/* Projector */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.projector ? 'X':null}
              </div>
              <div className="w-16 ml-1">
                <span>Projector</span>
              </div>
            </div>
          </div>

          {/* Projector Screen */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.projector_screen ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Projector Screen</span>
              </div>
            </div>
          </div>

          {/* Document Camera */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.document_camera ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Document Camera</span>
              </div>
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Laptop */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.laptop ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Laptop</span>
              </div>
            </div>
          </div>

          {/* Television */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.television ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Television</span>
              </div>
            </div>
          </div>

          {/* Sound System */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.sound_system ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Sound System</span>
              </div>
            </div>
          </div>

          {/* Videoke */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.videoke ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Videoke</span>
              </div>
            </div>
          </div>

          {/* Microphone */}
          <div className="mt-2">
            <div className="flex">
              <div className="w-20 border-b border-black pl-1 font-bold text-center">
              {displayRequestFacility?.viewFacilityData?.microphone ? 'X':null}
              </div>
              <div className="w-26 ml-1">
                <span>Microphone</span>
              </div>
              <div className="w-30 ml-2">
              (No.<span className="border-b border-black px-5 font-bold text-center"> 
                {displayRequestFacility?.viewFacilityData?.no_microphone ? displayRequestFacility?.viewFacilityData?.no_microphone:null} 
              </span>)
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Others */}
      <div className="mt-2">
        <div className="flex">
          <div className="w-20 border-b border-black pl-1 font-bold text-center">
          {displayRequestFacility?.viewFacilityData?.others ? 'X':null}
          </div>
          <div className="w-26 ml-1">
            <span>Others,</span>
          </div>
          <div className="w-28 ml-2">
          please specify
          </div>
          <div className="w-1/2 border-b border-black px-5 font-bold text-center"> 
            {displayRequestFacility?.viewFacilityData?.specify ? displayRequestFacility?.viewFacilityData?.specify:null} 
          </div>
        </div>
      </div>

    </div>
    ):null}

    {/* For Dormitory Room */}
    {Facility_Dorm ? (
    <div className="mt-4 border-b border-black pb-10">

      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> * For the Dormitory  </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* For Male Guest */}
        <div className="col-span-1">
          
          {/* Male Guest Count */}
          <div className="mt-0 mb-6">
            <div className="flex items-center">
              <div className="w-24 border-b border-black font-bold text-center">
                <span>
                  {displayRequestFacility?.maleNamesString === "N/A" ? null : (
                    displayRequestFacility?.femaleNamesArray?.length
                  )}
                </span>
              </div>
              <div className="ml-2">
                <strong>No. of Male Guests</strong>
              </div>
            </div>
          </div>

          {/* Male Guest List */}
          <div className="mt-6">
            <div className="mb-4">
              <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Name of Guests:</strong> </label>
            </div>
          </div>
          {displayRequestFacility?.maleNamesString === "N/A" ? (
            <span className="font-meduim">No Male Guest</span>
          ):(
            displayRequestFacility?.maleNamesArray?.map((maleName, index) => (
              <div key={index} className="flex">
                <span className="font-bold">{`${index + 1}.`}</span>
                <div className="w-1/2 border-b border-black pl-1 text-left ml-1 pl-2">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
              </div>
            ))
          )}

        </div>

        {/* For Female Guest */}
        <div className="col-span-1">
          
          {/* Female Guest Count */}
          <div className="mt-0 mb-6">
            <div className="flex items-center">
              <div className="w-24 border-b border-black font-bold text-center">
                <span>
                  {displayRequestFacility?.maleNamesString === "N/A" ? null : (
                    displayRequestFacility?.maleNamesArray?.length
                  )}
                </span>
              </div>
              <div className="ml-2">
                <strong>No. of Male Guests</strong>
              </div>
            </div>
          </div>

          {/* Female Guest List */}
          <div className="mt-6">
            <div className="mb-4">
              <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Name of Guests:</strong> </label>
            </div>
          </div>
          {displayRequestFacility?.femaleNamesString === "N/A" ? (
            <span className="font-meduim">No Female Guest</span>
          ):(
            displayRequestFacility?.femaleNamesArray?.map((femaleName, index) => (
              <div key={index} className="flex">
                <span className="font-bold">{`${index + 1}.`}</span>
                <div className="w-1/2 border-b border-black pl-1 text-left ml-1 pl-2">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
    ):null}

    {/* Footer */}
    <div className="border-b border-black pb-6">

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Requested by */}
          <div className="flex items-center mt-4">
            <div className="w-32">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Requested by:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1 font-bold">
            {displayRequestFacility?.requestor?.name}
            </div>
          </div>

          {/* Approver */}
          <div className="flex items-center mt-2">
            <div className="w-32">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Approver:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1 font-bold">
            {displayRequestFacility?.manager?.name}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center mt-8">
            <div className="w-16">
              <label className="block text-base font-bold leading-6 text-gray-900">
              Status:
              </label> 
            </div>
            <div className="w-72 font-bold">
              {displayRequestFacility?.viewFacilityData?.admin_approval == 1 || displayRequestFacility?.viewFacilityData?.admin_approval == 2
                ? "Approved"
                : displayRequestFacility?.viewFacilityData?.admin_approval == 3
                ? "Disapproved"
                : "Pending"}
            </div>
          </div> 

        </div>

        <div className="col-span-1">

          {/* For OPR Instruction */}
          <div className="flex mt-6">
            <div className="w-80">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Instruction for the OPR for Action:
              </label> 
            </div>
            {displayRequestFacility?.viewFacilityData?.obr_instruct ? (
            <>
              <div className="w-96 pl-1 border-b border-black">
                {displayRequestFacility?.viewFacilityData?.obr_instruct}
              </div>
            </>
            ):(
            <>
              {currentUser.code_clearance == 1 ? (
              <>
                <div className="w-96 pl-1">

                  <form id="opr-form-admin" onSubmit={SubmitOPRInstruct}>

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

                    </form>

                </div>
              </>
              ):(
              <>
                <div className="w-96 pl-1 border-b border-black">
                  {displayRequestFacility?.viewFacilityData?.obr_instruct}
                </div>
              </>
              )}
            </>
            )}
          </div>

          {/* OPR Action */}
          <div className="flex mt-2">
            <div className="w-80">
              <label className="block text-base font-medium leading-6 text-gray-900">
              OPR Action (Comment/Concerns):
              </label> 
            </div>
            {displayRequestFacility?.viewFacilityData?.obr_comment ? (
            <>
              <div className="w-96 pl-1 border-b border-black">
                {displayRequestFacility?.viewFacilityData?.obr_comment}
              </div>
            </>
            ):(
            <>
              {currentUser.code_clearance == 3 ? (
              <>
                <div className="w-96 pl-1">

                  <form id="opr-form-gso" onSubmit={SubmitOPRAction}>
                    <textarea
                      id="findings"
                      name="findings"
                      rows={3}
                      style={{ resize: "none" }}
                      value= {OprAction}
                      onChange={ev => setOprAction(ev.target.value)}
                      className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <p className="text-gray-500 text-xs mt-0 mb-2">If you have no instructions, please submit the form</p>
                  </form>

                </div>
              </>
              ):(
              <>
                <div className="w-96 pl-1 border-b border-black">
                  {displayRequestFacility?.viewFacilityData?.obr_comment}
                </div>
              </>
              )}
              
            </>
            )}
          </div>

        </div>

      </div>     

    </div>

    {/* Buttons */}
    <div className="flex mt-4">

    {/* Main Button */}
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-1 text-sm">
      <Link to="/">Back to Dashboard</Link>
    </button>

    {/* Generate PDF */}
    {displayRequestFacility?.viewFacilityData?.admin_approval == 1 && (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`rounded-md px-3 py-2 font-bold text-white shadow-sm focus:outline-none ${
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
    </>
    )}
    
    {/* For Admin */}
    {currentUser.code_clearance == 1 && (
    <>
      {displayRequestFacility?.viewFacilityData?.obr_instruct ? (
      <>
        {displayRequestFacility?.viewFacilityData?.admin_approval != 2 ? (
        <>
          {/* Approve */}
          <button 
            onClick={() => handleAdminApproveConfirmation()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-sm"
            title="Admin Approve"
          >
            Approve
          </button>

          {/* Disapprove */}
          <button 
            onClick={() => handleDisapproveConfirmation()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-1 text-sm"
            title="Admin Decline"
          >
            Decline
          </button>
        </>
        ):null}
      </>
      ):(
      <>
        <button
          form='opr-form-admin'
          type="submit"
          className={`rbg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded text-sm focus:outline-none ${
            submitLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          style={{ position: 'relative', top: '0px' }}
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
      </>
      )}
    
    </>
      // <button
      //   form='opr-form-admin'
      //   type="submit"
      //   className={`rbg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded text-sm focus:outline-none ${
      //     submitLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
      //   }`}
      //   style={{ position: 'relative', top: '0px' }}
      //   disabled={submitLoading}
      // >
      //   {submitLoading ? (
      //     <div className="flex items-center justify-center">
      //       <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
      //       <span className="ml-2">Processing...</span>
      //     </div>
      //   ) : (
      //     'Submit'
      //   )}
      // </button>
    )}
    
    {/* For GSO */}
    {(displayRequestFacility?.viewFacilityData?.obr_comment == null) &&
    currentUser.code_clearance == 3 && (
      <button
        form='opr-form-gso'
        type="submit"
        className={`rbg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded text-sm focus:outline-none ${
          submitLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
        style={{ position: 'relative', top: '0px' }}
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
    )}

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
        
        {/* Notification Icons */}
        <div class="f-modal-alert">

          {/* Error */}
          {popupContent == "error" && (
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
          {(popupContent == "warning" || popupContent == "warningD") && (
          <>
            <div class="f-modal-icon f-modal-warning scaleWarning">
              <span class="f-modal-body pulseWarningIns"></span>
              <span class="f-modal-dot pulseWarningIns"></span>
            </div>
          </> 
          )}

          {/* Success */}
          {popupContent == "success" && (
          <>
          <div class="f-modal-icon f-modal-success animate">
            <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
            <span class="f-modal-line f-modal-long animateSuccessLong"></span>
          </div>
          </>
          )}

          {/* Heart */}
          {popupContent == "yehey" && (
          <>
          <div className="icon-center">
            <svg className="w-44 h-44" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="-40 -30 473.9 473.9" style={{"enable-background":"new 0 0 473.9 473.9"}} xml:space="preserve">
              <circle id="face" className="face" cx="200" cy="200" r="200"/>
              <path id="mouth" className="mouth_alt" d="M81.4,237.1C81.4,323,151,392.7,237,392.7c85.9,0,155.6-69.6,155.6-155.6L81.4,237.1L81.4,237.1z"/>
              <path className="heart--eye heart-eye-left" d="M182.1,110c-14.1,0-27.3,6.9-35.2,18.4l-1.6,2.1l-1.1-1.4c-7.8-12-21-19.1-35.2-19.1
                c-24.4,0-42,17.7-42,42c0,36,65.1,89,69.9,92.8c2.2,2.1,5.2,3.3,8.3,3.3s6-1.2,8.3-3.3c4.8-3.8,70.8-57.7,70.8-92.8
                C224.2,127.7,206.5,110,182.1,110z"/>
              <path className="heart--eye heart-eye-right" d="M366.7,110c-14.1,0-27.3,6.9-35.2,18.4l-1.6,2.1l-1.1-1.4c-7.8-12-21-19.1-35.2-19.1
                c-24.4,0-42,17.7-42,42c0,36,65.1,89,69.9,92.8c2.2,2.1,5.2,3.3,8.3,3.3c3.1,0,6-1.2,8.3-3.3c4.8-3.8,70.7-57.7,70.7-92.8
                C408.7,127.7,391.1,110,366.7,110z"/>  
            </svg>
          </div>
          </>  
          )}

        </div>
        
        {/* Popup Message */}
        <p className="text-lg text-center">
          {popupMessage}
        </p>

        {/* Popup Buttons */}
        <div className="flex justify-center mt-4">

        {/* Approve Button */}
        {popupContent == "warning" && (
        <>
          {currentUser.code_clearance == 1 && (
          <>
            {!submitLoading && (
              <button
                onClick={() => handleApproveClick(displayRequestFacility?.viewFacilityData?.id)}
                className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Yes
              </button>
            )}

            {!submitLoading && (
              <button
                onClick={justclose}
                className="w-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
              >
                No
              </button>
            )}

            {submitLoading && (
              <button className="w-full px-4 py-2 bg-blue-300 text-white rounded cursor-not-allowed">
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Loading</span>
                </div>
              </button>
            )}
          </> 
          )}
        </>
        )}

        {/* Disapprove Button */}
        {popupContent == "warningD" && (
        <>
        {currentUser.code_clearance == 1 && (
          <>
            {!submitLoading && (
              <button
              onClick={() => handleDisapproveClick(displayRequestFacility?.viewFacilityData?.id)}
                className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Yes
              </button>
            )}

            {!submitLoading && (
              <button
                onClick={justclose}
                className="w-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
              >
                No
              </button>
            )}

            {submitLoading && (
              <button className="w-full px-4 py-2 bg-blue-300 text-white rounded cursor-not-allowed">
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Loading</span>
                </div>
              </button>
            )}
          </> 
          )}
        </>
        )}

        {/* Success Button */}
        {(popupContent == "yehey" || 
        popupContent == "success" ) && (
        <>
          <button
            onClick={closePopup}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </>
        )}

        {/* Error Message */}
        {popupContent == "error" && (
        <>
          <button
            onClick={justclose}
            className="w-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
          >
            Close
          </button>
        </>
        )}

        </div> 
      </div>
      </div>
    )}

    {/* Generate PFD */}
    {isVisible && (
    <div>

      <div className="hidden md:none">
        <div ref={componentRef}>
          <div style={{ width: '216mm', height: '330mm', paddingLeft: '30px', paddingRight: '30px', paddingTop: '10px', border: '0px solid' }}>

            {/* Control Number */}
            <div className="title-area font-arial pr-6 text-right">
              <span>Control No:</span>{" "}
              <span style={{ textDecoration: "underline", fontWeight: "900" }}>
                _______
                {displayRequestFacility?.viewFacilityData?.id}
                _______
              </span>
            </div>

            {/* Main Form */}
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
                  <div className="border-black text-xs px-3 py-3" style={{ fontWeight: 'bold' }}>DATE: {formatDate(displayRequestFacility?.viewFacilityData?.date_requested)}</div>
                </td>
              </tr>

              {/* Black */}
              <tr>
                <td colSpan={3} className="border border-black p-1 font-arial"></td>
              </tr>

              {/* Form */}
              <tr>
                <td colSpan={3} className="border border-black pl-2 pr-2 pb-2 font-arial">

                  {/* Request Office/Division */}
                  <div className="mt-2">
                    <div className="flex">
                      <div className="w-60 text-sm">
                        <span>Request Office/Division:</span>
                      </div>
                      <div className="w-96 border-b border-black pl-1 text-sm">
                        <span>{displayRequestFacility?.viewFacilityData?.request_office}</span>
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
                        <span> {displayRequestFacility?.viewFacilityData?.title_of_activity} </span>
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
                      {displayRequestFacility?.viewFacilityData?.date_start === displayRequestFacility?.viewFacilityData?.date_end ? (
                      <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} </span>
                      ):(
                      <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} to {formatDate(displayRequestFacility?.viewFacilityData?.date_end)} </span>
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
                      {displayRequestFacility?.viewFacilityData?.date_start === displayRequestFacility?.viewFacilityData?.date_end ? (
                      <span> {formatTime(displayRequestFacility?.viewFacilityData?.time_start)} to {formatTime(displayRequestFacility?.viewFacilityData?.time_end)}</span>
                      ):(
                      <span> {formatDate(displayRequestFacility?.viewFacilityData?.date_start)} ({formatTime(displayRequestFacility?.viewFacilityData?.time_start)}) to {formatDate(displayRequestFacility?.viewFacilityData?.date_end)} ({formatTime(displayRequestFacility?.viewFacilityData?.time_end)}) </span>
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
                  
                  {/* 4 Facilities */}
                  <div className="mt-4">
                    <div className="w-full">
                      <div className="grid grid-cols-4 gap-1">

                        {/* MPH */}
                        <div className="col-span-1">
                          <div className="flex items-start text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-start justify-center text-black"> 
                              {displayRequestFacility?.viewFacilityData?.mph == 1 ? 'X' : null} 
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Multi-Purpose Hall (MPH)</span>
                          </div>
                        </div>

                        {/* Conference */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {displayRequestFacility?.viewFacilityData?.conference == 1 ? 'X' : null}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Conference Room</span>
                          </div>
                        </div>

                        {/* Dorm */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {displayRequestFacility?.viewFacilityData?.dorm == 1 ? 'X' : null}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Dormitory</span>
                          </div>
                        </div>

                        {/* Other */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {displayRequestFacility?.viewFacilityData?.other == 1 ? 'X' : null}
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

            {/* For Facility Room */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>
                <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2">

                  <div className="text-sm mt-1">
                    <span>* For the Multi-Purpose Hall / Conference Room / Others: </span>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="w-full">

                      <div className="grid grid-cols-2 gap-4">
                        
                        <div className="col-span-1 ml-36">

                          {/* Table */}
                          <div className="mt-0">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                                {displayRequestFacility?.viewFacilityData?.table === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Tables</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayRequestFacility?.viewFacilityData?.no_table ? displayRequestFacility?.viewFacilityData?.no_table:null} </span> )
                              </div>
                            </div>
                          </div>

                          {/* Chair */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black text-xs pl-1 text-center h-4">
                                {displayRequestFacility?.viewFacilityData?.chair === 1 ? 'X':null}
                              </div>
                              <div className="w-10 text-sm mr-1 ml-1">
                                <span>Chairs</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 text-center mr-1"> {displayRequestFacility?.viewFacilityData?.no_chair ? displayRequestFacility?.viewFacilityData?.no_chair:null} </span>)
                              </div>
                            </div>
                          </div>

                          {/* Projector */}
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-12 border-b border-black pl-1 text-xs text-center h-4">
                                {displayRequestFacility?.viewFacilityData?.projector === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.projector === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.document_camera === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.laptop === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.television === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.sound_system === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.videoke === 1 ? 'X':null}
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
                                {displayRequestFacility?.viewFacilityData?.microphone === 1 ? 'X':null}
                              </div>
                              <div className="w-22 text-sm mr-1 ml-1">
                                <span>Microphone</span>
                              </div>
                              <div className="w-30 text-sm">
                              (No.<span className="border-b border-black px-2 mr-1 text-center"> {displayRequestFacility?.viewFacilityData?.no_microphone ? displayRequestFacility?.viewFacilityData?.no_microphone:null} </span>)
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
                              {displayRequestFacility?.viewFacilityData?.others === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Others</span>, please specify
                            </div>
                            <div className="w-1/2 border-b p-0 pl-2 border-black text-sm text-left ml-1">
                            <span className=""> {displayRequestFacility?.viewFacilityData?.specify ? displayRequestFacility?.viewFacilityData?.specify:null} </span>
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

            {/* For Dormitory */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>
                <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2 pb-6">

                  <div className="text-sm mt-1">
                    <span>* For the Dormitory</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">

                    {/* Male Guest */}
                    <div className="col-span-1 ml-16">

                        {/* Male Count */}
                        <div>
                          <div className="flex">
                            <div className="w-10 border-b border-black font-normal text-center text-sm">
                              <span>
                              {displayRequestFacility?.maleNamesString === "N/A" ? null:(
                                displayRequestFacility?.maleNamesArray?.length
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
                        {displayRequestFacility?.maleNamesString === "N/A" ? (
                         <div>
                          {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2"></div>
                            </div>
                          ))}
                        </div>
                        ):(
                          displayRequestFacility?.maleNamesArray?.map((maleName, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
                            </div>
                          ))
                        )}

                    </div>

                    {/* Female Guest */}
                    <div className="col-span-1">

                      {/* Female Count */}
                      <div>
                        <div className="flex">
                          <div className="w-10 border-b border-black font-normal text-center text-sm">
                            <span>
                            {displayRequestFacility?.femaleNamesString === "N/A" ? null:(
                              displayRequestFacility?.femaleNamesArray?.length
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
                        {displayRequestFacility?.femaleNamesString === "N/A" ? (
                          <div>
                            {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1 pr-10">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2"></div>
                            </div>
                          ))}
                          </div>
                        ):(
                          displayRequestFacility?.femaleNamesArray?.map((femaleName, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-3/4 text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
                            </div>
                          ))
                        )}
                        
                    </div>

                  </div>

                  
                  {/* Other Details */}
                  <div className="mt-4 ml-16">
                    <div className="flex">
                      <div className="w-24 text-sm">
                        <span>Other Details:</span>
                      </div>
                      <div className="w-3/4 border-b border-black font-regular text-sm text-left pl-2">
                      {displayRequestFacility?.viewDormFacilityData?.other_details}
                      </div>
                    </div>
                  </div>

                </td>
              </tr>
            </table>

            {/* Footer */}
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
                        style={{ position: 'absolute', width: '180px', top: '-10px', left: '98px' }}
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
                    : displayRequestFacility?.viewFacilityData?.admin_approval === 2 ? 'Approved'
                    : displayRequestFacility?.viewFacilityData?.admin_approval === 3 ? 'Disapproved'
                    : 'Approved / Disapproved by:' }
                    </div>
                    {displayRequestFacility?.viewFacilityData?.admin_approval === 1 || displayRequestFacility.viewFacilityData.admin_approval === 2  ? (
                      <div className="relative">
                        <img
                          src={displayRequestFacility?.manager?.signature}
                          style={{ position: 'absolute', width: '180px', top: '-10px', left: '98px' }}
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
                <td className="border border-black w-1/2 text-center text-sm">{displayRequestFacility?.requestor?.position}</td>
                <td className="border border-black w-1/2 text-center text-sm">Admin. Division Manager</td>
              </tr>
              <tr>
                  <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> {formatDate(displayRequestFacility?.viewFacilityData?.date_requested)}</td>
                  <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> 
                    {displayRequestFacility?.viewFacilityData?.date_approve ? formatDate(displayRequestFacility?.viewFacilityData?.date_approve) : null}
                  </td>
                </tr>
            </table>

            {/* OPR */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>

                {/* For OPR Instruction */}
                <td className="border border-black w-1/2 p-2" style={{ verticalAlign: 'top' }}>
                  <div className="font-bold font-arial text-sm">
                    Instruction for the OPR for Action
                  </div>

                  <div className="px-5 font-arial mt-2 text-sm">
                    {displayRequestFacility?.viewFacilityData?.obr_instruct == 'N/A' ? (
                      displayRequestFacility?.viewFacilityData?.obr_instruct
                    ):(
                      <span className="underline-text">{displayRequestFacility?.viewFacilityData?.obr_instruct}</span>
                    )}
                  </div>  
                </td>

                {/* For OPR Action */}
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
                      <span className="underline-text">{displayRequestFacility.viewFacilityData.obr_comment}</span>
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
  </> 
  )}
  </PageComponent>
  ):(
    <Forbidden />
  );
}