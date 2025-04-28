import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import loading_table from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import ppa_logo from '/default/ppa_logo.png'
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";
import Restrict from "../../../components/Restrict";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCircleXmark, faFilePdf, faLock } from '@fortawesome/free-solid-svg-icons';

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
  const [loading, setLoading] = useState(false);

  // Set Access
  const [dataAccess, setDataAccess] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [enableSupDecline, setEnableSupDecline] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [enableDelete, setEnableDelete] = useState(false);

  const [inspectionData, setInspectionData] = useState([]);
  const [enablePartA, setEnablePartA] = useState(true);
  const [enablePartB, setEnablePartB] = useState(true);
  const [enablePartC, setEnablePartC] = useState(true);
  const [enablePartCButton, setEnablePartCButton] = useState(false);
  const [enablePartD, setEnablePartD] = useState(true);
  const [enablePartDButton, setEnablePartDButton] = useState(false);

  const [getPersonnel, setGetPersonnel] = useState([]);
  const [inputErrors, setInputErrors] = useState({});

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
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState({ pid: '', pname: '' });

  // --- Update Part B --- //
  const [updatelastfilledDate, setUpdateLastFilledDate] = useState(inspectionData?.form?.date_of_last_repair ?? "");
  const [updatenatureRepair, setUpdateNatureRepair] = useState(inspectionData?.form?.nature_of_last_repair ?? "");
  const [updatepointPersonnel, setUpdatePointPersonnel] = useState({ pid: '', pname: '' });

  // --- Part C --- //
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // --- Update Part C --- //
  const [updatefindings, setUpdateFindings] = useState('');
  const [updaterecommendations, setUpdateRecommendations] = useState('');

  // --- Part D --- //
  const [remarks, setRemarks] = useState('');

  // --- Update Part D --- //
  const [updateremarks, setUpdateRemarks] = useState('');

  // --- Reason for disapproval --- //
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  // Update state when inspectionData updates
  useEffect(() => {
    setUpdatePropertyNo(inspectionData?.form?.property_number ?? "");
    setUpdateAcquisitionDate(inspectionData?.form?.acquisition_date ?? "");
    setUpdateAcquisitionCost(inspectionData?.form?.acquisition_cost ?? "");
    setUpdateBrandModel(inspectionData?.form?.brand_model ?? "");
    setUpdateSerialEngineNo(inspectionData?.form?.serial_engine_no ?? "");
    setUpdateLastFilledDate(inspectionData?.form?.date_of_last_repair ?? "");
    setUpdateNatureRepair(inspectionData?.form?.nature_of_last_repair ?? "");
  }, [
    inspectionData?.form?.property_number,
    inspectionData?.form?.acquisition_date,
    inspectionData?.form?.acquisition_cost,
    inspectionData?.form?.brand_model,
    inspectionData?.form?.serial_engine_no,
    inspectionData?.form?.date_of_last_repair,
    inspectionData?.form?.nature_of_last_repair
  ]);

  // For the Part C Update
  useEffect(() => {
    const hasFilledFieldsC = [
      updatefindings, 
      updaterecommendations, 
    ].some(value => value?.trim() !== "");
  
    // Show button if at least one field has a value
    setEnablePartCButton(!hasFilledFieldsC);
  }, [
    updatefindings, 
    updaterecommendations, 
  ]);

  // For the Part D Update
  useEffect(() => {
    const hasFilledFieldsD = [
      updateremarks, 
    ].some(value => value?.trim() !== "");
  
    // Show button if at least one field has a value
    setEnablePartDButton(!hasFilledFieldsD);
  }, [
    updateremarks,
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

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

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

      // const myAccess = form?.user_id == currentUserId || accessOnly ? "Access" : "Denied";
      // setAccess(myAccess);
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

  useEffect(() => { 
    if(currentUserId){
      fecthInspection();
      fetchDisplayPersonnel();
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
    .then(() => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form has been approved</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch(() => {
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Supervisor Decline Popup 
  const handleSupDeclineConfirmation = () => {
    setShowPopup(true);
    setPopupContent('dmd');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to disapprove {inspectionData?.form?.user_name}'s request? It cannot be undone.</p>
      </div>
    );
  }

  // Submit Supervisor Reason
  function SubmitSupReason(id){
    setSubmitLoading(true);

    if ((reason === 'Others' && !otherReason) || !reason) {
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Invalid</p>
          <p className="popup-message">Please input the reason of your disapproval</p>
        </div>
      );
      setSubmitLoading(false);
    } else {
      axiosClient
      .put(`/supinsprequestdisapprove/${id}`, {
        reason:reason,
        otherReason:otherReason,
      })
      .then(() => {
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success!</p>
            <p className="popup-message">The form has been disapproved</p>
          </div>
        );
        setShowPopup(true);
      })
      .catch(() => {
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);   
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
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
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form has been approved</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch(() => {
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Part A
  function UpdatePartA(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const dataA = {
      user_name: currentUserName.name,
      property_number: updatepropertyNo,
      acquisition_date: updateacquisitionDate,
      acquisition_cost: updateacquisitionCost,
      brand_model: updateBrandModel,
      serial_engine_no: updateSerialEngineNo,
      type_of_property: updateTypeofProperty ? updateTypeofProperty : inspectionData?.form?.type_of_property,
      property_description: updateDescription ? updateDescription : inspectionData?.form?.property_description,
      location: updateLocation ? updateLocation : inspectionData?.form?.location,
      complain: updateComplain ? updateComplain : inspectionData?.form?.complain,
      code: ucode,
    }

    axiosClient
    .put(`/updateinsprequestparta/${id}`, dataA)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
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
      } else if(error.response.status === 408){
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form is no longer editable.</p>
          </div>
        );
      }
      else {
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true); 
      }
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
  function SubmitPartB(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      gsoId: currentUserId,
      date_of_filling: today,
      date_of_last_repair: lastfilledDate,
      nature_of_last_repair: natureRepair,
      personnel_id: pointPersonnel.pid,
      personnel_name: pointPersonnel.pname, 
      admin_status: inspectionData?.form?.status === '1005' ? 1 : 2,   
      inspector_status: inspectionData?.form?.status === '1005' ? 3 : 0,
    }

    axiosClient
    .put(`/submitinsprequestpartb/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Submission Complete!</p>
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

  // Update Part B
  function UpdatePartB(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const dataB = {
      user_name: currentUserName.name,
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
          <p className="popup-title">Success!</p>
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

  // Submit Part C Form
  function SubmitPartC(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      before_repair_date: today,
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
          <p className="popup-title">Submission Complete!</p>
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
  function UpdatePartC(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const dataC = {
      user_name: currentUserName.name,
      findings : updatefindings ? updatefindings : inspectionData?.form?.findings,
      recommendations: updaterecommendations ? updaterecommendations : inspectionData?.form?.recommendations,
      today: inspectionData?.form?.before_repair_date ? inspectionData?.form?.before_repair_date : today,
    }

    axiosClient
    .put(`/updateinsprequestpartc/${id}`, dataC)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
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
  function SubmitPartD(event, id){
    event.preventDefault();

    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      after_reapir_date: today,
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
          <p className="popup-title">Submission Complete!</p>
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

  // Update Part D
  function UpdatePartD(event, id){
    event.preventDefault();
    setSubmitLoading(true);

    const dataD = {
      user_name: currentUserName.name,
      remarks : updateremarks ? updateremarks : inspectionData?.form?.remarks,
    }

    axiosClient
    .put(`/updateinsprequestpartd/${id}`, dataD)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
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

  // Close Request Popup 
  const handleCloseRequest = () => {
    setShowPopup(true);
    setPopupContent('gsocr');
    setPopupMessage(
      <div>
        <p className="popup-title">This request is done?</p>
        <p className="popup-message">Once you close it, you will not be able to edit it.</p>
      </div>
    );
  }

  // Close Request Function
  function handleCloseFormRequest(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/closeinspectionrequest/${id}`, {
      user_name:currentUserName.name
    })
    .then(() => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form has been closed.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch(() => {
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
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
    .put(`/closeinspectionforce/${id}`, {
      user_name:currentUserName.name,
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to cancel this form? It cannot be restore.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch(() => {
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    setEnablePartA(true);
    setEnablePartB(true);
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
    setLoading(true);
    setTimeout(() => {
      generatePDF();
      setLoading(false);
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
        clearance ? (
          <>
          {/* Form */}
          <div className="font-roboto">

            {/* Header */}
            <div className="ppa-form-header text-base flex justify-between items-center">
              <span>Control No: <span className="px-2 ppa-form-view">{inspectionData?.form?.id}</span></span>
              <div className="flex space-x-4"> 
                {/* Delete Request */}
                {GSO && inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 && inspectionData?.form?.form_status != 2 && (
                  <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-delete" title="Cancel Request" icon={faCircleXmark} />
                )}
                {/* Closed Form */}
                {inspectionData?.form?.form_status == 2 && GSO && (
                  <FontAwesomeIcon onClick={() => handleCloseRequest()} className="icon-delete" title="Close request" icon={faLock} />
                )}
                {/* Generate PDF */}
                {GSO && inspectionData?.form?.form_status != 3 && (
                  <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                )}
                {/* For the Requestor */}
                {inspectionData?.form?.form_status == 1 &&  currentUserId == inspectionData?.form?.user_id && !GSO && SuperAdmin && (
                  <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                )}
              </div>
            </div>

            {/* Form */}
            <div className="pl-4 pt-6 pb-6 pr-4 ppa-form-box bg-white mb-6">

              {loading ? (
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
                        <select 
                          name="supervisor_reason" 
                          id="supervisor_reason" 
                          autoComplete="supervisor_reason"
                          value={reason}
                          onChange={ev => {
                            setReason(ev.target.value);
                          }}
                          className="block w-full ppa-form"
                        >
                          <option value="" disabled>Select a reason</option>
                          <option value="Wrong Supervisor">Wrong Supervisor</option>
                          <option value="Lack of Information">Lack of Information</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      {reason === 'Others' && (
                        <div className="mt-3">
                          <div className="w-full">
                            <input
                              type="text"
                              name="reason"
                              id="reason"
                              value={otherReason}
                              onChange={ev => setOtherReason(ev.target.value)}
                              placeholder="Input your reasons"
                              className="block w-full ppa-form"
                            />
                          </div>
                        </div>
                      )}
                    </form>
                    {/* Button */}
                    <div className="mt-5">
                      {/* Enable Reason */}
                      <button onClick={() => handleSupDeclineConfirmation()} className="py-2 px-4 btn-default-form"> Submit </button>
                      <button onClick={() => { setEnableSupDecline(false); setReason(''); }} className="ml-2 py-2 px-4 btn-cancel-form"> Cancel </button>
                    </div>
                  </>
                  ):(
                  <>
                    {/* Status */}
                    <div className="status-sec mb-4">
                      <strong>Status: </strong> {inspectionData?.form?.form_remarks}
                    </div>
    
                    {/* Part A */}
                    <div className={`${inspectionData?.form?.sup_status == 1 && (inspectionData?.form?.admin_status != 0 || GSO) ? "pb-6 border-b border-gray-300" : ""}`}>
                      {/* Caption */}
                      <div className="flex">
                        <h2 className="text-lg font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
                        <div className="self-center ml-3">
                          {/* Edit only for the GSO and requestor */}
                          {!loading && (SuperAdmin || GSO) && inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 && (
                            enablePartA && <FontAwesomeIcon onClick={() => { setEnablePartA(false); }} className="icon-form" title="Edit Part A" icon={faPenToSquare} />
                          )}
                        </div>
                      </div>
    
                      {/* For Edit Form */}
                      <form id="EditPartA" onSubmit={event => UpdatePartA(event, inspectionData?.form?.id)}>
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
                                <div className="w-1/2 ppa-form-view h-6">
                                  {!loading &&(formatDate(inspectionData?.form?.date_request))}
                                </div>
                              </div>
    
                              {/* Property No */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-2'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                {!loading && (
                                  enablePartA ? (
                                    inspectionData?.form?.property_number ? inspectionData?.form?.property_number : 'N/A'
                                  ):(
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
                                  )
                                )}
                                </div>
                              </div>
    
                              {/* Acquisition Date */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Date: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                  {!loading && (
                                    enablePartA ? (
                                      inspectionData?.form?.acquisition_date ? formatDate(inspectionData?.form?.acquisition_date) : 'N/A'
                                    ):(
                                      <input
                                        type="date"
                                        name="rep_acquisition_date"
                                        id="rep_acquisition_date"
                                        value={updateacquisitionDate}
                                        onChange={ev => setUpdateAcquisitionDate(ev.target.value)}
                                        max={currentDate}
                                        className="block w-full ppa-form-edit"
                                      />
                                    )
                                  )} 
                                </div>
                              </div>
    
                              {/* Acquisition Cost */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Cost: </label> 
                                </div>
                                  <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                  {!loading && (
                                    enablePartA ? (
                                      inspectionData?.form?.acquisition_cost 
                                      ? new Intl.NumberFormat('en-PH', {
                                          style: 'currency',
                                          currency: 'PHP'
                                        }).format(inspectionData?.form?.acquisition_cost) 
                                      : 'N/A'
                                    ):(
                                    <>
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
                                    </>
                                    )
                                  )}
                                  </div>
                              </div>
    
                              {/* Brand/Model */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Brand/Model: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                  {!loading && (
                                    enablePartA ? (
                                      inspectionData?.form?.brand_model ? inspectionData?.form?.brand_model : 'N/A'
                                    ):(
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
                                    )
                                  )}
                                </div>
                              </div>
    
                              {/* Serial/Engine No */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4 mb-3'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Serial/Engine No: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                  {!loading && (
                                    enablePartA ? (
                                      inspectionData?.form?.serial_engine_no ? inspectionData?.form?.serial_engine_no : 'N/A'
                                    ):(
                                      <input
                                        type="text"
                                        name="rep_serial_engine_no"
                                        id="rep_serial_engine_no"
                                        autoComplete="rep_serial_engine_no"
                                        defaultValue={inspectionData?.form?.serial_engine_no}
                                        onChange={ev => setUpdateSerialEngineNo(ev.target.value)}
                                        placeholder="Input Serial/Engine No"
                                        className="block w-full ppa-form-edit"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
    
                            </div>
                            {/* Part A right side */}
                            <div className="col-span-1">
    
                              {/* Type of Property */}
                              <div className={`flex items-center ${enablePartA ? 'mt-6' : 'mt-6'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Type of Property: </label> 
                                </div>
                                <div className={`w-1/2 ${enablePartA ? 'ppa-form-view h-6' : ''}`}>
                                  {!loading && (
                                    enablePartA ? (
                                      inspectionData?.form?.type_of_property
                                    ):(
                                      <select 
                                        name="rep_type_of_property" 
                                        id="rep_type_of_property" 
                                        autoComplete="rep_type_of_property"
                                        value={updateTypeofProperty}
                                        onChange={ev => setUpdateTypeofProperty(ev.target.value)}
                                        className="block w-full ppa-form-edit"
                                      >
                                        <option value="" disabled>{inspectionData?.form?.type_of_property}</option>
                                        {["Vehicle Supplies & Materials", "IT Equipment & Related Materials", "Others"]
                                          .filter(option => option !== inspectionData?.form?.type_of_property) // Remove existing option
                                          .map(option => (
                                            <option key={option} value={option}>{option}</option>
                                          ))}
                                      </select>
                                    )
                                  )}
                                </div>
                              </div>
    
                              {/* Description */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-1'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Description: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                {!loading && (
                                  enablePartA ? (
                                    inspectionData?.form?.property_description
                                  ):(
                                    <input
                                      type="text"
                                      name="rep_description"
                                      id="rep_description"
                                      defaultValue={inspectionData?.form?.property_description}
                                      onChange={ev => setUpdateDescription(ev.target.value)}
                                      placeholder="Enter Description"
                                      className="block w-full ppa-form-edit"
                                    />
                                  )
                                )}
                                </div>
                              </div>
    
                              {/* Location */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Location: </label> 
                                </div>
                                <div className={`w-1/2 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                                {!loading && (
                                  enablePartA ? (
                                    inspectionData?.form?.location
                                  ):(
                                    <input
                                      type="text"
                                      name="rep_location"
                                      id="rep_location"
                                      defaultValue={inspectionData?.form?.location}
                                      onChange={ev => setUpdateLocation(ev.target.value)}
                                      placeholder="Enter Location"
                                      className="block w-full ppa-form-edit"
                                    />
                                  )
                                )}
                                </div>
                              </div>
    
                              {/* Requestor */}
                              <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-4'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Requested By: </label> 
                                </div>
                                <div className="w-1/2 h-6 font-bold italic ppa-form-view">
                                  {!loading && inspectionData?.form?.user_name}
                                </div>
                              </div>
    
                              {/* Noted By */}
                              <div className="flex items-center mt-2">
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900"> Noted By: </label> 
                                </div>
                                <div className="w-1/2 h-6 font-bold italic ppa-form-view">
                                  {!loading && inspectionData?.form?.supervisor_name}
                                </div>
                              </div>
    
                            </div>
                          </div>
    
                          {/* Complain */}
                          <div className={`flex items-center ${enablePartA ? 'mt-2' : 'mt-2'}`}>
                            <div className="w-40">
                              <label className="block text-base font-bold leading-6 text-gray-900"> Complain/Defect: </label> 
                            </div>
                            <div className={`w-3/4 h-6 ${enablePartA ? 'ppa-form-view' : ''}`}>
                            {!loading && (
                              enablePartA ? (
                                inspectionData?.form?.complain
                              ):(
                                <input
                                  type="text"
                                  name="rep_property_no"
                                  id="rep_property_no"
                                  autoComplete="rep_property_no"
                                  defaultValue={inspectionData?.form?.complain}
                                  onChange={ev => setUpdateComplain(ev.target.value)}
                                  placeholder="Input Property Number" 
                                  className="block w-full ppa-form-edit"
                                />
                              )
                            )}
                            </div>
                          </div>
                      </form>
    
                      {/* Button */}
                      {/* For the Supervisor */}
                      {(DivisionManager && currentUserId == inspectionData?.form?.supervisor_id && inspectionData?.form?.sup_status == 0) && (
                        !enableSupDecline && (
                        <>
                          <div className="mt-8">
                            {/* Approve */}
                            <button onClick={() => handleSupApprovalConfirmation()} className="py-2 px-4 btn-default-form"> Approve </button>
                            {/* Decline */}
                            <button onClick={() => setEnableSupDecline(true)} className="ml-2 py-2 px-4 btn-cancel-form"> Decline </button>
                          </div>
                        </>
                        )
                      )}
    
                      {/* For the edit button */}
                      {!enablePartA && (
                        !buttonHide && (
                          <div className="mt-8">
                            {/* Submit */}
                            <button 
                              type="submit"
                              form="EditPartA"
                              className={`py-2 px-4 mr-2 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                                  setEnablePartA(true);
                                }} className="py-2 px-4 btn-cancel-form">
                                Cancel
                              </button>
                            )}
                          </div>
                        )
                      )}
                        
                    </div>
    
                    {/* Part B */}
                    {inspectionData?.form?.sup_status == 1 && (
                      <div className={`mt-4 ${inspectionData?.form?.admin_status == 1 ? 'pb-6 border-b border-gray-300' : ''}`}>
                        {/* Caption */}
                        {(inspectionData?.form?.admin_status != 0 || GSO) && (
                          <div className="flex">
                            <h2 className="text-lg font-bold leading-7 text-gray-900"> Part B: To be filled-up by Administrative Division </h2>
                            {(inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 && GSO) && (
                              (inspectionData?.form?.date_of_filling && enablePartA && enablePartB && enablePartC && enablePartD) &&
                                (<FontAwesomeIcon onClick={() => { setEnablePartB(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />)
                            )}
                          </div>
                        )}
    
                        {/* Form */}
                        {(inspectionData?.form?.form_status == 4 || inspectionData?.form?.form_status == 5)
                        && GSO && enablePartA ? (
                        <>
                          {/* GSO */}
                          <form id="partBForm" onSubmit={event => SubmitPartB(event, inspectionData?.form?.id)}>
                            {/* Date */}
                            <div className="flex items-center mt-6 ">
                              <div className="w-40">
                                <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black"> 
                                  Date: 
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <input 
                                  type="date" 
                                  name="rep_date" 
                                  id="rep_date" 
                                  defaultValue={today} 
                                  className="block w-full ppa-form"
                                  readOnly
                                />
                              </div>
                            </div>
    
                            {/* Date of Last Repair */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label htmlFor="rep_property_no" className="block text-base font-bold leading-6 text-black"> Date of Last Repair: </label> 
                              </div>
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
                            </div>
    
                            {/* Nature of Last Repair */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label htmlFor="rep_property_no" className="block text-base font-bold leading-6 text-black"> Nature of Last Repair: </label> 
                              </div>
                              <div className="w-1/2">
                                <textarea
                                  id="nature_repair"
                                  name="nature_repair"
                                  rows={3}
                                  value={natureRepair}
                                  onChange={ev => setNatureRepair(ev.target.value)}
                                  style={{ resize: "none" }}  
                                  className="block w-full ppa-form"
                                />
                              </div>
                            </div>
    
                            {/* Assign Personnel */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
                                  Assign Personnel:
                                </label> 
                              </div>
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
                                className="block w-full ppa-form"
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
                            </div>
                          </form>
    
                          {/* Submit Form */}
                          <div className="mt-8">
                            {/* Check if the data is empty */}
                            {!pointPersonnel.pid ? (
                              <button type="submit" form="partBForm"
                                className={`py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                            ):(
                              lastfilledDate && natureRepair ? (
                                // Filled all the forms
                                <button type="submit" form="partBForm"
                                  className={`py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                              ):(
                                // Submit For without filled date and nature of repair
                                <button type="submit"
                                  onClick={() => handleGSOSubmitConfirmation()} 
                                  className="py-2 px-3 btn-default-form"
                                >
                                  Submit
                                </button>
                              )
                            )}
                          </div>
                        </>
                        ):(
                          inspectionData?.form?.admin_status != 0 && (
                          <div>
                            {/* Upate Form */}
                            <form id="EditPartB" onSubmit={event => UpdatePartB(event, inspectionData?.form?.id)}>
                              {/* Part B Fields */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Part B leftside */}
                                <div className="col-span-1">
    
                                  {/* Date */}
                                  <div className="flex items-center mt-5">
                                    <div className="w-40">
                                      <label className="block text-base font-bold leading-6 text-gray-900">
                                      Date:
                                      </label> 
                                    </div>
                                    <div className={`w-1/2 h-6 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                      {inspectionData?.form?.date_of_filling ? formatDate(inspectionData?.form?.date_of_filling) 
                                      : null}
                                    </div>
                                  </div>
    
                                  {/* Date of Last Repair */}
                                  <div className={`flex items-center ${enablePartB ? 'mt-2' : 'mt-2'}`}>
                                    <div className="w-40">
                                      <label className="block text-base font-bold leading-6 text-gray-900">
                                      Date of Last Repair:
                                      </label> 
                                    </div>
                                    <div className={`w-1/2 h-6 ${enablePartB ? 'ppa-form-view' : ''} ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                      {enablePartB ? (
                                        inspectionData?.form?.date_of_filling ? (
                                          inspectionData?.form?.date_of_last_repair ? formatDate(inspectionData?.form?.date_of_last_repair) : 'N/A'
                                        ) : null 
                                      ):(
                                        <input
                                          type="date"
                                          name="last_date_filled"
                                          id="last_date_filled"    
                                          value={updatelastfilledDate}
                                          onChange={ev => setUpdateLastFilledDate(ev.target.value)}
                                          max={currentDate}
                                          className="block w-full ppa-form-edit"
                                        />
                                      )}
                                    </div>
                                  </div>
    
                                  {/* Assigned Personnel*/}
                                  <div className={`flex items-center ${enablePartB ? 'mt-2' : 'mt-4'}`}>
                                    <div className="w-40">
                                      <label className="block text-base font-bold leading-6 text-gray-900">
                                      Assigned Personnel:
                                      </label> 
                                    </div>
                                    <div className={`w-1/2 h-6 ${enablePartB ? 'ppa-form-view font-bold italic' : ''} ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                      {enablePartB ? (
                                        inspectionData?.form?.personnel_name
                                      ):(
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
                                            {inspectionData?.form?.personnel_name} (current)
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
                                      )}
                                    </div>
                                  </div>
    
                                </div>
                                
                                {/* Part B rightside */}
                                <div className="col-span-1">
                                  {/* Requested By */}
                                  <div className="flex items-center mt-6">
                                    <div className="w-40">
                                      <label className="block text-base font-bold leading-6 text-gray-900">
                                      Requested By:
                                      </label> 
                                    </div>
                                    <div className={`w-1/2 h-6 ppa-form-view font-bold italic ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                      {inspectionData?.form?.date_of_filling ? inspectionData?.gso_name : null}
                                    </div>
                                  </div>
    
                                  {/* Noted By */}
                                  <div className="flex items-center mt-2">
                                    <div className="w-40">
                                      <label className="block text-base font-bold leading-6 text-gray-900">
                                      Noted By:
                                      </label> 
                                    </div>
                                    <div className={`w-1/2 h-6 ppa-form-view font-bold italic ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                      {inspectionData?.form?.date_of_filling ? inspectionData?.admin_name : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
    
                              {/* Nature of Repair */}
                              <div className={`flex items-center ${enablePartB ? 'mt-2' : 'mt-5'}`}>
                                <div className="w-40">
                                  <label className="block text-base font-bold leading-6 text-gray-900">
                                  Nature of Repair:
                                  </label> 
                                </div>
                                <div className={`w-3/4 h-6 ${enablePartB ? 'ppa-form-view' : ''} ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                                  {enablePartB ? (
                                    inspectionData?.form?.date_of_filling ? (
                                      inspectionData?.form?.nature_of_last_repair ? inspectionData?.form?.nature_of_last_repair : 'N/A'
                                    ) : null
                                  ):(
                                    <input
                                      id="nature_repair"
                                      name="nature_repair"
                                      value={updatenatureRepair}
                                      onChange={ev => setUpdateNatureRepair(ev.target.value)}
                                      style={{ resize: "none" }}  
                                      placeholder={inspectionData?.form?.nature_of_last_repair}
                                      className="block w-full ppa-form-edit"
                                    />
                                  )}
                                </div>
                              </div>
                            </form>
    
                            {/* Submit Button */}
                            {!enablePartB && (
                              !buttonHide && (
                                <div className="mt-8">
                                  {/* Submit */}
                                  <button type="submit" form="EditPartB"
                                    className={`py-2 px-4 mr-2 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                                        setEnablePartB(true); 
                                      }} className="py-2 px-4 btn-cancel-form">
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              )
                            )}
    
                            {/* Admin Button */}
                            {inspectionData?.form?.admin_status == 2 && Admin && (
                              !buttonHide && (
                                <div className="mt-5">
                                  {/* Approve */}
                                  <button
                                    onClick={() => handleAdminApprovalConfirmation()} 
                                    className="py-2 px-4 btn-default-form"
                                  >
                                    Approve
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                          )
                        )}
                      </div>
                    )}
    
                    {/* Part C */}
                    {inspectionData?.form?.admin_status == 1 && (
                      <div className="pb-6 mt-4 pb-6 border-b border-gray-300">
                        {/* Caption */}
                        <div className="flex">
                          <h2 className="text-lg font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job. </h2>
                          {(inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3) && (
                            <>
                            {/* For the GSO */}
                            {GSO && inspectionData?.form?.before_repair_date && (enablePartA && enablePartB && enablePartC && enablePartD) && (
                              <FontAwesomeIcon onClick={() => { setEnablePartC(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                            )}
                            {/* For the AssignPersonnel */}
                            {inspectionData?.form?.personnel_id == currentUserId && 
                            inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 && 
                            inspectionData?.form?.before_repair_date &&
                            (enablePartA && enablePartB && enablePartC && enablePartD) && (
                              <FontAwesomeIcon onClick={() => { setEnablePartC(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                            )}
                            </>
                          )}
                        </div>
    
                        {/* Form */}
                        {inspectionData?.form?.personnel_id == currentUserId && inspectionData?.form?.insp_status == 3 ? (
                          <form id="partCForm" onSubmit={event => SubmitPartC(event, inspectionData?.form?.id)}>
                            {/* Date */}
                            <div className="flex items-center mt-6">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                  Date Inspected:
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <input
                                  type="date"
                                  name="date_filled"
                                  id="date_filled"
                                  className="block w-full ppa-form"
                                  defaultValue={today}
                                  readOnly
                                />
                              </div>
                            </div>
    
                            {/* Findings */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Findings:
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <textarea
                                  id="findings"
                                  name="findings"
                                  rows={3}
                                  style={{ resize: "none" }}
                                  value= {findings}
                                  onChange={ev => setFindings(ev.target.value)}
                                  className="block w-full ppa-form"
                                />
                                {!findings && inputErrors.findings && (
                                  <p className="form-validation">This form is required</p>
                                )}
                              </div>
                            </div>
    
                            {/* Recomendations */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Recomendations:
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <textarea
                                  id="recomendations"
                                  name="recomendations"
                                  rows={3}
                                  style={{ resize: "none" }}
                                  value= {recommendations}
                                  onChange={ev => setRecommendations(ev.target.value)}
                                  className="block w-full ppa-form"
                                />
                                {!recommendations && inputErrors.recommendations && (
                                  <p className="form-validation">This form is required</p>
                                )}
                              </div>
                            </div> 
    
                            {/* Submit Button */}
                            <div className="mt-5">
                              {/* Check if the data is empty */}
                              {!buttonHide && (
                                <button type="submit" form="partCForm"
                                  className={`py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                              )}
                            </div> 
                          </form>
                        ):(
                        <>
                          <form id="editPartC" onSubmit={event => UpdatePartC(event, inspectionData?.form?.id)}>
                            {/* Date */}
                            <div className="flex items-center mt-6">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Date:
                                </label> 
                              </div>
                              <div className={`w-1/4 h-6 ${enablePartC ? 'ppa-form-view' : ''}`}>
                              {enablePartC ? (
                                inspectionData?.form?.before_repair_date ? formatDate(inspectionData?.form?.before_repair_date) : null
                              ):(
                                <input 
                                  type="date" 
                                  name="rep_date" 
                                  id="rep_date" 
                                  defaultValue={today} 
                                  className="block w-full ppa-form-edit"
                                  readOnly
                                />
                              )}
                              </div>
                            </div>
    
                            {/* Assigned Personnel*/}
                            <div className={`flex items-center ${enablePartC ? 'mt-2' : 'mt-5'}`}>
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Assigned Personnel:
                                </label> 
                              </div>
                              <div className={`w-1/4 h-6 font-bold italic ppa-form-view`}>
                                {inspectionData?.form?.before_repair_date && inspectionData?.form?.personnel_name}
                              </div>
                            </div>
    
                            {/* Findings */}
                            <div className={`flex items-center ${enablePartC ? 'mt-2' : 'mt-2'}`}>
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Findings:
                                </label> 
                              </div>
                              <div className={`w-3/4 h-6 ${enablePartC ? 'ppa-form-view' : ''}`}>
                                {enablePartC ? (
                                  inspectionData?.form?.findings
                                ):(
                                  <input
                                    id="findings"
                                    name="findings"
                                    defaultValue={inspectionData?.form?.findings}
                                    onChange={ev => setUpdateFindings(ev.target.value)}
                                    className="block w-full ppa-form-edit"
                                  />
                                )}
                              </div>
                            </div>
    
                            {/* Recommendations */}
                            <div className={`flex items-center ${enablePartC ? 'mt-2' : 'mt-4'}`}>
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Recommendations:
                                </label> 
                              </div>
                              <div className={`w-3/4 h-6 ${enablePartC ? 'ppa-form-view' : ''}`}>
                                {enablePartC ? (
                                  inspectionData?.form?.recommendations
                                ):(
                                  <input
                                    id="recomendations"
                                    name="recomendations"
                                    defaultValue= {inspectionData?.form?.recommendations}
                                    onChange={ev => setUpdateRecommendations(ev.target.value)}
                                    className="block w-full ppa-form-edit"
                                  />
                                )}
                              </div>
                            </div>
                          </form>
    
                          {/* Submit Button */}
                          {!enablePartC && (
                            !buttonHide && (
                              <div className="mt-8">
                                {/* Submit */}
                                <button type="submit" form="editPartC"
                                  className={`py-2 px-4 mr-2 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                                  disabled={submitLoading || enablePartCButton}
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
                                      setEnablePartC(true); 
                                    }} className="py-2 px-4 btn-cancel-form">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </>
                        )}
                      </div>
                    )}
    
                    {/* Part D */}
                    {inspectionData?.form?.admin_status == 1 && (
                      <div className="mt-4">
                        {/* Caption */}
                        <div className="flex">
                          <h2 className="text-lg font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.  </h2>
                          {(inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3) && (
                          <>
                            {/* For the GSO */}
                            {GSO && inspectionData?.form?.after_reapir_date && (enablePartA && enablePartB && enablePartC && enablePartD) && (
                              <FontAwesomeIcon onClick={() => { setEnablePartD(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                            )}
                            {/* For the AssignPersonnel */}
                            {inspectionData?.form?.personnel_id == currentUserId && 
                            inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 && 
                            inspectionData?.form?.after_reapir_date &&
                            (enablePartA && enablePartB && enablePartC && enablePartD) && (
                              <FontAwesomeIcon onClick={() => { setEnablePartD(false); }} className="icon-form ml-3 self-center" title="Edit Part B" icon={faPenToSquare} />
                            )}
                          </>
                          )}
                        </div>
    
                        {/* Form */}
                        {inspectionData?.form?.personnel_id == currentUserId && inspectionData?.form?.insp_status == 2 && enablePartC ? (
                        <>
                          <form id="partDForm" onSubmit={event => SubmitPartD(event, inspectionData?.form?.id)}>
                            {/* Date */}
                            <div className="flex items-center mt-6">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                  Date Inspected:
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <input
                                  type="date"
                                  name="date_filled"
                                  id="date_filled"
                                  className="block w-full ppa-form"
                                  defaultValue={today}
                                  readOnly
                                />
                              </div>
                            </div>
    
                            {/* Remarks */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Remarks:
                                </label> 
                              </div>
                              <div className="w-1/2">
                                <textarea
                                  id="findings"
                                  name="findings"
                                  rows={3}
                                  style={{ resize: "none" }}
                                  value= {remarks}
                                  onChange={ev => setRemarks(ev.target.value)}
                                  className="block w-full ppa-form"
                                />
                                {!remarks && inputErrors.remarks && (
                                  <p className="form-validation">This form is required</p>
                                )}
                              </div>
                            </div>
                          </form>
    
                          {/* Button */}
                          {!buttonHide && (
                            <div className="mt-5">
                              {/* Check if the data is empty */}
                              <button type="submit" form="partDForm"
                                className={`py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                            </div>
                          )}
                        </>
                        ):(
                        <>
                          <form id="updateDForm" onSubmit={event => UpdatePartD(event, inspectionData?.form?.id)}>
                            {/* Date */}
                            <div className="flex items-center mt-6">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Date:
                                </label> 
                              </div>
                              <div className={`w-1/4 h-6 ${enablePartD ? 'ppa-form-view' : ''} ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                              {enablePartD ? (
                                inspectionData?.form?.after_reapir_date ? formatDate(inspectionData?.form?.after_reapir_date) : null
                              ):(
                                <input 
                                  type="date" 
                                  name="rep_date" 
                                  id="rep_date" 
                                  defaultValue={today} 
                                  className="block w-full ppa-form-edit"
                                  readOnly
                                />
                              )}
                              </div>
                            </div>
    
                            {/* Assigned Personnel*/}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Assigned Personnel:
                                </label> 
                              </div>
                              <div className={`w-1/4 h-6 font-bold italic ${enablePartD ? 'ppa-form-view' : 'mt-2' }`}>
                                {inspectionData?.form?.remarks && inspectionData?.form?.personnel_name}
                              </div>
                            </div>
    
                            {/* Remarks */}
                            <div className="flex items-center mt-2">
                              <div className="w-40">
                                <label className="block text-base font-bold leading-6 text-gray-900">
                                Remarks:
                                </label> 
                              </div>
                              <div className={`w-3/4 h-6 ${enablePartD ? 'ppa-form-view' : ''}`}>
                                {enablePartD ? (
                                  inspectionData?.form?.remarks
                                ):(
                                  <input
                                    id="recomendations"
                                    name="recomendations"
                                    defaultValue= {inspectionData?.form?.remarks}
                                    onChange={ev => setUpdateRemarks(ev.target.value)}
                                    className="block w-full ppa-form-edit"
                                  />
                                )}
                              </div>
                            </div>
                          </form>
    
                          {/* Submit Button */}
                          {!enablePartD && (
                            !buttonHide && (
                              <div className="mt-8">
                                {/* Submit */}
                                <button type="submit" form="updateDForm"
                                  className={`py-2 px-4 mr-2 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                                  disabled={submitLoading || enablePartDButton}
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
                                      setEnablePartD(true); 
                                    }} className="py-2 px-4 btn-cancel-form">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </>
                        )}
                      </div>
                    )}
                  </>
                  )
              )}

            </div>

          </div>
          
        </>
        ):<Restrict />
      ):null}    

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          SubmitSupReason={SubmitSupReason}
          handlelSupervisorApproval={handlelSupervisorApproval}
          handlelAdminApproval={handlelAdminApproval}
          handleCloseFormRequest={handleCloseFormRequest}
          CloseForceRequest={CloseForceRequest}
          inspectionData={inspectionData?.form?.id}
          justClose={justClose}
          closePopup={closePopup}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          form={"partBForm"}
        />
      )}
      
      {/* PDF Area */}
      {isVisible && (
      <div>
        <div className="hidden md:none">
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
                  <td className="border text-lg w-7/12 border-black font-arial text-center">
                    <b>PRE-REPAIR/POST REPAIR INSPECTION FORM</b>
                  </td>
                  <td className="border border-black p-0 font-arial">
                    <div className="border-b text-xs border-black p-1">Form No.: PM:VEC:LNI:WEN:FM:03</div>
                    <div className="border-b text-xs border-black p-1">Revision No.: 01</div>
                    <div className="text-xs p-1">Date of Effectivity: March 26, 2021</div>
                  </td>

                  {/* Blank */}
                  <tr> <td colSpan={3} className="border border-black p-1.5 font-arial"></td> </tr>

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
                          <div className="mt-6">
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
                          <div className="mt-1">
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
                          <div className="mt-1">
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
                          <div className="mt-1">
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
                          <div className="mt-1">
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
                          <div className="mt-6">
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
                          <div className="mt-1">
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
                          <div className="mt-1">
                            <div className="flex">
                              <div className="w-56 text-pdf">
                                <span>Location (Div/Section/Unit)</span> 
                              </div>
                              <div className="w-64 border-b border-black pl-4 text-pdf">
                                <span>{inspectionData?.form?.location}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Complain */}
                      <div className="mt-1">
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
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">

                          {/* For Requestor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> REQUESTED BY:</label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                <img 
                                  src={inspectionData?.requestor_esig} 
                                  alt="User Signature" 
                                  className="ppa-esignature-form" 
                                />
                                <span className="text-base font-bold">{inspectionData?.form?.user_name}</span>
                              </div>
                              <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> End-User </label>
                            </div>
                          </div>

                          {/* For Supervisor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                {inspectionData?.form?.sup_status == 1 && (
                                  <img 
                                    src={inspectionData?.supervisor_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                )}
                                <span className="text-base font-bold">{inspectionData?.form?.supervisor_name}</span>
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
                          <div className="w-28 text-pdf">
                            <span>Date</span> 
                          </div>
                          <div className="w-64 border-b border-black pl-1 text-pdf">
                          {inspectionData?.form?.admin_status == 2 || inspectionData?.form?.admin_status == 1 && (
                            <span>{formatDate(inspectionData?.form?.date_of_filling)}</span>
                          )}
                          </div>
                        </div>
                      </div>

                      {/* Date of Last Repair */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-36 text-pdf">
                            <span>Date of Last Repair</span> 
                          </div>
                          <div className="w-64 border-b border-black pl-1 text-pdf">
                          {inspectionData?.form?.admin_status == 2 || inspectionData?.form?.admin_status == 1 && (
                            <span>{inspectionData?.form?.date_of_last_repair ? (formatDate(inspectionData?.form?.date_of_last_repair)):("N/A")}</span>
                          )}
                          </div>
                        </div>
                      </div>

                      {/* Nature of Repair */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-44 text-pdf">
                            <span>Nature of Last Repair</span>
                          </div>
                          <div className="w-full border-b border-black pl-1 text-pdf">
                          {inspectionData?.form?.admin_status == 2 || inspectionData?.form?.admin_status == 1 && (
                            <span>{inspectionData?.form?.nature_of_last_repair ? (inspectionData?.form?.nature_of_last_repair):("N/A")}</span>
                          )}
                          </div>
                        </div>
                      </div>

                      {/* For Signature */}
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">

                          {/* For Requestor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> REQUESTED BY:</label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                {(inspectionData?.form?.admin_status == 2 || inspectionData?.form?.admin_status == 1) && (
                                  <img 
                                    src={inspectionData?.gso_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                )}
                                <span className="text-base font-bold">{inspectionData?.gso_name}</span>
                              </div>
                              <label htmlFor="type_of_property" className="block text-xs text-center font-medium italic"> End-User </label>
                            </div>
                          </div>

                          {/* For Supervisor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                {inspectionData?.form?.admin_status == 1 && (
                                  <img 
                                    src={inspectionData?.admin_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                )}
                                <span className="text-base font-bold">{inspectionData?.admin_name}</span>
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
                          <div className="w-44 text-pdf">
                            <span>Finding/s</span>
                          </div>
                          <div className="w-full border-b border-black pl-1 text-pdf">
                            <span>{(inspectionData?.form?.insp_status == 2 || inspectionData?.form?.insp_status == 1) && inspectionData?.form?.findings}</span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mt-1">
                        <div className="flex">
                          <div className="w-44 text-pdf">
                            <span>Recommendation/s</span>
                          </div>
                          <div className="w-full border-b border-black pl-1 text-pdf">
                            <span>{(inspectionData?.form?.insp_status == 2 || inspectionData?.form?.insp_status == 1) && inspectionData?.form?.recommendations}</span>
                          </div>
                        </div>
                      </div>

                      {/* For Signature */}
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">

                          {/* Date */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> DATE INSPECTED:</label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1 h-7" style={{ position: 'relative' }}>
                                <span className="text-base">{(inspectionData?.form?.insp_status == 2 || inspectionData?.form?.insp_status == 1) && formatDate(inspectionData?.form?.before_repair_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* For Supervisor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1 h-7" style={{ position: 'relative' }}>
                                {(inspectionData?.form?.insp_status == 2 || inspectionData?.form?.insp_status == 1) && (
                                  <img 
                                    src={inspectionData?.assign_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                )}
                                <span className="text-base font-bold">{(inspectionData?.form?.insp_status == 2 || inspectionData?.form?.insp_status == 1) && inspectionData?.form?.personnel_name}</span>
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
                          <div className="w-44 text-pdf">
                            <span>Remarks</span>
                          </div>
                          <div className="w-full border-b border-black pl-1 text-pdf">
                            <span>{inspectionData?.form?.insp_status == 1 && inspectionData?.form?.remarks}</span>
                          </div>
                        </div>
                      </div>

                      {/* For Signature */}
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">

                          {/* For Requestor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> DATE INSPECTED:</label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1 h-7" style={{ position: 'relative' }}>
                                <span className="text-base">{inspectionData?.form?.insp_status == 1 && formatDate(inspectionData?.form?.after_reapir_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* For Supervisor Signature */}
                          <div className="col-span-1">
                            <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                            <div className="mt-5">
                              <div className="w-64 mx-auto border-b text-center border-black pl-1 h-7" style={{ position: 'relative' }}>
                                {inspectionData?.form?.insp_status == 1 && (
                                  <img 
                                    src={inspectionData?.assign_esig} 
                                    alt="User Signature" 
                                    className="ppa-esignature-form" 
                                  />
                                )}
                                <span className="text-base font-bold">{inspectionData?.form?.insp_status == 1 && inspectionData?.form?.personnel_name}</span>
                              </div>
                              <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Property Inspector </label>
                            </div>
                          </div>

                        </div>
                      </div>

                    </td>
                  </tr>
                  {/* End of Part D Form */}

                </tbody>
              </table>

              <span className="system-generated">Joint Local Management System - This is system-generated.</span>

            </div>
          </div>
        </div>
      </div>
      )}
      
      
    </PageComponent>
  );
}