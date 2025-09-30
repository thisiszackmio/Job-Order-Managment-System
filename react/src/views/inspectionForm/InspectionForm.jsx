import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import loading_table from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import ppa_logo from '/default/ppa_logo.png'
import axiosClient from "../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCircleXmark, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function InspectionForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  // Get the ID
  const {id} = useParams();

  // Functions
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);

  // Set Access
  const [dataAccess, setDataAccess] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [trackingForm, setTrackingForm] = useState({});

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [enableSupDecline, setEnableSupDecline] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);

  const [inspectionData, setInspectionData] = useState([]);
  const [enablePartA, setEnablePartA] = useState(true);
  const [enablePartB, setEnablePartB] = useState(true);
  const [enablePartC, setEnablePartC] = useState(true);
  const [enablePartD, setEnablePartD] = useState(true);

  const [getPersonnel, setGetPersonnel] = useState([]);
  const [inputErrors, setInputErrors] = useState({});
  const [reasonError , setReasonError] = useState(false);

  // --- Update Part A --- //
  const [updatepropertyNo, setUpdatePropertyNo] = useState(inspectionData?.form?.property_number ?? "");
  const [updateacquisitionDate, setUpdateAcquisitionDate] = useState(inspectionData?.form?.acquisition_date ?? "");
  const [updateacquisitionCost, setUpdateAcquisitionCost] = useState(inspectionData?.form?.acquisition_cost ?? "");
  const [updateBrandModel, setUpdateBrandModel] = useState(inspectionData?.form?.brand_model ?? "");
  const [updateSerialEngineNo, setUpdateSerialEngineNo] = useState(inspectionData?.form?.serial_engine_no ?? "");
  const [updateTypeofProperty, setUpdateTypeofProperty] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateLocation, setUpdateLocation] = useState('');
  const [updateComplain, setUpdateComplain] = useState('');

  // --- Part B --- //
  const [partBForm, setPartBForm] = useState(false);
  const [partBdate, setPartBdate] = useState(today);
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState({ pid: '', pname: '' });

  // --- Update Part B --- //
  const [updatePartBdate, setUpdatePartBdate] = useState(today);
  const [updatelastfilledDate, setUpdateLastFilledDate] = useState(inspectionData?.form?.date_of_last_repair ?? "");
  const [updatenatureRepair, setUpdateNatureRepair] = useState(inspectionData?.form?.nature_of_last_repair ?? "");
  const [updatepointPersonnel, setUpdatePointPersonnel] = useState({ pid: '', pname: '' });

  // --- Part C --- //
  const [partCForm, setPartCForm] = useState(false);
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // --- Update Part C --- //
  const [partCDate, setPartCDate] = useState(today);
  const [updatefindings, setUpdateFindings] = useState('');
  const [updaterecommendations, setUpdateRecommendations] = useState('');

  // --- Part D --- //
  const [partDForm, setPartDForm] = useState(false);
  const [partDDate, setPartDDate] = useState(today);
  const [remarks, setRemarks] = useState('');

  // --- Update Part D --- //
  const [updateremarks, setUpdateRemarks] = useState('');

  // --- Reason for disapproval --- //
  const [reason, setReason] = useState('');

  // Update state when inspectionData updates
  useEffect(() => {
    setUpdatePropertyNo(inspectionData?.form?.property_number ?? "");
    setUpdateAcquisitionDate(inspectionData?.form?.acquisition_date ?? "");
    setUpdateAcquisitionCost(inspectionData?.form?.acquisition_cost ?? "");
    setUpdateBrandModel(inspectionData?.form?.brand_model ?? "");
    setUpdateSerialEngineNo(inspectionData?.form?.serial_engine_no ?? "");
    setUpdateTypeofProperty(inspectionData?.form?.type_of_property ?? "");
    setUpdateDescription(inspectionData?.form?.property_description ?? "");
    setUpdateLocation(inspectionData?.form?.location ?? "");
    setUpdateComplain(inspectionData?.form?.complain ?? "");
    setUpdateLastFilledDate(inspectionData?.form?.date_of_last_repair ?? "");
    setUpdateNatureRepair(inspectionData?.form?.nature_of_last_repair ?? "");
    setPartCDate(inspectionData?.form?.before_repair_date ?? "");
    setUpdateFindings(inspectionData?.form?.findings ?? "");
    setUpdateRecommendations(inspectionData?.form?.recommendations ?? "");
    setUpdateRemarks(inspectionData?.form?.remarks ?? "");
  },[
    inspectionData?.form?.property_number,
    inspectionData?.form?.acquisition_date,
    inspectionData?.form?.acquisition_cost,
    inspectionData?.form?.brand_model,
    inspectionData?.form?.serial_engine_no,
    inspectionData?.form?.type_of_property,
    inspectionData?.form?.property_description,
    inspectionData?.form?.location,
    inspectionData?.form?.complain,
    inspectionData?.form?.date_of_last_repair,
    inspectionData?.form?.nature_of_last_repair,
    inspectionData?.form?.before_repair_date,
    inspectionData?.form?.findings,
    inspectionData?.form?.recommendations,
    inspectionData?.form?.remarks
  ]);

  // Disable the Scroll on Popup
  useEffect(() => {
  
    // Define the classes to be added/removed
    const popupClass = 'popup-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else {
      removePopupClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup]);

  // Get the Data from the database
  function fecthInspection() {
    axiosClient
    .get(`/showinsprequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const form = responseData.form;
      const requestor_esig = responseData.requestor_esig;
      const supervisor_esig = responseData.supervisor_esig;
      const assign_esig = responseData.assign_esig;
      const gso_name = responseData.gso_name;
      const gso_esig = responseData.gso_esig;
      const admin_name = responseData.admin_name;
      const admin_esig = responseData.admin_esig;
      const gso_id = responseData.gso_id;

      setInspectionData({
        form,
        requestor_esig,
        supervisor_esig,
        assign_esig,
        gso_name,
        gso_esig,
        admin_name,
        admin_esig,
        gso_id
      })

      setDataAccess(null);

    })
    .catch((error) => {
      if(error.response && error.response.data){
        if(error.response.data.error == "No-Form"){ 
          setDataAccess('Not-Found');
          window.location = '/404';
        }
      } else {
        console.error("Unexpected error:", error);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Display Personnel on select tag
  const fetchDisplayPersonnel = () => {
    axiosClient
    .get(`/displaypersonnel/${id}`)
    .then((response) => {
      const responseData = response.data;

      setGetPersonnel(responseData);
    });
  }

  // Auto close request
  const setFormClosed = () => {

    if(GSO){
      axiosClient
      .get(`/closeinspectionrequest/${id}`)
      .then(response => {
        console.log(response.data.message); // Show success message
      })
      .catch(error => {
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true); 
      });
    }
    
  }

  // Get the tracking form request
  const fetchTracking = () => {
    axiosClient
    .get(`/formtracking/${id}`, {
      params: { type: 'Repair' }
    })
    .then((response) => {
      const tracking = response.data
      
      const trackData = tracking.map((dataItem) => {
        return{
          id: dataItem.id,
          form_id: dataItem.form_id,
          type_of_request: dataItem.type_of_request,
          remarks: dataItem.remarks,
          date: dataItem.date,
          time: dataItem.time
        }
      });

      setTrackingForm(trackData);

    });
  }

  // Idle for the personnel
  // const setIdle = () => {
  //   if(GSO){
  //     axiosClient
  //     .get(`/idleinspectionrequest/${id}`)
  //     .then(response => {
  //       console.log(response.data.message); // Show success message
  //     })
  //     .catch(error => {
  //       setPopupContent("error");
  //       setPopupMessage(DevErrorText);
  //       setShowPopup(true); 
  //     }).finally(() => {
  //       setSubmitLoading(false);
  //     });
  //   }
  // }

  useEffect(() => { 
    if(currentUserId){
      fecthInspection();
      fetchDisplayPersonnel();
      setFormClosed();
      fetchTracking();
      // setIdle();
    }
  }, [id, currentUserId]);

  // Supervisor Approvel Popup 
  const handleSupApprovalConfirmation = () => {
    setShowPopup(true);
    setPopupContent('dma');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to approve {inspectionData?.form?.user_name}'s request?</p>
      </div>
    );
  }

  // Super Approval Function
  function handlelSupervisorApproval(id){
    setSubmitLoading(true);
    
    axiosClient
    .put(`/supinsprequestapprove/${id}`)
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Canceled Already'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid</p>
            <p className="popup-message">This form has already been canceled.</p>
          </div>
        );
      } else {
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The form has been approved</p>
          </div>
        );
        setShowPopup(true);
      }
    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Supervisor Decline Popup 
  const handleSupDeclineConfirmation = () => {

    if(!reason){
      setReasonError(true);
    }else{
      setShowPopup(true);
      setPopupContent('dmd');
      setPopupMessage(
        <div>
          <p className="popup-title">Are you sure?</p>
          <p className="popup-message">Do you want to disapprove {inspectionData?.form?.user_name}'s request? It cannot be undone.</p>
        </div>
      );
    }
  }

  // Submit Supervisor Reason
  function SubmitSupReason(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/supinsprequestdisapprove/${id}`, {
      reason:reason,
    })
    .then(() => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The form has been disapproved</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Part A
  function UpdatePartA(){
    setSubmitLoading(true);

    const dataA = {
      user_id: currentUserId,
      user_name: currentUserName.name,
      property_number: updatepropertyNo,
      acquisition_date: updateacquisitionDate,
      acquisition_cost: updateacquisitionCost,
      brand_model: updateBrandModel,
      serial_engine_no: updateSerialEngineNo,
      type_of_property: updateTypeofProperty,
      property_description: updateDescription,
      location: updateLocation,
      complain: updateComplain,
      code: ucode,
    }

    axiosClient
    .put(`/updateinsprequestparta/${id}`, dataA)
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Closed'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form has already been closed.</p>
          </div>
        )
      } else if(responseData === 'Not Editable'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form cannot be edited.</p>
          </div>
        )
      } else {
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The form has been updated.</p>
          </div>
        );
        setShowPopup(true);
      }
    })
    .catch((error) => {
      setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status); 
      })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // GSO Submit Popup 
  const handleGSOSubmitConfirmation = () => {
    setShowPopup(true);
    setPopupContent('gsoi');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation</p>
        <p className="popup-message">Do you want to proceed without data for the Date of Last Repair or the Nature of Last Repair?</p>
      </div>
    );
  }

  // Submit Part B Form
  function SubmitPartB(){
    // alert("hi")
    setSubmitLoading(true);

    const data = {
      gsoId: currentUserId,
      date_of_filling: partBdate,
      date_of_last_repair: lastfilledDate,
      nature_of_last_repair: natureRepair,
      personnel_id: pointPersonnel.pid,
      personnel_name: pointPersonnel.pname, 
    }

    axiosClient
    .put(`/submitinsprequestpartb/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Form submitted successfully.</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 422) {
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }else{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Part B
  function UpdatePartB(){
    setSubmitLoading(true);

    const dataB = {
      user_name: currentUserName.name,
      date_of_filling: updatePartBdate,
      date_of_last_repair : updatelastfilledDate,
      nature_of_last_repair: updatenatureRepair,
      personnel_id: updatepointPersonnel.pid ? updatepointPersonnel.pid : inspectionData?.form?.personnel_id,
      personnel_name: updatepointPersonnel.pname ? updatepointPersonnel.pname : inspectionData?.form?.personnel_name,
    }

    console.log(dataB);

    axiosClient
    .put(`/updateinsprequestpartb/${id}`, dataB)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The form has been updated.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if (error.response.status === 408) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid</p>
            <p className="popup-message">You can no longer reassign the personnel.</p>
          </div>
        );
        setShowPopup(true);
      } else {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Admin Approval Popup 
  const handleAdminApprovalConfirmation = () => {
    setShowPopup(true);
    setPopupContent('ama');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation</p>
        <p className="popup-message">Do you want to approve {inspectionData?.form?.user_name}'s request?</p>
      </div>
    );
  }

  // Admin Approval Function
  function handlelAdminApproval(id){
    setSubmitLoading(true);

    const data = {
      user_id: currentUserId,
    }

    axiosClient
    .put(`/admininsprequestapprove/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The form has been approved</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Part C Form
  function SubmitPartC(){
    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      before_repair_date: partCDate,
      findings: findings,
      recommendations: recommendations
    }

    axiosClient
    .put(`/submitinsprequestpartc/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Form submitted successfully.</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }else{
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Part C
  function UpdatePartC(){
    setSubmitLoading(true);

    const dataC = {
      user_name: currentUserName.name,
      before_repair_date: partCDate,
      findings : updatefindings,
      recommendations: updaterecommendations,
    }

    axiosClient
    .put(`/updateinsprequestpartc/${id}`, dataC)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The form has been updated.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if(error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      } else {
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true); 
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Part D Form
  function SubmitPartD(){
    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      after_reapir_date: partDDate,
      remarks: remarks,
    }

    axiosClient
    .put(`/submitinsprequestpartd/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Form submitted successfully.</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status == 422) {
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }else{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Part D
  function UpdatePartD(){
    setSubmitLoading(true);

    const dataD = {
      after_reapir_date : partDDate,
      user_name: currentUserName.name,
      remarks : updateremarks,
    }

    axiosClient
    .put(`/updateinsprequestpartd/${id}`, dataD)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The form has been updated.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if(error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      } else {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

    // Close Form Popup 
  const handleCloseForm = () => {
    setShowPopup(true);
    setPopupContent('gsofc');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to cancel this form? It cannot be restore.</p>
      </div>
    );
  }

  // Force Close Request Function
  function CloseForceRequest(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/cancelinspectionrequest/${id}`, {
      user_name:currentUserName.name,
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
        <p className="popup-message">This form has been successfully canceled.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
    fecthInspection();
    setEnablePartA(true);
  }

  //Close Popup on Success
  const closePopup = () => {
    setEnablePartA(true);
    setEnablePartB(true);
    setEnablePartC(true);
    setEnablePartD(true);
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
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
    setLoadingPDF(true);
    setTimeout(() => {
      generatePDF();
      setLoadingPDF(false);
      setIsVisible(false); 
    }, 2000);
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

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const DivisionManager = codes.includes("DM");
  const SuperAdmin = codes.includes("HACK");
  const roles = ["AM", "GSO", "HACK", "PM", "DM", "AU", "AP"];
  const accessOnly = roles.some(role => codes.includes(role));
  const clearance = inspectionData?.form?.user_id == currentUserId || accessOnly;
  
  return (
    <PageComponent title="Pre/Post Repair Inspection Form">
      {dataAccess != 'Not-Found' ? (
        loading ? (
          <div className="flex justify-center items-center py-4">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading Pre/Post Repair Inspection Form</span>
          </div>
        ):(
          clearance ? (
          <>
            {/* Notification for auto close and for the GSO */}
            <div className="text-sm flex justify-end items-center w-full">
              {/* {accessOnly && inspectionData?.form?.form_status == 2 && "The form becomes non-editable after 24 hours."} */}
            </div>

            {/* Header */}
            <div className="ppa-form-header text-base flex justify-between items-center">
              <span>Control No: <span className="px-2 ppa-form-view">{inspectionData?.form?.id}</span></span>
              <div className="flex space-x-4">
                {/* Edit Part A Button */}
                {!enablePartA && (
                <>
                  {/* SuperAdmin */}
                  {SuperAdmin && currentUserId == 1 && (
                    !buttonHide && (
                      <>
                        {/* Submit */}
                        <button 
                          type="submit"
                          onClick={() => UpdatePartA()}
                          className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ):(
                            'Update Part A'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnablePartA(true);
                            }} className="py-2 px-4 text-sm btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )}

                  {/* For the Requestor */}
                  {currentUserId == inspectionData?.form?.user_id && [8, 9, 10, 11].includes(inspectionData?.form?.form_status) && (!GSO || !DivisionManager || !SuperAdmin) && (
                    !buttonHide && (
                      <>
                        {/* Submit */}
                        <button 
                          type="submit"
                          onClick={() => UpdatePartA()}
                          className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ):(
                            'Update Part A'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnablePartA(true);
                            }} className="py-2 px-4 text-sm btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )}

                  {/* For the GSO */}
                  {[2, 3, 4, 5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && GSO && (
                    !buttonHide && (
                      <>
                        {/* Submit */}
                        <button 
                          type="submit"
                          onClick={() => UpdatePartA()}
                          className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ):(
                            'Update Part A'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnablePartA(true);
                            }} className="py-2 px-4 text-sm btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )}
                </>
                )}

                {/* Submit Part B Button */}
                {partBForm && (
                  !buttonHide && (
                    !pointPersonnel.pid ? (
                    <>
                      {/* Submit */}
                      <button type="submit"
                          onClick={() => SubmitPartB()}
                          className={`py-2 px-3 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                        {submitLoading ? (
                          <div className="flex">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-1">Loading</span>
                          </div>
                        ):(
                        'Submit'
                        )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setPartBForm(false); 
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    ):(
                    (!lastfilledDate || !natureRepair) ? (
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => handleGSOSubmitConfirmation()} 
                        className="py-2 px-3 text-sm btn-default-form"
                      >
                        Submit
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setPartBForm(false); 
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    ):(
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => SubmitPartB()}
                        className={`py-2 px-3 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                        disabled={submitLoading}
                      >
                      {submitLoading ? (
                        <div className="flex">
                          <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                          <span className="ml-2">Loading</span>
                        </div>
                      ):(
                      'Submit'
                      )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setPartBForm(false); 
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )
                    )
                  )
                )}

                {/* Edit Part B Button */}
                {!enablePartB && (
                <>
                  {/* SuperAdmin */}
                  {SuperAdmin && currentUserId == 1 && (
                    !buttonHide && (
                      <>
                        {/* Submit */}
                        <button type="submit"
                          onClick={() => UpdatePartB()}
                          className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ):(
                            'Update Part B'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnablePartB(true); 
                            }} className="py-2 px-4 text-sm btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )}

                  {/* GSO */}
                  {GSO && (
                    !buttonHide && (
                      <>
                        {/* Submit */}
                        <button type="submit"
                          onClick={() => UpdatePartB()}
                          className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ):(
                            'Update Part B'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnablePartB(true); 
                            }} className="py-2 px-4 text-sm btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )}
                </>
                )}

                {/* Submit Part C Button */}
                {partCForm && (
                  !buttonHide && (
                  <>
                    {/* Submit */}
                    <button type="submit"
                      onClick={() => SubmitPartC()}
                      className={`py-2 px-3 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                      disabled={submitLoading}
                    >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Loading</span>
                      </div>
                    ):(
                    'Submit'
                    )}
                    </button>

                    {/* Cancel */}
                    {!submitLoading && (
                      <button onClick={() => { 
                          setPartCForm(false); 
                        }} className="py-2 px-4 text-sm btn-cancel-form">
                        Cancel
                      </button>
                    )}
                  </>
                  )
                )}

                {/* Edit Part C Button */}
                {!enablePartC && (
                <>
                  {/* Assign Personnel */}
                  {(inspectionData?.form?.personnel_id == currentUserId) && (!SuperAdmin || !GSO) && (
                    !buttonHide && (
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => UpdatePartC()}
                        className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <div className="flex">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-1">Loading</span>
                          </div>
                        ):(
                          'Update Part C'
                        )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setEnablePartC(true);
                            setPartCDate(''); 
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )
                  )}

                  {/* For the GSO */}
                  {[2, 3, 4, 5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && GSO && (
                    !buttonHide && (
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => UpdatePartC()}
                        className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <div className="flex">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-1">Loading</span>
                          </div>
                        ):(
                          'Update Part C'
                        )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setEnablePartC(true);
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )
                  )}
                </>
                )}

                {/* Submit Part D Form */}
                {partDForm && (
                  !buttonHide && (
                  <>
                    {/* Submit */}
                    <button type="submit"
                      onClick={() => SubmitPartD()}
                      className={`py-2 px-3 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                      disabled={submitLoading}
                    >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Loading</span>
                      </div>
                    ):(
                    'Submit'
                    )}
                    </button>

                    {/* Cancel */}
                    {!submitLoading && (
                      <button onClick={() => { 
                          setPartDForm(false); 
                        }} className="py-2 px-4 text-sm btn-cancel-form">
                        Cancel
                      </button>
                    )}
                  </>
                  )
                )}

                {/* Edit Part D Button */}
                {!enablePartD && (
                <>
                  {/* Assign Personnel */}
                  {(inspectionData?.form?.personnel_id == currentUserId) && (!SuperAdmin || !GSO) && (
                    !buttonHide && (
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => UpdatePartD()}
                        className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <div className="flex">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-1">Loading</span>
                          </div>
                        ):(
                          'Update Part D'
                        )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setEnablePartD(true);
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )
                  )}

                  {/* For the GSO */}
                  {[2, 3, 4, 5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && GSO && (
                    !buttonHide && (
                    <>
                      {/* Submit */}
                      <button type="submit"
                        onClick={() => UpdatePartD()}
                        className={`py-2 px-4 text-sm ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <div className="flex">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-1">Loading</span>
                          </div>
                        ):(
                          'Update Part D'
                        )}
                      </button>

                      {/* Cancel */}
                      {!submitLoading && (
                        <button onClick={() => { 
                            setEnablePartD(true);
                          }} className="py-2 px-4 text-sm btn-cancel-form">
                          Cancel
                        </button>
                      )}
                    </>
                    )
                  )}
                </>
                )}

                {/* Supervisor Button */}
                {DivisionManager && currentUserId == inspectionData?.form?.supervisor_id && inspectionData?.form?.form_status == 11 && (
                  enableSupDecline ? (
                  <>
                    {/* Enable Reason */}
                    <button onClick={() => handleSupDeclineConfirmation()} className="py-2 px-4 text-sm btn-default-form"> Submit </button>
                    <button onClick={() => { setEnableSupDecline(false); setReason(''); setReasonError(false); }} className="py-2 px-4 text-sm btn-cancel-form"> Cancel </button>
                  </>
                  ):(
                  <>
                    {/* Approve */}
                    <button onClick={() => handleSupApprovalConfirmation()} className="py-2 px-4 text-sm btn-default-form"> Approve </button>
                    {/* Decline */}
                    {!inspectionData?.form?.before_repair_date && !inspectionData?.form?.after_reapir_date && (
                      <button onClick={() => setEnableSupDecline(true)} className="py-2 px-4 text-sm btn-cancel-form"> Decline </button>
                    )}
                  </>
                  )
                )}

                {/* Admin Manager's Approval */}
                {Admin && inspectionData?.form?.form_status == 5 && (
                  <button
                    onClick={() => handleAdminApprovalConfirmation()} 
                    className="py-2 px-4 text-sm btn-default-form"
                  >
                    Approve
                  </button>
                )}

                {/* Cancel Button */}
                {!partBForm && enablePartA && enablePartB && enablePartC && enablePartD && !inspectionData?.form?.before_repair_date && !inspectionData?.form?.after_reapir_date && (
                  currentUserId == inspectionData?.form?.user_id && [8, 9, 10, 11].includes(inspectionData?.form?.form_status) && (!GSO || !SuperAdmin) ? (
                    <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-delete" title="Cancel Request" icon={faCircleXmark} />
                  ):(GSO || currentUserId == 1) && [5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) ? (
                    <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-delete" title="Cancel Request" icon={faCircleXmark} />
                  ):null
                )}

                {/* Generate PDF Button */}
                {!partDForm && !partCForm && !partBForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                  currentUserId == inspectionData?.form?.user_id && [1, 2].includes(inspectionData?.form?.form_status) && (!GSO || !DivisionManager || !SuperAdmin) ? (
                    <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                  ):(GSO || SuperAdmin || (Admin && inspectionData?.form?.form_status === 1)) ? (
                    <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                  ):null
                )}
              </div>
            </div>

            {/* Form */}
            <div className="pl-4 pt-6 pb-6 pr-4 ppa-form-box bg-white mb-6">
              {loadingPDF ? (
                <div className="flex justify-center text-lg font-bold items-center space-x-4">
                  Generating PDF
                </div>
              ):(
                enableSupDecline ? (
                  <>
                    {/* Form Reason */}
                    <form id="submitSupReason" onSubmit={SubmitSupReason}>
                      <label htmlFor="rep_location" className="block text-base font-bold leading-6 text-black">
                        Reason for disapproval:
                      </label>
                      <div className="w-full mt-2">
                        <input
                          type="text"
                          name="reason"
                          id="reason"
                          value={reason}
                          onChange={ev => setReason(ev.target.value)}
                          placeholder="Input your reasons"
                          className={`block w-full ${reasonError && !reason ? "ppa-form-error":"ppa-form"}`}
                        />
                        {reasonError && !reason && (<p className="form-validation">This form is required</p>)}
                      </div>
                    </form>
                  </>
                ):(
                <>
                  {/* Status */}
                  <div className="status-sec mb-4">
                      {([5, 11].includes(inspectionData?.form?.form_status) && 
                      inspectionData?.form?.date_of_filling && 
                      inspectionData?.form?.before_repair_date &&
                      inspectionData?.form?.after_reapir_date) ? (
                      <>
                        <p> <strong>Status: </strong> Form was completed, but no approval from {[11].includes(inspectionData?.form?.form_status) && "Immediate Supervisor "} {[11].includes(inspectionData?.form?.form_status) ? "and" : null} {[5, 11].includes(inspectionData?.form?.form_status) && "Admin Manager"}. </p>
                      </>
                      ):(
                        <p> <strong>Status: </strong> {inspectionData?.form?.form_remarks} </p>
                      )}
                  </div>

                  {/* Part A */}
                  <div className="pb-6 border-b border-gray-300">

                    {/* Caption */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
                      <div>
                        {/* Edit Button*/}
                        {SuperAdmin && currentUserId == 1 && (!partBForm && !partCForm && !partDForm && enablePartA && enablePartB && enablePartC && enablePartD) && (
                          <FontAwesomeIcon onClick={() => { setEnablePartA(false); }} className="icon-form" title="Edit Part A" icon={faPenToSquare} />
                        )}
                        
                        {GSO && inspectionData?.form?.form_status != 0 && inspectionData?.form?.form_status != 1 ? (
                          !partBForm && enablePartA && enablePartB && enablePartC && enablePartD && <FontAwesomeIcon onClick={() => { setEnablePartA(false); }} className="icon-form" title="Edit Part A" icon={faPenToSquare} />
                        ):(!SuperAdmin || !GSO || !DivisionManager || !Admin) && inspectionData?.form?.user_id == currentUserId && [8, 9, 10, 11, 12].includes(inspectionData?.form?.form_status) ? (
                          enablePartA && enablePartB && enablePartC && enablePartD && <FontAwesomeIcon onClick={() => { setEnablePartA(false); }} className="icon-form" title="Edit Part A" icon={faPenToSquare} />
                        ):null}
                      </div>
                    </div>
              
                    {/* ---- Part A Fields ---- */}
                    <div className="grid grid-cols-2">
                      
                      {/* Part A left side */}
                      <div className="col-span-1">

                        {/* Date */}
                        <div className="flex items-center mt-6">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                            Date:
                            </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                value={formatDate(inspectionData?.form?.date_request)}
                                className="block w-full ppa-form-edit"
                                disabled
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading &&(formatDate(inspectionData?.form?.date_request))}
                            </div>
                          )}
                        </div>

                        {/* Property No */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                name="rep_property_no"
                                id="rep_property_no"
                                autoComplete="rep_property_no"
                                value={updatepropertyNo}
                                onChange={ev => setUpdatePropertyNo(ev.target.value)}
                                placeholder="Input Property Number" 
                                className="block w-full ppa-form-edit"
                              />
                            </div>                            
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.property_number ? inspectionData?.form?.property_number : "N/A")}
                            </div>
                          )}
                        </div>

                        {/* Acquisition Date */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Date: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="date"
                                name="rep_acquisition_date"
                                id="rep_acquisition_date"
                                value={updateacquisitionDate}
                                onChange={ev => setUpdateAcquisitionDate(ev.target.value)}
                                max={currentDate}
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.acquisition_date ? formatDate(inspectionData?.form?.acquisition_date) : "N/A")}
                            </div>
                          )}
                        </div>

                        {/* Acquisition Cost */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Cost: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                                <input
                                  type="text"
                                  name="rep_acquisition_cost"
                                  id="rep_acquisition_cost"
                                  autoComplete="rep_acquisition_cost"
                                  value={updateacquisitionCost}
                                  onChange={ev => {
                                    const inputVal = ev.target.value;
                                    // Allow only numeric input
                                    if (/^\d*(\.\d{0,2})?$/.test(inputVal.replace(/,/g, ''))) {
                                      setUpdateAcquisitionCost(inputVal.replace(/,/g, ''));
                                    }
                                  }}
                                  placeholder="Input Acquisition Cost"
                                  className="block w-full ppa-form-edit"
                                />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.acquisition_cost 
                                ? new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP'
                                  }).format(inspectionData?.form?.acquisition_cost) 
                                : 'N/A')}
                            </div>
                          )}
                        </div>

                        {/* Brand/Model */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Brand/Model: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                name="brand_mrep_brand_model"
                                id="rep_brand_model"
                                autoComplete="rep_brand_model"
                                value={updateBrandModel}
                                onChange={ev => setUpdateBrandModel(ev.target.value)}
                                placeholder="Input Brand/Model"
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.brand_model ? inspectionData?.form?.brand_model : "N/A")}
                            </div>
                          )}
                        </div>

                        {/* Serial/Engine No */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Serial/Engine No: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                name="rep_serial_engine_no"
                                id="rep_serial_engine_no"
                                autoComplete="rep_serial_engine_no"
                                value={updateSerialEngineNo}
                                onChange={ev => setUpdateSerialEngineNo(ev.target.value)}
                                placeholder="Input Serial/Engine No"
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.serial_engine_no ? inspectionData?.form?.serial_engine_no : "N/A")}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Part A right side */}
                      <div className="col-span-1">

                        {/* Type of Property */}
                        <div className="flex items-center mt-6">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Type of Property: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <select 
                                name="rep_type_of_property" 
                                id="rep_type_of_property" 
                                value={updateTypeofProperty}
                                onChange={ev => setUpdateTypeofProperty(ev.target.value)}
                                className="block w-full ppa-form-edit"
                              >
                                <option value="" disabled>(Current) {inspectionData?.form?.type_of_property}</option>
                                {["Vehicle Supplies & Materials", "IT Equipment & Related Materials", "Others"]
                                  .filter(option => option !== inspectionData?.form?.type_of_property)
                                  .map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                              </select>
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.type_of_property)}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Description: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                name="rep_description"
                                id="rep_description"
                                value={updateDescription}
                                onChange={ev => setUpdateDescription(ev.target.value)}
                                placeholder="Enter Description"
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.property_description)}
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Location: </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                name="rep_location"
                                id="rep_location"
                                value={updateLocation}
                                onChange={ev => setUpdateLocation(ev.target.value)}
                                placeholder="Enter Location"
                                className="block w-full ppa-form-edit"
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.location)}
                            </div>
                          )}
                        </div>

                        {/* Requestor */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                            Requestor:
                            </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                value={inspectionData?.form?.user_name}
                                className="block w-full ppa-form-edit"
                                disabled
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.user_name)}
                            </div>
                          )}
                        </div>

                        {/* Noted By */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                            Noted By:
                            </label> 
                          </div>
                          {!enablePartA ? (
                            <div className="w-1/2">
                              <input
                                type="text"
                                value={inspectionData?.form?.supervisor_name}
                                className="block w-full ppa-form-edit"
                                disabled
                              />
                            </div>
                          ):(
                            <div className="w-1/2 ppa-form-view">
                              {!loading && (inspectionData?.form?.supervisor_name)}
                            </div>
                          )}
                        </div>
                        
                      </div>

                    </div>

                    {/* Complain */}
                    <div className="flex items-center mt-2">
                      <div className="w-40">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                        Complain:
                        </label> 
                      </div>
                      {!enablePartA ? (
                        <div className="w-3/4">
                          <input
                            type="text"
                            name="rep_property_no"
                            id="rep_property_no"
                            value={updateComplain}
                            onChange={ev => setUpdateComplain(ev.target.value)}
                            placeholder="Input Complain" 
                            className="block w-full ppa-form-edit"
                          />
                        </div>
                      ):(
                        <div className="w-3/4 ppa-form-view">
                          {!loading && (inspectionData?.form?.complain)}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Part B */}
                  <div className="pb-6 border-b border-gray-300">

                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part B: To be filled-up by Administrative Division </h2>
                      <div>
                        {/* Edit button */}
                        {SuperAdmin && currentUserId == 1 && (
                          (inspectionData?.form?.date_of_filling && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && !partCForm && !partDForm && enablePartA && enablePartB && enablePartC && enablePartD) && (
                            <FontAwesomeIcon onClick={() => { setEnablePartB(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                          )
                        )}

                        {/* GSO */}
                        {GSO && (
                        <>
                          {/* Enable Part B Form */}
                          {[6, 8, 9, 10].includes(inspectionData?.form?.form_status) ? (
                            !partBForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setPartBForm(true); }} className="icon-form ml-3 self-center" title="Enable Form" icon={faPenToSquare} />
                            )
                          ): [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) ? (
                            !partDForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setEnablePartB(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                            )
                          ):null}
                        </>
                        )}
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center mt-6">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                        Date:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <input 
                            type="date" 
                            name="rep_date" 
                            value={partBdate}
                            onChange={ev => setPartBdate(ev.target.value)}
                            className="block w-full ppa-form"
                            max={today}
                          />
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <input
                              type="date"
                              name="last_date_filled"
                              id="last_date_filled"    
                              value={updatePartBdate}
                              onChange={ev => setUpdatePartBdate(ev.target.value)}
                              className="block w-full ppa-form-edit"
                              max={today}
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.date_of_filling ? formatDate(inspectionData?.form?.date_of_filling) : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Date of Last Repair */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Date of Last Repair:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <input
                            type="date"
                            name="last_date_filled"
                            id="last_date_filled"    
                            value={lastfilledDate}
                            onChange={ev => setLastFilledDate(ev.target.value)}
                            max={currentDate}
                            className="block w-full ppa-form"
                          />
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <input
                              type="date"
                              name="last_date_filled"
                              id="last_date_filled"    
                              value={updatelastfilledDate}
                              onChange={ev => setUpdateLastFilledDate(ev.target.value)}
                              max={currentDate}
                              className="block w-full ppa-form-edit"
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.date_of_filling ? (
                              inspectionData?.form?.date_of_last_repair ? formatDate(inspectionData?.form?.date_of_last_repair) : 'N/A'
                            ) : null  }
                          </div>
                        )
                      )}
                    </div>

                    {/* Nature of Last Repair */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Nature of Last Repair:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <textarea
                            id="nature_repair"
                            name="nature_repair"
                            rows={3}
                            value={natureRepair}
                            onChange={ev => setNatureRepair(ev.target.value)}
                            style={{ resize: "none" }}  
                            maxLength={255}
                            className="block w-full ppa-form"
                          />
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <input
                              id="nature_repair"
                              name="nature_repair"
                              value={updatenatureRepair}
                              onChange={ev => setUpdateNatureRepair(ev.target.value)}
                              style={{ resize: "none" }}  
                              placeholder={inspectionData?.form?.nature_of_last_repair}
                              className="block w-full ppa-form-edit"
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.date_of_filling ? (
                              inspectionData?.form?.nature_of_last_repair ? inspectionData?.form?.nature_of_last_repair : 'N/A'
                            ) : null}
                          </div>
                        )
                      )}
                    </div>

                    {/* Assign Personnel */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Assign Personnel:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <select 
                            name="rep_type_of_property" 
                            id="rep_type_of_property" 
                            autoComplete="rep_type_of_property"
                            value={pointPersonnel.pid}
                            onChange={ev => {
                              const selectedPid = parseInt(ev.target.value);
                              const selectedPersonnel = getPersonnel.find(staff => staff.personnel_id === selectedPid);

                              setPointPersonnel(selectedPersonnel ? { pid: selectedPersonnel.personnel_id, pname: selectedPersonnel.personnel_name } : { pid: '', pname: '' });
                            }}
                            className={`block w-full ${(!pointPersonnel.pid && inputErrors.personnel_id) ? "ppa-form-error":"ppa-form"}`}
                            >
                              <option value="" disabled>Select an option</option>
                              {getPersonnel.map((data)=>(
                                <option key={data.personnel_id} value={data.personnel_id}>
                                  {data.personnel_name}
                                </option>
                              ))}
                          </select>
                          {!pointPersonnel.pid && inputErrors.personnel_id && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <select 
                              name="rep_type_of_property" 
                              id="rep_type_of_property" 
                              autoComplete="rep_type_of_property"
                              value={updatepointPersonnel.pid}
                              onChange={ev => {
                                const selectedPid = parseInt(ev.target.value);
                                const selectedPersonnel = getPersonnel.find(staff => staff.personnel_id === selectedPid);

                                setUpdatePointPersonnel(
                                  selectedPersonnel 
                                    ? { pid: selectedPersonnel.personnel_id, pname: selectedPersonnel.personnel_name } 
                                    : { pid: '', pname: '' }
                                );
                              }}
                              className="block w-full ppa-form"
                            >
                              {/* Disabled option for current personnel */}
                              <option value="" disabled>
                                {inspectionData?.form?.personnel_name ? `${inspectionData.form.personnel_name} (current)`  : "Select Personnel"} 
                              </option>

                              {/* Filter out current personnel */}
                              {getPersonnel
                                .filter(data => data.personnel_id !== inspectionData?.form?.personnel_id) // Remove current personnel
                                .map(data => (
                                  <option key={data.personnel_id} value={data.personnel_id}>
                                    {data.personnel_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.personnel_name}
                          </div>
                        )
                      )}
                    </div>

                    {/* Requested By */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Requested By:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            value={inspectionData?.gso_name}
                            className="block w-full ppa-form-edit"
                            disabled
                          />
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={inspectionData?.gso_name}
                              className="block w-full ppa-form-edit"
                              disabled
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view font-bold ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.date_of_filling ? inspectionData?.gso_name : null}
                          </div>
                        )
                      )}
                    </div>

                    {/* Noted By */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Noted By:
                        </label> 
                      </div>
                      {partBForm ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            value={inspectionData?.admin_name}
                            className="block w-full ppa-form-edit"
                            disabled
                          />
                        </div>
                      ):(
                        !enablePartB && (GSO || SuperAdmin) ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={inspectionData?.admin_name}
                              className="block w-full ppa-form-edit"
                              disabled
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view font-bold ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.date_of_filling ? inspectionData?.admin_name : null}
                          </div>
                        )
                      )}
                    </div>

                  </div>

                  {/* Part C */}
                  <div className="pb-6 border-b border-gray-300">

                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job </h2>
                      <div>
                        {/* For the SuperAdmin and assign */}
                        {SuperAdmin && currentUserId == 1 && inspectionData?.form?.personnel_id == currentUserId && inspectionData?.form?.form_status == 4 ? (
                            !partCForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-form ml-3 self-center" title="Enable Form" icon={faPenToSquare} />
                          )
                        ):SuperAdmin && currentUserId == 1 && inspectionData?.form?.personnel_id == currentUserId ? (
                          !partDForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                            <FontAwesomeIcon onClick={() => { setEnablePartC(false); }} className="icon-form ml-3 self-center" title="Edit Part C" icon={faPenToSquare} />
                          )
                        ):null}

                        {/* For the GSO */}
                        {GSO && (
                          [2, 3, 4, 5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && !partBForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                            <FontAwesomeIcon onClick={() => { setEnablePartC(false); }} className="icon-form ml-3 self-center" title="Edit Part C" icon={faPenToSquare} />
                          )
                        )}

                        {/* For the Assign Personnel */}
                        {(inspectionData?.form?.personnel_id == currentUserId) && !SuperAdmin && !GSO && (
                          inspectionData?.form?.form_status == 4 ? (
                            !partCForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-form ml-3 self-center" title="Enable Form" icon={faPenToSquare} />
                            )
                          ):[2, 3].includes(inspectionData?.form?.form_status) && !partBForm && !partCForm && !partDForm && enablePartA && enablePartB && enablePartC && enablePartD ? (
                            <FontAwesomeIcon onClick={() => { setEnablePartC(false); }} className="icon-form ml-3 self-center" title="Edit Part C" icon={faPenToSquare} />
                          ):null
                        )}
                      </div>
                    </div>

                    {/* Date Inspected */}
                    <div className="flex items-center mt-6">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                        </label> 
                      </div>
                      {partCForm ? (
                        <div className="w-1/2">
                          <input
                            type="date"
                            name="date_filled"
                            id="date_filled"
                            className={`block w-full ${(!partCDate && inputErrors.before_repair_date) ? "ppa-form-error":"ppa-form"}`}
                            value={partCDate}
                            onChange={ev => setPartCDate(ev.target.value)}
                            max={today}
                          />
                          {!partCDate && inputErrors.before_repair_date && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartC && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              type="date"
                              name="date_filled"
                              id="date_filled"
                              className={`block w-full ${(!partCDate && inputErrors.before_repair_date) ? "ppa-form-error":"ppa-form"}`}
                              value= {partCDate}
                              onChange={ev => setPartCDate(ev.target.value)}
                              max={today}
                            />
                            {!partCDate && inputErrors.before_repair_date && (
                              <p className="form-validation">This form is required</p>
                            )}
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.before_repair_date ? formatDate(inspectionData?.form?.before_repair_date) : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Assigned Personnel */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Assigned Personnel:
                        </label> 
                      </div>
                      {partCForm ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            value={inspectionData?.form?.personnel_name}
                            className="block w-full ppa-form-edit"
                            disabled
                          />
                        </div>
                      ):(
                        !enablePartC && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={inspectionData?.form?.personnel_name}
                              className="block w-full ppa-form-edit"
                              disabled
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view font-bold ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.before_repair_date ? inspectionData?.form?.personnel_name : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Findings */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Findings:
                        </label> 
                      </div>
                      {partCForm ? (
                        <div className="w-1/2">
                          <textarea
                            id="findings"
                            name="findings"
                            rows={2}
                            style={{ resize: "none" }}
                            value= {findings}
                            onChange={ev => setFindings(ev.target.value)}
                            className={`block w-full ${(!findings && inputErrors.findings) ? "ppa-form-error":"ppa-form"}`}
                            maxLength={500}
                          />
                          {!findings && inputErrors.findings && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartC && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              id="findings"
                              name="findings"
                              value= {updatefindings}
                              onChange={ev => setUpdateFindings(ev.target.value)}
                              className="block w-full ppa-form-edit"
                              maxLength={500}
                            />
                            {!updatefindings && inputErrors.findings && (
                              <p className="form-validation">This form is required</p>
                            )}
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.findings ? inspectionData?.form?.findings : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Recomendations */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Recomendations:
                        </label> 
                      </div>
                      {partCForm ? (
                        <div className="w-1/2">
                          <textarea
                            id="recomendations"
                            name="recomendations"
                            rows={2}
                            style={{ resize: "none" }}
                            value={recommendations}
                            maxLength={500}
                            onChange={ev => setRecommendations(ev.target.value)}
                            className={`block w-full ${(!recommendations && inputErrors.recommendations) ? "ppa-form-error":"ppa-form"}`}
                          />
                          {!recommendations && inputErrors.recommendations && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartC && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              id="recomendations"
                              name="recomendations"
                              value= {updaterecommendations}
                              onChange={ev => setUpdateRecommendations(ev.target.value)}
                              className="block w-full ppa-form-edit"
                              maxLength={500}
                            />
                            {!updaterecommendations && inputErrors.recommendations && (
                              <p className="form-validation">This form is required</p>
                            )}
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.recommendations ? inspectionData?.form?.recommendations : null }
                          </div>
                        )
                      )}
                    </div>

                  </div>

                  {/* Part D */}
                  <div className="pb-6">

                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job. </h2>
                      <div>
                        {/* For the SuperAdmin */}
                        {SuperAdmin && currentUserId == 1 && inspectionData?.form?.personnel_id == currentUserId && inspectionData?.form?.form_status == 3 ? (
                            !partDForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-form ml-3 self-center" title="Enable Form" icon={faPenToSquare} />
                          )
                        ):SuperAdmin && currentUserId == 1 && inspectionData?.form?.personnel_id == currentUserId ? (
                          !partCForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                            <FontAwesomeIcon onClick={() => { setEnablePartD(false); }} className="icon-form ml-3 self-center" title="Edit Part D" icon={faPenToSquare} />
                          )
                        ):null}

                        {/* Assign Personnel */}
                        {(inspectionData?.form?.personnel_id == currentUserId) && !SuperAdmin && !GSO && (
                          inspectionData?.form?.form_status == 3 ? (
                            !partDForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                              <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-form ml-3 self-center" title="Enable Form" icon={faPenToSquare} />
                            )
                          ):inspectionData?.form?.form_status == 2 && !partBForm && !partCForm && enablePartA && enablePartB && enablePartC && enablePartD ? (
                            <FontAwesomeIcon onClick={() => { setEnablePartD(false); }} className="icon-form ml-3 self-center" title="Edit Part D" icon={faPenToSquare} />
                          ):null
                        )}

                        {/* For the GSO */}
                        {GSO && (
                          [2, 3, 4, 5, 6, 8, 9, 10, 11].includes(inspectionData?.form?.form_status) && !partBForm && !partCForm && enablePartA && enablePartB && enablePartC && enablePartD && (
                            <FontAwesomeIcon onClick={() => { setEnablePartD(false); }} className="icon-form ml-3 self-center" title="Edit Part D" icon={faPenToSquare} />
                          )
                        )}
                      </div>
                    </div>

                    {/* Date Inspected */}
                    <div className="flex items-center mt-6">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                        </label> 
                      </div>
                      {partDForm ? (
                        <div className="w-1/2">
                          <input
                            type="date"
                            name="date_filled"
                            id="date_filled"
                            className={`block w-full ${(!partDDate && inputErrors.after_reapir_date) ? "ppa-form-error":"ppa-form"}`}
                            value= {partDDate}
                            onChange={ev => setPartDDate(ev.target.value)}
                            max={today}
                          />
                          {!partDDate && inputErrors.after_reapir_date && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartD && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              type="date"
                              name="date_filled"
                              id="date_filled"
                              className={`block w-full ${(!partDDate && inputErrors.after_reapir_date) ? "ppa-form-error":"ppa-form"}`}
                              value= {partDDate}
                              onChange={ev => setPartDDate(ev.target.value)}
                              max={today}
                            />
                            {!partDDate && inputErrors.after_reapir_date && (
                              <p className="form-validation">This form is required</p>
                            )}
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.after_reapir_date ? formatDate(inspectionData?.form?.after_reapir_date) : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Assigned Personnel */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Assigned Personnel:
                        </label> 
                      </div>
                      {partDForm ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            value={inspectionData?.form?.personnel_name}
                            className="block w-full ppa-form-edit"
                            disabled
                          />
                        </div>
                      ):(
                        !enablePartD && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={inspectionData?.form?.personnel_name}
                              className="block w-full ppa-form-edit"
                              disabled
                            />
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view font-bold ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.after_reapir_date ? inspectionData?.form?.personnel_name : null }
                          </div>
                        )
                      )}
                    </div>

                    {/* Remarks */}
                    <div className="flex items-center mt-2">
                      <div className="w-44">
                        <label className="block text-base font-bold leading-6 text-gray-900">
                          Remarks:
                        </label> 
                      </div>
                      {partDForm ? (
                        <div className="w-1/2">
                          <textarea
                            id="remarks"
                            name="remarks"
                            rows={3}
                            style={{ resize: "none" }}
                            value= {remarks}
                            maxLength={500}
                            onChange={ev => setRemarks(ev.target.value)}
                            className={`block w-full ${(!remarks && inputErrors.remarks) ? "ppa-form-error":"ppa-form"}`}
                          />
                          {!remarks && inputErrors.remarks && (
                            <p className="form-validation">This form is required</p>
                          )}
                        </div>
                      ):(
                        !enablePartD && (GSO || SuperAdmin || inspectionData?.form?.personnel_id == currentUserId) ? (
                          <div className="w-1/2">
                            <input
                              id="remarks"
                              name="remarks"
                              value={updateremarks}
                              onChange={ev => setUpdateRemarks(ev.target.value)}
                              className={`block w-full ${(!partDDate && inspectionData?.form?.remarks) ? "ppa-form-error":"ppa-form"}`}
                              maxLength={500}
                            />
                            {!updateremarks && inputErrors.remarks && (
                              <p className="form-validation">This form is required</p>
                            )}
                          </div>
                        ):(
                          <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                            {!loading && inspectionData?.form?.remarks ? inspectionData?.form?.remarks : null }
                          </div>
                        )
                      )}
                    </div>

                  </div>

                </>
                )
              )}
            </div>

            {/* Activities */}
            {enablePartA && enablePartB && enablePartC && enablePartD && !enableSupDecline && !loadingPDF && (
            <>
              <div className="ppa-form-header text-base flex justify-between items-center">
                <span className="text-md">Activities</span>
              </div>

              <div
                className="pl-4 pt-6 pb-6 pr-4 ppa-form-box bg-white mb-6"
                style={{
                  minHeight: "auto",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {/* Add padding INSIDE a wrapper to separate data from the border */}
                <table className="w-full border-collapse">
                  <tbody className="relative border-l-2 border-gray-300 ml-4">
                    {trackingForm.length > 0 ? (
                      trackingForm.map((list) => (
                        <tr key={list.id} className="flex items-start relative">
                          {/* Dot */}
                          <td className="w-4 flex justify-center items-start pt-3 relative -left-2">
                            <span className="w-3 h-3 bg-gray-300 rounded-full z-10"></span>
                          </td>

                          {/* Timeline content */}
                          <td className="py-2 text-sm font-bold pl-2">{list.date}</td>
                          <td className="py-2 text-sm font-bold pl-2">{list.time}</td>
                          <td className="py-2 pl-3 text-sm">{list.remarks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <span className="py-2 text-sm">No Activities Yet</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
            )}

            {/* Popup */}
            {showPopup && (
              <Popup 
                popupContent={popupContent}
                popupMessage={popupMessage}
                SubmitSupReason={SubmitSupReason}
                handlelSupervisorApproval={handlelSupervisorApproval}
                handlelAdminApproval={handlelAdminApproval}
                CloseForceRequest={CloseForceRequest}
                inspectionData={inspectionData?.form?.id}
                justClose={justClose}
                closePopup={closePopup}
                submitLoading={submitLoading}
                submitAnimation={submitAnimation}
                form={SubmitPartB}
              />
            )}

          </>
          ):<Restrict />
        )
      ):null}

      {/* PDF Area */}
      {isVisible && (
      <div>
          <div className="hidden md:none">
          {/* <div className="visible md:block"> */}
            <div ref={componentRef}>
              <div className="relative" style={{ width: '210mm', height: '297mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

                {/* Control Number */}
                <div className="title-area font-arial pr-6 text-right pb-2 pt-2">
                  <span>Control No:</span>{" "}
                  <span style={{ textDecoration: "underline", fontWeight: "900" }}>    
                  ___{inspectionData?.form?.id}___
                  </span>
                </div>

                <table className="w-full border-collapse border border-black">
                  <tbody>

                    {/* Title and Logo */}
                    <td className="border border-black p-1 text-center" style={{ width: '100px' }}>
                      <img src={ppa_logo} alt="My Image" className="mx-auto" style={{ width: 'auto', height: '65px' }} />
                    </td>
                    <td className="border w-7/12 border-black font-arial text-center">
                      <div className="text-[18px]">PRE-REPAIR/POST REPAIR INSPECTION FORM</div>
                      <div className="text-[15px]">PMO - LANAO DEL NORTE/ILIGAN</div>
                    </td>
                    <td className="border border-black p-0 font-arial">
                      <div className="text-xs border-black pl-1">Form No.: PM:VEC:LNI:WEN:FM:03</div>
                      <div className="text-xs border-black pl-1 pt-1">Revision No.: 00</div>
                      {/* <div className="text-xs p-1 text-white">Date of Effectivity: March 26, 2021</div> */}
                    </td>

                    {/* Blank */}
                    <tr> <td colSpan={3} className="border border-black p-1 font-arial"></td> </tr>

                    {/* Part A Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 pt-0 font-arial bg-[#CECECE]">
                        <h3 className="text-sm font-normal">PART A: To be filled-up by Requesting Party</h3>
                      </td>
                    </tr>

                    {/* Part A Details */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                        {/* Date Requested */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-28 text-pdf">
                              <span>Date</span>
                            </div>
                            <div className="w-64 border-b border-black pl-1 text-pdf">
                              <span>{formatDate(inspectionData?.form?.date_request)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Part A (Sides) */}
                        <div className="grid grid-cols-2 gap-6">

                          {/* Part A Left */}
                          <div className="col-span-1">

                            {/* Property Number */}
                            <div className="mt-4">
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Property No</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.property_number ? inspectionData?.form?.property_number : 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Acquisition Date */}
                            <div>
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Acquisition Date</span>
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.acquisition_date ? formatDate(inspectionData?.form?.acquisition_date) : 'N/A'}</span>
                                </div> 
                              </div>
                            </div>

                            {/* Acquisition Cost */}
                            <div>
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Acquisition Cost</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.acquisition_cost ? `₱${inspectionData?.form?.acquisition_cost}` : 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Brand/Model */}
                            <div>
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Brand/Model</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.brand_model ? inspectionData?.form?.brand_model : 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Serial/Engine No. */}
                            <div>
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Serial/Engine No.</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.serial_engine_no ? inspectionData?.form?.serial_engine_no : 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Part A Right */}
                          <div className="col-span-1">

                            {/* Type of Property */}
                            <div className="mt-4">
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Type of Property</span> 
                                </div>
                                <div className="w-68">
                                  {/* Vehicle */}
                                  <div className="flex items-center text-pdf">
                                    <div className="w-8 h-5 border border-black mr-2 border-b-0 flex items-center justify-center text-black font-bold">{inspectionData?.form?.type_of_property === 'Vehicle Supplies & Materials' ? "X":null}</div>
                                    <span>Vehicle Supplies & Materials</span>
                                  </div>
                                  {/* IT */}
                                  <div className="flex items-center text-pdf">
                                  <div className="w-8 h-5 border border-black mr-2 flex items-center justify-center text-black font-bold">{inspectionData?.form?.type_of_property === 'IT Equipment & Related Materials' ? "X":null}</div>
                                    <span>IT Equipment & Related Materials</span>
                                  </div>
                                  {/* Other */}
                                  <div className="flex items-center text-pdf">
                                    <div className="w-8 h-5 border border-black mr-2 border-t-0 flex items-center justify-center text-black font-bold">{inspectionData?.form?.type_of_property === 'Others' ? "X":null}</div>
                                    <div>
                                      <span  className="mr-1 text-pdf">Others:</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <div className="flex">
                                <div className="w-28 text-pdf">
                                  <span>Description</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-1 text-pdf">
                                  <span>{inspectionData?.form?.property_description}</span>
                                </div>
                              </div>
                            </div>

                            {/* Location */}
                            <div>
                              <div className="flex">
                                <div className="w-56 text-pdf">
                                  <span>Location (Div/Section/Unit)</span> 
                                </div>
                                <div className="w-64 border-b border-black pl-2 text-pdf">
                                  <span>{inspectionData?.form?.location}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* Complain */}
                        <div>
                          <div className="flex">
                            <div className="w-32 text-pdf">
                              <span>Complain/Defect</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-pdf">
                              <span>{inspectionData?.form?.complain}</span>
                            </div>
                          </div>
                        </div>

                        {/* For Signature */}
                        <div className="mt-2">
                          <div className="grid grid-cols-2 gap-4">

                            {/* For Requestor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> REQUESTED BY:</label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  <img 
                                    src={inspectionData?.requestor_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                  <span className="text-pdf font-bold uppercase">{inspectionData?.form?.user_name}</span>
                                </div>
                                <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> End-User </label>
                              </div>
                            </div>

                            {/* For Supervisor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: <b>{inspectionData?.form?.form_status == 7 && ('DISAPPROVED')}</b> </label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  {[1, 2, 3, 4, 5, 6].includes(inspectionData?.form?.form_status) && (
                                  <>
                                    <img 
                                      src={inspectionData?.supervisor_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />

                                    <span className="text-pdf font-bold uppercase">{inspectionData?.form?.supervisor_name}</span>
                                  </>
                                  )}
                                </div>
                                <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> Immediate Supervisor</label>
                              </div>
                            </div>

                          </div>
                        </div>

                      </td>
                    </tr>
                    {/* End of Part A Details */}

                    {/* Part B Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 font-arial bg-[#CECECE]">
                      <h3 className="text-sm font-normal">PART B: To be filled-up by Administrative Division</h3>
                      </td>
                    </tr>

                    {/* Part B Forms */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                        {/* Date */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-28 text-pdf">
                              <span>Date</span> 
                            </div>
                            <div className="w-64 border-b border-black pl-1 text-pdf">
                              <span>{inspectionData?.form?.date_of_filling ? (formatDate(inspectionData?.form?.date_of_filling)):null}</span>
                            </div>
                          </div>
                        </div>

                        {/* Date of Last Repair */}
                        <div>
                          <div className="flex">
                            <div className="w-36 text-pdf">
                              <span>Date of Last Repair</span> 
                            </div>
                            <div className="w-64 border-b border-black pl-1 text-pdf">
                              <span>
                              {inspectionData?.form?.date_of_filling ? (
                              inspectionData?.form?.date_of_last_repair ? formatDate(inspectionData?.form?.date_of_last_repair) : 'N/A'
                              ) : null }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Nature of Repair */}
                        <div>
                          <div className="flex">
                            <div className="w-44 text-pdf">
                              <span>Nature of Last Repair</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-pdf">
                              <span>
                                {inspectionData?.form?.date_of_filling ? (
                                inspectionData?.form?.nature_of_last_repair ? inspectionData?.form?.nature_of_last_repair : 'N/A'
                                ) : null }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* For Signature */}
                        <div className="mt-3">
                          <div className="grid grid-cols-2 gap-4">

                            {/* For Requestor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> REQUESTED BY:</label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  {[1, 2, 3, 4, 5, 6, 11].includes(inspectionData?.form?.form_status) && (
                                  <>
                                    <img 
                                      src={inspectionData?.gso_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
                                    <span className="text-pdf font-bold uppercase">{inspectionData?.gso_name}</span>
                                  </>
                                  )}
                                </div>
                                <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> General Service Officer </label>
                              </div>
                            </div>

                            {/* For Supervisor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  {[1, 2, 3, 4].includes(inspectionData?.form?.form_status) && (
                                  <>
                                    <img 
                                      src={inspectionData?.admin_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />

                                    <span className="text-pdf font-bold uppercase">{inspectionData?.admin_name}</span>
                                  </>
                                  )}
                                </div>
                                <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Acting Admin Division Manager </label>
                              </div>
                            </div>

                          </div>
                        </div>
                        
                      </td>
                    </tr>
                    {/* End of Part B Forms */}

                    {/* Part C Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 font-arial bg-[#CECECE]">
                      <h3 className="text-sm font-normal">PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.</h3>
                      </td>
                    </tr>

                    {/* Part C Form */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                        {/* Finding */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 text-pdf">
                              <span>Finding/s</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-pdf">
                              <span>{inspectionData?.form?.findings}</span>
                            </div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <div className="flex">
                            <div className="w-44 text-pdf">
                              <span>Recommendation/s</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-pdf">
                              <span>{inspectionData?.form?.recommendations}</span>
                            </div>
                          </div>
                        </div>

                        {/* For Signature */}
                        <div className="mt-4">
                          <div className="grid grid-cols-2 gap-4">

                            {/* Date */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> DATE INSPECTED:</label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  <span className="text-base">{[1, 2, 3, 4, 6, 11].includes(inspectionData?.form?.form_status) && inspectionData?.form?.before_repair_date &&
                                  formatDate(inspectionData?.form?.before_repair_date)}</span>
                                </div>
                              </div>
                            </div>

                            {/* For Property Inspector Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> ACCOMPLISHED BY: </label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  {[1, 2, 3, 4].includes(inspectionData?.form?.form_status) && (
                                  <>
                                    <img 
                                      src={inspectionData?.assign_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />

                                    <span className="text-pdf font-bold uppercase">{inspectionData?.form?.personnel_name}</span>
                                  </>
                                  )}
                                </div>
                                <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Property Inspector </label>
                              </div>
                            </div>

                          </div>
                        </div>

                      </td>
                    </tr>
                    {/* End of Part C Forms */}

                    {/* Part D Label */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 font-arial bg-[#CECECE]">
                      <h3 className="text-sm font-normal">PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.</h3>
                      </td>
                    </tr>

                    {/* Part D Form */}
                    <tr>
                      <td colSpan={3} className="border border-black pl-1 pr-2 pb-4 font-arial">

                        {/* Remarks */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 text-pdf">
                              <span>Remarks</span>
                            </div>
                            <div className="w-full border-b border-black pl-1 text-pdf">
                              <span>{inspectionData?.form?.remarks}</span>
                            </div>
                          </div>
                        </div>

                        {/* For Signature */}
                        <div className="mt-4">
                          <div className="grid grid-cols-2 gap-4">

                            {/* For Requestor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> DATE INSPECTED:</label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  <span className="text-base">{[1, 2, 6, 4, 11].includes(inspectionData?.form?.form_status) && inspectionData?.form?.after_reapir_date &&
                                  formatDate(inspectionData?.form?.after_reapir_date)}</span>
                                </div>
                              </div>
                            </div>

                            {/* For Supervisor Signature */}
                            <div className="col-span-1">
                              <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> ACCOMPLISHED BY: </label>
                              <div className="mt-3">
                                <div className="w-64 mx-auto border-b text-center border-black pl-1 h-5" style={{ position: 'relative' }}>
                                  {[1, 2, 4].includes(inspectionData?.form?.form_status) && (
                                  <>
                                    <img 
                                      src={inspectionData?.assign_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />

                                    <span className="text-pdf font-bold uppercase">{inspectionData?.form?.personnel_name}</span>
                                  </>
                                  )}
                                </div>
                                <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Property Inspector </label>
                              </div>
                            </div>

                          </div>
                        </div>

                      </td>
                    </tr>
                    {/* End of Part D Forms */}

                  </tbody>
                </table>

                <span className="system-generated">Job Order Management System - This is system-generated.</span>

              </div>
            </div>
          </div>
      </div>
      )}

    </PageComponent>
  );
}