import axiosClient from "../axios";
import Modal from "../components/Modal";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';

export default function RequestForm(){
  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => { setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); };

  //Get data from the database on PPD Regular Employees on requesting vehicles
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    axiosClient.get('/ppausers')
      .then(response => {
        const usersData = response.data;
        setUsers(usersData); // Update state when data arrives
        setLoading(false); // Update loading state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Update loading state in case of an error
      });
  }, []);


  // Select
  const [typeOfRequest, setTypeOfRequest] = useState('');

  const inspection = "Pre-Repair/Post Repair Inspection Form";
  const facility = "Request for the use of Facility/Venue";
  const deploy = "Request for Repair/Troubleshooting (Equipment/Facility) and Development of Personnel";
  const vehicle = "Vehicle Request Slip";
  const manlift = "Request for the use of Manlift"

  // For the Equipment - Vehicle
  const [inspectionDate, setInspectionDate] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [BrandModel, setBrandModel] = useState('');
  const [SerialEngineNo, setSerialEngineNo] = useState('');
  const [typeOfProperty, setTypeOfProperty] = useState('');
  const [propertySpecify, setPropertySpecify] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [ComplainDefect, setComplainDefect] = useState('');
  const [supervisorApproval, setSupervisorApproval] = useState('');

  //For the Facility 
  const [requestDivision, setRequestDivision] = useState('');
  const [activityPurpose, setActivityPurpose] = useState('');
  const [dateOfActivity, setDateOfActivity] = useState('');
  const [activityTimeStart, setActivityTimeStart] = useState('');
  const [activityTimeEnd, setActivitTimeEnd] = useState('');
  const [beingRequested, setBeingRequested] = useState('');
  const [typeOfFacilities, setTypeOfFacilities] = useState('');
  const [numberOfTable, setNumberOfTable] = useState('');
  const [numberOfChairs, setNumberOfChairs] = useState('');
  const [numberOfMicrophone, setNumberOfMicrophone] = useState('');
  const [mphSpecify, setMphSpecify] = useState('');
  const [numberOfMaleGuest, setNumberOfMaleGuest] = useState('');
  const [numberOfFemaleGuest, setNumberOfFemaleGuest] = useState('');
  const [listOfMaleGuest, setListOfMaleGuest] = useState('');
  const [listOfFemaleGuest, setListOfFemaleGuest] = useState('');
  const [dormOtherDetails, setDormOtherDetails] = useState('');

  // Checkbox
  const [checkTable, setCheckTable] = useState(false);
  const [checkChair, setCheckChair] = useState(false);
  const [checkOther, setCheckOther] = useState(false);
  const [checkMicrophone, setCheckMicrophone] = useState(false);
  const [checkMaleGuest, setCheckMaleGuest] = useState(false);
  const [checkFemaleGuest, setCheckFemaleGuest] = useState(false);
  const [checkProjector, setCheckProjector] = useState(false);
  const [checkProjectorScreen, setCheckProjectorScreen] = useState(false);
  const [checkDocumentCamera, setCheckDocumentCamera] = useState(false);
  const [checkLaptop, setCheckLaptop] = useState(false);
  const [checkTelevision, setCheckTelevision] = useState(false);
  const [checkSoundSystem, setCheckSoundSystem] = useState(false);
  const [checkVideoke, setCheckVideoke] = useState(false);

  const [checkTechPersonnel, setCheckTechPersonnel] = useState(false);
  const [checkJanitorPersonnel, setCheckJanitorPersonnel] = useState(false);
  const [checkOtherDps, setCheckOtherDps] = useState(false);

  const handleCheckTable = (e) => {  setCheckTable(e.target.checked); }
  const handleCheckChairs = (e) => { setCheckChair(e.target.checked); }
  const handleCheckOther = (e) => { setCheckOther(e.target.checked); }
  const handleCheckMicrophone = (e) => { setCheckMicrophone(e.target.checked); }
  const handleCheckMaleGuest = (e) => { setCheckMaleGuest(e.target.checked); }
  const handleCheckFemaleGuest = (e) => { setCheckFemaleGuest(e.target.checked); }
  const handleCheckProjector = (e) => { setCheckProjector(e.target.checked); }
  const handleCheckProjectorScreen = (e) => { setCheckProjectorScreen(e.target.checked); }
  const handleCheckDocumentCamera = (e) => { setCheckDocumentCamera(e.target.checked); }
  const handleCheckLaptop = (e) => { setCheckLaptop(e.target.checked); }
  const handleCheckTelevision = (e) => { setCheckTelevision(e.target.checked); }
  const handleCheckSoundSystem = (e) => { setCheckSoundSystem(e.target.checked); }
  const handleCheckVideoke = (e) => { setCheckVideoke(e.target.checked); }

  const handleCheckTechPersonnel = (e) => { setCheckTechPersonnel(e.target.checked); }
  const handleCheckJanitorPersonnel = (e) => { setCheckJanitorPersonnel(e.target.checked); }
  const handleCheckOtherDps = (e) => { setCheckOtherDps(e.target.checked); }

  //For Request a Vehicle
  const [getPassengers, setGetPassengers] = useState('');
  const [vehiclePurpose, setVehiclePurpose] = useState('');
  const [vehiclePlace, setVehiclePlace] = useState('');
  const [dateArrival, setDateArrival] = useState('');
  const [timeArrival, setTimeArrival] = useState('');
  const [typeOfVehicle, setTypeOfVehicle] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [getDriver, setGetDriver] = useState('');

  useEffect(() => {

    if(typeOfVehicle === "Toyota Hi-Ace"){ setPlateNumber('SAB 4362'); }
    else if(typeOfVehicle === "Isuzu Van"){ setPlateNumber('SFT 545'); } 
    else if(typeOfVehicle === "Isuzu Man Lift"){ setPlateNumber('D2D 188'); }
    else if(typeOfVehicle === "Toyota Hi-Lux/Fx"){ setPlateNumber('SPF 880'); }
    else if(typeOfVehicle === "Hyundai Sta Fe"){ setPlateNumber('TEMP 101709'); }
    else if(typeOfVehicle === "Isuzu Boom Truck"){ setPlateNumber('D2S 454'); }
    else if(typeOfVehicle === "Isuzu Firetruck"){ setPlateNumber('DIS 060'); }
    else if(typeOfVehicle === "Toyota Fortuner"){ setPlateNumber('AKA 7787'); setGetDriver('Ricardo S. Villanueva') }
    else if(typeOfVehicle === "Toyota Innova"){ setPlateNumber('SHX 195'); }
  }, [typeOfVehicle]);

  //For Request a Manlift 
  const [manliftActivity, setManliftActivity] = useState('');
  const [dateManlift, setDateManlift] = useState('');
  const [startManlift, setStartManlift] = useState('');
  const [endManlift, setEndManlift] = useState('');

  //Other Request
  const [otherSpecificDetails, setOtherSpecificDetails] = useState('');
  const [otherSpecificLocations, setOtherSpecificLocations] = useState('');
  const [getTechPersonnel, setTechPersonnel] = useState([]);
  const [getPersonnelLocation, setPersonnelLocation] = useState('');
  const [getPersonnelPurpose, setPersonnelPurpose] = useState('');
  const [getJanitorPersonnel, setJanitorPersonnel] = useState([]);
  const [getOtherConcern, setOtherConcern] = useState('');
  const [getSupplyDetail, setSupplyDetail] = useState('');
  const [getNoSupplies, setNoSupplies] = useState('');

  const [selectedOptionValue, setSelectedOptionValue] = useState('');

  const navigate = useNavigate();

  const handleSupervisorName= (event) => {
    const selectedValue = event.target.value;
    setSupervisorApproval(selectedValue);
  
    const selectedIndex = event.target.selectedIndex;
    const selectedLabel = event.target.options[selectedIndex].text;
    setSelectedOptionValue(selectedLabel);
  };

  const handleTechPersonnel = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setTechPersonnel(selectedValues);
  };

  const handleJanitorPersonnel = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setJanitorPersonnel(selectedValues);
  };

  const closePopup = () => {
    setShowPopup(false);

    if (popupMessage === 'Request submitted successfully!') {
      navigate('/');
    }
  };

  //Submit the form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    setShowPopup(true);

    if(typeOfRequest === 'Equipment' || typeOfRequest === 'Computer' || typeOfRequest === 'Furniture' || typeOfRequest === 'Vehicle'){
      
      axiosClient
      .post("/inspectionformrequest",{
        date_of_request: inspectionDate,
        property_number: propertyNo,
        acq_date: acquisitionDate,
        acq_cost: acquisitionCost,
        brand_model: BrandModel,
        serial_engine_no: SerialEngineNo,
        type_of_property: typeOfProperty,
        property_other_specific: propertySpecify,
        property_description: propertyDescription,
        location: propertyLocation,
        complain: ComplainDefect,
        supervisor_name: supervisorApproval,
        supervisor_approval: 0,
        admin_approval: 0
      })
      .then((response) => {
        
        // Reset all data
        setTypeOfRequest('');
        setInspectionDate('');
        setPropertyNo('');
        setAcquisitionDate('');
        setAcquisitionCost('');
        setBrandModel('');
        setSerialEngineNo('');
        setTypeOfProperty('');
        setPropertySpecify('');
        setPropertyDescription('');
        setPropertyLocation('');
        setComplainDefect('');
        setSupervisorApproval('');

        setPopupMessage('Request submitted successfully!');
        setShowPopup(true);
        setIsModalOpen(false);

        console.log(response.data);

      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  
    }
    else if(typeOfRequest === 'Facility'){
      console.log(
        "Type of Request:", facility,
        "\nRequesting Office/Division:", requestDivision,
        "\nPurpose of Activity:", activityPurpose,
        "\nDate of Activity:", dateOfActivity,
        "\nActivity Time Start:", activityTimeStart,
        "\nActivity Time End:", activityTimeEnd,
        "\nFacility/ies / Venue being Requested:", beingRequested,
        "\nType of Facility:", typeOfFacilities,
        "\nFor the MPH / Conference Room: {",
        "\nTable:", checkTable,
        "\nNo. of Table:", numberOfTable,
        "\nChairs:", checkChair,
        "\nNo. of Chairs:", numberOfChairs,
        "\nProjector:", checkProjector,
        "\nProjector Screen:", checkProjectorScreen,
        "\nDocument Camera:", checkDocumentCamera,
        "\nLaptop:", checkLaptop,
        "\nTelevision:", checkTelevision,
        "\nSound System:", checkSoundSystem,
        "\nVideoke:", checkVideoke,
        "\nMicrophone:", checkMicrophone,
        "\nNo. of Microphone:", numberOfMicrophone,
        "\nOthers:", mphSpecify,
        "\n}",
        "\nFor Dormitory: {",
        "\nNo. of Male Guest:", numberOfMaleGuest,
        "\nList of Male Guest:", listOfMaleGuest,
        "\nNo. of Female Guest:", numberOfFemaleGuest,
        "\nList of Male Guest:", listOfFemaleGuest,
        "\nOther Details:", dormOtherDetails,
        "}"
      );
    }
    else if(typeOfRequest === 'Vehicle Request Slip'){
      console.log(
        "Type of Request :", vehicle,
        "\nPassenger:", getPassengers,
        "\nPurpose:", vehiclePurpose,
        "\nPlace to be Visited", vehiclePlace,
        "\nDate of Arrival:", dateArrival,
        "\nTime of Arrival:", timeArrival,
        "\nType of Vehicle:", typeOfVehicle,
        "\nPlate Number:", plateNumber,
        "\nDriver:", getDriver
      );
    }
    else if(typeOfRequest === 'Use of Manlift'){
      console.log(
        "Type of Request:", manlift,
        "Title/Purpose of Activity:", manliftActivity,
        "Date of Activity:", dateManlift,
        "Time Start", startManlift,
        "Time End", endManlift
      );
    }
    else {
      console.log(
        "Type of Request:", deploy,
        "\nOthers: ", otherSpecificDetails,
        "\nObservation: ", otherSpecificLocations,
        "\nTechnical Assistance:", getTechPersonnel,
        "\nJanitorial Assistance:", getJanitorPersonnel,
        "\nPurpose:", getPersonnelPurpose,
        "\nLocation:", getPersonnelLocation,
        "\nSupply Detail:", getSupplyDetail,
        "\nNo. of Supply:", getNoSupplies
      );
    }
  };

  return(
    <PageComponent title="Request Form">
      <form onSubmit={handleFormSubmit}>
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">

            <div className="mt-2">
              <label htmlFor="dps_request" className="block text-lg font-medium text-gray-900">Select Request:</label>
              <div className="mt-2">
                <select 
                  name="dps_request" 
                  id="dps_request" 
                  autoComplete="request-name"
                  value={typeOfRequest}
                  onChange={ev => setTypeOfRequest(ev.target.value)} 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Computer">Computer</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Facility">Facility</option>
                  <option value="Vehicle Request Slip">Vehicle Request Slip</option>
                  <option value="Use of Manlift">Use of Manlift</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* For Pre-Repair/Post Repair Inspection Form on (Equipment - Vehicle) */}
            {(
              typeOfRequest === 'Equipment' ||
              typeOfRequest === 'Computer' ||
              typeOfRequest === 'Furniture' ||
              typeOfRequest === 'Vehicle'
            )
            && 
            (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Pre-Repair/Post Repair Inspection Form </h2>
              {/* -- */}
              <div className="grid grid-cols-2 gap-4">
                {/* -- First Column -- */}
                <div className="col-span-1">
                  <div className="mt-6">
                  <label htmlFor="insp_date" className="block text-sm font-medium leading-6 text-gray-900"> Date : </label>
                    <input
                      type="date"
                      name="insp_date"
                      id="insp_date"
                      value= {inspectionDate}
                      onChange={ev => setInspectionDate(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="property_no" className="block text-sm font-medium leading-6 text-gray-900"> Property No. : </label>
                      <input
                        type="text"
                        name="property_no"
                        id="property_no"
                        autoComplete="property_no"
                        value={propertyNo}
                        onChange={ev => setPropertyNo(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="acquisition_date" className="block text-sm font-medium leading-6 text-gray-900"> Acquisition Date : </label>
                    <input
                      type="date"
                      name="acquisition_date"
                      id="acquisition_date"
                      value={acquisitionDate}
                      onChange={ev => setAcquisitionDate(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="acquisition_cost" className="block text-sm font-medium leading-6 text-gray-900"> Acquisition Cost : </label>
                      <input
                        type="text"
                        name="acquisition_cost"
                        id="acquisition_cost"
                        autoComplete="acquisition_cost"
                        value={acquisitionCost}
                        onChange={ev => setAcquisitionCost(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="brand_model" className="block text-sm font-medium leading-6 text-gray-900"> Brand/Model : </label>
                      <input
                        type="text"
                        name="brand_model"
                        id="brand_model"
                        autoComplete="brand_model"
                        value={BrandModel}
                        onChange={ev => setBrandModel(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div> 
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="serial_engine_no" className="block text-sm font-medium leading-6 text-gray-900"> Serial/Engine No. : </label>
                      <input
                        type="text"
                        name="serial_engine_no"
                        id="serial_engine_no"
                        autoComplete="serial_engine_no"
                        value={SerialEngineNo}
                        onChange={ev => setSerialEngineNo(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                </div>
                {/* -- Second Column -- */}
                <div className="col-span-1">
                  <div className="mt-4">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> Type of Property : </label>
                      <select 
                      name="type_of_property" 
                      id="type_of_property" 
                      autoComplete="type_of_property"
                      value={typeOfProperty}
                      onChange={ev => {
                        setTypeOfProperty(ev.target.value);
                        if (ev.target.value !== 'Others') {
                          setPropertySpecify('');
                        }
                      }}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                        <option value="It Equipemnt & Related Materials">It Equipemnt & Related Materials</option>
                        <option value="Others">Others</option>
                      </select>
                      {/* Appear the field if the option is Others */}
                      {typeOfProperty === 'Others' && (
                        <div className="mt-4">
                          <label htmlFor="specify" className="block text-sm font-medium leading-6 text-gray-900"> Specify : </label>
                          <input
                            type="text"
                            name="specify"
                            id="specify"
                            value={propertySpecify}
                            onChange={ev => setPropertySpecify(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          />
                        </div>
                      )}
                  </div> 
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900"> Description : </label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        value={propertyDescription}
                        onChange={ev => setPropertyDescription(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900"> Location (Div/Section/Unit) : </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={propertyLocation}
                        onChange={ev => setPropertyLocation(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="complain" className="block text-sm font-medium leading-6 text-gray-900"> Complain/Defect : </label>
                    <textarea
                      id="complain"
                      name="complain"
                      rows={3}
                      value={ComplainDefect}
                      onChange={ev => setComplainDefect(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Immediate Supervisor : </label>
                    <select 
                      name="plate_number" 
                      id="plate_number" 
                      autoComplete="request-name"
                      value={supervisorApproval}
                      onChange={handleSupervisorName}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    > 
                      <option value="" disabled>Select an option</option>
                      {users.map(user => (
                      <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal */}
              <div className="mt-4">
                <button 
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={openModal}>
                Save
                </button>

                <Modal isOpen={isModalOpen} onClose={closeModal}>

                  <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Please check your request before submit </h2>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold leading-7 text-gray-900">{inspection}</h3>
                    {/* -- */}
                    <div className="mt-4">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Date: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{inspectionDate}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Propert Number: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{propertyNo}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Acquisitaion Date: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{acquisitionDate}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Acquisition Cost: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{acquisitionCost}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Brand/Model: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{BrandModel}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Serial/Model No.: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{SerialEngineNo}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Type of Property: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{typeOfProperty}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    {typeOfProperty === 'Others' && (
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Specify: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{propertySpecify}</label>
                        </div>                  
                      </div>
                    </div>
                    )}
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Description: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{propertyDescription}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Location (Div/Section/Unit): </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{propertyLocation}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Complaint/Defect: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{ComplainDefect}</label>
                        </div>                  
                      </div>
                    </div>
                    {/* -- */}
                    <div className="mt-2">
                      <div class="relative flex gap-x-3">
                        <div class="flex h-6 text-base items-center">
                        <label for="chair_no" class="font-medium text-gray-900">Immediate Supervisor: </label>
                        </div>
                        <div class="text-base leading-6">
                          <label for="chair_no" class="font-normal text-gray-900">{selectedOptionValue}</label>
                        </div>                  
                      </div>
                    </div>

                  </div>

                <div className="mt-4">
                  <button
                  onClick={closeModal}
                  className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" // Add ml-2 for left margin
                  >
                  Close
                  </button>
                  <button
                  type="submit"
                  className="rounded-md ml-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                  Submit
                  </button>
                </div>
                </Modal>
              </div>
              {/* End of Modal */}

            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Facility' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Request for the use of Facility / Venue </h2>
              {/* -- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <div className="mt-6">
                  <label htmlFor="request_div" className="block text-sm font-medium leading-6 text-gray-900"> Requesting Office/Division : </label>
                    <input
                      type="text"
                      name="request_div"
                      id="request_div"
                      value={requestDivision}
                      onChange={ev => setRequestDivision(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="act_purpose" className="block text-sm font-medium leading-6 text-gray-900"> Purpose of Activity : </label>
                    <input
                      type="text"
                      name="act_purpose"
                      id="act_purpose"
                      value={activityPurpose}
                      onChange={ev => setActivityPurpose(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="act_date" className="block text-sm font-medium leading-6 text-gray-900"> Date of Activity : </label>
                    <input
                      type="date"
                      name="act_date"
                      id="act_date"
                      value={dateOfActivity}
                      onChange={ev => setDateOfActivity(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="act_timestart" className="block text-sm font-medium leading-6 text-gray-900"> Activity Time Start : </label>
                    <input
                      type="time"
                      name="act_timestart"
                      id="act_timestart"
                      value={activityTimeStart}
                      onChange={ev => setActivityTimeStart(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="act_timeend" className="block text-sm font-medium leading-6 text-gray-900"> Activity Time End : </label>
                    <input
                      type="time"
                      name="act_timeend"
                      id="act_timeend"
                      value={activityTimeEnd}
                      onChange={ev => setActivitTimeEnd(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                  <label htmlFor="act_requested" className="block text-sm font-medium leading-6 text-gray-900"> Facility/ies / Venue being Requested : </label>
                    <input
                      type="text"
                      name="act_requested"
                      id="act_requested"
                      value={beingRequested}
                      onChange={ev => setBeingRequested(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* -- */}
                <div className="col-span-1">
                  <div className="mt-6">
                    <label htmlFor="request_facility" className="block text-sm font-medium leading-6 text-gray-900">Type of Facility:</label>
                    <select 
                      name="request_facility" 
                      id="request_facility" 
                      value={typeOfFacilities}
                      onChange={ev => setTypeOfFacilities(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Multi-Purpose Hall">Multi-Purpose Hall (MPH)</option>
                      <option value="Conference Room">Conference Room</option>
                      <option value="Dormitory">Dormitory</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  {/* if the use choose MPH and Conference Room */}
                  {(
                    typeOfFacilities === 'Multi-Purpose Hall' ||
                    typeOfFacilities === 'Conference Room'
                  )
                  &&
                  (
                    <div className="mt-6">
                      <label htmlFor="request_facility" className="block text-sm font-medium leading-6 text-gray-900">For the MPH / Conference Room:</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <div className="mt-6">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="table_no" 
                                  name="table_no" 
                                  type="checkbox"
                                  onChange={handleCheckTable} 
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="table_no" class="font-medium text-gray-900">Table</label>
                              </div>
                                {/* if the table is check */}
                                {checkTable && (
                                  <div>
                                    <input
                                      type="text"
                                      name="no_table"
                                      id="no_table"
                                      value={numberOfTable}
                                      onChange={ev => setNumberOfTable(ev.target.value)}
                                      className="h-7 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                      placeholder="No."
                                    />
                                  </div>
                                )}  
                                {/* end of table condition */}
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="chair_no" 
                                  name="chair_no" 
                                  type="checkbox"
                                  onChange={handleCheckChairs} 
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="chair_no" class="font-medium text-gray-900">Chairs</label>
                              </div>
                                {/* if the chair is check */}
                                {checkChair && (
                                  <div>
                                    <input
                                      type="text"
                                      name="no_chair"
                                      id="no_chair"
                                      value={numberOfChairs}
                                      onChange={ev => setNumberOfChairs(ev.target.value)}
                                      className="h-7 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                      placeholder="No."
                                    />
                                  </div>
                                )}  
                                {/* end of chair condition */}
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="projector" 
                                  name="projector" 
                                  type="checkbox"
                                  onChange={handleCheckProjector}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="projector" class="font-medium text-gray-900">Projector</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="projector_screen" 
                                  name="projector_screen" 
                                  type="checkbox"
                                  onChange={handleCheckProjectorScreen}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="projector_screen" class="font-medium text-gray-900">Projector Screen</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="document_camera" 
                                  name="document_camera" 
                                  type="checkbox"
                                  onChange={handleCheckDocumentCamera}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="document_camera" class="font-medium text-gray-900">Document Camera</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="other_req" 
                                  name="other_req" 
                                  type="checkbox"
                                  onChange={handleCheckOther}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="other_req" class="font-medium text-gray-900">Others</label>
                              </div>
                            </div>
                          </div>
                          {/* if the other is check */}
                          {checkOther && (
                            <div className="mt-2">
                              <label htmlFor="mph_specify" className="block text-sm font-medium leading-6 text-gray-900"> Please Specify : </label>
                              <textarea
                                id="mph_specify"
                                name="mph_specify"
                                rows={3}
                                value={mphSpecify}
                                onChange={ev => setMphSpecify(ev.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              />
                            </div>
                          )}
                          {/* end of condition */}
                        </div>
                        <div className="col-span-1">
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="laptop" 
                                  name="laptop" 
                                  type="checkbox"
                                  onChange={handleCheckLaptop}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="laptop" class="font-medium text-gray-900">Laptop</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="television" 
                                  name="television" 
                                  type="checkbox"
                                  onChange={handleCheckTelevision}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="television" class="font-medium text-gray-900">Television</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="sound_system" 
                                  name="sound_system" 
                                  type="checkbox"
                                  onChange={handleCheckSoundSystem}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="sound_system" class="font-medium text-gray-900">Sound System</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="videoke" 
                                  name="videoke" 
                                  type="checkbox"
                                  onChange={handleCheckVideoke}
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="videoke" class="font-medium text-gray-900">Videoke</label>
                              </div>
                            </div>
                          </div>
                          {/* -- */}
                          <div className="mt-2">
                            <div class="relative flex gap-x-3">
                              <div class="flex h-6 items-center">
                                <input 
                                  id="microphone_no" 
                                  name="microphone_no" 
                                  type="checkbox"
                                  onChange={handleCheckMicrophone} 
                                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                                />
                              </div>
                              <div class="text-sm leading-6">
                                <label for="chair_no" class="font-medium text-gray-900">Microphone</label>
                              </div>
                                {/* if the chair is check */}
                                {checkMicrophone && (
                                  <div>
                                    <input
                                      type="text"
                                      name="no_chair"
                                      id="no_chair"
                                      value={numberOfMicrophone}
                                      onChange={ev => setNumberOfMicrophone(ev.target.value)}
                                      className="h-7 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                      placeholder="No."
                                    />
                                  </div>
                                )}  
                                {/* end of chair condition */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* If the Facility choose Dormitory */}
                  {typeOfFacilities === 'Dormitory' && (
                    <div className="mt-6">
                      <label htmlFor="request_facility" className="block text-sm font-medium leading-6 text-gray-900">For the Dormitory:</label>
                      <div className="mt-4">
                        <div class="relative flex gap-x-3">
                          <div class="flex h-6 items-center">
                            <input 
                              id="m_guest" 
                              name="m_guest" 
                              type="checkbox"
                              onChange={handleCheckMaleGuest}
                              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                            />
                          </div>
                          <div class="text-sm leading-6">
                            <label for="m_guest" class="font-medium text-gray-900">Male Guests</label>
                          </div>
                          {checkMaleGuest && (
                            <div class="flex h-6 items-center">
                              <input
                                type="number"
                                name="male_guest"
                                id="male_guest"
                                value={numberOfMaleGuest}
                                onChange={ev => setNumberOfMaleGuest(ev.target.value)}
                                className="h-7 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                placeholder="No."
                              />
                            </div> 
                          )}
                        </div>
                        {checkMaleGuest && (
                        <div className="mt-4">
                          <textarea
                            id="male_guest_list"
                            name="male_guest_list"
                            rows={5}
                            placeholder="Insert the Names here"
                            value={listOfMaleGuest}
                            onChange={ev => setListOfMaleGuest(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          />
                        </div>
                        )}
                      </div>
                      {/* -- */}
                      <div className="mt-4">
                        <div class="relative flex gap-x-3">
                          <div class="flex h-6 items-center">
                            <input 
                              id="f_guest" 
                              name="f_guest" 
                              type="checkbox"
                              onChange={handleCheckFemaleGuest}
                              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                            />
                          </div>
                          <div class="text-sm leading-6">
                            <label for="f_guest" class="font-medium text-gray-900">Female Guests</label>
                          </div>
                          {checkFemaleGuest && (
                            <div class="flex h-6 items-center">
                              <input
                                type="number"
                                name="female_guest"
                                id="female_guest"
                                value={numberOfFemaleGuest}
                                onChange={ev => setNumberOfFemaleGuest(ev.target.value)}
                                className="h-7 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                placeholder="No."
                              />
                            </div> 
                          )}
                        </div>
                        {checkFemaleGuest && (
                        <div className="mt-4">
                          <textarea
                            id="female_guest_list"
                            name="female_guest_list"
                            rows={5}
                            placeholder="Insert the Names here"
                            value={listOfFemaleGuest}
                            onChange={ev => setListOfFemaleGuest(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          />
                        </div>
                        )}
                      </div>
                      {/* -- */}
                      <div className="mt-6">
                        <label htmlFor="request_facility" className="block text-sm font-medium leading-6 text-gray-900">Other Details:</label>
                      </div>
                      <div className="mt-2">
                          <textarea
                            id="other_details"
                            name="other_details"
                            rows={5}
                            value={dormOtherDetails}
                            onChange={ev => setDormOtherDetails(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          />
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Vehicle Slip */}
            {typeOfRequest === 'Vehicle Request Slip' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Vehicle Request Slip </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <div className="mt-4">
                    <label htmlFor="passengers" className="block text-sm font-medium leading-6 text-gray-900"> Passenger/s : </label>
                    <textarea
                      id="passengers"
                      name="passengers"
                      rows={3}
                      value={getPassengers}
                      onChange={ev => setGetPassengers(ev.target.value)}  
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="vehicle_purpose" className="block text-sm font-medium leading-6 text-gray-900"> Purpose : </label>
                      <input
                        type="text"
                        name="vehicle_purpose"
                        id="vehicle_purpose"
                        value={vehiclePurpose}
                        onChange={ev => setVehiclePurpose(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="vehicle_place" className="block text-sm font-medium leading-6 text-gray-900"> Place/s to be Visited : </label>
                      <input
                        type="text"
                        name="vehicle_place"
                        id="vehicle_place"
                        value={vehiclePlace}
                        onChange={ev => setVehiclePlace(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="date_arrival" className="block text-sm font-medium leading-6 text-gray-900"> Date of Arrival : </label>
                      <input
                        type="date"
                        name="date_arrival"
                        id="date_arrival"
                        value={dateArrival}
                        onChange={ev => setDateArrival(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                  {/* -- */}
                  <div className="mt-4">
                    <label htmlFor="time_arrival" className="block text-sm font-medium leading-6 text-gray-900"> Time of Arrival : </label>
                      <input
                        type="time"
                        name="time_arrival"
                        id="time_arrival"
                        value={timeArrival}
                        onChange={ev => setTimeArrival(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                  </div>
                </div>
                {/* ---- */}
                <div className="col-span-1">
                  <div className="mt-4">
                    <label htmlFor="vehicle_place" className="block text-sm font-medium leading-6 text-gray-900"> Admin Assign Vehicle : </label>
                    <select 
                      name="dps_request" 
                      id="dps_request" 
                      autoComplete="request-name"
                      value={typeOfVehicle}
                      onChange={ev => setTypeOfVehicle(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Mitsubishi Adventure">Mitsubishi Adventure</option>
                      <option value="Toyota Hi-Ace">Toyota Hi-Ace</option>
                      <option value="Isuzu Van">Isuzu Van</option>
                      <option value="Isuzu Man Lift">Isuzu Man Lift</option>
                      <option value="Toyota Hi-Lux">Toyota Hi-Lux</option>
                      <option value="Toyota Hi-Lux/Fx">Toyota Hi-Lux/Fx</option>
                      <option value="Toyota Hi-Lux Patrol">Toyota Hi-Lux Patrol</option>
                      <option value="Hyundai Sta Fe">Hyundai Sta Fe</option>
                      <option value="Isuzu Boom Truck">Isuzu Boom Truck</option>
                      <option value="Toyota Fortuner">Toyota Fortuner</option>
                      <option value="Isuzu Firetruck">Isuzu Firetruck</option>
                      <option value="Toyota Innova">Toyota Innova</option>
                    </select>
                  </div>
                  {/* Condition Statement */}
                    {/* For Mitsubishi Adventure */}
                    {typeOfVehicle === "Mitsubishi Adventure" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <select 
                          name="plate_number" 
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          autoComplete="request-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="" disabled>Select an option</option>
                          <option value="SLF 432">SLF 432</option>
                          <option value="SLG 388">SLG 388</option>
                          <option value="SHL 594">SHL 594</option>
                        </select>

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="plate_number" 
                            id="plate_number" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              {users.map(user => (
                              <option key={user.id} value={`${user.fname} ${user.lname}`}>{user.fname} {user.lname} - PPD</option>
                              ))}
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Hi Ace */}
                    {typeOfVehicle === "Toyota Hi-Ace" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Isuzu Van */}
                    {typeOfVehicle === "Isuzu Van" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Isuzu Man Lift */}
                    {typeOfVehicle === "Isuzu Man Lift" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Toyota Hi-Lux */}
                    {typeOfVehicle === "Toyota Hi-Lux" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <select 
                          name="plate_number" 
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          autoComplete="request-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="" disabled>Select an option</option>
                          <option value="SFM 708">SFM 708</option>
                          <option value="NBG 9724">NBG 9724</option>
                        </select>

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="plate_number" 
                            id="plate_number" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                              <option value="Ricahrdo S. Villanueva">Villanueva, Ricahrdo S. - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Toyota Hi-Lux Patrol */}
                    {typeOfVehicle === "Toyota Hi-Lux Patrol" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <select 
                          name="plate_number" 
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          autoComplete="request-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="" disabled>Select an option</option>
                          <option value="SAB 4394">SAB 4394</option>
                          <option value="S6 H167">S6 H167</option>
                        </select>

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="plate_number" 
                            id="plate_number" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              {users.map(user => (
                              <option key={user.id} value={`${user.fname} ${user.lname}`}>{user.fname} {user.lname} - PPD</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Toyota Hi-Lux/Fx */}
                    {typeOfVehicle === "Toyota Hi-Lux/Fx" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Hyundai Sta Fe */}
                    {typeOfVehicle === "Hyundai Sta Fe" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Isuzu Boom Truck */}
                    {typeOfVehicle === "Isuzu Boom Truck" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Jan Dexter Loang">Loang, Jan Dexter - COS</option>
                              <option value="Joel A. Magno">Magno, Joel A - Regular</option>
                              <option value="Noel Rosero">Rosero, Noel - Regular</option>
                              <option value="Darly T. Sumanoy">Sumanoy, Darly T. - Regular</option>
                              <option value="Rey T. Sumanoy">Sumanoy, Rey T. - COS</option>
                              <option value="Arnold A. Turla">Turla, Arnold A - COS</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Isuzu Firetruck */}
                    {typeOfVehicle === "Isuzu Firetruck" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                        <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <select 
                            name="plate_number" 
                            id="plate_number" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              {users.map(user => (
                              <option key={user.id} value={`${user.fname} ${user.lname}`}>{user.fname} {user.lname} - PPD</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {/* For Toyota Fortuner */}
                    {typeOfVehicle === "Toyota Fortuner" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                            <input
                            type="text"
                            name="plate_number"
                            id="plate_number"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            readOnly
                            />
                        </div>
                      </div>
                    )}
                    {/* For Toyota Innova */}
                    {typeOfVehicle === "Toyota Innova" && (
                      <div className="mt-4">
                        <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Plate Number : </label>
                          <input
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={plateNumber}
                          onChange={ev => setPlateNumber(ev.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          readOnly
                          />

                        <div className="mt-4">
                          <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900"> Driver : </label>
                          <select 
                            name="dps_request" 
                            id="dps_request" 
                            autoComplete="request-name"
                            value={getDriver}
                            onChange={ev => setGetDriver(ev.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            > 
                              <option value="" disabled>Select an option</option>
                              <option value="Clint Bryan B. Balmones">Balmones, Clint Bryan B. - Regular</option>
                              <option value="Omar A. Sabdani">Sabdani, Omar A. - Regular</option>
                          </select>
                        </div>
                      </div>
                    )}
                  {/* End of condition */}
                </div>
              </div>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Use of Manlift' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Request for the use of Manlift </h2>
              <div className="mt-4">
                <label htmlFor="manlift_activity" className="block text-sm font-medium leading-6 text-gray-900"> Title/Purpose of Activity : </label>
                <textarea
                  id="manlift_activity"
                  name="manlift_activity"
                  rows={3}
                  value={manliftActivity}
                  onChange={ev => setManliftActivity(ev.target.value)}         
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
              {/* -- */}
              <div className="mt-4">
                <label htmlFor="date_manlift" className="block text-sm font-medium leading-6 text-gray-900"> Date of Activity : </label>
                  <input
                    type="date"
                    name="date_manlift"
                    id="date_manlift"
                    value={dateManlift}
                    onChange={ev => setDateManlift(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
              </div>
              {/* -- */}
              <div className="mt-4">
                <label htmlFor="start_manlift" className="block text-sm font-medium leading-6 text-gray-900"> Time start of Activity : </label>
                  <input
                    type="time"
                    name="start_manlift"
                    id="start_manlift"
                    value={startManlift}
                    onChange={ev => setStartManlift(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
              </div>
              {/* -- */}
              <div className="mt-4">
                <label htmlFor="end_manlift" className="block text-sm font-medium leading-6 text-gray-900"> Time end of Activity : </label>
                  <input
                    type="time"
                    name="end_manlift"
                    id="end_manlift"
                    value={endManlift}
                    onChange={ev => setEndManlift(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
              </div>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Others' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> 
                Request for Repair/Troubleshooting and Deployment of Personnel 
              </h2>
              {/* -- */}
              <div className="mt-2">
                <label htmlFor="specific_details" className="block text-sm font-medium leading-6 text-gray-900"> Details: Observation / Description of Defect </label>
                <textarea
                  id="specific_details"
                  name="specific_details"
                  value={otherSpecificDetails}
                  onChange={ev => setOtherSpecificDetails(ev.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
              {/* -- */}
              <div className="mt-6">
                <label htmlFor="specific_location" className="block text-sm font-medium leading-6 text-gray-900"> Location </label>
              </div>
                <input
                  type="text"
                  name="specific_location"
                  id="specific_location"
                  value={otherSpecificLocations}
                  onChange={ev => setOtherSpecificLocations(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              {/* -- */}
              <div className="mt-6">
                <label htmlFor="specific_details" className="block text-sm font-medium leading-6 text-gray-900"> Deployment of Personnel </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* --  */}
                <div className="col-span-1">
                  <div className="mt-6">
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input 
                          id="dop" 
                          name="dop" 
                          type="checkbox"
                          onChange={handleCheckTechPersonnel}
                          class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                        />
                      </div>
                      <div class="text-sm leading-6">
                        <label for="dop" class="font-medium text-gray-900">Technical Assistance</label>
                      </div>
                    </div>
                  </div>
                  {/* -- Display the Technical Personnel */}
                  {checkTechPersonnel && (
                    <div className="mt-4">
                      <select 
                        name="tech_personnel" 
                        id="tech_personnel"
                        autoComplete="request-name"
                        multiple
                        value={getTechPersonnel}
                        onChange={handleTechPersonnel}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        style={{ height: '200px' }}
                      >
                      <option value="" disabled>Select a Personnel</option>
                      <option value="Raymart E. Reulan">Reulan, Raymart E. - IT Service</option>
                      <option value="Jeffrey N. Silao">Silao, Jeffrey N. - IT Service</option>
                      <option value="Zack-Mio A. Sermon">Sermon, Zack-Mio A. - IT Service</option>
                      <option value="Earl S. Coquilla">Coquilla, Earl S. - IT Service</option>
                      <option value="Adonis Mc Gabby Ll. Dingcong">Dingcong, Adonis Mc Gabby Ll. - IT Service</option>
                      <option value="Aldrin B. Denopol">Denopol, Aldrin B. - IT Service</option>
                      <option value="Cris Ian R. Jacinto">Jacinto, Cris Ian R - IT Service</option>
                      <option value="Jay Robin S. Lluisma">Lluisma, Jay Robin S. - Electronics</option>
                      <option value="Sonny Edward B. Namindang">Namindang, Sonny Edward B. - Electronics</option>
                      <option value="Stephen B. Acierto">Acierto, Stephen B. - Electrical Works</option>
                      <option value="Jon Carlo D. Gallarde">Gallarde, Jon Carlo D. - Electrical Works</option>
                      <option value="Noel G. Rosero">Rosero, Noel G. - Electrical Works</option>
                      <option value="Noel U. Balolong">Balolong, Noel U. - Watering Services</option>
                      <option value="Jolito S. Sepio">Sepio, Jolito S. - Engineering Services</option>
                      <option value="Julito S. Villacorte">Villacorte, Julito S. - Engineering Services</option>
                      <option value="Mark Jason I. Gengone">Gengone, Mark Jason I. - Engineering Services</option>
                      <option value="Archer A. Dahunan">Dahunan, Archer A. - Engineering Services</option>

                      </select>
                      <label htmlFor="specific_details" className="block text-xs font-medium leading-6 text-red-600 italic"> Hold crtl key to choose more than 1 Personnel </label>      
                    </div>
                  )}
                </div>
                {/* -- */}
                <div className="col-span-1">
                  <div className="mt-6">
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input 
                          id="dop" 
                          name="dop" 
                          type="checkbox"
                          onChange={handleCheckJanitorPersonnel}
                          class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                        />
                      </div>
                      <div class="text-sm leading-6">
                        <label for="dop" class="font-medium text-gray-900">Janitorial Assistance</label>
                      </div>
                    </div>
                  </div>
                  {/* -- */}
                  {checkJanitorPersonnel && (
                    <div className="mt-4">
                      <select 
                        name="janitor_personnel" 
                        id="janitor_personnel"
                        autoComplete="request-name"
                        multiple
                        value={getJanitorPersonnel}
                        onChange={handleJanitorPersonnel}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        style={{ height: '200px' }}
                      >
                      <option value="" disabled>Select a Personnel</option>
                      <option value="Alindayo, Jason S.">Alindayo, Jason S.</option>
                      <option value="Alindayo, Reynaldo P.">Alindayo, Reynaldo P.</option>
                      <option value="Gandillo, Genny M.">Gandillo, Genny M.</option>
                      <option value="Guillena, Michael Alfe E.">Guillena, Michael Alfe E.</option>
                      <option value="Meralles, Fatima D.">Meralles, Fatima D.</option>
                      <option value="Novicio, Jeric B.">Novicio, Jeric B.</option>
                      <option value="Pagente, Neirmae A.">Pagente, Neirmae A.</option>
                      <option value="Panuncillo, Rowe P.">Panuncillo, Rowe P.</option>
                      <option value="Petallo, Locyl L.">Petallo, Locyl L.</option>
                      <option value="Romeo, Lorenzo G.">Romeo, Lorenzo G.</option>
                      <option value="Seville, Ryan J.">Seville, Ryan J.</option>
                      <option value="Sumanoy, Darwin Joseph T.">Sumanoy, Darwin Joseph T.</option>
                      <option value="Tambus, Evelyn S.">Tambus, Evelyn S.</option>
                      <option value="Villaver, Erwin Y.">Villaver, Erwin Y.</option>
                      <option value="Villaver, Rechievue Y.">Villaver, Rechievue Y.</option>
                      <option value="Ampo, Jesril D.">Ampo, Jesril D.</option>
                      <option value="Serafin, Angelo P.">Serafin, Angelo P.</option>
                      <option value="Sade, Michael G.">Sade, Michael G.</option>
                      <option value="Milmao, Nilo John C.">Milmao, Nilo John C.</option>
                      <option value="Balbarino, Allan C.">Balbarino, Allan C.</option>
                      <option value="Diango, Jerome C.">Diango, Jerome C.</option>
                      </select>
                      <label htmlFor="specific_details" className="block text-xs font-medium leading-6 text-red-600 italic"> Hold crtl key to choose more than 1 Personnel </label>  
                    </div>
                  )}
                </div>
                {/* -- */}
                <div className="col-span-1">
                  <div className="mt-6">
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input 
                          id="dop" 
                          name="dop" 
                          type="checkbox"
                          onChange={handleCheckOtherDps}
                          class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                        />
                      </div>
                      <div class="text-sm leading-6">
                        <label for="dop" class="font-medium text-gray-900">Others</label>
                      </div>
                    </div>
                  </div>
                  {/* -- */}
                  {checkOtherDps && (
                    <div className="mt-4">
                      <textarea
                        id="other_concern"
                        name="other_concern"
                        rows={8}
                        value={getOtherConcern}
                        onChange={ev => setOtherConcern(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="personnel_location" className="block text-sm font-medium leading-6 text-gray-900"> Location : </label>
              </div>
                <input
                  type="text"
                  name="personnel_location"
                  id="personnel_location"
                  value={getPersonnelLocation}
                  onChange={ev => setPersonnelLocation(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              <div className="mt-4">
                <label htmlFor="personnel_purpose" className="block text-sm font-medium leading-6 text-gray-900"> Purpose : </label>
              </div>
                <input
                  type="text"
                  name="personnel_purpose"
                  id="personnel_purpose"
                  value={getPersonnelPurpose}
                  onChange={ev => setPersonnelPurpose(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              {/* -- */}
              <div className="mt-6">
                <label htmlFor="specific_details" className="block text-sm font-medium leading-6 text-gray-900"> Supplies </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <div className="mt-6">
                    <label htmlFor="supply_details" className="block text-sm font-medium leading-6 text-gray-900"> Details :</label>
                  </div>
                  <div className="mt-2">
                  <textarea
                    id="supply_details"
                    name="supply_details"
                    rows={3}
                    value={getSupplyDetail}
                    onChange={ev => setSupplyDetail(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  </div>
                </div>
                {/* -- */}
                <div className="col-span-1">
                  <div className="mt-6">
                    <label htmlFor="specific_details" className="block text-sm font-medium leading-6 text-gray-900"> No. of Supplies </label>
                  </div>
                  <div className="mt-2">
                    <textarea
                      id="supply_quantity"
                      name="supply_quantity"
                      rows={3}
                      value={getNoSupplies}
                      onChange={ev => setNoSupplies(ev.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}
            {/* End here */}
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
           {/* Semi-transparent black overlay */}
           <div
             className="fixed inset-0 bg-black opacity-40" // Close on overlay click
           ></div>
           {/* Popup content with background blur */}
           <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
             <p className="text-lg">{popupMessage}</p>
             <div className="flex justify-center mt-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
           </div>
          </div>
      )}

      </form>
    </PageComponent>
  )
}