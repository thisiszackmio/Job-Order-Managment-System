import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import ppa_logo from '/default/ppa_logo.png'
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";
import Restrict from "../../../components/Restrict";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faFilePdf, faLock } from '@fortawesome/free-solid-svg-icons';

export default function FacilityForm(){
  // Get the ID
  const {id} = useParams();

  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(timeString) {
    if (!timeString) {
      return ''; // or handle the case when timeString is undefined
    }
  
    const [hours, minutes, seconds] = timeString.split(':');
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

  // Time setting
  function setTime(timeString) {
    if (!timeString) {
      return ''; // Handle undefined or empty cases
    }
  
    const [hours, minutes] = timeString.split(':'); // Extract hours and minutes
    return `${hours}:${minutes}`; // Return H:i format
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperHacker = codes.includes("HACK");
  const roles = ["AM", "GSO", "HACK", "DM", "PM"];
  const accessOnly = roles.some(role => codes.includes(role));

  const [loading, setLoading] = useState(true);
  const [facData, setFacData] = useState([]);
  const [enableAdminDecline, setEnableAdminDecline] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [enableGSO, setEnableGSO] = useState(false);
  const [enableAmOPR, setEnableAmOPR] = useState(false);
  const [enableGsoOPR, setEnableGsoOPR] = useState(false);
  const [fieldMissing, setFieldMissing] = useState({});

  // Form Button Action
  const [enableForm, setEnableForm] = useState(false);
  const [enableApprove, setEnableApprove] = useState(false);
  const [enableDisapprove, setEnableDisapprove] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [enableDelete, setEnableDelete] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Variable
  const [oprInstruct, setOprInstruct] = useState('');
  const [oprAction, setOprAction] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  // Set Access
  const [access, setAccess] = useState('');
  const [dataAccess, setDataAccess] = useState(null);

  //Facility Room
  const [reqOffice, setRegOffice] = useState('');
  const [titleReq, setTitleReq] = useState('');
  const [checkTable, setCheckTable] = useState(() => Boolean(facData?.form?.table));
  const [NoOfTable, setNoOfTable] = useState('');
  const [checkChairs, setCheckChairs] = useState(() => Boolean(facData?.form?.chair));
  const [NoOfChairs, setNoOfChairs] = useState('');
  const [checkProjector, setCheckProjector] = useState(() => Boolean(facData?.form?.projector));
  const [checkProjectorScreen, setCheckProjectorScreen] = useState(() => Boolean(facData?.form?.projector_screen));
  const [checkDocumentCamera, setCheckDocumentCamera] = useState(() => Boolean(facData?.form?.document_camera));
  const [checkLaptop, setCheckLaptop] = useState(() => Boolean(facData?.form?.laptop));
  const [checkTelevision, setCheckTelevision] = useState(() => Boolean(facData?.form?.television));
  const [checkSoundSystem, setCheckSoundSystem] = useState(() => Boolean(facData?.form?.sound_system));
  const [checkVideoke, setCheckVideoke] = useState(() => Boolean(facData?.form?.videoke));
  const [checkMicrphone, setCheckMicrphone] = useState(() => Boolean(facData?.form?.microphone));
  const [NoOfMicrophone, setNoOfMicrophone] = useState('');
  const [checkOther, setCheckOther] = useState(() => Boolean(facData?.form?.others));
  const [OtherField, setOtherField] = useState('');

 // Dormitory
  const [getMale, setGetMale] = useState(facData?.form?.name_male ?? "");
  const [getFemale, setGetFemale] = useState(facData?.form?.name_female ?? "");
  const [otherDetails, setOtherDetails] = useState(facData?.form?.other_details ?? "");

  // Default Checkboxes
  useEffect(() => {
    setCheckTable(Boolean(facData?.form?.table));
    setCheckChairs(Boolean(facData?.form?.chair));
    setCheckLaptop(Boolean(facData?.form?.laptop));
    setCheckMicrphone(Boolean(facData?.form?.microphone));
    setCheckOther(Boolean(facData?.form?.others));
    setCheckProjector(Boolean(facData?.form?.projector));
    setCheckProjectorScreen(Boolean(facData?.form?.projector_screen));
    setCheckDocumentCamera(Boolean(facData?.form?.document_camera));
    setCheckTelevision(Boolean(facData?.form?.television));
    setCheckSoundSystem(Boolean(facData?.form?.sound_system));
    setCheckVideoke(Boolean(facData?.form?.videoke));
  },[
    facData?.form?.laptop,
    facData?.form?.table,
    facData?.form?.chair,
    facData?.form?.microphone,
    facData?.form?.others,
    facData?.form?.projector,
    facData?.form?.projector_screen,
    facData?.form?.document_camera,
    facData?.form?.television,
    facData?.form?.sound_system,
    facData?.form?.videoke
  ]);

  // Update state when facData updates
  useEffect(() => {
    setGetMale(facData?.form?.name_male ?? "");
    setGetFemale(facData?.form?.name_female ?? "");
    setOtherDetails(facData?.form?.other_details ?? "");
  }, [
    facData?.form?.name_male,
    facData?.form?.name_female,
    facData?.form?.other_details
  ]);

  const handleInputTableChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfTable(inputValue);
  };

  const handleInputChairChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfChairs(inputValue);
  };

  const handleInputMicrophoneChange = (event) => {
    // Extract the input value and convert it to a number
    let inputValue = parseInt(event.target.value, 10);

    // If the input value is below 0, set it to 0
    if (inputValue < 0 || isNaN(inputValue)) {
      inputValue = 0;
    }

    // Update the state with the sanitized input value
    setNoOfMicrophone(inputValue);
  };
  
  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

  // OPR Instruction
  useEffect(() => {
    const hasFilledFieldsAM = [
      oprInstruct, 
    ].some(value => value?.trim() !== "");
  
    // Show button if at least one field has a value
    setEnableApprove(!hasFilledFieldsAM);
  }, [
    oprInstruct, 
  ]);

  // OPR Form Disapproval
  useEffect(() => {
    const hasFilledFieldsAMDis = [
      declineReason,
      deleteReason 
    ].some(value => value?.trim() !== "");
  
    // Show button if at least one field has a value
    setEnableDisapprove(!hasFilledFieldsAMDis);
  }, [
    declineReason,
    deleteReason 
  ]);

  // OPR Action
  useEffect(() => {
    const hasFilledFieldsGSO = [
      oprAction, 
    ].some(value => value?.trim() !== "");
  
    // Show button if at least one field has a value
    setEnableGSO(!hasFilledFieldsGSO);
  }, [
    oprAction, 
  ]);

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

  // Get the Data on the database
  const fecthFacilityVenue = () => {
    axiosClient
    .get(`/showfacvenrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const form = responseData.form;

      const AdminEsig = responseData.admin_esig;
      const AdminName = responseData.admin_name;

      const ReqEsig = responseData.req_esig;
      const ReqName = responseData.req_name;
      const ReqPosition = responseData.req_position;

      const maleGuest = form?.name_male;
      const maleCount = maleGuest ? maleGuest.split('\n') : [];

      const femaleGuest = form?.name_female;
      const femaleCount = femaleGuest ? femaleGuest.split('\n') : [];

      const userAccess = form?.user_id == currentUserId && "me";
      
      setFacData({
        form,
        AdminEsig,
        AdminName,
        ReqEsig,
        ReqName,
        ReqPosition,
        maleGuest,
        maleCount,
        femaleGuest,
        femaleCount
      });

      // Restrictions Condition 
      // facData?.form?.user_id == currentUserId && accessOnly ? "Access" : "Denied"
      const myAccess = userAccess == "me" || accessOnly ? "Access" : "Denied";
      setDataAccess(null);
      setAccess(myAccess);

    })
    .catch((error) => {
      if(error.response.data.error == "No-Form"){ // The Form doesn't exist
        setDataAccess('Not-Found');
        window.location = '/404';
      }
    })
    .finally(() => {
      setLoading(false);
      setButtonHide(false);
    });
  }
 
  // Edit Form 
  function editFacilityForm(ev){
    ev.preventDefault();
    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      request_office: reqOffice ? reqOffice : facData?.form?.request_office,
      title_of_activity: titleReq ? titleReq : facData?.form?.title_of_activity,
      table: checkTable,
      no_table: checkTable ? NoOfTable ? NoOfTable : facData?.form?.no_table : null,
      chair: checkChairs,
      no_chair: checkChairs ? NoOfChairs ? NoOfChairs : facData?.form?.no_chair : null,
      microphone: checkMicrphone,
      no_microphone: checkMicrphone ? NoOfMicrophone ? NoOfMicrophone : facData?.form?.no_microphone : null,
      projector: checkProjector,
      projector_screen: checkProjectorScreen,
      document_camera: checkDocumentCamera,
      laptop: checkLaptop,
      television: checkTelevision,
      sound_system: checkSoundSystem,
      videoke: checkVideoke,
      others: checkOther,
      specify: checkOther ? OtherField ? OtherField : facData?.form?.specify : null,
      name_male: getMale,
      name_female: getFemale,
      other_details: otherDetails
    };

    axiosClient
    .put(`/editfacrequest/${id}`, data)
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">Form update successfully!</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if(error.response.data.error === "Disapprove"){
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Ooops!</p>
            <p className="popup-message">This request has been disapproved by the Admin Manager.</p>
          </div>
        );
        setShowPopup(true);
        return;
      }else if(error.response.data.error === "Approve"){
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Ooops!</p>
            <p className="popup-message">You can no longer edit this request.</p>
          </div>
        );
        setShowPopup(true);
        return;
      }else if(error.response.data.error === "Deleted"){
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Ooops!</p>
            <p className="popup-message">This form has already been deleted!</p>
          </div>
        );
        setShowPopup(true);
        return;
      }else{
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);  
        return; 
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Set to Default Form
  function handleDefaultForm(){
    setGetMale(facData?.form?.name_male);
    setGetFemale(facData?.form?.name_female);
    setOtherDetails(facData?.form?.other_details);
  }

  // Submit OPR Instruct for the Admin
  function oprInstructSubmit(ev, id){
    ev.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/oprinstruct/${id}`,{
      oprInstruct:oprInstruct,
      user_id: currentUserId,
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The OPR instruction has been completed, and the form has been approved.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if(error.response.data.error == "Deleted"){
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">This form has already been deleted by the GSO.</p>
          </div>
        );
        setShowPopup(true);
      }else{
        setPopupContent("error");
        setPopupMessage(DevErrorText);
        setShowPopup(true);  
      } 
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Edit OPR Instruct for the Admin
  function oprEditInstruct(ev, id){
    ev.preventDefault();
    setSubmitLoading(true);
    axiosClient
    .put(`/editoprinstruct/${id}`,{
      oprInstruct:oprInstruct,
      user_id: currentUserId,
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The OPR instruction has been completed, and the form has been approved.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      const responseErrors = error.response.data.errors;

      if(responseErrors){
        setFieldMissing(responseErrors);
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

  // Submit OPR Action for the GSO
  function oprActionSubmit(ev, id){
    ev.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/opraction/${id}`,{
      oprAction:oprAction,
      user_id:currentUserId
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The OPR Action has been stored in the database.</p>
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

  // Edit OPR Action for the GSO
  function oprEditAction(ev, id){
    ev.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/editopraction/${id}`,{
      oprAction:oprAction,
      user_id:currentUserId
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The OPR Action has been stored in the database.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      const responseErrors = error.response.data.errors;

      if(responseErrors){
        setFieldMissing(responseErrors);
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

  // Decline Popup
  const handleAdminDeclineConfirmation = () => {
    setShowPopup(true);
    setPopupContent('amif');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to disapprove {facData?.form?.user_name}'s request? It cannot be undone.</p>
      </div>
    );
  }

  // Enable Decline Reason
  function submitAdminDecline(event){
    event.preventDefault();

    setSubmitLoading(true);
    if(!declineReason){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Invalid</p>
          <p className="popup-message">Please input the reason of your disapproval</p>
        </div>
      );
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/adminfacdisapproval/${facData?.form?.id}`, {
        remarks: declineReason
      })
      .then(() => {
        setButtonHide(true);
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

  // Delete Confirmation
  function handleDeleteFormContirmation(){
    setShowPopup(true);
    setPopupContent('gsodelete');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to delete {facData?.form?.user_name}'s request? It cannot be undone.</p>
      </div>
    );
  }

  // Delete Form
  function DeleteFormRequest(ev){
    ev.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/closefacilityforce/${id}`, {
      user_name: currentUserName.name,
      deleteReason: deleteReason
    })
    .then(() => {
      setButtonHide(true);
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form has been deleted.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if (error.response.status === 408) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Already Approved!</p>
            <p className="popup-message">You cannot delete the form once the admin approves it.</p>
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

  // Close Form Popup 
  const handleCloseForm = () => {
    setShowPopup(true);
    setPopupContent('gsofcv');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation?</p>
        <p className="popup-message">Do you want to close the request?</p>
      </div>
    );
  }

  // Close Form Function
  function CloseForm(id){
    setSubmitLoading(true);
    
    axiosClient
    .put(`/closefacility/${id}`, {
      user_name:currentUserName.name
    })
    .then(() => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form is closed.</p>
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
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  useEffect(() => { 
    if(currentUserId){
      fecthFacilityVenue();
    }
    
  }, [id, currentUserId]);

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Facility-Control-No:${id}`
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

 return(
  <PageComponent title="Facility / Venue Request Form">
    {/* Form */}
    {loading && (
      <div className="pre-loading-screen z-50 relative flex justify-center items-center">
        <img className="mx-auto h-32 w-auto absolute" src={loadingAnimation} alt="Your Company" />
        <img className="mx-auto h-16 w-auto absolute ppg-logo-img" src={ppalogo} alt="Your Company" />
      </div>
    )}

    {dataAccess != 'Not-Found' ? (
      (loading || access === "Access") ? (
        <div className="font-roboto">

          {/* Status */}
          <div className="text-right">
            {(facData?.form?.admin_approval == 0 || facData?.form?.admin_approval == 2 || facData?.form?.admin_approval == 1) && ("Status: Approve")}
            {facData?.form?.admin_approval == 3 && ("Status: Disapprove")}
            {facData?.form?.admin_approval == 4 && ("Status: Pending Approval")}
            {facData?.form?.admin_approval == 5 && ("Status: Deleted")}
          </div>

          {/* Header */}
          <div className="ppa-form-header text-base flex justify-between items-center">
            <span>Control No: <span className="px-2 ppa-form-view">{facData?.form?.id}</span></span>
            <div className="flex space-x-4"> 
              {/* For the GSO */}
              {GSO && (
              <>
                {/* Delete Form */}
                {facData?.form?.admin_approval != 0 && facData?.form?.admin_approval != 1 && facData?.form?.admin_approval != 3 && facData?.form?.admin_approval != 5 && (
                  <FontAwesomeIcon
                    onClick={() => {
                      setEnableDelete(true); 
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                    className="icon-delete" title="Delete request" icon={faTrash} />
                
                )}
                {/* Closed Form */}
                {facData?.form?.admin_approval == 1 && (
                  <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-delete" title="Close request" icon={faLock} />
                )}
                {/* Generate PDF */}
                {facData?.form?.admin_approval != 1 && facData?.form?.admin_approval != 2 && (
                  <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
                )}
              </>
              )}
              {/* For the Requestor on Generate PDF */}
              {(facData?.form?.user_id == currentUserId || SuperHacker) && facData?.form?.admin_approval == 0 && !GSO && (
                <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF (A4 size)" icon={faFilePdf} />
              )}
              {/* For the GSO and SuperHacker Edit the Form */}
              {(SuperHacker || GSO) && !enableForm && facData?.form?.admin_approval != 0 && facData?.form?.admin_approval != 3 && facData?.form?.admin_approval != 2 && facData?.form?.admin_approval != 1 && facData?.form?.admin_approval != 5 && (
                <FontAwesomeIcon onClick={() => setEnableForm(true)} className="icon-delete" title="Edit" icon={faPenToSquare} />
              )}
            </div>
          </div>

          <div className="ppa-form-box bg-white">
            <form id="editForm" onSubmit={editFacilityForm}>

              {/* Part A */}
              <div className="p-4 pr-64">
                {enableForm ? (
                <>
                  <div className="text-sm mb-5"> <span className="ass">*</span> - forms that are editable</div>

                  {/* Date */}
                  <div className="flex items-center font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                        Date:
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={formatDate(facData?.form?.created_at)}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Requesting Office/Division */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rf_request" className="block text-base font-bold leading-6 text-black">
                        <span className="ass">*</span> Requesting Office/Division:
                      </label>
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rf_request"
                        id="rf_request"
                        autoComplete="rf_request"
                        defaultValue={facData?.form?.request_office}
                        onChange={ev => setRegOffice(ev.target.value)}
                        className={`block w-full ppa-form-edit`}
                      />
                    </div>
                  </div>

                  {/* Title/Purpose of Activity */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_title" className="block text-base font-bold leading-6 text-black">
                      <span className="ass">*</span> Title/Purpose of Activity:
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_title"
                        id="rep_title"
                        autoComplete="rep_title"
                        defaultValue={facData?.form?.title_of_activity}
                        onChange={ev => setTitleReq(ev.target.value)}
                        className={`block w-full ppa-form-edit`}
                      />
                    </div>
                  </div>

                  {/* Date Start */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                        Date of Activity (Start):
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={formatDate(facData?.form?.date_start)}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Time Start */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                      Time of Activity (Start):
                      </label> 
                    </div>
                    <div className="w-1/2">
                    <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={formatTime(facData?.form?.time_start)}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Date End */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold font-bold leading-6 text-black">
                      Date of Activity (End):
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={formatDate(facData?.form?.date_end)}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Time End */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                      Time of Activity (End):
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={formatTime(facData?.form?.time_end)}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Facility */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                        Facility Request:
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={
                          facData?.form?.mph ? "Multi-Purpose Hall (MPH)" :
                          facData?.form?.conference ? "Conference Room" :
                          facData?.form?.dorm ? "Dormitory" :
                          facData?.form?.other ? "Other" : ""
                        }
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Requestor */}
                  <div className="flex items-center mt-2 font-roboto">
                    <div className="w-56">
                      <label htmlFor="rep_date" className="block text-base font-bold leading-6 text-black">
                        Requestor:
                      </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="rep_date"
                        id="rep_date"
                        value={facData?.form?.user_name}
                        className="block w-full ppa-form-edit"
                        readOnly
                      />
                    </div>
                  </div>
                </>
                ):(
                <>
                  {/* Date */}
                  <div className="flex items-center">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900">
                      Date:
                      </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6">
                      {!loading && formatDate(facData?.form?.created_at)}
                    </div>
                  </div>

                  {/* Request Office */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Requesting Office/Division: </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6"> 
                      {!loading && facData?.form?.request_office}
                    </div>
                  </div>

                  {/* Title of Activity */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Title of Activity: </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6"> 
                      {!loading && facData?.form?.title_of_activity}
                    </div>
                  </div>

                  {/* Date of Activity */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Date of Activity: </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6"> 
                    {!loading && (
                      facData?.form?.date_start === facData?.form?.date_end ? (
                        formatDate(facData?.form?.date_start)
                      ):(
                        `${formatDate(facData?.form?.date_start)} to ${formatDate(facData?.form?.date_end)}`
                      )
                    )}
                    </div>
                  </div>

                  {/* Time of Activity */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Time of Activity (START and END): </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6"> 
                      {!loading && (
                        facData?.form?.date_start === facData?.form?.date_end ? (
                          `${formatTime(facData?.form?.time_start)} to ${formatTime(facData?.form?.time_end)}`
                        ):(
                          `${formatDate(facData?.form?.date_start)} (${formatTime(facData?.form?.time_start)}) to ${formatDate(facData?.form?.date_end)} (${formatTime(facData?.form?.time_end)})`
                        )
                      )}
                    </div>
                  </div>

                  {/* Facility Request */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Facility Request: </label> 
                    </div>
                    <div className="w-full ppa-form-view h-6"> 
                    {!loading && (
                    <>
                      {facData?.form?.mph ? ("Multi-Purpose Hall (MPH)"):null}
                      {facData?.form?.conference ? ("Conference Room"):null}
                      {facData?.form?.dorm ? ("Dormitory"):null}
                      {facData?.form?.other ? ("Other"):null}
                    </>
                    )}
                    </div>
                  </div>

                  {/* Requestor */}
                  <div className="flex items-center mt-2">
                    <div className="w-[430px]">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Requestor: </label> 
                    </div>
                    <div className="w-full font-bold ppa-form-view h-6"> 
                      {!loading && facData?.form?.user_name}
                    </div>
                  </div>
                </>
                )}
              </div>

              {/* Facilities */}
              {(facData?.form?.mph || facData?.form?.conference || facData?.form?.other) ? (
                <div className="mt-4 p-4 border-t border-gray">
                  {/* Caption */}
                  <div> <h2 className="text-base font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others </h2> </div>

                  {/* Form */}
                  {enableForm ? (
                    <div className="grid grid-cols-2">
                      {/* 1st Column */}
                      <div className="col-span-1 ml-10">
                        {/* Table */}
                        <div className="relative flex items-center mt-4">
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checktable"
                              name="mph-checktable"
                              type="checkbox"
                              checked={checkTable}
                              onChange={() => {
                                setCheckTable(prev => !prev);
                                if (!checkTable) {
                                  setNoOfTable('');
                                }
                              }}
                              className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                              Tables
                            </label> 
                          </div>
                          {checkTable && (
                            <div className="flex items-center w-32 ml-2">
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                                (No. 
                              </label> 
                              <input
                                type="number"
                                name="no-of-table"
                                id="no-of-table"
                                defaultValue={facData?.form?.no_table}
                                onChange={handleInputTableChange}
                                className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                              />
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                                ) 
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Chair */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checkchair"
                              name="mph-checkchair"
                              type="checkbox"
                              checked={checkChairs}
                              onChange={() => {
                                setCheckChairs(prev => !prev);
                                if (!checkChairs) {
                                  setNoOfChairs('');
                                }
                              }}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                              Chair
                            </label> 
                          </div>
                          {checkChairs && (
                            <div className="flex items-center w-32 ml-2">
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                                (No. 
                              </label> 
                              <input
                                type="number"
                                name="no-of-chair"
                                id="no-of-chair"
                                defaultValue={facData?.form?.no_chair}
                                onChange={handleInputChairChange}
                                className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                              />
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                                ) 
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Projector */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="checkbox-projector"
                              type="checkbox"
                              checked={checkProjector}
                              onChange={() => setCheckProjector(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Projector
                            </label> 
                          </div>
                        </div>

                        {/* Projector Screen */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkProjectorScreen}
                              onChange={() => setCheckProjectorScreen(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Projector Screen
                            </label> 
                          </div>
                        </div>

                        {/* Document Camera */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkDocumentCamera}
                              onChange={() => setCheckDocumentCamera(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Document Camera
                            </label> 
                          </div>
                        </div>
                      </div>

                      {/* 2nd Column */}
                      <div className="col-span-1 ml-10">
                        {/* Laptop */}
                        <div className="relative flex items-center mt-4">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkLaptop}
                              onChange={() => setCheckLaptop(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Laptop
                            </label> 
                          </div>
                        </div>

                        {/* Television */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkTelevision}
                              onChange={() => setCheckTelevision(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Television
                            </label> 
                          </div>
                        </div>

                        {/* Sound System */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkSoundSystem}
                              onChange={() => setCheckSoundSystem(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Sound System
                            </label> 
                          </div>
                        </div>

                        {/* Videoke */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkVideoke}
                              onChange={() => setCheckVideoke(prev => !prev)}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Videoke
                            </label> 
                          </div>
                        </div>
                            
                        {/* Microphone */}
                        <div className="relative flex items-center mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checkmicrophone"
                              name="mph-checkmicrophone"
                              type="checkbox"
                              checked={checkMicrphone}
                              onChange={() => {
                                setCheckMicrphone(prev => !prev);
                                if (!checkMicrphone) {
                                  setNoOfMicrophone('');
                                }
                              }}
                              className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                            Microphone
                            </label> 
                          </div>
                          {checkMicrphone && (
                            <div className="flex items-center w-32 ml-2">
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900">
                                (No. 
                              </label> 
                              <input
                                type="number"
                                name="no-of-microphone"
                                id="no-of-microphone"
                                defaultValue={facData?.form?.no_microphone}
                                onChange={handleInputMicrophoneChange}
                                className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                              />
                              <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                                ) 
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Other */}
                      <div className="relative flex items-center mt-2 ml-10">
                        <div className="flex items-center h-5">
                          <input
                            id="mph-checkmicrophone"
                            name="mph-checkmicrophone"
                            type="checkbox"
                            defaultChecked={Boolean(facData.form.others)}
                            onChange={() => {
                              setCheckOther(!checkOther);
                            }}
                            className={`focus:ring-gray-400 h-6 w-6 border-black-500 rounded`}
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                          Others
                          </label> 
                        </div>
                        {checkOther && (
                          <div className="flex items-center w-full ml-2">
                            <input
                              type="text"
                              name="other-specfic"
                              id="other-specfic"
                              placeholder="Please Specify"
                              defaultValue={facData?.form?.specify}
                              onChange={ev => setOtherField(ev.target.value)}
                              className="block w-full border-l-0 border-t-0 border-r-0 ml-1 py-0 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                            />
                            <label htmlFor="rf_request" className="block text-base font-medium leading-6 text-gray-900 ml-1">
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ):(
                  <>
                    <div className="grid grid-cols-2">
                      {/* Left */}
                      <div className="col-span-1 ml-10">
                        {/* Table */}
                        <div className="mt-4">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.table ? 'X':null}
                            </div>
                            <div className="w-12 ml-1 font-bold justify-center">
                              <span>Tables</span>
                            </div>
                            <div className="w-30 ml-2">
                            (No.<span className="border-b border-black px-5 font-bold text-center"> 
                              {facData?.form?.no_table ? facData?.form?.no_table : null} 
                            </span>)
                            </div>
                          </div>
                        </div>

                        {/* Chair */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.chair ? 'X':null}
                            </div>
                            <div className="w-12 ml-1 font-bold justify-center">
                              <span>Chairs</span>
                            </div>
                            <div className="w-30 ml-2">
                            (No.<span className="border-b border-black px-5 font-bold text-center"> 
                              {facData?.form?.no_chair ? facData?.form?.no_chair : null} 
                            </span>)
                            </div>
                          </div>
                        </div>

                        {/* Projector */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.projector ? 'X':null}
                            </div>
                            <div className="w-12 ml-1 font-bold justify-center">
                              <span>Projector</span>
                            </div>
                          </div>
                        </div>

                        {/* Projector Screen */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.projector_screen ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Projector Screen</span>
                            </div>
                          </div>
                        </div>

                        {/* Document Camera */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.document_camera ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Document Camera</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="col-span-1">
                        {/* Laptop */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.laptop ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Laptop</span>
                            </div>
                          </div>
                        </div>

                        {/* Television */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.television ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Television</span>
                            </div>
                          </div>
                        </div>

                        {/* Sound System */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.sound_system ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Sound System</span>
                            </div>
                          </div>
                        </div>

                        {/* Videoke */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.videoke ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Videoke</span>
                            </div>
                          </div>
                        </div>

                        {/* Microphone */}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="ppa-checklist">
                            {facData?.form?.microphone ? 'X':null}
                            </div>
                            <div className="w-22 ml-1 font-bold justify-center">
                              <span>Microphone</span>
                            </div>
                            <div className="w-30 ml-2">
                            (No.<span className="border-b border-black px-5 font-bold text-center"> 
                              {facData?.form?.no_microphone ? facData?.form?.no_microphone : null} 
                            </span>)
                            </div>
                          </div>
                        </div>
                      </div> 
                    </div>

                    {/* Others */}
                    <div className="mt-2 ml-10">
                      <div className="w-full">
                        <div className="mt-1">
                          <div className="flex items-center">
                            <div className="w-12 ppa-checklist">
                              {facData?.form?.others === 1 ? 'X':null}
                            </div>
                            <div className="w-12 ml-1 font-bold justify-center">
                              <span>Others</span>
                            </div>
                            <div className="w-1/2 h-6 border-b p-0 pl-2 border-black text-sm text-left ml-4 ">
                            <span className=""> {facData?.form?.specify ? facData?.form?.specify:null} </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  )}
                </div>
              ):null}

              {/* For Dormitory */}
              {facData?.form?.dorm ? (
                <div className="mt-4 p-4 border-t border-gray">
                  {/* Caption */}
                  <div> <h2 className="text-base font-bold leading-7 text-gray-900"> * For the Dormitory </h2> </div>

                  {enableForm ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Male */}
                      <div className="col-span-1">
                        <div className="mt-6">
                          <div className="mb-4">
                            <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Male guests:</strong> </label>
                          </div>
                          {/* Show on the Form */}
                          <textarea
                            id="dorm-male-list"
                            name="dorm-male-list"
                            rows={5}
                            value={getMale}
                            onChange={ev => setGetMale(ev.target.value)}
                            style={{ resize: 'none' }}
                            className="block w-10/12 ppa-form"
                          />
                          <p className="text-red-500 text-xs mt-1">Separate name on next line</p>
                        <div>
                        </div>
                        </div>
                      </div>

                      {/* Female */}
                      <div className="col-span-1">
                        <div className="mt-6">
                          <div className="mb-4">
                            <label htmlFor="type_of_property" className="block text-base font-medium leading-6 text-gray-900"> <strong>Female guests:</strong> </label>
                          </div>
                          {/* Show on the Form */}
                          <textarea
                            id="dorm-female-list"
                            name="dorm-female-list"
                            rows={5}
                            value={getFemale}
                            onChange={ev => setGetFemale(ev.target.value)}
                            style={{ resize: 'none' }}
                            className="block w-10/12 ppa-form"
                          />
                          <p className="text-red-500 text-xs mt-1">Separate name on next line</p>
                        </div>
                      </div>
                    </div>

                    {/* For Other */}
                    <div className="flex mt-10">
                      <div className="w-40">
                        <label htmlFor="recomendations" className="block text-base font-bold leading-6 text-gray-900">
                          Other Details :
                        </label>
                      </div>
                      <div className="w-3/4">
                        <textarea
                          id="recomendations"
                          name="recomendations"
                          rows={3}
                          style={{ resize: "none" }}
                          value={otherDetails}
                          onChange={ev => setOtherDetails(ev.target.value)}
                          className="block w-full ppa-form"
                        />
                        <p className="text-red-500 text-xs mt-1">Leave blank if none</p>
                      </div>  
                    </div>
                  </>
                  ):(
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {/* For Male */}
                      <div className="col-span-1">

                        {/* Male Guest */}
                        <div className="mt-6">
                          <div className="flex items-center">
                            <div className="font-bold">
                              Number of Male Guest:
                            </div>
                            <div className="w-10 ppa-form-list text-center font-bold ml-4 h-6">
                              <span>
                                {facData?.maleGuest ? facData?.maleCount?.length : null}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Male Guest List */}
                        <div className="w-3/4 p-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="flex items-center mt-2">
                            <span className="font-bold">{`${index + 1}.`}</span>
                            <div className="w-full ppa-form-list ml-3 h-6">
                              {facData?.maleCount?.[index] 
                                ? facData.maleCount[index].replace(/^\d+\.\s*/, '') 
                                : ''} {/* Empty when data is missing */}
                            </div>
                          </div>
                        ))}
                        </div>

                      </div>

                      {/* Female Guest */}
                      <div className="col-span-1">

                      {/* Female Guest */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <div className="font-bold">
                            Number of Female Guest:
                          </div>
                          <div className="w-10 ppa-form-list text-center font-bold ml-4 h-6">
                            <span>
                              {facData?.femaleGuest ? facData?.femaleCount?.length : null}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Female Guest List */}
                      <div className="w-3/4 p-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span className="font-bold">{`${index + 1}.`}</span>
                          <div className="w-full ppa-form-list ml-3 h-6">
                            {facData?.femaleCount?.[index] 
                              ? facData.femaleCount[index].replace(/^\d+\.\s*/, '') 
                              : ''} {/* Empty when data is missing */}
                          </div>
                        </div>
                      ))}
                      </div>

                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="mt-4 ml-16">
                      <div className="flex">
                        <div className="w-28 text-base">
                          <span>Other Details:</span>
                        </div>
                        <div className="w-3/4 border-b border-black font-regular text-base text-left pl-2">
                        {facData?.form?.other_details}
                        </div>
                      </div>
                    </div>
                  </>
                  )}
                </div>
              ):null}

            </form>

            {/* Button */}
            {enableForm && (
              <div className="ml-4 mt-10">
                {!buttonHide && (
                <>
                  <div className="text-sm mb-4"> <span className="ass font-bold">Note: The form cannot be edited once the Admin Manager approves it.</span></div>
                  {/* Update */}
                  <button 
                    type="submit"
                    form="editForm"
                    className={`py-2 px-3 mr-2 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Loading</span>
                      </div>
                    ) : (
                      'Update'
                    )}
                  </button>

                  {/* Cancel */}
                  {!submitLoading && (
                    <button 
                      onClick={() => {
                        setEnableForm(false);
                        handleDefaultForm();
                      }} 
                      className="py-2 px-4 btn-cancel-form"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
              </div>
            )}

            {/* OPR */}
            {(facData?.form?.mph || facData?.form?.conference || facData?.form?.dorm || facData?.form?.other) && (
              <div className="grid grid-cols-2 mt-4 border-t border-gray">
                {/* OPR Instruction */}
                <div className="col-span-1 border-r border-gray">
                  <div className="p-4 items-center">
                    <div className="w-80 flex">
                      <label className="block text-base font-bold leading-6 text-gray-900 mr-2">
                        Instruction for the OPR for Action:
                      </label> 
                      {Admin && (facData?.form?.admin_approval == 2 || facData?.form?.admin_approval == 1) && !enableAmOPR && (
                        <FontAwesomeIcon onClick={() => { setEnableAmOPR(true); }} className="icon-form" title="Edit" icon={faPenToSquare} />
                      )}
                    </div>
                    {enableAmOPR ? (
                    <>
                      {/* Edit */}
                      <form 
                        id="oprinstruct" 
                        className="mt-2" 
                        onSubmit={ev => oprEditInstruct(ev, facData?.form?.id)}
                      >
                        <textarea
                          id="recomendations"
                          name="recomendations"
                          rows={2}
                          style={{ resize: "none" }}
                          defaultValue={facData?.form?.obr_instruct}
                          onChange={ev => setOprInstruct(ev.target.value)}
                          className="block w-full ppa-form"
                          maxLength={255}
                          placeholder="Input here"
                        />
                        {!oprInstruct && fieldMissing.oprInstruct && (
                          <p className="form-validation">Please update the data. If not, please cancel the edit.</p>
                        )}
                      </form>

                      {/* Button */}
                      <div className="mt-2">
                      {!buttonHide && (
                      <>
                        {/* Submit */}
                        <button 
                          type="submit"
                          form="oprinstruct"
                          className={`py-2 px-3 mr-2 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
                          disabled={submitLoading || enableApprove}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ) : (
                            'Save'
                          )}
                        </button>

                        {/* Cancel */}
                        {!submitLoading && (
                          <button 
                            onClick={() => {
                              setEnableAmOPR(false);
                              setFieldMissing('');
                            }} 
                            className="py-2 px-4 btn-cancel-form"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                      )}
                      </div>
                    </>
                    ):(
                      (!facData?.form?.obr_instruct && facData?.form?.admin_approval == 4) && Admin ? (
                      <>
                        {/* Form Input the OPR Instruction */}
                        <form 
                          id="oprinstruct" 
                          className="mt-2" 
                          onSubmit={ev => oprInstructSubmit(ev, facData?.form?.id)}
                        >
                          <textarea
                            id="recomendations"
                            name="recomendations"
                            rows={2}
                            style={{ resize: "none" }}
                            value={oprInstruct}
                            onChange={ev => setOprInstruct(ev.target.value)}
                            className="block w-full ppa-form"
                            maxLength={255}
                            placeholder={!enableAdminDecline && "Input here"}
                            disabled = {enableAdminDecline}
                          />
                        </form>

                        {/* Button */}
                        <div className="mt-2">
                          {!enableAdminDecline && (
                          <>
                            {!buttonHide && (
                            <>
                              {/* Submit and Approve */}
                              <button 
                                type="submit"
                                form="oprinstruct"
                                className={`py-2 px-3 mr-2 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
                                disabled={submitLoading || enableApprove}
                              >
                                {submitLoading ? (
                                  <div className="flex">
                                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                    <span className="ml-1">Loading</span>
                                  </div>
                                ) : (
                                  'Submit and Approve'
                                )}
                              </button>

                              {/* Decline */}
                              {!submitLoading && (
                                <button 
                                  onClick={() => {
                                    setEnableAdminDecline(true);
                                  }} 
                                  className="py-2 px-4 btn-cancel-form"
                                >
                                  Decline
                                </button>
                              )}
                            </>
                            )}
                          </>
                          )}
                        </div>
                      </>
                      ):(
                        <div className="w-full ppa-form-request mt-2 ppa-form-remarks p-2" style={{ minHeight: '60px' }}>
                          {facData?.form?.obr_instruct}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* OPR Action */}
                <div className="col-span-1 ml-3">
                  <div className="p-4 items-center">
                    <div className="w-80 flex">
                      <label className="block text-base font-bold leading-6 text-gray-900 mr-2">
                      OPR Action:
                      </label> 
                      {GSO && facData?.form?.admin_approval == 1 && !enableGsoOPR && (
                        <FontAwesomeIcon onClick={() => { setEnableGsoOPR(true); }} className="icon-form" title="Edit" icon={faPenToSquare} />
                      )}
                    </div>
                    {enableGsoOPR ? (
                    <>
                      <form 
                        id="opraction" 
                        className="mt-2" 
                        onSubmit={ev => oprEditAction(ev, facData?.form?.id)}
                      >
                        <textarea
                          id="recomendations"
                          name="recomendations"
                          rows={2}
                          style={{ resize: "none" }}
                          defaultValue={facData?.form?.obr_comment}
                          onChange={ev => setOprAction(ev.target.value)}
                          className="block w-full ppa-form"
                          maxLength={255}
                          placeholder="Input here"
                        />
                        {!oprAction && fieldMissing.oprAction && (
                          <p className="form-validation">Please update the data. If not, please cancel the edit.</p>
                        )}
                      </form>

                      <div className="mt-2">
                      {!buttonHide && (
                      <>
                        {/* Submit */}
                        <button 
                          type="submit"
                          form="opraction"
                          className={`py-2 px-3 mr-2 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
                          disabled={submitLoading || enableGSO}
                        >
                          {submitLoading ? (
                            <div className="flex">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-1">Loading</span>
                            </div>
                          ) : (
                            'Save'
                          )}
                        </button>
                        {/* Cancel */}

                        {!submitLoading && (
                          <button 
                            onClick={() => {
                              setEnableGsoOPR(false);
                              setFieldMissing('');
                            }}
                            className="py-2 px-4 btn-cancel-form"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                      )}
                      </div>
                    </>
                    ):(
                      GSO && (!facData?.form?.obr_comment && facData?.form?.admin_approval == 2) ? (
                      <>
                        <form 
                          id="opraction" 
                          className="mt-2" 
                          onSubmit={ev => oprActionSubmit(ev, facData?.form?.id)}
                        >
                          <textarea
                            id="recomendations"
                            name="recomendations"
                            rows={2}
                            style={{ resize: "none" }}
                            value={oprAction}
                            onChange={ev => setOprAction(ev.target.value)}
                            className="block w-full ppa-form"
                            maxLength={255}
                            placeholder="Input here"
                          />
                        </form>

                        <div className="mt-2">
                          {!buttonHide && (
                          <>
                            <button 
                              type="submit"
                              form="opraction"
                              className={`py-2 px-3 ${submitLoading ? 'process-btn-form' : 'btn-default-form'}`}
                              disabled={submitLoading || enableGSO}
                            >
                              {submitLoading ? (
                                <div className="flex">
                                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                  <span className="ml-1">Loading</span>
                                </div>
                              ) : (
                                'Submit'
                              )}
                            </button>
                          </>
                          )}
                        </div>
                      </>
                      ):(
                        <div className="w-full ppa-form-request mt-2 ppa-form-remarks p-2" style={{ minHeight: '60px' }}>
                          {facData?.form?.obr_comment}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Disapproval by the Admin Manager */}
          {enableAdminDecline && (
            <div className="font-roboto mt-4">
              {/* Caption */}
              <div className="ppa-form-header text-base flex justify-between items-center">
                <span> Form Disapproval </span>
              </div>

              {/* Form */}
              <div className="px-2 py-4 ppa-form-box bg-white">
                <form id="adminDecline" onSubmit={submitAdminDecline} action="">
                  <div className="w-full">
                    <input
                      type="text"
                      name="reason"
                      id="reason"
                      value={declineReason}
                      onChange={ev => setDeclineReason(ev.target.value)}
                      placeholder="Input your reasons"
                      className="block w-full ppa-form"
                    />
                  </div>
                </form>

                {/* Button */}
                <div className="mt-4">
                {!buttonHide && (
                <>
                  {/* Confirmation */}
                  <button onClick={() => handleAdminDeclineConfirmation()} className="py-2 px-4 btn-default-form" disabled={enableDisapprove}>
                    Submit
                  </button>
                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => { setEnableAdminDecline(false); setDeclineReason(''); }} className="ml-2 py-2 px-4 btn-cancel-form">
                      Cancel
                    </button>
                  )}
                </>
                )}
                </div>
              </div>
            </div>
          )}

          {/* Form Disapproval by the Admin Manager */}
          {enableDelete && (
            <div className="font-roboto mt-4" id="DeleteForm">
              {/* Caption */}
              <div className="ppa-form-header text-base flex justify-between items-center">
                <span> Form Deletion </span>
              </div>

              {/* Form */}
              <div className="px-2 py-4 ppa-form-box bg-white">
                <form id="gsoDeleteForm" onSubmit={DeleteFormRequest} action="">
                  <div className="w-full">
                    <input
                      type="text"
                      name="reason"
                      id="reason"
                      value={deleteReason}
                      onChange={ev => setDeleteReason(ev.target.value)}
                      placeholder="Input your reasons"
                      className="block w-full ppa-form"
                    />
                  </div>
                </form>

                {/* Button */}
                <div className="mt-4">
                {!showPopup && (
                <>
                  {/* Confirmation */}
                  <button onClick={() => handleDeleteFormContirmation()} className="py-2 px-4 btn-default-form" disabled={enableDisapprove}>
                    Submit
                  </button>
                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => { setEnableDelete(false); setDeleteReason(''); }} className="ml-2 py-2 px-4 btn-cancel-form">
                      Cancel
                    </button>
                  )}
                </>
                )}
                </div>
              </div>
            </div>
          )}

          {/* Disapproval Reason */}
          {(facData?.form?.admin_approval == 3 || facData?.form?.admin_approval == 5) && (
            <div className="px-2 py-4 ppa-form-box bg-white mt-4">
              <div className="items-center">
                <div className="w-80 flex">
                  <label className="block text-base font-bold leading-6 text-gray-900 mr-2">
                    {facData?.form?.admin_approval == 3 ? 
                    ("Reason for Disapproval:"):
                    ("Reason for Deletion:")}
                  </label> 
                </div>
                {facData?.form?.remarks}
              </div>
            </div>
          )}

        </div>
      ):<Restrict />
    ):null}

    {/* Popup */}
    {showPopup && (
      <Popup 
        popupContent={popupContent}
        popupMessage={popupMessage}
        justClose={justClose}
        closePopup={closePopup}
        facility={facData?.form?.id}
        FacDeleteRequest={"gsoDeleteForm"}
        CloseForm={CloseForm}
        submitLoading={submitLoading}
        submitAnimation={submitAnimation}
        form={"adminDecline"}
      />
    )}

    {/* PDF Area */}
    {isVisible && (
    <div>
      <div className="hidden md:none">
        <div ref={componentRef}>
          <div className="relative" style={{ width: '210mm', height: '297mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

            {/* Control Number */}
            <div className="title-area font-arial pr-6 text-right">
              <span>Control No:</span>{" "}
              <span style={{ textDecoration: "underline", fontWeight: "900" }}>
                _______
                {facData?.form?.id}
                _______
              </span>
            </div>

            {/* Main Form */}
            <table className="w-full mt-1 border-collapse border border-black">

              {/* Title and Logo */}
              <tr>
                <td className="border border-black w-32 p-2 text-center">
                  <img src={ppa_logo} alt="My Image" className="mx-auto" style={{ width: 'auto', height: '65px' }} />
                </td>
                <td className="border text-lg w-3/5 border-black font-arial text-center">
                  <b>REQUEST FOR THE USE OF FACILITY / VENUE</b>
                </td>
                <td className="border border-black p-0 font-arial">
                  <div className="border-b text-xs border-black px-3 py-3" style={{ fontWeight: 'bold' }}>RF 03-2018 ver 1</div>
                  <div className="border-black text-xs px-3 py-3" style={{ fontWeight: 'bold' }}>DATE: {formatDate(facData?.form?.created_at)}</div>
                </td>
              </tr>

              {/* Black */}
              <tr>
                <td colSpan={3} className="border border-black p-1 font-arial"></td>
              </tr>

              {/* Form */}
              <tr>
                <td colSpan={3} className="border border-black pl-2 pr-2 pb-2 font-arial">

                  {/* Request Office/Division */}
                  <div className="mt-2">
                    <div className="flex">
                      <div className="w-60 text-sm">
                        <span>Request Office/Division:</span>
                      </div>
                      <div className="w-96 border-b border-black pl-1 text-sm">
                        <span>{facData?.form?.request_office}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title/Purpose of Activity */}
                  <div className="mt-1">
                    <div className="flex">
                      <div className="w-60 text-sm">
                        <span>Title/Purpose of Activity:</span>
                      </div>
                      <div className="w-96 border-b border-black pl-1 text-sm">
                        <span> {facData?.form?.title_of_activity} </span>
                      </div>
                    </div>
                  </div>

                  {/* Date of Activity */}
                  <div className="mt-1">
                    <div className="flex">
                      <div className="w-60 text-sm">
                        <span>Date of Activity:</span>
                      </div>
                      <div className="w-96 border-b border-black pl-1 text-sm">
                      {facData?.form?.date_start === facData?.form?.date_end ? (
                      <span> {formatDate(facData?.form?.date_start)} </span>
                      ):(
                      <span> {formatDate(facData?.form?.date_start)} to {formatDate(facData?.form?.date_end)} </span>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Time of Activity */}
                  <div className="mt-1">
                    <div className="flex">
                      <div className="w-60 text-sm">
                        <span>Time of Activity (START and END):</span>
                      </div>
                      <div className="w-96 border-b border-black pl-1 text-sm">
                      {facData?.form?.date_start === facData?.form?.date_end ? (
                      <span> {formatTime(facData?.form?.time_start)} to {formatTime(facData?.form?.time_end)}</span>
                      ):(
                      <span> {formatDate(facData?.form?.date_start)} ({formatTime(facData?.form?.time_start)}) to {formatDate(facData?.form?.date_end)} ({formatTime(facData?.form?.time_end)}) </span>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Type of Facility */}
                  <div className="mt-1">
                    <div className="flex">
                      <div className="w-full text-sm">
                        <span>Facility/ies Venue being Requested:</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Facilities */}
                  <div className="mt-4">
                    <div className="w-full">
                      <div className="grid grid-cols-4 gap-1">

                        {/* MPH */}
                        <div className="col-span-1">
                          <div className="flex items-start text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-start justify-center text-black"> 
                              {facData?.form?.mph == 1 ? 'X' : null} 
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Multi-Purpose Hall (MPH)</span>
                          </div>
                        </div>

                        {/* Conference */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {facData?.form?.conference == 1 ? 'X' : null}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Conference Room</span>
                          </div>
                        </div>

                        {/* Dorm */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {facData?.form?.dorm == 1 ? 'X' : null}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Dormitory</span>
                          </div>
                        </div>

                        {/* Other */}
                        <div className="col-span-1">
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 border border-black mr-2 flex items-center justify-center text-black">
                              {facData?.form?.other == 1 ? 'X' : null}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>Others</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </td>
              </tr>

            </table>

            {/* For Facility Room */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>
                <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2">

                  <div className="text-sm font-bold mt-1">
                    <span>* For the Multi-Purpose Hall / Conference Room / Others: </span>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="w-full">

                    <div className="grid grid-cols-2 gap-4">

                      {/* 1st Column */}
                      <div className="col-span-1 ml-36">

                        {/* Table */}
                        <div className="mt-0">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.table === 1 ? 'X':null}
                            </div>
                            <div className="w-10 text-sm mr-1 ml-1">
                              <span>Tables</span>
                            </div>
                            <div className="w-30 text-sm">
                            (No.<span className="border-b border-black px-2 text-center mr-1"> {facData?.form?.no_table ? facData?.form?.no_table:null} </span> )
                            </div>
                          </div>
                        </div>

                        {/* Chair */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black text-xs pl-1 text-center h-4">
                              {facData?.form?.chair === 1 ? 'X':null}
                            </div>
                            <div className="w-10 text-sm mr-1 ml-1">
                              <span>Chairs</span>
                            </div>
                            <div className="w-30 text-sm">
                            (No.<span className="border-b border-black px-2 text-center mr-1"> {facData?.form?.no_chair ? facData?.form?.no_chair:null} </span>)
                            </div>
                          </div>
                        </div>

                        {/* Projector */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-xs text-center h-4">
                              {facData?.form?.projector === 1 ? 'X':null}
                            </div>
                            <div className="w-10 text-sm mr-1 ml-1">
                              <span>Projector</span>
                            </div>
                          </div>
                        </div>

                        {/* Projector Screen */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black text-xs text-center h-4">
                              {facData?.form?.projector === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Projector Screen</span>
                            </div>
                          </div>
                        </div>

                        {/* Document Camera */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black text-xs text-center h-4">
                              {facData?.form?.document_camera === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Document Camera</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* 2nd Column */}
                      <div className="col-span-1">

                        {/* Laptop */}
                        <div className="mt-0">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.laptop === 1 ? 'X':null}
                            </div>
                            <div className="w-12 text-sm mr-1 ml-1">
                              <span>Laptop</span>
                            </div>
                          </div>
                        </div>

                        {/* Television */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.television === 1 ? 'X':null}
                            </div>
                            <div className="w-12 text-sm mr-1 ml-1">
                              <span>Television</span>
                            </div>
                          </div>
                        </div>

                        {/* Sound System */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.sound_system === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Sound System</span>
                            </div>
                          </div>
                        </div>

                        {/* Videoke */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.videoke === 1 ? 'X':null}
                            </div>
                            <div className="w-32 text-sm mr-1 ml-1">
                              <span>Videoke</span>
                            </div>
                          </div>
                        </div>

                        {/* Microphone */}
                        <div className="mt-1">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.microphone === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Microphone</span>
                            </div>
                            <div className="w-30 text-sm">
                            (No.<span className="border-b border-black px-2 mr-1 text-center"> {facData?.form?.no_microphone ? facData?.form?.no_microphone:null} </span>)
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Others */}
                    <div className="mt-2">
                      <div className="w-full">
                        <div className="mt-1 ml-36">
                          <div className="flex">
                            <div className="w-12 border-b border-black pl-1 text-center text-xs h-4">
                              {facData?.form?.others === 1 ? 'X':null}
                            </div>
                            <div className="w-22 text-sm mr-1 ml-1">
                              <span>Others</span>, please specify
                            </div>
                            <div className="w-1/2 border-b p-0 pl-2 border-black text-sm text-left ml-1">
                            <span className=""> {facData?.form?.specify ? facData?.form?.specify:null} </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    </div>
                  </div>

                </td>
              </tr>
            </table>

            {/* For Dormitory */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>
                <td colSpan={3} className="text-base w-full border-black font-arial text-left pl-2 pb-6">
                
                  <div className="text-sm font-bold mt-1">
                    <span>* For the Dormitory</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">

                    {/* Male Guest */}
                    <div className="col-span-1 ml-16">

                      {/* Male Count */}
                      <div>
                        <div className="flex">
                          <div className="w-10 border-b border-black font-bold text-center text-sm">
                            <span>
                              {facData?.maleGuest ? facData?.maleCount?.length : null}
                            </span>
                          </div>
                          <div className="w-full ml-2 text-sm">
                            <span>No. of Male Guests</span>
                          </div>
                        </div>
                      </div>

                      {/* Male List */}
                      <div className="mt-2">
                        <div>
                          <label htmlFor="type_of_property" className="block text-base font-bold leading-6 text-sm"> <span>Name of Guests:</span> </label>
                        </div>
                      </div>
                      {!facData?.maleGuest ? (
                        <div>
                          {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-black border-b pl-1 text-left ml-1 pl-2"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-black border-b pl-1 text-left ml-1 pl-2">
                                {facData?.maleCount?.[index]
                                  ? facData.maleCount[index].replace(/^\d+\.\s*/, '')
                                  : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                    </div>

                    {/* Female Guest */}
                    <div className="col-span-1">

                      {/* Female Count */}
                      <div>
                        <div className="flex">
                          <div className="w-10 border-b border-black font-bold text-center text-sm">
                            <span>
                              {facData?.femaleGuest ? facData?.femaleCount?.length : null}
                            </span>
                          </div>
                          <div className="w-full ml-2 text-sm">
                            <span>No. of Male Guests</span>
                          </div>
                        </div>
                      </div>

                      {/* Female List */}
                      <div className="mt-2">
                        <div>
                          <label htmlFor="type_of_property" className="block text-base font-bold leading-6 text-sm"> <span>Name of Guests:</span> </label>
                        </div>
                      </div>

                      {!facData?.femaleCount ? (
                        <div>
                          {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-full text-sm border-black border-b pl-1 text-left ml-1 pl-2"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex mt-1">
                              <span className="font-normal text-sm">{`${index + 1}.`}</span>
                              <div className="w-3/4 text-sm border-black pl-1 border-b text-left ml-1 pl-2">
                                {facData?.femaleCount?.[index]
                                  ? facData.femaleCount[index].replace(/^\d+\.\s*/, '')
                                  : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                    </div>

                  </div>

                  {/* Other Details */}
                  <div className="mt-4 ml-16">
                    <div className="flex">
                      <div className="w-24 text-sm">
                        <span>Other Details:</span>
                      </div>
                      <div className="w-3/4 border-b border-black font-regular text-sm text-left pl-2">
                      {facData?.form?.other_details}
                      </div>
                    </div>
                  </div>

                </td>
              </tr>
            </table>

            {/* Footer */}
            <table className="w-full border-collapse border border-black mt-2">
              <tr>

                {/* Requestor */}
                <td className="border border-black w-1/2 p-2">
                  <div className="text-sm font-arial">
                    Requested by:
                  </div>
                  <div className="relative">
                    <img
                      src={facData?.ReqEsig}
                      alt="Signature"
                      className="ppa-esignature-form-fac"
                    />
                  </div>
                  <div className="text-center font-bold text-base relative mt-5">
                    {facData?.ReqName}
                  </div>
                </td>

                <td className="border w-1/2 border-black">
                  <div className="text-sm font-arial ml-6">
                  {(facData?.form?.admin_approval == 1 || facData?.form?.admin_approval == 0) ? 'Approved by:' 
                    : facData?.form?.admin_approval == 2 ? 'Disapproved by:'
                    : 'Approved / Disapproved by:' }
                  </div>
                  <div className="relative">
                    {(facData?.form?.admin_approval == 1 || facData?.form?.admin_approval == 0) && (
                      <img
                        src={facData?.AdminEsig}
                        className="ppa-esignature-form-fac"
                        alt="Signature"
                      />
                    )}
                  </div>
                  <div className="text-center font-bold text-base relative mt-5">
                    {facData?.AdminName}
                  </div>
                </td>

              </tr>
              <tr>
                <td className="border border-black w-1/2 text-center text-sm">{facData?.ReqPosition}</td>
                <td className="border border-black w-1/2 text-center text-sm">Acting Admin Division Manager</td>
              </tr>
              <tr>
                <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> {formatDate(facData?.form?.created_at)}</td>
                <td className="border text-base border-black w-1/2 text-center text-sm"><b>DATE: </b> 
                  {facData?.form?.date_approve ? formatDate(facData?.form?.date_approve) : null}
                </td>
              </tr>
            </table>

            {/* OPR */}
            <table className="w-full border-collapse border border-black mt-1">
              <tr>

                  {/* For OPR Instruction */}
                  <td className="border border-black w-1/2 p-2" style={{ verticalAlign: 'top' }}>
                    <div className="font-bold font-arial text-sm">
                      Instruction for the OPR for Action
                    </div>

                    <div className="px-5 font-arial mt-2 text-sm">
                      {facData?.form?.obr_instruct}
                    </div>  
                  </td>

                  {/* For OPR Action */}
                  <td className="border border-black w-1/2 p-2 " style={{ verticalAlign: 'top' }}>
                    <div className="font-bold font-arial text-sm">
                      OPR Action (Comments / Concerns)
                    </div>

                    <div className="px-5 font-arial mt-2 text-sm">
                      {facData?.form?.obr_comment}
                    </div>
                  </td>

              </tr>
            </table>

            <span className="system-generated">Joint Local Management System - This is system-generated.</span>

          </div>
        </div>
      </div>
    </div>
    )}
  </PageComponent>
 )
}