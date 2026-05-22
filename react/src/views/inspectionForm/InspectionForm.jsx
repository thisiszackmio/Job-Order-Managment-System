import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import loading_table from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../axios";
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPen, faCircleXmark, faFilePdf, faArrowLeft, faArrowRight, faFileCircleXmark, faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';

export default function InspectionForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

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

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchInspection(id);
      fetchActivity();
    }
  }, [id]);

  // Loading Function
  const [formLoading, setFormLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const [pageRestrict, setPageRestrict] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [enableSupDecline, setEnableSupDecline] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [reasonError , setReasonError] = useState(false);

  // Forms
  const [partBForm, setPartBForm] = useState(false);
  const [partCForm, setPartCForm] = useState(false);
  const [partDForm, setPartDForm] = useState(false);
  const [enablePartA, setEnablePartA] = useState(false);
  const [enablePartB, setEnablePartB] = useState(false);
  const [enablePartC, setEnablePartC] = useState(false);
  const [enablePartD, setEnablePartD] = useState(false);

  //Generate PDF
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // --- Data --- //
  const [inspectionData, setInspectionData] = useState([]);
  const [paginatedInspection, setPaginatedInspection] = useState([]);
  const [nameData, setNameData] = useState([]);

  const fetchInspection = async () => {
    try {
      const response = await axiosClient.get(`/showinsprequest/${id}`);
      const dataInspection = response.data;

      // console.log(dataInspection.form);
      setInspectionData(dataInspection.form);
      setPaginatedInspection({
        prev: dataInspection.prev_id,
        next: dataInspection.next_id
      });
      setNameData({
        gso: dataInspection.gso_name,
        admin: dataInspection.admin_name
      });

      if(dataInspection.form?.user_id == currentUserId || accessOnly) {
        setPageRestrict(true);
      }else{
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

  // --- Get the Personnel (Based on Type of Property) --- //
  const [getPersonnel, setGetPersonnel] = useState([]);

  const fetchDisplayPersonnel = async () => {
    try {
      const response = await axiosClient.get(`/displaypersonnel/${id}`);
      const dataPersonnel = response.data;

      // console.log(dataPersonnel);
      setGetPersonnel(dataPersonnel);

    } catch(error){
      console.error("Unexpected error:", error);
    }
  }

  // --- Activity (for tracking) --- //
  const [trackingForm, setTrackingForm] = useState({});

  const fetchActivity = async () => {
    try {
      const response = await axiosClient.get(`/formtracking/${id}`,{
        params: { type: 'Repair' }
      });
      const dataActivity = response.data;

      // console.log(dataActivity);
      setTrackingForm(dataActivity);

    } catch(error) {
      console.error("Unexpected error:", error);
    } finally {
      setActivityLoading(false);
    }
  }

  // --- Auto Close Request --- //
  const setFormClosed = () => {

    if(GSO || inspectionData?.form?.user_id == currentUserId || SuperHacker){
      axiosClient
      .get(`/closeinspectionrequest/${id}`)
      .then(response => {
        console.log(response.data.message); // Show success message
      })
      .catch(error => {
        setPopupContent("error");
        setPopupMessage(error.response.status);
        setShowPopup(true); 
      })
      .finally(() => {
        setFormLoading(false);
      });
    }
    
  }

  // --- Pagination --- //
  // Previous Page
  const handlePrev = () => {
    // alert(paginatedInspection?.prev)
    if (!paginatedInspection?.prev) return; // stop if no previous
    setFormLoading(true);
    setActivityLoading(true);
    navigate(`/joms/inspection/form/${paginatedInspection?.prev}`);
  };

  // Next Page
  const handleNext = () => {
    if (!paginatedInspection?.next) return; // stop if no next
    setFormLoading(true);
    setActivityLoading(true);
    navigate(`/joms/inspection/form/${paginatedInspection?.next}`);
  };

  useEffect(() => { 
    if(currentUserId){
      setFormClosed();
      fetchActivity();
      fetchInspection();
    }
    if(partBForm || enablePartB){
      fetchDisplayPersonnel();
    }
  }, [currentUserId, partBForm, enablePartB]);

  // --- Edit/Add Area --- //
  // Update Part A useState
  const [updatepropertyNo, setUpdatePropertyNo] = useState(inspectionData?.property_number ?? "");
  const [updateacquisitionDate, setUpdateAcquisitionDate] = useState(inspectionData?.acquisition_date ?? "");
  const [updateacquisitionCost, setUpdateAcquisitionCost] = useState(inspectionData?.acquisition_cost ?? "");
  const [updateBrandModel, setUpdateBrandModel] = useState(inspectionData?.brand_model ?? "");
  const [updateSerialEngineNo, setUpdateSerialEngineNo] = useState(inspectionData?.serial_engine_no ?? "");
  const [updateTypeofProperty, setUpdateTypeofProperty] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateLocation, setUpdateLocation] = useState('');
  const [updateComplain, setUpdateComplain] = useState('');

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
      } else if(responseData === 'UnEdited'){
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
      if(error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.property_description ? "Empty fields on Description" : 
              responseErrors.location ? "Empty fields on Location" :
              "Empty fields on Complain"}
            </p>
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

  // Update / Enable Part B useState
  const [partBdate, setPartBdate] = useState(today);
  const [lastfilledDate, setLastFilledDate] = useState('');
  const [natureRepair, setNatureRepair] = useState('');
  const [pointPersonnel, setPointPersonnel] = useState({ pid: '', pname: '' });
  const [updatePartBdate, setUpdatePartBdate] = useState(inspectionData?.date_of_filling?.split("T")[0] ?? "");
  const [updatelastfilledDate, setUpdateLastFilledDate] = useState(inspectionData?.date_of_last_repair ?? "");
  const [updatenatureRepair, setUpdateNatureRepair] = useState(inspectionData?.nature_of_last_repair ?? "");
  const [updatepointPersonnel, setUpdatePointPersonnel] = useState({ pid: '', pname: '' });  

  // Fill up (GSO) Part B
  const handleGSOSubmitConfirmation = () => {
    setButtonHide(true);
    setShowPopup(true);
    setPopupContent('gsoi');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation</p>
        <p className="popup-message">Do you want to proceed without data for the Date of Last Repair or the Nature of Last Repair?</p>
      </div>
    );
  }

  function SubmitPartB(){
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
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.date_of_filling ? "Empty fields on Date" : 
              "Empty fields on Assign Personnel"}
            </p>
          </div>
        );
        setShowPopup(true);
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
      personnel_id: updatepointPersonnel.pid ? updatepointPersonnel.pid : inspectionData?.personnel_id,
      personnel_name: updatepointPersonnel.pname ? updatepointPersonnel.pname : inspectionData?.personnel_name,
      code: ucode
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
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if (error.response.status === 408) {
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid</p>
            <p className="popup-message">You can no longer reassign the personnel.</p>
          </div>
        );
        setShowPopup(true);
      } else if (error.response.status === 422) {
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.date_of_filling && "Empty fields on Date" }
            </p>
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

  // Update / Enable Part C useState
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [partCDate, setPartCDate] = useState(today);
  const [updatefindings, setUpdateFindings] = useState('');
  const [updaterecommendations, setUpdateRecommendations] = useState('');

  // Fill up (Assign Personnel) Part C
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
        setPopupMessage(error.response.status);
      }else{
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.before_repair_date ? "Empty fields on Date" : 
              responseErrors.findings ? "Empty fields on Findings":
              "Empty fields on Recommendations"}
            </p>
          </div>
        );
        setShowPopup(true);
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
      code: ucode
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
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if(error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.before_repair_date ? "Empty fields on Date" : 
              responseErrors.findings ? "Empty fields on Findings":
              "Empty fields on Recommendations"}
            </p>
          </div>
        );
        setShowPopup(true);
      } else {
        setPopupContent("error");
        setPopupMessage(error.response.status);
        setShowPopup(true); 
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update / Enable Part D useState
  const [partDDate, setPartDDate] = useState(today);
  const [remarks, setRemarks] = useState('');
  const [updateremarks, setUpdateRemarks] = useState('');

  // Fill up (Assign Personnel) Part D
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
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.after_reapir_date ? "Empty fields on Date" : 
              "Empty fields on Remarks"}
            </p>
          </div>
        );
        setShowPopup(true);
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
      code: ucode
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
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Oops!</p>
            <p className="popup-message">This form is already closed!</p>
          </div>
        );
        setShowPopup(true);
      } else if(error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.after_reapir_date ? "Empty fields on Date" : 
              "Empty fields on Remarks"}
            </p>
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

  // --- Cancel the Form --- //
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

  // Update state when inspectionData updates
  useEffect(() => {
    setUpdatePropertyNo(inspectionData?.property_number ?? "");
    setUpdateAcquisitionDate(inspectionData?.acquisition_date ?? "");
    setUpdateAcquisitionCost(inspectionData?.acquisition_cost ?? "");
    setUpdateBrandModel(inspectionData?.brand_model ?? "");
    setUpdateSerialEngineNo(inspectionData?.serial_engine_no ?? "");
    setUpdateTypeofProperty(inspectionData?.type_of_property ?? "");
    setUpdateDescription(inspectionData?.property_description ?? "");
    setUpdateLocation(inspectionData?.location ?? "");
    setUpdateComplain(inspectionData?.complain ?? "");
    setUpdatePartBdate(inspectionData?.date_of_filling ?? "");
    setUpdateLastFilledDate(inspectionData?.date_of_last_repair ?? "");
    setUpdateNatureRepair(inspectionData?.nature_of_last_repair ?? "");
    setPartCDate(inspectionData?.before_repair_date ?? "");
    setUpdateFindings(inspectionData?.findings ?? "");
    setUpdateRecommendations(inspectionData?.recommendations ?? "");
    setPartDDate(inspectionData?.after_reapir_date ?? "")
    setUpdateRemarks(inspectionData?.remarks ?? "");
  },[
    inspectionData?.property_number,
    inspectionData?.acquisition_date,
    inspectionData?.acquisition_cost,
    inspectionData?.brand_model,
    inspectionData?.serial_engine_no,
    inspectionData?.type_of_property,
    inspectionData?.property_description,
    inspectionData?.location,
    inspectionData?.complain,
    inspectionData?.date_of_filling,
    inspectionData?.date_of_last_repair,
    inspectionData?.nature_of_last_repair,
    inspectionData?.before_repair_date,
    inspectionData?.findings,
    inspectionData?.recommendations,
    inspectionData?.after_reapir_date,
    inspectionData?.remarks
  ]);

  // --- Approval Functions --- //
  // For the Supervisor Approval
  const handleSupApprovalConfirmation = () => {
    setButtonHide(true);
    setShowPopup(true);
    setPopupContent('dma');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to approve {inspectionData?.form?.user_name}'s request?</p>
      </div>
    );
  }

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

  // For Supervisor Disapproval
  const [reason, setReason] = useState('');
  function handleSupDeclineConfirmation(){
    if(!reason){
      setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              Empty form on Disapproval Reason
            </p>
          </div>
        );
        setShowPopup(true);
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

  // For the Admin
  const handleAdminApprovalConfirmation = () => {
    setButtonHide(true);
    setShowPopup(true);
    setPopupContent('ama');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation</p>
        <p className="popup-message">Do you want to approve {inspectionData?.form?.user_name}'s request?</p>
      </div>
    );
  }

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

  // Pdf
  const loadPDF = async () => {
    try {
      setShowPDF(true);
      setLoadingPDF(true);

      const response = await axiosClient.get(
        `/inspection/pdf/${id}`,
        { responseType: "blob" }
      );

      // 🔥 GET FILENAME FROM HEADER
      const disposition = response.headers["content-disposition"];
      let filename = "Inspection.pdf";

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
    link.download = `Pre-Post-Repair-Inspection-Control-Nnumber-${id}.pdf`;
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

  // Close the Popup
  function justClose(){
    setShowPopup(false);
    setButtonHide(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setEnableSupDecline(false)
    setFormLoading(true);
    setActivityLoading(true);
    setButtonHide(false);
    setEnablePartA(false);
    setPartBForm(false);
    setEnablePartB(false);
    setEnablePartC(false);
    setPartCForm(false);
    setEnablePartD(false);
    setPartDForm(false);
    setSubmitLoading(false);
    setShowPopup(false);
    fetchInspection();
    fetchActivity();
    setShowPDF(false);
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const DivisionManager = codes.includes("DM");
  const SuperHacker = codes.includes("HACK");
  const ITAdmin = codes.includes("AUS");
  const AuthorityAccess = codes.includes("AUI");
  const roles = ["HACK", "AUS", "AM", "AUI", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return (
    !pageRestrict ? (<Restrict />):(
    <PageComponent title="Request Form">
      {/* Wrapper */}
      <div className="grid grid-cols-10 gap-4 mt-8">
        {/* Form */}
        <div className="col-span-7">
          <div className="ppa-widget-col request-form px-4 pb-6">
            {/* Header */}
            <div className="joms-user-info-header text-left"> 
              Pre/Post Repair Inspection Form
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
              {(GSO || DivisionManager || Admin || SuperHacker || ITAdmin || AuthorityAccess) && (
                <div className="text-sm flex justify-between items-center w-full mb-2 mt-4">
                  {!formLoading && (
                  <>
                    {/* Previous */}
                    <button
                      onClick={handlePrev}
                      disabled={!paginatedInspection?.prev || formLoading}
                      className={`rounded ${
                        paginatedInspection?.prev
                          ? "ppa-arrow"
                          : "ppa-arrow-disable cursor-not-allowed"
                      }`}
                      style={{
                        visibility: paginatedInspection?.prev ? "visible" : "hidden"
                      }}
                    >
                      <span className="flex items-center group-hover:text-white transition-colors">
                        <FontAwesomeIcon
                          className="icon-form group-hover:text-white transition-colors"
                          title="Prev"
                          icon={faArrowLeft}
                        />
                        &nbsp; Page{" "}
                        {paginatedInspection?.prev && paginatedInspection?.prev}
                      </span>
                    </button>

                    {/* Next */}
                    <button
                      onClick={handleNext}
                      disabled={!paginatedInspection?.next || formLoading}
                      className={`mr-4 rounded ${
                        paginatedInspection?.next
                          ? "ppa-arrow"
                          : "ppa-arrow-disable cursor-not-allowed"
                      }`}
                      style={{
                        visibility: paginatedInspection?.next ? "visible" : "hidden"
                      }}
                    >
                      <span className="flex items-center group-hover:text-white transition-colors">
                        Page{" "}
                        {paginatedInspection?.next && paginatedInspection?.next}
                        &nbsp;
                        <FontAwesomeIcon
                          className="icon-form group-hover:text-white transition-colors"
                          title="Next"
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
                  {!enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && inspectionData?.form_status != 0 && !formLoading && (
                  <>
                    {!inspectionData?.date_of_filling && !inspectionData?.before_repair_date && !inspectionData?.after_reapir_date ? (
                    <>
                      {/* Cancel Function */}
                      {[6, 8, 9, 10, 11].includes(inspectionData?.form_status) && (
                        (GSO || SuperHacker || AuthorityAccess) && (
                          <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-edit-form" title="Cancel Request" icon={faCircleXmark} />
                        )
                      )}

                      {/* Cancel Function for the Reqestor */}
                      {inspectionData?.user_id == currentUserId && !SuperHacker && !GSO && (
                        [8, 9, 10, 11].includes(inspectionData?.form_status) && (
                          <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-edit-form" title="Cancel Request" icon={faCircleXmark} />
                        )
                      )}
                    </>
                    ):null}

                    {/* Generate PDF inspectionData?.user_id === currentUserId*/}
                    {!isMobile && (
                    <>
                      {/* For GSO and SuperAdmin */}
                      {![0, 7].includes(inspectionData?.form_status) && (GSO || SuperHacker || AuthorityAccess) && (
                        <FontAwesomeIcon onClick={loadPDF} className="icon-edit-form" title="Get PDF" icon={faFilePdf} />
                      )}

                      {/* For Regular Requestor */}
                      {[1, 2].includes(inspectionData?.form_status) && inspectionData?.user_id == currentUserId && !SuperHacker && !GSO && (
                        <FontAwesomeIcon onClick={loadPDF} className="icon-edit-form" title="Get PDF" icon={faFilePdf} />
                      )}
                    </>
                    )}

                    {/* For the Supervisor */}
                    {DivisionManager && currentUserId == inspectionData?.supervisor_id && inspectionData?.form_status == 11 && (
                      enableSupDecline ? (
                      <>
                        <button onClick={() => handleSupDeclineConfirmation()} className="w-full md:auto py-1.5 px-4 text-sm btn-secondary"> Submit </button>
                        <button onClick={() => { setEnableSupDecline(false); setReason(''); setReasonError(false); }} className="w-full md:auto py-1.5 px-4 text-sm btn-cancel"> Cancel </button>
                      </>
                      ):(
                        !submitLoading && !buttonHide && (
                          <>
                            {/* Approve */}
                            <button onClick={() => handleSupApprovalConfirmation()} className="w-full md:auto py-1.5 px-4 text-sm btn-secondary"> Approve </button>
                            {/* Decline */}
                            {!inspectionData?.form?.before_repair_date && !inspectionData?.form?.after_reapir_date && (
                              <button onClick={() => setEnableSupDecline(true)} className="w-full md:auto py-1.5 px-4 text-sm btn-cancel"> Decline </button>
                            )}
                          </>
                        )
                      )
                    )}

                    {/* Admin */}
                    {Admin && (
                      inspectionData?.form_status == 5 && (
                        !submitLoading && !buttonHide && (
                          <button
                            onClick={() => handleAdminApprovalConfirmation()} 
                            className="w-full md:w-auto py-1.5 px-4 text-sm btn-secondary"
                          >
                            Approve
                          </button>
                        )
                      )
                    )}
                  </>
                  )}
                  </div>
                </div>

                {enableSupDecline ? (
                  <>
                    {/* Form Reason */}
                    <form id="submitSupReason" onSubmit={SubmitSupReason}>
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
                            value={reason}
                            onChange={ev => setReason(ev.target.value)}
                            placeholder="Input your reasons"
                            className="block w-full focus:ring-0 ppa-form-field"
                          />
                        </div>
                      </div>
                    </form>
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
                          !partBForm && !partCForm && !partDForm && !enablePartA && !enablePartB && !enablePartC && !enablePartD ? (
                            DivisionManager && inspectionData?.form_status == 11 ? ("Waiting for your approval.")
                            :GSO && inspectionData?.form_status == 5 ? ("You have entered the Part B form, and it is now pending Admin Manager approval.")
                            :Admin && inspectionData?.form_status == 5 ? ("Waiting for your approval.")
                            :currentUserId == inspectionData?.form?.personnel_id && inspectionData?.form?.form_status == 4 ? ("You are assign on this request.")
                            :currentUserId == inspectionData?.form?.personnel_id && inspectionData?.form?.form_status == 3 ? ("You are assign on this request.")
                            :(currentUserId == inspectionData?.form?.personnel_id || GSO || SuperHacker) && inspectionData?.form?.form_status == 2 ? ("The assigned personnel has completed the form. It will only be editable for 24 hours (if you see this).")
                            :(
                              [5, 11].includes(inspectionData?.form_status) &&
                              inspectionData?.date_of_filling &&
                              inspectionData?.before_repair_date &&
                              inspectionData?.after_reapir_date ? (
                                <>
                                  Form was completed, but no approval from {[11].includes(inspectionData?.form_status) && "Immediate Supervisor "} {[11].includes(inspectionData?.form_status) ? "and" : null} {[5, 11].includes(inspectionData?.form_status) && "Admin Manager"}.
                                </>
                              ):(
                                inspectionData?.form_remarks
                              )
                            )
                          ):(
                            "Form field enable"
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {inspectionData?.form?.form_status}
                  {/* Part A */}
                  <div className="pb-6 mt-6 border-b border-gray-300">
                    {/* Caption */}
                    <div className="flex justify-between items-center">
                      <h2 className="req-title"> Part A: To be filled-up by Requesting Party </h2>
                      {/* Buttons */}
                      <div className="flex justify-start">
                        {(![0, 7].includes(inspectionData?.form_status) && !formLoading) ? (
                          enablePartA ? (
                            !buttonHide && (
                            <>
                              {/* Submit */}
                              <button 
                                type="submit"
                                onClick={() => UpdatePartA()}
                                className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                disabled={submitLoading}
                              >
                                {submitLoading ? (
                                  <div className="flex justify-center">
                                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                    <span className="ml-1">Loading</span>
                                  </div>
                                ):(
                                  'Update'
                                )}
                              </button>

                              {/* Cancel */}
                              {!submitLoading && (
                                <button onClick={() => { 
                                    setEnablePartA(false);
                                    setUpdateDescription(inspectionData?.property_description);
                                    setUpdateLocation(inspectionData?.location);
                                    setUpdateComplain(inspectionData?.complain);
                                  }} className="w-full py-1.5 px-4 text-sm btn-cancel">
                                  Cancel
                                </button>
                              )}
                            </>
                            )
                          ):(
                            !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && (
                            <> 
                              {/* SuperHacker */}
                              {SuperHacker && (
                                <FontAwesomeIcon onClick={() => { setEnablePartA(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                              )}
                              {/* GSO */}
                              {(GSO || AuthorityAccess) && ![0, 1, 7].includes(inspectionData?.form_status) && (
                                <FontAwesomeIcon onClick={() => { setEnablePartA(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                              )}
                              {/* Regular */}
                              {currentUserId == inspectionData?.user_id && !SuperHacker && !GSO && (
                                !inspectionData?.date_of_filling && !inspectionData?.before_repair_date && !inspectionData?.after_reapir_date ? (
                                  <FontAwesomeIcon onClick={() => { setEnablePartA(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                                ):null
                              )}
                            </>
                            )
                          )
                        ):null}
                      </div>
                    </div>

                    {/* ---- Part A Fields ---- */}
                    <div className="grid gap-6 grid-cols-2 mt-2">
                      {/* left side */}
                      <div className="col-span-1">
                        
                        {/* Date */}
                        <div className="flex items-center mt-4">
                          <div className="w-52 flex form-title">
                            <label> 
                              Date 
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={formatDate(inspectionData?.date_request)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  readOnly={enablePartA}
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {formatDate(inspectionData?.date_request)}
                              </div>
                            )
                          )}
                        </div>

                        {/* Property No */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Property No 
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="rep_property_no"
                                  id="rep_property_no"
                                  autoComplete="rep_property_no"
                                  value={updatepropertyNo}
                                  onChange={ev => setUpdatePropertyNo(ev.target.value)}
                                  placeholder="Input Property Number" 
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>                            
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.property_number ? inspectionData?.property_number : "N/A"}
                              </div>
                            )
                          )}
                        </div>

                        {/* Acquisition Date */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Acquisition Date
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="date"
                                  name="rep_acquisition_date"
                                  id="rep_acquisition_date"
                                  value={updateacquisitionDate}
                                  onChange={ev => setUpdateAcquisitionDate(ev.target.value)}
                                  max={currentDate}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.acquisition_date ? formatDate(inspectionData?.acquisition_date) : "N/A"}
                              </div>
                            )
                          )}
                        </div> 

                        {/* Acquisition Cost */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Acquisition Cost
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <div className="relative flex items-center">
                                  <span className="absolute left-0 top-2 flex items-center pl-2 text-gray-600">
                                    ₱
                                  </span>
                                </div>
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
                                  className="block w-full focus:ring-0 cost ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.acquisition_cost 
                                  ? new Intl.NumberFormat('en-PH', {
                                      style: 'currency',
                                      currency: 'PHP'
                                    }).format(inspectionData?.acquisition_cost) 
                                  : 'N/A'}
                              </div>
                            )
                          )}
                        </div> 

                        {/* Brand/Model */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Brand/Model
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="brand_mrep_brand_model"
                                  id="rep_brand_model"
                                  autoComplete="rep_brand_model"
                                  value={updateBrandModel}
                                  onChange={ev => setUpdateBrandModel(ev.target.value)}
                                  placeholder="Input Brand/Model"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.brand_model ? inspectionData?.brand_model : "N/A"}
                              </div>
                            )
                          )}
                        </div>

                        {/* Serial/Engine No */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Serial/Engine No
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="rep_serial_engine_no"
                                  id="rep_serial_engine_no"
                                  autoComplete="rep_serial_engine_no"
                                  value={updateSerialEngineNo}
                                  onChange={ev => setUpdateSerialEngineNo(ev.target.value)}
                                  placeholder="Input Serial/Engine No"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.serial_engine_no ? inspectionData?.serial_engine_no : "N/A"}
                              </div>
                            )
                          )}
                        </div>

                      </div>

                      {/* right side */}
                      <div className="col-span-1">

                        {/* Type of Property */}
                        <div className="flex items-center mt-4">
                          <div className="w-52 flex form-title">
                            <label> 
                              Type of Property
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <select
                                  name="rep_type_of_property"
                                  id="rep_type_of_property"
                                  value={updateTypeofProperty || inspectionData?.type_of_property}
                                  onChange={ev => setUpdateTypeofProperty(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                >
                                  <option value={inspectionData?.type_of_property} disabled>
                                    {inspectionData?.type_of_property}
                                  </option>
                                  {[
                                    "Vehicle Supplies & Materials",
                                    "IT Equipment & Related Materials",
                                    "Others"
                                  ]
                                    .filter(option => option !== inspectionData?.type_of_property)
                                    .map(option => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {inspectionData?.type_of_property}
                              </div>
                            )
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex items-stretch mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Description
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full flex">
                                <input
                                  type="text"
                                  name="rep_description"
                                  id="rep_description"
                                  value={updateDescription}
                                  onChange={ev => setUpdateDescription(ev.target.value)}
                                  placeholder="Enter Description"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm flex items-center">
                                {inspectionData?.property_description}
                              </div>
                            )
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex items-stretch mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Location
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="rep_location"
                                  id="rep_location"
                                  value={updateLocation}
                                  onChange={ev => setUpdateLocation(ev.target.value)}
                                  placeholder="Enter Location"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm flex items-center">
                                {inspectionData?.location}
                              </div>
                            )
                          )}
                        </div>

                        {/* Requestor */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Requestor
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={inspectionData?.user_name}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm flex items-center">
                                <strong>{inspectionData?.user_name}</strong>
                              </div>
                            )
                          )}
                        </div>

                        {/* Supervisor */}
                        <div className="flex items-center mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Supervisor
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enablePartA ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={inspectionData?.supervisor_name}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm flex items-center">
                                <strong>{inspectionData?.supervisor_name}</strong>
                              </div>
                            )
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Complain */}
                    <div className="flex items-stretch mt-2">
                      <div className="w-44 flex form-title">
                        <label> 
                          Complain
                        </label> 
                      </div>
                      {formLoading ? (
                        <div className="skeleton-form w-full"></div>
                      ):(
                        enablePartA ? (
                          <div className="w-full">
                            <input
                              type="text"
                              name="rep_property_no"
                              id="rep_property_no"
                              value={updateComplain}
                              onChange={ev => setUpdateComplain(ev.target.value)}
                              placeholder="Input Complain" 
                              className="block w-full focus:ring-0 ppa-form-field"
                            />
                          </div>
                        ):(
                          <div className="w-full ppa-form-confirm flex items-center">
                            {inspectionData?.complain}
                          </div>
                        )
                      )}
                    </div>

                    {/* Note */}
                    {currentUserId == inspectionData?.user_id && !GSO && !formLoading && (
                      [8, 9, 10, 11].includes(inspectionData?.form_status) ? (
                        <p className="note-form"><span> Note: </span> This form can only be edited before {[8, 9, 10].includes(inspectionData?.form_status) ? ("the GSO submits Part B of the form"):("the supervisor approval")}. </p>
                      ):([3, 4, 5, 6].includes(inspectionData?.form_status) && !SuperHacker) ? (
                        <p className="note-form"><span> Note: </span> This form cannot be edited. </p>
                      ):null
                    )}
                  </div>

                  {/* Part B */}
                  <div className="pb-6 border-b border-gray-300">
                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="req-title"> Part B: To be filled-up by Administrative Division </h2>
                      {/* Buttons */}
                      <div className="flex justify-start">
                        {partBForm ? (
                          !buttonHide && (
                          <>
                            {/* Submuit */}
                            {(lastfilledDate || natureRepair) ? (
                              <button type="submit"
                                onClick={() => SubmitPartB()}
                                className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                disabled={submitLoading}
                              >
                              {submitLoading ? (
                                <div className="flex justify-center">
                                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                  <span className="ml-1">Loading</span>
                                </div>
                              ):(
                              'Submit'
                              )}
                            </button>
                            ):(
                              <button type="submit"
                                onClick={() => handleGSOSubmitConfirmation()} 
                                className="w-full md:w-auto py-1.5 px-4 text-sm mr-2 btn-secondary"
                              >
                                Submit
                              </button>
                            )}

                            {/* Cancel */}
                            {!submitLoading && (
                              <button onClick={() => { 
                                  setPartBForm(false); 
                                  setPointPersonnel({ pid: '', pname: '' });
                                  setNatureRepair('');
                                  setLastFilledDate('');
                                }} className="w-full md:w-auto py-1 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):enablePartB ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button type="submit"
                              onClick={() => UpdatePartB()}
                              className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                              disabled={submitLoading}
                            >
                              {submitLoading ? (
                                <div className="flex justify-center">
                                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                  <span className="ml-1">Loading</span>
                                </div>
                              ):(
                                'Update'
                              )}
                            </button>

                            {/* Cancel */}
                            {!submitLoading && (
                              <button onClick={() => { 
                                  setEnablePartB(false); 
                                  setPointPersonnel({ pid: inspectionData?.personnel_id, pname: inspectionData?.personnel_name });
                                  setUpdatePartBdate(inspectionData?.date_of_filling);
                                  setUpdateLastFilledDate(inspectionData?.date_of_last_repair);
                                  setUpdateNatureRepair(inspectionData?.nature_of_last_repair);
                                }} className="w-full md:w-auto py-1.5 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):(
                          !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && !formLoading && (
                            <>
                            {/* Super Hacker */}
                            {[1, 2, 3, 4, 5].includes(inspectionData?.form_status) && SuperHacker && (
                              <FontAwesomeIcon onClick={() => { setEnablePartB(true); }} className="icon-edit-form" title="Edit Part B" icon={faPenToSquare} />
                            )}
                            {/* GSO */}
                            {(GSO || AuthorityAccess) && (
                              [6, 8, 9, 10].includes(inspectionData?.form_status) ? (
                                <FontAwesomeIcon onClick={() => { setPartBForm(true); }} className="icon-edit-form" title="Enable Form" icon={faPen} />
                              )
                              :[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(inspectionData?.form_status) ? (
                                <FontAwesomeIcon onClick={() => { setEnablePartB(true); }} className="icon-edit-form self-center" title="Edit Part B" icon={faPenToSquare} />
                              )
                              :null
                            )}
                          </>
                          )
                        )}
                      </div>
                    </div>

                    {/* ---- Part B Fields ---- */}
                    <div className="grid gap-6 grid-cols-2 mt-2">
                      {/* left side */}
                      <div className="col-span-1">

                        {/* Date */}
                        <div className="flex items-center mt-6">
                          <div className="w-56 flex form-title">
                            <label> 
                              Date
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partBForm ? (
                              <div className="w-full">
                                <input 
                                  type="date" 
                                  name="rep_date" 
                                  value={partBdate}
                                  onChange={ev => setPartBdate(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  max={today}
                                />
                              </div>
                            ):(
                              enablePartB && (GSO || SuperHacker) ? (
                                <div className="w-full">
                                  <input
                                    type="date"
                                    name="last_date_filled"
                                    id="last_date_filled"    
                                    value={updatePartBdate}
                                    onChange={ev => setUpdatePartBdate(ev.target.value)}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    max={today}
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.date_of_filling ? formatDate(inspectionData?.date_of_filling) : null }
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Date of Last Repair */}
                        <div className="flex items-center mt-2">
                          <div className="w-56 flex form-title">
                            <label> 
                              Date of Last Repair
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partBForm ? (
                              <div className="w-full">
                                <input
                                  type="date"
                                  name="last_date_filled"
                                  id="last_date_filled"    
                                  value={lastfilledDate}
                                  onChange={ev => setLastFilledDate(ev.target.value)}
                                  max={currentDate}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              enablePartB && (GSO || SuperHacker) ? (
                                <div className="w-full">
                                  <input
                                    type="date"
                                    name="last_date_filled"
                                    id="last_date_filled"    
                                    value={updatelastfilledDate}
                                    onChange={ev => setUpdateLastFilledDate(ev.target.value)}
                                    max={currentDate}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.date_of_filling ? (
                                    inspectionData?.date_of_last_repair ? formatDate(inspectionData?.date_of_last_repair) : 'N/A'
                                  ) : null  }
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Assign Personnel */}
                        <div className="md:flex items-center mt-2">
                          <div className="w-56 flex form-title">
                            <label> 
                              Assign Personnel
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partBForm ? (
                              <div className="w-full">
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
                                  className="block w-full focus:ring-0 ppa-form-field"

                                  >
                                    <option value="" disabled>Select an option</option>
                                    {getPersonnel.map(data => (
                                      <option key={data.personnel_id} value={data.personnel_id}>
                                        {data.personnel_name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ):(
                              enablePartB && (GSO || SuperHacker) ? (
                                <div className="w-full">
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
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    disabled={SuperHacker || ![5, 6, 8, 9, 10, 11].includes(inspectionData?.form_status)}
                                  >
                                    {/* Disabled option for current personnel */}
                                    <option value="" disabled>
                                      {inspectionData?.personnel_name ? `${inspectionData.personnel_name}`  : "Select Personnel"} 
                                    </option>

                                    {/* Filter out current personnel */}
                                    {getPersonnel
                                      .map(data => (
                                        <option key={data.personnel_id} value={data.personnel_id}>
                                          {data.personnel_name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  <strong>{inspectionData?.personnel_name}</strong>
                                </div>
                              )
                            )
                          )}
                        </div>

                      </div>
                      {/* right side */}
                      <div className="col-span-1">

                        {/* Requested By */}
                        <div className="flex items-center mt-6">
                          <div className="w-56 flex form-title">
                            <label> 
                              Requested By
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partBForm ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={nameData?.gso}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              enablePartB && (GSO || SuperHacker) ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={nameData?.gso}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    disabled
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  <strong>{inspectionData?.date_of_filling ? nameData?.gso : null}</strong>
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Noted By */}
                        <div className="flex items-center mt-2">
                          <div className="w-56 flex form-title">
                            <label> 
                              Noted By
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partBForm ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={nameData?.admin}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              enablePartB && (GSO || SuperHacker) ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={nameData?.admin}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    disabled
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  <strong>{inspectionData?.date_of_filling ? nameData?.admin : null}</strong>
                                </div>
                              )
                            )
                          )}
                        </div>
                        
                      </div>
                    </div>

                    {/* Nature of Last Repair */}
                    <div className="flex items-center mt-2">
                      <div className="w-52 flex form-title">
                        <label> 
                          Nature of Last Repair
                        </label> 
                      </div>
                      {formLoading ? (
                        <div className="skeleton-form w-full"></div>
                      ):(
                        partBForm ? (
                          <div className="w-full">
                            <input
                              id="nature_repair"
                              name="nature_repair"
                              value={natureRepair}
                              onChange={ev => setNatureRepair(ev.target.value)}
                              maxLength={255}
                              placeholder="Enter Nature of Last Repair"
                              className="block w-full focus:ring-0 ppa-form-field"
                            />
                          </div>
                        ):(
                          enablePartB && (GSO || SuperHacker) ? (
                            <div className="w-full">
                              <input
                                id="nature_repair"
                                name="nature_repair"
                                value={updatenatureRepair}
                                onChange={ev => setUpdateNatureRepair(ev.target.value)}
                                placeholder="Enter Nature of Last Repair"
                                maxLength={255}
                                className="block w-full focus:ring-0 ppa-form-field"
                              />
                            </div>
                          ):(
                            <div className="w-full ppa-form-confirm h-[40px]">
                              {inspectionData?.date_of_filling ? (
                                inspectionData?.nature_of_last_repair ? inspectionData?.nature_of_last_repair : 'N/A'
                              ) : null}
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>

                  {/* Part C */}
                  <div className="pb-6 border-b border-gray-300">
                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job </h2>
                      {/* Buttons */}
                      <div className="mt-0 flex justify-start">
                        {partCForm ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button type="submit"
                              onClick={() => SubmitPartC()}
                              className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                              disabled={submitLoading}
                            >
                            {submitLoading ? (
                              <div className="flex justify-center">
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
                                }} className="w-full md:w-auto py-1.5 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):enablePartC ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button type="submit"
                              onClick={() => UpdatePartC()}
                              className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                              disabled={submitLoading}
                            >
                              {submitLoading ? (
                                <div className="flex justify-center">
                                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                  <span className="ml-1">Loading</span>
                                </div>
                              ):(
                                'Update'
                              )}
                            </button>

                            {/* Cancel */}
                            {!submitLoading && (
                              <button onClick={() => { 
                                  setEnablePartC(false);
                                  setPartCDate(inspectionData?.before_repair_date);
                                  setUpdateFindings(inspectionData?.findings);
                                  setUpdateRecommendations(inspectionData?.recommendations);
                                }} className="w-full md:w-auto py-1.5 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):(
                          !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && !formLoading && (
                          <>
                            {/* SuperHacker */}
                            {SuperHacker && (
                              inspectionData?.form_status == 4 && inspectionData?.personnel_id == currentUserId ? (
                                <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-edit-form self-center" title="Enable Form" icon={faPen} />
                              ):[1, 2, 3].includes(inspectionData?.form_status) ? (
                                <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form self-center" title="Edit Part C" icon={faPenToSquare} />
                              ):null 
                            )}
                            {/* Authority */}
                            {AuthorityAccess && (
                              ![0, 1, 7].includes(inspectionData?.form_status) && (
                                  <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form" title="Edit Part C" icon={faPenToSquare} />
                              )
                            )}
                            {/* GSO */}
                            {GSO && (
                              inspectionData?.date_of_filling && (
                                <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form self-center" title="Edit Part C" icon={faPenToSquare} />
                              )
                            )}
                            {/* Assign Personnel */}
                            {inspectionData?.personnel_id == currentUserId && !SuperHacker && (
                              inspectionData?.form_status == 4 ? (
                                <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-edit-form self-center" title="Enable Form" icon={faPen} />
                              ):[2, 3].includes(inspectionData?.form?.form_status) ? (
                                <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form self-center" title="Edit Part C" icon={faPenToSquare} />
                              ):null
                            )}
                          </>
                          )
                        )}
                      </div>
                    </div>

                    {/* ---- Part C Fields ---- */}
                    <div className="grid gap-6 grid-cols-2 mt-2">
                      {/* left side */}
                      <div className="col-span-1">
                        {/* Date Inspected */}
                        <div className="flex items-center mt-6">
                          <div className="w-64">
                            <label className="form-title">
                              Date:
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partCForm ? (
                              <div className="w-full">
                                <input
                                  type="date"
                                  name="date_filled"
                                  id="date_filled"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  value={partCDate}
                                  onChange={ev => setPartCDate(ev.target.value)}
                                  max={today}
                                />
                              </div>
                            ):(
                              enablePartC && (GSO || SuperHacker || inspectionData?.personnel_id == currentUserId) ? (
                                <div className="w-full">
                                  <input
                                    type="date"
                                    name="date_filled"
                                    id="date_filled"
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    value= {partCDate}
                                    onChange={ev => setPartCDate(ev.target.value)}
                                    max={today}
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.before_repair_date ? formatDate(inspectionData?.before_repair_date) : null }
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Assigned Personnel */}
                        <div className="flex items-center mt-2">
                          <div className="w-64">
                            <label className="form-title">
                              Assigned Personnel:
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partCForm ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={inspectionData?.personnel_name}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              enablePartC && (GSO || SuperHacker || inspectionData?.personnel_id == currentUserId) ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={inspectionData?.personnel_name}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    disabled
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.before_repair_date ? inspectionData?.personnel_name : null }
                                </div>
                              )
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Findings */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title">
                          Findings:
                        </label> 
                      </div>
                      {formLoading ? (
                        <div className="skeleton-form w-full"></div>
                      ):(
                        partCForm ? (
                          <div className="w-full">
                            <input
                              id="findings"
                              name="findings"
                              style={{ resize: "none" }}
                              value= {findings}
                              onChange={ev => setFindings(ev.target.value)}
                              className="block w-full focus:ring-0 ppa-form-field"
                              maxLength={500}
                              placeholder="Input Findings"
                            />
                          </div>
                        ):(
                          enablePartC && (GSO || SuperHacker || inspectionData?.form?.personnel_id == currentUserId) ? (
                            <div className="w-full">
                              <input
                                id="findings"
                                name="findings"
                                value= {updatefindings}
                                onChange={ev => setUpdateFindings(ev.target.value)}
                                className="block w-full focus:ring-0 ppa-form-field"
                                maxLength={500}
                                placeholder="Input Findings"
                              />
                            </div>
                          ):(
                            <div className="w-full ppa-form-confirm h-[40px]">
                              {inspectionData?.findings ? inspectionData?.findings : null }
                            </div>
                          )
                        )
                      )}
                    </div>

                    {/* Recomendations */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title">
                          Recomendations:
                        </label> 
                      </div>
                      {formLoading ? (
                        <div className="skeleton-form w-full"></div>
                      ):(
                        partCForm ? (
                          <div className="w-full">
                            <input
                              id="recomendations"
                              name="recomendations"
                              value={recommendations}
                              maxLength={500}
                              onChange={ev => setRecommendations(ev.target.value)}
                              className="block w-full focus:ring-0 ppa-form-field"
                              placeholder="Input Recomendations"
                            />
                          </div>
                        ):(
                          enablePartC && (GSO || SuperHacker || inspectionData?.form?.personnel_id == currentUserId) ? (
                            <div className="w-full">
                              <input
                                id="recomendations"
                                name="recomendations"
                                value= {updaterecommendations}
                                onChange={ev => setUpdateRecommendations(ev.target.value)}
                                className="block w-full focus:ring-0 ppa-form-field"
                                maxLength={500}
                                placeholder="Input Recomendations"
                              />
                            </div>
                          ):(
                            <div className="w-full ppa-form-confirm h-[40px]">
                              {inspectionData?.recommendations ? inspectionData?.recommendations : null }
                            </div>
                          )
                        )
                      )}
                    </div>

                  </div>

                  {/* Part D */}
                  <div className="pb-6">
                    {/* Caption */}
                    <div className="flex justify-between items-center mt-4">
                      <h2 className="text-lg font-bold leading-7 text-gray-900"> Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job. </h2>
                      {/* Buttons */}
                      <div className="flex justify-start">
                        {partDForm ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button type="submit"
                              onClick={() => SubmitPartD()}
                              className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                              disabled={submitLoading}
                            >
                            {submitLoading ? (
                              <div className="flex justify-center">
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
                                }} className="w-full md:w-auto py-1.5 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):enablePartD ? (
                          !buttonHide && (
                          <>
                            {/* Submit */}
                            <button type="submit"
                              onClick={() => UpdatePartD()}
                              className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                              disabled={submitLoading}
                            >
                              {submitLoading ? (
                                <div className="flex justify-center">
                                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                                  <span className="ml-1">Loading</span>
                                </div>
                              ):(
                                'Update'
                              )}
                            </button>

                            {/* Cancel */}
                            {!submitLoading && (
                              <button onClick={() => { 
                                  setEnablePartD(false);
                                  setPartDDate(inspectionData?.after_reapir_date);
                                  setUpdateRemarks(inspectionData?.remarks);
                                }} className="w-full md:w-auto py-1.5 px-4 text-sm btn-cancel">
                                Cancel
                              </button>
                            )}
                          </>
                          )
                        ):(
                          !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && !formLoading && (
                          <>
                            {/* SuperHacker */}
                            {SuperHacker && (
                              (inspectionData?.form_status == 3 && inspectionData?.personnel_id == currentUserId) ? (
                                <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-edit-form self-center" title="Enable Form" icon={faPen} />
                              ):[1, 2, 3].includes(inspectionData?.form_status) ? (
                                <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-edit-form self-center" title="Edit Part D" icon={faPenToSquare} />
                              ):null
                            )}
                            {/* Authority */}
                            {AuthorityAccess && (
                              ![0, 1, 7].includes(inspectionData?.form_status) && (
                                  <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-edit-form" title="Edit Part D" icon={faPenToSquare} />
                              )
                            )}
                            {/* GSO */}
                            {GSO && (
                              inspectionData?.before_repair_date && (
                                <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-edit-form self-center" title="Edit Part D" icon={faPenToSquare} />
                              )
                            )}
                            {/* Assign Personnel */}
                            {inspectionData?.personnel_id == currentUserId && !SuperHacker && (
                              inspectionData?.form_status == 3 ? (
                                <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-form self-center" title="Enable Form" icon={faPen} />
                              ):inspectionData?.form_status == 2 ? (
                                <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-form self-center" title="Edit Part D" icon={faPenToSquare} />
                              ):null
                            )}
                          </>
                          )
                        )}
                      </div>
                    </div>

                    {/* ---- Part D Fields ---- */}
                    <div className="grid gap-6 grid-cols-2 mt-2">
                      {/* left side */}
                      <div className="col-span-1">
                        {/* Date Inspected */}
                        <div className="md:flex items-center mt-6">
                          <div className="w-64">
                            <label className="form-title">
                              Date:
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partDForm ? (
                              <div className="w-full">
                                <input
                                  type="date"
                                  name="date_filled"
                                  id="date_filled"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  value={partDDate}
                                  onChange={ev => setPartDDate(ev.target.value)}
                                  max={today}
                                />
                              </div>
                            ):(
                              enablePartD && (GSO || SuperHacker || inspectionData?.personnel_id == currentUserId) ? (
                                <div className="w-full">
                                  <input
                                    type="date"
                                    name="date_filled"
                                    id="date_filled"
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    value= {partDDate}
                                    onChange={ev => setPartDDate(ev.target.value)}
                                    max={today}
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.after_reapir_date ? formatDate(inspectionData?.after_reapir_date) : null }
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Assigned Personnel */}
                        <div className="flex items-center mt-2">
                          <div className="w-64">
                            <label className="form-title">
                              Assigned Personnel:
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            partDForm ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  value={inspectionData?.personnel_name}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              enablePartD && (GSO || SuperHacker || inspectionData?.form?.personnel_id == currentUserId) ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    value={inspectionData?.personnel_name}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                    disabled
                                  />
                                </div>
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {inspectionData?.after_reapir_date ? inspectionData?.personnel_name : null }
                                </div>
                              )
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title">
                          Remarks:
                        </label> 
                      </div>
                      {formLoading ? (
                        <div className="skeleton-form w-full"></div>
                      ):(
                        partDForm ? (
                          <div className="w-full">
                            <input
                              id="remarks"
                              name="remarks"
                              value= {remarks}
                              maxLength={500}
                              onChange={ev => setRemarks(ev.target.value)}
                              className="block w-full focus:ring-0 ppa-form-field"
                              placeholder="Input Remarks"
                            />
                          </div>
                        ):(
                          enablePartD && (GSO || SuperHacker || inspectionData?.personnel_id == currentUserId) ? (
                            <div className="w-full">
                              <input
                                id="remarks"
                                name="remarks"
                                value={updateremarks}
                                onChange={ev => setUpdateRemarks(ev.target.value)}
                                className="block w-full focus:ring-0 ppa-form-field"
                                maxLength={500}
                                placeholder="Input Remarks"
                              />
                            </div>
                          ):(
                            <div className="w-full ppa-form-confirm h-[40px]">
                              {inspectionData?.remarks ? inspectionData?.remarks : null }
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
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
            {/* Activities */}
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
                        <td colSpan={2} className="p-3 text-center ppa-table-body"> No Announcement </td>
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
          SubmitSupReason={SubmitSupReason}
          handlelSupervisorApproval={handlelSupervisorApproval}
          handlelAdminApproval={handlelAdminApproval}
          CloseForceRequest={CloseForceRequest}
          inspectionData={inspectionData?.id}
          justClose={justClose}
          closePopup={closePopup}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          form={SubmitPartB}
        />
      )}
    </PageComponent>
    )
  );
}