import React from "react";
import PageComponent from "../components/PageComponent";
import ForbiddenComponent from "../components/403";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import Forbidden from "../components/403";

export default function PrePostRepairForm(){

  const { currentUser, userRole } = useUserStateContext();
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Get the ID
  const {id} = useParams();

  //Popup
  const [showPopupHappy, setShowPopupHappy] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //Functions
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [displayRequest, setDisplayRequest] = useState([]);
  const [getPartB, setPartB] = useState([]);
  const [getPartCD, setPartCD] = useState([]); 
  const [getPersonnel, setGetPersonnel] = useState([]);
  const [inputErrors, setInputErrors] = useState({});

  //UseState
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState('');
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [remarks, setRemarks] = useState('');

  //Personnel
  const fetchPersonnel = () => {
    axiosClient.get(`/getpersonnel/${id}`)
      .then((response) => {
        const responseData = response.data;
        const viewPersonnel = Array.isArray(responseData) ? responseData : responseData.data;
  
        const mappedData = viewPersonnel.map(({ personnel_details }) => {
          const { user_id, fname, mname, lname, type } = personnel_details;
          return {
            id: user_id,
            name: `${fname} ${mname}. ${lname}`,
            type: type
          };
        });
        setGetPersonnel({ mappedData });
      })
      .catch((error) => {
        console.error('Error fetching personnel data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //Assign Personnel
  const fetchPersonneData = () => {
    axiosClient
    .get(`/personnel/${id}`)
    .then((response) => {
      const responseData = response.data;
      const personnel_details = responseData.personnel_details;
    
      setAssignPersonnel({personnel_details});
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);
    });
  };

  //Part A
  const fetchPartA = () => {
    axiosClient
    .get(`/requestrepair/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewRequestData = responseData.view_request;
        const userDetails = responseData.user_details;
        const gsoDetails = responseData.gso_user_details;
        const manegerDetails = responseData.manager_user_details;

        setDisplayRequest({
          viewRequestData: viewRequestData,
          userDetails: userDetails,
          gsoDetails: gsoDetails,
          manegerDetails: manegerDetails,
        });
        setIsLoading(false);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
  };

  //Part B
  const fetchPartB = () => {
    axiosClient
    .get(`/requestrepairtwo/${id}`)
    .then((response) => {
      const responseData = response.data;
      const partBData = responseData.partB;

      setPartB({partBData});
      setIsLoading(false);

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  // Part C and D display
  const fetchPartCD = () => {
    axiosClient
    .get(`/requestpairthree/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewPartC = responseData.part_c;

      setPartCD({viewPartC});
      setIsLoading(false);
    
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchPersonnel();
    fetchPersonneData();
    fetchPartA();
    fetchPartB();
    fetchPartCD();
  },[id]);

   //Send the data on Part B
  const SubmitInspectionFormTo = (event, id) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient.post(`/inspectionformrequesttwo/${id}`,{
      date_of_filling: today,
      date_of_last_repair: lastfilledDate,
      nature_of_last_repair: natureRepair,
      assign_personnel: pointPersonnel
    })
    .then((response) => {
      setPopupMessage('Submit successfully'); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      //console.error(error);
      const responseErrors = error.response.data.errors;
      setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Submit the data on Part C
  const SubmitPartC = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`inspector/${id}`, {
      before_repair_date: today,
      findings: finding,
      recommendations: recommendation
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Submit successfully");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      // console.error('Error fetching data:', error);
      const responseErrors = error.response.data.errors;
      setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  //Submit the data on Part D
  const SubmitPartD = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`inspectorpartb/${id}`, {
      after_reapir_date: today,
      remarks: remarks
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Submit successfully");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  //Supervisor approval 
  function handleApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/approve/${id}`)
      .then((response) => {
        setPopupMessage(SupApproval);
        setShowPopupHappy(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }else{
      setPopupMessage("Okay " + (currentUser.gender === 'Male' ? "Sir" : "Maam") + " " + currentUser.fname);
      setShowPopup(true);
    }

  };

  //Supervisor disapproval 
  function handleDisapproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/disapprove/${id}`)
    .then((response) => {
        setPopupMessage(SupDecline);
        setShowPopup(true);
    })
    .catch((error) => {
      console.error(error);
      setPopupMessage('Failed to approve the form. Please try again later.');
      setShowPopup(true);
    });
    }
    else{
      setPopupMessage("Okay " + (currentUser.gender === 'Male' ? "Sir" : "Maam") + " " + currentUser.fname);
      setShowPopup(true);
    }
  }

  //Admin approval
  function handleAdminApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/admin_approve/${id}`)
      .then((response) => {
        setPopupMessage(AdminApproval);
        setShowPopupHappy(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }else{
      setPopupMessage("Okay " + (currentUser.gender === 'Male' ? "Sir" : "Maam") + " " + currentUser.fname);
      setShowPopup(true);
    }

  }

  //Admin disapproval
  function handleAdminDisapproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/admin_disapprove/${id}`)
      .then((response) => {
        setPopupMessage(AdminDecline);
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }
    else{
      setPopupMessage("Okay " + (currentUser.gender === 'Male' ? "Sir" : "Maam") + " " + currentUser.fname);
      setShowPopup(true);
    }
  }

  //Close the request
  function handleCloseRequest(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to close the request?');

    if(confirmed) {
      axiosClient.put(`/requestclose/${id}`)
      .then((response) => {
        setPopupMessage('Request Close');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed. Please try again later.');
        setShowPopup(true);
      });
    }else{
      alert('You change your mind');
    }

  }

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Inspection-Control-No:${id}`
  });

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

  const SupApproval = (
    <div>
      {currentUser.id == displayRequest?.viewRequestData?.user_id  ? (
      <>
      <p>You Approving your own Request</p>
      <p>Thanks</p>
      </>
      ):(
      <>
      <p>Thank You {currentUser.gender == 'Male' ? ("Sir"):("Maam")} {currentUser.fname}</p>
      <p>For Approving my Request</p>
      </>
      )}
    </div>
  );
  const SupDecline = (
    <div>
      {currentUser.id == displayRequest?.viewRequestData?.supervisor_name ? (
      <>
      <p>You Decline your own Request</p>
      <p>Thanks</p>
      </>
      ):(
      <>
      <p>Form Request Decline</p>
      <p>Thank You {currentUser.gender == 'Male' ? ("Sir"):("Maam")} {currentUser.fname}</p>
      </>
      )}
      
    </div>
  );
  const AdminApproval = (
    <div>
      <p>Thank You {currentUser.gender == 'Male' ? ("Sir"):("Maam")} {currentUser.fname}</p>
      <p>For Approving my Request</p>
    </div>
  );
  const AdminDecline = (
    <div>
      <p>Form Request Decline</p>
      <p>Thank You {currentUser.gender == 'Male' ? ("Sir"):("Maam")} {currentUser.fname}</p>
    </div>
  );

  //Restrictions
  const requestlistClearance = [1, 2, 3, 10];
  const here = requestlistClearance.includes(currentUser.code_clearance);
  const Users = userRole == 'hackers' || userRole == 'admin' || userRole == 'personnels';
  const Supervisor = currentUser.id == displayRequest?.viewRequestData?.supervisor_name && displayRequest?.viewRequestData?.supervisor_approval == 0;
  const GSo = currentUser.code_clearance == 3 && displayRequest?.viewRequestData?.supervisor_approval == 1;
  const Admin = currentUser.code_clearance == 1 && displayRequest?.viewRequestData?.admin_approval == 3; 
  const Personnel = currentUser.code_clearance == 6 || assignPersonnel?.personnel_details?.p_id == currentUser.id || currentUser.code_clearance == 10;
  const validCodeClearances = [6, 3, 10];
  const Close = validCodeClearances.includes(currentUser.code_clearance) || currentUser.id == getPartB?.partBData?.assign_personnel;
  
  const closePopup = () => {
    fetchPersonneData();
    fetchPartA();
    fetchPartB();
    fetchPartCD();
    setIsLoading(true)
    setShowPopupHappy(false);
    setShowPopup(false);
    window.location.reload();
  };

  return Users ? (
  <PageComponent title="Pre-Repair/Post Repair Inspection Form">
  {isLoading ? (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
    <img
      className="mx-auto h-44 w-auto"
      src={loadingAnimation}
      alt="Your Company"
    />
    <span className="ml-2 animate-heartbeat">Loading Request Inpection Form</span>
  </div>
  ):(
  <>
    {/* Part A */}
    <div className="border-b border-black pb-10">

      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date */}
          <div className="flex items-center mt-6">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(displayRequest?.viewRequestData?.date_of_request)}
            </div>
          </div>

          {/* Property No */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Property No:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.property_number}
            </div>
          </div>

          {/* Acquisition Date */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Acquisition Date:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(displayRequest?.viewRequestData?.acq_date)}
            </div>
          </div>

          {/* Acquisition Cost */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Acquisition Cost:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            ₱{displayRequest?.viewRequestData?.acq_cost}
            </div>
          </div>

          {/* Brand/Model */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Brand/Model:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.brand_model}
            </div>
          </div>

          {/* Serial/Engine No */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Serial/Engine No:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.serial_engine_no}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Type of Property */}
          <div className="flex items-center mt-6">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Type of Property:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.type_of_property == 'Others' ? (
            <span>Others: <i>{displayRequest?.viewRequestData?.property_other_specific}</i></span>
            ):(
              displayRequest?.viewRequestData?.type_of_property
            )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Description:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.property_description}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Location:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.location}
            </div>
          </div>

          {/* Complain */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Complain:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {displayRequest?.viewRequestData?.complain}
            </div>
          </div>

          {/* Requested By */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Requested By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {displayRequest?.userDetails?.enduser}
            </div>
          </div>

          {/* Noted By */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Noted By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {displayRequest?.userDetails?.supervisor}
            </div>
          </div>

        </div>

      </div>
    
      {/* Status */}
      <div className="flex items-center mt-8">
        <div className="w-16">
          <label className="block text-base font-bold leading-6 text-gray-900">
          Status:
          </label> 
        </div>
        <div className="w-24 font-bold">
        {displayRequest?.viewRequestData?.supervisor_approval == 1 ? ("Approved")
        :displayRequest?.viewRequestData?.supervisor_approval == 2 ? ("Disapproved"):("Pending")}
        </div>
      </div>

    </div>

    {/* Part B */}
    <div className="mt-4 border-b border-black pb-10">
      
      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Part B: To be filled-up by Administrative Division </h2>
      </div>

      {getPartB.partBData ? (
      <>
      
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date */}
          <div className="flex items-center mt-6">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(getPartB?.partBData?.date_of_filling)}
            </div>
          </div>

          {/* Date of Last Repair */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date of Last Repair:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {getPartB?.partBData?.date_of_last_repair ? (formatDate(getPartB?.partBData?.date_of_last_repair)):("N/A")}
            </div>
          </div>

          {/* Nature of Repair */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Nature of Repair:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {getPartB?.partBData?.nature_of_last_repair ? (getPartB?.partBData?.nature_of_last_repair):("N/A")}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Requested By */}
          <div className="flex items-center mt-6">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Requested By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {displayRequest?.gsoDetails?.gso_name}
            </div>
          </div>

          {/* Noted By */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Noted By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {displayRequest?.manegerDetails?.manager_name}
            </div>
          </div>

          {/* Assigned Personnel: */}
          <div className="flex items-center mt-3">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Assigned Personnel:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {assignPersonnel?.personnel_details?.p_name}
            </div>
          </div>

        </div>

      </div>

      {/* Status */}
      <div className="flex items-center mt-8">
        <div className="w-16">
          <label className="block text-base font-bold leading-6 text-gray-900">
          Status:
          </label> 
        </div>
        <div className="w-24 font-bold">
        {displayRequest?.viewRequestData?.admin_approval == 1 ? ("Approved")
        :displayRequest?.viewRequestData?.admin_approval == 2 ? ("Disapproved"):("Pending")}
        </div>
      </div>

      </>
      ):(
      <>
      {currentUser.code_clearance == 3 ? (
        (displayRequest?.viewRequestData?.supervisor_approval == 1 ? (
          
          <form id='partB' onSubmit={event => SubmitInspectionFormTo(event, displayRequest.viewRequestData.id)}>

            {/* Date */}
            <div className="flex items-center mt-6">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                  Date:
                </label> 
              </div>
              <div className="w-64 border-b border-black">
                <input
                  type="date"
                  name="date_filled"
                  id="date_filled"
                  className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  defaultValue={today}
                  readOnly
                />
              </div>
            </div>

            {/* Date of Last Repair */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Date of Last Repair:
                </label> 
              </div>
              <div className="w-64 border-b border-black">
                <input
                  type="date"
                  name="last_date_filled"
                  id="last_date_filled"
                  value={lastfilledDate}
                  onChange={ev => setLastFilledDate(ev.target.value)}
                  max={currentDate}
                  className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-1" style={{ marginLeft:'160px' }}>Leave it blank if "N/A"</p>

            {/* Nature of Repair */}
            <div className="flex items-center mt-2">
              <div className="w-44">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Nature of Repair:
                </label> 
              </div>
              <div className="w-full">
                <textarea
                  id="nature_repair"
                  name="nature_repair"
                  rows={3}
                  value={natureRepair}
                  onChange={ev => setNatureRepair(ev.target.value)}
                  style={{ resize: "none" }}  
                  className="block w-80 rounded-md border-1 border-black py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-1" style={{ marginLeft:'160px' }}>Leave it blank if "N/A"</p>

            {/* Assign Personnel */}
            <div className="flex items-center mt-2">
              <div className="w-44">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Assign Personnel:
                </label> 
              </div>
              <div className="w-full">
              <select 
                name="plate_number" 
                id="plate_number" 
                autoComplete="request-name"
                value={pointPersonnel}
                onChange={ev => setPointPersonnel(ev.target.value)}
                className="block w-full rounded-md border-1 border-black py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {getPersonnel.mappedData.map(user => (
                <option key={user.id} value={user.id}> {user.name} - {user.type} </option>
                ))}
              </select>
              </div>
            </div>
            {inputErrors.assign_personnel && (
              <p className="text-red-500 text-xs mt-1" style={{ marginLeft:'160px' }}>Assign Personnel is required</p>
            )}

          </form>

        ):(
          <div>Pending for Supervisor's Approval</div>
        ))
      ):(
        <div>To be filled by the General Service Officer</div>
      )}
      </>
      )}

    </div>

    {/* Part C */}
    {displayRequest?.viewRequestData?.admin_approval != 2 ? (
    <>
    <div className="mt-4 border-b border-black pb-10">
      
      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job. </h2>
      </div>

      {getPartCD?.viewPartC?.findings && getPartCD?.viewPartC?.findings != "no data" ? (
      <>

      {/* Date Inspected */}
      <div className="flex items-center mt-6">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Date Inspected:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {formatDate(getPartCD?.viewPartC?.before_repair_date)}
        </div>
      </div>

      {/* Findings */}
      <div className="flex items-center mt-3">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Findings:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {getPartCD?.viewPartC?.findings}
        </div>
      </div>

      {/* Recomendations */}
      <div className="flex items-center mt-3">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Recomendations:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {getPartCD?.viewPartC?.recommendations}
        </div>
      </div>

      {/* Noted By */}
      <div className="flex items-center mt-3">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Noted By:
          </label> 
        </div>
        <div className="w-64 font-bold border-b border-black pl-1">
        {assignPersonnel?.personnel_details?.p_name}
        </div>
      </div>

      </>
      ):(
      <>
      {currentUser.id == getPartB?.partBData?.assign_personnel ? (
        displayRequest?.viewRequestData?.admin_approval == 1 ? (
          <form id="partC" onSubmit={SubmitPartC}>

            {/* Date */}
            <div className="flex items-center mt-6">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                  Date Inspected:
                </label> 
              </div>
              <div className="w-64 border-b border-black">
                <input
                  type="date"
                  name="date_filled"
                  id="date_filled"
                  className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  defaultValue={today}
                  readOnly
                />
              </div>
            </div>

            {/* Findings */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Findings:
                </label> 
              </div>
              <div className="w-full">
                <textarea
                  id="findings"
                  name="findings"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {finding}
                  onChange={ev => setFinding(ev.target.value)}
                  className="block w-80 rounded-md border-1 border-black py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            {/* Recomendations */}
            <div className="flex items-center mt-2">
              <div className="w-40">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Recomendations:
                </label> 
              </div>
              <div className="w-full">
                <textarea
                  id="recomendations"
                  name="recomendations"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {recommendation}
                  onChange={ev => setRecommendation(ev.target.value)}
                  className="block w-80 rounded-md border-1 border-black py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

          </form>
        ):displayRequest?.viewRequestData?.admin_approval == 2 ? (
          <div>This Form is Declined by the Admin Manager</div>
        ):(
          <div>Pending</div>
        )
      ):(
        <div>To be filled by Assigned Personnel</div>
      )}
      </>
      )}

    </div>
    </>
    ):null}

    {/* Part D */}
    {displayRequest?.viewRequestData?.admin_approval != 2 ? (
    <>
    <div className="mt-4 border-b border-black pb-10">

      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job. </h2>
      </div>

      {getPartCD?.viewPartC?.after_reapir_date || getPartCD?.viewPartC?.remarks ? (
      <>

      {/* Date Inspected */}
      <div className="flex items-center mt-6">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Date Inspected:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {formatDate(getPartCD?.viewPartC?.after_reapir_date)}
        </div>
      </div>

      {/* Remarks */}
      <div className="flex items-center mt-3">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Remarks:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {getPartCD?.viewPartC?.remarks}
        </div>
      </div>

      {/* Noted By */}
      <div className="flex items-center mt-3">
        <div className="w-36">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Noted By:
          </label> 
        </div>
        <div className="w-64 font-bold border-b border-black pl-1">
        {assignPersonnel?.personnel_details?.p_name}
        </div>
      </div>

      </>
      ):(
      <>
      {currentUser.id == getPartB?.partBData?.assign_personnel ? (
        displayRequest?.viewRequestData?.admin_approval == 1 ? (
          getPartCD?.viewPartC?.close == 3 ? (
          <>
            <form id="partD" onSubmit={SubmitPartD}>

              {/* Date */}
              <div className="flex items-center mt-6">
                <div className="w-36">
                  <label className="block text-base font-medium leading-6 text-gray-900">
                    Date Inspected:
                  </label> 
                </div>
                <div className="w-64 border-b border-black">
                  <input
                    type="date"
                    name="date_filled"
                    id="date_filled"
                    className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    defaultValue={today}
                    readOnly
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-medium leading-6 text-gray-900">
                  Remarks:
                  </label> 
                </div>
                <div className="w-full">
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={3}
                    style={{ resize: "none" }}
                    value= {remarks}
                    onChange={ev => setRemarks(ev.target.value)}
                    className="block w-80 rounded-md border-1 border-black py-0 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                />
                </div>
              </div>

            </form>
          </>
          ):(
            <div>Finish the PART C first</div>
          )
        ):displayRequest?.viewRequestData?.admin_approval == 2 ? (
          <div>This Form is Declined by the Admin Manager</div>
        ):(
          <div>Pending</div>
        )
      ):(
        <div>To be filled by Assigned Personnel</div>
      )}
      </>
      )}

    </div>

    {/* Request Close */}
    <div className="flex items-center mt-8">
      <div className="w-32">
        <label className="block text-base font-bold leading-6 text-gray-900">
        Request Close:
        </label> 
      </div>
      <div className="w-24 font-bold">
      {getPartCD?.viewPartC?.close == 1 ? ("Yes"):("No")}
      </div>
    </div>
    </>
    ):null}

    {/* Buttons */}
    <div className="flex mt-8">

      {/* Back to Request List */}
      {here ? (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2 text-sm">
        <Link to="/repairrequestform">Back to Request List</Link>
      </button>
      ):(
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-1 text-sm">
        <Link to="/">Back to Dashboard</Link>
      </button>
      )}
      
      {/* Supervisor Area Button */}
      {Supervisor ? (
      <>
        <button 
          onClick={() => handleApproveClick(displayRequest?.viewRequestData?.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-sm"
          title="Supervisor Approve"
        >
          Approve
        </button>
        <button 
          onClick={() => handleDisapproveClick(displayRequest?.viewRequestData?.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-1 text-sm"
          title="Supervisor Decline"
        >
          Decline
        </button>
      </>
      ):null}

      {/* GSO Area Button */}
      {getPartB?.partBData ? null:(
        GSo ? (
          <button
            form='partB'
            type="submit"
            className={`rbg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded text-sm focus:outline-none ${
              submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
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
        ):null
      )}

      {/* Admin Area Button */}
      {getPartB.partBData ? (
        Admin ? (
          <>
          <button 
            onClick={() => handleAdminApproveClick(displayRequest.viewRequestData.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-sm"
            title="Admin Approve"
          >
            Approve
          </button>
          <button 
            onClick={() => handleAdminDisapproveClick(displayRequest.viewRequestData.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-1 text-sm"
            title="Admin Decline"
          >
            Decline
          </button>
          </>
        ):null
      ):null}

      {/* Assing Personnel Button */}
      {Personnel ? (
      displayRequest?.viewRequestData?.admin_approval == 1 && displayRequest?.viewRequestData?.inspector_status == 3 ?
      (
        <button
            form='partC'
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
      ):displayRequest?.viewRequestData?.admin_approval == 1 && displayRequest?.viewRequestData?.inspector_status == 2 ? (
        <button
          form="partD"
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
      ):null
      ):null}

      {/* Generate PDF Button */}
      {getPartCD?.viewPartC?.close == 1 ? (
        <button
          type="button"
          onClick={handleButtonClick}
          className={`rounded-md px-3 py-2 font-bold text-white text-sm shadow-sm focus:outline-none ${
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

      {/* Close Request Button */}
      {Close ? (
      <>
      {getPartCD?.viewPartC?.close == 2 ? (
        <button 
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded" 
          onClick={() => handleCloseRequest(displayRequest?.viewRequestData?.id)}
        >
          Close Request
        </button>
      ):null}
      </>
      ):null}
      
    </div>

    {/* For Generate PDF */}
    {isVisible && (
    <div>
      <div className="hidden md:block">
        <div ref={componentRef}>
          <div style={{ width: '216mm', height: '330mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

          {/* Control Number */}
          <div className="title-area font-arial pr-6 text-right pb-4 pt-2">
            <span>Control No:</span>{" "}
            <span style={{ textDecoration: "underline", fontWeight: "900" }}>    
            _____   
              {displayRequest?.viewRequestData?.id}
            _____
            </span>
          </div>

          <table className="w-full border-collapse border border-black">

            {/* Title and Logo */}
            <tr>
              <td className="border border-black p-1 text-center" style={{ width: '100px' }}>
                <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '65px' }} />
              </td>
              <td className="border text-lg w-7/12 border-black font-arial text-center">
                <b>PRE-REPAIR/POST REPAIR INSPECTION FORM</b>
              </td>
              <td className="border border-black p-0 font-arial">
                <div className="border-b text-xs border-black p-1">Form No.: PM:VEC:LNI:WEN:FM:03</div>
                <div className="border-b text-xs border-black p-1">Revision No.: 01</div>
                <div className="text-xs p-1">Date of Effectivity: 03/26/2021</div>
              </td>
            </tr>

            {/* Black */}
            <tr>
              <td colSpan={3} className="border border-black p-1.5 font-arial"></td>
            </tr>

            {/* Part A Label */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 pt-0 font-arial">
                <h3 className="text-sm font-normal">PART A: To be filled-up by Requesting Party</h3>
              </td>
            </tr>

            {/* Part A Forms */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">
                <div>

                  {/* Date Requested */}
                  <div className="mt-4">
                    <div className="flex">
                      <div className="w-28 text-sm">
                        <span>Date</span>
                      </div>
                      <div className="w-64 border-b border-black pl-1 text-sm">
                        <span>{formatDate(displayRequest?.viewRequestData?.date_of_request)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">

                    <div className="col-span-1">
                    
                    {/* Property Number */}
                    <div className="mt-4">
                      <div className="flex">
                        <div className="w-28 text-sm">
                          <span>Property No</span> 
                        </div>
                        <div className="w-64 border-b border-black pl-1 text-sm">
                          <span>{displayRequest?.viewRequestData?.property_number}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acquisition Date */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-28 text-sm">
                          <span>Acquisition Date</span>
                        </div>
                        <div className="w-64 border-b border-black pl-1 text-sm">
                          <span>{formatDate(displayRequest?.viewRequestData?.acq_date)}</span>
                        </div> 
                      </div>
                    </div>

                    {/* Acquisition Cost */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-28 text-sm">
                          <span>Acquisition Cost</span> 
                        </div>
                        <div className="w-64 border-b border-black pl-1 text-sm">
                          <span>₱{(displayRequest?.viewRequestData?.acq_cost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Brand/Model */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-28 text-sm">
                          <span>Brand/Model</span> 
                        </div>
                        <div className="w-64 border-b border-black pl-1 text-sm">
                          <span>{displayRequest?.viewRequestData?.brand_model}</span>
                        </div>
                      </div>
                    </div>

                    {/* Serial/Engine No. */}
                    <div className="mt-1">
                      <div className="flex">
                        <div className="w-28 text-sm">
                          <span>Serial/Engine No.</span> 
                        </div>
                        <div className="w-64 border-b border-black pl-1 text-sm">
                          <span>{displayRequest?.viewRequestData?.serial_engine_no}</span>
                        </div>
                      </div>
                    </div>

                    </div>

                    <div className="col-span-1">

                      {/* Type of Property */}
                      <div className="mt-4">
                        <div className="flex">
                          <div className="w-28 text-sm">
                            <span>Type of Property</span> 
                          </div>
                          <div className="w-68">
                            {/* Vehicle */}
                            <div className="flex items-center text-sm">
                              <div className="w-8 h-5 border border-black mr-2 border-b-0 flex items-center justify-center text-black font-bold">{displayRequest?.viewRequestData?.type_of_property === 'Vehicle Supplies & Materials' ? "X":null}</div>
                              <span>Vehicle Supplies & Materials</span>
                            </div>
                            {/* IT */}
                            <div className="flex items-center text-sm">
                            <div className="w-8 h-5 border border-black mr-2 flex items-center justify-center text-black font-bold">{displayRequest?.viewRequestData?.type_of_property === 'IT Equipment & Related Materials' ? "X":null}</div>
                              <span>IT Equipment & Related Materials</span>
                            </div>
                            {/* Other */}
                            <div className="flex items-center text-sm">
                              <div className="w-8 h-5 border border-black mr-2 border-t-0 flex items-center justify-center text-black font-bold">{displayRequest?.viewRequestData?.type_of_property === 'Others' ? "X":null}</div>
                              <div>
                                <span  className="mr-1 text-sm">Others:</span>
                                <span className="w-70 border-b border-black text-sm">{displayRequest?.viewRequestData?.property_other_specific ? displayRequest?.viewRequestData?.property_other_specific:null}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-28 text-sm">
                            <span>Description</span> 
                          </div>
                          <div className="w-64 border-b border-black pl-1 text-sm">
                            <span>{displayRequest?.viewRequestData?.property_description}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-56 text-sm">
                            <span>Location (Div/Section/Unit)</span> 
                          </div>
                          <div className="w-64 border-b border-black pl-4 text-sm">
                            <span>{displayRequest?.viewRequestData?.location}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Complain */}
                  <div className="mt-1">
                    <div className="flex">
                      <div className="w-32 text-sm">
                        <span>Complain/Defect</span>
                      </div>
                      <div className="w-full border-b border-black pl-1 text-sm">
                        <span>{displayRequest?.viewRequestData?.complain}</span>
                      </div>
                    </div>
                  </div>

                  {/* For Signature */}
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4">

                      {/* For Requestor Signature */}
                      <div className="col-span-1">
                        <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> REQUESTED BY:</label>
                        <div className="mt-4">
                          <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                            <div>
                            <img 
                              src={displayRequest?.userDetails?.requestor_signature} 
                              alt="User Signature" 
                              style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }} 
                            />
                            </div>
                            <span className="text-base font-bold">{displayRequest?.userDetails?.enduser}</span>
                          </div>
                          <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> End-User </label>
                        </div>
                      </div>
                      
                      {/* For Supervisor Signature */}
                      <div className="col-span-1">
                        <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                        <div className="mt-4">
                          <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                            <div>
                              <img
                                src={displayRequest?.userDetails?.supervisor_signature}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }}
                              />
                              <span className="text-base font-bold">{displayRequest?.userDetails?.supervisor}</span>
                            </div>
                          </div>
                          <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> Immediate Supervisor</label>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </td>
            </tr>

            {/* Part B Label */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 font-arial">
              <h3 className="text-sm font-normal">PART B: To be filled-up by Administrative Division</h3>
              </td>
            </tr>

            {/* Part B Forms */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                {/* Date */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-28 text-sm">
                      <span>Date</span> 
                    </div>
                    <div className="w-64 border-b border-black pl-1 text-sm">
                      <span>{formatDate(getPartB?.partBData?.date_of_filling)}</span>
                    </div>
                  </div>
                </div>

                {/* Date of Last Repair */}
                <div className="mt-1">
                  <div className="flex">
                    <div className="w-36 text-sm">
                      <span>Date of Last Repair</span> 
                    </div>
                    <div className="w-64 border-b border-black pl-1 text-sm">
                      <span>{getPartB?.partBData?.date_of_last_repair ? (formatDate(getPartB?.partBData?.date_of_last_repair)):("N/A")}</span>
                    </div>
                  </div>
                </div>

                {/* Nature of Repair */}
                <div className="mt-1">
                  <div className="flex">
                    <div className="w-44 text-sm">
                      <span>Nature of Last Repair</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-sm">
                      <span>{getPartB?.partBData?.nature_of_last_repair ? (getPartB?.partBData?.nature_of_last_repair):("N/A")}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">

                    {/* For GSO Signature */}
                    <div className="col-span-1">
                      <label htmlFor="type_of_property" className="block font-normal leading-6 text-sm">REQUESTED BY: </label>
                      <div className="mt-4">
                        <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                          <div>
                          <img 
                            src={displayRequest?.gsoDetails?.gso_signature} 
                            alt="User Signature" 
                            style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }} 
                          />
                          </div>
                          <span className="font-bold text-base">{displayRequest?.gsoDetails?.gso_name}</span>
                        </div>
                        <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> General Service Officer </label>
                      </div>
                    </div>

                    {/* For Admin Division Manager */}
                    <div className="col-span-1">
                      <label htmlFor="type_of_property" className="block font-normal leading-6 text-sm"> NOTED:</label>
                      <div className="mt-4">
                        <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                          <div>
                            <img
                              src={displayRequest?.manegerDetails?.manager_signature}
                              alt="User Signature"
                              style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }}
                            />
                            <span className="font-bold text-base">{displayRequest?.manegerDetails?.manager_name}</span>
                          </div>
                        </div>
                        <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Admin Division Manager </label>
                      </div>
                    </div>

                  </div>
                </div>

              </td>
            </tr>

            {/* Part C Label */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 font-arial">
              <h3 className="text-sm font-normal">PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.</h3>
              </td>
            </tr>

            {/* Part C Form */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                {/* Finding */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-44 text-sm">
                      <span>Finding/s</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-sm">
                      <span>{getPartCD?.viewPartC?.findings}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-1">
                  <div className="flex">
                    <div className="w-44 text-sm">
                      <span>Recommendation/s</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-sm">
                      <span>{getPartCD?.viewPartC?.recommendations}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">

                  {/* Date */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6">
                      <span>DATE INSPECTED</span>
                    </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <span className="text-base">{formatDate(getPartCD?.viewPartC?.before_repair_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inspector */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6">
                      <span>NOTED:</span>
                    </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                            <div className="personnel-container">
                              <img
                                src={assignPersonnel?.personnel_details?.p_signature}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '180px', top: '-36px', left: '42px' }}
                              />
                              <span className="text-base font-bold">{assignPersonnel?.personnel_details?.p_name}</span>
                            </div>
                        </div>
                      </div>
                      <label htmlFor="type_of_property" className="block text-center font-medium italic text-xs">
                        Property Inspector
                      </label>
                    </div>
                  </div>

                  </div>
                </div>

              </td>
            </tr>

            {/* Part D Label */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 font-arial">
              <h3 className="text-sm font-normal">PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.</h3>
              </td>
            </tr>

            {/* Part D Form */}
            <tr>
              <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                {/* Remarks */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-44 text-sm">
                      <span>Recommendation/s</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-sm">
                      <span>{getPartCD?.viewPartC?.remarks}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">

                  {/* Date */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6">
                      <span>DATE INSPECTED</span>
                    </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <span className="text-base">{formatDate(getPartCD?.viewPartC?.after_reapir_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inspector */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6">
                      <span>NOTED:</span>
                    </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                            <div className="personnel-container">
                              <img
                                src={assignPersonnel?.personnel_details?.p_signature}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '180px', top: '-36px', left: '42px' }}
                              />
                              <span className="text-base font-bold">{assignPersonnel?.personnel_details?.p_name}</span>
                            </div>
                        </div>
                      </div>
                      <label htmlFor="type_of_property" className="block text-center font-medium italic text-xs">
                        Property Inspector
                      </label>
                    </div>
                  </div>

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

    {/* Show Popup With Hearty Face */}
    {showPopupHappy && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent black overlay */}
      <div
        className="fixed inset-0 bg-black opacity-40" // Close on overlay click
      ></div>
      {/* Popup content with background blur */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down">
      <div className="icon-center">
        <svg className="w-44 h-44" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="-30 -30 473.9 473.9" style={{"enable-background":"new 0 0 473.9 473.9"}} xml:space="preserve">
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

    {/* Show Normal Popup */}
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
  </>
  )}

  </PageComponent>
  ):(
    <Forbidden />
  );
}