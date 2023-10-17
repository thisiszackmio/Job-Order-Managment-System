import React from "react";
import PageComponent from "../components/PageComponent";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner  } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from "react-to-print";

export default function PrePostRepairForm(){

  //Date Format 
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Get Library From the Fontawesome
  library.add(faSpinner);

  //Usestate
  const [isLoading, setIsLoading] = useState(true);
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [displayRequest, setDisplayRequest] = useState([]);
  const [adminForm, setAdminForm] = useState([]);
  const [partCisEditing, setPartCIsEditing] = useState(false);
  const [beforeDate, setBeforeDate] = useState('');
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [getPartC, setPartC] = useState([]);
  const [partDisEditing, setPartDIsEditing] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [afterDate, setAfterDate] = useState('');

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //Get the ID
  const {id} = useParams();

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

      const dateOfFilling = responseData.partB.date_of_filling;
      const dateOfLastRepair = responseData.partB.date_of_last_repair;
      const natureOfLastRepair = responseData.partB.nature_of_last_repair;

      setAdminForm({
        dateOfFilling: dateOfFilling,
        dateOfLastRepair: dateOfLastRepair,
        natureOfLastRepair: natureOfLastRepair,
      })

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
        const { before_repair_date, findings, recommendations, remarks, after_reapir_date, close } = item;
        const processedItem = {
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

      console.log(remarks);
    
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
  },[id]);

  //It will switch into form input on Part C
  const handlePartCEditClick = () => {
    setPartCIsEditing(true);
  };
  const handleDisableEdit = () => {
    setPartCIsEditing(false);
    setPartDIsEditing(false);
  };

  //Submit on Part C Form
  const SubmitPartC = (event) => {
    event.preventDefault();

    setIsLoading(true);

    axiosClient
    .post(`inspector/${id}`, {
      inspection__form_id: id,
      before_repair_date: beforeDate,
      findings: finding,
      recommendations: recommendation
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Done");    
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });

  };

  //It will switch into form input on Part D
  const handlePartDEditClick = () => {
    setPartDIsEditing(true);
  };

  // Submit on Part D Form
  const SubmitPartD = (event) => {
    event.preventDefault();

    setIsLoading(true);
    axiosClient
    .put(`inspectorpartb/${id}`, {
      after_reapir_date: afterDate,
      remarks: remarks
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Done");    
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });

  };

  const componentRef= useRef();

  //Generate PDF
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Control No:${id}`
  });
  
  return(
    <PageComponent title="Pre-Repair/Post Repair Inspection Form">
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
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
                <td className="border text-2xl w-3/5 border-black pl-10 font-arial">
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
                          <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                          <div className="mt-10">
                            <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                              <div>
                                <img
                                  src={displayRequest.userDetails.supervisor_signature}
                                  alt="User Signature"
                                  style={{ position: 'absolute', width: '100%', top: '-40px', left: '0px' }}
                                />
                                <span>{displayRequest.userDetails.supervisor}</span>
                              </div>
                            </div>
                            <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Immediate Supervisor</strong> </label>
                          </div>
                        </div>

                      </div>
                    </div>

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
                <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

                <div>

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
                    
                </div>

                </td>
              </tr>

              {/* Part C Label */}
              <tr>
                <td colSpan={3} className="border border-black p-1 font-arial">
                <h3 className="text-lg font-normal leading-6 text-gray-900">PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.</h3>
                </td>
              </tr>

              {/* Part C Forms */}
              <tr>
                <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">

                <div className="mt-16">
                      
                  {partCisEditing ? (
                    <form onSubmit={SubmitPartC}>

                      {/* Date Inspected */}
                      <div className="flex mt-10">
                        <div className="w-40">
                          <label htmlFor="date_insp" className="block text-base font-medium leading-6 text-gray-900">Date Inspected :</label> 
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
                          <label htmlFor="findings" className="block text-base font-medium leading-6 text-gray-900"> Finding/s :</label> 
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
                          <label htmlFor="recomendations" className="block text-base font-medium leading-6 text-gray-900"> Recomendation/s :</label> 
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

                      <div className="flex mt-10">
                        <button
                          type="submit"
                          className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <FontAwesomeIcon icon={faSpinner} spin />
                              <span className="ml-2">Processing</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                        </button>
                        <button 
                          onClick={handleDisableEdit}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                        > 
                          Cancel     
                        </button>
                      </div>
                    </form>
                  ):(
                  <div>
                  {getPartC && getPartC.length > 0 ? (
                    getPartC.map((item, index) => (

                      <div key={index}>

                        {/* Findings */}
                        <div className="mt-10">
                          <div className="flex">
                            <div className="w-44">
                              <strong>Findings</strong>
                            </div>
                            <div className="w-full border-b border-black pl-1">
                              <span>{item.findings}</span>
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
                              <span>{item.recommendations}</span>
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
                                <span>{formatDate(item.before_repair_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Inspector */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> <strong>NOTED:</strong> </label>
                            <div className="mt-10">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                <div>
                                {assignPersonnel.map((item, index) => (
                                  <div key={index} className="personnel-container">
                                    <img
                                      src={item.p_signature}
                                      alt="User Signature"
                                      style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                                    />
                                    <span>{item.p_name}</span>
                                  </div>
                                ))}
                                </div>
                              </div>
                              <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> <strong>Property Inspector</strong> </label>
                            </div>
                          </div>

                          </div>
                        </div>

                        
                      </div>
                    ))
                  ) : (
                    // If the data is null or empty
                    <div>

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
                          <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> DATE INSPECTED </label>
                          <div className="mt-16">
                            <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                              <span></span>
                            </div>
                          </div>
                        </div>

                        {/* Inspector */}
                        <div className="col-span-1">
                          <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> NOTED: </label>
                          <div className="mt-10">
                            <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                              <div>
                              {assignPersonnel.map((item, index) => (
                                <div key={index} className="personnel-container">
                                  <img
                                    src={item.p_signature}
                                    alt="User Signature"
                                    style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                                  />
                                  <span>{item.p_name}</span>
                                </div>
                              ))}
                              </div>
                            </div>
                            <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> Property Inspector </label>
                          </div>
                        </div>

                        </div>
                      </div>

                      {/* Button */}
                      <div className="mt-10">
                        <button 
                          onClick={handlePartCEditClick}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        > 
                          Fill up the Part C     
                        </button>
                      </div>

                    </div>
                  )}

                  </div>
                  )}
                
                </div>

                </td>
              </tr>

              {/* Part D Label */}
              <tr>
                <td colSpan={3} className="border border-black p-1 font-arial">
                <h3 className="text-lg font-normal leading-6 text-gray-900">PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.</h3>
                </td>
              </tr>

              {/* Part D Forms */}
              <tr>
                <td colSpan={3} className="border border-black pl-2 pr-2 pb-8 font-arial">
                  {getPartC.map((item, index) => (
                    <div key={index}>

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
                          <div className="flex mt-10">
                            <button
                              type="submit"
                              className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                              }`}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                  <span className="ml-2">Processing</span>
                                </div>
                              ) : (
                                'Submit'
                              )}
                            </button>
                            <button
                              onClick={handleDisableEdit}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ):(
                        <>
                        {item.remarks ? (
                        <>
                        {/* Remarks if has data */}
                        <div className="mt-10">
                          <div className="flex">
                            <div className="w-44">
                              <strong>Remark/s</strong>
                            </div>
                            <div className="w-full border-b border-black pl-1">
                              <span>{item.remarks}</span>
                            </div>
                          </div>
                        </div>
                        </>
                        ):( 
                        <>
                        {/* Remarks if has no data */}
                        <div className="mt-10">
                          <div className="flex">
                            <div className="w-44">
                              <strong>Remark/s</strong>
                            </div>
                            <div className="w-full border-b border-black pl-1">
                              <span>{item.remarks}</span>
                            </div>
                          </div>
                        </div>
                        </>
                        )}

                        {item.after_reapir_date ? (
                        <>
                        {/* Signature */}
                        <div className="mt-10">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                                DATE INSPECTED
                              </label>
                              <div className="mt-12">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <span>{formatDate(item.after_reapir_date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                                NOTED:
                              </label>
                              <div className="mt-10">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <div>
                                    {assignPersonnel.map((item, index) => (
                                      <div key={index} className="personnel-container">
                                        <img
                                          src={item.p_signature}
                                          alt="User Signature"
                                          style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                                        />
                                        <span>{item.p_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900">
                                  Property Inspector
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        </>
                        ):( 
                        <>
                        {/* Signature */}
                        <div className="mt-10">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                                DATE INSPECTED
                              </label>
                              <div className="mt-14">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <span></span>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900">
                                NOTED:
                              </label>
                              <div className="mt-10">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                  <div>
                                    {assignPersonnel.map((item, index) => (
                                      <div key={index} className="personnel-container">
                                        <img
                                          src={item.p_signature}
                                          alt="User Signature"
                                          style={{ position: 'absolute', width: '100%', top: '-42px', left: '0px' }}
                                        />
                                        <span>{item.p_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900">
                                  Property Inspector
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="mt-10">
                          <button
                            onClick={handlePartDEditClick}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Fill up Part D
                          </button>
                        </div>
                        </>
                        )}
                        </>
                      )}
                      
                    </div>
                  ))}
                </td>
              </tr>

            </table>
            </div>
            
            {/* For Generate PDF */}
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
                      <td className="border text-lg w-7/12 border-black pl-3 font-arial">
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

            {/* Button */}
            <div className="mt-4 flex">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link to="/">Back to Dashboard</Link>
              </button>
              {getPartC.map((item, index) => (
                <div key={index}>
                  {item.close === 0 ? null : (
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={generatePDF}>
                      Generate PDF
                    </button>
                  )}
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
                  onClick={() => {
                    window.location.reload();
                  }}
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