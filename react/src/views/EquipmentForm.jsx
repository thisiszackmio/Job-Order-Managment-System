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

  //Date Format 
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(timeString) {
    if (!timeString) {
        return '';  // or any default value you want to return for null or undefined
    }

    const [hours, minutes] = timeString.split(':');
    
    // Additional check for invalid time string or unexpected format
    if (hours === undefined || minutes === undefined) {
        return '';  // or handle the error appropriately
    }

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

  const {currentUser} = useUserStateContext();
  const {id} = useParams();

  //Set Variables
  const [isLoading, setIsLoading] = useState(true);
  const [getEquipment, setEquipment] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [sumbitLoading, setSubmitLoading] = useState(false);

  const [getIntruction, setInstruction] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [getOperator, setOperator] = useState('');

  //Get all the data from equipment
  const fetchEquipmentForm = () => {
    axiosClient
    .get(`/equipmentform/${id}`)
    .then((response) => {
      const responseData = response.data;
      const EquipmentData = responseData.equipment_form;
      const UserName = responseData.userName;
      const UserSig = responseData.userSig;
      const SupName = responseData.supervisorName;
      const SupSig = responseData.supervisorSig;
      const ManName = responseData.adminName;
      const ManSig = responseData.adminSig;
      const GSOName = responseData.gsoName;
      const GSOSig = responseData.gsoSig;
      const GSOPost = responseData.gsoPost;

      setEquipment({
        EquipmentData:EquipmentData,
        UserName:UserName,
        UserSig:UserSig,
        SupName:SupName,
        SupSig:SupSig,
        ManName:ManName,
        ManSig:ManSig,
        GSOName:GSOName,
        GSOSig:GSOSig,
        GSOPost:GSOPost
      });

      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    });
  }

  //Get the driver details
  const fetchDriver = () => {
    axiosClient.get('/getdriver')
    .then(response => {
      const driversData = response.data;
      setDriverList(driversData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchEquipmentForm();
    fetchDriver();
  },[id]);

  //Choose a driver name
  const handleDriverName = (event) => {
    setSelectedDriver(event.target.value);
  };

  //Manager's Approval
  function handleApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/equipmentsupap/${id}`)
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

  //Manager's Dispproval
  function handleDispproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/equipmentsupdp/${id}`)
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

  //Admin Manager Approval
  function handleManagerApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/equipmentmanap/${id}`)
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

  //Admin Manager Dispproval
  function handleManagerDispproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/equipmentmandp/${id}`)
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

  //Submit the Instruction form on Firstruck and Manlift
  const SubmitInstructionForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`equipmentmanins/${id}`, {
      instructions: getIntruction,
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

  //Submit a Form on the Part B
  const GSOFormSubmit = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`equipmentgsoform/${id}`, {
      driver: selectedDriver,
      operator: getOperator
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

  //Close the request
  function handleCloseRequest(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to close the request?');

    if(confirmed) {
      axiosClient.put(`/equipmentgclose/${id}`)
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

  //Close Popup Function
  const closePopup = () => {
    fetchEquipmentForm();
    setShowPopup(false);
    setIsLoading(true);
  };

  //Generate PDF
  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Inspection-Control-No:${id}`
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
  <PageComponent title="Request For Equipment">
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
  <>
  {/* --- Display Preview --- */}
  <div>
  
    {/* --- Control Number --- */}
    <div className="font-arial text-right mr-36">
    {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (
      <span>Annex B</span>
    ):getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ?(
      <span>Annex A</span>
    ):getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(
      <span>Annex B</span>
    ):null}
      
    </div>
    {/* --- End of Control Number --- */}

    {/* Title and Logo */}
    <table className="w-full border-collapse border border-black mt-4">
      <tr>
        <td className="border border-black w-60 p-1 text-center">
          <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '120px' }} />
        </td>
        <td className="border text-2xl w-3/5 border-black font-arial text-center">
          {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (
            <b>REQUEST FOR THE USE OF FIRETRUCK</b>
          ):getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ?(
            <b>REQUEST FOR THE USE OF MANLIFT</b>
          ):getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(
            <b>REQUEST FOR THE USE OF RESCUE BOAT</b>
          ):null}
        </td>
        <td className="border border-black p-0 w-80 font-arial ppa-center">
          <div className="border-b border-black px-3 py-5 h-16" style={{ fontWeight: 'bold' }}>
            {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (<span>FT FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>)
            :getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ? (<span>ML FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>)
            :getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(<span>RB FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>):null}
          </div>
          <div className="border-black px-3 py-5 h-16" style={{ fontWeight: 'bold' }}>DATE: {formatDate(getEquipment?.EquipmentData?.date_request)}</div>
        </td>
      </tr>
    </table>
    {/* --- End of Title and Logo --- */}

    {/* --- Main Form --- */}
    <table className="w-full border-collapse border border-black mt-3">
      <tr>
        <td className="text-base w-full border-black font-arial text-left p-2">
          
          <div className="w-full">

            {/* Title/Purpose of Activity */}
            <div>
              <div className="flex">
                <div className="w-72">
                  <strong>Title/Purpose of Activity:</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                  <span>{getEquipment?.EquipmentData?.title_of_activity}</span>
                </div>
              </div>
            </div>

            {/* Date of Activity */}
            <div className="mt-2">
              <div className="flex">
                <div className="w-72">
                  <strong>Date of Activity:</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                  <span>{formatDate(getEquipment?.EquipmentData?.date_of_activity)}</span>
                </div>
              </div>
            </div>

            {/* Time of Activity */}
            <div className="mt-2">
              <div className="flex">
                <div className="w-72">
                  <strong>Time of Activity (START AND END):</strong>
                </div>
                <div className="w-96 border-b border-black pl-1">
                  <span>{formatTime(getEquipment?.EquipmentData?.time_start)} - {formatTime(getEquipment?.EquipmentData?.time_end)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-4">

              {/* For Requestor Signature */}
              <div className="col-span-1">
                <label htmlFor="type_of_property" className="block font-medium leading-6"> <strong>REQUESTED BY:</strong> </label>
                <div className="mt-10">
                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    <div>
                      <img src={getEquipment?.UserSig} alt="User Signature" style={{ position: 'absolute', width: '100%', top: '-55px', left: '0px' }} />
                    </div>
                    <span className="text-xl">{getEquipment?.UserName}</span>
                  </div>
                  <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>Signature above printed name</strong> </label>
                </div>
              </div>

              {/* For Supervisor Signature */}
              <div className="col-span-1"> 
                <label htmlFor="type_of_property" className="block font-medium leading-6"> 
                  <strong>Recommending Approval: {getEquipment?.EquipmentData?.division_manager_approval == 2 ? ("Disapproved"):null} </strong>
                </label>
                <div className="mt-10">
                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    <div>
                      {getEquipment?.EquipmentData?.division_manager_approval != 0 ? (
                        <img
                          src={getEquipment?.SupSig}
                          alt="User Signature"
                          style={{ position: 'absolute', width: '100%', top: '-55px', left: '0px' }}
                        />
                      ): null }
                        
                      <span className="text-xl">{getEquipment?.SupName}</span>
                    </div>
                  </div>
                  <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>Division Manager Concerned</strong> </label>
                </div>
              </div>

              </div>
            </div>

          </div>

        </td>
      </tr>
    </table>
    {/* --- Main Form --- */}

    {/* Action A */}
    <table className="w-full border-collapse border border-black mt-3">
    <tr>
      <td className="text-base w-full border-black font-arial text-left p-2 pr-10">

        <div>
          <h2 className="text-base font-bold leading-7"> A. ACTION TAKEN: </h2>
        </div>

        {/* For Fire Truck and Manlift */}
        {getEquipment?.EquipmentData?.type_of_equipment != 'Rescue Boat' ? (
        <>
        {currentUser.code_clearance == 1 && 
        getEquipment?.EquipmentData?.admin_manager_approval == 0 ? (
          <div className="grid grid-cols-2 gap-4">

            {/* For Admin Manger column */}
            <div className="col-span-1 ml-10 mt-4">
              <label htmlFor="type_of_property" className="block font-medium leading-6"> 
                <strong>Approved/Disapproved by:</strong>
              </label>
              <div className="mt-10">
                <div className="w-1/2 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                  <div>
                    {getEquipment?.EquipmentData?.admin_manager_approval != 0 ? (
                      <img
                        src={getEquipment?.ManSig}
                        alt="User Signature"
                        style={{ position: 'absolute', width: '100%', top: '-55px', left: '0px' }}
                      />
                    ): null }
                    <span className="text-xl">{getEquipment?.ManName}</span>
                  </div>
                </div>
                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>Division Manager Concerned</strong> </label>
              </div>
            </div>
            
            {/* For Instructions */}
            <div className="col-span-1">
            {getEquipment?.EquipmentData?.instructions ? (
              <div className="items-center mt-4">
                <label htmlFor="type_of_property" className="block font-medium leading-6"> 
                  <strong>Instructions:</strong>
                </label>
                <div className="w-full mt-8 underline-text">
                {getEquipment?.EquipmentData?.instructions}
                </div>
              </div> 
            ):(
              <form onSubmit={SubmitInstructionForm}>
            
                <div className="items-center mt-4">
                  <label htmlFor="type_of_property" className="block font-medium leading-6"> 
                    <strong>Instructions:</strong>
                  </label>
                  <div className="w-3/4">
                  <textarea
                    id="complain"
                    name="complain"
                    rows={3}
                    value={getIntruction}
                    onChange={ev => setInstruction(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                  <p className="text-red-500 text-xs italic">If you have no instructions please submit the form in empty</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-2">
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                    sumbitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                  disabled={sumbitLoading}
                >
                  {sumbitLoading ? (
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
            )}
            </div>

          </div>
        ):(
        <>
        <div className="grid grid-cols-2 gap-4">

          {/* For Admin Manger column */}
          <div className="col-span-1 ml-10 mt-4">
            <label htmlFor="type_of_property" className="block font-medium leading-6"> 
              <strong>Approved/Disapproved by:</strong>
            </label>
            <div className="mt-10">
              <div className="w-1/2 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                <div>
                  {getEquipment?.EquipmentData?.admin_manager_approval != 0 ? (
                    <img
                      src={getEquipment?.ManSig}
                      alt="User Signature"
                      style={{ position: 'absolute', width: '100%', top: '-55px', left: '0px' }}
                    />
                  ): null }
                  <span className="text-xl">{getEquipment?.ManName}</span>
                </div>
              </div>
              <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>Division Manager Concerned</strong> </label>
            </div>
          </div>
          
          {/* For Instruction column */}
          <div className="col-span-1">
            <div className="items-center mt-4">
              <label htmlFor="type_of_property" className="block font-medium leading-6"> 
                <strong>Instructions:</strong>
              </label>
              {getEquipment?.EquipmentData?.instructions ? (
                <div className="w-full mt-8 underline-text">
                  {getEquipment?.EquipmentData?.instructions}
                </div>
              ):(
                <div className="w-full mt-10 border-b border-black"></div>
              )} 
            </div>
          </div>

        </div>
        </>
        )}
        </>
        ):("Ako ni")}

      </td>
    </tr>
    </table>
    {/* --- End of Action A --- */}

    {/* Action B (For Firetruck and Manlift) */}
    <table className="w-full border-collapse border border-black mt-3">
    {/* For Fire Truck and Manlift */}
    {getEquipment?.EquipmentData?.type_of_equipment != 'Rescue Boat' ? (
    <>
    <tr>
      <td className="text-base w-full border-black font-arial text-left p-2 pr-10">
        <div>
          <h2 className="text-base font-bold leading-7"> B. DETAILS OF ACTION TAKEN: </h2>
        </div>
        {getEquipment?.EquipmentData?.driver && getEquipment?.EquipmentData?.operator ? (
        <>

          {/* Driver */}
          <div className="mt-4 ml-10">
            <div className="flex">
              <div className="w-24">
                <strong>Driver:</strong>
              </div>
              <div className="w-96 border-b border-black pl-1">
                <span>{getEquipment?.EquipmentData?.driver}</span>
              </div>
            </div>
          </div>

          {/* Operator */}
          <div className="mt-2 ml-10">
            <div className="flex">
              <div className="w-24">
                <strong>Operator:</strong>
              </div>
              <div className="w-96 border-b border-black pl-1">
                <span>{getEquipment?.EquipmentData?.operator}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-20 ml-10">
            <div className="flex">
              <div className="w-24"></div>
              <div className="w-96 pl-1 text-center relative">
                <img
                    src={getEquipment?.GSOSig}
                    alt="User Signature"
                    style={{ position: 'absolute', top: '-80px', left: '50px' }}
                  />
                <div className="border-b border-black">
                </div>
                <span className="text-xl">{getEquipment?.GSOName}</span>
                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>{getEquipment?.GSOPost}</strong> </label>
              </div>
              
            </div>
          </div>

        </>
        ):(
        <>
        {currentUser.id == 4 ? (
        <form onSubmit={GSOFormSubmit}>

          {/* Driver */}
          <div className="flex items-center mt-4 ml-10">
            <div className="w-40">
              <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                <strong>Driver:</strong>
              </label> 
            </div>
            <div className="w-1/2">
              <select
                name="plate_number"
                id="plate_number"
                autoComplete="request-name"
                value={selectedDriver}
                onChange={handleDriverName}
                className="block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a Driver</option>
                {driverList.map(driver => (
                  <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Operator */}
          <div className="flex mt-2 ml-10">
            <div className="w-40">
              <label htmlFor="vr_passengers" className="block text-base font-medium leading-6 text-gray-900">
                <strong>Operator:</strong>
              </label>
            </div>
            <div className="w-1/2">
              <textarea
                id="vr_passengers"
                name="vr_passengers"
                rows={2}
                value={getOperator}
                onChange={ev => setOperator(ev.target.value)}
                style={{ resize: 'none' }}
                className="block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-2 ml-10">
          {selectedDriver && getOperator && (
            <button
              type="submit"
              className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                sumbitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
              disabled={sumbitLoading}
            >
              {sumbitLoading ? (
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

        </form>
        ):(
        <>
          {/* Driver */}
          <div className="mt-4 ml-10">
            <div className="flex">
              <div className="w-24">
                <strong>Driver:</strong>
              </div>
              <div className="w-96 border-b border-black pl-1">
                <span></span>
              </div>
            </div>
          </div>

          {/* Operator */}
          <div className="mt-2 ml-10">
            <div className="flex">
              <div className="w-24">
                <strong>Operator:</strong>
              </div>
              <div className="w-96 border-b border-black pl-1">
                <span></span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-20 ml-10">
            <div className="flex">
              <div className="w-24"></div>
              <div className="w-96 pl-1 text-center relative">
                <div className="border-b border-black">
                </div>
                <span className="text-xl">{getEquipment?.GSOName}</span>
                <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6"> <strong>{getEquipment?.GSOPost}</strong> </label>
              </div>
              
            </div>
          </div>
        </>
        )}
        </> 
        )}
        

      </td>
    </tr>
    </>
    ):null}
    </table>

    {/* --- Button Section --- */}
    <div className="flex mt-2">
    
    {/* Default Buttons */}
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <Link to="/">Back to Dashboard</Link>
    </button>
    
    {/* Generate pdf button */}
    {getEquipment?.EquipmentData?.status == 1 ? (
    <button
      type="button"
      onClick={handleButtonClick}
      className={`rounded-md px-3 py-2 ml-2 font-bold text-white shadow-sm focus:outline-none ${
        sumbitLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
      }`}
      disabled={sumbitLoading}
    >
      {sumbitLoading ? (
        <div className="flex items-center justify-center">
          <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
          <span className="ml-2">Generating</span>
        </div>
      ) : (
        'Generate PDF'
      )}
    </button>
    ):null}
    

    {/* For Division Managers */}
    {currentUser.code_clearance === 2 || 
    currentUser.code_clearance === 4 ||
    currentUser.code_clearance === 1 || 
    getEquipment?.EquipmentData?.division_manager_id === currentUser.id ? (
      getEquipment?.EquipmentData?.division_manager_approval === 0 ? (
        <div className="ml-2">
          <button
              onClick={() => handleApproveClick(getEquipment?.EquipmentData?.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
              title="DM Approve"
            >
              Approve
          </button>
          <button
            onClick={() => handleDispproveClick(getEquipment?.EquipmentData?.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
            title="DM Disapprove"
          >
            Disapprove
          </button>
        </div> 
      ) : null
    ) : null}

    {/* For Maam Daisy */}
    {currentUser.code_clearance == 1 && 
    getEquipment?.EquipmentData?.admin_manager_approval == 0 ? (
    <>
    {getEquipment?.EquipmentData?.instructions ? (
    <div className="ml-2">
      <button
        onClick={() => handleManagerApproveClick(getEquipment?.EquipmentData?.id)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
        title="Approve"
      >
        Approve
      </button>
      <button
        onClick={() => handleManagerDispproveClick(getEquipment?.EquipmentData?.id)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
        title="Disapprove"
      >
        Disapprove
      </button>
    </div>
    ):null} 
    </>
    ):null}

    {/* Close Request */}
    {getEquipment?.EquipmentData?.status == 2 ? (
      <button 
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" 
      onClick={() => handleCloseRequest(getEquipment?.EquipmentData?.id)}
      >
        Close Request
      </button>
    ):null}
    

    </div>
    {/* --- End of Button Section --- */}

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

  </div> 
  {/* --- End of Display Preview --- */}

  {/* --- Generate PDF --- */}
  {/* {isVisible && ()} */}
  <div>
  <div className="hidden md:none">
    <div ref={componentRef}>
      <div style={{ width: '216mm', height: '330mm', paddingLeft: '60px', paddingRight: '60px', paddingTop: '10px', border: '0px solid' }}>
       
        {/* --- Control Number --- */}
        <div className="font-arial text-xs text-right mr-20 mt-2">
        {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (
          <span>Annex B</span>
        ):getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ?(
          <span>Annex A</span>
        ):getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(
          <span>Annex B</span>
        ):null}
        </div>
        {/* --- End of Control Number --- */}

        {/* Title and Logo */}
        <table className="w-full border-collapse border border-black">
          <tr>
            <td className="border border-black w-56 p-0 text-center">
              <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '70px' }} />
            </td>
            <td className="border text-xl w-1/2 border-black font-arial text-center">
              {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (
                <b>REQUEST FOR THE USE OF FIRETRUCK</b>
              ):getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ?(
                <b>REQUEST FOR THE USE OF MANLIFT</b>
              ):getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(
                <b>REQUEST FOR THE USE OF RESCUE BOAT</b>
              ):null}
            </td>
            <td className="border border-black p-0 w-80 font-arial ppa-center relative" style={{ fontSize: '12px' }}>
              <div className="border-b border-black px-2 py-0 h-0 table-ppa" style={{ fontWeight: 'bold' }}>
                {getEquipment?.EquipmentData?.type_of_equipment == 'Firetruck' ? (<span>FT FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>)
                :getEquipment?.EquipmentData?.type_of_equipment == 'Manlift' ? (<span>ML FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>)
                :getEquipment?.EquipmentData?.type_of_equipment == 'Rescue Boat' ?(<span>RB FORM VER. 01 / Form No: {getEquipment?.EquipmentData?.id}</span>):null}
              </div>
              <div className="border-black px-2 py-0 h-0 table-ppa-2" style={{ fontWeight: 'bold' }}>DATE: {formatDate(getEquipment?.EquipmentData?.date_request)}</div>
            </td>
          </tr>
        </table>
        {/* --- End of Title and Logo --- */}

        {/* --- Main Form --- */}
        <table className="w-full border-collapse border border-black mt-2">
          <tr>
            <td className="text-base w-full border-black font-arial text-left p-1">
              
              <div className="w-full">

                {/* Title/Purpose of Activity */}
                <div>
                  <div className="flex">
                    <div className="w-64 text-sm">
                      <span>Title/Purpose of Activity:</span>
                    </div>
                    <div className="w-96 border-b border-black text-sm pl-1">
                      <span>{getEquipment?.EquipmentData?.title_of_activity}</span>
                    </div>
                  </div>
                </div>

                {/* Date of Activity */}
                <div>
                  <div className="flex">
                    <div className="w-64 text-sm">
                      <span>Date of Activity:</span>
                    </div>
                    <div className="w-96 border-b border-black pl-1 text-sm">
                      <span>{formatDate(getEquipment?.EquipmentData?.date_of_activity)}</span>
                    </div>
                  </div>
                </div>

                {/* Time of Activity */}
                <div>
                  <div className="flex">
                    <div className="w-64 text-sm">
                      <span>Time of Activity (START AND END):</span>
                    </div>
                    <div className="w-96 border-b border-black text-sm pl-1">
                      <span>{formatTime(getEquipment?.EquipmentData?.time_start)} - {formatTime(getEquipment?.EquipmentData?.time_end)}</span>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-4">

                  {/* For Requestor Signature */}
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm leading-6"> <span>Requested by:</span> </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                          <img src={getEquipment?.UserSig} alt="User Signature" style={{ position: 'absolute', width: '200px', top: '-42px', left: '30px' }} />
                        </div>
                        <span className="text-sm uppercase font-bold">{getEquipment?.UserName}</span>
                      </div>
                      <label htmlFor="type_of_property" className="block text-xs text-center"> <strong>Signature above printed name</strong> </label>
                    </div>
                  </div>

                  {/* For Supervisor Signature */}
                  <div className="col-span-1"> 
                    <label htmlFor="type_of_property" className="block text-sm leading-6"> 
                      <span>Recommending Approval: {getEquipment?.EquipmentData?.division_manager_approval == 2 ? ("Disapproved"):null} </span>
                    </label>
                    <div className="mt-2">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                          {getEquipment?.EquipmentData?.division_manager_approval != 0 ? (
                            <img
                              src={getEquipment?.SupSig}
                              alt="User Signature"
                              style={{ position: 'absolute', width: '200px', top: '-42px', left: '30px' }}
                            />
                          ): null }
                            
                          <span className="text-sm uppercase font-bold">{getEquipment?.SupName}</span>
                        </div>
                      </div>
                      <label htmlFor="type_of_property" className="block text-xs text-center"> <strong>Division Manager Concerned</strong> </label>
                    </div>
                  </div>

                  </div>
                </div>

              </div>

            </td>
          </tr>
        </table>
        {/* --- End of Main Form --- */}

        {/* Action A */}
        <table className="w-full border-collapse border border-black mt-2">
        <tr>
          <td className=" w-full border-black font-arial text-left p-1 pr-10 pb-3">

            <div>
              <h2 className="text-sm leading-7">
              {getEquipment?.EquipmentData?.type_of_equipment != 'Rescue Boat' ? ("A. ACTION TAKEN"):("ACTION TAKEN")}
              </h2>
            </div>

            {/* For Fire Truck and Manlift */}
            {getEquipment?.EquipmentData?.type_of_equipment != 'Rescue Boat' ? (
            <>
            <div className="grid grid-cols-2 gap-12">

              {/* For Admin Manger column */}
              <div className="col-span-1 ml-6 mt-2">
                <label htmlFor="type_of_property" className="block text-sm leading-6"> 
                  <span>{getEquipment?.EquipmentData?.admin_manager_approval == 1 ? ("Approved by:")
                  :getEquipment?.EquipmentData?.admin_manager_approval == 2 ? ("Disapproved by:"):("Approved/Disapproved by:")}</span>
                </label>
                <div className="mt-4">
                  <div className="w-full mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    <div>
                      {getEquipment?.EquipmentData?.admin_manager_approval != 0 ? (
                        <img
                          src={getEquipment?.ManSig}
                          alt="User Signature"
                          style={{ position: 'absolute', width: '200px', top: '-42px', left: '40px' }}
                        />
                      ):null}  
                      <span className="text-sm uppercase font-bold">{getEquipment?.ManName}</span>
                    </div>
                  </div>
                  <label htmlFor="type_of_property" className="block text-xs text-center"> <strong>Manager, Admininstrative Division</strong> </label>
                </div>
              </div>
              
              {/* Instructions column */}
              <div className="col-span-1">

                <div className="items-center mt-2">
                  <label htmlFor="type_of_property" className="block text-sm leading-6"> 
                    <span>Instructions:</span>
                  </label>
                  <div className="w-full mt-2 text-sm underline-text">
                  {getEquipment?.EquipmentData?.instructions}
                  </div>
                </div>
                 
              </div>

            </div>
            </>
            ):("Ako ni")}

          </td>
        </tr>
        </table>
        {/* --- End of Action A --- */}

        {/* Action B (For Firetruck and Manlift) */}
        <table className="w-full border-collapse border border-black mt-2">
        {/* For Fire Truck and Manlift */}
        {getEquipment?.EquipmentData?.type_of_equipment != 'Rescue Boat' ? (
        <>
        <tr>
          <td className="w-full border-black font-arial text-left p-1 pr-10">
            <div>
              <h2 className="text-sm leading-7"> B. DETAILS OF ACTION TAKEN: </h2>
            </div>

              {/* Driver */}
              <div className="ml-6 mt-4">
                <div className="flex">
                  <div className="w-24 text-sm">
                    <span>Driver:</span>
                  </div>
                  <div className="w-96 border-b text-sm border-black pl-1">
                    <span>{getEquipment?.EquipmentData?.driver}</span>
                  </div>
                </div>
              </div>

              {/* Operator */}
              <div className="ml-6 mt-2">
                <div className="flex">
                  <div className="w-24 text-sm">
                    <span>Operator:</span>
                  </div>
                  <div className="w-96 border-b border-black text-sm pl-1">
                    <span>{getEquipment?.EquipmentData?.operator}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-14 ml-10">
                <div className="flex">
                  <div className="w-24"></div>
                  <div className="w-96 pl-1 text-center relative">
                    <img
                        src={getEquipment?.GSOSig}
                        alt="User Signature"
                        style={{ position: 'absolute', width: '200px', top: '-55px', left: '92px' }}
                      />
                    <div className="border-b border-black">
                    </div>
                    <span className="text-sm uppercase font-bold">{getEquipment?.GSOName}</span>
                    <label htmlFor="type_of_property" className="block text-base text-center"> <span>{getEquipment?.GSOPost}</span> </label>
                  </div>
                  
                </div>
              </div>

          </td>
        </tr>
        </>
        ):null}
        </table>
        {/* --- End of Action B (For Firetruck and Manlift) --- */}

      </div>
    </div>
  </div>
  </div>
  {/* --- End of Generate PDF --- */}

  </>  
  )}
     
    
  </PageComponent>
  );
}