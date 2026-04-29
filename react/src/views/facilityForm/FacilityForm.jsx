import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { useParams, useNavigate  } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import ppa_logo from '/default/img/ppa_logo.png'
import loading_table from "/default/ring-loading.gif";
import axiosClient from "../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCircleXmark, faFilePdf, faArrowLeft, faArrowRight, faFileCircleXmark, faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function FacilityForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  // Get the ID
  const {id} = useParams();

  useEffect(() => {
    if (id) {
      fetchFacility(id);
      // fetchActivity();
    }
  }, [id]);

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

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

  // Mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkScreen(); // run on load
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

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

  // Loading Function
  const [formLoading, setFormLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const [pageRestrict, setPageRestrict] = useState(true);
  const [enableAdminDecline, setEnableAdminDecline] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [enableAmOPR, setEnableAmOPR] = useState(false);
  const [enableGsoOPR, setEnableGsoOPR] = useState(false);
  const [reasonError , setReasonError] = useState(false);
  const [fieldMissing, setFieldMissing] = useState({});
  const [trackingForm, setTrackingForm] = useState({});
  const [loadingPDF, setLoadingPDF] = useState(false);

  // Form Button Action
  const [enableForm, setEnableForm] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);

  //Generate PDF
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // --- Get The Data --- //
  const [facData, setFacData] = useState([]);
  const [paginatedFacility, setPaginatedFacility] = useState([]);

  const fetchFacility = async () => {
    try {
      const response = await axiosClient.get(`/showfacvenrequest/${id}`);
      const dataFacility = response.data;

      // console.log(dataFacility);
      setFacData(dataFacility.form);
      setPaginatedFacility({
        prev: dataFacility.prev,
        next: dataFacility.next
      });

      if(accessOnly) {
        setPageRestrict(true);
      } else {
        setPageRestrict(false);
      }

    } catch(error){
      if(error.response && error.response.data){
        if(error.response.data.error == "No-Form"){ 
          window.location = '/404';
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setFormLoading(false);
    }
  }

  // --- Track the Data --- //
  const fetchActivity = async () => {
    try {
      const response = await axiosClient.get(`/formtracking/${id}`,{
        params: { type: 'Facility/Venue' }
      });
      const dataActivity = response.data;

      setTrackingForm(dataActivity);

    }catch(error){
      console.error("Unexpected error:", error);
    } finally {
      setActivityLoading(false);
    }
  }

  // --- Auto Close Form --- //
  const setFormClosed = () => {

    if(GSO || facData?.user_id == currentUserId || SuperHacker){
      axiosClient
      .get(`/closeinspectionrequest/${id}`)
      .then(response => {
        console.log(response.data.message); // Show success message
      })
      .catch(error => {
        setPopupContent("error");
        setPopupMessage(error.response.status);
        setShowPopup(true); 
      });
    }
    
  }

  useEffect(() => { 
    if(currentUserId){
      fetchFacility();
      fetchActivity();
      setFormClosed();
    }
  }, [currentUserId]);

  // --- Pagination --- //
  // Previous Page
  const handlePrev = () => {
    if (!paginatedFacility?.prev) return; // stop if no previous
    setFormLoading(true);
    navigate(`/joms/facilityvenue/form/${paginatedFacility?.prev}`);
  };

  // Next Page
  const handleNext = () => {
    if (!paginatedFacility?.next) return; // stop if no next
    setFormLoading(true);
    navigate(`/joms/facilityvenue/form/${paginatedFacility?.next}`);
  };

  // For the main form
  useEffect(() => {
    setRegOffice(facData?.request_office ?? "");
    setTitleReq(facData?.title_of_activity ?? "");
    setReqDateStart(facData?.date_start ?? "");
    setReqTimeStart(facData?.time_start ?? "");
    setReqDateEnd(facData?.date_end ?? "");
    setReqTimeEnd(facData?.time_end ?? "");
  }, [
    facData?.request_office,
    facData?.title_of_activity,
    facData?.date_start,
    facData?.time_start,
    facData?.date_end,
    facData?.time_end
  ]);

  //Main Form
  const [reqOffice, setRegOffice] = useState('');
  const [titleReq, setTitleReq] = useState('');
  const [reqDateStart, setReqDateStart] = useState('');
  const [reqTimeStart, setReqTimeStart] = useState('');
  const [reqDateEnd, setReqDateEnd] = useState('');
  const [reqTimeEnd, setReqTimeEnd] = useState('');

  // Default Checkboxes
  useEffect(() => {
    setCheckTable(Boolean(facData?.table));
    setNoOfTable(facData?.no_table);
    setCheckChairs(Boolean(facData?.chair));
    setNoOfChairs(facData?.no_chair);
    setCheckLaptop(Boolean(facData?.laptop));
    setCheckMicrphone(Boolean(facData?.microphone));
    setNoOfMicrophone(facData?.no_microphone);
    setCheckOther(Boolean(facData?.others));
    setCheckProjector(Boolean(facData?.projector));
    setCheckProjectorScreen(Boolean(facData?.projector_screen));
    setCheckDocumentCamera(Boolean(facData?.document_camera));
    setCheckTelevision(Boolean(facData?.television));
    setCheckSoundSystem(Boolean(facData?.sound_system));
    setCheckVideoke(Boolean(facData?.videoke));
  },[
    facData?.laptop,
    facData?.table,
    facData?.no_table,
    facData?.chair,
    facData?.no_chair,
    facData?.microphone,
    facData?.no_microphone,
    facData?.others,
    facData?.projector,
    facData?.projector_screen,
    facData?.document_camera,
    facData?.television,
    facData?.sound_system,
    facData?.videoke
  ]);

  function handleDefaultForm(){
    setCheckTable(Boolean(facData?.table));
    setNoOfTable(facData?.no_table);
    setCheckChairs(Boolean(facData?.chair));
    setNoOfChairs(facData?.no_chair);
    setCheckLaptop(Boolean(facData?.laptop));
    setCheckMicrphone(Boolean(facData?.microphone));
    setNoOfMicrophone(facData?.no_microphone);
    setCheckOther(Boolean(facData?.others));
    setCheckProjector(Boolean(facData?.projector));
    setCheckProjectorScreen(Boolean(facData?.projector_screen));
    setCheckDocumentCamera(Boolean(facData?.document_camera));
    setCheckTelevision(Boolean(facData?.television));
    setCheckSoundSystem(Boolean(facData?.sound_system));
    setCheckVideoke(Boolean(facData?.videoke));
  }

  //Facility Room
  const [checkTable, setCheckTable] = useState(() => Boolean(facData?.table));
  const [NoOfTable, setNoOfTable] = useState('');
  const [checkChairs, setCheckChairs] = useState(() => Boolean(facData?.chair));
  const [NoOfChairs, setNoOfChairs] = useState('');
  const [checkProjector, setCheckProjector] = useState(() => Boolean(facData?.projector));
  const [checkProjectorScreen, setCheckProjectorScreen] = useState(() => Boolean(facData?.projector_screen));
  const [checkDocumentCamera, setCheckDocumentCamera] = useState(() => Boolean(facData?.document_camera));
  const [checkLaptop, setCheckLaptop] = useState(() => Boolean(facData?.laptop));
  const [checkTelevision, setCheckTelevision] = useState(() => Boolean(facData?.television));
  const [checkSoundSystem, setCheckSoundSystem] = useState(() => Boolean(facData?.sound_system));
  const [checkVideoke, setCheckVideoke] = useState(() => Boolean(facData?.videoke));
  const [checkMicrphone, setCheckMicrphone] = useState(() => Boolean(facData?.microphone));
  const [NoOfMicrophone, setNoOfMicrophone] = useState('');
  const [checkOther, setCheckOther] = useState(() => Boolean(facData?.others));
  const [OtherField, setOtherField] = useState('');

  const handleInputTableChange = (e) => {
    const value = e.target.value;

    // allow empty
    if (value === "") {
      setNoOfTable("");
      return;
    }

    // convert to number
    const num = Number(value);

    // block zero values
    if (num === 0) {
      setNoOfTable("");
    } else {
      setNoOfTable(num);
    }
  };

  const handleInputChairChange = (e) => {
    const value = e.target.value;

    // allow empty
    if (value === "") {
      setNoOfChairs("");
      return;
    }

    // convert to number
    const num = Number(value);

    // block zero values
    if (num === 0) {
      setNoOfChairs("");
    } else {
      setNoOfChairs(num);
    }
  };

  const handleInputMicrophoneChange = (e) => {
    const value = e.target.value;

    // allow empty
    if (value === "") {
      setNoOfMicrophone("");
      return;
    }

    // convert to number
    const num = Number(value);

    // block zero values
    if (num === 0) {
      setNoOfMicrophone("");
    } else {
      setNoOfMicrophone(num);
    }
  };

  // Dormitory
  const [getMale, setGetMale] = useState(facData?.name_male ?? "");
  const [getFemale, setGetFemale] = useState(facData?.name_female ?? "");
  const [otherDetails, setOtherDetails] = useState(facData?.other_details ?? "");

  // Update state when facData updates
  useEffect(() => {
    setGetMale(facData?.name_male ?? "");
    setGetFemale(facData?.name_female ?? "");
    setOtherDetails(facData?.other_details ?? "");
    setRegOffice(facData?.request_office ?? "");
    setTitleReq(facData?.title_of_activity ?? "");
  }, [
    facData?.name_male,
    facData?.name_female,
    facData?.other_details,
    facData?.request_office,
    facData?.title_of_activity
  ]);

  // Edit Form 
  function editFacilityForm(){
    setSubmitLoading(true);

    const data = {
      user_name: currentUserName.name,
      request_office: reqOffice,
      title_of_activity: titleReq,
      date_start: reqDateStart,
      time_start: reqTimeStart,
      date_end: reqDateEnd ,
      time_end: reqTimeEnd,
      table: checkTable,
      no_table: checkTable ? (NoOfTable === 0 ? null : (NoOfTable ?? facData?.no_table)) : null,
      chair: checkChairs,
      no_chair: checkChairs ? (NoOfChairs === 0 ? null : (NoOfChairs ?? facData?.no_chair)) : null,
      microphone: checkMicrphone,
      no_microphone: checkMicrphone ? (NoOfMicrophone === 0 ? null : (NoOfMicrophone ?? facData?.no_microphone)) : null,
      projector: checkProjector,
      projector_screen: checkProjectorScreen,
      document_camera: checkDocumentCamera,
      laptop: checkLaptop,
      television: checkTelevision,
      sound_system: checkSoundSystem,
      videoke: checkVideoke,
      others: checkOther,
      specify: checkOther ? OtherField ? OtherField : facData?.specify : null,
      name_male: getMale,
      name_female: getFemale,
      other_details: otherDetails
    };

    axiosClient
    .put(`/editfacrequest/${id}`, data)
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Cancel'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form has already been canceled by the GSO.</p>
          </div>
        );
      }else if(responseData === 'Closed'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">You can no longer edit this form.</p>
          </div>
        );
      }else if(responseData === 'Disapproved'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form has been disapproved by the Admin Manager.</p>
          </div>
        );
      }else if(responseData === 'Invalid Date'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">You’ve entered an invalid date.</p>
          </div>
        );
      }else if(responseData === 'Not Vacant'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Not Vacant</p>
            <p className="popup-message">That schedule is already taken.</p>
          </div>
        );
      }else{
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">Form update successfully!</p>
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

  // Cancel Form
  function DeleteFormRequest(id){

  }

  // Enable Decline Reason
  function submitAdminDecline(event){
    event.preventDefault();

    
  }

  // Variable
  const [oprInstruct, setOprInstruct] = useState('');
  const [oprAction, setOprAction] = useState('');
  const [declineReason, setDeclineReason] = useState('');

  // Submit OPR Instruct for the Admin
  function oprInstructSubmit(event){
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/oprinstruct/${id}`,{
      oprInstruct:oprInstruct,
      user_id: currentUserId,
    })
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Deleted'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form has already been canceled by the GSO.</p>
          </div>
        );
      }else if(responseData === 'Not Admin'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">You are not a Admin Manager.</p>
          </div>
        );
      }else{
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The OPR instruction has been completed, and the form has been approved.</p>
          </div>
        );
        setShowPopup(true);
      }
    })
    .catch((error) => {
      if(error.response.data.errors){
        setFieldMissing(error.response.data.errors);
      }
      else{
        setShowPopup(true); 
        setPopupContent('error');
        setPopupMessage(error.response.status);  
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Edit OPR Instruct for the Admin
  function oprEditInstruct(event){
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/editoprinstruct/${id}`, {
      oprInstruct: oprInstruct,
      user_id: currentUserId,
    })
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Not Admin'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">You are not a Admin Manager.</p>
          </div>
        );
      }else{
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The OPR instruction has been updated.</p>
          </div>
        );
        setShowPopup(true);
      }
    })
    .catch((error) => {
      const responseErrors = error.response.data.errors;

      if(responseErrors){
        setFieldMissing(responseErrors);
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

  // Submit OPR Action for the GSO
  function oprActionSubmit(event){
    event.preventDefault();
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
          <p className="popup-title">Success</p>
          <p className="popup-message">The OPR Action has been stored in the database.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      if(error.response.data.errors){
        setFieldMissing(error.response.data.errors);
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

  // Edit OPR Action for the GSO
  function oprEditAction(event){
    event.preventDefault();
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
          <p className="popup-title">Success</p>
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
        setShowPopup(true); 
        setPopupContent('error');
        setPopupMessage(error.response.status); 
      }     
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Cancel Confirmation
  function handleDeleteFormContirmation(){
    setShowPopup(true);
    setPopupContent('gsodelete');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to cancel the request? It cannot be undone.</p>
      </div>
    );
  }

  // Cancel Form
  function DeleteFormRequest(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/closefacilityforce/${id}`, {
      user_name: currentUserName.name,
    })
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'Approve'){
        setShowPopup(true);
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Already Approved!</p>
            <p className="popup-message">You cannot cancel the form once the admin approves it.</p>
          </div>
        );
      }else if(responseData === 'Cancel'){
        setShowPopup(true);
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Already Cancel!</p>
            <p className="popup-message">This form has already been canceled.</p>
          </div>
        );
      }else if(responseData === 'Disapproved'){
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form has been disapproved by the Admin Manager.</p>
          </div>
        );
      }else{
        setButtonHide(true);
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The form has been canceled.</p>
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

  // --- Admin Decline --- //
  const handleAdminDeclineConfirmation = () => {
    if(!declineReason) {
      setReasonError(true);
    } else {
      setShowPopup(true);
      setPopupContent('amif');
      setPopupMessage(
        <div>
          <p className="popup-title">Are you sure?</p>
          <p className="popup-message">Do you want to disapprove {facData?.form?.user_name}'s request? It cannot be undone.</p>
        </div>
      );
    }
  
  }

  // Enable Decline Reason
  function submitAdminDecline(){
    setSubmitLoading(true);

    axiosClient
    .put(`/adminfacdisapproval/${facData?.id}`, {
      remarks: declineReason
    })
    .then(() => {
      setButtonHide(true);
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

  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setEnableAmOPR(false);
    setEnableGsoOPR(false);
    setSubmitLoading(false);
    setFormLoading(true);
    setActivityLoading(true);
    setShowPopup(false);
    setEnableForm(false);
    setEnableAdminDecline(false);
    fetchFacility();
    setButtonHide(false);
    // fetchTracking();
    fetchActivity();
    setFormClosed();
  }

  // Pdf
  const loadPDF = async () => {
    try {
      setShowPDF(true);
      setLoadingPDF(true);

      const response = await axiosClient.get(
        `/facility/pdf/${id}`,
        { responseType: "blob" }
      );

      // 🔥 GET FILENAME FROM HEADER
      const disposition = response.headers["content-disposition"];
      let filename = "Facility.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);

      setPdfUrl(fileURL);

    } catch (error) {
      console.error("Error loading PDF:", error);
    } finally {
      setLoadingPDF(false);
    }
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Facility-Venue-Form-Control-Nnumber-${id}.pdf`;
    link.click();
  };

  const printPDF = () => {
  if (!pdfUrl) return;

  const printWindow = window.open(pdfUrl);
    if (printWindow) {
      // Some browsers need a short delay before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      console.error("Failed to open print window. Check popup blocker.");
    }
  };

  // Function for the Dormitort
  const maleCount = facData?.name_male
  ? facData.name_male.split(/\r?\n/).filter(n => n.trim() !== "").length
  : 0;

  const femaleCount = facData?.name_female
  ? facData.name_female.split(/\r?\n/).filter(n => n.trim() !== "").length
  : 0;

  const malenames = facData?.name_male
  ? facData.name_male.split(/\r?\n/).filter(n => n.trim())
  : [];

  const femalenames = facData?.name_female
  ? facData.name_female.split(/\r?\n/).filter(n => n.trim())
  : [];

  const totalMales = Math.max(6, malenames.length);
  const totalFemales = Math.max(6, femalenames.length);

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperHacker = codes.includes("HACK");
  const ITAdmin = codes.includes("AUS");
  const AuthorityPersonnel = codes.includes("AUF");
  const roles = ["HACK", "AUS", "AM", "AUF", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

 return(
  !pageRestrict ? (<Restrict />):(
  <PageComponent title="Request Form">
    {/* Wrapper */}
    <div className="grid grid-cols-10 gap-4 mt-8">
      {/* Form */}
      <div className="col-span-7">
        <div className="ppa-widget-col request-form px-4 pb-6">
          {/* Header */}
          <div className="joms-user-info-header text-left"> 
            Facility / Venue Form
          </div>

          {showPDF ? (
            loadingPDF ? (
                <div className="flex justify-center items-center py-10">
                  <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                  <span className="loading-table">Generating PDF</span>
                </div>
              ):(
              <>
                <div className="mt-3 mb-5 flex justify-end space-x-3">
                  <FontAwesomeIcon onClick={downloadPDF} className="icon-edit-form" title="Download PDF" icon={faDownload} />
                  <FontAwesomeIcon onClick={printPDF} className="icon-edit-form" title="Print PDF" icon={faPrint} />
                  <FontAwesomeIcon onClick={() => setShowPDF(false)} className="icon-edit-form" title="Close PDF Viewer" icon={faFileCircleXmark} />
                </div>

                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&zoom=67&navpanes=0`}
                  width="100%"
                  height="800px"
                  title="Inspection PDF"
                />
              </>
              )
          ):(
          <>
            {/* Button Pagination */}
            {(GSO || Admin || SuperHacker || ITAdmin || AuthorityPersonnel) && (
            <div className="text-sm flex justify-between items-center w-full mb-2 mt-4">
              {!formLoading &&(
              <>
                {/* Previous */}
                <button
                  onClick={handlePrev}
                  disabled={!paginatedFacility?.prev || formLoading}
                  className={`rounded ${
                    paginatedFacility?.prev
                      ? "ppa-arrow"
                      : "ppa-arrow-disable cursor-not-allowed"
                  }`}
                  style={{
                    visibility: paginatedFacility?.prev ? "visible" : "hidden"
                  }}
                >
                  <span className="flex items-center group-hover:text-white transition-colors">
                    <FontAwesomeIcon
                      className="icon-form group-hover:text-white transition-colors"
                      title="Prev"
                      icon={faArrowLeft}
                    />
                    &nbsp; Page{" "}
                    {paginatedFacility?.prev && paginatedFacility?.prev}
                  </span>
                </button>

                {/* Next */}
                <button
                  onClick={handleNext}
                  disabled={!paginatedFacility?.next || formLoading}
                  className={`rounded ${
                    paginatedFacility?.next
                      ? "ppa-arrow"
                      : "ppa-arrow-disable cursor-not-allowed"
                  }`}
                  style={{
                    visibility: paginatedFacility?.next ? "visible" : "hidden"
                  }}
                > 
                  <span className="flex items-center group-hover:text-white transition-colors">
                    Page{" "}
                    {paginatedFacility?.next && paginatedFacility?.next}
                    &nbsp;
                    <FontAwesomeIcon
                      className="icon-form group-hover:text-white transition-colors"
                      title="Prev"
                      icon={faArrowRight}
                    />
                  </span>
                </button>
              </>
              )}
            </div>
            )}

            {/* Form */}
            <div className="mt-10">
              {/* Control Number and Form Buttons */}
              <div className="flex justify-between items-center"> 
                <div className="flex items-center">
                  <div className="w-24 font-bold">
                    Control No:
                  </div>

                  <div className="w-auto">
                    {formLoading ? (
                      <div className="skeleton h-6 w-10 block"></div>
                    ):(
                      <div className="ppa-form-view">
                        {id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Button Functions */}
                <div className="mt-3 flex justify-right space-x-3">
                {enableForm ? (
                  !buttonHide && (
                  <>
                    {/* Form Submit */}
                    <button 
                      type="submit"
                      onClick={editFacilityForm}
                      className={`py-2 px-3 text-sm ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
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

                    {/* Back */}
                    {!submitLoading && (
                      <button 
                        onClick={() => {
                          setEnableForm(false);
                          handleDefaultForm();
                        }} 
                        className="py-2 px-4 btn-cancel text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </>
                  )
                ):(
                  !formLoading && (
                    <>
                      {/* Edit */}
                      {(SuperHacker) && (
                        ![0, 4].includes(facData?.admin_approval) && (
                          <FontAwesomeIcon onClick={() => setEnableForm(true)} className="icon-edit-form" title="Edit" icon={faPenToSquare} />
                        )
                      )}

                      {/* Authority and GSO */}
                      {(AuthorityPersonnel || GSO) && (
                        ![0, 1, 4].includes(facData?.admin_approval) && (
                          <FontAwesomeIcon onClick={() => setEnableForm(true)} className="icon-edit-form" title="Edit" icon={faPenToSquare} />
                        )
                      )}

                      {/* Cancel */}
                      {[5, 6, 7].includes(facData?.admin_approval) && (
                        (GSO || SuperHacker || AuthorityPersonnel) && (
                          <FontAwesomeIcon onClick={() => { handleDeleteFormContirmation(); }} className="icon-edit-form" title="Cancel request" icon={faCircleXmark} />
                        )
                      )}

                      {/* Generate PDF */}
                      {!isMobile && (
                      <>
                        {/* For GSO and SuperAdmin */}
                        {![0, 4].includes(facData?.admin_approval) && (GSO || SuperHacker || AuthorityPersonnel) && (
                          <FontAwesomeIcon onClick={loadPDF} className="icon-edit-form" title="Get PDF" icon={faFilePdf} />
                        )}
                      </>
                      )}
                    </>
                  )
                )}

                {/* Admin (For Decline) */}
                {Admin && (
                  (facData?.admin_approval == 7 || facData?.admin_approval == 5) && (
                    !buttonHide && enableAdminDecline && (
                      <>
                        {/* For the Decline */}

                        {/* Confirmation */}
                        <button onClick={() => handleAdminDeclineConfirmation()} className="py-2 px-4 text-sm btn-secondary">
                          Submit
                        </button>
                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { setEnableAdminDecline(false); setDeclineReason(''); }} className="ml-2 py-2 px-4 text-sm btn-cancel">
                            Cancel
                          </button>
                        )}
                      </>
                    )
                  )
                )}
                </div>
              </div>

              {enableAdminDecline ? (
              <>
                {/* Disapproval */}
                <div className="flex items-stretch mt-6">
                  <div className="w-64 flex form-title">
                    <label> 
                      Reason for disapproval:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="reason"
                      id="reason"
                      value={declineReason}
                      onChange={ev => setDeclineReason(ev.target.value)}
                      placeholder="Input your reasons"
                      className="block w-full focus:ring-0 ppa-form-field"
                    />
                  </div>
                </div>
              </>
              ):(
              <>
                {/* Status */}
                <div className="status-sec mt-5">
                  <div className="flex items-center">
                    <div className="w-16 font-bold">
                      Status:
                    </div>

                    <div className="w-full">
                      {formLoading ? (
                        <div className="skeleton h-6 w-full block"></div>
                      ):(
                        Admin && facData?.admin_approval == 7 ? (
                          "Waititng for your approval"
                        ): enableForm ? (
                          "Form field enable"
                        ):(
                          <>
                            {facData?.remarks} {facData?.admin_approval == 2 && (GSO || SuperHacker) && ("You can still edit the form within 24 hours (if you see this).")}
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center mt-4">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Date 
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="text"
                          name="rf_daterequest"
                          id="rf_daterequest"
                          value={formatDate(facData?.created_at)}
                          // onChange={ev => setRegOffice(ev.target.value)}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled
                        />
                      ):(
                        <div className="ppa-form-confirm">
                          {formatDate(facData?.created_at)}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Requesting Office/Division */}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Requesting Office/Division 
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="text"
                          name="rf_request"
                          id="rf_request"
                          autoComplete="rf_request"
                          value={reqOffice}
                          onChange={ev => setRegOffice(ev.target.value)}
                          className="block w-full focus:ring-0 ppa-form-field"
                        />
                      ):(
                        <div className="ppa-form-confirm">
                          {facData?.request_office}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Title/Purpose of Activity */}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Title/Purpose of Activity 
                    </label> 
                  </div>
                  <div className="w-1/2">
                  {formLoading ? (
                    <div className="skeleton-form w-full"></div>
                  ):(
                    enableForm ? (
                      <input
                        type="text"
                        name="rep_title"
                        id="rep_title"
                        autoComplete="rep_title"
                        defaultValue={titleReq}
                        onChange={ev => setTitleReq(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="ppa-form-confirm">
                        {facData?.title_of_activity}
                      </div>
                    )
                  )}
                  </div>
                </div>

                {/* Date of Activity */}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      {enableForm ? ("Date of Activity (Start)"):("Date of Activity")}
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="date"
                          name="date_start"
                          id="date_start"
                          value={reqDateStart}
                          onChange={ev => setReqDateStart(ev.target.value)}
                          min={today}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled = {!SuperHacker && !GSO}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm">
                          {facData?.date_start === facData?.date_end ? (
                            formatDate(facData?.date_start)
                          ):(
                            `${formatDate(facData?.date_start)} to ${formatDate(facData?.date_end)}`
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Start Time of Activity (if enable) */}
                {enableForm && (
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Time of Activity (Start)
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="time"
                      name="time_start"
                      id="time_start"
                      value={reqTimeStart}
                      onChange={ev => {
                        const val = ev.target.value;
                        setReqTimeStart(val.length === 5 ? val + ":00" : val);
                      }}
                      className="block w-full focus:ring-0 ppa-form-field"
                      disabled = {!SuperHacker && !GSO}
                    />
                  </div>
                </div>
                )}

                {/* Time of Activity (Date End if Enable)*/}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      {enableForm ? ("Date of Activity (End)"):("Time of Activity")}
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="date"
                          name="date_end"
                          id="date_end"
                          value={reqDateEnd}
                          onChange={ev => setReqDateEnd(ev.target.value)}
                          min={facData?.date_start}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled = {!SuperHacker && !GSO}
                        />
                      ):(
                        <div className="w-full ppa-form-confirm">
                          {facData?.date_start === facData?.date_end ? (
                            `${formatTime(facData?.time_start)} to ${formatTime(facData?.time_end)}`
                          ):(
                            `${formatDate(facData?.date_start)} (${formatTime(facData?.time_start)}) to ${formatDate(facData?.date_end)} (${formatTime(facData?.time_end)})`
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* End Time of Activity (if enable) */}
                {enableForm && (
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Time of Activity (End)
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="time"
                      name="time_end"
                      id="time_end"
                      value={reqTimeEnd}
                      onChange={ev => {
                        const val = ev.target.value;
                        setReqTimeEnd(val.length === 5 ? val + ":00" : val); 
                      }}
                      className="block w-full focus:ring-0 ppa-form-field"
                      disabled = {!SuperHacker && !GSO}
                    />
                  </div>
                </div>
                )}

                {/* Facility Request */}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Facility Request
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="text"
                          name="rf_facilityrequest"
                          id="rf_facilityrequest"
                          value={
                            facData?.mph
                              ? "Multi-Purpose Hall (MPH)"
                              : facData?.conference
                              ? "Conference Room"
                              : facData?.dorm
                              ? "Dormitory"
                              : facData?.other
                              ? "Other"
                              : ""
                          }
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled
                        />
                      ):(
                        <div className="ppa-form-confirm">
                          {facData?.mph ? ("Multi-Purpose Hall (MPH)"):null}
                          {facData?.conference ? ("Conference Room"):null}
                          {facData?.dorm ? ("Dormitory"):null}
                          {facData?.other ? ("Other"):null}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Requestor */}
                <div className="flex items-center mt-2">
                  <div className="w-[20%] flex form-title">
                    <label> 
                      Requestor
                    </label> 
                  </div>
                  <div className="w-1/2">
                    {formLoading ? (
                      <div className="skeleton-form w-full"></div>
                    ):(
                      enableForm ? (
                        <input
                          type="text"
                          name="rf_requestor"
                          id="rf_requestor"
                          value={facData?.user_name}
                          // onChange={ev => setRegOffice(ev.target.value)}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled
                        />
                      ):(
                        <div className="ppa-form-confirm">
                          <strong>{facData?.user_name}</strong>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* -- Facilities -- */}
                {(facData?.mph || facData?.conference || facData?.other) ? (
                <div className="mt-8 border-t border-gray-300">
                  {/* Caption */}
                  <div> <h2 className="text-base font-bold leading-7 text-gray-900 mt-4"> * For the Multi-Purpose Hall / Conference Room / Others </h2> </div>

                  {/* Check Boxes */}
                  <div className="w-[90%] grid grid-cols-2 mt-4">
                    {/* 1st Column */}
                    <div className="col-span-1">
                      {/* Table */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checktable"
                              name="mph-checktable"
                              type="checkbox"
                              checked={checkTable}
                              onChange={() => {
                                setCheckTable(prev => {
                                  const newValue = !prev;

                                  if (!newValue) {
                                    setNoOfTable('');
                                  }

                                  return newValue;
                                });
                              }}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkTable ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${!enableForm ? '' : checkTable ? '' : 'border-r'}`}>
                            <label htmlFor="rf_request">
                              Table
                            </label> 
                          </div>
                          {(checkTable || !enableForm) && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="no-of-table"
                                id="no-of-table"
                                value={NoOfTable}
                                onChange={handleInputTableChange}
                                className="focus:ring-0 check-field"
                                placeholder={enableForm ? "No. of table" : ""}
                                disabled={!enableForm}
                              />
                            </div>
                          )}
                        </>
                        )}
                      </div>

                      {/* Chair */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checkchairs"
                              name="mph-checkchairs"
                              type="checkbox"
                              checked={checkChairs}
                              onChange={() => {
                                setCheckChairs(prev => {
                                  const newValue = !prev;

                                  if (!newValue) {
                                    setNoOfChairs('');
                                  }

                                  return newValue;
                                });
                              }}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkChairs ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${!enableForm ? '' : checkChairs ? '' : 'border-r'}`}>
                            <label htmlFor="rf_request">
                              Chair
                            </label> 
                          </div>
                          {(checkChairs || !enableForm) && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="no-of-chair"
                                id="no-of-chair"
                                value={NoOfChairs}
                                onChange={handleInputChairChange}
                                className="focus:ring-0 check-field"
                                placeholder={enableForm ? "No. of chair" : ""}
                                disabled={!enableForm}
                              />
                            </div>
                          )}
                        </>
                        )}
                      </div>

                      {/* Projector */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="checkbox-projector"
                              type="checkbox"
                              checked={checkProjector}
                              onChange={() => setCheckProjector(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkProjector ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Projector
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Projector Screen */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkProjectorScreen}
                              onChange={() => setCheckProjectorScreen(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkProjectorScreen ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Projector Screen
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Document Camera */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkDocumentCamera}
                              onChange={() => setCheckDocumentCamera(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkDocumentCamera ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Document Camera
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                    </div>

                    {/* 2nd Column */}
                    <div className="col-span-1">
                      {/* Laptop */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkLaptop}
                              onChange={() => setCheckLaptop(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkLaptop ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Laptop
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Television */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkTelevision}
                              onChange={() => setCheckTelevision(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkTelevision ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Television
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Sound System */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkSoundSystem}
                              onChange={() => setCheckSoundSystem(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkSoundSystem ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Sound System
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Videoke */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="other-checkbox"
                              type="checkbox"
                              checked={checkVideoke}
                              onChange={() => setCheckVideoke(prev => !prev)}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkVideoke ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className="w-2/5 h-[40px] form-title-choose border-t border-b border-r">
                            <label htmlFor="rf_request">
                              Videoke
                            </label> 
                          </div>
                        </>
                        )}
                      </div>

                      {/* Microphone */}
                      <div className="relative flex items-center mt-2">
                        {formLoading ? (
                        <>
                          {/* Checkbox Skeleton */}
                          <div className="flex items-center h-5">
                            <div className="skeleton h-[40px] w-[40px] "></div>
                          </div>
                          {/* Label Skeleton */}
                          <div className="w-2/5 h-[40px] skeleton ml-1"></div>
                        </>
                        ):(
                        <>
                          <div className="flex items-center h-5">
                            <input
                              id="mph-checkmicrophone"
                              name="mph-checkmicrophone"
                              type="checkbox"
                              checked={checkMicrphone}
                              onChange={() => {
                                setCheckMicrphone(prev => {
                                  const newValue = !prev;

                                  if (!newValue) {
                                    setNoOfMicrophone('');
                                  }

                                  return newValue;
                                });
                              }}
                              className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkMicrphone ? 'checked' : ''}`}
                              disabled={!enableForm}
                            />
                          </div>
                          <div className={`w-2/5 h-[40px] form-title-choose border-t border-b ${!enableForm ? '' : checkMicrphone ? '' : 'border-r'}`}>
                            <label htmlFor="rf_request">
                              Microphone
                            </label> 
                          </div>
                          {(checkMicrphone || !enableForm) && (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="no-of-microphone"
                                id="no-of-microphone"
                                value={NoOfMicrophone}
                                onChange={handleInputMicrophoneChange}
                                className="focus:ring-0 check-field"
                                placeholder={enableForm ? "No. of microphone" : ""}
                                disabled={!enableForm}
                              />
                            </div>
                          )}
                        </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="relative flex items-center mt-2 w-full">
                    {formLoading ? (
                    <>
                      {/* Checkbox Skeleton */}
                      <div className="flex items-center h-5">
                        <div className="skeleton h-[40px] w-[40px] "></div>
                      </div>
                      {/* Label Skeleton */}
                      <div className="w-[18%] h-[40px] skeleton ml-1"></div>
                    </>
                    ):(
                    <>
                      <div className="flex items-center h-5">
                        <input
                          id="mph-checkmicrophone"
                          name="mph-checkmicrophone"
                          type="checkbox"
                          checked={checkOther}
                          onChange={() => {
                            setCheckOther(prev => {
                              const newValue = !prev;

                              if (!newValue) {
                                setOtherField('');
                              }

                              return newValue;
                            });
                          }}
                          className={`focus:ring-0 h-[40px] w-[40px] form-check ${checkOther ? 'checked' : ''}`}
                          disabled={!enableForm}
                        />
                      </div>
                      <div className={`w-[18%] h-[40px] form-title-choose border-t border-b ${!enableForm ? '' : checkOther ? '' : 'border-r'}`}>
                        <label htmlFor="rf_request">
                          Other
                        </label> 
                      </div>
                      {(checkOther || !enableForm) && (
                        <div className="flex items-center flex-1">
                          <input
                            type="text"
                            name="other-specfic"
                            id="other-specfic"
                            placeholder={enableForm ? "Please Specify" : ""}
                            value={OtherField}
                            onChange={ev => setOtherField(ev.target.value)}
                            className="w-[80%] h-[40px] focus:ring-0 check-field border"
                            disabled={!enableForm}
                          />
                        </div>
                      )}
                    </>
                    )}
                  </div>
                </div>
                ):null}

                {/* -- Dorm -- */}
                {facData?.dorm ? (
                <div className="mt-8 border-t border-gray-300">
                  {/* Caption */}
                  <div> <h2 className="text-base mt-4 font-bold leading-7 text-gray-900"> * For the Dormitory </h2> </div>

                  {/* List */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* For Male */}
                    <div className="col-span-1">
                      {/* Male Guest */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <div className="w-1/2 flex form-title h-[40px]">
                            <label> 
                              Number of Male Guest
                            </label> 
                          </div>
                          <div className="w-auto ppa-form-confirm">
                          {formLoading ? (
                            <strong>0</strong>
                          ) : (
                            enableForm ? (
                              <strong>0</strong>
                            ):(
                              <strong>{maleCount}</strong>
                            )
                          )}
                          </div>
                        </div>
                        {/* Male Guest List */}
                        <div className="w-3/4">
                        {enableForm ? (
                        <>
                          <div className="mt-2">
                            <textarea
                              id="dorm-male-list"
                              name="dorm-male-list"
                              rows={8}
                              value={getMale}
                              onChange={ev => setGetMale(ev.target.value)}
                              style={{ resize: 'none' }}
                              className="block w-full focus:ring-0 ppa-form-field-dorm"
                            />
                            <p className="text-red-500 text-xs">Do not include number brackets in this form</p>
                          </div>
                        </>
                        ):(
                          formLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                              <div key={index} className="mt-2 flex items-center">
                                <div className="skeleton-form w-full"></div>
                              </div>
                            ))
                          ):(
                            Array.from({ length: totalMales }).map((_, index) => (
                              <div key={index} className="mt-2 flex ppa-list-form">
                                <span className="numbering">{`${index + 1}.`}</span>
                                <div className="naming">
                                  {malenames[index] || ''}
                                </div>
                              </div>
                            ))
                          )
                        )}
                        </div>
                      </div>
                    </div>

                    {/* For Female */}
                    <div className="col-span-1">
                      {/* Female Guest */}
                      <div className="mt-6">
                        <div className="flex items-center">
                          <div className="w-1/2 flex form-title">
                            <label> 
                              Number of Female Guest
                            </label> 
                          </div>
                          <div className="w-auto ppa-form-confirm">
                            {formLoading ? (
                              <strong>0</strong>
                            ) : (
                              enableForm ? (
                                <strong>0</strong>
                              ):(
                                <strong>{femaleCount}</strong>
                              )
                            )}
                          </div>
                        </div>
                        {/* Female Guest List */}
                        <div className="w-3/4">
                        {enableForm ? (
                          <div className="mt-2">
                            <textarea
                              id="dorm-female-list"
                              name="dorm-female-list"
                              rows={8}
                              value={getFemale}
                              onChange={ev => setGetFemale(ev.target.value)}
                              style={{ resize: 'none' }}
                              className="block w-full focus:ring-0 ppa-form-field-dorm"
                            />
                            <p className="text-red-500 text-xs">Do not include number brackets in this form</p>
                          </div>
                        ):(
                          formLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                              <div key={index} className="mt-2 flex items-center">
                                <div className="skeleton-form w-full"></div>
                              </div>
                            ))
                          ):(
                            Array.from({ length: totalFemales }).map((_, index) => (
                              <div key={index} className="mt-2 flex ppa-list-form">
                                <span className="numbering">{`${index + 1}.`}</span>
                                <div className="naming">
                                  {femalenames[index] || ''}
                                </div>
                              </div>
                            ))
                          )
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other */}
                  <div className="w-[20%] flex form-title-whole h-[40px] mt-8">
                    <label> 
                      Other Details
                    </label> 
                  </div>
                  <div className="w-full">
                    {formLoading ? (
                      <div className="skeleton-form w-full mt-2"></div>
                    ):(
                    <>
                      <textarea
                        id="recomendations"
                        name="recomendations"
                        rows={3}
                        style={{ resize: "none" }}
                        value={otherDetails}
                        onChange={ev => setOtherDetails(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field-whole mt-2"
                        placeholder={enableForm ? "Input Details" : ""}
                        disabled={!enableForm}
                      />
                      {enableForm && (
                        <p className="text-red-500 text-xs mt-1">Leave blank if none</p>
                      )}
                    </>
                    )}
                  </div> 
                </div>
                ):null}

                {/* OPR */}
                {(facData?.mph || facData?.conference || facData?.dorm || facData?.other) && (
                <div className="mt-10">
                  {/* OPR Instruction */}
                  <div className="items-center mb-10 border-t border-gray-300">
                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-base font-bold leading-7 text-gray-900"> * OPR Instruct </h2>
                      {/* Buttons */}
                      <div className="mt-0 flex justify-start">
                      {Admin && !formLoading && facData?.admin_approval == 7 || facData?.admin_approval == 5 ? (
                        !buttonHide && (
                        <>
                          {/* Submit and Approve */}
                          <button 
                            type="submit"
                            onClick={oprInstructSubmit}
                            className={`text-sm mr-2 px-4 py-1.5 ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
                            disabled={submitLoading}
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
                              className="text-sm px-4 py-1.5 btn-cancel"
                            >
                              Decline
                            </button>
                          )}
                        </>
                        )
                      ):(
                        enableAmOPR ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button 
                              type="submit"
                              onClick={oprEditInstruct}
                              className={`text-sm px-4 py-1.5 mr-2 ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
                              disabled={submitLoading}
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
                                className="text-sm px-4 py-1.5 btn-cancel"
                              >
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):(
                          <>
                            {/* Admin */}
                            {Admin && (facData?.admin_approval == 3 || facData?.admin_approval == 2) && !enableAmOPR && !enableGsoOPR && !enableForm && !formLoading && (
                              <FontAwesomeIcon onClick={() => { setEnableAmOPR(true); }} className="icon-edit-form" title="Edit" icon={faPenToSquare} />
                            )}

                            {/* For the SuperAdmin */}
                            {SuperHacker && facData?.form?.admin_approval == 1 && !formLoading && (
                              <FontAwesomeIcon onClick={() => { setEnableAmOPR(true); }} className="icon-form" title="Edit" icon={faPenToSquare} />
                            )}
                          </>
                        )
                      )}
                      </div>
                    </div>

                    {/* Form */}
                    {(!facData?.obr_instruct && (facData?.admin_approval == 7 || facData?.admin_approval == 5)) && !formLoading && Admin ? (
                      <textarea
                        type="text"
                        name="oprI"
                        id="oprI"
                        value={oprInstruct}
                        onChange={ev => setOprInstruct(ev.target.value)}
                        placeholder="Input OPR Instruction"
                        className={`block w-full focus:ring-0 mt-5 ${(!oprInstruct && fieldMissing.oprInstruct) ? "ppa-form-error":"ppa-form-field-whole"}`}
                        style={{ resize: "none" }}
                      />
                    ):(
                      formLoading ? (
                        <div className="skeleton-form w-full mt-5"></div>
                      ):(
                        <>
                          {/* Edit */}
                          <textarea
                            id="recomendations"
                            name="recomendations"
                            rows={2}
                            style={{ resize: "none" }}
                            defaultValue={facData?.obr_instruct}
                            onChange={ev => setOprInstruct(ev.target.value)}
                            className={`block w-full focus:ring-0 mt-5 ${(!oprInstruct && fieldMissing.oprInstruct) ? "ppa-form-error":"ppa-form-field-whole"}`}
                            maxLength={255}
                            placeholder={enableAmOPR ? "Input here" : ""}
                            disabled={!enableAmOPR}
                          />
                        </>
                      )
                    )}
                  </div>

                  {/* OPR Action */}
                  <div className="items-center mb-4 mt-4 border-t border-gray-300">
                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-base font-bold leading-7 text-gray-900"> * OPR Action </h2>
                      {/* Buttons */}
                      <div className="mt-0 flex justify-start">
                        {GSO && !formLoading && (!facData?.obr_comment && (facData?.admin_approval == 3 || facData?.admin_approval == 6)) ? (
                          !buttonHide && (
                            <button 
                              type="submit"
                              onClick={oprActionSubmit}
                              className={`text-sm px-4 py-1.5 ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
                              disabled={submitLoading}
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
                          )
                        ):(
                          enableGsoOPR ? (
                            !buttonHide && (
                            <>
                              {/* Submit */}
                              <button 
                                type="submit"
                                onClick={oprEditAction}
                                className={`text-sm mr-2 px-4 py-1.5 ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
                                disabled={submitLoading}
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
                              
                              {/* Cancel */}
                              {!submitLoading && (
                                <button 
                                  onClick={() => {
                                    setEnableGsoOPR(false);
                                    setFieldMissing('');
                                  }}
                                  className="text-sm px-4 py-1.5 btn-cancel"
                                >
                                  Cancel
                                </button>
                              )}
                            </>
                            )
                          ):(
                          <>
                            {GSO && facData?.admin_approval == 2 && !enableGsoOPR && !enableAmOPR && !enableForm && !formLoading && (
                              <FontAwesomeIcon onClick={() => { setEnableGsoOPR(true); }} className="icon-edit-form" title="Edit" icon={faPenToSquare} />
                            )}

                            {/* For the SuperAdmin */}
                            {SuperHacker && facData?.form?.admin_approval == 1 && !formLoading && (
                              <FontAwesomeIcon onClick={() => { setEnableGsoOPR(true); }} className="icon-form" title="Edit" icon={faPenToSquare} />
                            )}
                          </>
                          )
                        )}
                      </div>
                    </div>

                    {/* Form */}
                    {(!facData?.obr_comment && (facData?.admin_approval == 3 || facData?.admin_approval == 6)) && !formLoading && GSO ? (
                      <textarea
                        id="recomendations"
                        name="recomendations"
                        rows={2}
                        style={{ resize: "none" }}
                        value={oprAction}
                        onChange={ev => setOprAction(ev.target.value)}
                        className={`block w-full focus:ring-0 mt-5 ${(!oprAction && fieldMissing.oprAction) ? "ppa-form-error":"ppa-form-field-whole"}`}
                        maxLength={255}
                        placeholder="Input here"
                      />
                    ):(
                      formLoading ? (
                        <div className="skeleton-form w-full mt-5"></div>
                      ):(
                        <textarea
                          id="recomendations"
                          name="recomendations"
                          rows={2}
                          style={{ resize: "none" }}
                          defaultValue={facData?.obr_comment}
                          onChange={ev => setOprAction(ev.target.value)}
                          className={`block w-full focus:ring-0 mt-5 ${(!oprAction && fieldMissing.oprAction) ? "ppa-form-error":"ppa-form-field-whole"}`}
                          maxLength={255}
                          placeholder={enableGsoOPR ? "Input here" : ""}
                          disabled={!enableGsoOPR}
                        />
                      )
                    )}
                  </div>
                </div>
                )}
              </>
              )}
            </div>
          </>
          )}
        </div>
      </div>
      {/* Activity */}
      <div className="col-span-3">
        <div className="ppa-widget-col request-form px-4 pb-6">
          {/* Header */}
          <div className="joms-user-info-header text-left"> 
            Activity
          </div>

          <div
            className="px-1.5 pb-6"
            style={{ minHeight: "auto", maxHeight: "500px", overflowY: "auto", }}
          >
            <table className="w-full border-collapse">
              <tbody>
                {activityLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (  // 5 skeleton rows
                    <tr key={index}>
                      {/* Dot */}
                      <td className="w-4 flex justify-center items-start pt-3 relative -left-2">
                        <span className="w-3 h-3 bg-gray-300 rounded-full z-10"></span>
                      </td>
                      <td className="p-3 w-[25%]">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="p-3 w-[20%]">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="p-3 w-[55%]">
                        <div className="skeleton h-4"></div>
                      </td>
                    </tr>
                  ))
                ):(
                  trackingForm?.length > 0 ? (
                    trackingForm?.map(list => (
                      <tr key={list.id} className="flex items-start relative">
                        {/* Dot */}
                        <td className="w-4 flex justify-center items-start pt-3 relative -left-2">
                          <span className="w-3 h-3 bg-gray-300 rounded-full z-10"></span>
                        </td>

                        {/* Timeline content */}
                        <td className="p-2 w-[25%] text-sm font-bold">{list.date}</td>
                        <td className="p-2 w-[20%] text-sm font-bold">{list.time}</td>
                        <td className="p-2 w-[55%] text-sm">{list.remarks}</td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td>
                        <span className="p-2 text-sm">No Activities Yet</span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Popup */}
    {showPopup && (
      <Popup 
        popupContent={popupContent}
        popupMessage={popupMessage}
        justClose={justClose}
        closePopup={closePopup}
        facility={facData?.id}
        submitAdminDecline={submitAdminDecline}
        DeleteFormRequest={DeleteFormRequest}
        submitLoading={submitLoading}
        submitAnimation={submitAnimation}
        form={"adminDecline"}
      />
    )}
  </PageComponent>
  )
 )
}