import React from "react";
import PageComponent from "../components/PageComponent";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '../assets/loading.gif';
import submitAnimation from '../assets/bouncing.gif';

export default function PrePostRepairForm(){

  const { currentUser } = useUserStateContext();

  const closePopup = () => {
    setIsLoading(true);
    fetchUser();
    fetchPartB();
    fetchPartC();
    fetchPersonneData();
    fetchPersonnel();
    setShowPopup(false);
    setPartBIsEditing(false);
    setPartCIsEditing(false);
    setPartDIsEditing(false);
  };

  //Date Format 
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Usestate
  const [isLoading, setIsLoading] = useState(true);
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [displayRequest, setDisplayRequest] = useState([]);
  const [adminForm, setAdminForm] = useState([]);
  const [beforeDate, setBeforeDate] = useState('');
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [getPartC, setPartC] = useState([]); 
  const [remarks, setRemarks] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [getPersonnel, setGetPersonnel] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filledDate, setFilledDate] = useState('');
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState('');

  const [partBisEditing, setPartBIsEditing] = useState(false);
  const [partCisEditing, setPartCIsEditing] = useState(false);
  const [partDisEditing, setPartDIsEditing] = useState(false);

  //Set Errors
  const [inputErrors, setInputErrors] = useState({});

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //Get the ID
  const {id} = useParams();

  //Personnel
  const fetchPersonnel = () => {
    axiosClient.get('/getpersonnel')
    .then((response) => {
      const responseData = response.data;
      const viewPersonnel = Array.isArray(responseData) ? responseData : responseData.data;

      const mappedData = viewPersonnel.map((dataItem) => {
        const { personnel_details } = dataItem;
        const { user_id, fname, mname, lname, type } = personnel_details;
        return {
          id: user_id,
          name: fname +' ' + mname+'. ' + lname,
          type: type
        }
      });
      setGetPersonnel(mappedData)

    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);
    });
  }

  //Display the Details
  const fetchUser = () => {
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
  }

  //Part B display
  const fetchPartB = () => {
    axiosClient
    .get(`/inspectionformtwo/${id}`)
    .then((response) => {
      const responseData = response.data;

      const ps = responseData.partB.assign_personnel;
      const dateOfFilling = responseData.partB.date_of_filling;
      const dateOfLastRepair = responseData.partB.date_of_last_repair;
      const natureOfLastRepair = responseData.partB.nature_of_last_repair;

      setAdminForm({
        ps: ps,
        dateOfFilling: dateOfFilling,
        dateOfLastRepair: dateOfLastRepair,
        natureOfLastRepair: natureOfLastRepair,
      })

      setIsLoading(false);

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  // Part C and D display
  const fetchPartC = () => {
    axiosClient
    .get(`/inspectorparta/${id}`)
    .then((response) => {
      const responseData = response.data;

      const viewPartC = responseData.part_c;

      const processedData = viewPartC.map((item) => {
        const { id, before_repair_date, findings, recommendations, remarks, after_reapir_date, close } = item;
        const processedItem = {
          id,
          before_repair_date,
          findings,
          recommendations,
          remarks,
          after_reapir_date,
          close
        };
        return processedItem;
      });
    

      setPartC(processedData);

      setIsLoading(false);
    
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  // For Getting the personnnel Data
  const fetchPersonneData = () => {
    axiosClient
    .get(`/personnel/${id}`)
    .then((response) => {
      const responseData = response.data;
      const personnel_details = responseData.personnel_details;
    
      // Map the data to an array of IDs
      const mappedData = personnel_details.map((dataItem) => {
        return {
          p_name: dataItem.p_name,
          p_signature: dataItem.p_signature,
        };
      });
    
      setAssignPersonnel(mappedData);
    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);
    });
  };

  useEffect(()=>{
    fetchUser();
    fetchPartB();
    fetchPartC();
    fetchPersonneData();
    fetchPersonnel();
  },[id]);

  //Send the data on Part B
  const SubmitInspectionFormTo = (event, id) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient.post(`/inspectionformrequesttwo/${id}`,{
      date_of_filling: filledDate,
      date_of_last_repair: lastfilledDate,
      nature_of_last_repair: natureRepair,
      assign_personnel: pointPersonnel
    })
    .then((response) => {
      setPopupMessage('Done'); 
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
  
  //Submit on Part C Form
  const SubmitPartC = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`inspector/${id}`, {
      before_repair_date: beforeDate,
      findings: finding,
      recommendations: recommendation
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Done");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  //Enable Part B Form
  const handlePartBEditClick = () => { setPartBIsEditing(true); }

  //Disable Form
  const handleDisableEdit = () => { 
    setPartBIsEditing(false);
    setPartCIsEditing(false);
    setPartDIsEditing(false); 
  }

  //It will switch into form input on Part C
  const handlePartCEditClick = () => { setPartCIsEditing(true); };

  //It will switch into form input on Part D
  const handlePartDEditClick = () => {
    setPartDIsEditing(true);
  };

  // Submit on Part D Form
  const SubmitPartD = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`inspectorpartb/${id}`, {
      after_reapir_date: afterDate,
      remarks: remarks
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Done");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  const componentRef= useRef();

  //Generate PDF
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Control No:${id}`
  });

  //Supervisor click on approval 
  function handleApproveClick(id){

    // alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/approve/${id}`)
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

  };

  //Supervisor click on disapproval 
  function handleDisapproveClick(id){
    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/disapprove/${id}`)
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
      setPopupMessage('You change your mind');
      setShowPopup(true);
    }
  }

  //Admin click on approval
  function handleAdminApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/admin_approve/${id}`)
      .then((response) => {
        setPopupMessage('Thank you for your Approval');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }else{
      alert('You change your mind');
    }

  }

  //Admin click on disapproval
  function handleAdminDisapproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/admin_disapprove/${id}`)
      .then((response) => {
        setPopupMessage('Disapprove Successfully');
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
  }

  //Close the request
  function handleCloseRequest(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to close the request?');

    if(confirmed) {
      axiosClient.put(`/requestclose/${id}`)
      .then((response) => {
        setPopupMessage('The request has been close');
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
  
  return(
    <PageComponent title="Pre-Repair/Post Repair Inspection Form">
    <div>
      {isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
        <span className="ml-2">Loading Form...</span>
      </div>
      ):(
        <div>
        {displayRequest.userDetails ? (
          <div>
          
          {/* Display Preview */}   
          <div>
            {/* Control Number */}
            <div className="font-arial text-right">
              <span>Control No:</span>{" "}
              <span style={{ textDecoration: "underline", fontWeight: "900" }}>
                __________
                {displayRequest.viewRequestData.id}
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
                <b>PRE-REPAIR/POST REPAIR INSPECTION FORM</b>
              </td>
              <td className="border border-black p-0 font-arial">
                <div className="border-b border-black p-1">Form No.: PM:VEC:LNI:WEN:FM:03</div>
                <div className="border-b border-black p-1">Revision No.: 01</div>
                <div className="p-1">Date of Effectivity: 03/26/2021</div>
              </td>
            </tr>

            {/* Black */}
            <tr>
              <td colSpan={3} className="border border-black p-3 font-arial"></td>
            </tr>

            {/* Part A Label */}
            <tr>
              <td colSpan={3} className="border border-black p-1 font-arial">
              <h3 className="text-lg font-normal leading-6 text-gray-900">PART A: To be filled-up by Requesting Party</h3>
              </td>
            </tr>

            {/* Part A Forms */}
            <tr>
              <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">
                <div>

                  {/* Date Requested */}
                  <div className="mt-6">
                    <div className="flex">
                      <div className="w-36">
                        <strong>Date</strong>
                      </div>
                      <div className="w-64 border-b border-black pl-1">
                        <span>{formatDate(displayRequest.viewRequestData.date_of_request)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ----- */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* Column 1 */}
                    <div className="col-span-1">

                      {/* Property Number */}
                      <div className="mt-8">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Property No</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{displayRequest.viewRequestData.property_number}</span>
                          </div>
                        </div>
                      </div>

                      {/* Acquisition Date */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Acquisition Date</strong>
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{formatDate(displayRequest.viewRequestData.acq_date)}</span>
                          </div> 
                        </div>
                      </div>

                      {/* Acquisition Cost */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Acquisition Cost</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>₱{(displayRequest.viewRequestData.acq_cost)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brand/Model */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Brand/Model</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{displayRequest.viewRequestData.brand_model}</span>
                          </div>
                        </div>
                      </div>

                      {/* Serial/Engine No. */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Serial/Engine No.</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{displayRequest.viewRequestData.serial_engine_no}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Column 2 */}
                    <div className="col-span-1">

                      {/* Type of Property */}
                      <div className="mt-6">
                        <div className="flex">
                          <div className="w-1/4">
                            <strong>Type of Property</strong> 
                          </div>
                          <div className="w-68">
                          {displayRequest.viewRequestData.type_of_property === 'Vehicle Supplies & Materials' ? (
                            <div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold">X</div>
                                <span>Vehicle Supplies & Materials</span>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>IT Equipment & Related Materials</span>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>Others: Specify</span>
                              </div>
                            </div>
                          ) : displayRequest.viewRequestData.type_of_property === 'IT Equipment & Related Materials' ? (
                            <div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>Vehicle Supplies & Materials</span>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                                <span>IT Equipment & Related Materials</span>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>Others: Specify</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>Vehicle Supplies & Materials</span>
                              </div>

                              <div className="flex items-center">
                              <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                                <span>IT Equipment & Related Materials</span>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                                <div>
                                  <span  className="mr-2">Others:</span>
                                  <span className="w-70 border-b border-black">{displayRequest.viewRequestData.property_other_specific}</span>
                                </div>
                              </div>
                            </div>
                          )}        
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-60">
                            <strong>Description</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{displayRequest.viewRequestData.property_description}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-2">
                        <div className="flex">
                          <div className="w-60">
                            <strong>Location (Div/Section/Unit)</strong> 
                          </div>
                          <div className="w-64 border-b border-black pl-1">
                            <span>{displayRequest.viewRequestData.location}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Complain */}
                  <div className="mt-2">
                    <div className="flex">
                      <div className="w-44">
                        <strong>Complain/Defect</strong>
                      </div>
                      <div className="w-full border-b border-black pl-1">
                        <span>{displayRequest.viewRequestData.complain}</span>
                      </div>
                    </div>
                  </div>

                  {/* For Signature */}
                  <div className="mt-10">
                    <div className="grid grid-cols-2 gap-4">

                      {/* For Requestor Signature */}
                      <div className="col-span-1">
                        <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>REQUESTED BY:</strong> </label>
                        <div className="mt-10">
                          <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                            <div>
                            <img src={displayRequest.userDetails.requestor_signature} alt="User Signature" style={{ position: 'absolute', width: '100%', top: '-40px', left: '0px' }} />
                            </div>
                            <span>{displayRequest.userDetails.enduser}</span>
                          </div>
                          <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>End-User</strong> </label>
                        </div>
                      </div>
                      
                      {/* For Supervisor Signature */}
                      <div className="col-span-1"> 
                        <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> 
                          <strong>NOTED: {displayRequest.viewRequestData.supervisor_approval === 1 ? "Approve" : displayRequest.viewRequestData.supervisor_approval === 2 ? "Disapprove" : null} </strong>
                        </label>
                        <div className="mt-10">
                          <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                            <div>
                              {displayRequest.viewRequestData.supervisor_approval !== 0 ? (
                                <img
                                src={displayRequest.userDetails.supervisor_signature}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '100%', top: '-40px', left: '0px' }}
                              />
                              ): null }
                              <span>{displayRequest.userDetails.supervisor}</span>
                            </div>
                          </div>
                          <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Immediate Supervisor</strong> </label>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Buttons */}
                  {currentUser.id === displayRequest.viewRequestData.supervisor_name && displayRequest.viewRequestData.supervisor_approval === 0 ? 
                  (
                  <div className="flex mt-12 justify-center">
                    <button 
                      onClick={() => handleApproveClick(displayRequest.viewRequestData.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                      title="Approve"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleDisapproveClick(displayRequest.viewRequestData.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
                      title="Disapprove"
                    >
                      Disapprove
                    </button>
                  </div>
                  ) : null }

                </div>
              </td>
            </tr>

            {/* Part B Label */}
            <tr>
              <td colSpan={3} className="border border-black p-1 font-arial">
              <h3 className="text-lg font-normal leading-6 text-gray-900">PART B: To be filled-up by Administrative Division</h3>
              </td>
            </tr>

            {/* Part B Forms */}
            <tr>
            {displayRequest.viewRequestData.supervisor_approval === 0 && displayRequest.viewRequestData.admin_approval === 0 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">
            <div>

              {/* Date */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Date of Last Repair */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date of Last Repair</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Nature of Repair */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-52">
                    <strong>Nature of Last Repair</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">
                  {/* For GSO Signature */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>REQUESTED BY:</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>General Service Officer</strong> </label>
                    </div>
                  </div>
                  {/* For Admin Division Manager */}
                  <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                    <strong>NOTED:</strong>
                  </label>
                    <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Admin Division Manager</strong> </label>
                    </div>
                  </div>
                </div>
              </div>  

            </div>
            </td>  
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 0 ? (
            <>
            {partBisEditing ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">
              <form onSubmit={event => SubmitInspectionFormTo(event, displayRequest.viewRequestData.id)}>

                {/* Date */}
                <div className="flex mt-6 pl-1">
                  <div className="w-44">
                    <label htmlFor="date_filled" className="block text-base font-bold leading-6 text-gray-900">Date:</label> 
                  </div>
                  <div className="w-64">
                    <input
                      type="date"
                      name="date_filled"
                      id="date_filled"
                      value={filledDate}
                      onChange={ev => setFilledDate(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    {inputErrors.date_of_filling && (
                      <p className="text-red-500 text-xs mt-2">Date is required</p>
                    )}
                  </div>
                </div>

                {/* Date of Last Repair */}
                <div className="flex mt-4 pl-1">
                  <div className="w-44">
                    <label htmlFor="last_date_filled" className="block text-base font-bold leading-6 text-gray-900">Date of Last Repair:</label> 
                  </div>
                  <div className="w-64">
                    <input
                      type="date"
                      name="last_date_filled"
                      id="last_date_filled"
                      value={lastfilledDate}
                      onChange={ev => setLastFilledDate(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    {inputErrors.date_of_last_repair && (
                      <p className="text-red-500 text-xs mt-2">Last Repair Date is required</p>
                    )}
                  </div>
                </div>

                {/* Date of Nature of Last Repair */}
                <div className="flex mt-4 pl-1">
                  <div className="w-44">
                    <label htmlFor="nature_repair" className="block text-base font-bold leading-6 text-gray-900">Nature of Last Repair :</label> 
                  </div>
                  <div className="w-64">
                  <textarea
                    id="nature_repair"
                    name="nature_repair"
                    rows={2}
                    value={natureRepair}
                    onChange={ev => setNatureRepair(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.nature_of_last_repair && (
                    <p className="text-red-500 text-xs mt-2">Nature of Repair is required</p>
                  )}
                  </div>
                </div>

                {/* Assign Personnel */}
                <div className="flex mt-4 pl-1">
                  <div className="w-44">
                    <label htmlFor="nature_repair" className="block text-base font-bold leading-6 text-gray-900">Assign Personnel :</label> 
                  </div>
                  <div className="w-64">
                  <select 
                    name="plate_number" 
                    id="plate_number" 
                    autoComplete="request-name"
                    value={pointPersonnel}
                    onChange={ev => setPointPersonnel(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  > 
                    <option value="" disabled>Select an option</option>
                    {getPersonnel.map(user => (
                      <option key={user.id} value={user.id}>{user.name} - {user.type}</option>
                    ))}
                  </select>
                  {inputErrors.assign_personnel && (
                    <p className="text-red-500 text-xs mt-2">Assign Personnel is required</p>
                  )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex mt-10 pl-1">
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
                <button 
                    onClick={handleDisableEdit}
                    className="bg-red-500 hover:bg-red-700 text-sm text-white font-bold py-2 px-4 rounded ml-2"
                  > 
                    Cancel     
                  </button>
                </div>
                

              </form>
            </td>
            ):(
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">
              <div>

                {/* Date */}
                <div className="mt-8">
                  <div className="flex">
                    <div className="w-44">
                      <strong>Date</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Date of Last Repair */}
                <div className="mt-8">
                  <div className="flex">
                    <div className="w-44">
                      <strong>Date of Last Repair</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Nature of Repair */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-52">
                      <strong>Nature of Last Repair</strong>
                    </div>
                    <div className="w-full border-b border-black pl-1">
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-10">
                  <div className="grid grid-cols-2 gap-4">
                    {/* For GSO Signature */}
                    <div className="col-span-1">
                      <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>REQUESTED BY:</strong> </label>
                      <div className="mt-10">
                        <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                          <span>{displayRequest.gsoDetails.gso_name}</span>
                        </div>
                        <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>General Service Officer</strong> </label>
                      </div>
                    </div>
                    {/* For Admin Division Manager */}
                    <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                      <strong>NOTED:</strong>
                    </label>
                      <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                          {displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 1 ? (
                            <img
                              src={displayRequest.manegerDetails.manager_signature}
                              alt="User Signature"
                              style={{ position: 'absolute', width: '80%', top: '-45px', left: '25px' }}
                            />
                          ) : null}
                          <span>{displayRequest.manegerDetails.manager_name}</span>
                        </div>
                      </div>
                        <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Admin Division Manager</strong> </label>
                      </div>
                    </div>
                  </div>
                </div>  
                
                {currentUser.code_clearance === 3 ? (
                <div className="mt-10">
                  <button
                    onClick={handlePartBEditClick}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Fill up the Part B
                  </button>
                </div>
                ):null}
                
              </div>
            </td>
            )}
            </>               
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 3 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

              {/* Date */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfFilling)}</span>
                  </div>
                </div>
              </div>

              {/* Date of Last Repair */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date of Last Repair</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfLastRepair)}</span>
                  </div>
                </div>
              </div>

              {/* Nature of Repair */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-52">
                    <strong>Nature of Last Repair</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{adminForm.natureOfLastRepair}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">

                  {/* For GSO Signature */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>REQUESTED BY:</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                        <img src={displayRequest.gsoDetails.gso_signature} alt="User Signature" style={{ position: 'absolute', width: '100%', top: '-65px', left: '0px' }} />
                        </div>
                        <span>{displayRequest.gsoDetails.gso_name}</span>
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>General Service Officer</strong> </label>
                    </div>
                  </div>

                  {/* For Admin Division Manager */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                          <span>{displayRequest.manegerDetails.manager_name}</span>
                        </div>
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Admin Division Manager</strong> </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              {currentUser.code_clearance === 1 ? (
                <div className="flex mt-12 justify-center">
                  <button 
                    onClick={() => handleAdminApproveClick(displayRequest.viewRequestData.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    title="Approve"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAdminDisapproveClick(displayRequest.viewRequestData.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
                    title="Disapprove"
                  >
                    Disapprove
                  </button>
                </div>
                ): null}
 
            </td>
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 1 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

              {/* Date */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfFilling)}</span>
                  </div>
                </div>
              </div>

              {/* Date of Last Repair */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date of Last Repair</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfLastRepair)}</span>
                  </div>
                </div>
              </div>

              {/* Nature of Repair */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-52">
                    <strong>Nature of Last Repair</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{adminForm.natureOfLastRepair}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">

                  {/* For GSO Signature */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>REQUESTED BY:</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                        <img src={displayRequest.gsoDetails.gso_signature} alt="User Signature" style={{ position: 'absolute', width: '100%', top: '-65px', left: '0px' }} />
                        </div>
                        <span>{displayRequest.gsoDetails.gso_name}</span>
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>General Service Officer</strong> </label>
                    </div>
                  </div>

                  {/* For Admin Division Manager */}
                  <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                    <strong>NOTED: {displayRequest.viewRequestData.admin_approval === 1 ? "Approve" : displayRequest.viewRequestData.admin_approval === 0 ? "Disapprove" : null}</strong>
                  </label>
                    <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      <div>
                        <img
                          src={displayRequest.manegerDetails.manager_signature}
                          alt="User Signature"
                          style={{ position: 'absolute', width: '80%', top: '-45px', left: '25px' }}
                        />
                        <span>{displayRequest.manegerDetails.manager_name}</span>
                      </div>
                    </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Admin Division Manager</strong> </label>
                    </div>
                  </div>

                </div>
              </div>

            </td>
            ):
            null}
            </tr>
                  
            {/* Part C Label */}
            <tr>
              <td colSpan={3} className="border border-black p-1 font-arial">
              <h3 className="text-lg font-normal leading-6 text-gray-900">PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.</h3>
              </td>
            </tr>

            {/* Part C Forms */}
            <tr>
            {displayRequest.viewRequestData.supervisor_approval === 0 && displayRequest.viewRequestData.admin_approval === 0 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

              {/* Findings */}
              <div className="mt-10">
                <div className="flex">
                  <div className="w-44">
                    <strong>Findings</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Recomendations */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-44">
                    <strong>Recommendation/s</strong> 
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">

                {/* Date Inspected */}
                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>DATE INSPECTED</strong> </label>
                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Inspector */}
                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    
                    </div>
                    <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Property Inspector</strong> </label>
                  </div>
                </div>

                </div>
              </div>

            </td> 
            ): 
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 0 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

              {/* Findings */}
              <div className="mt-10">
                <div className="flex">
                  <div className="w-44">
                    <strong>Findings</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Recomendations */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-44">
                    <strong>Recommendation/s</strong> 
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">

                {/* Date Inspected */}
                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>DATE INSPECTED</strong> </label>
                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      <span></span>
                    </div>
                  </div>
                </div>

                {/* Inspector */}
                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    
                    </div>
                    <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Property Inspector</strong> </label>
                  </div>
                </div>

                </div>
              </div>

            </td> 
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 1 ? (
            <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

            {partCisEditing ? (
            <>
            <p className="text-xs mt-6"><span className="text-red-500">Please check the field before submit</span></p>
            <form onSubmit={SubmitPartC}>

              {/* Date Inspected */}
              <div className="flex mt-10">
                <div className="w-40">
                  <label htmlFor="date_insp" className="block text-base font-bold leading-6 text-gray-900">Date Inspected :</label> 
                </div>
                <div className="w-64">
                  <input
                    type="date"
                    name="date_insp"
                    id="date_insp"
                    value= {beforeDate}
                    onChange={ev => setBeforeDate(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* For Findings */}
              <div className="flex mt-4">
                <div className="w-40">
                  <label htmlFor="findings" className="block text-base font-bold leading-6 text-gray-900"> Finding/s :</label> 
                </div>
                <div className="w-64">
                <textarea
                  id="findings"
                  name="findings"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {finding}
                  onChange={ev => setFinding(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                </div>
              </div>

              {/* For Recomendation */}
              <div className="flex mt-4">
                <div className="w-40">
                  <label htmlFor="recomendations" className="block text-base font-bold leading-6 text-gray-900"> Recomendation/s :</label> 
                </div>
                <div className="w-64">
                <textarea
                  id="recomendations"
                  name="recomendations"
                  rows={3}
                  style={{ resize: "none" }}
                  value= {recommendation}
                  onChange={ev => setRecommendation(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex mt-10">
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
                <button 
                  onClick={handleDisableEdit}
                  className="bg-red-500 hover:bg-red-700 text-sm text-white font-bold py-2 px-4 rounded ml-2"
                > 
                  Cancel     
                </button>
              </div>
              
            </form>
            </>
            ):(
            getPartC.map((item, index) => (
              <div key={index}>

                {/* Findings */}
                <div className="mt-10">
                  <div className="flex">
                    <div className="w-44">
                      <strong>Findings</strong>
                    </div>
                    <div className="w-full border-b border-black pl-1">
                      <span>{item.findings !== "no data" ? item.findings : null}</span>
                    </div>
                  </div>
                </div>

                {/* Recomendations */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-44">
                      <strong>Recommendation/s</strong> 
                    </div>
                    <div className="w-full border-b border-black pl-1">
                      <span>{item.recommendations !== "no data" ? item.recommendations : null}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-10">
                  <div className="grid grid-cols-2 gap-4">

                  {/* Date Inspected */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>DATE INSPECTED</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <span>{item.before_repair_date !== "1970-01-01" ? formatDate(item.before_repair_date) : null }</span>
                      </div>
                    </div>
                  </div>

                  {/* Inspector */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      {item.findings !== "no data" ? (
                        assignPersonnel.map((item, index) => (
                          <div key={index} className="personnel-container">
                            <img
                              src={item.p_signature}
                              alt="User Signature"
                              style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                            />
                            <span>{item.p_name}</span>
                          </div>
                        ))
                      ):null}
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Property Inspector</strong> </label>
                    </div>
                  </div>

                  </div>
                </div>

                {/* Button */}
                {adminForm.ps === currentUser.id ? (
                  item.findings === "no data" ? (
                  <div className="mt-10">
                    <button 
                      onClick={handlePartCEditClick}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    > 
                      Fill up the Part C     
                    </button>
                  </div>
                  ):null
                ):null}
                

              </div>
            ))
            )}
            </td> 
            ):
            null}
            </tr>        
            
            {/* Part D Label */}
            <tr>
              <td colSpan={3} className="border border-black p-1 font-arial">
              <h3 className="text-lg font-normal leading-6 text-gray-900">PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.</h3>
              </td>
            </tr>

            {/* Part D Forms */}
            <tr>
            {displayRequest.viewRequestData.supervisor_approval === 0 && displayRequest.viewRequestData.admin_approval === 0 ? (
              <td colSpan={3} className="border border-black p-1 font-arial">

              {/* Remarks if has no data */}
              <div className="mt-10">
                <div className="flex">
                  <div className="w-44">
                    <strong>Remark/s</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10 pb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                      DATE INSPECTED
                    </label>
                    <div className="mt-12">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                      NOTED:
                    </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
        
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-bold italic leading-6 text-gray-900">
                        Property Inspector
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              </td>
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 0 ? (
              <td colSpan={3} className="border border-black p-1 font-arial">

              {/* Remarks if has no data */}
              <div className="mt-10">
                <div className="flex">
                  <div className="w-44">
                    <strong>Remark/s</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10 pb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                      DATE INSPECTED
                    </label>
                    <div className="mt-12">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                      NOTED:
                    </label>
                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
        
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-bold italic leading-6 text-gray-900">
                        Property Inspector
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              </td>
            ):
            displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 1 ? (
              <td colSpan={3} className="border border-black p-1 font-arial">

              {partDisEditing ? (
              <form onSubmit={SubmitPartD}>
                {/* Date Inspected */}
                <div className="flex mt-10">
                  <div className="w-40">
                    <label htmlFor="date_insp" className="block text-base font-medium leading-6 text-gray-900">
                      Date Inspected :
                    </label>
                  </div>
                  <div className="w-64">
                    <input
                      type="date"
                      name="date_insp"
                      id="date_insp"
                      value={afterDate}
                      onChange={(ev) => setAfterDate(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* For Remarks */}
                <div className="flex mt-4">
                  <div className="w-40">
                    <label htmlFor="recomendations" className="block text-base font-medium leading-6 text-gray-900">
                      Remark/s :
                    </label>
                  </div>
                  <div className="w-64">
                    <textarea
                      id="recomendations"
                      name="recomendations"
                      rows={3}
                      style={{ resize: "none" }}
                      value={remarks}
                      onChange={(ev) => setRemarks(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Submitt Button */}
                <div className="flex mt-10 mb-8">
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
                  <button
                    onClick={handleDisableEdit}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              ):(
              getPartC.map((item, index) => (
              <div key={index}>

                {/* Remarks if has no data */}
                <div className="mt-10">
                  <div className="flex">
                    <div className="w-44">
                      <strong>Remark/s</strong>
                    </div>
                    <div className="w-full border-b border-black pl-1">
                      <span>{item.remarks ? item.remarks : null}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-10 pb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                        DATE INSPECTED
                      </label>
                      <div className="mt-12">
                        <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                          <span>{item.after_reapir_date ? formatDate(item.after_reapir_date) : null}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="type_of_property" className="block text-sm font-bold leading-6 text-gray-900">
                        NOTED:
                      </label>
                      <div className="mt-10">
                        <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        {item.remarks ? (
                          assignPersonnel.map((item, index) => (
                            <div key={index} className="personnel-container">
                              <img
                                src={item.p_signature}
                                alt="User Signature"
                                style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                              />
                              <span>{item.p_name}</span>
                            </div>
                          ))
                        ):null}
                        </div>
                        <label htmlFor="type_of_property" className="block text-sm text-center font-bold italic leading-6 text-gray-900">
                          Property Inspector
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button */}
                {adminForm.ps === currentUser.id ? (
                item.findings !== "no data" ? (
                  item.remarks ? null:(
                    <div className="mb-8">
                      <button
                        onClick={handlePartDEditClick}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Fill up the Part D
                      </button>
                    </div>
                  )
                ):null
                ):null}
                

              </div>
              ))
              )}

              </td>
            ):
            null}
            </tr> 
          </table>
          </div>
          
            
          {/* For Generate PDF */}
          {getPartC.map((item, index) => (
          <div key={index}>
          {item.close === 1 ? (
            <div style={{display: 'none'}}>
              <div ref={componentRef}>
                <div style={{ width: '210mm', height: '297mm', padding: '20px', border: '1px solid' }}>

                  {/* Control Number */}
                  <div className="title-area font-arial pr-6 text-right">
                    <span>Control No:</span>{" "}
                    <span style={{ textDecoration: "underline", fontWeight: "900" }}>       
                      {displayRequest.viewRequestData.id}
                    </span>
                  </div>

                  <table className="w-full border-collapse border border-black">

                    {/* Title and Logo */}
                    <tr>
                    <td className="border border-black p-1 text-center" style={{ width: '100px' }}>
                      <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '50px' }} />
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
                      <td colSpan={3} className="border border-black p-2 font-arial"></td>
                    </tr>
        
                    {/* Part A Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 font-arial">
                        <h3 className="title-area font-semibold leading-6 text-gray-900">PART A: To be filled-up by Requesting Party</h3>
                      </td>
                    </tr>

                    {/* Part A Forms */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 pr-2 pb-4 font-arial">
                        <div>

                          {/* Date Requested */}
                          <div className="mt-4">
                            <div className="flex">
                              <div className="w-24 content-area">
                                <strong>Date</strong>
                              </div>
                              <div className="w-64 border-b border-black pl-1 content-area">
                                <span>{formatDate(displayRequest.viewRequestData.date_of_request)}</span>
                              </div>
                            </div>
                          </div>

                          {/* ----- */}
                          <div className="grid grid-cols-2 gap-4">

                            {/* Column 1 */}
                            <div className="col-span-1">

                              {/* Property Number */}
                              <div className="mt-8">
                                <div className="flex">
                                  <div className="w-24 content-area">
                                    <strong>Property No</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>{displayRequest.viewRequestData.property_number}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Acquisition Date */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-24 content-area">
                                    <strong>Acquisition Date</strong>
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>{formatDate(displayRequest.viewRequestData.acq_date)}</span>
                                  </div> 
                                </div>
                              </div>

                              {/* Acquisition Cost */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-24 content-area">
                                    <strong>Acquisition Cost</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>₱{(displayRequest.viewRequestData.acq_cost)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Brand/Model */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-24 content-area">
                                    <strong>Brand/Model</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>{displayRequest.viewRequestData.brand_model}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Serial/Engine No. */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-24 content-area">
                                    <strong>Serial/Engine No.</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>{displayRequest.viewRequestData.serial_engine_no}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* Column 2 */}
                            <div className="col-span-1">

                              {/* Type of Property */}
                              <div className="mt-6">
                                <div className="flex">
                                  <div className="w-1/4 content-area">
                                    <strong>Type of Property</strong> 
                                  </div>
                                  <div className="w-68">
                                  {displayRequest.viewRequestData.type_of_property === 'Vehicle Supplies & Materials' ? (
                                    <div>
                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-black font-bold">X</div>
                                        <span>Vehicle Supplies & Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>IT Equipment & Related Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>Others: Specify</span>
                                      </div>
                                    </div>
                                  ) : displayRequest.viewRequestData.type_of_property === 'IT Equipment & Related Materials' ? (
                                    <div>
                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>Vehicle Supplies & Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                                        <span>IT Equipment & Related Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>Others: Specify</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>Vehicle Supplies & Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                      <div className="w-4 h-4 border border-black mr-2 mt-1"></div>
                                        <span>IT Equipment & Related Materials</span>
                                      </div>

                                      <div className="flex items-center content-area">
                                        <div className="w-4 h-4 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                                        <div>
                                          <span  className="mr-2 content-area">Others:</span>
                                          <span className="w-70 border-b border-black content-area">{displayRequest.viewRequestData.property_other_specific}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}        
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-28 content-area">
                                    <strong>Description</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl-1 content-area">
                                    <span>{displayRequest.viewRequestData.property_description}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="mt-2">
                                <div className="flex">
                                  <div className="w-40 content-area">
                                    <strong>Location (Div/Section/Unit)</strong> 
                                  </div>
                                  <div className="w-64 border-b border-black pl- content-area">
                                    <span>{displayRequest.viewRequestData.location}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>

                          {/* Complain */}
                          <div className="mt-2">
                            <div className="flex">
                              <div className="w-28 content-area">
                                <strong>Complain/Defect</strong>
                              </div>
                              <div className="w-full border-b border-black pl-1 content-area">
                                <span>{displayRequest.viewRequestData.complain}</span>
                              </div>
                            </div>
                          </div>

                          {/* For Signature */}
                          <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">

                              {/* For Requestor Signature */}
                              <div className="col-span-1">
                                <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area"> <strong>REQUESTED BY:</strong> </label>
                                <div className="mt-2">
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <div>
                                    <img src={displayRequest.userDetails.requestor_signature} alt="User Signature" style={{ position: 'absolute', width: '60%', top: '-15px', left: '52px' }} />
                                    </div>
                                    <span className="content-area">{displayRequest.userDetails.enduser}</span>
                                  </div>
                                  <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900 content-area"> <strong>End-User</strong> </label>
                                </div>
                              </div>
                              
                              {/* For Supervisor Signature */}
                              <div className="col-span-1">
                                <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area"> <strong>NOTED:</strong> </label>
                                <div className="mt-2">
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <div>
                                      <img
                                        src={displayRequest.userDetails.supervisor_signature}
                                        alt="User Signature"
                                        style={{ position: 'absolute', width: '60%', top: '-15px', left: '52px' }}
                                      />
                                      <span className="content-area">{displayRequest.userDetails.supervisor}</span>
                                    </div>
                                  </div>
                                  <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900 content-area"> <strong>Immediate Supervisor</strong> </label>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>

                    {/* Part B Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 font-arial">
                      <h3 className="title-area font-semibold leading-6 text-gray-900">PART B: To be filled-up by Administrative Division</h3>
                      </td>
                    </tr>

                    {/* Part B Forms */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 pr-2 pb-4 font-arial">

                      <div>

                        {/* Date */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-28 content-area">
                              <strong>Date</strong> 
                            </div>
                            <div className="w-64 border-b border-black pl-1 content-area">
                              <span>{formatDate(adminForm.dateOfFilling)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Date of Last Repair */}
                        <div className="mt-8">
                          <div className="flex">
                            <div className="w-28 content-area">
                              <strong>Date of Last Repair</strong> 
                            </div>
                            <div className="w-64 border-b border-black pl-1 content-area">
                              <span>{formatDate(adminForm.dateOfLastRepair)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Nature of Repair */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-36 content-area">
                              <strong>Nature of Last Repair</strong>
                            </div>
                            <div className="w-full border-b border-black pl-1 content-area">
                              <span>{adminForm.natureOfLastRepair}</span>
                            </div>
                          </div>
                        </div>

                        {/* Signature */}
                        <div className="mt-4">
                          <div className="grid grid-cols-2 gap-4">

                            {/* For GSO Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area"> <strong>REQUESTED BY:</strong> </label>
                              <div className="mt-2">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <div>
                                  <img src={displayRequest.gsoDetails.gso_signature} alt="User Signature" style={{ position: 'absolute', width: '60%', top: '-30px', left: '52px' }} />
                                  </div>
                                  <span className="content-area">{displayRequest.gsoDetails.gso_name}</span>
                                </div>
                                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900 content-area"> <strong>General Service Officer</strong> </label>
                              </div>
                            </div>

                            {/* For Admin Division Manager */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area"> <strong>NOTED:</strong> </label>
                              <div className="mt-2">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <div>
                                    <img
                                      src={displayRequest.manegerDetails.manager_signature}
                                      alt="User Signature"
                                      style={{ position: 'absolute', width: '50%', top: '-20px', left: '70px' }}
                                    />
                                    <span className="content-area">{displayRequest.manegerDetails.manager_name}</span>
                                  </div>
                                </div>
                                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900 content-area"> <strong>Admin Division Manager</strong> </label>
                              </div>
                            </div>

                          </div>
                        </div>
                          
                      </div>

                      </td>
                    </tr>

                    {/* Part C Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 font-arial">
                      <h3 className="title-area font-semibold leading-6 text-gray-900">PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.</h3>
                      </td>
                    </tr>

                    {/* Part C Forms */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 pr-2 pb-4 font-arial">

                      <div className="mt-0">
                        {getPartC.map((item, index) => (
                          <div key={index}>

                            {/* Finding */}
                            <div className="mt-4">
                              <div className="flex">
                                <div className="w-36 content-area">
                                  <strong>Findings</strong>
                                </div>
                                <div className="w-full border-b border-black pl-1 content-area">
                                  <span>{item.findings}</span>
                                </div>
                              </div>
                            </div>

                            {/* Recommendations */}
                            <div className="mt-4">
                              <div className="flex">
                                <div className="w-36 content-area">
                                  <strong>Recommendation/s</strong>
                                </div>
                                <div className="w-full border-b border-black pl-1 content-area">
                                  <span>{item.recommendations}</span>
                                </div>
                              </div>
                            </div>

                            {/* Signature */}
                            <div className="mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area">
                                    <strong>DATE INSPECTED</strong>
                                  </label>
                                  <div className="mt-2">
                                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                      <span className="content-area">{formatDate(item.before_repair_date)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-1">
                                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area">
                                    <strong>NOTED:</strong>
                                  </label>
                                  <div className="mt-2">
                                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                      <div>
                                        {assignPersonnel.map((personnel, index) => (
                                          <div key={index} className="personnel-container">
                                            <img
                                              src={personnel.p_signature}
                                              alt="User Signature"
                                              style={{ position: 'absolute', width: '50%', top: '-20px', left: '70px' }}
                                            />
                                            <span className="content-area">{personnel.p_name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900 content-area">
                                      <strong>Property Inspector</strong>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      </td>
                    </tr>

                    {/* Part D Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 font-arial">
                      <h3 className="title-area font-semibold leading-6 text-gray-900">PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.</h3>
                      </td>
                    </tr>

                    {/* Part D Forms */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-2 pr-2 pb-2 font-arial">
                        <div className="mt-0">

                        {getPartC.map((item, index) => (
                          <div key={index}>

                            {/* Remarks if has data */}
                            <div className="mt-4">
                              <div className="flex">
                                <div className="w-20 content-area">
                                  <strong>Remark/s</strong>
                                </div>
                                <div className="w-full border-b border-black pl-1 content-area">
                                  <span>{item.remarks}</span>
                                </div>
                              </div>
                            </div>

                            {/* Signature */}
                            <div className="mt-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900 content-area">
                                    DATE INSPECTED
                                  </label>
                                  <div className="mt-4">
                                    <div className="w-64 mx-auto border-b text-center border-black pl-1 content-area" style={{ position: 'relative' }}>
                                      <span>{formatDate(item.after_reapir_date)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-span-1">
                                  <label htmlFor="type_of_property" className="block font-medium leading-6 text-gray-900 content-area">
                                    NOTED:
                                  </label>
                                  <div className="mt-2">
                                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                      <div>
                                        {assignPersonnel.map((item, index) => (
                                          <div key={index} className="personnel-container">
                                            <img
                                              src={item.p_signature}
                                              alt="User Signature"
                                              style={{ position: 'absolute', width: '50%', top: '-20px', left: '70px' }}
                                            />
                                            <span className="content-area">{item.p_name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <label htmlFor="type_of_property" className="block text-center font-medium italic leading-6 text-gray-900 content-area">
                                      Property Inspector
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        ))}
                      
                        </div>
                      </td>
                    </tr>


                  </table>
                </div>
              </div>
            </div>
          ):null}
          </div>
          ))}

          {/* Button */}
          <div className="mt-4 flex">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link to="/">Back to Dashboard</Link>
            </button>
            {getPartC.map((item, index) => (
              <div key={index}>
                {currentUser.code_clearance === 3 || currentUser.code_clearance === 6 ? (
                  item.close === 0 || item.close === 2 ? null : (
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={generatePDF}>
                      Generate PDF
                    </button>
                  )
                ):null
                }
                {item.close === 2 && currentUser.code_clearance === 3 ? (
                  <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" 
                  onClick={() => handleCloseRequest(item.id)}>
                    Close Request
                  </button>
                ) : 
                item.close === 2 && currentUser.code_clearance === 6 ? (
                  <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" 
                  onClick={() => handleCloseRequest(item.id)}>
                    Close Request
                  </button>
                ) : 
                item.close === 1 ? null : null}
              </div>
            ))}
          </div>

          {/* Show Popup */}
          {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div
            className="fixed inset-0 bg-black opacity-40" // Close on overlay click
          ></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
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
            
          </div>
        ) : (
          <div>User details not available.</div>
        )}
        </div>
      )}
    </div>
    </PageComponent>
  );
}