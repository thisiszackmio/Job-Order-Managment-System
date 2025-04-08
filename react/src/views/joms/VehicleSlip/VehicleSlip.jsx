import React, { useEffect, useRef, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import Restrict from "../../../components/Restrict";
import { useParams } from "react-router-dom";
import { useUserStateContext } from "../../../context/ContextProvider";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../../axios";
import { useReactToPrint } from "react-to-print";
import Popup from "../../../components/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faFilePdf, faLock } from '@fortawesome/free-solid-svg-icons';

export default function VehicleSlip(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  // Get the ID
  const {id} = useParams();

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const PortManager = codes.includes("PM");
  const roles = ["AM", "GSO", "HACK", "DM", "PM", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

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

  const [loading, setLoading] = useState(true);
  const [buttonHide, setButtonHide] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Variable
  const [vehicalName, setVehicleName] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [pointDriver, setPointDriver] = useState({ did: '', dname: '' });

  // Set Access
  const [Access, setAccess] = useState('');
  const [dataAccess, setDataAccess] = useState(null);

  // Function
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleDet, setVehicleDet] = useState([]);
  const [driverName, setDriverName] = useState([]);
  const [passenger, setPassenger] = useState([]);
  const [requestor, setRequestor] = useState([]);
  const [admin, setAdmin] = useState([]);

  const [editDetail, setEditDetail] = useState(true);
  const [adminApproval, setAdminApproval] = useState(false);

  // Update
  const [updatePurpose, setUpdatePurpose] = useState('');
  const [updateVisited, setUpdateVisited] = useState('');
  const [updateArrivalDate, setUpdateArrivalDate] = useState('');
  const [updateArrivalTime, setUpdateArrivalTime] = useState('');
  const [updateVehicle, setUpdateVehicle] = useState('');
  const [updatePassengers, setUpdatePassengers] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);

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

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

  // Get the Data
  const fetchData = () => {
    axiosClient
    .get(`/showvehrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const FormData = responseData.form;
      const passengerData = FormData?.passengers?.split('\n');
      const requestorPosData = responseData.requestorPosition;
      const requestorEsig = responseData.requestorEsig;
      const adminName = responseData.adminName;
      const adminEsig = responseData.adminEsig;
      const pmName = responseData.pmName;
      const pmEsig = responseData.pmEsig;
      const driverEsig = responseData.driverEsig;

      setVehicleData(FormData);
      setPassenger(passengerData);
      setRequestor({requestorPosData, requestorEsig, driverEsig});
      setAdmin({adminName, adminEsig, pmName, pmEsig});

      // Restrictions Condition
      const myAccess = FormData?.user_id == currentUserId || accessOnly ? "Access" : "Denied";
      setDataAccess(null);
      //console.log(myAccess)

      setAccess(myAccess);
    })
    .catch((error) => {
      if(error.response.data.error == "No-Form"){ // The Form doesn't exist
        setDataAccess('Not-Found');
        window.location = '/404';
      } else { // Developer Issue
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get Vehicle Details
  const fetchVehicle = () => {
    axiosClient
    .get('/getvehdet')
    .then((response) => {
      const responseData = response.data;

      setVehicleDet(responseData);
      
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get Driver Details
  const fetchDriver = () => {
    axiosClient
    .get(`/getdriverdet`)
    .then((response) => {
      const responseData = response.data;

      setDriverName(responseData)
      
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => { 
    if(currentUserId){
      fetchData();
      fetchVehicle();
      fetchDriver();
    }
  }, [id, currentUserId]);

  // Submit Vehicle Information
  function SubmitVehicleInfo(event){
    event.preventDefault();
    setSubmitLoading(true);

    const vehData = {
      assign: currentUserId,
      vehicle_type : vehicalName,
      driver_id : pointDriver.did, 
      driver : pointDriver.dname,
    }

    if(!vehicalName && !pointDriver.did){
      setPopupContent("error");
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
      .then(() => {
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
        if (error.response.status === 409) {
          setPopupContent("error");
          setPopupMessage(
            <div>
              <p className="popup-title">Oops!</p>
              <p className="popup-message">This slip has already assign the vehicle and driver. Please reload the page.</p>
            </div>
          );
          setShowPopup(true);
        } else {
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
  }

  // Approval Confirmation
  const handleAdminConfirmation = () => {
    setShowPopup(true);
    setPopupContent('adminVehApproval');
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

    const VehName = vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[0];
    const VehPlate = vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[1];

    const data = {
      approver: currentUserId,
      vehicleName: VehName,
      vehiclePlate: VehPlate,
    }

    axiosClient
    .put(`/vehreqapprove/${id}`, data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Approve Confirm</p>
          <p className="popup-message">The request has been confirmed.</p>
        </div>
      );
    })
    .catch(()=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Force Closed Function
  function handleCloseForm(event, id){
    event.preventDefault();

    alert("Hi");
  }

  // Popup Button Function
  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setShowPopup(false);
    setSubmitLoading(false);
    setLoading(true);
    fetchData();
    setButtonHide(false);
  }

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Vehicle-Slip-No:${id}`
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

  return (
    <PageComponent title="Vehicle Slip">
      {(loading || vehicleData === undefined) && (
        <div className="pre-loading-screen z-50 relative flex justify-center items-center">
          <img className="mx-auto h-32 w-auto absolute" src={loadingAnimation} alt="Your Company" />
          <img className="mx-auto h-16 w-auto absolute ppg-logo-img" src={ppalogo} alt="Your Company" />
        </div>
      )}

      {/* Header */}
      <div className="ppa-form-header text-base flex justify-between items-center">
        <span>Slip No: <span className="px-2 ppa-form-view">{vehicleData?.id}</span></span> 
        <div className="flex space-x-4"> 
        {!loading && (
          Admin && vehicleData?.admin_approval == 10 ? (
          <div className="flex justify-end space-x-2">
            {/* Approve */}
            <button  onClick={handleAdminConfirmation} className="px-4 btn-default-form text-base">
              Approve
            </button>
            {/* Decline onClick={() => setAdminApproval(true)} */}
            <button className="ml-2 py-2 px-4 btn-cancel-form text-base">
              Disapprove
            </button>
          </div>
          ):(
          <>
            <FontAwesomeIcon onClick={handleButtonClick} className="icon-delete" title="Get PDF" icon={faFilePdf} />
          </>
          )
        // <> 
          
        //   
        // </>
        )}
        </div>
      </div>

      {/* Form */}
      <div className="px-2 pt-6 pb-6 ppa-form-box bg-white mb-6">
  
        {/* Date Request */}
        <div className="flex items-center mt-2">
          <div className="w-44">
            <label className="block text-base font-bold leading-6 text-black">
              Date of Request:
            </label> 
          </div>
          <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
            {!loading && formatDate(vehicleData?.created_at)}
          </div>
        </div>

        {/* Purpose */}
        <div className="flex items-center mt-2">
          <div className="w-44">
            <label className="block text-base font-bold leading-6 text-black">
              Purpose:
            </label> 
          </div>
          <div className={`w-1/2 ${vehicleData?.purpose ? '' : 'h-6'} ${editDetail ? 'ppa-form-view text-left pl-2' : 'pt-1' }`}>
            {editDetail ? (
              !loading && vehicleData?.purpose
            ):(
              <input
                type="text"
                name="update_purpose"
                id="update_purpose"    
                value={updatePurpose ? updatePurpose : vehicleData?.purpose}
                onChange={ev => setUpdatePurpose(ev.target.value)}
                placeholder="Enter a purpose"
                className="block w-full ppa-form-edit"
              />
            )}
          </div>
        </div>

        {/* Place/s to be Visited */}
        <div className="flex items-center mt-2">
          <div className="w-44">
            <label className="block text-base font-bold leading-6 text-black">
              Place/s to be Visited:
            </label> 
          </div>
          <div className={`w-1/2 ${vehicleData?.place_visited ? '' : 'h-6'} ${editDetail ? 'ppa-form-view text-left pl-2' : 'pt-1' }`}>
            {editDetail ? (
              !loading && vehicleData?.place_visited
            ):(
              <input
                type="text"
                name="update_visited"
                id="update_visited"    
                value={updateVisited ? updateVisited : vehicleData?.place_visited}
                onChange={ev => setUpdateVisited(ev.target.value)}
                placeholder={vehicleData?.place_visited}
                className="block w-full ppa-form-edit"
              />
            )}
          </div>
        </div>

        {/* Date/Time of Arrival */}
        <div className="flex items-center mt-2">
          <div className="w-44">
            <label className="block text-base font-bold leading-6 text-black">
              Date/Time of Arrival:
            </label> 
          </div>
          <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
            {editDetail ? (
            <> {!loading && `${formatDate(vehicleData?.date_arrival)} @ ${formatTime(vehicleData?.time_arrival)}`} </>
            ):(
            <>
              {/* Date */}
              <div>
                <input
                  type="date"
                  name="update_date"
                  id="update_date"    
                  value={updateArrivalDate ? updateArrivalDate : vehicleData?.date_arrival}
                  onChange={ev => setUpdateArrivalDate(ev.target.value)}
                  className="block w-full ppa-form-edit"
                />
              </div>
              
              {/* Time */}
              <div className="pt-4">
                <input
                  type="time"
                  name="update_time"
                  id="update_time"    
                  value={updateArrivalTime ? updateArrivalTime : vehicleData?.time_arrival}
                  onChange={ev => setUpdateArrivalTime(ev.target.value)}
                  className="block w-full ppa-form-edit"
                />
              </div>
            </>
            )}
          </div>
        </div>

        {(vehicleData?.vehicle_type && vehicleData?.driver) && (
        <>
          {/* Type of Vehicle */}
          {!loading && (
          <div className="flex items-center mt-2">
            <div className="w-44">
              <label className="block text-base font-bold leading-6 text-black">
                {editDetail ? "Type of Vehicle:" : vehicleData?.vehicle_type ? "Type of Vehicle:" : null}
              </label> 
            </div>
            <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
              {editDetail ? (
                !loading && vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[0] : null
              ):(
                vehicleData?.vehicle_type ? (
                  <select 
                    name="update_vehicle" 
                    id="update_vehicle" 
                    value={updateVehicle}
                    onChange={ev => { setUpdateVehicle(ev.target.value); }}
                    className="block w-full ppa-form"
                  >
                    <option value="" disabled>{vehicleData?.vehicle_type}</option>
                    {vehicleDet?.map((vehDet) => (
                      <option key={vehDet.vehicle_id} value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`}>
                        {vehDet.vehicle_name} ({vehDet.vehicle_plate})
                      </option>
                    ))}
                  </select>
                ) : null
              )}
            </div>
          </div>
          )}

          {/* Plate Number */}
          {editDetail && !loading && (
            <div className="flex items-center mt-2">
              <div className="w-44">
                <label className="block text-base font-bold leading-6 text-black">
                Plate Number:
                </label> 
              </div>
              <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
                {!loading && vehicleData?.vehicle_type ? vehicleData?.vehicle_type.split(/ \(([^)]+)\)/)?.[1] : null}
              </div>
            </div>
          )}

          {/* Driver */}
          <div className="flex items-center mt-2">
            <div className="w-44">
              <label className="block text-base font-bold leading-6 text-black">
              {editDetail ? "Driver:" : vehicleData?.driver ? "Driver:" : null}
              </label> 
            </div>
            <div className={`w-1/2 ${editDetail ? 'ppa-form-view text-left pl-2 h-6' : 'pt-2' }`}>
              {editDetail ? (
                vehicleData?.driver
              ):(
                vehicleData?.driver ? (
                  <select 
                    name="update_driver" 
                    id="update_driver" 
                    value={pointDriver.did}
                    onChange={ev => {
                      const personnelId = parseInt(ev.target.value);
                      const selectedPersonnel = driverName.find(staff => staff.driver_id === personnelId);

                      setPointDriver(selectedPersonnel ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } : { did: '', dname: '' });
                    }}
                    className="block w-full ppa-form"
                  >
                    <option value="" disabled>{vehicleData?.driver}</option>
                    {driverName?.map((driverDet) => (
                      <option key={driverDet.driver_id} value={driverDet.driver_id}>
                        {driverDet.driver_name}
                      </option>
                    ))}
                  </select>
                ):null
              )}
            </div>
          </div>
        </>
        )}

        {/* Requested By */}
        {editDetail && (
          <div className="flex items-center mt-2">
            <div className="w-44">
              <label className="block text-base font-bold leading-6 text-black">
              Requested By:
              </label> 
            </div>
            <div className="w-1/2 ppa-form-view text-left pl-2 h-6">
              {!loading && vehicleData?.user_name}
            </div>
          </div>
        )}

        {/* Passengers */}
        {!loading && (
        <div className="flex items-center">
          <div className="w-44">
            <label className="block text-base font-bold leading-6 text-black">
            {editDetail ? (passenger == "None" ? null : 'Passengers:'):('Passengers:')}
            </label> 
          </div>
          {editDetail ? (
            passenger == "None" ? null:(
              <div style={{ columnCount: passenger.length > 5 ? 2 : 1 }} className="w-full ppa-form-view-border text-left mt-2">
                {passenger?.map((data, index) => (
                  <div key={index} className="flex mt-1">
                    <div className="w-6">
                      <label className="block text-base font-bold leading-6 text-gray-900">
                      {index + 1}.
                      </label> 
                    </div>
                    <div className="w-7/12 ppa-form-view text-left h-6 mr-2">
                      {data}
                    </div>
                  </div>
                ))}
              </div>
            )
          ):(
          <>
            <textarea
              id="vr_passengers"
              name="vr_passengers"
              rows={7}
              value={updatePassengers ? updatePassengers : vehicleData?.passengers}
              onChange={ev => setUpdatePassengers(ev.target.value)}
              style={{ resize: 'none' }}
              maxLength={1000}
              className="block w-full ppa-form"
            />
            <p className="text-gray-500 text-xs mt-2">Separate name on next line (If no passengers just leave it blank)</p>
          </>
          )}
        </div>
        )}

        {/* Status */}
        {!loading && (
        <div className="flex items-center mt-6">
          <div className="w-20">
            <label className="block text-base font-bold leading-6 text-black">
              Status:
            </label> 
          </div>
          <div className="w-full ppa-form-view text-left pl-2 h-6">
            {vehicleData?.remarks}
          </div>
        </div>
        )}
        
        {/* Get Driver and Vehicle Details */}
        {!loading && !buttonHide && vehicleData?.admin_approval == 8 && (GSO || PersonAuthority) && (
        <div className="mt-10">
          <h2 className="text-base font-bold leading-7 text-black"> Assign Vehicle and Driver </h2>
          <form id="vehicleInfo" onSubmit={SubmitVehicleInfo}>
            <div className="grid grid-cols-2 mt-2">

              <div className="col-span-1">
                  {/* Vehicle Type */}
                  <div className="flex items-center">
                    <div className="w-40">
                      <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
                        Vehicle Type:
                      </label> 
                    </div>
                    <div className="w-3/5">
                      <select 
                      name="rep_type_of_property" 
                      id="rep_type_of_property" 
                      autoComplete="rep_type_of_property"
                      value={vehicalName}
                      onChange={ev => { setVehicleName(ev.target.value); }}
                      className="block w-full ppa-form"
                      >
                        <option value="" disabled>Vehicle Select</option>
                        {vehicleDet?.map((vehDet) => (
                          <option key={vehDet.vehicle_id} value={`${vehDet.vehicle_name} (${vehDet.vehicle_plate})`}>
                            {vehDet.vehicle_name} ({vehDet.vehicle_plate})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>   
              </div>

              <div className="col-span-1">
                {/* Driver Details */}
                <div className="flex items-center">
                  <div className="w-24">
                    <label htmlFor="rep_type_of_property" className="block text-base font-bold leading-6 text-black">
                      Driver:
                    </label> 
                  </div>
                  <div className="w-3/5">
                    <select 
                    name="rep_type_of_property" 
                    id="rep_type_of_property" 
                    autoComplete="rep_type_of_property"
                    value={pointDriver.did}
                    onChange={ev => {
                      const personnelId = parseInt(ev.target.value);
                      const selectedPersonnel = driverName.find(staff => staff.driver_id === personnelId);

                      setPointDriver(selectedPersonnel ? { did: selectedPersonnel.driver_id, dname: selectedPersonnel.driver_name } : { did: '', dname: '' });
                    }}
                    className="block w-full ppa-form"
                    >
                      <option value="" disabled>Driver Select</option>
                      {driverName?.map((driverDet) => (
                        <option key={driverDet.driver_id} value={driverDet.driver_id}>
                          {driverDet.driver_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Button */}
            <div className="mt-4">
              <button 
                type="submit"
                form="vehicleInfo"
                className={`py-2 px-4 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
            </div>

          </form>
        </div>
        )}

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
          SubmitApproval={SubmitApproval}
          // form={"vr_reason"}
          // handleCloseForm={handleCloseForm}
          vehicle={vehicleData?.id}
        />
      )}

      {/* PDF */}
      {isVisible && (
        <div>
          <div className="hidden md:none">
            <div ref={componentRef}>

            <div className="relative" style={{ width: '297mm', height: '210mm', paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', border: '0px solid' }}>

              <div className="grid grid-cols-2 gap-4">

                {/* Copy for the Admin Manager */}
                <div className="col-span-1">

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
                        <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                      </td>
                    </tr>

                    {/* Date */}
                    <tr>
                      <td className="w-1/3"></td>
                      <td className="w-1/3"></td>
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleData?.created_at)}</p>
                        <p className="text-sm text-center font-arial">Date</p>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PASSENGERS/s:</span>
                            </div>
                            <div className="w-full">
                              {passenger == "None" ? (
                                <div style={{ columnCount: 2, borderBottom: '1px solid black', display: 'block', padding: '1px', height: '18px' }}></div> 
                              ):(
                                <div style={{ columnCount: 2, display: 'block', padding: '1px' }}>
                                  {passenger?.map((data, index) => (
                                    <span key={index} className="flex text-xs border-b border-black mb-1">
                                      {`${index + 1}. ${data }`}
                                    </span>
                                  ))}
                                </div>
                              )}
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
                              <span>{vehicleData?.purpose}</span>
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
                              <span>{vehicleData?.place_visited}</span>
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
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>

                    {/* Driver Information */}
                    <tr>

                      {/* Vehicle Type */}
                      <td className="w-1/3 pt-10">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                        <p className="text-sm text-center font-arial">Type of Vehicle</p>
                      </td>

                      {/* Plate No */}
                      <td className="w-1/3 pt-10 px-8">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                        <p className="text-sm text-center font-arial">Plate No.</p>
                      </td>

                      {/* Driver */}
                      <td className="w-1/3 pt-10 relative">
                        <img
                          src={requestor?.driverEsig}
                          className="ppa-esig-driver-vs"
                          alt="Signature"
                        />
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                        <p className="text-sm text-center font-arial">Driver</p>
                      </td>

                    </tr>

                    {/* Requestor */}
                    <tr>
                      <td colSpan={2} className="w-1/3 pt-5">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          REQUESTED BY:
                        </div>

                        <div className="relative pt-2">
                          <img
                            src={requestor?.requestorEsig}
                            className="ppa-esig-user-vs"
                            alt="Signature"
                          />
                        </div>
                        <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                          {vehicleData?.user_name}
                        </div>
                        <div className="w-3/4 text-center text-sm relative">
                          {requestor?.requestorPosData}
                        </div> 
                        
                      </td>
                    </tr>

                    {/* Admin Manager or Port Manager */}
                    <tr>
                      <td colSpan={2} className="pt-4">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                          (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                        </div>
                        
                        {vehicleData?.type_of_slip == 'within' ? (
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.adminEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.adminName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Adminstrative Division Manager
                          </div> 
                        </>
                        ):(
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.pmEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.pmName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Port Manager
                          </div> 
                        </>
                        )}

                      </td>
                    </tr>

                  </table>

                  <span className="system-generated">Joint Local Management System - This is system-generated.</span>

                </div>

                {/* Copy for GSO */}
                <div className="col-span-1">

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
                        <p>PMO-<u className="underline-text">Lanao Del Norte/Iligan</u></p>
                      </td>
                    </tr>

                    {/* Date */}
                    <tr>
                      <td className="w-1/3"></td>
                      <td className="w-1/3"></td>
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleData?.created_at)}</p>
                        <p className="text-sm text-center font-arial">Date</p>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td colSpan={3}>

                        <div className="font-arial font-bold text-center text-sm">
                          <span>VEHICLE REQUEST SLIP</span>
                        </div>

                        <div className="font-arial text-left pt-2 text-sm">
                          <p>Provision of service vehicle/s for official use of personnel is requested with the following details:</p>
                        </div>

                        {/* Passenger */}
                        <div className="mt-4">
                          <div className="flex">
                            <div className="w-44 font-arial text-sm">
                              <span>PASSENGERS/s:</span>
                            </div>
                            <div className="w-full">
                              {passenger == "None" ? (
                                <div style={{ columnCount: 2, borderBottom: '1px solid black', display: 'block', padding: '1px', height: '18px' }}></div> 
                              ):(
                                <div style={{ columnCount: 2, display: 'block', padding: '1px' }}>
                                  {passenger?.map((data, index) => (
                                    <span key={index} className="flex text-xs border-b border-black mb-1">
                                      {`${index + 1}. ${data }`}
                                    </span>
                                  ))}
                                </div>
                              )}
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
                              <span>{vehicleData?.purpose}</span>
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
                              <span>{vehicleData?.place_visited}</span>
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
                              <span>{formatDate(vehicleData?.date_arrival)} @ {formatTime(vehicleData?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>

                    {/* Driver Information */}
                    <tr>

                      {/* Vehicle Type */}
                      <td className="w-1/3 pt-10">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[0]}</p>
                        <p className="text-sm text-center font-arial">Type of Vehicle</p>
                      </td>

                      {/* Plate No */}
                      <td className="w-1/3 pt-10 px-8">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.vehicle_type?.split(/ \(([^)]+)\)/)?.[1]}</p>
                        <p className="text-sm text-center font-arial">Plate No.</p>
                      </td>

                      {/* Driver */}
                      <td className="w-1/3 pt-10 relative">
                        <img
                          src={requestor?.driverEsig}
                          className="ppa-esig-driver-vs"
                          alt="Signature"
                        />
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleData?.driver}</p>
                        <p className="text-sm text-center font-arial">Driver</p>
                      </td>

                    </tr>

                    {/* Requestor */}
                    <tr>
                      <td colSpan={2} className="w-1/3 pt-5">

                        <div className="w-3/4 text-sm font-arial font-bold">
                          REQUESTED BY:
                        </div>

                        <div className="relative pt-2">
                          <img
                            src={requestor?.requestorEsig}
                            className="ppa-esig-user-vs"
                            alt="Signature"
                          />
                        </div>
                        <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                          {vehicleData?.user_name}
                        </div>
                        <div className="w-3/4 text-center text-sm relative">
                          {requestor?.requestorPosData}
                        </div> 
                        
                      </td>
                    </tr>

                    {/* Admin Manager or Port Manager */}
                    <tr>
                      <td colSpan={2} className="pt-4">

                        <div className="w-3/4 text-sm font-arial font-bold">
                        {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) ? ("APPROVED:"):
                          (vehicleData?.admin_approval == 3 || vehicleData?.admin_approval == 4) ? ("DISAPPROVED:"):"APPROVED:"}
                        </div>
                        
                        {vehicleData?.type_of_slip == 'within' ? (
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.adminEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.adminName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Adminstrative Division Manager
                          </div> 
                        </>
                        ):(
                        <>
                          <div className="relative pt-2">
                            {(vehicleData?.admin_approval == 1 || vehicleData?.admin_approval == 2) && (
                              <img
                                src={admin?.pmEsig}
                                className="ppa-esig-user-vs"
                                alt="Signature"
                              />
                            )}
                          </div>
                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-7">
                            {admin?.pmName}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Acting Port Manager
                          </div> 
                        </>
                        )}

                      </td>
                    </tr>

                  </table>

                  <span className="system-generated">Joint Local Management System - This is system-generated.</span>

                </div>

              </div>
            
            </div>

            </div>
          </div>
        </div>
      )}
    </PageComponent>
  );
}