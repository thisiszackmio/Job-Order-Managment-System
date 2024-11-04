import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import loadingAnimation from '/default/ppa_logo_animationn_v4.gif';
import submitAnimation from '/default/ring-loading.gif';
import ppa_logo from '/default/ppa_logo.png'
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";

export default function InspectionForm(){
  // Get the ID
  const {id} = useParams();

  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Functions
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [inspectionData, setInspectionData] = useState([]);
  const [getPersonnel, setGetPersonnel] = useState([]);
  const [enableSupDecline, setEnableSupDecline] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  // Edit Part A - D
  const [enablePartA, setEnablePartA] = useState(false);
  const [enablePartB, setEnablePartB] = useState(false);
  const [enablePartC, setEnablePartC] = useState(false);
  const [enablePartD, setEnablePartD] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Variable
  // --- Update Part A --- //
  const [updatepropertyNo, setUpdatePropertyNo] = useState('');
  const [updateacquisitionDate, setUpdateAcquisitionDate] = useState('');
  const [updateacquisitionCost, setUpdateAcquisitionCost] = useState('');
  const [updateBrandModel, setUpdateBrandModel] = useState('');
  const [updateSerialEngineNo, setUpdateSerialEngineNo] = useState('');

  // --- Update Part B --- //
  const [updatelastfilledDate, setUpdateLastFilledDate] = useState('');
  const [updatenatureRepair, setUpdateNatureRepair] = useState('');
  const [updatepointPersonnel, setUpdatePointPersonnel] = useState({ pid: '', pname: '' });

  // --- Update Part C --- //
  const [updatefindings, setUpdateFindings] = useState('');
  const [updaterecommendations, setUpdateRecommendations] = useState('');

  // --- Update Part D --- //
  const [updateremarks, setUpdateRemarks] = useState('');

  // --- Part B --- //
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState({ pid: '', pname: '' });

  // --- Part C --- //
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // --- Part D --- //
  const [remarks, setRemarks] = useState('');

  // --- Reason for disapproval --- //
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  // Set Access
  const [Access, setAccess] = useState(false);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const popupClass = 'popup-show';
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else if(loading) {
      addLoadingClass();
    }
    else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
      removeLoadingClass();
    };
  }, [showPopup, loading]);

  // Get the Data
  const fecthInspection = () => {
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
      
      setInspectionData({
        form,
        requestor_esig,
        supervisor_esig,
        assign_esig,
        gso_name,
        gso_esig,
        admin_name,
        admin_esig
      })
      
      // Restrictions Condition
      const ucode = userCode;
      const codes = ucode.split(',').map(code => code.trim());
      const Admin = codes.includes("AM");
      const GSO = codes.includes("GSO");
      const SuperAdmin = codes.includes("HACK");
      const DivisionManager = codes.includes("DM");
      const Personnel = codes.includes("AP");
      const myAccess = form?.user_id == currentUserId?.id;

      // Create A condition for access
      setAccess(myAccess || DivisionManager || GSO || Admin || SuperAdmin || Personnel);

    })
    .finally(() => {
      setLoading(false);
    });
  }

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
    if(currentUserId?.id){
      fecthInspection();
    }
    fetchDisplayPersonnel();
  }, [id, currentUserId]);

  // --- Supervisor --- //

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

    const notification = `Your request has been approved by ${currentUserId.name}.`;

    const data = {
      // Notification
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      notif_message: notification,
      receiver_id: inspectionData?.form?.user_id,
      receiver_name: inspectionData?.form?.user_name,
    }
    
    axiosClient
    .put(`/supinsprequestapprove/${id}`, data)
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

    const logs = `${currentUserId.name} has disapproved the request on the Pre/Post Repair Inspection Form (Control No. ${inspectionData?.form?.id}).`;
    const notification = `Your request has been disapproved by ${currentUserId.name}. Please click to see the reason`;

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
        logs:logs,
        // Notification
        sender_avatar: dpname,
        sender_id: currentUserId.id,
        sender_name: currentUserId.name,
        notif_message: notification,
        receiver_id: inspectionData?.form?.user_id,
        receiver_name: inspectionData?.form?.user_name,
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

  // --- Admin --- //

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

    const logs = `${inspectionData?.admin_name} has approved the request on the Pre/Post Repair Inspection Form (Control No. ${inspectionData?.form?.id}).`;

    const data = {
      logs:logs,
      // Notification
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      receiver_id: inspectionData?.form?.user_id,
      receiver_name: inspectionData?.form?.user_name,
    }

    axiosClient
    .put(`/admininsprequestapprove/${id}`, data)
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

  // --- GSO --- //

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

  // --- Submit Area --- //

  // Submit Part B Form
  const SubmitPartB = (event, id) => {
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has filled out Part B of the Pre/Post Repair Inspection Form (Control No. ${id}).`;
    const formRemarks = inspectionData?.form?.status === '1005' ? 'The GSO has filled out Part B of the form and assigned personnel to check it.' : `The GSO has filled out Part B of the form and is waiting for the admin manager's approval.`;
    

    const data = {
      date_of_filling: today,
      date_of_last_repair: lastfilledDate,
      nature_of_last_repair: natureRepair,
      personnel_id: pointPersonnel.pid,
      personnel_name: pointPersonnel.pname, 
      admin_status: inspectionData?.form?.status === '1005' ? 1 : 2,   
      inspector_status: inspectionData?.form?.status === '1005' ? 3 : 0,
      form_remarks: formRemarks,
      // LOGS
      logs: logs,
      // NOTIFICATIONS
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      receiver_id: inspectionData?.form?.user_id,
      receiver_name: inspectionData?.form?.user_name,
    }

    axiosClient
    .put(`/submitinsprequestpartb/${id}`, data)
    .then(() => {
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

  // Submit Part C Form
  const SubmitPartC = (event, id) => {
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has filled out Part C of the Pre/Post Repair Inspection Form (Control No. ${id}).`;
    const formRemarks = `The inspector has finished inspecting your request.`;

    const data = {
      before_repair_date: today,
      findings: findings,
      recommendations: recommendations,
      form_remarks: formRemarks,
      logs: logs,
      // Notification
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      receiver_id: inspectionData?.form?.user_id,
      receiver_name: inspectionData?.form?.user_name,
    }

    axiosClient
    .put(`/submitinsprequestpartc/${id}`, data)
    .then(() => {
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

  // Submit Part D Form
  const SubmitPartD = (event, id) => {
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has filled out Part D of the Pre/Post Repair Inspection Form (Control No. ${id}).`;
    const formRemarks = `The inspector has completed the request.`;

    const data = {
      after_reapir_date: today,
      remarks: remarks,
      form_remarks: formRemarks,
      logs: logs,
      // Notifications
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      receiver_id: inspectionData?.form?.user_id,
      receiver_name: inspectionData?.form?.user_name,
    }

    axiosClient
    .put(`/submitinsprequestpartd/${id}`, data)
    .then(() => {
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

  // --- Update Area --- //

  // Update Part A
  function UpdatePartA(event, id){
    event.preventDefault();

    const hasFilledFields = [updatepropertyNo, updateacquisitionDate, updateacquisitionCost, updateBrandModel, updateSerialEngineNo].some(Boolean);
    const logs = `${currentUserId.name} has updated Part A of the Pre/Post Repair Inspection Form (Control No. ${id}).`;

    const dataA = {
      property_number: updatepropertyNo ? updatepropertyNo : inspectionData?.form?.property_number,
      acquisition_date: updateacquisitionDate ? updateacquisitionDate : inspectionData?.form?.acquisition_date,
      acquisition_cost: updateacquisitionCost ? updateacquisitionCost : inspectionData?.form?.acquisition_cost,
      brand_model: updateBrandModel ? updateBrandModel : inspectionData?.form?.brand_model,
      serial_engine_no: updateSerialEngineNo ? updateSerialEngineNo : inspectionData?.form?.serial_engine_no,
      logs: logs
    }
    
    if(!hasFilledFields){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered.</p>
        </div>
      );
    } else {
      setSubmitLoading(true);

      axiosClient
      .put(`/updateinsprequestparta/${id}`, dataA)
      .then(() => {
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

  }

  // Update Part B
  const UpdatePartB = (event, id) => {
    event.preventDefault();

    const hasFilledFields = [updatelastfilledDate, updatenatureRepair, updatepointPersonnel.pid].some(Boolean);
    const logs = `${currentUserId.name} has updated Part B of the Pre/Post Repair Inspection Form (Control No. ${id}).`;

    const dataB = {
      date_of_last_repair : updatelastfilledDate ? updatelastfilledDate : inspectionData?.form?.date_of_last_repair,
      nature_of_last_repair: updatenatureRepair ? updatenatureRepair : inspectionData?.form?.nature_of_last_repair,
      personnel_id: updatepointPersonnel.pid ? updatepointPersonnel.pid : inspectionData?.form?.personnel_id,
      personnel_name: updatepointPersonnel.pname ? updatepointPersonnel.pname : inspectionData?.form?.personnel_name,
      logs: logs
    }
    
    if(!hasFilledFields){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Ooops!</p>
          <p className="popup-message">You didn't input any form.</p>
        </div>
      );
    } else {
      setSubmitLoading(true);

      axiosClient
      .put(`/updateinsprequestpartb/${id}`, dataB)
      .then(() => {
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
  }

  // Update Part C
  const UpdatePartC = (event, id) => {
    event.preventDefault();

    const hasFilledFields = [updatefindings, updaterecommendations].some(Boolean);
    const logs = `${currentUserId.name} has updated Part C of the Pre/Post Repair Inspection Form (Control No. ${id}).`;

    const dataC = {
      findings : updatefindings ? updatefindings : inspectionData?.form?.findings,
      recommendations: updaterecommendations ? updaterecommendations : inspectionData?.form?.recommendations,
      logs: logs
    }
    
    if(!hasFilledFields){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Ooops!</p>
          <p className="popup-message">You didn't input any form.</p>
        </div>
      );
    } else {
      setSubmitLoading(true);

      axiosClient
      .put(`/updateinsprequestpartc/${id}`, dataC)
      .then(() => {
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
  }

  // Update Part D
  const UpdatePartD = (event, id) => {
    event.preventDefault();

    const logs = `${currentUserId.name} has updated Part D of the Pre/Post Repair Inspection Form (Control No. ${id}).`;

    const dataD = {
      remarks : updateremarks ? updateremarks : inspectionData?.form?.remarks,
      logs: logs
    }
    
    if(!updateremarks){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Ooops!</p>
          <p className="popup-message">You didn't input any form.</p>
        </div>
      );
    } else {
      setSubmitLoading(true);

      axiosClient
      .put(`/updateinsprequestpartd/${id}`, dataD)
      .then(() => {
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
  }

  // Close Form Popup 
  const handleCloseForm = () => {
    setShowPopup(true);
    setPopupContent('gsofc');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to close the form even though it is not complete?</p>
      </div>
    );
  }

  // Force Close Request Function
  function CloseForceRequest(id){
    setSubmitLoading(true);

    const logs = `${currentUserId.name} has force-closed this form (Control Number: ${inspectionData?.form?.id}).`;

    axiosClient
    .put(`/closeinspectionforce/${id}`, {
      logs:logs
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

  // Close Request Popup 
  const handleCloseRequest = () => {
    setShowPopup(true);
    setPopupContent('gsocr');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">If you close it, you cannot reopen it.</p>
      </div>
    );
  }

  // Close Request Function
  function handleCloseFormRequest(id){
    setSubmitLoading(true);

    const logs = `${currentUserId.name} has closed the request on the Pre/Post Repair Inspection Form (Control No. ${inspectionData?.form?.id}).`;

    axiosClient
    .put(`/closeinspectionrequest/${id}`, {
      logs:logs
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

  // Popup Button Function
  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
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

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  // Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const GSO = codes.includes("GSO");
  const Admin = codes.includes("AM");
  const Personnel = codes.includes("AP");

  return loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="loading-text loading-animation">
      {Array.from("Loading...").map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
      ))}
      </span>
    </div>
  ):(
    inspectionData?.form?.id == id ? (
      Access ? (
        <PageComponent title="Pre/Post Repair Inspection Form">

          {/* Form Content */}
          <div className="font-roboto ppa-form-box bg-white">

            {/* Header */}
            <div className="ppa-form-header text-base flex justify-between items-center">
              <span>Control No: <span className="px-2 ppa-form-view">{inspectionData?.form?.id}</span></span>
              {(inspectionData?.form?.status === '0000' || inspectionData?.form?.status === '1111' || inspectionData?.form?.status === '1112' || inspectionData?.form?.status === '2023' || inspectionData?.form?.status === '2001') ? null : (
                GSO && (<button onClick={() => handleCloseForm()} className="py-1.5 px-3 text-base btn-cancel"> Close Form </button>)
              )}
            </div>

            {/* For the Forms */}
            <div className="p-2 mt-2">

              {/* Part A */}
              <div className="border-b border-gray-300 pb-6">

                {/* Caption */}
                <div className="flex">
                  <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
                  {/* Edit Button */}
                  {inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 ? (
                    !enablePartA && !enablePartB && !enablePartC && !enablePartD && GSO && 
                    <button onClick={() => { setEnablePartA(true); }}  className="ml-3 px-6 btn-edit"> Edit Part A </button>
                  ):null}
                </div>

                {/* Enable Edit Part A */}
                {enablePartA ? (
                <>
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
                            {formatDate(inspectionData?.form?.date_request)}
                          </div>
                        </div>

                        {/* Property No */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                          </div>
                          <div className="w-1/2"> 
                            <input
                              type="text"
                              name="rep_property_no"
                              id="rep_property_no"
                              autoComplete="rep_property_no"
                              value={updatepropertyNo}
                              onChange={ev => setUpdatePropertyNo(ev.target.value)}
                              placeholder={inspectionData?.form?.property_number} 
                              className="block w-full ppa-form-edit"
                            />
                          </div>
                        </div>

                        {/* Acquisition Date */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Date: </label> 
                          </div>
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
                        </div>

                        {/* Acquisition Cost */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Cost: </label> 
                          </div>
                            <div className="w-1/2">
                            <div className="relative flex items-center">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600"> ₱ </span>
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
                                placeholder={inspectionData?.form?.acquisition_cost}
                                className="block w-full ppa-form-edit cost"
                              />
                              </div>
                            </div>
                        </div>

                        {/* Brand/Model */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Brand/Model: </label> 
                          </div>
                          <div className="w-1/2"> 
                            <input
                              type="text"
                              name="brand_mrep_brand_model"
                              id="rep_brand_model"
                              autoComplete="rep_brand_model"
                              value={updateBrandModel}
                              onChange={ev => setUpdateBrandModel(ev.target.value)}
                              placeholder={inspectionData?.form?.brand_model} 
                              className="block w-full ppa-form-edit"
                            />
                          </div>
                        </div>

                        {/* Serial/Engine No */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Serial/Engine No: </label> 
                          </div>
                          <div className="w-1/2"> 
                            <input
                              type="text"
                              name="rep_serial_engine_no"
                              id="rep_serial_engine_no"
                              autoComplete="rep_serial_engine_no"
                              value={updateSerialEngineNo}
                              onChange={ev => setUpdateSerialEngineNo(ev.target.value)}
                              placeholder={inspectionData?.form?.serial_engine_no}
                              className="block w-full ppa-form-edit"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Part A right side */}
                      <div className="col-span-1">

                        {/* Type of Property */}
                        <div className="flex items-center mt-6">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Type of Property: </label> 
                          </div>
                          <div className="w-1/2 ppa-form-view h-6">
                            {inspectionData?.form?.type_of_property}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Description: </label> 
                          </div>
                          <div className="w-1/2 ppa-form-view h-6">
                            {inspectionData?.form?.property_description}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Location: </label> 
                          </div>
                          <div className="w-1/2 ppa-form-view h-6">
                            {inspectionData?.form?.location}
                          </div>
                        </div>

                        {/* Requested By */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Requested By: </label> 
                          </div>
                          <div className="w-1/2 font-bold italic ppa-form-view h-6">
                            {inspectionData?.form?.user_name}
                          </div>
                        </div>

                        {/* Noted By */}
                        <div className="flex items-center mt-2">
                          <div className="w-40">
                            <label className="block text-base font-bold leading-6 text-gray-900"> Noted By: </label> 
                          </div>
                          <div className="w-1/2 font-bold italic ppa-form-view h-6">
                            {inspectionData?.form?.supervisor_name}
                          </div>
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
                      <div className="w-3/4 ppa-form-view h-6">
                        {inspectionData?.form?.complain}
                      </div>
                    </div>

                  </form>

                  {/* Submit Button */}
                  <div className="mt-8">
                    {/* Submit */}
                    <button 
                      type="submit"
                      form="EditPartA"
                      className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                          setEnablePartA(false); 
                          setUpdatePropertyNo('');
                          setUpdateAcquisitionDate('');
                          setUpdateAcquisitionCost('');
                          setUpdateBrandModel('');
                          setUpdateSerialEngineNo('');
                        }} className="ml-2 py-2 px-4 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
                ):(
                <>
                  {/* Display Form */}

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
                          {formatDate(inspectionData?.form?.date_request)}
                        </div>
                      </div>

                      {/* Property No */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view"> 
                          {inspectionData?.form?.property_number ? inspectionData?.form?.property_number : 'N/A'} 
                        </div>
                      </div>

                      {/* Acquisition Date */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Date: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view"> 
                          {inspectionData?.form?.acquisition_date ? formatDate(inspectionData?.form?.acquisition_date) : 'N/A'} 
                        </div>
                      </div>

                      {/* Acquisition Cost */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Cost: </label> 
                        </div>
                          <div className="w-1/2 ppa-form-view">
                          {inspectionData?.form?.acquisition_cost 
                          ? new Intl.NumberFormat('en-PH', {
                              style: 'currency',
                              currency: 'PHP'
                            }).format(inspectionData?.form?.acquisition_cost) 
                          : 'N/A'}
                          </div>
                      </div>

                      {/* Brand/Model */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Brand/Model: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view"> 
                          {inspectionData?.form?.brand_model ? inspectionData?.form?.brand_model : 'N/A'} 
                        </div>
                      </div>

                      {/* Serial/Engine No */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Serial/Engine No: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view"> 
                          {inspectionData?.form?.serial_engine_no ? inspectionData?.form?.serial_engine_no : 'N/A'} 
                        </div>
                      </div>

                    </div>

                    {/* Part A right side */}
                    <div className="col-span-1">

                      {/* Type of Property */}
                      <div className="flex items-center mt-6">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Type of Property: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view">
                          {inspectionData?.form?.type_of_property}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Description: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view">
                          {inspectionData?.form?.property_description}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Location: </label> 
                        </div>
                        <div className="w-1/2 ppa-form-view">
                          {inspectionData?.form?.location}
                        </div>
                      </div>

                      {/* Requested By */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Requested By: </label> 
                        </div>
                        <div className="w-1/2 font-bold italic ppa-form-view">
                          {inspectionData?.form?.user_name}
                        </div>
                      </div>

                      {/* Noted By */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900"> Noted By: </label> 
                        </div>
                        <div className="w-1/2 font-bold italic ppa-form-view">
                          {inspectionData?.form?.supervisor_name}
                        </div>
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
                    <div className="w-3/4 ppa-form-view">
                      {inspectionData?.form?.complain}
                    </div>
                  </div>

                </>
                )}

              </div>

              {/* Part B */}
              {(inspectionData?.form?.status === '2023' || inspectionData?.form?.status === '1004' || inspectionData?.form?.status === '1005' || inspectionData?.form?.status === '1200' || inspectionData?.form?.status === '1130' || inspectionData?.form?.status === '1120' || inspectionData?.form?.status === '1112' || inspectionData?.form?.status === '1111' ) && (
                <div className="mt-4 border-b border-gray-300 pb-6">

                  {/* Caption */}
                  <div className="flex">
                    <h2 className="text-base font-bold leading-7 text-gray-900"> Part B: To be filled-up by Administrative Division </h2>
                    {inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 ? (
                      !enablePartA && !enablePartB && !enablePartC && !enablePartD && GSO && inspectionData?.form?.date_of_filling &&
                      <button onClick={() => { setEnablePartB(true); }}  className="ml-3 px-6 btn-edit"> Edit Part B </button> 
                    )
                    : null}
                  </div>

                  {/* Enable Edit Part B */}
                  {enablePartB ? (
                  <>
                    {/* Upate Form */}
                    <form id="EditPartB" onSubmit={event => UpdatePartB(event, inspectionData?.form?.id)}>
                      
                      {/* Part B Fields */}
                      <div className="grid grid-cols-2 gap-4">

                        {/* Part B leftside */}
                        <div className="col-span-1">

                          {/* Date */}
                          <div className="flex items-center mt-6">
                            <div className="w-40">
                              <label className="block text-base font-bold leading-6 text-gray-900">
                              Date:
                              </label> 
                            </div>
                            <div className="w-1/2 ppa-form-view h-6">
                              {inspectionData?.form?.date_of_filling ? formatDate(inspectionData?.form?.date_of_filling) 
                              : null}
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
                                value={updatelastfilledDate}
                                onChange={ev => setUpdateLastFilledDate(ev.target.value)}
                                max={currentDate}
                                className="block w-full ppa-form-edit"
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
                                value={updatenatureRepair}
                                onChange={ev => setUpdateNatureRepair(ev.target.value)}
                                style={{ resize: "none" }}  
                                placeholder={inspectionData?.form?.nature_of_last_repair}
                                className="block w-full ppa-form-edit"
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
                              value={updatepointPersonnel.pid}
                              onChange={ev => {
                                const selectedPid = parseInt(ev.target.value);
                                const selectedPersonnel = getPersonnel.find(staff => staff.personnel_id === selectedPid);
          
                                setUpdatePointPersonnel(selectedPersonnel ? { pid: selectedPersonnel.personnel_id, pname: selectedPersonnel.personnel_name } : { pid: '', pname: '' });
                              }}
                              className="block w-full ppa-form"
                              >
                                <option value="" disabled>{inspectionData?.form?.personnel_name} (current)</option>
                                {getPersonnel.map((data)=>(
                                  <option key={data.personnel_id} value={data.personnel_id}>
                                    {data.personnel_name}
                                  </option>
                                ))}
                              </select>
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
                            <div className="w-1/2 ppa-form-view italic font-bold h-6">
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
                            <div className="w-1/2 ppa-form-view italic font-bold h-6">
                              {inspectionData?.form?.date_of_filling ? inspectionData?.admin_name : null}
                            </div>
                          </div>

                        </div>

                      </div>

                    </form>

                    {/* Submit Button */}
                    <div className="mt-8">
                      {/* Submit */}
                      <button type="submit" form="EditPartB"
                        className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                            setEnablePartB(false); 
                            setUpdateLastFilledDate('');
                            setUpdateNatureRepair('');
                            setUpdatePointPersonnel({ pid: '', pname: '' });
                          }} className="ml-2 py-2 px-4 btn-cancel">
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                  ):(
                    (inspectionData?.form?.status === '1004' || inspectionData?.form?.status === '1005') && GSO && !enablePartA ? (
                    <>
                      {/* Form */}
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

                      {/* Submit Button */}
                      {!enablePartA ? (
                        <div className="mt-8">
                          {/* Check if the data is empty */}
                          {!pointPersonnel.pid ? (
                            <button type="submit" form="partBForm"
                              className={`py-2 px-3 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                                className={`py-2 px-3 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
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
                              <button onClick={() => handleGSOSubmitConfirmation()} 
                              className="py-2 px-3 btn-default"
                            >
                              Submit
                        </button>
                            )
                          )}
                        </div>
                      ):null}
                    </>
                    ):(
                    <>
                      {/* Part B Fields */}
                      <div className="grid grid-cols-2 gap-4">

                        {/* Part B leftside */}
                        <div className="col-span-1">

                          {/* Date */}
                          <div className="flex items-center mt-6">
                            <div className="w-40">
                              <label className="block text-base font-bold leading-6 text-gray-900">
                              Date:
                              </label> 
                            </div>
                            <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                              {inspectionData?.form?.date_of_filling ? formatDate(inspectionData?.form?.date_of_filling) 
                              : null}
                            </div>
                          </div>

                          {/* Date of Last Repair */}
                          <div className="flex items-center mt-2">
                            <div className="w-40">
                              <label className="block text-base font-bold leading-6 text-gray-900">
                              Date of Last Repair:
                              </label> 
                            </div>
                            <div className={`w-1/2 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                              {inspectionData?.form?.date_of_filling ? (
                                inspectionData?.form?.date_of_last_repair ? inspectionData?.form?.date_of_last_repair : 'N/A'
                              ) : null }
                            </div>
                          </div>

                          {/* Assigned Personnel*/}
                          <div className="flex items-center mt-2">
                            <div className="w-40">
                              <label className="block text-base font-bold leading-6 text-gray-900">
                              Assigned Personnel:
                              </label> 
                            </div>
                            <div className={`w-1/2 ppa-form-view font-bold italic ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                              {inspectionData?.form?.personnel_name}
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
                            <div className={`w-1/2 ppa-form-view font-bold italic ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
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
                            <div className={`w-1/2 ppa-form-view font-bold italic ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                              {inspectionData?.form?.date_of_filling ? inspectionData?.admin_name : null}
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Nature of Repair */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Nature of Repair:
                          </label> 
                        </div>
                        <div className={`w-3/4 ppa-form-view ${inspectionData?.form?.date_of_filling ? null : 'h-6' }`}>
                          {inspectionData?.form?.date_of_filling ? (
                            inspectionData?.form?.nature_of_last_repair ? inspectionData?.form?.nature_of_last_repair : 'N/A'
                          ) : null }
                        </div>
                      </div>
                    </>
                    )
                  )}

                </div>
              )}

              {/* Part C */}
              {(inspectionData?.form?.status === '2023' || inspectionData?.form?.status === '1130' || inspectionData?.form?.status === '1120' || inspectionData?.form?.status === '1112' || inspectionData?.form?.status === '1111') && (
                <div className="mt-4 border-b border-gray-300 pb-6">

                  {/* Caption */}
                  <div className="flex">
                    <h2 className="text-base font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job. </h2>
                    {inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 ? (
                      !enablePartA && !enablePartB && !enablePartC && !enablePartD && Personnel && inspectionData?.form?.before_repair_date &&
                      <button onClick={() => { setEnablePartC(true); }}  className="ml-3 px-6 btn-edit"> Edit Part C </button> 
                    ):null}
                  </div>

                  {/* Enable Part C */}
                  {enablePartC ? (
                  <>
                    {/* Upate Form */}
                    <form id="editPartC" onSubmit={event => UpdatePartC(event, inspectionData?.form?.id)}>

                      {/* Date */}
                      <div className="flex items-center mt-6">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                          </label> 
                        </div>
                        <div className="w-1/4 ppa-form-view h-6">
                          {formatDate(inspectionData?.form?.before_repair_date)}
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
                            value= {updatefindings}
                            onChange={ev => setUpdateFindings(ev.target.value)}
                            placeholder={inspectionData?.form?.findings}
                            className="block w-full ppa-form-edit"
                          />
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
                            value= {updaterecommendations}
                            onChange={ev => setUpdateRecommendations(ev.target.value)}
                            placeholder={inspectionData?.form?.recommendations}
                            className="block w-full ppa-form-edit"
                          />
                        </div>
                      </div>

                    </form>

                    {/* Submit Button */}
                    <div className="mt-5">
                      {/* Submit */}
                      <button type="submit" form="editPartC"
                        className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                            setEnablePartC(false); 
                            setUpdateFindings('');
                            setUpdateRecommendations('');
                          }} className="ml-2 py-2 px-4 btn-cancel">
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                  ):(
                  <>
                    {/* Check if the Status is 1130 - Admin approved */}
                    {inspectionData?.form?.status === '1130' && (inspectionData?.form?.personnel_id === currentUserId.id) ? (
                    <>
                      {/* Form */}
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

                      </form>

                      {/* Submit Button */}
                      <div className="mt-5">
                        {/* Check if the data is empty */}
                        <button type="submit" form="partCForm"
                          className={`py-2 px-3 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                    </>
                    ):(
                    <>

                      {/* Date */}
                      <div className="flex items-center mt-6">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                          </label> 
                        </div>
                        <div className={`w-1/4 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.before_repair_date ? formatDate(inspectionData?.form?.before_repair_date) 
                          : null}
                        </div>
                      </div>

                      {/* Assigned Personnel*/}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Assigned Personnel:
                          </label> 
                        </div>
                        <div className={`w-1/4 ppa-form-view font-bold italic ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.before_repair_date ? inspectionData?.form?.personnel_name :
                          null }
                        </div>
                      </div>

                      {/* Findings */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Findings:
                          </label> 
                        </div>
                        <div className={`w-3/4 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.findings}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Recommendations:
                          </label> 
                        </div>
                        <div className={`w-3/4 ppa-form-view ${inspectionData?.form?.before_repair_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.recommendations}
                        </div>
                      </div>

                    </>
                    )}
                  </>
                  )}

                </div>
              )}

              {/* Part D */}
              {(inspectionData?.form?.status === '2023' || inspectionData?.form?.status === '1120' || inspectionData?.form?.status === '1112' || inspectionData?.form?.status === '1111') && (
                <div className="mt-4 pb-6">

                  {/* Caption */}
                  <div className="flex">
                    <h2 className="text-base font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job. </h2>
                    {inspectionData?.form?.form_status != 1 && inspectionData?.form?.form_status != 3 ? (
                      !enablePartA && !enablePartB && !enablePartC && !enablePartD && Personnel && inspectionData?.form?.after_reapir_date && 
                      <button onClick={() => { setEnablePartD(true); }}  className="ml-3 px-6 btn-edit"> Edit Part D </button> 
                    ):null}
                  </div>

                  {/* Enable Part D */}
                  {enablePartD ? (
                  <>
                    {/* Upate Form */}
                    <form onSubmit={event => UpdatePartD(event, inspectionData?.form?.id)}>

                      {/* Date */}
                      <div className="flex items-center mt-6">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                          </label> 
                        </div>
                        <div className="w-1/4 ppa-form-view h-6">
                          {formatDate(inspectionData?.form?.after_reapir_date)}
                        </div>
                      </div>

                      {/* Remarks */}
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
                            value= {updateremarks}
                            onChange={ev => setUpdateRemarks(ev.target.value)}
                            placeholder={inspectionData?.form?.remarks}
                            className="block w-full ppa-form-edit"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-5">
                        {/* Submit */}
                        <button type="submit"
                          className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                              setEnablePartD(false); 
                              setUpdateRemarks('');
                            }} className="ml-2 py-2 px-4 btn-cancel">
                            Cancel
                          </button>
                        )}
                      </div>

                    </form>
                  </>
                  ):(
                  <>
                    {/* Check if the Status is 1120 - Inspector */}
                    {inspectionData?.form?.status === '1120' && (inspectionData?.form?.personnel_id === currentUserId.id) && !enablePartC ? (
                    <>
                      {/* Form */}
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

                      {/* Submit Button */}
                      {!enablePartC && (
                        <div className="mt-5">
                          {/* Check if the data is empty */}
                          <button type="submit" form="partDForm"
                            className={`py-2 px-3 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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

                      {/* Date */}
                      <div className="flex items-center mt-6">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Date:
                          </label> 
                        </div>
                        <div className={`w-1/4 ppa-form-view ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.after_reapir_date ? formatDate(inspectionData?.form?.after_reapir_date) 
                          : null}
                        </div>
                      </div>

                      {/* Assigned Personnel*/}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Assigned Personnel:
                          </label> 
                        </div>
                        <div className={`w-1/4 ppa-form-view font-bold italic ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.after_reapir_date ? inspectionData?.form?.personnel_name :
                          null }
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="flex items-center mt-2">
                        <div className="w-40">
                          <label className="block text-base font-bold leading-6 text-gray-900">
                          Remarks:
                          </label> 
                        </div>
                        <div className={`w-3/4 ppa-form-view ${inspectionData?.form?.after_reapir_date ? null : 'h-6' }`}>
                          {inspectionData?.form?.remarks}
                        </div>
                      </div>

                    </>
                    )}
                  </>  
                  )}

                </div>
              )}

            </div>

          </div>

          {/* Form Remarks and Buttons */}
          <div className="font-roboto ppa-form-box mt-4 bg-white">

            {/* Caption */}
            <div>
              <h2 className="ppa-form-header text-base flex justify-between items-center"> 
                {inspectionData?.form?.status === '0000' && (currentUserId.id == inspectionData?.form?.supervisor_id) ? ("Pending Approval") :
                inspectionData?.form?.status === '1200' && Admin ? ("Pending Approval") :
                ("Remarks")} 
              </h2>
            </div>

            <div className="mt-2 pb-6 p-2">

              {/* Remarks */}
              {inspectionData?.form?.status === '0000' && (currentUserId.id == inspectionData?.form?.supervisor_id) ? (
              <>
                {/* For the Supervisor */}
                {enableSupDecline ? (
                  <form id="submitSupReason" onSubmit={SubmitSupReason}>
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
                ):(
                  <div className="w-full ppa-form-remarks mt-2">Waiting for your approval</div>
                )}
              </>
              ):inspectionData?.form?.status === '1200' && Admin ? (
                <div className="w-full ppa-form-remarks mt-2">Waiting for your approval</div>
              ):(
                <div className="w-full ppa-form-remarks mt-2">
                  {inspectionData?.form?.form_remarks}
                </div>
              )}

              {/* Button */}
              {/* For the Supervisor */}
              {inspectionData?.form?.status === '0000' && (currentUserId.id == inspectionData?.form?.supervisor_id) && (
                <div className="mt-5">
                  {/* Enable Reason */}
                  {enableSupDecline ? (
                  <>
                    {/* Confirmation */}
                    <button onClick={() => handleSupDeclineConfirmation()} className="py-2 px-4 btn-default">
                      Submit
                    </button>
                    {/* Cancel */}
                    <button onClick={() => { setEnableSupDecline(false); setReason(''); }} className="ml-2 py-2 px-4 btn-cancel">
                      Cancel
                    </button>
                  </>
                  ):(
                  <>
                    {/* Approve */}
                    <button onClick={() => handleSupApprovalConfirmation()} className="py-2 px-4 btn-default">
                      Approve
                    </button>
                    {/* Decline */}
                    <button onClick={() => setEnableSupDecline(true)} className="ml-2 py-2 px-4 btn-cancel">
                      Decline
                    </button>
                  </>
                  )}
                </div>
              )}

              {/* For the Admin */}
              {inspectionData?.form?.status === '1200' && Admin && (
                <div className="mt-5">
                  {/* Approve */}
                  <button
                    onClick={() => handleAdminApprovalConfirmation()} 
                    className="py-2 px-4 btn-default"
                  >
                    Approve
                  </button>
                </div>
              )}

              {/* For the GSO */}
              {inspectionData?.form?.status === '1112' && GSO && (
                <div className="mt-5">
                  {/* Close */}
                  <button
                    onClick={() => handleCloseRequest()} 
                    className="py-2 px-4 btn-default"
                  >
                    Close Request
                  </button>
                </div>
              )}

              {/* Generate PDF by GSO */}
              {inspectionData?.form?.status === '1111' && GSO && (
                <div className="mt-5">
                  <button type="button" onClick={handleButtonClick}
                    className={`px-4 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Generating</span>
                      </div>
                    ) : (
                      'Get PDF'
                    )}
                  </button>
                </div>
              )}

            </div>

          </div>

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
                <div style={{ width: '210mm', height: '297mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

                  {/* Control Number */}
                  <div className="title-area font-arial pr-6 text-right pb-4 pt-2">
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
                        <div className="text-xs p-1">Date of Effectivity: {formatDate(inspectionData?.form?.date_request)}</div>
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
                                    <img 
                                      src={inspectionData?.supervisor_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
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
                                <span>{formatDate(inspectionData?.form?.date_of_filling)}</span>
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
                                <span>{inspectionData?.form?.date_of_last_repair ? (formatDate(inspectionData?.form?.date_of_last_repair)):("N/A")}</span>
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
                                <span>{inspectionData?.form?.nature_of_last_repair ? (inspectionData?.form?.nature_of_last_repair):("N/A")}</span>
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
                                      src={inspectionData?.gso_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
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
                                    <img 
                                      src={inspectionData?.admin_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
                                    <span className="text-base font-bold">{inspectionData?.admin_name}</span>
                                  </div>
                                  <label htmlFor="type_of_property" className="block text-center font-normal italic text-xs"> Admin Division Manager </label>
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
                                <span>{inspectionData?.form?.findings}</span>
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
                                <span>{inspectionData?.form?.recommendations}</span>
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
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <span className="text-base">{formatDate(inspectionData?.form?.before_repair_date)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* For Supervisor Signature */}
                              <div className="col-span-1">
                                <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                                <div className="mt-5">
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <img 
                                      src={inspectionData?.assign_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
                                    <span className="text-base font-bold">{inspectionData?.form?.personnel_name}</span>
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
                                <div className="mt-5">
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <span className="text-base">{formatDate(inspectionData?.form?.after_reapir_date)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* For Supervisor Signature */}
                              <div className="col-span-1">
                                <label htmlFor="type_of_property" className="block text-sm font-normal leading-6"> NOTED: </label>
                                <div className="mt-5">
                                  <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                                    <img 
                                      src={inspectionData?.assign_esig} 
                                      alt="User Signature" 
                                      className="ppa-esignature-form" 
                                    />
                                    <span className="text-base font-bold">{inspectionData?.form?.personnel_name}</span>
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

                </div>
              </div>
            </div>
          </div>
          )}

        </PageComponent>
      ):(
        (() => { window.location = '/unauthorize'; return null; })()
      )
    ):(
      (() => { window.location = '/404'; return null; })()
    )
  );
}