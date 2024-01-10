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

  const {id} = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [vehicleForms, setvehicleForm] = useState({});
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [sumbitLoading, setSubmitLoading] = useState(false);

  //Show data
  const fetchVehicleForm = () => {

    axiosClient
    .get(`/vehicleform/${id}`)
    .then((response) => {
      const responseData = response.data;
      const vehicleForm = responseData.vehicle_form;
      const requestor = responseData.requestor;
      const manager = responseData.manager_user_details;

      setvehicleForm({
        vehicleForm,
        requestor,
        manager
      });

      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchVehicleForm();
  },[id]);

  function handleApproveClick(id){
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/vehicleformapprove/${id}`)
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

  function handleDispproveClick(id){
    const confirmed = window.confirm('Do you want to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/vehicleformdisapprove/${id}`)
      .then((response) => {
        setPopupMessage('You disapprove the request');
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

  const closePopup = () => {
    fetchVehicleForm();
    setShowPopup(false);
    setIsLoading(true);
  };

  //Generate PDF
  const componentRef= useRef();

  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Vehicle-Slip-No:${id}`
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
    <PageComponent title="Request For Vehicle Slip">

    {/* Display View */}
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
    <div className="px-64">   
      
      <div className="px-4 border border-black">

        {/* Header */}
        <table className="w-full mt-4 mb-10">
          {/* Code */}
          <tr>
            <td colSpan={2} className="w-1/3 text-left text-base font-arial">
              <span>Doc. Ref. Code:PM:VEC:LNI:WEN:FM:01</span>
            </td>
            <td className="w-1/3 text-right text-base font-arial">
              <span>"Annex D"</span>
            </td>
          </tr>

          {/* Agency Name */}
          <tr>
            <td colSpan={3} className="text-center text-base font-arial pt-10">
              <p>Republic of the Philippines</p>
              <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
              <p>PMO-<u>Lanao Del Norte/Iligan</u></p>
            </td>
          </tr>

          {/* Date */}
          <tr>
            <td className="w-1/3"></td>
            <td className="w-1/3"></td>
            <td className="w-1/3 pt-12">
              <p className="border-b border-black text-base text-center font-arial">{formatDate(vehicleForms?.vehicleForm?.date_of_request)}</p>
              <p className="text-base text-center font-arial">Date</p>
            </td>
          </tr>

          {/* Main Content */}
          <tr>
            <td colSpan={3}>

              <div className="font-arial font-bold text-center pt-10">
                <span>VEHICLE REQUEST SLIP</span>
              </div>

              <div className="font-arial text-base text-left pt-8">
                <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
              </div>

              {/* Passenger */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44 font-arial">
                    <span>PASSENGERS/s:</span>
                  </div>
                  <div className="w-full">
                    <div style={{ columnCount: 2 }}>
                      {vehicleForms?.vehicleForm?.passengers?.split('\n')?.map((passenger, index) => (
                        <span key={index} style={{ borderBottom: '1px solid black', display: 'block', padding: '2px' }}>
                          {`${index + 1}. ${passenger}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="mt-3">
                <div className="flex">
                  <div className="w-44 font-arial">
                    <span>PURPOSE:</span>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{vehicleForms?.vehicleForm?.purpose}</span>
                  </div>
                </div>
              </div>

              {/* Place */}
              <div className="mt-3">
                <div className="flex">
                  <div className="w-72 font-arial">
                    <span>PLACE/s TO BE VISITED:</span>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{vehicleForms?.vehicleForm?.place_visited}</span>
                  </div>
                </div>
              </div>

              {/* Date Time */}
              <div className="mt-3">
                <div className="flex">
                  <div className="w-72 font-arial">
                    <span>DATE/TIME OF ARRIVAL:</span>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{formatDate(vehicleForms?.vehicleForm?.date_arrival)} @ {formatTime(vehicleForms?.vehicleForm?.time_arrival)}</span>
                  </div>
                </div>
              </div>

            </td>
          </tr>
          
          {/* Driver Information */}
          <tr>
            <td className="w-1/3 pt-10">
              <p className="border-b border-black text-base text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[0]}</p>
              <p className="text-base text-center font-arial">Type of Vehicle</p>
            </td>
            <td className="w-1/3 pt-10 px-8">
              <p className="border-b border-black text-base text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[1]}</p>
              <p className="text-base text-center font-arial">Plate No.</p>
            </td>
            <td className="w-1/3 pt-10">
              <p className="border-b border-black text-base text-center font-arial">{vehicleForms?.vehicleForm?.driver}</p>
              <p className="text-base text-center font-arial">Driver</p>
            </td>
          </tr>

          {/* Requestor */}
          <tr>
            <td colSpan={2} className="w-1/3 pt-10">
              <div className="w-3/4 text-base font-arial font-bold">
                Requested by:
              </div>
              <div className="relative pt-6">
                <img
                  src={vehicleForms?.requestor?.signature}
                  style={{ position: 'absolute', width: '230px', top: '0px', left: '50px' }}
                  alt="Signature"
                />
              </div>
              <div className=" w-3/4 text-center font-bold border-b border-black text-base relative mt-5">
                  {vehicleForms?.requestor?.name}
              </div>   
              <div className="w-3/4 text-center text-base relative">
                  {vehicleForms?.requestor?.position}
              </div>   
            </td>
          </tr>

          {/* Admin Manager */}
          <tr>
            <td colSpan={2} className="pt-10">
              <div className="w-3/4 text-base font-arial font-bold">
                {vehicleForms?.vehicleForm?.admin_approval == 1 ? ("Approved:"):
                vehicleForms?.vehicleForm?.admin_approval == 2 ? ("Disapproved:"):"Approved:"}
              </div>
              <div className="relative pt-6">
              {vehicleForms?.vehicleForm?.admin_approval == 1 || vehicleForms?.vehicleForm?.admin_approval == 2 ? (
                <img
                  src={vehicleForms?.manager?.manager_signature}
                  style={{ position: 'absolute', width: '230px', top: '0px', left: '50px' }}
                  alt="Signature"
                />
              ):null
              }
                
              </div>
              <div className="w-3/4 text-center font-bold border-b border-black text-base relative mt-5">
                {vehicleForms?.manager?.manager_name}
              </div> 
              <div className="w-3/4 text-center text-base relative">
                Adminstrative Division Manager
              </div>  
            </td>
          </tr>
          
        </table>

      </div>

      {/* Button */}
      <div className="mt-4 flex">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link to="/">Back to Dashboard</Link>
        </button>
        {vehicleForms?.vehicleForm?.admin_approval === 1 && 
        currentUser.code_clearance == 6 || currentUser.code_clearance == 3
        ? (
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
        ) : vehicleForms?.vehicleForm?.admin_approval === 2 ? null : (
          currentUser.code_clearance === 1 && vehicleForms?.vehicleForm?.admin_approval === 3 && (
            <div className="flex ml-2">
              <button
                onClick={() => handleApproveClick(vehicleForms?.vehicleForm?.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                title="Approve"
              >
                Approve
              </button>
              <button
                onClick={() => handleDispproveClick(vehicleForms?.vehicleForm?.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
                title="Disapprove"
              >
                Disapprove
              </button>
            </div>
          )
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
    )}

    {/* Generate PDF */}
    {isVisible && (
    <div>
      <div className="hidden md:none">
        <div ref={componentRef}>
          <div style={{ width: '145mm', height: 'auto', paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', border: '1px dotted' }}>
            
          <table className="w-full mt-4 mb-10">

            {/* Header */}
            <tr>
              <td colSpan={2} className="w-1/3 text-left text-sm font-arial">
                <span>Doc. Ref. Code:PM:VEC:LNI:WEN:FM:01</span>
              </td>
              <td className="w-1/3 text-right text-sm font-arial">
                <span>"Annex D"</span>
              </td>
            </tr>

            {/* Agency Name */}
            <tr>
              <td colSpan={3} className="text-center text-sm font-arial pt-6">
                <p>Republic of the Philippines</p>
                <p><b>PHILIPPINE PORTS AUTHORITY</b></p>
                <p>PMO-<u>Lanao Del Norte/Iligan</u></p>
              </td>
            </tr>

            {/* Date */}
            <tr>
              <td className="w-1/3"></td>
              <td className="w-1/3"></td>
              <td className="w-1/3 pt-8">
                <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleForms?.vehicleForm?.date_of_request)}</p>
                <p className="text-sm text-center font-arial">Date</p>
              </td>
            </tr>

            {/* Main Content */}
            <tr>
              <td colSpan={3}>

                <div className="font-arial font-bold text-center pt-4 text-sm">
                  <span>VEHICLE REQUEST SLIP</span>
                </div>

                <div className="font-arial text-left pt-4 text-sm">
                  <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                </div>

                {/* Passenger */}
                <div className="mt-4">
                  <div className="flex">
                    <div className="w-44 font-arial text-sm">
                      <span>PASSENGERS/s:</span>
                    </div>
                    <div className="w-full">
                      <div style={{ columnCount: 2 }}>
                        {vehicleForms?.vehicleForm?.passengers?.split('\n')?.map((passenger, index) => (
                          <span key={index} className="text-xs" style={{ borderBottom: '1px solid black', display: 'block', padding: '2px' }}>
                            {`${index + 1}. ${passenger}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-44 font-arial text-sm">
                      <span>PURPOSE:</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-xs">
                      <span>{vehicleForms?.vehicleForm?.purpose}</span>
                    </div>
                  </div>
                </div>

                {/* Place */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-72 font-arial text-sm">
                      <span>PLACE/s TO BE VISITED:</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-xs">
                      <span>{vehicleForms?.vehicleForm?.place_visited}</span>
                    </div>
                  </div>
                </div>

                {/* Date Time */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-72 font-arial text-sm">
                      <span>DATE/TIME OF ARRIVAL:</span>
                    </div>
                    <div className="w-full border-b border-black pl-1 text-xs">
                      <span>{formatDate(vehicleForms?.vehicleForm?.date_arrival)} @ {formatTime(vehicleForms?.vehicleForm?.time_arrival)}</span>
                    </div>
                  </div>
                </div>

              </td>
            </tr>

            {/* Driver Information */}
            <tr>
              <td className="w-1/3 pt-7">
                <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[0]}</p>
                <p className="text-sm text-center font-arial">Type of Vehicle</p>
              </td>
              <td className="w-1/3 pt-7 px-8">
                <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[1]}</p>
                <p className="text-sm text-center font-arial">Plate No.</p>
              </td>
              <td className="w-1/3 pt-7">
                <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.driver}</p>
                <p className="text-sm text-center font-arial">Driver</p>
              </td>
            </tr>

            {/* Requestor */}
            <tr>
              <td colSpan={2} className="w-1/3 pt-8">
                <div className="w-3/4 text-sm font-arial font-bold">
                  REQUESTED BY:
                </div>
                <div className="relative pt-3">
                  <img
                    src={vehicleForms?.requestor?.signature}
                    style={{ position: 'absolute', width: '220px', top: '-10px', left: '10px' }}
                    alt="Signature"
                  />
                </div>
                <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
                    {vehicleForms?.requestor?.name}
                </div>   
                <div className="w-3/4 text-center text-sm relative">
                    {vehicleForms?.requestor?.position}
                </div>   
              </td>
            </tr>

            {/* Admin Manager */}
            <tr>
              <td colSpan={2} className="pt-4">
                <div className="w-3/4 text-sm font-arial font-bold">
                  {vehicleForms?.vehicleForm?.admin_approval == 1 ? ("APPROVED:"):
                  vehicleForms?.vehicleForm?.admin_approval == 2 ? ("DISAPPROVED:"):"APPROVED:"}
                </div>
                <div className="relative pt-3">
                {vehicleForms?.vehicleForm?.admin_approval == 1 || vehicleForms?.vehicleForm?.admin_approval == 2 ? (
                  <img
                    src={vehicleForms?.manager?.manager_signature}
                    style={{ position: 'absolute', width: '220px', top: '-10px', left: '20px' }}
                    alt="Signature"
                  />
                ):null
                }
                  
                </div>
                <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
                  {vehicleForms?.manager?.manager_name}
                </div> 
                <div className="w-3/4 text-center text-sm relative">
                  Adminstrative Division Manager
                </div>  
              </td>
            </tr>

          </table>

          </div>
        </div>
      </div>
    </div>
    )}

    </PageComponent>
  );
}