import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import loadingAnimation from '/ppa_logo_animationn_v4.gif';
import submitAnimation from '../../../assets/loading_nobg.gif';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";

export default function FacilityForm(){

  // Get the ID
  const {id} = useParams();

  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

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

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [facData, setFacData] = useState([]);
  const [enableAdminDecline, setEnableAdminDecline] = useState(false)

  // Variable
  const [oprInstruct, setOprInstruct] = useState('');
  const [oprAction, setOprAction] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [oprInstructError, setOprInstructError] = useState(false);
  const [oprActionError, setOprActionError] = useState(false);

  // Set Access
  const [Access, setAccess] = useState(false);

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
      const ucode = userCode;
      const codes = ucode.split(',').map(code => code.trim());
      const Admin = codes.includes("AM");
      const GSO = codes.includes("GSO");
      const SuperAdmin = codes.includes("HACK");
      const myAccess = form?.user_id == currentUserId?.id;

      // Create A condition for access
      setAccess(myAccess || GSO || Admin || SuperAdmin);

    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => { 
    if(currentUserId?.id){
      fecthFacilityVenue();
    }
    
  }, [id, currentUserId]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit OPR Instruct
  const oprInstructSubmit = (ev, id) => {
    ev.preventDefault();

    setSubmitLoading(true);

    if(!oprInstruct){
      setOprInstructError(true);
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/oprinstruct/${id}`,{
        oprInstruct:oprInstruct
      })
      .then(() => {
        setPopupContent("success");
        setPopupMessage(
          <div>
            <p className="popup-title">Success!</p>
            <p className="popup-message">The OPR instruction has been stored in the database.</p>
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
  
  };

  // Submit OPR Action
  const oprActionSubmit = (ev, id) => {
    ev.preventDefault();

    setSubmitLoading(true);

    if(!oprAction){
      setOprActionError(true);
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/opraction/${id}`,{
        oprAction:oprAction
      })
      .then(() => {
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
  }

  // Approve Popup
  function handleApprovalConfirmation(){
    setShowPopup(true);
    setPopupContent('warning');
    setPopupMessage(
      <div>
        <p className="popup-title">Confirmation</p>
        <p className="popup-message">Do you want to approve {facData?.form?.user_name}'s request? It cannot be undone.</p>
      </div>
    );
  }

  // Approval function
  function handlelAdminApproval(id){
    setSubmitLoading(true);

    const data = {
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
    }

    axiosClient
    .put(`/adminfacapproval/${id}`, data)
    .then(() => {
      setPopupContent("success");
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The form has been approved.</p>
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

  // Decline Popup
  const handleAdminDeclineConfirmation = () => {
    setShowPopup(true);
    setPopupContent('admin_decline');
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

    const logs = `${currentUserId.name} has disapproved the request on the Facility / Venue Request Form (Control No. ${facData?.form?.id}).`;
    const notification = `Your request has been disapproved by ${currentUserId.name}. Please click to see the reason`;

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
        remarks: declineReason,
        logs:logs,
        // Notification
        sender_avatar: dpname,
        sender_id: currentUserId.id,
        sender_name: currentUserId.name,
        notif_message: notification
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

  //Close Popup on Error
  function justclose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
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

  // Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");

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
    // Check Form Id
    id == facData?.form?.id ? (
      // Restrictions
      Access ? (
      <PageComponent title="Facility / Venue Request Form">

        {/* Form Content */}
        <div className="font-roboto ppa-form-box bg-white">
          {/* <div className="ppa-form-header h-11"></div> */}
          <div className="ppa-form-header text-base flex justify-between items-center">
            <span>Control No: <span className="px-2 ppa-form-view">{facData?.form?.id}</span></span>

            {facData?.form?.admin_approval === 3 ? (
              GSO && (
                "BTN"
                // <button onClick={() => handleRemovalConfirmation()} className="py-1.5 px-3 text-base btn-cancel"> Close Form </button>
              )
            ):null}
          </div>

          <div className="p-2">

            {/* Part A */}
            <div>

              {/* Date */}
              <div className="flex items-center mt-6">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900">
                  Date:
                  </label> 
                </div>
                <div className="w-1/2 ppa-form-view h-6">
                  {formatDate(facData?.form?.created_at)}
                </div>
              </div>

              {/* Request Office */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.request_office}
                </div>
              </div>

              {/* Title of Activity */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Title of Activity: </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.title_of_activity}
                </div>
              </div>

              {/* Date of Activity */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Date of Activity: </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.date_start === facData?.form?.date_end ? (
                    formatDate(facData?.form?.date_start)
                  ):(
                    `${formatDate(facData?.form?.date_start)} to ${formatDate(facData?.form?.date_end)}`
                  )}
                </div>
              </div>

              {/* Time of Activity */}
              <div className="flex items-center mt-2">
                <div className="w-72">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Time of Activity (START and END): </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.date_start === facData?.form?.date_end ? (
                    `${formatTime(facData?.form?.time_start)} to ${formatTime(facData?.form?.time_end)}`
                  ):(
                    `${formatDate(facData?.form?.date_start)} (${formatTime(facData?.form?.time_start)}) to ${formatDate(facData?.form?.date_end)} (${formatTime(facData?.form?.time_end)})`
                  )}
                </div>
              </div>

              {/* Facility Request */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Facility Request: </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.mph ? ("Multi-Purpose Hall (MPH)"):null}
                  {facData?.form?.conference ? ("Conference Room"):null}
                  {facData?.form?.dorm ? ("Dormitory"):null}
                  {facData?.form?.other ? ("Other"):null}
                </div>
              </div>

              {/* Requestor */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Requestor: </label> 
                </div>
                <div className="w-1/2 ppa-form-view"> 
                  {facData?.form?.user_name}
                </div>
              </div>

            </div>

            {/* For Facilities */}
            {facData?.form?.mph || facData?.form?.conference || facData?.form?.other ? (
              <div className="mt-8 border-t border-gray">

                {/* Caption */}
                <div>
                  <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Multi-Purpose Hall / Conference Room / Others </h2>
                </div>

                <div className="grid grid-cols-2">

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
                        {facData?.form?.projector ? 'X':null}
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

              </div>
            ):null}

            {/* For Dormitory */}
            {facData?.form?.dorm ? (
              <div className="mt-8 border-t border-gray">

                {/* Caption */}
                <div>
                  <h2 className="pt-4 text-base font-bold leading-7 text-gray-900"> * For the Dormitory </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* For Male */}
                  <div className="col-span-1">

                    {/* Male Guest */}
                    <div className="mt-6">
                      <div className="flex items-center">
                        <div className="font-bold">
                          Number of Male Guest:
                        </div>
                        <div className="w-10 ppa-form-list text-center font-bold ml-4">
                          <span>
                            {facData?.maleGuest ? facData?.maleCount?.length : null}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Male Guest List */}
                    <div className="w-3/4 p-2">
                      {facData?.maleCount?.map((maleName, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span className="font-bold">{`${index + 1}.`}</span>
                          <div className="w-full ppa-form-list ml-3">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
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
                        <div className="w-10 ppa-form-list text-center font-bold ml-4">
                          <span>
                            {facData?.femaleGuest ? facData?.femaleCount?.length : null}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Male Guest List */}
                    <div className="w-3/4 p-2">
                      {facData?.femaleCount?.map((femaleName, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span className="font-bold">{`${index + 1}.`}</span>
                          <div className="w-full ppa-form-list ml-3">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            ):null}

            {/* OPR */}
            <div className="grid grid-cols-2 mt-8 border-t border-gray">

              <div className="col-span-1 border-r border-gray">

                {/* OPR Instruction */}
                <div className="mt-6 items-center mr-2">
                  <div className="w-80">
                    <label className="block text-base font-bold leading-6 text-gray-900">
                    Instruction for the OPR for Action:
                    </label> 
                  </div>
                  {(!facData?.form?.obr_instruct && facData?.form?.admin_approval == 1) && Admin ? (
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
                        placeholder="Input here"
                      />
                      {!oprInstructError ? (
                        <p className="form-validation">If you don't have any OPR instructions, just type 'none'.</p>
                      ):(
                        <p className="form-validation">This field is required. Type 'none' if there are no instructions.</p>
                      )}
                    </form>
                  ):(
                    <div className="w-full ppa-form-request mt-2 ppa-form-remarks p-2" style={{ minHeight: '60px' }}>
                      {facData?.form?.obr_instruct}
                    </div>
                  )}
                </div>

              </div>
            
              <div className="col-span-1 ml-3">

                {/* OPR Action */}
                <div className="mt-6 items-center">
                  <div className="w-80">
                    <label className="block text-base font-bold leading-6 text-gray-900">
                    OPR Action:
                    </label> 
                  </div>
                  {GSO && (!facData?.form?.obr_comment && facData?.form?.admin_approval == 1) ? (
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
                      placeholder="Input here"
                    />
                    {!oprActionError ? (
                      <p className="form-validation">If you don't have any OPR comment, just type 'none'.</p>
                    ):(
                      <p className="form-validation">This field is required. Type 'none' if there are no instructions.</p>
                    )}
                  </form>
                  ):(
                    <div className="w-full ppa-form-request mt-2 ppa-form-remarks p-2" style={{ minHeight: '60px' }}>
                      {facData?.form?.obr_comment}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Form Remarks and Buttons */}
        <div className="font-roboto ppa-form-box mt-4 bg-white">

          <div className="mt-2 pb-6 p-2">

            {/* Caption */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Form Remarks </h2>
            </div>

            {/* Remarks */}
            {enableAdminDecline ? (
              <div className="mt-3">
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
              </div>
            ):(
              <div className="w-full ppa-form-remarks mt-2">
                {facData?.form?.remarks}
              </div>
            )}
            

            {/* Button */}
            {/* For Admin and OPR Instructions */}
            {facData?.form?.admin_approval === 3 && Admin && (
            <>
              {Admin && !facData?.form?.obr_instruct ? (
                <div className="mt-4">
                  <button 
                    type="submit"
                    form="oprinstruct"
                    className={`py-2 px-3 ${submitLoading ? 'btn-submitLoading' : 'btn-default'}`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Loading</span>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              ):(
                <div className="mt-4">
                  {/* For Decline */}
                  {enableAdminDecline ? (
                  <>
                    {/* Confirmation */}
                    <button onClick={() => handleAdminDeclineConfirmation()} className="py-2 px-4 btn-default">
                      Submit
                    </button>
                    {/* Cancel */}
                    <button onClick={() => { setEnableAdminDecline(false); setDeclineReason(''); }} className="ml-2 py-2 px-4 btn-cancel">
                      Cancel
                    </button>
                  </>
                  ):(
                  <>
                    {/* Approve */}
                      <button onClick={() => handleApprovalConfirmation()} 
                      className="py-2 px-4 btn-default"
                    >
                      Approve
                    </button>

                    {/* Decline */}
                    <button onClick={() => setEnableAdminDecline(true)} 
                      className="ml-2 py-2 px-4 btn-cancel"
                    >
                      Decline
                    </button>
                  </>
                  )}
                </div>
              )}
            </>
            )}

            {/* For GSO  */}
            {facData?.form?.admin_approval === 1 && GSO && !facData?.form?.obr_comment && (
              <div className="mt-4">
              <button 
                type="submit"
                form="opraction"
                className={`py-2 px-3 ${submitLoading ? 'btn-submitLoading' : 'btn-default'}`}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Loading</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
            )}

            {/* Generate PDF */}
            {GSO && facData?.form?.admin_approval === 1 && facData?.form?.obr_comment && (
              <div className="mt-4">
                <button type="button" onClick={handleButtonClick}
                  className={`px-4 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                      <span className="ml-2">Generating</span>
                    </div>
                  ) : (
                    'Get PDF'
                  )}
                </button>
              </div>
            )}

          </div>

        </div>

        {/* PDF Area */}
        {isVisible && (
        <div>
          <div className="hidden md:none">
            <div ref={componentRef}>
              <div style={{ width: '210mm', height: '297mm', paddingLeft: '25px', paddingRight: '25px', paddingTop: '10px', border: '0px solid' }}>

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
                      <img src="/ppa_logo.png" alt="My Image" className="mx-auto" style={{ width: 'auto', height: '65px' }} />
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
                                <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2"></div>
                              </div>
                            ))}
                          </div>
                          ):(
                            facData?.maleCount?.map((maleName, index) => (
                              <div key={index} className="flex mt-1">
                                <span className="font-bold text-sm">{`${index + 1}.`}</span>
                                <div className="w-full text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${maleName.replace(/^\d+\.\s*/, '')}`}</div>
                              </div>
                            ))
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
                          {!facData?.femaleGuest ? (
                            <div>
                            {[...Array(6)].map((_, index) => (
                              <div key={index} className="flex mt-1">
                                <span className="font-normal text-sm">{`${index + 1}.`}</span>
                                <div className="w-3/4 text-sm border-b border-black pl-1 text-left ml-1 pl-2"></div>
                              </div>
                            ))}
                          </div>
                          ):(
                            facData?.femaleCount?.map((femaleName, index) => (
                              <div key={index} className="flex mt-1">
                                <span className="font-bold text-sm">{`${index + 1}.`}</span>
                                <div className="w-3/4 text-sm border-b border-black pl-1 text-left ml-1 pl-2">{`${femaleName.replace(/^\d+\.\s*/, '')}`}</div>
                              </div>
                            ))
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
                      {facData?.form?.admin_approval === 1 ? 'Approved by:' 
                        : facData?.form?.admin_approval === 2 ? 'Disapproved by:'
                        : 'Approved / Disapproved by:' }
                      </div>
                      <div className="relative">
                        <img
                          src={facData?.AdminEsig}
                          className="ppa-esignature-form-fac"
                          alt="Signature"
                        />
                      </div>
                      <div className="text-center font-bold text-base relative mt-5">
                        {facData?.AdminName}
                      </div>
                    </td>

                  </tr>
                  <tr>
                    <td className="border border-black w-1/2 text-center text-sm">{facData?.ReqPosition}</td>
                    <td className="border border-black w-1/2 text-center text-sm">Admin. Division Manager</td>
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

              </div>
            </div>
          </div>
        </div>
        )}

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent black overlay with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            {/* Popup content */}
            <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
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
                {/* Success */}
                {popupContent == 'success' && (
                  <div class="f-modal-icon f-modal-success animate">
                    <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                    <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                  </div>
                )}
                {/* Warning */}
                {(popupContent == "warning" || popupContent == "admin_decline") && (
                  <div class="f-modal-icon f-modal-warning scaleWarning">
                    <span class="f-modal-body pulseWarningIns"></span>
                    <span class="f-modal-dot pulseWarningIns"></span>
                  </div>
                )}
              </div>
              {/* Popup Message */}
              <p className="text-lg text-center"> {popupMessage} </p>
              {/* Buttons */}
              <div className="flex justify-center mt-4">
                {/* Admin Approval Button */}
                {(popupContent == 'warning') && (
                <>
                  {/* Submit */}
                  <button 
                    type="submit"
                    onClick={() => handlelAdminApproval(facData?.form?.id)}
                    className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading w-full' : 'btn-default w-1/2' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Loading</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>

                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={justclose} className="w-1/2 py-2 btn-cancel ml-2">
                      Close
                    </button>
                  )}
                </>
                )}

                {(popupContent == "admin_decline") && (
                <>
                  {/* Submit */}
                  <button 
                    type="submit"
                    form="adminDecline"
                    className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading w-full' : 'btn-default w-1/2' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Loading</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>

                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={justclose} className="w-1/2 py-2 btn-cancel ml-2">
                      Close
                    </button>
                  )}
                </>
                )}
                {/* Error Button */}
                {popupContent == 'error' && (
                  <button onClick={justclose} className="w-full py-2 btn-cancel">
                    Close
                  </button>
                )}
                {/* Success */}
                {popupContent == 'success' && (
                  <button onClick={closePopup} className="w-full py-2 btn-default">
                    Close
                  </button>
                )}
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