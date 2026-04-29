import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useUserStateContext } from "../context/ContextProvider";
import loading_table from "/default/ring-loading.gif";
import axiosClient from "../axios";
import submitAnimation from '/default/ring-loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserAltSlash, faUser, faPenToSquare, faCheck, faXmark, faLink, faHome } from '@fortawesome/free-solid-svg-icons';
import Popup from "../components/Popup";
import Restrict from "../components/Restrict";
import { Link } from "react-router-dom";

export default function TravelDetails(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Loading
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [loadingTracking, setLoadingTracking] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Function
  const [pageRestrict, setPageRestrict] = useState(true);
  const [buttonHide, setButtonHide] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [personnelCategory, setPersonnelCategory] = useState("");
  const [travelID, setTravelID] = useState(null);

  const [activeTab, setActiveTab] = useState("Driver");

  const changeTab = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

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
  }, [showPopup]);

  // --- Get Driver Personnel --- //
  const [driverPersonnel, setDriverPersonnel] = useState([]);

  const fetchPersonnel = async () => {
    try {
      const response = await axiosClient.get(`/getdriverspersonnel`);
      const dataPersonnel = response.data;

      // console.log(dataPersonnel);
      setDriverPersonnel(dataPersonnel);

      if(accessOnly){
        setPageRestrict(true);
      }else{
        setPageRestrict(false);
      }

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingDriver(false);
    }
  }

  // --- Get Driver Details --- //
  const [personnelList, setPersonnelList] = useState([]);

  const fetchDriverDet = async () => {
    try {
      const response = await axiosClient.get(`/displaydrivers`);
      const dataDriverDet = response.data;

      // console.log(dataDriverDet);
      setPersonnelList(dataDriverDet);

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingDriver(false);
    }
  }

  // --- Get Assign Personnel --- //
  const [assignPersonnel, setAssignPersonnel] = useState([]);

  const fetchassignPersonnel = async() => {
    try {
      const response = await axiosClient.get(`/displayassignpersonnel`);
      const dataPersonnel = response.data;

      //console.log(dataPersonnel);
      setAssignPersonnel(dataPersonnel);

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingPersonnel(false);
    }
  } 

  // --- Assign Personnel --- //
  const [personnel, setPersonnel] = useState([]);

  const fetchStaffPersonnel = async () => {
    try {
      const response = await axiosClient.get(`/getassignpersonnel`);
      const dataPersonnel = response.data;

      // console.log(dataPersonnel);
      setPersonnel(dataPersonnel);

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingPersonnel(false);
    }
  }

  // --- Get Vehicle Details --- //
  const [vehicleDetails, setVehicleDetails] = useState([]);

  const fetchVehicleDetails = async() => {
    try {
      const response = await axiosClient.get(`/showvehdet`);
      const dataVehiceDet = response.data;

      // console.log(dataVehiceDet);
      setVehicleDetails(dataVehiceDet);

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingVehicle(false);
    }
  }

  // --- Get Tracking Records --- //
  const [trackingDetailsToday, setTrackingDetailsToday] = useState([]);
  const [trackingDetailsLater, setTrackingDetailsLater] = useState([]);

  const fetchTrackingRecords = async() => {
    try {
      const response = await axiosClient.get(`/checktravelactivity`);
      const dataTravelDet = response.data;

      // console.log(dataTravelDet.today);
      setTrackingDetailsToday(dataTravelDet.today);
      setTrackingDetailsLater(dataTravelDet.later)

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoadingTracking(false);
    }
  }

  // Check if there is on travel schedule
  function checkTravelSchedule(){
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

  useEffect(() => { 
    if(currentUserId){
      fetchTrackingRecords();
      fetchPersonnel();
      fetchDriverDet();
      fetchassignPersonnel();
      fetchStaffPersonnel();
      fetchVehicleDetails();
      checkTravelSchedule();
    }
  }, [currentUserId]);

  // --- For Driver Function --- //

  // Add Driver Personnel
  const [selectDriverPersonnel, setSelectDriverPersonnel] = useState({ id: '', name: '' });

  function submitPersonnel(e){
    e.preventDefault();
    setSubmitLoading(true);

    const data = {
      personnel_id: selectDriverPersonnel.id,
      personnel_name: selectDriverPersonnel.name,
      assignment: "Driver/Mechanic",
      status: 0
    }

    // console.log(data);

    axiosClient
    .post('/sumbmitdrivers', data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Assignment Complete!</p>
          <p className="popup-message">You assign {selectDriverPersonnel.name} as a Driver/Mechanic</p>
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

  // Unavailable Driver Personnel
  const [selectedId, setSelectedId] = useState(null);

  function handleNotAvailableDriverConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('NotavailDriver');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to set this driver as not available?</p>
      </div>
    );
  }

  // Set to Not Available Function
  function NotAvailDriver(id){
    setSubmitLoading(true);
    setButtonHide(true);

    axiosClient
    .put(`/notavaildriver/${id}`, {
      data: {
        authority: currentUserName.name
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Successful</p>
          <p className="popup-message">Driver marked as not available.</p>
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

  // Available Driver Personnel
  function handleAvailableDriverConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availDriver');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to set this driver as available?</p>
      </div>
    );
  }

  function AvailDriver(id){
    setSubmitLoading(true);
    setButtonHide(true);

    axiosClient
    .put(`/availdriver/${id}`, {
      data: {
        authority: currentUserName.name
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Successful</p>
          <p className="popup-message">Driver marked as available.</p>
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

  // Remove Personnel (Driver)
  function handleRemovalConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('removePersonnel');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">You want to remove this personnel from the list?</p>
      </div>
    );
  }

  // Delete Personnel Function
  function RemoveDriver(id){
    setSubmitLoading(true);
    setButtonHide(true);

    axiosClient
    .delete(`/removepersonnel/${id}`, {
      data: {
        authority: currentUserName.name
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Remove Successful</p>
          <p className="popup-message">The assign user has been remove on the database</p>
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

  // --- Personnel Function --- //
  const [selectPersonnel, setSelectPersonnel] = useState({ id: '', name: '' });
  function submitAssignPersonnel(e){
    e.preventDefault();
    setSubmitLoading(true);

    const data = {
      personnel_id: selectPersonnel.id,
      personnel_name: selectPersonnel.name,
      assignment: personnelCategory,
      status: 0
    }

    axiosClient
    .post('/sumbmitassignpersonnel', data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Assignment Complete!</p>
          <p className="popup-message">You assign {selectPersonnel.name} as a {personnelCategory}</p>
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

  // Remove Assign Personnel
  function handlePersonnelRemovalConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('removeAssig');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">You want to remove this personnel from the list?</p>
      </div>
    );
  }

  // Delete Assign Personnel
  function RemoveAssign(id){
    setSubmitLoading(true);
    setButtonHide(true);

    axiosClient
    .delete(`/removeassignpersonnel/${id}`, {
      data: {
        authority: currentUserName.name
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Remove Successful</p>
          <p className="popup-message">The assign user has been remove on the database</p>
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

  // Add Vehicle on the List
  const [vehicleName, setVehicleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [updateVehicleName, setUpdateVehicleName] = useState('');
  const [updateVehiclePlate, setUpdateVehiclePlate] = useState('');

  // Default
  useEffect(() => {
    // Only update if we are editing the current vehicle
    if (enableEdit) {
      const selectedVehicle = vehicleDetails.find(veh => veh.vehicle_id === enableEdit);
      if (selectedVehicle) {
        setUpdateVehicleName(selectedVehicle.vehicle_name ?? "");
        setUpdateVehiclePlate(selectedVehicle.vehicle_plate ?? "");
      }
    }
  }, [enableEdit, vehicleDetails])

  function submitVehicle(e){
    e.preventDefault();
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

  // Not Available Vehicle
  function handleNotAvailableVehicleConfirmation(id){
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

  function updateAvailVehicle(id){
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

  // Remove Vehicle
  function handleRemovalVehicleConfirmation(id){
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

  // Edit Vehicle
  function handleEditClick(id){
    setEnableEdit(id);
  }

  function handleUpdateVehicle(id){
    const data = {
      authority: currentUserName.name,
      vehicle_name: updateVehicleName,
      vehicle_plate: updateVehiclePlate,
    }

    axiosClient
    .put(`/editvehicle/${id}`, data)
    .then((response) => {
      const responseData = response.data.message;

      if(responseData === 'No Changes'){
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success!</p>
            <p className="popup-message">No changes have been saved.</p>
          </div>
        )
      }else{
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success!</p>
            <p className="popup-message">The vehicle has been updated.</p>
          </div>
        );
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

  // Set to Vehicle to Available
  function handleAvailableVehicleConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availableVehicle');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to set this vehicle to available?</p>
      </div>
    );
  }

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

  // Arrive Travel
  function handleArriveTravel(id){
    setTravelID(id);
    setShowPopup(true);
    setPopupContent('arriveTravel');
    setPopupMessage(
      <div>
        <p className="popup-title">To be confirm</p>
        <p className="popup-message">Are the driver and vehicle arriving at the port area?</p>
      </div>
    );
  }

  function SubmitAvailability(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/arriveTravel/${id}`)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success!</p>
          <p className="popup-message">The driver and vehicle is available</p>
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

  //Close Popup on Success
  const closePopup = () => {
    fetchPersonnel();
    fetchDriverDet();
    fetchassignPersonnel();
    fetchStaffPersonnel();
    fetchVehicleDetails();
    fetchTrackingRecords();
    setShowPopup(false);
    setLoadingDriver(true);
    setLoadingPersonnel(true);
    setLoadingVehicle(true);
    setSubmitLoading(false);
    setLoadingTracking(true);
    setButtonHide(false);
    setEnableEdit(false);
    setSelectDriverPersonnel({ id: '', name: '' });
    setSelectPersonnel({ id: '', name: '' });
    setPersonnelCategory('');
    setVehicleName('');
    setVehiclePlate('');
    setUpdateVehicleName('');
    setUpdateVehiclePlate('');
  }

  //Close Popup on Error
  const justclose = () => {
    setShowPopup(false);
    setButtonHide(false);
  }

  // Restrictions
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["HACK", "PM", "AM", "GSO", "AP", "AUS", "AUV" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return(
    !pageRestrict ? (<Restrict />):(
      <PageComponent>
        {/* Travel and Upcoming Travel */}
        <div className="ppa-widget mt-8 px-4 pb-6">
          {/* Header */}
          <div className="joms-user-info-header text-left"> 
            On-Travel and Upcoming Travel
          </div>

          {/* For the Ontravel */}
          <div className="form-title-header">
            On-Travel Details
          </div>
          <table className="ppa-table w-full mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2 w-[4%] text-left ppa-table-header">No</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Requestor</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Purpose</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Destination</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Driver</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Vehicle</th>
                <th className="px-4 py-2 w-[16%] text-center ppa-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingTracking ? (
                Array.from({ length: 1 }).map((_, index) => (
                  <tr key={index}>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                  </tr>
                ))
              ):(
                trackingDetailsToday && trackingDetailsToday.length > 0 ? (
                  trackingDetailsToday.map(getTrackingToday => (
                    <tr key={getTrackingToday.id}>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.id}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.user_name}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.purpose}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.place_visited}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.driver}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingToday.vehicle_type}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">
                        <div className="flex justify-center space-x-3">
                          {/* Link */}
                          <Link
                            to={`/joms/vehicle/form/${getTrackingToday.id}`}
                            className="icon-avail"
                            title="To go Vehicle Slip"
                          >
                            <FontAwesomeIcon icon={faLink} />
                          </Link>

                          {/* Hoome */}
                          <FontAwesomeIcon
                            onClick={() => handleArriveTravel(getTrackingToday.id)}
                            className="icon-avail"
                            title="Arrive"
                            icon={faHome}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={7} className="px-4 py-2 text-center ppa-table-body">
                      No Travel Today
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* For the Ontravel */}
          <div className="form-title-header mt-6">
            Upcoming Travel Details
          </div>
          <table className="ppa-table w-full mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2 w-[4%] text-left ppa-table-header">No</th>
                <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Requestor</th>
                <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Purpose</th>
                <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Destination</th>
                <th className="px-4 py-2 w-[12%] text-left ppa-table-header">Driver</th>
                <th className="px-4 py-2 w-[16%] text-left ppa-table-header">Vehicle</th>
                <th className="px-4 py-2 w-[13%] text-left ppa-table-header">Date of Travel</th>
                <th className="px-4 py-2 w-[10%] text-center ppa-table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingTracking ? (
                Array.from({ length: 1 }).map((_, index) => (
                  <tr key={index}>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                    <td className="py-2 ppa-table-body">
                      <div className="skeleton h-6"></div>
                    </td>
                  </tr>
                ))
              ):(
                trackingDetailsLater && trackingDetailsLater.length > 0 ? (
                  trackingDetailsLater.map(getTrackingUpcoming => (
                    <tr key={getTrackingUpcoming.id}>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.id}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.user_name}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.purpose}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.place_visited}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.driver}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getTrackingUpcoming.vehicle_type}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{formatDate(getTrackingUpcoming.date_arrival)}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">
                        <div className="flex justify-center space-x-3">
                          {/* Link */}
                          <Link
                            to={`/joms/vehicle/form/${getTrackingUpcoming.id}`}
                            className="icon-avail"
                            title="To go Vehicle Slip"
                          >
                            <FontAwesomeIcon icon={faLink} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={8} className="px-4 py-2 text-center ppa-table-body">
                      No Upcoming Travels
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Vehicle and Driver's List */}
        <div className="ppa-widget mt-16">
          {/* Tabs */}
          <div className="flex">
            {["Driver", "Vehicle", "Personnel"].map((tab) => (
              <button key={tab} onClick={() => changeTab(tab)}
                className={`transition-all tab-btn ${
                  activeTab === tab
                    ? "tab-active"
                    : "not-active"
                }`}
              >
                {tab === "Driver"
                  ? "Driver"
                  : tab === "Vehicle"
                  ? "Vehicle"
                  : "Personnel"}
              </button>
            ))}
          </div>

          {/* Driver Tab */}
          {activeTab === "Driver" && ( 
            <div className="travel-container mt-10">
              {/* Details */}
              <div className="border-r border-gray-300">
                <div className="form-title-header px-4">
                  Driver Details
                </div>

                {/* Table */}
                <div className="ppa-div-table px-4 pb-8 overflow-x-auto md:overflow-x-visible">
                  <table className="ppa-table w-full">
                    {/* Header */}
                    <thead>
                      <tr>
                        <th className="px-4 py-2 w-[25%] text-left ppa-table-header">Name</th>
                        <th className="px-4 py-2 w-[20%] text-center ppa-table-header">No of Assigments</th>
                        <th className="px-4 py-2 w-[27%] text-center ppa-table-header">Status</th>
                        <th className="px-4 py-2 w-[28%] text-center ppa-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                    {loadingDriver ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                        </tr>
                      ))
                    ):(
                      personnelList && personnelList.length > 0 ? (
                        personnelList.map(getDriverData => (
                          <tr key={getDriverData.id}>
                            <td className="px-4 py-2 text-left ppa-table-body">{getDriverData.personnel_name}</td>
                            <td className="px-4 py-2 text-center font-bold ppa-table-body">{getDriverData.NoOfAssigment}</td>
                            <td className="px-4 py-2 text-center font-bold ppa-table-body">{getDriverData.status}</td>
                            <td className="px-4 py-2 text-center ppa-table-body">
                              <div className="flex justify-center space-x-3">
                                {/* Available */}
                                {getDriverData.status === "Available" && (
                                <>
                                  <FontAwesomeIcon onClick={() => handleNotAvailableDriverConfirmation(getDriverData.personnel_id)} className="icon-avail" title="Set Personnel to Not Available" icon={faUserAltSlash} />
                                  <FontAwesomeIcon onClick={() => handleRemovalConfirmation(getDriverData.personnel_id)} className="icon-remove" title="Removel Personnel" icon={faTrash} />
                                </>
                                )}
                                {/* Not Available */}
                                {getDriverData.status === "Not Available" && (
                                <>
                                  <FontAwesomeIcon onClick={() => handleAvailableDriverConfirmation(getDriverData.personnel_id)} className="icon-avail" title="Set Personnel to Available" icon={faUser} />
                                </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ):(
                      <tr>
                        <td colSpan={4} className="px-2 py-5 text-center ppa-table-body">
                          <div className="flex justify-center items-center w-full font-bold">
                            No records found
                          </div>
                        </td>
                      </tr>
                      )
                    )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Driver */}
              <div className="pb-8">
                {loadingDriver ? (
                  <div className="flex justify-center items-center">
                    <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                    <span className="loading-table">Loading Form</span>
                  </div>
                ):(
                <>
                  <div className="form-title-header px-4">
                    Add Driver
                  </div>
                  <div className="px-4 mt-5">
                    <form onSubmit={submitPersonnel}>
                      {/* Select Personnnel */}
                      <div className="flex items-center">
                        <div className="w-48 form-title">
                          <label htmlFor="rep_date"> 
                            Select Driver
                          </label> 
                        </div>
                        <div className="w-full">
                          <select 
                            name="personnel" 
                            id="personnel" 
                            value={selectDriverPersonnel.id}
                            onChange={ev => {
                              const selectedId = parseInt(ev.target.value);
                              const selectedPersonnel = driverPersonnel.find(
                                staff => staff.id === selectedId
                              );

                              setSelectDriverPersonnel(
                                selectedPersonnel
                                  ? { id: selectedPersonnel.id, name: selectedPersonnel.name }
                                  : { id: '', name: '' }
                              );
                            }}
                            className="block w-full focus:ring-0 ppa-form-field h-[39px]"
                          >
                            <option value="" disabled> -- </option>
                            {driverPersonnel.map(staff => (
                              <option key={staff.id} value={staff.id}>
                                {staff.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-4 flex justify-center md:justify-start">
                        {selectDriverPersonnel && !buttonHide && selectDriverPersonnel.id && (
                          <button 
                            type="submit"
                            className={`w-full md:w-auto py-2 px-3 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                            disabled={submitLoading}
                          >
                          {submitLoading ? (
                            <div className="flex justify-center">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-2">Loading</span>
                            </div>
                          ):(
                          'Submit'
                          )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === "Vehicle" && ( 
            <div className="travel-container mt-10">
              {/* Details */}
              <div className="border-r border-gray-300">
                <div className="form-title-header px-4">
                  Vehicle Details
                </div>

                {/* Table */}
                <div className="ppa-div-table px-4 pb-8 overflow-x-auto md:overflow-x-visible">
                  <table className="ppa-table w-full">
                    {/* Header */}
                    <thead>
                      <tr>
                        <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Vehicle Model</th>
                        <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Plate Number</th>
                        <th className="px-4 py-2 w-[20%] text-center ppa-table-header">No of Assigments</th>
                        <th className="px-4 py-2 w-[20%] text-center ppa-table-header">Status</th>
                        <th className="px-4 py-2 w-[20%] text-center ppa-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                    {loadingVehicle ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                        </tr>
                      ))
                    ):(
                      vehicleDetails && vehicleDetails.length > 0 ? (
                        vehicleDetails.map(getVehicleData => (
                          <tr key={getVehicleData.vehicle_id}>
                            <td className="px-4 py-2 text-left ppa-table-body">
                              {enableEdit === getVehicleData.vehicle_id ? (
                                <div className="flex">
                                  <input
                                    type="text"
                                    name="vehicle_name"
                                    id="vehicle_name"
                                    value={updateVehicleName}
                                    onChange={ev => setUpdateVehicleName(ev.target.value)}
                                    className="ppa-form-field-edit w-full"
                                  />
                                </div>
                              ):(
                                getVehicleData.vehicle_name
                              )}
                            </td>
                            <td className="px-4 py-2 text-left ppa-table-body">
                              {enableEdit === getVehicleData.vehicle_id ? (
                                <div className="flex">
                                  <input
                                    type="text"
                                    name="vehicle_name"
                                    id="vehicle_name"
                                    value={updateVehiclePlate}
                                    onChange={ev => setUpdateVehiclePlate(ev.target.value)}
                                    className="ppa-form-field-edit w-full"
                                  />
                                </div>
                              ):(
                                getVehicleData.vehicle_plate
                              )}
                            </td>
                            <td className="px-4 py-2 text-center font-bold ppa-table-body">{getVehicleData.vehicle_usage}</td>
                            <td className="px-4 py-2 text-center font-bold ppa-table-body">{getVehicleData.vehicle_status}</td>
                            <td className="px-4 py-2 text-center ppa-table-body">
                              <div className="flex justify-center space-x-3">
                                {enableEdit === getVehicleData.vehicle_id ? (
                                  <>
                                    {/* Save */}
                                    <FontAwesomeIcon
                                      onClick={() => handleUpdateVehicle(getVehicleData.vehicle_id)}
                                      className="icon-avail"
                                      title="Save Vehicle"
                                      icon={faCheck}
                                    />

                                    {/* Close */}
                                    <FontAwesomeIcon
                                      onClick={() => setEnableEdit(null)}
                                      className="icon-remove"
                                      title="Close"
                                      icon={faXmark}
                                    />
                                  </>
                                ):(
                                <>
                                  {/* Available */}
                                  {getVehicleData.vehicle_status === "Available" && (
                                  <>
                                    <FontAwesomeIcon onClick={() => handleNotAvailableVehicleConfirmation(getVehicleData.vehicle_id)} className="icon-avail" title="Set Vehicle to Not Available" icon={faUserAltSlash} />
                                    <FontAwesomeIcon onClick={() => handleEditClick(getVehicleData.vehicle_id)} className="icon-avail" title="Edit Vehicle" icon={faPenToSquare} />
                                    <FontAwesomeIcon onClick={() => handleRemovalVehicleConfirmation(getVehicleData.vehicle_id)} className="icon-remove" title="Removel Vehicle" icon={faTrash} />
                                  </>
                                  )}
                                  {/* Not Available */}
                                  {getVehicleData.vehicle_status === "Not Available" && (
                                  <>
                                    <FontAwesomeIcon onClick={() => handleAvailableVehicleConfirmation(getVehicleData.vehicle_id)} className="icon-avail" title="Set Personnel to Available" icon={faUser} />
                                  </>
                                  )}
                                </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ):(
                      <tr>
                        <td colSpan={5} className="px-2 py-5 text-center ppa-table-body">
                          <div className="flex justify-center items-center w-full font-bold">
                            No records found
                          </div>
                        </td>
                      </tr>
                      )
                    )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Vehicle */}
              <div className="pb-8">
              {loadingVehicle ? (
                <div className="flex justify-center items-center">
                  <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                  <span className="loading-table">Loading Form</span>
                </div>
              ):(
              <>
                <div className="form-title-header px-4">
                  Add Vehicle
                </div>
                <div className="px-4 mt-5">
                  <form onSubmit={submitVehicle}>
                    {/* Vehicle Name */}
                    <div className="flex items-center">
                      <div className="w-48 form-title">
                        <label htmlFor="rep_date"> 
                          Vehicle Name
                        </label> 
                      </div>
                      <div className="w-full">
                        <input
                          type="text"
                          name="vehicle_name"
                          id="vehicle_name"
                          value={vehicleName}
                          onChange={ev => setVehicleName(ev.target.value)}
                          className="block w-full focus:ring-0 ppa-form-field h-[39px]"
                          disabled={enableEdit}
                        />
                      </div>
                    </div>

                    {/* Vehicle Name */}
                    <div className="flex items-center mt-2">
                      <div className="w-48 form-title">
                        <label htmlFor="rep_date"> 
                          Vehicle Plate
                        </label> 
                      </div>
                      <div className="w-full">
                        <input
                          type="text"
                          name="vehicle_plate"
                          id="vehicle_plate"
                          autoComplete="rep_property_no"
                          value={vehiclePlate}
                          onChange={ev => setVehiclePlate(ev.target.value)}
                          className="block w-full focus:ring-0 ppa-form-field"
                          disabled={enableEdit}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 flex justify-center md:justify-start">
                      {vehicleName && vehiclePlate && !buttonHide && (
                        <button 
                          type="submit"
                          className={`w-full md:w-auto py-2 px-3 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                          disabled={submitLoading}
                        >
                        {submitLoading ? (
                          <div className="flex justify-center">
                            <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                            <span className="ml-2">Loading</span>
                          </div>
                        ):(
                        'Submit'
                        )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </>
              )}
              </div>
            </div>
          )}

          {/* Personnel Tab */}
          {activeTab === "Personnel" && ( 
            <div className="travel-container mt-10">
              {/* Details */}
              <div className="border-r border-gray-300">
                <div className="form-title-header px-4">
                  Assign Personnel Details
                </div>

                {/* Table */}
                <div className="ppa-div-table px-4 pb-8 overflow-x-auto md:overflow-x-visible">
                  <table className="ppa-table w-full">
                    {/* Header */}
                    <thead>
                      <tr>
                        <th className="px-4 py-2 w-[50%] text-left ppa-table-header">Name</th>
                        <th className="px-4 py-2 w-[30%] text-left ppa-table-header">Assignment</th>
                        <th className="px-4 py-2 w-[20%] text-center ppa-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                      {loadingPersonnel ? (
                        Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                          <td className="py-2 ppa-table-body">
                            <div className="skeleton h-6"></div>
                          </td>
                        </tr>
                      ))
                      ):(
                        assignPersonnel && assignPersonnel.length > 0 ? (
                          assignPersonnel.map(getPersonnelData => (
                            <tr key={getPersonnelData.id}>
                              <td className="px-4 py-2 text-left ppa-table-body">{getPersonnelData.personnel_name}</td>
                              <td className="px-4 py-2 text-left ppa-table-body">{getPersonnelData.assignment}</td>
                              <td className="px-4 py-2 text-center ppa-table-body">
                                <div className="flex justify-center space-x-3">
                                  <FontAwesomeIcon onClick={() => handlePersonnelRemovalConfirmation(getPersonnelData.personnel_id)} className="icon-remove" title="Removel Personnel" icon={faTrash} />
                                </div>
                              </td>
                            </tr>
                          ))
                        ):(
                        <tr>
                          <td colSpan={4} className="px-2 py-5 text-center ppa-table-body">
                            <div className="flex justify-center items-center w-full font-bold">
                              No records found
                            </div>
                          </td>
                        </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assign Personnel */}
              <div className="pb-8">
                {loadingPersonnel ? (
                  <div className="flex justify-center items-center">
                    <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                    <span className="loading-table">Loading Form</span>
                  </div>
                ):(
                <>
                  <div className="form-title-header px-4">
                    Assign Personnel
                  </div>
                  <div className="px-4 mt-5">
                    <form onSubmit={submitAssignPersonnel}>
                      {/* Select Personnnel */}
                      <div className="flex items-center">
                        <div className="w-56 form-title">
                          <label htmlFor="rep_date"> 
                            Select Personnel
                          </label> 
                        </div>
                        <div className="w-full">
                          <select 
                            name="personnel" 
                            id="personnel" 
                            value={selectPersonnel.id}
                            onChange={ev => {
                              const selectedId = parseInt(ev.target.value);
                              const selectedPersonnel = personnel.find(
                                staff => staff.id === selectedId
                              );

                              setSelectPersonnel(
                                selectedPersonnel
                                  ? { id: selectedPersonnel.id, name: selectedPersonnel.name }
                                  : { id: '', name: '' }
                              );
                            }}
                            className="block w-full focus:ring-0 ppa-form-field h-[39px]"
                          >
                            <option value="" disabled> -- </option>
                            {personnel.map(staff => (
                              <option key={staff.id} value={staff.id}>
                                {staff.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Select Assignment */}
                      <div className="flex items-center mt-4">
                        <div className="w-56 form-title">
                          <label htmlFor="rep_date"> 
                            Select Assignment 
                          </label> 
                        </div>
                        <div className="w-full">
                          <select 
                            name="personnel_category" 
                            id="personnel_category" 
                            value={personnelCategory}
                            onChange={ev => {
                              setPersonnelCategory(ev.target.value);
                            }}
                            className="block w-full focus:ring-0 ppa-form-field"
                          >
                            <option value="" disabled> -- </option>
                            <option value="IT Service">IT Service</option>
                            <option value="Janitorial Service">Janitorial Service</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Electrical Works">Electrical Works</option>
                            <option value="Watering Services">Watering Services</option>
                            <option value="Engeneering Services">Engeneering Services</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-4 flex justify-center md:justify-start">
                        {selectDriverPersonnel && !buttonHide && selectPersonnel.id && personnelCategory && (
                          <button 
                            type="submit"
                            className={`w-full md:w-auto py-2 px-3 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                            disabled={submitLoading}
                          >
                          {submitLoading ? (
                            <div className="flex justify-center">
                              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                              <span className="ml-2">Loading</span>
                            </div>
                          ):(
                          'Submit'
                          )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Popup */}
        {showPopup && (
          <Popup 
            popupContent={popupContent}
            popupMessage={popupMessage}
            justClose={justclose}
            closePopup={closePopup}
            submitLoading={submitLoading}
            submitAnimation={submitAnimation}
            personnelId={selectedId}
            travelId={travelID}
            NotAvailDriver={NotAvailDriver}
            AvailDriver={AvailDriver}       
            SubmitAvailability={SubmitAvailability}  
            RemovePersonnel={RemoveDriver}
            RemoveAssign={RemoveAssign}
            updateAvailVehicle={updateAvailVehicle}
            removeVehicleDet={removeVehicleDet}
            vacantVehicle={vacantVehicle}
          />
        )}
      </PageComponent>
    )
  )
}