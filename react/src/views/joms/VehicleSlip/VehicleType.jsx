import React, { useEffect, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import submitAnimation from '/default/ring-loading.gif';
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCheckToSlot, faXmark, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import Popup from "../../../components/Popup";
import Restrict from "../../../components/Restrict";

export default function AddVehicleType(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

  const [loading, setLoading] = useState(true);
  const [addVehicle, setAddVehicle] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Variable 
  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [updateVehicleName, setUpdateVehicleName] = useState('');
  const [updateVehiclePlate, setUpdateVehiclePlate] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

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

  // Output
  const [vehicle, getVehicle] = useState([]);

  // Get Vehicle Data
  const fectVehicleData = () => {
    axiosClient
    .get('/showvehdet')
    .then((response) => {
      const VehicleData = response.data;

      getVehicle(VehicleData);

    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(()=>{
    if(currentUserId){
      fectVehicleData();
    }
  },[currentUserId]);

  // Default
  useEffect(() => {
    // Only update if we are editing the current vehicle
    if (editingId) {
      const selectedVehicle = vehicle.find(veh => veh.vehicle_id === editingId);
      if (selectedVehicle) {
        setUpdateVehicleName(selectedVehicle.vehicle_name ?? "");
        setUpdateVehiclePlate(selectedVehicle.vehicle_plate ?? "");
      }
    }
  }, [editingId, vehicle])

  // Edit Vehicle Details
  function handleEditClick(id){
    setEditingId(id);
  }

  // Save Update Vehicle Details
  function handleUpdateVehicle(id){
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      vehicle_name: updateVehicleName,
      vehicle_plate: updateVehiclePlate,
    }

    axiosClient
    .put(`/editvehicle/${id}`, data)
    .then(() => {
      setEditingId(null);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The vehicle has been updated.</p>
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

  // Add Vehicle details
  function GetVehicleDetails(event){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      vehicle_name: vehicleName,
      vehicle_plate: vehiclePlate,
      availability: 0,
    }

    axiosClient
    .post('/submitvehtype', data)
    .then(() => {
      setAddVehicle(false);
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

  // Popup Remove Vehicle Detail 
  function handleRemovalConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('removeVehicle');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want remove? It cannot be undone.</p>
      </div>
    );
  }

  // Remove Vehicle Detail Function
  function removeVehicleDet(){
    setSubmitLoading(true);

    axiosClient
    .delete(`/deletevehdet/${selectedId}`,{
      data: {
        authority: currentUserName.name,
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

  // Popup on Available Vehicle
  function handleSetAvailable(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availableVehicle');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">This vehicle is available?</p>
      </div>
    );
  }

  // Available Vehicle Function
  function vacantVehicle(){
    setSubmitLoading(true);

    axiosClient
    .put(`/availvehicle/${selectedId}`,{
      authority: currentUserName.name,
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The vehicle is available</p>
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
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    setLoading(true);
    setVehicleName('');
    setVehiclePlate('');
    fectVehicleData();
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const GSO = codes.includes("GSO");
  const SuperAdmin = codes.includes("HACK");
  const access = GSO || SuperAdmin;

  return(
    <PageComponent title="Vehicle Information">
      {/* Loading */}
      {loading && (
        <div className="pre-loading-screen z-50 relative flex justify-center items-center">
          <img className="mx-auto h-32 w-auto absolute" src={loadingAnimation} alt="Your Company" />
          <img className="mx-auto h-16 w-auto absolute ppg-logo-img" src={ppalogo} alt="Your Company" />
        </div>
      )}

      {access ? (
      <>
        {addVehicle && (
        <>
          <div className="ppa-form-header text-base flex justify-between items-center">
            <div>Add Vehicle</div>
            <div className="flex space-x-4">
              <FontAwesomeIcon onClick={() => {
                setAddVehicle(false);
                setVehicleName('');
                setVehiclePlate('');
              }} className="icon-delete" title="Close" icon={faXmark} />
            </div>
          </div>
          <div className="p-2 ppa-form-box mb-5">
            <form id="submitVehicle" onSubmit={GetVehicleDetails}>
              {/* Form */}
              <div className="flex items-center">

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

                  {/* Button */}
                  <button 
                    type="submit"
                    form="submitVehicle"
                    className={`ml-3 py-1.5 px-3 text-base ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
            </form>
          </div>
        </>
        )}

        {/* Header */}
        <div className="ppa-form-header text-base flex justify-between items-center">
          <div>Vehicle List</div>
          <div className="flex space-x-4">
            {!addVehicle && <FontAwesomeIcon onClick={() => setAddVehicle(true)} className="icon-delete" title="Add Vehicle" icon={faPlus} />}
          </div>
        </div>
        <div className="p-2 ppa-form-box">
          {/* Table */}
          <table className="ppa-table w-full mb-10 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Vehicle Name</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Vehicle Plate</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">No of Usage</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Status</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-1 py-3 text-base text-center border-0 border-custom">
                  <div className="flex justify-center items-center">
                    <span className="loading-table">Fetching Data</span>
                  </div>
                </td>
              </tr>
            ):(
              vehicle && vehicle?.length > 0 ? (
                vehicle.map((veh, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-center text-base align-middle">
                      {editingId === veh.vehicle_id ? (
                        <div className="flex justify-center items-center">
                          <input
                            type="text"
                            name="vehicle_name"
                            id="vehicle_name"
                            value={updateVehicleName}
                            onChange={ev => setUpdateVehicleName(ev.target.value)}
                            className="ppa-form w-3/4 text-center"
                          />
                        </div>
                      ) : (
                        veh.vehicle_name
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-base align-middle">
                      {editingId === veh.vehicle_id ? (
                        <div className="flex justify-center items-center">
                          <input
                            type="text"
                            name="vehicle_name"
                            id="vehicle_name"
                            value={updateVehiclePlate}
                            onChange={ev => setUpdateVehiclePlate(ev.target.value)}
                            className="ppa-form w-3/4 text-center"
                          />
                        </div>
                      ) : (
                        veh.vehicle_plate
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-base">{veh.vehicle_usage}</td>
                    <td className="px-3 py-2 text-center text-base">
                      <strong>{veh.vehicle_status == 0 ? ("Available"):("On Travel")}</strong>
                    </td>
                    <td className="px-3 py-2">
                    <div className="flex justify-center items-center space-x-4">
                      {editingId == veh.vehicle_id ? (
                        <>
                          {/* Delete */}
                          <FontAwesomeIcon
                              onClick={() => handleUpdateVehicle(veh.vehicle_id)}
                              className="icon-approve"
                              title="Remove Vehicle"
                              icon={faCheck}
                            />
                            {/* Close */}
                            <FontAwesomeIcon
                              onClick={() => setEditingId(null)}
                              className="icon-close"
                              title="Close"
                              icon={faXmark}
                            />
                        </>
                      ):(
                        veh.vehicle_status === 0 ? (
                          <>
                            {/* Delete */}
                            <FontAwesomeIcon
                              onClick={() => editingId === null && handleRemovalConfirmation(veh.vehicle_id)}
                              className={`icon-remove ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                              title="Remove Vehicle"
                              icon={faTrash}
                            />
                            {/* Edit Vehicle */}
                            <FontAwesomeIcon
                              onClick={() => editingId === null && handleEditClick(veh.vehicle_id)}
                              className={`icon-edit ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                              title="Edit Vehicle"
                              icon={faPenToSquare}
                            />
                          </>
                        ):(
                          <>
                            {/* Available */}
                            <FontAwesomeIcon
                              onClick={() => editingId === null && handleSetAvailable(veh.vehicle_id)}
                              className={`icon-avail ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                              title="Available Vehicle"
                              icon={faCheckToSlot}
                            />
                          </>
                        )
                      )}
                    </div>
                  </td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={5} className="px-2 py-2 text-center text-sm text-gray-600">
                    No records found.
                  </td>
                </tr>
              )
            )}
            </tbody>
          </table>
        </div>
      </>
      ):(
        <Restrict/>
      )}

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          justClose={justClose}
          closePopup={closePopup}
          removeVehicleDet={removeVehicleDet}
          vacantVehicle={vacantVehicle}
        />
      )}
      
    </PageComponent>
  );
}