import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import submitAnimation from '/default/ring-loading.gif';
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCheckToSlot, faXmark, faPenToSquare, faCheck, faUserAltSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";

export default function AddVehicleType(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  const [addVehicle, setAddVehicle] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Variable 
  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [updateVehicleName, setUpdateVehicleName] = useState('');
  const [updateVehiclePlate, setUpdateVehiclePlate] = useState('');

  // Output
  const [vehicle, getVehicle] = useState([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Disable the Scroll on Popup
  useEffect(() => {
    // Define the class to be added/removed
    const popupClass = 'popup-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } else {
      removePopupClass();
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

  // Add Vehicle details
  function GetVehicleDetails(event){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      authority: currentUserName.name,
      vehicle_name: vehicleName,
      vehicle_plate: vehiclePlate,
      status: 0,
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
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

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
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Set Vehicle to Not Available
  function handleNotAvailableConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('NotavailVehicle');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to set this vehicle as not available?</p>
      </div>
    );
  }

  // Set Vehicle to Not Available
  function NotAvailVehicle(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/notavailvehicle/${id}`,{
      authority: currentUserName.name,
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The vehicle is set to not available</p>
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

  // Popup on Available Vehicle
  function handleSetAvailable(id, status){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availableVehicle');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">This vehicle is {status === 1 ? "arrived?" : "available?"}</p>
      </div>
    );
  }

  // Available Vehicle Function
  function vacantVehicle(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/availvehicle/${id}`,{
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
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
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
        <p className="popup-message">You want to remove this vehicle from the list?</p>
      </div>
    );
  }

  // Remove Vehicle Detail Function
  function removeVehicleDet(id){
    setSubmitLoading(true);

    axiosClient
    .delete(`/deletevehdet/${id}`,{
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
  const PersonnelAuthority = codes.includes("AU");
  const Access = GSO || SuperAdmin || PersonnelAuthority ;

  return(
    <PageComponent title="Vehicle Information">
      {Access ? (
      <>
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
                      <td className="px-3 py-2 w-1/4 text-center text-base align-middle">
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
                        <strong>{veh.vehicle_status == 3 ? (
                          <p className="text-red-700">Not Available</p>
                        ):veh.vehicle_status == 1 ? (
                          <p className="text-red-700">On Travel</p>
                        ):(
                          <p className="text-black">Available</p>
                        )}</strong>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-center items-center space-x-4">
                          {editingId == veh.vehicle_id ? (
                          <>
                            {/* Save */}
                            <FontAwesomeIcon
                              onClick={() => handleUpdateVehicle(veh.vehicle_id)}
                              className="icon-approve"
                              title="Save Vehicle"
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
                            veh.vehicle_status == 3 ? (
                            <>
                              {/* Set to Available */}
                              <FontAwesomeIcon 
                                onClick={() => editingId === null && handleSetAvailable(veh.vehicle_id, veh.vehicle_status)} 
                                className={`icon-edit ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                                title="Set Vehicle to Available" 
                                icon={faUser} 
                              />
                            </>
                            ):veh.vehicle_status == 1 ? (
                            <>
                              {/* Set to Available */}
                              <FontAwesomeIcon 
                                onClick={() => editingId === null && handleSetAvailable(veh.vehicle_id, veh.vehicle_status)} 
                                className={`icon-edit ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                                title="Vehicle Arrived" 
                                icon={faUser} 
                              />
                            </>
                            ):(
                            <>
                              {/* Edit Vehicle */}
                              <FontAwesomeIcon
                                onClick={() => editingId === null && handleEditClick(veh.vehicle_id)}
                                className={`icon-edit ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                                title="Edit Vehicle"
                                icon={faPenToSquare}
                              />

                              {/* Set to Not Available */}
                              <FontAwesomeIcon 
                                onClick={() => editingId === null && handleNotAvailableConfirmation(veh.vehicle_id)} 
                                className={`icon-edit ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                                title="Set Vehicle to Not Available" 
                                icon={faUserAltSlash} 
                              />

                              {/* Delete */}
                              <FontAwesomeIcon
                                onClick={() => editingId === null && handleRemovalConfirmation(veh.vehicle_id)}
                                className={`icon-remove ${editingId !== null ? 'pointer-events-none opacity-50' : ''}`}
                                title="Remove Vehicle"
                                icon={faTrash}
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

        {addVehicle && (
        <>
          <div className="ppa-form-header text-base flex justify-between items-center mt-6">
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
      </>
      ):(
        <Restrict/>
      )}

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          justClose={justClose}
          closePopup={closePopup}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          vehicleId={selectedId}
          NotAvailVehicle={NotAvailVehicle}
          vacantVehicle={vacantVehicle}
          removeVehicleDet={removeVehicleDet}
          
        />
      )}

    </PageComponent>
  )
}