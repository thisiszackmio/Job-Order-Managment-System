import React from "react";
import PageComponent from "../components/PageComponent";
import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function EquipementForm(){

  const {id} = useParams();
  const {currentUser, userRole} = useUserStateContext();

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

  //Date Format 
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const [isLoading, setIsLoading] = useState(true);
  const [displayInfo , setDisplayInfo] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // PopUp
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupContent, setPopupContent] = useState('');

  const [EquipmentInstruction, setEquipmentInstruction] = useState('');

  // Control the text limit into 500
  const handleTextLimit = (ev) => {
    const inputValue = ev.target.value;
    if (inputValue.length <= 500) {
      setEquipmentInstruction(inputValue);
    }
  }

  // Get the data
  const fetchEquipmentForm = () => {
    axiosClient
    .get(`/viewequipment/${id}`)
    .then((response) => {
      const responseData = response.data;
      const equipmentForm = responseData.view_equipment;
      const requestorName = responseData.requestor;
      const requestorSign = responseData.requestor_sign;
      const DMName = responseData.div_manager_name;
      const DMSign = responseData.div_manager_sign;
      const AMName = responseData.admin_manager_name;
      const AMSign = responseData.admin_manager_sign;
      const HMName = responseData.harbor_master;
      const HMSign = responseData.harbor_sign;
      const PMName = responseData.port_manager;
      const PMSign = responseData.port_sign;

      setIsLoading(false);
      setDisplayInfo({
        equipmentForm,
        requestorName,
        requestorSign,
        DMName,
        DMSign,
        AMName,
        AMSign,
        HMName,
        HMSign,
        PMName,
        PMSign
      });
    })
    .catch((error) => {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchEquipmentForm();
  },[id]);

  // Null Instructions
  function SubmitNullInstruction(){
    //alert("Kani");

    setPopupContent('warning');
    setShowPopup(true);
    setPopupMessage(
      <div>
        <p className="popup-title">Empty Field</p>
        <p>Do you want to proceed even if there are no instructions?</p>
      </div>
    );
  }

  // Get the value of Instruction
  let output;

  if(EquipmentInstruction == ''){
    output = 'None';
  }else{
    output = EquipmentInstruction;
  }

  // Form Submit
  const AdminInstruction = (event) => {
    event.preventDefault();

    // alert(output);

    setSubmitLoading(true);
    axiosClient.put(`/equipmentmanins/${id}`,{
      instructions: output,
    })
    .then((response) => {
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p>The form has been submitted.</p>
        </div>
      );
      setShowPopup(true);
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
      setSubmitLoading(false);
    });

  }

  // POPUP Message
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p>There was a problem submitting the form. Please contact the developer.</p>
    </div>
  );

  // Approval Confirmation
  function handleApprovalRequest(){
    //alert("Approval");

    if(currentUser.code_clearance == 4){
      setPopupContent('warning');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Do you want to approve <strong>{displayInfo?.requestorName}'s</strong> request?</p>
        </div>
      );
    }else{
      setPopupContent('warning');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Do you want to approve the request?</p>
        </div>
      );
    }

  }

  // Approval Function
  function handleGrantApprovalRequest(){
    //alert("Approved!");

    if(currentUser.code_clearance == 4){
      // For Division Manager
      setSubmitLoading(true);
      axiosClient.put(`/equipmentsupap/${id}`)
      .then((response) => {
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You approve the request! Thank you</p>
          </div>
        );
        setShowPopup(true);
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
        setShowPopup(true);
        setSubmitLoading(false);
      });
    }else{
      // For Admin
      setSubmitLoading(true);
      axiosClient.put(`/equipmentmanap/${id}`)
      .then((response) => {
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You approve the request! Thank you</p>
          </div>
        );
        setShowPopup(true);
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
        setShowPopup(true);
        setSubmitLoading(false);
      });
    }

  }

  // Disapproval Confirmation
  function handleDeclineRequest(){
    //alert("Disapproval");

    if(currentUser.code_clearance == 4){
      setPopupContent('warningD');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Do you want to disapprove <strong>{displayInfo?.requestorName}'s</strong> request?</p>
        </div>
      );
    }else{
      setPopupContent('warningD');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Do you want to disapprove the request?</p>
        </div>
      );
    }

  }

  // Disapproval Function
  function handleDeclineApprovalRequest(){
    //alert("Disapproved!");

    if(currentUser.code_clearance == 4){
      // For Division Manager
      setSubmitLoading(true);
      axiosClient.put(`/equipmentsupdp/${id}`)
      .then((response) => {
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You disapprove the request! Thank you</p>
          </div>
        );
        setShowPopup(true);
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
        setShowPopup(true);
        setSubmitLoading(false);
      });
    }else{
      // For Admin
      setSubmitLoading(true);
      axiosClient.put(`/equipmentmandp/${id}`)
      .then((response) => {
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>You disapprove the request! Thank you</p>
          </div>
        );
        setShowPopup(true);
        setSubmitLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
        setShowPopup(true);
        setSubmitLoading(false);
      });
    }
  }

  // Just CLose
  const justclose = () => {
    setShowPopup(false);
  };

  // Close
  const closePopup = () => {
    setIsLoading(true);
    setShowPopup(false);
    setSubmitLoading(false);
    window.location.reload();
  };

  //Restrictions
  const Authorize = userRole == 'h4ck3rZ@1Oppa' || userRole == '4DmIn@Pp4' || userRole == 'Pm@PP4';

  return Authorize ? (
  <PageComponent title="Equipment Request Form">
  {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Equipment Form</span>
    </div>
  ):(
  <>
    {/* Back button */}
    <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded mr-1 text-sm">
      <Link to="/equipmentrequestform">Back to Request List</Link>
    </button>

    {/* ----- Main Form ----- */}
    <div className="border-b border-gray-300 pb-6">

      {/* Control No */}
      <div className="flex items-center mt-6 mb-10">
        <div className="w-24">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Control No:
          </label> 
        </div>
        <div className="w-auto px-5 border-b border-black text-center font-bold">
        {displayInfo?.equipmentForm?.id}
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center mt-6">
        <div className="w-64">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Date:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {formatDate(displayInfo?.equipmentForm?.date_request)}
        </div>
      </div>

      {/* Type of Request */}
      <div className="flex items-center mt-2">
        <div className="w-64">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Request Type:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {displayInfo?.equipmentForm?.type_of_equipment}
        </div>
      </div>

      {/* Title of Activity */}
      <div className="flex items-center mt-2">
        <div className="w-64">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Title/Purpose of Activity:
          </label> 
        </div>
        <div className="w-64 border-b border-black pl-1">
        {displayInfo?.equipmentForm?.title_of_activity}
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
        {formatDate(displayInfo?.equipmentForm?.date_of_activity)}
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
        {formatTime(displayInfo?.equipmentForm?.time_start)} - {formatTime(displayInfo?.equipmentForm?.time_end)}
        </div>
      </div>

      {/* Requestor */}
      <div className="flex items-center mt-2">
        <div className="w-28">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Requestor:
          </label> 
        </div>
        <div className="w-64 border-b border-black font-bold pl-1">
        {displayInfo?.requestorName}
        </div>
      </div>

      {/* DM Approver */}
      <div className="flex items-center mt-2">
        <div className="w-28">
          <label className="block text-base font-medium leading-6 text-gray-900">
          Approver:
          </label> 
        </div>
        <div className="w-64 border-b border-black font-bold pl-1">
        {displayInfo?.DMName}
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
        {displayInfo?.equipmentForm?.division_manager_approval == 1 ? ("Approved")
        :displayInfo?.equipmentForm?.division_manager_approval == 2 ? ("Disapproved")
        :(<>{displayInfo?.equipmentForm?.division_manager_id == currentUser.id ? ("Waiting for your approval"):("Pending")}</>)}
        </div>
      </div>

    </div>

    {/* ----- Action Taken ----- */}
    <div className="border-b border-gray-300 pb-6">
    {displayInfo?.equipmentForm?.type_of_equipment == "Rescue Boat" ? (
      <div className="mt-6">
        {displayInfo?.equipmentForm?.instructions == null && currentUser.position == "Harbor Master" ? (
          "Empty"
        ):(
          <>
          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> ACTION TAKEN </h2>
          </div>
          </>
        )}
      </div>
    ):(
      <div>
        {displayInfo?.equipmentForm?.instructions == '' && currentUser.code_clearance == 1 ? (
        <div className="mt-6">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> A: ACTION TAKEN </h2>
          </div>

          <form id="adminInstruct" onSubmit={AdminInstruction}>

            {/* Instructions */}
            <div className="flex items-center mt-4">
              <div className="w-28">
                <label className="block text-base font-medium leading-6 text-gray-900">
                Instructions:
                </label> 
              </div>
              <div className="w-full flex flex-col">
                <p className="text-sm text-gray-500 mt-1">Remaining characters: {500 - EquipmentInstruction.length}</p>
                <textarea
                  id="action_taken_instructions"
                  name="action_taken_instructions"
                  rows={4}
                  value={EquipmentInstruction}
                  onChange={handleTextLimit}
                  style={{ resize: 'none' }}
                  className="block w-3/4 rounded-md border-1 border-black py-1 text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-gray-400 text-xs mt-1">Leave it blank if "None"</p>
              </div>
            </div>

          </form>

        </div>
        ):(
        <div className="mt-6">

          <div>
            <h2 className="text-base font-bold leading-7 text-gray-900"> A: ACTION TAKEN </h2>
          </div>

          {/* Insctructions */}
          <div className="flex items-center mt-6">
            <div className="w-28">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Instructions:
              </label> 
            </div>
            <div className="w-5/6 border-b border-black pl-1 h-6">
            {displayInfo?.equipmentForm?.instructions ? displayInfo?.equipmentForm?.instructions : null}
            </div>
          </div>

          {/* Approver */}
          <div className="flex items-center mt-2">
            <div className="w-28">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Approver:
              </label> 
            </div>
            <div className="w-64 border-b border-black font-bold pl-1">
            {displayInfo?.AMName}
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
            {displayInfo?.equipmentForm?.admin_manager_approval == 1 ? ("Approved")
            :displayInfo?.equipmentForm?.admin_manager_approval == 2 ? ("Disapproved")
            :(<>{currentUser.code_clearance == 1 ? ("Waiting for your approval"):("Pending")}</>)}
            </div>
          </div>

        </div>
        )}
      </div>
    )}
    </div>

    {/* Buttons */}
    <div className="flex items-center mt-6">
      {/* For Division Manager */}
      {(displayInfo?.equipmentForm?.division_manager_id == currentUser.id && 
      displayInfo?.equipmentForm?.division_manager_approval == 0) && (
        <div>
          {/* Approve */}
          <button 
            onClick={() => handleApprovalRequest()}
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-2 rounded text-sm"
            title="Supervisor Approve"
          >
            Approve
          </button>
          {/* Disapprove */}
          <button 
            onClick={() => handleDeclineRequest()}
            className="bg-red-600 hover:bg-red-500 font-semibold text-white py-2 px-2 rounded ml-1 text-sm"
            title="Supervisor Decline"
          >
            Disapprove
          </button>
        </div>
      )}

      {/* For Admin Manager */}
      {(currentUser.code_clearance == 1 && 
      displayInfo?.equipmentForm?.admin_manager_approval == 0) && (
      <div>
        {/* Instructions */}
        {displayInfo?.equipmentForm?.instructions == null ? (
        <div>
          {EquipmentInstruction ? (
            <button
              form='adminInstruct'
              type="submit"
              className={`text-white py-2 px-2 rounded font-semibold text-sm focus:outline-none ${
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
          ):(
            <button 
              onClick={() => SubmitNullInstruction()}
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-2 rounded text-sm"
              title="Supervisor Approve"
            >
              Submit
            </button>
          )}
          
        </div>
        ):(
        <div>
          {/* Approve */}
          <button 
            onClick={() => handleApprovalRequest()}
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-white py-2 px-2 rounded text-sm"
            title="Supervisor Approve"
          >
            Approve
          </button>
          {/* Disapprove */}
          <button 
            onClick={() => handleDeclineRequest()}
            className="bg-red-600 hover:bg-red-500 font-semibold text-white py-2 px-2 rounded ml-1 text-sm"
            title="Supervisor Decline"
          >
            Disapprove
          </button>
        </div>
        )}
      </div>
      )}
    </div>
    
    {/* PopUp */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50">

        {/* Semi-transparent black overlay */}
        <div className="fixed inset-0 bg-black opacity-40"></div>

        {/* Popup content with background blur */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>

          {/* Notification Icons */}
          <div className="f-modal-alert">
            
            {/* Error */}
            {popupContent == 'error' && (
              <div className="f-modal-icon f-modal-error animate">
                <span className="f-modal-x-mark">
                  <span className="f-modal-line f-modal-left animateXLeft"></span>
                  <span className="f-modal-line f-modal-right animateXRight"></span>
                </span>
              </div>
            )}

            {/* Warning */}
            {(popupContent == 'warning' || popupContent == 'warningD') && (
              <div className="f-modal-icon f-modal-warning scaleWarning">
                <span className="f-modal-body pulseWarningIns"></span>
                <span className="f-modal-dot pulseWarningIns"></span>
              </div>
            )}

            {/* Success */}
            {popupContent == 'success' && (
              <div className="f-modal-icon f-modal-success animate">
                <span className="f-modal-line f-modal-tip animateSuccessTip"></span>
                <span className="f-modal-line f-modal-long animateSuccessLong"></span>
              </div>
            )}

          </div>

          {/* Popup Message */}
          <p className="text-lg text-center"> {popupMessage} </p>

          {/* Buttons */}
          <div className="flex justify-center mt-4">

            {/* Warning for Approval */}
            {popupContent == 'warning' && (
            <>
            
              {/* For Supervisor */}
              {displayInfo?.equipmentForm?.division_manager_id == currentUser.id && (
              <>
                {/* Confirm */}
                {!submitLoading && (
                  <button
                    onClick={() => handleGrantApprovalRequest(displayInfo?.equipmentForm?.id)}
                    className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                  >
                   <FontAwesomeIcon icon={faCheck} /> Confirm
                  </button>
                )}
                {/* No */}
                {!submitLoading && (
                  <button
                    onClick={justclose}
                    className="w-1/2 px-4 py-2 bg-white border border-gray-300 font-semibold text-black-500 rounded hover:bg-gray-300 ml-2"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
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
                {displayInfo?.equipmentForm?.instructions == '' ? (
                <>
                  {/* Confirm */}
                  {!submitLoading && (
                    <button
                      form='adminInstruct'
                      type="submit"
                      className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                    >
                    <FontAwesomeIcon icon={faCheck} /> Confirm
                    </button>
                  )}
                  {/* No */}
                  {!submitLoading && (
                    <button
                      onClick={justclose}
                      className="w-1/2 px-4 py-2 bg-white border border-gray-300 font-semibold text-black-500 rounded hover:bg-gray-300 ml-2"
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
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
                ):(
                <>
                  {/* Confirm */}
                  {!submitLoading && (
                    <button
                      onClick={() => handleGrantApprovalRequest(displayInfo?.equipmentForm?.id)}
                      className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                    >
                    <FontAwesomeIcon icon={faCheck} /> Confirm
                    </button>
                  )}
                  {/* No */}
                  {!submitLoading && (
                    <button
                      onClick={justclose}
                      className="w-1/2 px-4 py-2 bg-white border border-gray-300 font-semibold text-black-500 rounded hover:bg-gray-300 ml-2"
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
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
                
              </>
              )}

            </>
            )}

            {/* Warning for Disapproval */}
            {popupContent == 'warningD' && (
            <>
            
              {/* For Supervisor */}
              {displayInfo?.equipmentForm?.division_manager_id == currentUser.id && (
              <>
                {/* Yes */}
                {!submitLoading && (
                  <button
                    onClick={() => handleDeclineApprovalRequest(displayInfo?.equipmentForm?.id)}
                    className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                  >
                    <FontAwesomeIcon icon={faCheck} /> Confirm
                  </button>
                )}
                {/* No */}
                {!submitLoading && (
                  <button
                    onClick={justclose}
                    className="w-1/2 px-4 py-2 bg-white border border-gray-300 font-semibold text-black-500 rounded hover:bg-gray-300 ml-2"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
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
                    onClick={() => handleDeclineApprovalRequest(displayInfo?.equipmentForm?.id)}
                    className="w-1/2 px-4 py-2 bg-indigo-600 font-semibold hover:bg-indigo-500 text-white rounded"
                  >
                    <FontAwesomeIcon icon={faCheck} /> Confirm
                  </button>
                )}
                {/* No */}
                {!submitLoading && (
                  <button
                    onClick={justclose}
                    className="w-1/2 px-4 py-2 bg-white border border-gray-300 font-semibold text-black-500 rounded hover:bg-gray-300 ml-2"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
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
            
            </>
            )}

            {/* Success */}
            {popupContent == 'success' && (
              <button
                onClick={closePopup}
                className="w-full px-4 py-2 font-semibold bg-indigo-600 text-white rounded"
              >
                Close
              </button>
            )}

            {/* Error */}
            {popupContent == 'error' && (
              <button
                onClick={justclose}
                className="w-full px-4 py-2 font-semibold bg-indigo-600 text-white rounded"
              >
                Close
              </button>
            )}
            
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
    );

}