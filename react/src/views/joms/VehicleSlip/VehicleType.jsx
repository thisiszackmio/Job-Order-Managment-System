import React, { useEffect, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import submitAnimation from '../../../assets/loading_nobg.gif';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function AddVehicleType(){

  const { currentUserId, userCode } = useUserStateContext();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addVehicle, setAddVehicle] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Variable 
  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Output
  const [vehicle, getVehicle] = useState([]);

  // Set Access
  const [Access, setAccess] = useState(false);

  // Disable the Scroll on Popup
  useEffect(() => {
    // Define the class to be added/removed
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
    } else if (loading) {
      addLoadingClass();
    } else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup, loading]);

  // Get Vehicle Data
  const fectVehicleData = () => {
    axiosClient
    .get('/showvehdet')
    .then((response) => {
      const VehicleData = response.data;

      getVehicle(VehicleData);

      // Restrictions Condition
      const ucode = userCode;
      const codes = ucode.split(',').map(code => code.trim());
      const Admin = codes.includes("AM");
      const GSO = codes.includes("GSO");
      const SuperAdmin = codes.includes("HACK");

      // Conditions
      setAccess(GSO || Admin || SuperAdmin);

    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(()=>{
    if(currentUserId?.id){
      fectVehicleData();
    }
  },[currentUserId]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit the Form
  const GetVehicleDetails = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.name} has just added the vehicle details.`;

    const data = {
      vehicle_name: vehicleName,
      vehicle_plate: vehiclePlate,
      // Logs
      logs: logs
    }

    axiosClient
    .post('/submitvehtype', data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The data is stored on the database</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 422) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">The fields are required!</p>
          </div>
        );
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

  // Removal Popup 
  const handleRemovalConfirmation = (id) => {
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('warning');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want remove? It cannot be undone.</p>
      </div>
    );
  }

  // Delete the Data
  const removeVehicleDet = () => {
    setSubmitLoading(true);

    const logs = `${currentUserId.name} has just removed the vehicle details.`;

    axiosClient
    .delete(`/deletevehdet/${selectedId}`,{
      data: {
        logs: logs
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The data has been removed from the database.</p>
        </div>
      );
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
  const justclose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

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
    Access ? (   
    <PageComponent title="Vehicle Information">

      {/* Main Content */}
      <div className="font-roboto ppa-form-box">
        <div className="ppa-form-header text-base flex justify-between items-center">

          <span>Vehicle List</span>

          {addVehicle ? (
            <button onClick={() => { setAddVehicle(false); }}  className="py-1.5 px-3 text-base btn-cancel"> Cancel </button>
          ):(
            <button onClick={() => { setAddVehicle(true); }}  className="py-1.5 px-3 text-base btn-default"> Add Vehicle </button>
          )}
          

        </div>

        <div className="p-2">
        
          {/* Table */}
          <table className="ppa-table w-full mb-10 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Vehicle Name</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Vehicle Plate</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">No of Usage</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
            {vehicle && vehicle?.length > 0 ? (
              vehicle.map((veh, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 text-center text-base">{veh.vehicle_name}</td>
                  <td className="px-3 py-2 text-center text-base">{veh.vehicle_plate}</td>
                  <td className="px-3 py-2 text-center text-base">{veh.vehicle_usage}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center">
                      {/* Delete */}
                      <button
                        onClick={() => handleRemovalConfirmation(veh.vehicle_id)}
                        className="px-2 py-2 rounded-md bg-red-500"
                      >
                        <FontAwesomeIcon className="text-white" icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ):(
              <tr>
                <td colSpan={4} className="px-2 py-2 text-center text-sm text-gray-600">
                  No records found.
                </td>
              </tr>
            )}
            </tbody>
          </table>

        </div>

      </div>

      {/* Add Vehicle */}
      {addVehicle && (
        <div className="font-roboto ppa-form-box mt-4">
          <div className="ppa-form-header text-base flex justify-between items-center">

            <span>Add Vehicle</span>

            <button 
              type="submit"
              form="submitVehicle"
              className={`ml-3 py-1.5 px-3 text-base ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
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

          <div className="p-2 pt-4 pb-4">

            <form id="submitVehicle" onSubmit={GetVehicleDetails}>

              {/* Form */}
              <div className="grid grid-cols-2">

                {/* 1st Column */}
                <div className="col-span-1">

                  {/* Vehicle Name */}
                  <div className="flex items-center">
                    <div className="w-40">
                      <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black"> Vehicle Name: </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="vehicle_name"
                        id="vehicle_name"
                        value={vehicleName}
                        onChange={ev => setVehicleName(ev.target.value)}
                        className="block w-full ppa-form"
                      />
                    </div>
                  </div>

                </div>

                {/* 2nd Column */}
                <div className="col-span-1">

                  {/* Vehicle Plate */}
                  <div className="flex items-center">
                    <div className="w-40">
                      <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black"> Vehicle Plate: </label> 
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="vehicle_plate"
                        id="vehicle_plate"
                        autoComplete="rep_property_no"
                        value={vehiclePlate}
                        onChange={ev => setVehiclePlate(ev.target.value)}
                        className="block w-full ppa-form"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </form>

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

              {/* Warning */}
              {popupContent == "warning" && (
                <div class="f-modal-icon f-modal-warning scaleWarning">
                  <span class="f-modal-body pulseWarningIns"></span>
                  <span class="f-modal-dot pulseWarningIns"></span>
                </div>
              )}

              {/* Success */}
              {popupContent == 'success' && (
                <div class="f-modal-icon f-modal-success animate">
                  <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                  <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                </div>
              )}
              
            </div>
            {/* Popup Message */}
            <p className="text-lg text-center"> {popupMessage} </p>
            {/* Buttons */}
            <div className="flex justify-center mt-4">

              {(popupContent == 'warning') && (
              <>
                {/* Submit */}
                <button 
                  type="submit"
                  onClick={removeVehicleDet}
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
  );
}