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

export default function PrePostRepairForm(){

  const { currentUser, userRole } = useUserStateContext();

  //Date Format
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

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

  const {id} = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [vehicleForms, setvehicleForm] = useState({});
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const [driverList, setDriverList] = useState([]);
  const [VRVehicle, setVRVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  //Show data
  const fetchVehicleForm = () => {

    axiosClient
    .get(`/vehicleform/${id}`)
    .then((response) => {
      const responseData = response.data;
      const vehicleForm = responseData.vehicle_form;
      const requestor = responseData.requestor;
      const manager = responseData.manager_user_details;

      setvehicleForm({
        vehicleForm,
        requestor,
        manager
      });

      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  // Get Driver List
  const fetchDriver = () => {
    axiosClient.get('/getdriver')
    .then(response => {
      const driversData = response.data;
      setDriverList(driversData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchVehicleForm();
    fetchDriver();
  },[id]);

  //Popup Message
  const DevErrorText = (
    <div>
      <p className="popup-title">ATTENTION!</p>
      <p>There were some issues with the system; please contact the developer</p>
    </div>
  );

  // Show Vehicle Form
  const handleAppearVehicleForm = () => {
    setShowFormVehicle(true);
  }

  // Admin Confirmation Approval
  function handleApprovalRequest(){

    if(currentUser.code_clearance == 1){
      //For Admin Manager
      setPopupContent('warning');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Are you sure you want to approve {vehicleForms?.requestor?.name}'s request?</p>
        </div>
      );
    }
    
  }
  
  // Admin Confirmation Disapproval
  function handleDeclineRequest(){

    if(currentUser.code_clearance == 1){
      //For Admin Manager
      setPopupContent('warningD');
      setShowPopup(true);
      setPopupMessage(
        <div>
          <p className="popup-title">Are you Sure?</p>
          <p>Are you sure you want to disapprove {vehicleForms?.requestor?.name}'s request?</p>
        </div>
      );
    }

  }

  // Approval Function
  function handleApproveClick(id){

    //alert("Goods");

    setSubmitLoading(true);

    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has approved on ${vehicleForms?.requestor?.name}'s request for Vehicle Slip (Slip No: ${vehicleForms?.vehicleForm?.id})`

    axiosClient.put(`/vehicleformapprove/${id}`,{
      logs: logs
    })
    .then((response) => {
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Done!</p>
          <p>The form request approval was successful</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      console.error(error);
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
    });

  }

  // Disapproval Function
  function handleDispproveClick(id){

    //alert("Goods!");

    setSubmitLoading(true);

    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has disapproved on ${vehicleForms?.requestor?.name}'s request for Vehicle Slip (Slip No: ${vehicleForms?.vehicleForm?.id})`

    axiosClient.put(`/vehicleformdisapprove/${id}`,{
      logs: logs
    })
    .then((response) => {
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Done!</p>
          <p>The form request disapproval was successful</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
    });

  }

  // Closing Form Function
  function handleCloseClick(id){

    //alert("Goods!");

    setSubmitLoading(true);

    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has closed the on ${vehicleForms?.requestor?.name}'s request for Vehicle Slip (Slip No: ${vehicleForms?.vehicleForm?.id})`

    axiosClient.put(`/closevehicleslip/${id}`, {
      logs: logs
    })
    .then((response) => {
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Request Close!</p>
          <p>The form request has been successfully closed.</p>
        </div>
      );
      setShowPopup(true);
    })
    .catch((error) => {
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
    });

  }

  // Close the Popup on Approval
  const closeSuccess = () => {
    setIsLoading(true);
    fetchVehicleForm();
    setShowPopup(false);
    setSubmitLoading(false);
    window.location.reload();
  };

  const handleVRVehicleChange = (event) => {
    setVRVehicle(event.target.value);
  };

  const handleDriverName = (event) => {
    setSelectedDriver(event.target.value);
  };

  // Submit the Form
  const VehicleSlipForm = (event) => {
    event.preventDefault();

    //alert("Goods");

    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has filled-up the vehicle and driver's details on ${vehicleForms?.requestor?.name}'s request for Vehicle Slip (Slip No: ${vehicleForms?.vehicleForm?.id})`

    setSubmitLoading(true);
    axiosClient
    .put(`getvehicleslip/${id}`, {
      vehicle_type: VRVehicle,
      driver: selectedDriver,
      logs: logs
    })
    .then((response) => {
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title"><strong>Success</strong></p>
          <p>Form submit successfully</p>
        </div>
      ); 
      setShowPopup(true);   
      setSubmitLoading(false);
    })
    .catch((error) => {
      //console.error(error);
      const responseErrors = error.response.data.errors;
      setInputErrors(responseErrors);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Generate PDF
  const componentRef= useRef();

  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Vehicle-Slip-No:${id}`
  });

  //Count down
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

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

  //Close Popup 
  const justclose = () => { setShowPopup(false); };

  // Restrictions
  const Authorize = userRole == 'h4ck3rZ@1Oppa' || userRole == '4DmIn@Pp4' || userRole == 'Pm@PP4';

  return Authorize ?(
  <PageComponent title="Request For Vehicle Slip">
    {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Form</span>
    </div>
    ):(
    <>
      {/* Back to List */}
      <button className="px-6 py-2 btn-default">
        <Link to="/vehiclesliprequestform">Back to Request List</Link>
      </button>

      {/* Slip No */}
      <div className="flex items-center mb-6 mt-4 font-roboto">
        <div className="w-24">
          <label className="block text-base font-medium leading-6">
          Slip No:
          </label> 
        </div>
        <div className="w-auto px-5 border-b border-black text-center font-bold">
        {vehicleForms?.vehicleForm?.id}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date */}
          <div className="flex items-center mt-6 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(vehicleForms?.vehicleForm?.date_of_request)}
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Purpose:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {vehicleForms?.vehicleForm?.purpose}
            </div>
          </div>

          {/* Place */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Place to be visited:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {vehicleForms?.vehicleForm?.place_visited}
            </div>
          </div>

          {/* Date Time */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Date/Time of Arrival:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {formatDate(vehicleForms?.vehicleForm?.date_arrival)} @ {formatTime(vehicleForms?.vehicleForm?.time_arrival)}
            </div>
          </div>

          {/* Driver Details */}
          {vehicleForms?.vehicleForm?.vehicle_type != 'None' && vehicleForms?.vehicleForm?.driver != 'None' ? (
          <>

          {/* Vehicle */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Type of Vehicle:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[0]}
            </div>
          </div>

          {/* Plate No. */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Plate No:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {vehicleForms?.vehicleForm?.vehicle_type == 'None' ? vehicleForms?.vehicleForm?.vehicle_type : vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[1]}
            </div>
          </div>

          {/* Driver */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Driver:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1">
            {vehicleForms?.vehicleForm?.driver}
            </div>
          </div>

          </>
          ):null}

          {/* Requested by */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Requested by:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1 font-bold">
            {vehicleForms?.requestor?.name}
            </div>
          </div>

          {/* Approved by */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-40">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Approved by:
              </label> 
            </div>
            <div className="w-64 border-b border-black pl-1 font-bold">
            {vehicleForms?.manager?.manager_name}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Passengers */}
          <div className="flex mt-4 font-roboto">
            <div className="w-28">
              <label className="block text-base font-medium leading-6 text-gray-900">
              Passenger/s:
              </label> 
            </div>
            <div className="w-1/2">
              <div>
              {vehicleForms?.vehicleForm?.passengers == 'N/A' ? (
                "No Passengers"
              ):(
              <>
                {vehicleForms?.vehicleForm?.passengers?.split('\n')?.map((passenger, index) => (
                  <span key={index} style={{ borderBottom: '1px solid black', display: 'block', padding: '2px' }}>
                    {`${index + 1}. ${passenger}`}
                  </span>
                ))}
              </>
              )}
                
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Status */}
      <div className="flex items-center mt-8 font-roboto">
        <div className="w-16">
          <label className="block text-base font-bold leading-6 text-gray-900">
          Status:
          </label> 
        </div>
        <div className="w-96 font-bold">
        {vehicleForms?.vehicleForm?.admin_approval == 5 && ("Waiting for vehicle and driver")}
        {vehicleForms?.vehicleForm?.admin_approval == 4 && (currentUser.code_clearance == 1 ? "Waiting for your approval" : "Waiting for Admin Manager's approval")}
        {vehicleForms?.vehicleForm?.admin_approval == 3 && ("Disapproved")}
        {vehicleForms?.vehicleForm?.admin_approval == 2 && ("Approved")}
        {vehicleForms?.vehicleForm?.admin_approval == 1 && ("Closed")}
        </div>
      </div>

      {/* Show Form */}
      {vehicleForms?.vehicleForm?.vehicle_type == 'None' && vehicleForms?.vehicleForm?.driver == 'None' && currentUser.code_clearance == 3 ? (
      <>
        <form id="VehicleSlip" onSubmit={VehicleSlipForm}>

          {/* Type of Vehicle */}
          <div className="flex items-center mt-4 font-roboto">
            <div className="w-44">
              <label htmlFor="vr_vehicle" className="block text-base font-medium leading-6 text-gray-900">
                Type of Vehicle:
              </label> 
            </div>
            
            <div className="w-full">
              <select 
                name="vr_vehicle" 
                id="vr_vehicle" 
                autoComplete="vr_vehicle"
                value={VRVehicle}
                onChange={handleVRVehicleChange}
                className="block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a vehicle</option>
                <option value="" disabled class="font-bold text-black"><b>Admin Vehicle</b></option>
                <option value="Mitsubishi Adventure = SLF 432">Mitsubishi Adventure - SLF 432</option>
                <option value="Toyota Hi-Ace = SAB 4362">Toyota Hi-Ace - SAB 4362</option>
                <option value="Isuzu Van = SFT 545">Isuzu Van - SFT 545</option>
                <option value="Toyota Hi-Lux = SFM 708">Toyota Hi-Lux - SFM 708</option>
                <option value="Hyundai Sta Fe = Temp 101709">Hyundai Sta Fe - Temp 101709</option>
                <option value="Toyota Hi-Lux/Fx CS = Temp SOF 880">Toyota Hi-Lux/Fx CS - Temp SOF 880</option>
                <option value="" disabled class="font-bold text-black"><b>OPM Vehicle</b></option>
                <option value="Toyota Hi-Lux = NBG 9724">Toyota Hi-Lux - NBG 9724</option>
                <option value="Toyota Fortuner = D2S 454">Toyota Fortuner - D2S 454</option>
                <option value="" disabled class="font-bold text-black"><b>Port Police Vehicle</b></option>
                <option value="Mitsubishi Adventure = SLG 388">Mitsubishi Adventure - SLG 388</option>
                <option value="Mitsubishi Adventure = SHL 594">Mitsubishi Adventure - SHL 594</option>
                <option value="Toyota Hi-Lux Patrol = SAB 4394">Toyota Hi-Lux Patrol - SAB 4394</option>
                <option value="Toyota Hi-Lux Patrol = S6 H167">Toyota Hi-Lux Patrol - S6 H167</option>
                <option value="" disabled class="font-bold text-black"><b>TMO Tubod Vehicle</b></option>
                <option value="Toyota Innova = SHX 195">Toyota Innova - SHX 195</option>
              </select> 
              {!VRVehicle && inputErrors.vehicle_type && (
                <p className="form-validation">This field must be required</p>
              )}
            </div>
          </div>

          {/* Driver */}
          <div className="flex items-center mt-2 font-roboto">
            <div className="w-44">
              <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                Driver:
              </label> 
            </div>
            <div className="w-full">
              <select
                name="plate_number"
                id="plate_number"
                autoComplete="request-name"
                value={selectedDriver}
                onChange={handleDriverName}
                className="block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a Driver</option>
                {driverList.map(driver => (
                  <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                ))}
              </select>
              {!selectedDriver && inputErrors.driver && (
                <p className="form-validation">This field must be required</p>
              )}
            </div>
          </div>

        </form>
      </>
      ):null}

      {/* Button */}
      <div className="mt-8 flex font-roboto">

        {/* GSO Button  */}
        {currentUser.code_clearance == 3 && (
        <>
          {/* Submit Button on Vehicle Slip*/}
          {vehicleForms?.vehicleForm?.admin_approval == 5 && (
          <div>
            <button
              type="submit"
              form="VehicleSlip"
              className={`px-6 py-2 btn-submit ${ submitLoading && 'btn-submitting'}`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
          )}

          {/* Close the Request */}
          {vehicleForms?.vehicleForm?.admin_approval == 2 && (
          <>
            <button
              onClick={() => handleCloseClick(vehicleForms?.vehicleForm?.id)}
              className={`px-6 py-2 btn-close ${ submitLoading && 'btn-closing'}`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Closing</span>
                </div>
              ) : (
                'Close Request'
              )}
            </button>
          </>
          )}
        </>
        )}

        {/* Admin Button */}
        {currentUser.code_clearance == 1 && (
        <> 
          {/* Approval */}
          {vehicleForms?.vehicleForm?.admin_approval == 4 && (
          <div>
            {/* Approve */}
            <button onClick={() => handleApprovalRequest()} className="px-6 py-2 btn-submit" title="Approve">
              Approve
            </button>

            {/* Disapprove */}
            <button onClick={() => handleDeclineRequest()} className="px-6 py-2 btn-cancel ml-2" title="Disapprove">
              Disapprove
            </button>
          </div>
          )}
        </>  
        )}

        {/* Generate PDF */}
        {vehicleForms?.vehicleForm?.admin_approval == 1 && (
        <>
          <button type="button" onClick={handleButtonClick}
            className={`px-6 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
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
        </>
        )}

      </div>

      {/* Show Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div className="fixed inset-0 bg-black opacity-40"></div>

          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '400px' }}>

          {/* Notification Icons */}
          <div class="f-modal-alert">

            {/* Error */}
            {popupContent == "error" && (
            <>
            <div className="f-modal-icon f-modal-error animate">
              <span className="f-modal-x-mark">
                <span className="f-modal-line f-modal-left animateXLeft"></span>
                <span className="f-modal-line f-modal-right animateXRight"></span>
              </span>
            </div>
            </>
            )}

            {/* Success */}
            {popupContent == "success" && (
            <>
            <div class="f-modal-icon f-modal-success animate">
              <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
              <span class="f-modal-line f-modal-long animateSuccessLong"></span>
            </div>
            </>
            )}

            {/* Warning */}
            {(popupContent == "warning" || popupContent == "warningD") && (
            <>
              <div class="f-modal-icon f-modal-warning scaleWarning">
                <span class="f-modal-body pulseWarningIns"></span>
                <span class="f-modal-dot pulseWarningIns"></span>
              </div>
            </> 
            )}

          </div>
          
          {/* Popup Message */}
          <p className="text-lg text-center font-roboto">{popupMessage}</p>

          {/* Popup Button */}
          <div className="flex justify-center mt-4 font-roboto">

            {/* Error */}
            {popupContent == "error" && (
            <>
              <button onClick={justclose} className="w-full py-2 btn-error">
                Close
              </button>
            </>  
            )}

            {/* Warning */}
            {popupContent == "warning" && (
            <>

              {currentUser.code_clearance == 1 && (
              <>
                {!submitLoading && (
                  <button onClick={() => handleApproveClick(vehicleForms?.vehicleForm?.id)} className="w-1/2 py-2 popup-confirm">
                    <FontAwesomeIcon icon={faCheck} /> Confirm
                  </button>
                )}

                {!submitLoading && (
                  <button onClick={justclose} className="w-1/2 py-2 popup-cancel">
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                )}

                {submitLoading && (
                  <button className="w-full cursor-not-allowed py-2 btn-process">
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

            {popupContent == "warningD" && (
            <>
              {!submitLoading && (
                <button onClick={() => handleDispproveClick(vehicleForms?.vehicleForm?.id)} className="w-1/2 py-2 popup-confirm">
                  <FontAwesomeIcon icon={faCheck} /> Confirm
                </button>
              )}

              {!submitLoading && (
                <button onClick={justclose} className="w-1/2 py-2 popup-cancel">
                 <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              )}

              {submitLoading && (
                <button className="w-full cursor-not-allowed py-2 btn-process">
                  <div className="flex items-center justify-center">
                    <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                    <span className="ml-2">Please Wait</span>
                  </div>
                </button>
              )}
            </>
            )}

            {/* Success */}
            {popupContent == "success" && (
            <>
              <button onClick={closeSuccess} className="w-full py-2 btn-success">
                Close
              </button>
            </>
            )}
          </div>

          </div>

        </div>
      )}

      {/* Generate PDF */}
      {isVisible && (
        <div>
          <div className="hidden md:none">
            <div ref={componentRef}>

              <div style={{ width: '297mm', height: '210mm', paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', border: '1px solid' }}>

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
                          <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleForms?.vehicleForm?.date_of_request)}</p>
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
                                <div style={{ columnCount: 2 }}>
                                  {vehicleForms?.vehicleForm?.passengers?.split('\n')?.map((passenger, index) => (
                                    <span key={index} className="text-xs" style={{ borderBottom: '1px solid black', display: 'block', padding: '1px' }}>
                                      {`${index + 1}. ${passenger}`}
                                    </span>
                                  ))}
                                </div>
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
                                <span>{vehicleForms?.vehicleForm?.purpose}</span>
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
                                <span>{vehicleForms?.vehicleForm?.place_visited}</span>
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
                                <span>{formatDate(vehicleForms?.vehicleForm?.date_arrival)} @ {formatTime(vehicleForms?.vehicleForm?.time_arrival)}</span>
                              </div>
                            </div>
                          </div>

                        </td>
                      </tr>

                      {/* Driver Information */}
                      <tr>

                        {/* Vehicle Type */}
                        <td className="w-1/3 pt-4">
                          <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[0]}</p>
                          <p className="text-sm text-center font-arial">Type of Vehicle</p>
                        </td>

                        {/* Plate No */}
                        <td className="w-1/3 pt-4 px-8">
                          <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[1]}</p>
                          <p className="text-sm text-center font-arial">Plate No.</p>
                        </td>

                        {/* Driver */}
                        <td className="w-1/3 pt-4">
                          <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.driver}</p>
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
                              src={vehicleForms?.requestor?.signature}
                              style={{ position: 'absolute', width: '200px', top: '-15px', left: '30px' }}
                              alt="Signature"
                            />
                          </div>
                          <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
                            {vehicleForms?.requestor?.name}
                          </div>
                          <div className="w-3/4 text-center text-sm relative">
                            {vehicleForms?.requestor?.position}
                          </div>   

                        </td>
                      </tr>

                      {/* Admin Manager */}
                      <tr>
                        <td colSpan={2} className="pt-4">

                          <div className="w-3/4 text-sm font-arial font-bold">
                            {vehicleForms?.vehicleForm?.admin_approval == 1 ? ("APPROVED:"):
                            vehicleForms?.vehicleForm?.admin_approval == 2 ? ("DISAPPROVED:"):"APPROVED:"}
                          </div>

                          <div className="relative pt-2">
                            {(vehicleForms?.vehicleForm?.admin_approval == 1 || vehicleForms?.vehicleForm?.admin_approval == 2) && (
                              <img
                                src={vehicleForms?.manager?.manager_signature}
                                style={{ position: 'absolute', width: '200px', top: '-10px', left: '30px' }}
                                alt="Signature"
                              />
                            )}
                          </div>

                          <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
                            {vehicleForms?.manager?.manager_name}
                          </div> 
                          <div className="w-3/4 text-center text-sm relative">
                            Adminstrative Division Manager
                          </div>  

                        </td>
                      </tr>

                    </table>

                  </div>

                  {/* Copy for the GSO */}
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
                        <p className="border-b border-black text-sm text-center font-arial">{formatDate(vehicleForms?.vehicleForm?.date_of_request)}</p>
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
                              <div style={{ columnCount: 2 }}>
                                {vehicleForms?.vehicleForm?.passengers?.split('\n')?.map((passenger, index) => (
                                  <span key={index} className="text-xs" style={{ borderBottom: '1px solid black', display: 'block', padding: '1px' }}>
                                    {`${index + 1}. ${passenger}`}
                                  </span>
                                ))}
                              </div>
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
                              <span>{vehicleForms?.vehicleForm?.purpose}</span>
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
                              <span>{vehicleForms?.vehicleForm?.place_visited}</span>
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
                              <span>{formatDate(vehicleForms?.vehicleForm?.date_arrival)} @ {formatTime(vehicleForms?.vehicleForm?.time_arrival)}</span>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>

                    {/* Driver Information */}
                    <tr>

                      {/* Vehicle Type */}
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[0]}</p>
                        <p className="text-sm text-center font-arial">Type of Vehicle</p>
                      </td>

                      {/* Plate No */}
                      <td className="w-1/3 pt-4 px-8">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.vehicle_type?.split('=')?.[1]}</p>
                        <p className="text-sm text-center font-arial">Plate No.</p>
                      </td>

                      {/* Driver */}
                      <td className="w-1/3 pt-4">
                        <p className="border-b border-black text-xs text-center font-arial">{vehicleForms?.vehicleForm?.driver}</p>
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
                            src={vehicleForms?.requestor?.signature}
                            style={{ position: 'absolute', width: '200px', top: '-15px', left: '30px' }}
                            alt="Signature"
                          />
                        </div>
                        <div className=" w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
                          {vehicleForms?.requestor?.name}
                        </div>
                        <div className="w-3/4 text-center text-sm relative">
                          {vehicleForms?.requestor?.position}
                        </div>   

                      </td>
                    </tr>

{/* Admin Manager */}
<tr>
  <td colSpan={2} className="pt-4">

    <div className="w-3/4 text-sm font-arial font-bold">
      {vehicleForms?.vehicleForm?.admin_approval == 1 ? ("APPROVED:"):
      vehicleForms?.vehicleForm?.admin_approval == 2 ? ("DISAPPROVED:"):"APPROVED:"}
    </div>

    <div className="relative pt-2">
      {(vehicleForms?.vehicleForm?.admin_approval == 1 || vehicleForms?.vehicleForm?.admin_approval == 2) && (
        <img
          src={vehicleForms?.manager?.manager_signature}
          style={{ position: 'absolute', width: '200px', top: '-10px', left: '30px' }}
          alt="Signature"
        />
      )}
    </div>

    <div className="w-3/4 text-center font-bold border-b border-black text-sm relative mt-5">
      {vehicleForms?.manager?.manager_name}
    </div> 
    <div className="w-3/4 text-center text-sm relative">
      Adminstrative Division Manager
    </div>  

  </td>
</tr>

</table>

                  </div>

                </div>

              </div>

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