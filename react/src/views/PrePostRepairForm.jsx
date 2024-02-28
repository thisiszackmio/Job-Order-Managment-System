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

  //Get the ID
  const {id} = useParams();

  const { currentUser, userRole } = useUserStateContext();
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Functions
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  //Fetch Data
  const [InspectionData, setInspectionData] = useState([]);
  const [inputErrors, setInputErrors] = useState({});

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupContent, setPopupContent] = useState('');

  // Variables
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState('');
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [remarks, setRemarks] = useState('');

  //Get All Data
  useEffect(() => {
    axiosClient
      .get(`/inspectionform/${id}`)
      .then((response) => {
          const responseData = response.data;
          const getAssignPersonnel = responseData.assign_personnel;
          const getPartA = responseData.partA;
          const getPartB = responseData.partB;
          const getPartCD = responseData.partCD;
          const personnel = responseData.personnel;
          const requestor = responseData.requestor;
          const supervisor = responseData.supervisor;
          const gso = responseData.gso;
          const manager = responseData.manager;

          const getPersonnelData = getAssignPersonnel.map((Personnel) => {
            const { ap_id, ap_name, ap_type } = Personnel;
            return{
              id: ap_id,
              name: ap_name,
              type: ap_type
            };
          })
          
          setInspectionData({
            getPersonnelData,
            getPartA,
            getPartB,
            getPartCD,
            personnel,
            requestor,
            supervisor,
            gso,
            manager
          });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  //Popup Message
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p>There was a problem submitting the form. Please contact the developer.</p>
    </div>
  );

  //Approval Request
  function handleApprovalRequest(){

    if(currentUser.code_clearance == 4){
      //For Supervisor
      setPopupContent("warning");
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Approval Request</p>
          <p>Do you want to approve <strong>{InspectionData?.requestor?.r_name}'s</strong> request?</p>
        </div>
      );
    }
    else if(currentUser.code_clearance == 1){
      //For Admin Manager
      setPopupContent("warning");
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Approval Request</p>
          <p>Do you want to approve <strong>{InspectionData?.requestor?.r_name}'s</strong> request?</p>
        </div>
      );
    }
  }

  //Decline Request
  function handleDeclineRequest(){
    
    if(currentUser.code_clearance == 4){
      // For Supervisor
      setPopupContent("warningD");
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Dispproval Request</p>
          <p>Are you sure you want to disapprove <strong>{InspectionData?.requestor?.r_name}'s</strong> request?</p>
        </div>
      );
    }
    else if(currentUser.code_clearance == 1){
      // For Admin Manager
      setPopupContent("warningD");
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Dispproval Request</p>
          <p>Are you sure you want to disapprove <strong>{InspectionData?.requestor?.r_name}'s</strong> request?</p>
        </div>
      );
    }

  }

  //Approval Request
  function handleGrantApprovalRequest(id){

    if(currentUser.code_clearance == 4){
      //For Supervisor
      setSubmitLoading(true);

      axiosClient.put(`/approve/${id}`)
      .then((response) => {
        setSubmitLoading(false);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>Thank you for approving the request</p>
          </div>
        );
        setShowPopup(true);
      })
      .catch((error) => {
        //console.error(error);
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);   
        setSubmitLoading(false);
      });
    }
    else if(currentUser.code_clearance == 1 || InspectionData?.getPartA?.user_id == currentUser.id){
      // For Admin Manager
      setSubmitLoading(true);

      axiosClient.put(`/admin_approve/${id}`)
      .then((response) => {
        setSubmitLoading(false);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>Thank you for approving the request</p>
          </div>
        );
        setShowPopup(true);
      })
      .catch((error) => {
        //console.error(error);
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);   
        setSubmitLoading(false);
      });
    }
  }

  //Disapproval Request
  function handleDeclineApprovalRequest(id){

    if(currentUser.code_clearance == 4){
      // For Supervisor
      setSubmitLoading(true);
  
      axiosClient.put(`/disapprove/${id}`)
      .then((response) => {
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You disapprove the request</p>
          </div>
        );
        setShowPopup(true);
      })
      .catch((error) => {
        // console.error(error);
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);   
        setSubmitLoading(false);
      });
    }
    else if(currentUser.code_clearance == 1){
      // For Admin Manager
      setSubmitLoading(true);

      axiosClient.put(`/admin_disapprove/${id}`)
      .then((response) => {
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You disapprove the request</p>
          </div>
        );
        setShowPopup(true);
      })
      .catch((error) => {
        //console.error(error);
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);   
        setSubmitLoading(false);
      });
    }
  }

  //Submit the data on Part B
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
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p>Part B Form submit successfully</p>
        </div>
      ); 
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
    .then(() => { 
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p>Part C Form submit successfully</p>
        </div>
      ); 
      setShowPopup(true);   
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
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p>Part D Form submit successfully</p>
        </div>
      ); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      const responseErrors = error.response.data.errors;
      setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  //Close the request
  function handleCloseRequest(id){

    setSubmitLoading(true);
    
    axiosClient.put(`/insprequestclose/${id}`)
    .then((response) => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p>You close the request</p>
        </div>
      );
      setShowPopup(true);
      setSubmitLoading(false);
    })
    .catch((error) => {
      //console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
      setSubmitLoading(false);
    });

  }

  // Just CLose
  const justclose = () => {
    setShowPopup(false);
  };

  // Close
  const closePopup = () => {
    setIsLoading(true)
    setShowPopup(false);
    setSubmitLoading(false);
    window.location.reload();
  };

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

  //Restrictions
  const Authorize = userRole == 'admin' || userRole == 'personnels' || userRole == 'hackers';

  return Authorize ? (
  <PageComponent title="Pre-Repair/Post Repair Inspection Form">
  {isLoading ? (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
    <img
      className="mx-auto h-44 w-auto"
      src={loadingAnimation}
      alt="Your Company"
    />
    <span className="ml-2 animate-heartbeat">Loading Pre-Repair/Post Repair Inspection Form</span>
  </div>
  ):(
  <>
    {/* Back button */}
    <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded mr-1 text-sm">
      <Link to="/repairrequestform">Back to Request List</Link>
    </button>

    {/* Part A */}
    <div className="border-b border-gray-300 pb-6">

      {/* Control No */}
      <div className="flex items-center mt-6 mb-10">
        <div className="w-24">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Control No:
          </label> 
        </div>
        <div className="w-auto px-5 border-b border-black text-center font-bold">
        {InspectionData?.getPartA?.id}
        </div>
      </div>

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
            {formatDate(InspectionData?.getPartA?.date_of_request)}
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
            {InspectionData?.getPartA?.property_number}
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
            {formatDate(InspectionData?.getPartA?.acq_date)}
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
            ₱{InspectionData?.getPartA?.acq_cost}
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
            {InspectionData?.getPartA?.brand_model}
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
            {InspectionData?.getPartA?.serial_engine_no}
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
            {InspectionData?.getPartA?.type_of_property == 'Others' ? (
            <span>Others: <i>{InspectionData?.getPartA?.property_other_specific}</i></span>
            ):(
              InspectionData?.getPartA?.type_of_property
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
            {InspectionData?.getPartA?.property_description}
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
            {InspectionData?.getPartA?.location}
            </div>
          </div>

          {/* Requested By */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Requested By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {InspectionData?.requestor?.r_name}
            </div>
          </div>

          {/* Noted By */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Noted By:
              </label> 
            </div>
            <div className="w-64 font-bold border-b border-black pl-1">
            {InspectionData?.supervisor?.supName}
            </div>
          </div>

        </div>

      </div>

      {/* Complain */}
      <div className="flex items-center mt-2">
        <div className="w-40">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Complain:
          </label> 
        </div>
        <div className="w-3/4 border-b border-black pl-1">
        {InspectionData?.getPartA?.complain}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center mt-8">
        <div className="w-16">
          <label className="block text-base font-bold leading-6 text-gray-900">
          Status:
          </label> 
        </div>
        <div className="w-full font-bold">
        {InspectionData?.getPartA?.supervisor_approval == 1 ? ("Approved")
        :InspectionData?.getPartA?.supervisor_approval == 2 ? ("Disapproved")
        :(<>{InspectionData?.getPartA?.supervisor_name == currentUser.id ? ("Waiting for your approval"):("Pending")}</>)}
        </div>
      </div>

    </div>

    {/* Supervisor Decision */}
    {InspectionData?.getPartA?.supervisor_approval != 2 ? (
    <>

      {/* Part B */}
      {InspectionData?.getPartA?.supervisor_approval == 1 &&  (
      <>
        <div className="mt-4 border-b border-gray-300 pb-6">

        <div>
          <h2 className="text-base font-bold leading-7 text-gray-900"> Part B: To be filled-up by Administrative Division </h2>
        </div>

        {currentUser.code_clearance == 3 && InspectionData?.getPartA?.admin_approval == 4 ? (
        <>

          <form id='partB' onSubmit={event => SubmitInspectionFormTo(event, InspectionData?.getPartA?.id)}>

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
                className="block w-full rounded-md border-1 border-black py-1 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              > 
                <option value="" disabled>Select an option</option>
                {InspectionData?.getPersonnelData?.map(user => (
                <option key={user.id} value={user.id}> {user.name} </option>
                ))}
              </select>
              </div>
            </div>
            {!pointPersonnel && inputErrors.assign_personnel && (
              <p className="text-red-500 text-xs mt-1" style={{ marginLeft:'160px' }}>Assign Personnel is required</p>
            )}

          </form>

        </>
        ):(
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
                {InspectionData?.getPartB?.date_of_filling ? 
                <div className="w-64 border-b border-black pl-1">{formatDate(InspectionData?.getPartB?.date_of_filling)}</div>:
                <div className="w-64 border-b border-black pl-1 h-4"></div>}
              </div>

              {/* Date of Last Repair */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-medium leading-6 text-gray-900">
                  Date of Last Repair:
                  </label> 
                </div>
                {InspectionData?.personnel?.p_name ? 
                <div className="w-64 border-b border-black pl-1">{InspectionData?.getPartB?.date_of_last_repair ? (formatDate(InspectionData?.getPartB?.date_of_last_repair)):("N/A")}</div>:
                <div className="w-64 border-b border-black pl-1 h-4"></div>}
              </div>

              {/* Assigned Personnel: */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-medium leading-6 text-gray-900">
                  Assigned Personnel:
                  </label> 
                </div>
                {InspectionData?.personnel?.p_name ?
                <div className="w-64 border-b border-black pl-1 font-bold">{InspectionData?.personnel?.p_name}</div>:
                <div className="w-64 border-b border-black pl-1 h-4"></div>}
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
                {InspectionData?.gso?.gsoName}
                </div>
              </div>

              {/* Noted By */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-medium leading-6 text-gray-900">
                  Noted By:
                  </label> 
                </div>
                <div className="w-64 font-bold border-b border-black pl-1">
                {InspectionData?.manager?.ad_name}
                </div>
              </div>

            </div>

          </div>

          {/* Nature of Repair */}
          <div className="flex items-center mt-2">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Nature of Repair:
              </label> 
            </div>
            {InspectionData?.personnel?.p_name ? 
            <div className="w-3/4 border-b border-black pl-1">{InspectionData?.getPartB?.nature_of_last_repair ? (InspectionData?.getPartB?.nature_of_last_repair):("N/A")}</div>:
            <div className="w-3/4 border-b border-black pl-1 h-4"></div>}
          </div>

          {/* Status */}
          <div className="flex items-center mt-8">
            <div className="w-16">
              <label className="block text-base font-bold leading-6 text-gray-900">
              Status:
              </label> 
            </div>
            <div className="w-96 font-bold">
            {InspectionData?.getPartB != null ? 
            (<>
            {InspectionData?.getPartA?.admin_approval == 1 && ("Approved")}
            {InspectionData?.getPartA?.admin_approval == 2 && ("Disapproved")}
            {InspectionData?.getPartA?.admin_approval == 3 && (InspectionData?.manager?.ad_id == currentUser.id ? ("Waiting for your approval"):("Pending"))}
            </>):"To be filled by GSO"}
            </div>
          </div>

        </>
        )}

        </div>
      </>
      )}

      {/* Part C */}
      {InspectionData?.getPartCD && InspectionData?.getPartA?.admin_approval == 1 && (
      <>
        <div className="mt-4 border-b border-gray-300 pb-6">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job. </h2>
          </div>

          {InspectionData?.getPartB?.assign_personnel == currentUser.id && InspectionData?.getPartCD?.findings == 'no data' ? (
          <>
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
                  />
                </div>
              </div>
              {!finding && inputErrors.findings && (
                <p className="text-red-500 text-xs mt-1" style={{ marginLeft:'140px' }}>The Findings form is required</p>
              )}

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
                  />
                </div>
              </div>
              {!recommendation && inputErrors.recommendations && (
                <p className="text-red-500 text-xs mt-1" style={{ marginLeft:'140px' }}>The Recomendations form is required</p>
              )}

            </form>
          </>
          ):(
          <>

            {/* Date Inspected */}
            <div className="flex items-center mt-6">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Date Inspected:
                </label> 
              </div>
              {InspectionData?.getPartCD?.findings != 'no data' ? 
              <div className="w-64 border-b border-black pl-1">{formatDate(InspectionData?.getPartCD?.before_repair_date)}</div>:
              <div className="w-64 border-b border-black pl-1 h-4"></div>}
            </div>

            {/* Findings */}
            <div className="flex items-center mt-2">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Findings:
                </label> 
              </div>
              {InspectionData?.getPartCD?.findings != 'no data' ? 
              <div className="w-3/4 border-b border-black pl-1">{InspectionData?.getPartCD?.findings}</div>:
              <div className="w-3/4 border-b border-black pl-1 h-4"></div>}
            </div>

            {/* Recomendations */}
            <div className="flex items-center mt-2">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Recomendations:
                </label> 
              </div>
              {InspectionData?.getPartCD?.findings != 'no data' ? 
              <div className="w-3/4 border-b border-black pl-1">{InspectionData?.getPartCD?.recommendations}</div>:
              <div className="w-3/4 border-b border-black pl-1 h-4"></div>}
            </div>

            {/* Noted By */}
            <div className="flex items-center mt-2">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Noted By:
                </label> 
              </div>
              {InspectionData?.getPartCD?.findings != 'no data' ? 
              <div className="w-64 border-b border-black pl-1 font-bold">{InspectionData?.personnel?.p_name}</div>:
              <div className="w-64 border-b border-black pl-1 h-4"></div>}
            </div>
          
          </>
          )}

        </div>
      </>
      )}

      {/* Part D */}
      {InspectionData?.getPartCD && InspectionData?.getPartA?.admin_approval == 1 && (
      <>
        <div className="mt-4 border-b border-gray-300 pb-6">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job. </h2>
          </div>

          {InspectionData?.getPartCD?.close == 3 && InspectionData?.getPartB?.assign_personnel == currentUser.id ? (
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
                />
                </div>
              </div>
              {!remarks && inputErrors.remarks && (
                <p className="text-red-500 text-xs mt-1" style={{ marginLeft:'140px' }}>The Remarks form is required</p>
              )}

            </form>
          
          </>
          ):(
          <>

            {/* Date Inspected */}
            <div className="flex items-center mt-6">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Date Inspected:
                </label> 
              </div>
              {InspectionData?.getPartCD?.after_reapir_date != null ? 
              <div className="w-64 border-b border-black pl-1">{formatDate(InspectionData?.getPartCD?.after_reapir_date)}</div>:
              <div className="w-64 border-b border-black pl-1 h-4"></div>}
            </div>

            {/* Remarks */}
            <div className="flex items-center mt-2">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Remarks:
                </label> 
              </div>
              {InspectionData?.getPartCD?.remarks != null ? 
              <div className="w-3/4 border-b border-black pl-1">{InspectionData?.getPartCD?.remarks}</div>:
              <div className="w-3/4 border-b border-black pl-1 h-4"></div>}
            </div>

            {/* Noted By */}
            <div className="flex items-center mt-2">
              <div className="w-36">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Noted By:
                </label> 
              </div>
              {InspectionData?.getPartCD?.remarks ? 
              <div className="w-64 border-b border-black pl-1 font-bold">{InspectionData?.personnel?.p_name}</div>:
              <div className="w-64 border-b border-black pl-1 h-4"></div>}
            </div>

          </>
          )}

        </div>
      </>
      )}

    </>
    ):null}

    {/* Request Close */}
    <div className="flex items-center mt-8">
      <div className="w-32">
        <label className="block text-base font-bold leading-6 text-gray-900">
        Request Close:
        </label> 
      </div>
      <div className="w-24 font-bold">
      {InspectionData?.getPartCD?.close == 1 ? ("Yes"):
      InspectionData?.getPartA?.admin_approval == 2 ? ("Yes"):
      InspectionData?.getPartA?.supervisor_approval == 2 ? ("Yes"):
      ("No")}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex mt-8">

      {/* For Supervisor */}
      {(InspectionData?.getPartA?.supervisor_name == currentUser.id && InspectionData?.getPartA?.supervisor_approval == 0) && (
      <div>
        {/* Approve */}
        <button 
          onClick={() => handleApprovalRequest()}
          className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-2 rounded text-base"
          title="Supervisor Approve"
        >
          Approve
        </button>
        {/* Disapprove */}
        <button 
          onClick={() => handleDeclineRequest()}
          className="bg-red-600 hover:bg-red-500 font-semibold text-white py-2 px-2 rounded ml-1 text-base"
          title="Supervisor Decline"
        >
          Disapprove
        </button>
      </div>
      )}

      {/* For GSO */}
      {currentUser.code_clearance == 3 && InspectionData?.getPartA?.admin_approval == 4 && (
      <>
        <button
          form='partB'
          type="submit"
          className={`text-white py-2 px-2 rounded font-semibold text-base focus:outline-none ${
            submitLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          style={{ position: 'relative', top: '0px' }}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Submitting</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </>
      )}

      {/* For Admin */}
      {currentUser.code_clearance == 1 && InspectionData?.getPartA?.admin_approval == 3 && (
      <>
      {InspectionData?.getPartA?.user_id == currentUser.id ? (
        <button
          onClick={() => handleGrantApprovalRequest(InspectionData?.getPartA?.id)}
          className={`rounded-md px-3 py-2 text-base font-semibold text-white shadow-sm focus:outline-none ${
            submitLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Processing</span>
            </div>
          ) : (
            'Approve'
          )}
        </button>
      ):(
      <>
        {/* Approve */}
        <button 
          onClick={() => handleApprovalRequest()}
          className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-2 rounded text-base"
          title="Admin Approve"
        >
          Approve
        </button>
        {/* Disapprove */}
        <button 
          onClick={() => handleDeclineRequest()}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-2 rounded ml-1 text-base"
          title="Admin Decline"
        >
          Disapprove
        </button>
      </>  
      )}
      </>
      )}

      {/* For Assign Personnels */}
      {InspectionData?.getPartB?.assign_personnel == currentUser.id && (InspectionData?.getPartA?.inspector_status == 3 || InspectionData?.getPartA?.inspector_status == 2) && (
      <>

        {/* Part C Button */}
        {InspectionData?.getPartA?.inspector_status == 3 && (
          <button
            form='partC'
            type="submit"
            className={`rounded-md px-3 py-2 text-base text-white font-semibold shadow-sm focus:outline-none ${
              submitLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Submitting</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        )}

        {/* Part D Button */}
        {InspectionData?.getPartA?.inspector_status == 2 && (
          <button
            form="partD"
            type="submit"
            className={`rounded-md px-3 py-2 text-base text-white font-semibold shadow-sm focus:outline-none ${
              submitLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Submitting</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        )}

      </>
      )}

      {/* Close Request Button */}
      {InspectionData?.getPartCD?.close == 2 && (
        <button 
          onClick={() => handleCloseRequest(InspectionData?.getPartA?.id)}
          className={`rounded-md px-3 py-2 text-white font-semibold text-base shadow-sm focus:outline-none ${
            submitLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Closing</span>
            </div>
          ) : (
            'Close Request'
          )}
        </button>
      )}

      {/* Generate PDF */}
      {InspectionData?.getPartCD?.close == 1 && (
        <button
          type="button"
          onClick={handleButtonClick}
          className={`rounded-md px-3 py-2 font-semibold text-white text-base shadow-sm focus:outline-none ${
            submitLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Generating</span>
            </div>
          ) : (
            'Get PDF'
          )}
        </button>
      )}

    </div>

    {/* Show Popup */}
    {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div className="fixed inset-0 bg-black opacity-40"></div>

      {/* Popup content with background blur */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>

        {/* Notification Icons */}
        <div class="f-modal-alert">

          {/* Error */}
          {popupContent == "error" && (
          <div className="f-modal-icon f-modal-error animate">
            <span className="f-modal-x-mark">
              <span className="f-modal-line f-modal-left animateXLeft"></span>
              <span className="f-modal-line f-modal-right animateXRight"></span>
            </span>
          </div>
          )}

          {/* Warning */}
          {(popupContent == "warning" || popupContent == "warningD") && (
          <div class="f-modal-icon f-modal-warning scaleWarning">
            <span class="f-modal-body pulseWarningIns"></span>
            <span class="f-modal-dot pulseWarningIns"></span>
          </div>
          )}

          {/* Success */}
          {popupContent == "success" && (
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

          {/* Warning for Approval */}
          {popupContent == "warning" && (
          <>
            {/* For Supervisor */}
            {currentUser.code_clearance == 4 && (
            <>
              {/* Yes */}
              {!submitLoading && (
                <button
                  onClick={() => handleGrantApprovalRequest(InspectionData?.getPartA?.id)}
                  className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                >
                  Yes
                </button>
              )}
              {/* No */}
              {!submitLoading && (
                <button
                  onClick={justclose}
                  className="w-1/2 px-4 py-2 bg-red-600 font-semibold text-white rounded hover:bg-red-500 ml-2"
                >
                  No
                </button>
              )}
              {/* Loading */}
              {submitLoading && (
                <button className="w-full px-4 py-2 bg-indigo-400 font-semibold text-white rounded cursor-not-allowed">
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Please Wait</span>
                  </div>
                </button>
              )}
            </>
            )}

            {/* For Admin Manager */}
            {currentUser.code_clearance == 1 && (
            <>
              {/* Yes */}
              {!submitLoading && (
                <button
                  onClick={() => handleGrantApprovalRequest(InspectionData?.getPartA?.id)}
                  className="w-1/2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                  Yes
                </button>
              )}
              {/* No */}
              {!submitLoading && (
                <button
                  onClick={justclose}
                  className="w-1/2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 ml-2"
                >
                  No
                </button>
              )}
              {/* Loading */}
              {submitLoading && (
                <button className="w-full px-4 py-2 bg-blue-300 font-semibold text-white rounded cursor-not-allowed">
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Please Wait</span>
                  </div>
                </button>
              )}
            </>  
            )}
          </>  
          )}

          {/* Warning for Disapproval */}
          {popupContent == "warningD" && (
          <>
            {/* For Supervisor */}
            {currentUser.code_clearance == 4 && (
            <>
              {/* Yes */}
              {!submitLoading && (
                <button
                  onClick={() => handleDeclineApprovalRequest(InspectionData?.getPartA?.id)}
                  className="w-1/2 px-4 py-2 text-white font-semibold rounded bg-indigo-600 hover:bg-indigo-500"
                >
                  Yes
                </button>
              )}
              {/* No */}
              {!submitLoading && (
                <button
                  onClick={justclose}
                  className="w-1/2 px-4 py-2 bg-red-600 font-semibold text-white rounded hover:bg-red-500 ml-2"
                >
                  No
                </button>
              )}
              {/* Loading */}
              {submitLoading && (
                <button className="w-full px-4 py-2 font-semibold bg-indigo-400 text-white rounded cursor-not-allowed">
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Please Wait</span>
                  </div>
                </button>
              )}
            </>
            )}

            {/* For Admin Manager */}
            {currentUser.code_clearance == 1 && (
            <>
              {/* Yes */}
              {!submitLoading && (
                <button
                  onClick={() => handleDeclineApprovalRequest(InspectionData?.getPartA?.id)}
                  className="w-1/2 px-4 py-2 bg-blue-500 font-semibold text-white rounded hover:bg-blue-600"
                >
                  Yes
                </button>
              )}
              {/* No */}
              {!submitLoading && (
                <button
                  onClick={justclose}
                  className="w-1/2 px-4 py-2 bg-red-500 font-semibold text-white rounded hover:bg-red-600 ml-2"
                >
                  No
                </button>
              )}
              {/* Loading */}
              {submitLoading && (
                <button className="w-full px-4 py-2 bg-blue-300 font-semibold text-white rounded cursor-not-allowed">
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Please Wait</span>
                  </div>
                </button>
              )}
            </>
            )}
          </>
          )}

          {/* Success */}
          {(popupContent == "success") && (
            <button
              onClick={closePopup}
              className="w-full px-4 py-2 font-semibold bg-indigo-600 text-white rounded"
            >
              Close
            </button>
          )}

          {/* Error */}
          {popupContent == "error" && (
            <button
              onClick={justclose}
              className="w-1/2 px-4 py-2 bg-red-600 text-white rounded ml-2"
            >
              No
            </button>
          )}

        </div>

      </div>

    </div>
    )}

    {/* PDF */}
    {isVisible && (
    <div>
      <div className="hidden md:none">
        <div ref={componentRef}>
          <div style={{ width: '216mm', height: '330mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

            {/* Control Number */}
            <div className="title-area font-arial pr-6 text-right pb-4 pt-2">
              <span>Control No:</span>{" "}
              <span style={{ textDecoration: "underline", fontWeight: "900" }}>    
              _____   
                {InspectionData?.getPartA?.id}
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

              {/* Blank */}
              <tr>
                <td colSpan={3} className="border border-black p-1.5 font-arial"></td>
              </tr>

              {/* Part A Label */}
              <tr>
                <td colSpan={3} className="border border-black pl-1 pt-0 font-arial">
                  <h3 className="text-sm font-normal">PART A: To be filled-up by Requesting Party</h3>
                </td>
              </tr>

              {/* Part A Details */}
              <tr>
                <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                  {/* Date Requested */}
                  <div className="mt-4">
                    <div className="flex">
                      <div className="w-28 text-sm">
                        <span>Date</span>
                      </div>
                      <div className="w-64 border-b border-black pl-1 text-sm">
                        <span>{formatDate(InspectionData?.getPartA?.date_of_request)}</span>
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
                            <span>{InspectionData?.getPartA?.property_number}</span>
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
                            <span>{formatDate(InspectionData?.getPartA?.acq_date)}</span>
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
                            <span>₱{(InspectionData?.getPartA?.acq_cost)}</span>
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
                            <span>{InspectionData?.getPartA?.brand_model}</span>
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
                            <span>{InspectionData?.getPartA?.serial_engine_no}</span>
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
                              <div className="w-8 h-5 border border-black mr-2 border-b-0 flex items-center justify-center text-black font-bold">{InspectionData?.getPartA?.type_of_property === 'Vehicle Supplies & Materials' ? "X":null}</div>
                              <span>Vehicle Supplies & Materials</span>
                            </div>
                            {/* IT */}
                            <div className="flex items-center text-sm">
                            <div className="w-8 h-5 border border-black mr-2 flex items-center justify-center text-black font-bold">{InspectionData?.getPartA?.type_of_property === 'IT Equipment & Related Materials' ? "X":null}</div>
                              <span>IT Equipment & Related Materials</span>
                            </div>
                            {/* Other */}
                            <div className="flex items-center text-sm">
                              <div className="w-8 h-5 border border-black mr-2 border-t-0 flex items-center justify-center text-black font-bold">{InspectionData?.getPartA?.type_of_property === 'Others' ? "X":null}</div>
                              <div>
                                <span  className="mr-1 text-sm">Others:</span>
                                <span className="w-70 border-b border-black text-sm">{InspectionData?.getPartA?.property_other_specific ? InspectionData?.getPartA?.property_other_specific:null}</span>
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
                            <span>{InspectionData?.getPartA?.property_description}</span>
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
                            <span>{InspectionData?.getPartA?.location}</span>
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
                        <span>{InspectionData?.getPartA?.complain}</span>
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
                              src={InspectionData?.requestor?.r_sign} 
                              alt="User Signature" 
                              style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }} 
                            />
                            </div>
                            <span className="text-base font-bold">{InspectionData?.requestor?.r_name}</span>
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
                                src={InspectionData?.supervisor?.supSign}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }}
                              />
                              <span className="text-base font-bold">{InspectionData?.supervisor?.supName}</span>
                            </div>
                          </div>
                          <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> Immediate Supervisor</label>
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
                        <span>{formatDate(InspectionData?.getPartB?.date_of_filling)}</span>
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
                        <span>{InspectionData?.getPartB?.date_of_last_repair ? (formatDate(InspectionData?.getPartB?.date_of_last_repair)):("N/A")}</span>
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
                        <span>{InspectionData?.getPartB?.nature_of_last_repair ? (InspectionData?.getPartB?.nature_of_last_repair):("N/A")}</span>
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
                              src={InspectionData?.gso?.gsoSign} 
                              alt="User Signature" 
                              style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }} 
                            />
                            </div>
                            <span className="font-bold text-base">{InspectionData?.gso?.gsoName}</span>
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
                                src={InspectionData?.manager?.ad_sign}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '200px', top: '-40px', left: '30px' }}
                              />
                              <span className="font-bold text-base">{InspectionData?.manager?.ad_name}</span>
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
                        <span>{InspectionData?.getPartCD?.findings}</span>
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
                        <span>{InspectionData?.getPartCD?.recommendations}</span>
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
                          <span className="text-base">{formatDate(InspectionData?.getPartCD?.before_repair_date)}</span>
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
                                  src={InspectionData?.personnel?.p_sign}
                                  alt="User Signature"
                                  style={{ position: 'absolute', width: '180px', top: '-36px', left: '42px' }}
                                />
                                <span className="text-base font-bold">{InspectionData?.personnel?.p_name}</span>
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
                        <span>{InspectionData?.getPartCD?.remarks}</span>
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
                          <span className="text-base">{formatDate(InspectionData?.getPartCD?.after_reapir_date)}</span>
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
                                  src={InspectionData?.personnel?.p_sign}
                                  alt="User Signature"
                                  style={{ position: 'absolute', width: '180px', top: '-36px', left: '42px' }}
                                />
                                <span className="text-base font-bold">{InspectionData?.personnel?.p_name}</span>
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

  </>
  )}
  </PageComponent>
  ):(
  (() => {
    window.location = '/forbidden';
    return null; // Return null to avoid any unexpected rendering
  })()
  )

}