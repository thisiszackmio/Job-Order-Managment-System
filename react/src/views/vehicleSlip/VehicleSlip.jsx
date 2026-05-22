import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../components/PageComponent";
import Restrict from "../../components/Restrict";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../components/Popup";
import ppa_logo from '/default/img/ppa_logo.png';
import loading_table from "/default/ring-loading.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFilePdf, faCircleXmark, faArrowLeft, faArrowRight, faPlus, faMinus, faFileCircleXmark, faPrint, faDownload, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import moment from "moment-timezone";

export default function VehicleSlip(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

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
      fetchVehicle(id);
      fetchActivity();
    }
  }, [id]);

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
  
  const [pageRestrict, setPageRestrict] = useState(true);
  const [adminDisapproval, setAdminDisapproval] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Loading Function
  const [formLoading, setFormLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const [editDetail, setEditDetail] = useState(false);
  const [enableAssign, setEnableAssign] = useState(false);

  // --- Data --- //
  const [vehicleData, setVehicleData] = useState([]);
  const [paginatedVehicle, setPaginatedVehicle] = useState([]);

  const fetchVehicle = async () => {
    try {
      const response = await axiosClient.get(`/showvehrequest/${id}`);
      const dataVehicle = response.data;

      // console.log(dataVehicle);
      setVehicleData(dataVehicle.form);
      setPaginatedVehicle({
        prev: dataVehicle.prev,
        next: dataVehicle.next
      });

      if(dataVehicle.form?.user_id == currentUserId || accessOnly) {
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

  const [trackingForm, setTrackingForm] = useState({});

  // --- Track the Data --- //
  const fetchActivity = async () => {
    try {
      const response = await axiosClient.get(`/formtracking/${id}`,{
        params: { type: 'Vehicle' }
      });
      const dataActivity = response.data;

      setTrackingForm(dataActivity);

    }catch(error){
      console.error("Unexpected error:", error);
    } finally {
      setActivityLoading(false);
    }
  }

  const [vehicleDet, setVehicleDet] = useState([]);
  const [driver, setDriver] = useState([]);

  // On travel
  function checkAvailability(){
    axiosClient.put("/checktsavailability", {
      date: vehicleData?.date_arrival,
    })
    .then((response) => {
      const responseData = response.data;
      // console.log(responseData.vehicles);
      
      setDriver(responseData.drivers);
      setVehicleDet(responseData.vehicles);
    });
  }

  // Check if there is on travel schedule
  function checkTravelSchedule(){
    if(GSO || AuthorityAccess){
      axiosClient.put("/checktravelschedule")
      .then(res => {
        console.log("Travel Schedule:", res.data);
        // optional: set state here
        // setSchedule(res.data);
      })
      .catch(err => {
        console.error("Error:", err);
      });
    }
  }

  // --- Auto Close Form --- //
  const setFormClosed = () => {

    if(GSO || vehicleData?.user_id == currentUserId || SuperHacker){
      axiosClient
      .get(`/closevehicle/${id}`)
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
      fetchVehicle();
      fetchActivity();
      setFormClosed();
    }
    if(enableAssign || editDetail){
      checkAvailability();
      checkTravelSchedule();
    }
  }, [currentUserId, enableAssign, editDetail]);

  // --- Pagination --- //
  // Previous Page
  const handlePrev = () => {
    // alert(paginatedInspection?.prev)
    if (!paginatedVehicle?.prev) return; // stop if no previous
    setFormLoading(true);
    // setActivityLoading(true);
    navigate(`/joms/vehicle/form/${paginatedVehicle?.prev}`);
  };

  // Next Page
  const handleNext = () => {
    if (!paginatedVehicle?.next) return; // stop if no next
    setFormLoading(true);
    // setActivityLoading(true);
    navigate(`/joms/vehicle/form/${paginatedVehicle?.next}`);
  };

  const [adminReason, setAdminReason] = useState('');

  // Approval Popup Confirmation
  function handleAdminConfirmation(){
    setShowPopup(true);
    setPopupContent('adminApproval');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to approve this request?</p>
      </div>
    );
  }

  // Submit Approval
  function SubmitApproval(event){
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`/vehreqapprove/${id}`, {
      approver: currentUserId
    })
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Approve Confirm</p>
          <p className="popup-message">The request has been confirmed.</p>
        </div>
      );
    })
    .catch((error)=>{
      setButtonHide(true);
      setShowPopup(true); 
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Disapproval Confirmation
  const handleAdminDecline = () => {

    if(adminReason){
      setShowPopup(true);
      setPopupContent('adminDisapproval');
      setPopupMessage(
        <div>
          <p className="popup-title">Are you sure?</p>
          <p className="popup-message">Do you want to disapprove this request? This action cannot be undone.</p>
        </div>
      );
    }else{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Error!</p>
          <p className="popup-message">You have entered an empty field.</p>
        </div>
      );
    }
    
  }

  // Submit Disapproval
  function SubmitAdminReason(event){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      reason: adminReason,
      approver: currentUserId
    }

    axiosClient
      .put(`/admindecline/${id}`, data)
      .then(() => {
        setButtonHide(true);
        setAdminDisapproval(false);
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Submission Complete!</p>
            <p className="popup-message">The request has been disapproved</p>
          </div>
        );
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

  // Update
  const [updatePurpose, setUpdatePurpose] = useState('');
  const [updateVisited, setUpdateVisited] = useState('');
  const [updateArrivalDate, setUpdateArrivalDate] = useState('');
  const [updateArrivalTime, setUpdateArrivalTime] = useState('');
  const [updateVehicle, setUpdateVehicle] = useState('');
  const [updatePointDriver, setUpdatePointDriver] = useState({ did: '', dname: '' });
  const [updateNotes, setUpdateNotes] = useState('');

  // Default Values
  useEffect(() => {
    setUpdatePurpose(vehicleData?.purpose ?? "");
    setUpdateVisited(vehicleData?.place_visited ?? "");
    setUpdateArrivalDate(vehicleData?.date_arrival ?? "");
    setUpdateArrivalTime(
      vehicleData?.time_arrival 
        ? vehicleData.time_arrival.substring(0, 5)
        : ""
    );
    setUpdatePassengers(vehicleData?.passengers ?? "");
    setUpdateNotes(vehicleData?.notes ?? "");
  },[
    vehicleData?.purpose,
    vehicleData?.place_visited,
    vehicleData?.date_arrival,
    vehicleData?.time_arrival,
    vehicleData?.passengers,
    vehicleData?.notes
  ]);

  // --- For the Passenger --- //
  const normalizePassengers = (data) => {
    if (!data || data === "None") return [""];
    if (Array.isArray(data)) return data;
    return data.split("\n");
  };

  const [updatePassengers, setUpdatePassengers] = useState([]);

  const MAX_PASSENGERS = 16;

  useEffect(() => {
    if (vehicleData) {
      setUpdatePassengers(
        normalizePassengers(vehicleData.passengers)
      );
    }
  }, [vehicleData]);

  const formatName = (value) => {
    return value
      .replace(/\s+/g, ' ')
      .trimStart()
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
      )
      .join(' ');
  };

  const handleChange = (index, value) => {
    const updated = [...updatePassengers];
    updated[index] = formatName(value);
    setUpdatePassengers(updated);
  };

  const addPassenger = () => {
    if (updatePassengers.length >= MAX_PASSENGERS) return;
    setUpdatePassengers([...updatePassengers, ""]);
  };

  const removePassenger = (index) => {
    const updated = updatePassengers.filter((_, i) => i !== index);
    setUpdatePassengers(updated.length ? updated : [""]);
  };

  const getPassengerValue = () => {
    const cleaned = updatePassengers
      .map(p => p.trim())
      .filter(Boolean)
      .join("\n");

    return cleaned || "None";
  };
  // --- End of Passenger --- //

  // Edit Form
  function UpdateVehicleForm(){
    setSubmitLoading(true);

    const passengersToSave = getPassengerValue();

    const data = {
      authority: currentUserName.name,
      purpose: updatePurpose,
      passengers: passengersToSave,
      place_visited: updateVisited,
      date_arrival: updateArrivalDate,
      time_arrival: updateArrivalTime,
      vehicle_type: updateVehicle ? updateVehicle : vehicleData?.vehicle_type,
      driver_id: updatePointDriver.did ? updatePointDriver.did : vehicleData?.driver_id,
      driver: updatePointDriver.dname ? updatePointDriver.dname : vehicleData?.driver,
      notes: updateNotes
    }

    axiosClient
    .put(`/updatevehicleslip/${id}`, data)
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
      setEditDetail(true);
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setEditDetail(true);
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Sorry!</p>
            <p className="popup-message">This request form is no longer editable.</p>
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

  // Assign Vehicle and Driver
  function SubmitVehicleInfo(){
    setSubmitLoading(true);

    const VehName = updateVehicle?.split(/ \(([^)]+)\)/)?.[0];
    const VehPlate = updateVehicle?.split(/ \(([^)]+)\)/)?.[1];

    const vehData = {
      assign: currentUserId,
      vehicle_type : updateVehicle,
      driver_id : updatePointDriver.did, 
      driver : updatePointDriver.dname,
      vehicleName: VehName,
      vehiclePlate: VehPlate,
    }

    if(!updateVehicle && !updatePointDriver.did){
      setPopupContent("check-error");
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You left a field empty. Please enter a value.</p>
        </div>
      );
      setShowPopup(true);
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`/storevehinfo/${id}`, vehData)
      .then((response) => {
        const responseData = response.data.message;

        if(responseData === 'Already'){
          setPopupContent("check-error");
          setPopupMessage(
            <div>
              <p className="popup-title">Oops!</p>
              <p className="popup-message">This slip has already assign the vehicle and driver.</p>
            </div>
          );
          setShowPopup(true);
        }
        setButtonHide(true);
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Submission Complete!</p>
            <p className="popup-message">The driver and the vehicle have been assigned.</p>
          </div>
        );
      })
      .catch((error)=>{
        setButtonHide(true);
        setShowPopup(true); 
        setPopupContent('error');
        setPopupMessage(error.response.status);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
  }

  // Cancel Form Confirmation
  function handleCancelForm(){
    setShowPopup(true);
    setPopupContent('cancelForm');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to cancel this form? It cannot be restore.</p>
      </div>
    );
  }

  // Cancel Form Function
  function cancelForm(){
    setSubmitLoading(true);

    axiosClient
    .put(`/cancelrequest/${id}`,{
      authority: currentUserName.name
    })
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The request has been canceled.</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response.status === 409) {
        setPopupContent("error");
        setPopupMessage(
          <div>
            <p className="popup-title">Invalid!</p>
            <p className="popup-message">This form is already closed!</p>
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

  const justClose = () => {
    setShowPopup(false);
    fetchVehicle();
  }

  //Close Popup on Success
  const closePopup = () => {
    setShowPopup(false);
    setSubmitLoading(false);
    fetchVehicle();
    fetchActivity();
    setEditDetail(false);
    setButtonHide(false);
    setFormLoading(true);
    setEnableAssign(false);
    setActivityLoading(true);
  }

  //Generate PDF
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Pdf
  const loadPDF = async () => {
      try {
        setShowPDF(true);
        setLoadingPDF(true);
  
        const response = await axiosClient.get(
          `/vehicle/pdf/${id}`,
          { responseType: "blob" }
        );
  
        // 🔥 GET FILENAME FROM HEADER
        const disposition = response.headers["content-disposition"];
        let filename = "VehicleSlip.pdf";
  
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
    link.download = `Vehicle-Slip-No-${id}.pdf`;
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

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const PortManager = codes.includes("PM");
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const AuthorityAccess = codes.includes("AVU");
  const SuperHacker = codes.includes("HACK");
  const ITAdmin = codes.includes("AUS");
  const roles = ["HACK", "AUS", "AM", "AUV", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return (
    !pageRestrict ? (<Restrict />):(
      <PageComponent title="Vehicle Slip">
        {/* Wrapper */}
        <div className="grid grid-cols-10 gap-4 mt-8">
          {/* Form */}
          <div className="col-span-7">
            <div className="ppa-widget-col request-form px-4 pb-6">
              {/* Header */}
              <div className="joms-user-info-header text-left"> 
                Vehicle Slip Form
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
                    height="600px"
                    title="Vehicle Slip PDF"
                  />
                </>
                )
              ):(
              <>
                {/* Button Pagination */}
                {(GSO || Admin || SuperHacker || ITAdmin || AuthorityAccess) && (
                  (!paginatedVehicle?.prev || !paginatedVehicle?.next) ? null : (
                    <div className="text-sm flex mb-8 justify-between items-center w-full">
                      {!formLoading && (
                      <>
                        {/* Previous */}
                        <button
                          onClick={handlePrev}
                          disabled={!paginatedVehicle?.prev || formLoading}
                          className={`rounded ${
                            paginatedVehicle?.prev
                              ? "ppa-arrow"
                              : "ppa-arrow-disable cursor-not-allowed"
                          }`}
                          style={{
                            visibility: paginatedVehicle?.prev ? "visible" : "hidden"
                          }}
                        >
                          <span className="flex items-center group-hover:text-white transition-colors">
                            <FontAwesomeIcon
                              className="icon-form group-hover:text-white transition-colors"
                              title="Prev"
                              icon={faArrowLeft}
                            />
                            &nbsp; Page{" "}
                            {paginatedVehicle?.prev && paginatedVehicle?.prev}
                          </span>
                        </button>
    
                        {/* Next */}
                        <button
                          onClick={handleNext}
                          disabled={!paginatedVehicle?.next || formLoading}
                          className={`mr-4 rounded ${
                            paginatedVehicle?.next
                              ? "ppa-arrow"
                              : "ppa-arrow-disable cursor-not-allowed"
                          }`}
                          style={{
                            visibility: paginatedVehicle?.next ? "visible" : "hidden"
                          }}
                        >
                          <span className="flex items-center group-hover:text-white transition-colors">
                            Page{" "}
                            {paginatedVehicle?.next && paginatedVehicle?.next}
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
                  )
                )}

                {/* Form */}
                <div>
                  {/* Control Number and Form Buttons */}
                  <div className="flex justify-between items-center">
                    {/* Slip Number */}
                    <div className="flex items-center">
                      <div className="w-20 font-bold">
                        Slip No:
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
                      {editDetail ? (
                        !buttonHide && (
                        <>
                          {/* Submit */}
                          <button 
                            type="submit" 
                            onClick={() => UpdateVehicleForm()}
                            className={`py-1.5 px-4 text-sm ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
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

                          {/* Decline */}
                          {!submitLoading && (
                            <button 
                              type="button" 
                              onClick={() => setEditDetail(false)} 
                              className="py-1.5 px-4 btn-cancel text-sm"
                            >
                              Close
                          </button>
                          )}
                        </>
                        )
                      ):(
                        !formLoading && (
                        <>
                          {/* For the SuperHacker */}
                          {![0, 3].includes(vehicleData?.admin_approval) && SuperHacker && (
                          <>
                            <FontAwesomeIcon  onClick={(event) => {event.preventDefault(); setEditDetail(true); }} className="icon-edit-form" title="Edit Form" icon={faPenToSquare} />

                            {(![0, 1, 2, 3, 4, 5].includes(vehicleData?.admin_approval) && vehicleData?.user_id == currentUserId) && (
                              <FontAwesomeIcon onClick={() => handleCancelForm()} className="icon-edit-form" title="Cancel Form" icon={faCircleXmark} />
                            )}
                          </>
                          )}

                          {/* For Assigned Driver and Vehicle */}
                          {(GSO || AuthorityAccess) && (
                            enableAssign ? (
                              !buttonHide && (
                              <>
                                {/* Submit */}
                                <button 
                                  type="submit"
                                  onClick={() => SubmitVehicleInfo()}
                                  className={`py-1.5 px-4 text-sm ${submitLoading ? 'btn-process' : 'btn-secondary'}`}
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

                                {!submitLoading && (
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setEnableAssign(false);
                                      setUpdateVehicle('');
                                      setUpdatePointDriver({ did: '', dname: ''});
                                    }} 
                                    className="py-1.5 px-4 btn-cancel text-sm"
                                  >
                                    Close
                                  </button>
                                )}
                              </>
                              )
                            ):(
                              ![0, 1, 2, 3].includes(vehicleData?.admin_approval) && !vehicleData?.vehicle_type && !vehicleData?.driver_id && (
                                <FontAwesomeIcon onClick={() => setEnableAssign(true)} className="icon-edit-form" title="Assign Driver and Vehicle" icon={faPersonCirclePlus} />
                              )
                            )
                          )}

                          {/* For the GSO */}
                          {GSO && !enableAssign && (
                          <>
                            {/* Edit Form */}
                            {![0, 1, 3].includes(vehicleData?.admin_approval) && (
                            <>
                              <FontAwesomeIcon  onClick={(event) => {event.preventDefault(); setEditDetail(true); }} className="icon-edit-form" title="Edit Form" icon={faPenToSquare} />
                            </>
                            )}

                            {/* Cancel Form */}
                            {[6, 7, 8, 9].includes(vehicleData?.admin_approval) && (
                              <FontAwesomeIcon onClick={() => handleCancelForm()} className="icon-edit-form" title="Cancel Form" icon={faCircleXmark} />
                            )}
                          </>
                          )}

                          {/* For the Admin and Port Manager */}
                          {(Admin || PortManager) && (
                            adminDisapproval ? (
                            !buttonHide && (
                              <>
                                {/* Submit */}
                                <button onClick={handleAdminDecline} className="py-1.5 px-4 text-sm btn-secondary">
                                  Submit
                                </button>

                                {/* Cancel */}
                                {!submitLoading && (
                                  <button onClick={() => { setAdminDisapproval(false); setAdminReason(''); }} className="py-1.5 px-4 text-sm btn-cancel">
                                    Cancel
                                  </button>
                                )}
                              </>
                            )):(
                              ![0, 1, 2, 3].includes(vehicleData?.admin_approval) && (
                              <>
                                {/* Approve */}
                                <button onClick={handleAdminConfirmation} className="py-1.5 px-4 text-sm btn-secondary">
                                  Approve 
                                </button>

                                {/* Decline */}
                                <button onClick={() => setAdminDisapproval(true)} className="py-1.5 px-4 text-sm btn-cancel">
                                  Disapprove
                                </button>
                              </>
                              )
                            )
                          )}

                          {/* Generate PDF */}
                          {!isMobile && (
                          <>
                            {/* For all */}
                            {![0, 3].includes(vehicleData?.admin_approval) && (GSO || AuthorityAccess || SuperHacker || ITAdmin) && !enableAssign && (
                              <FontAwesomeIcon onClick={loadPDF} className="icon-edit-form" title="Get PDF" icon={faFilePdf} />
                            )}

                            {/* For the Admin and Port Manager */}
                            {![0, 3, 4, 5, 8].includes(vehicleData?.admin_approval) && (Admin || PortManager) && (
                              <FontAwesomeIcon onClick={loadPDF} className="icon-edit-form" title="Get PDF" icon={faFilePdf} />
                            )}
                          </>
                          )}
                        </>
                        )
                      )}
                    </div>
                  </div>

                  {adminDisapproval ? (
                  <>
                    <form id="vr_reason" onSubmit={SubmitAdminReason}>
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
                            value={adminReason}
                            onChange={ev => setAdminReason(ev.target.value)}
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
                    <div className="status-sec mt-4">
                      <div className="flex items-center">
                        <div className="w-16 font-bold">
                          Status:
                        </div>

                        <div className="w-full">
                          {formLoading ? (
                            <div className="skeleton h-6 w-full block"></div>
                          ):(
                            !editDetail ? (
                              (Admin || PortManager) && [4, 5].includes(vehicleData?.admin_approval) ? (
                                "Waiting for your approval"
                              ):(
                                <>
                                  {vehicleData?.remarks}
                                </>
                              )
                            ):(
                              "Edit Form Activate"
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main */}
                    <div className="w-full grid grid-cols-2 mt-2 gap-6">
                      {/* 1st Column */}
                      <div className="col-span-1">

                        {/* Date   */}
                        <div className="flex items-center mt-4">
                          <div className="w-64 flex form-title">
                            <label> 
                              Date
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="date_vehicle"
                                  id="date_vehicle"    
                                  value={formatDate(vehicleData?.created_at)}
                                  onChange={ev => setUpdatePurpose(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {formatDate(vehicleData?.created_at)}
                              </div>
                            )
                          )}
                        </div>

                        {/* Purpose */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Purpose
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="update_purpose"
                                  id="update_purpose"    
                                  value={updatePurpose}
                                  onChange={ev => setUpdatePurpose(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {vehicleData?.purpose}
                              </div>
                            )
                          )}
                        </div>

                        {/* Place/s to be Visited */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Place/s to be Visited
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="update_visited"
                                  id="update_visited"    
                                  value={updateVisited}
                                  onChange={ev => setUpdateVisited(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {vehicleData?.place_visited}
                              </div>
                            )
                          )}
                        </div>

                        {/* Date of Arrival */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Date of Arrival
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="date"
                                  name="update_date"
                                  id="update_date"    
                                  value={updateArrivalDate}
                                  onChange={ev => setUpdateArrivalDate(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {formatDate(vehicleData?.date_arrival)}
                              </div>
                            )
                          )}
                        </div>

                        {/* Time of Arrival */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Time of Arrival
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="time"
                                  name="update_time"
                                  id="update_time"    
                                  value={updateArrivalTime}
                                  onChange={ev => setUpdateArrivalTime(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm">
                                {formatTime(vehicleData?.time_arrival)}
                              </div>
                            )
                          )}
                        </div>

                        {/* Vehicle */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Vehicle
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enableAssign ? (
                              <div className="w-full">
                                <select 
                                  name="update_vehicle" 
                                  id="update_vehicle" 
                                  value={updateVehicle}
                                  onChange={ev => { setUpdateVehicle(ev.target.value); }}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                >
                                  <option value="" disabled>Vehicle Select</option>
                                  {vehicleDet?.map((vehDet) => (
                                    <option
                                      key={vehDet.id} 
                                      value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                                      className={`${vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel" ? "disable-form":''}`}
                                      disabled={vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel"}
                                    >
                                      {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.status == "Reserve" ? "- Reserve" : vehDet.status == "Not Available" ? "- Not Available" : vehDet.status == "On Travel" ? "- On Travel" : "" }
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ):(
                              editDetail ? (
                                (GSO || AuthorityAccess) ? (
                                  (vehicleData?.vehicle_type && ![0, 1, 2, 3].includes(vehicleData?.admin_approval)) ? (
                                    <div className="w-full">
                                      <select 
                                        name="update_vehicle" 
                                        id="update_vehicle" 
                                        value={updateVehicle}
                                        onChange={ev => { setUpdateVehicle(ev.target.value); }}
                                        className="block w-full focus:ring-0 ppa-form-field"
                                      >
                                        <option value="" disabled>Vehicle Select</option>
                                        {vehicleDet?.map((vehDet) => (
                                          <option
                                            key={vehDet.id} 
                                            value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                                            className={`${vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel" ? "disable-form":''}`}
                                            disabled={vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel"}
                                          >
                                            {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.status == "Reserve" ? "- Reserve" : vehDet.status == "Not Available" ? "- Not Available" : vehDet.status == "On Travel" ? "- On Travel" : "" }
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ):(
                                    <div className="w-full">
                                      <input
                                        type="text"   
                                        value="Editing disabled"
                                        className="block w-full focus:ring-0 ppa-form-confirm"
                                        disabled
                                      />
                                    </div>
                                  )
                                ):(
                                  [2, 1].includes(vehicleData?.admin_approval) && SuperHacker ? (
                                    <div className="w-full">
                                      <select 
                                        name="update_vehicle" 
                                        id="update_vehicle" 
                                        value={updateVehicle}
                                        onChange={ev => { setUpdateVehicle(ev.target.value); }}
                                        className="block w-full focus:ring-0 ppa-form-field"
                                      >
                                        <option value="" disabled>Vehicle Select</option>
                                        {vehicleDet?.map((vehDet) => (
                                          <option
                                            key={vehDet.id} 
                                            value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`} 
                                            className={`${vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel" ? "disable-form":''}`}
                                            disabled={vehDet.status == "Reserve" || vehDet.status == "Not Available" || vehDet.status == "On Travel"}
                                          >
                                            {vehDet.vehicle_name} ({vehDet.vehicle_plate}) {vehDet.status == "Reserve" ? "- Reserve" : vehDet.status == "Not Available" ? "- Not Available" : vehDet.status == "On Travel" ? "- On Travel" : "" }
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ):(
                                    <div className="w-full">
                                      <input
                                        type="text"   
                                        value="Editing disabled"
                                        className="block w-full focus:ring-0 ppa-form-confirm"
                                        disabled
                                      />
                                    </div>
                                  )
                                )
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {vehicleData?.vehicle_type}
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Driver */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Driver
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            enableAssign ? (
                              <div className="w-full">
                                <select 
                                  name="update_driver" 
                                  id="update_driver" 
                                  value={updatePointDriver.did}
                                  onChange={ev => {
                                    const personnelId = Number(ev.target.value);

                                    const selectedPersonnel = driver.find(
                                      staff => staff.id === personnelId
                                    );

                                    setUpdatePointDriver(
                                      selectedPersonnel 
                                        ? { did: selectedPersonnel.id, dname: selectedPersonnel.name } 
                                        : { did: '', dname: '' }
                                    );
                                  }}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                >
                                  <option value="" disabled>Driver Select</option>
                                  {driver?.map((driverDet) => (
                                    <option
                                      key={driverDet.id} 
                                      value={driverDet.id}
                                      className={`${driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel" ? "disable-form":''}`}
                                      disabled={driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel"}
                                    >
                                      {driverDet.name} {driverDet.status == "Reserve" ? "- Reserve" : driverDet.status == "Not Available" ? "- Not Available" : driverDet.status == "On Travel" ? "- On Travel" : "" }
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ):(
                              editDetail ? (
                                (GSO || AuthorityAccess) ? (
                                  (vehicleData?.driver && ![0, 1, 2, 3].includes(vehicleData?.admin_approval)) ? (
                                  <div className="w-full">
                                    <select 
                                    name="update_driver" 
                                    id="update_driver" 
                                    value={updatePointDriver.did}
                                    onChange={ev => {
                                      const personnelId = Number(ev.target.value);

                                      const selectedPersonnel = driver.find(
                                        staff => staff.id === personnelId
                                      );

                                      setUpdatePointDriver(
                                        selectedPersonnel 
                                          ? { did: selectedPersonnel.id, dname: selectedPersonnel.name } 
                                          : { did: '', dname: '' }
                                      );
                                    }}
                                    className="block w-full focus:ring-0 ppa-form-field"
                                  >
                                    <option value="" disabled>Driver Select</option>
                                    {driver?.map((driverDet) => (
                                      <option
                                        key={driverDet.id} 
                                        value={driverDet.id}
                                        className={`${driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel" ? "disable-form":''}`}
                                        disabled={driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel"}
                                      >
                                        {driverDet.name} {driverDet.status == "Reserve" ? "- Reserve" : driverDet.status == "Not Available" ? "- Not Available" : driverDet.status == "On Travel" ? "- On Travel" : "" }
                                      </option>
                                    ))}
                                  </select>
                                  </div>
                                  ):(
                                    <div className="w-full">
                                      <input
                                        type="text"   
                                        value="Editing disabled"
                                        className="block w-full focus:ring-0 ppa-form-confirm"
                                        disabled
                                      />
                                    </div>
                                  )
                                ):(
                                  [2, 1].includes(vehicleData?.admin_approval) && SuperHacker ? (
                                    <div className="w-full">
                                      <select 
                                        name="update_driver" 
                                        id="update_driver" 
                                        value={updatePointDriver.did}
                                        onChange={ev => {
                                          const personnelId = Number(ev.target.value);

                                          const selectedPersonnel = driver.find(
                                            staff => staff.id === personnelId
                                          );

                                          setUpdatePointDriver(
                                            selectedPersonnel 
                                              ? { did: selectedPersonnel.id, dname: selectedPersonnel.name } 
                                              : { did: '', dname: '' }
                                          );
                                        }}
                                        className="block w-full focus:ring-0 ppa-form-field"
                                      >
                                        <option value="" disabled>Driver Select</option>
                                        {driver?.map((driverDet) => (
                                          <option
                                            key={driverDet.id} 
                                            value={driverDet.id}
                                            className={`${driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel" ? "disable-form":''}`}
                                            disabled={driverDet.status == "Reserve" || driverDet.status == "Not Available" || driverDet.status == "On Travel"}
                                          >
                                            {driverDet.name} {driverDet.status == "Reserve" ? "- Reserve" : driverDet.status == "Not Available" ? "- Not Available" : driverDet.status == "On Travel" ? "- On Travel" : "" }
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ):(
                                    <div className="w-full">
                                      <input
                                        type="text"   
                                        value="Editing disabled"
                                        className="block w-full focus:ring-0 ppa-form-confirm"
                                        disabled
                                      />
                                    </div>
                                  )
                                )
                              ):(
                                <div className="w-full ppa-form-confirm h-[40px]">
                                  {vehicleData?.driver}
                                </div>
                              )
                            )
                          )}
                        </div>

                        {/* Requested By */}
                        <div className="flex items-center mt-2">
                          <div className="w-64 flex form-title">
                            <label> 
                              Requested By
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="date_vehicle"
                                  id="date_vehicle"    
                                  value={vehicleData?.user_name}
                                  onChange={ev => setUpdatePurpose(ev.target.value)}
                                  className="block w-full focus:ring-0 ppa-form-field"
                                  disabled
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm h-[40px]">
                                <strong>{vehicleData?.user_name}</strong>
                              </div>
                            )
                          )}
                        </div>

                      </div>

                      {/* 2nd Column */}
                      <div className="col-span-1">
                        {/* Passenger */}
                        <div className="mt-4">
                          <div className="w-1/4 flex form-title-separate">
                            <label> 
                              Passengers
                            </label> 
                          </div>
                          {formLoading ? (
                          <>
                            <div className="mt-2 skeleton-form w-full"></div>
                            <div className="mt-2 skeleton-form w-full"></div>
                            <div className="mt-2 skeleton-form w-full"></div>
                          </>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                {updatePassengers.map((passenger, index) => (
                                  <div key={index} className="flex gap-2 mt-2">

                                    <input
                                      type="text"
                                      value={passenger}
                                      placeholder={`Passenger ${index + 1}`}
                                      maxLength={100}
                                      onChange={(e) =>
                                        handleChange(index, e.target.value)
                                      }
                                      className="block w-full focus:ring-0 ppa-form-field-separate"
                                    />

                                    {index === updatePassengers.length - 1 &&
                                      updatePassengers.length < MAX_PASSENGERS && (
                                        <button
                                          type="button"
                                          onClick={addPassenger}
                                          className="px-3 py-2 ppa-add-form"
                                        >
                                          <FontAwesomeIcon
                                            title="Add"
                                            icon={faPlus}
                                          />
                                        </button>
                                      )}

                                    {updatePassengers.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removePassenger(index)}
                                        className="px-3 py-2 ppa-minus-form"
                                      >
                                        <FontAwesomeIcon
                                          title="Remove"
                                          icon={faMinus}
                                        />
                                      </button>
                                    )}

                                  </div>
                                ))}
                              </div>
                            ):(
                            <div className="w-full">
                              {vehicleData?.passengers === "None" ? (
                                <div className="mt-2 ppa-list-form">
                                  No Passenger
                                </div>
                              ):(
                                vehicleData?.passengers?.split("\n").map((name, index) => (
                                  <div key={index} className="mt-2 flex ppa-list-form">
                                    <span className="numbering">{index + 1}.</span>
                                    <div className="naming">{name}</div>
                                  </div>
                                ))
                              )}
                            </div>
                            )
                          )}
                        </div>

                        {/* Note */}
                        {vehicleData?.type_of_slip === 'outside' && (
                        <div className="flex items-stretch mt-2">
                          <div className="w-52 flex form-title">
                            <label> 
                              Note
                            </label> 
                          </div>
                          {formLoading ? (
                            <div className="skeleton-form w-full"></div>
                          ):(
                            editDetail ? (
                              <div className="w-full">
                                <input
                                  type="text"
                                  id="vr_notes"
                                  name="vr_notes"
                                  value={updateNotes}
                                  onChange={(ev) => {
                                    const input = ev.target.value;
                                    const formatted =
                                    input.charAt(0).toUpperCase() + input.slice(1);
                                      setUpdateNotes(formatted);
                                  }}
                                  placeholder="Enter Location"
                                  className="block w-full focus:ring-0 ppa-form-field"
                                />
                              </div>
                            ):(
                              <div className="w-full ppa-form-confirm flex items-center">
                                {vehicleData?.notes}
                              </div>
                            )
                          )}
                        </div>
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
            submitLoading={submitLoading}
            submitAnimation={submitAnimation}
            justClose={justClose}
            closePopup={closePopup}
            vehicle={vehicleData?.id}
            CancelForm={cancelForm}
            SubmitApproval={SubmitApproval}
            SubmitAdminReason={SubmitAdminReason}
          />
        )}
      </PageComponent>
    ) 
  );
}