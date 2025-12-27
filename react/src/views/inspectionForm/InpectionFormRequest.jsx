import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";

export default function RepairRequestForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  const navigate = useNavigate();

  // Date
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

  const [confirmation, setConfirmation] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);

  // Values
  const [propertyNo, setPropertyNo] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [BrandModel, setBrandModel] = useState('');
  const [SerialEngineNo, setSerialEngineNo] = useState('');
  const [typeOfProperty, setTypeOfProperty] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [ComplainDefect, setComplainDefect] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState({ id: '', name: '' });

  const [inputErrors, setInputErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const [supervisor, setSupervisor] = useState([]);

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

  // Get Supervisor
  useEffect(()=>{
    axiosClient
    .get(`/getsupervisor`)
    .then((response) => {
      const responseData = response.data;

      const supervisorData = responseData.map((dataItem) => {
        return {
          id: dataItem.id,
          name: dataItem.name,
        }
      })

      setSupervisor({supervisorData});
      //console.log(supervisorData);
    });
  },[]);

  // Confirm Function
  function handleConfirm(event){
    event.preventDefault();

    const formData = {
      form: "Check",
      user_id: currentUserId,
      user_name: currentUserName.name,
      type_of_property: typeOfProperty,
      property_description: propertyDescription,
      location: propertyLocation,
      complain: ComplainDefect,
      supervisor_id: Admin || DivisionManager || PortManager ? currentUserId : selectedSupervisor.id,
      supervisor_name: Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name,
      form_status: PortManager ? 8 : Admin ? 9 : DivisionManager ? 10 : 11,
    };

    axiosClient
    .post("/submitinsprequest", formData)
    .then((response)=>{
      console.log();
      if(response.data.message === "Check"){
        setConfirmation(true);
      }
    })
    .catch((error)=>{
      if(error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }else{
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Submit the Form
  function SubmitInspectionForm(event){
    event.preventDefault();

    let remarks = Admin || DivisionManager || PortManager ? 'Waiting for the GSO to fill out the Part B form' : 'Waiting for supervisor approval.' ;

    setSubmitLoading(true);

    const formData = {
      form: "Uncheck",
      user_id: currentUserId,
      user_name: currentUserName.name,
      property_number: propertyNo,
      acquisition_date: acquisitionDate,
      acquisition_cost: acquisitionCost,
      brand_model: BrandModel,
      serial_engine_no: SerialEngineNo,
      type_of_property: typeOfProperty,
      property_description: propertyDescription,
      location: propertyLocation,
      complain: ComplainDefect,
      supervisor_id: Admin || DivisionManager || PortManager ? currentUserId : selectedSupervisor.id,
      supervisor_name: Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name,
      form_status: PortManager ? 8 : Admin ? 9 : DivisionManager ? 10 : 11,
      form_remarks: remarks,
    };

    axiosClient
    .post("/submitinsprequest", formData)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          {Admin || DivisionManager || PortManager ? 
          <p className="popup-message">Waiting for the GSO to fill up the Part B form.</p> : 
          <p className="popup-message">Waiting for the supervisor's approval.</p>
          }
        </div>
      );
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
    navigate(`/joms/myrequest`);
  }

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");
  const DivisionManager = codes.includes("DM");
  const SuperHacker = codes.includes("NERD");
  const GSO = codes.includes("GSO");

  return (
    <PageComponent title="Request Form">

      {/* Form Content */}
      <div className="ppa-widget mt-8">
        <div className="joms-user-info-header text-left"> 
          Request for Pre/Post Inspection Repair
        </div>

        <div className="pb-2">
          {confirmation ? (
          <div className="form-container">
            <form onSubmit={SubmitInspectionForm}>

                {/* Title */}
                <div className="pl-4">
                  <h2 className="req-title"> Part A: To be filled-up by Requesting Party </h2>
                </div>

                <div className="grid grid-cols-2">

                  {/* Part A left side */}
                  <div className="col-span-1 px-4">

                    {/* Date */}
                    <div className="flex items-center mt-6">
                      <div className="w-48">
                        <label className="form-title">
                        Date:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {formatDate(today)}
                      </div>
                    </div>

                    {/* Property No */}
                    <div className="flex items-center mt-2">
                      <div className="w-48">
                        <label className="form-title">
                        Property No:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {propertyNo ? propertyNo : "N/A"}
                      </div>
                    </div>

                    {/* Acquisition Date */}
                    <div className="flex items-center mt-2">
                      <div className="w-48">
                        <label className="form-title">
                        Acquisition Date:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {acquisitionDate ? formatDate(acquisitionDate) : "N/A"}
                      </div>
                    </div>

                    {/* Acquisition Cost */}
                    <div className="flex items-center mt-2">
                      <div className="w-48">
                        <label className="form-title">
                        Acquisition Cost:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {acquisitionCost ? new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP'
                        }).format(acquisitionCost) : "N/A" }
                      </div>
                    </div>

                    {/* Brand/Model */}
                    <div className="flex items-center mt-2">
                      <div className="w-48">
                        <label className="form-title">
                        Brand/Model:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {BrandModel ? BrandModel : "N/A"}
                      </div>
                    </div>

                    {/* Serial/Engine No */}
                    <div className="flex items-center mt-2">
                      <div className="w-48">
                        <label className="form-title">
                        Serial/Engine No:
                        </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {SerialEngineNo ? SerialEngineNo : "N/A"}
                      </div>
                    </div>

                  </div>

                  {/* Part A right side */}
                  <div className="col-span-1 px-4">

                    {/* Type of Property */}
                    <div className="flex items-center mt-6">
                      <div className="w-52">
                        <label className="form-title"> Type of Property: </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {typeOfProperty}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title"> Description: </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {propertyDescription}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title"> Location: </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {propertyLocation}
                      </div>
                    </div>

                    {/* Supervisor */}
                    <div className="flex items-center mt-2">
                      <div className="w-52">
                        <label className="form-title"> Supervisor: </label> 
                      </div>
                      <div className="w-full ppa-form-confimation">
                        {Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name}
                      </div>
                    </div>

                  </div>
          
                </div>

                {/* Complain */}
                <div className="flex items-center mt-2 px-4">
                  <div className="w-40">
                    <label className="form-title">
                    Complain:
                    </label> 
                  </div>
                  <div className="w-full ppa-form-confimation">
                    {ComplainDefect}
                  </div>
                </div>

                {/* Button */}
                <div className="mt-5 pl-4 mb-6">
                
                {!buttonHide && (
                <>
                  {Admin || DivisionManager || PortManager || GSO || SuperHacker ? null : (
                    <p className="note-form mb-4"><span> Note: </span> You can still edit the form after it has been submitted. However, once the supervisor approves it, the form will no longer be editable. </p>
                  )}

                  {/* Submit */}
                  <button 
                    // form="fac_submit"
                    type="submit"
                    className={`py-2 px-4 text-base ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Loading</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>
    
                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => setConfirmation(false)} className="ml-2 py-2 px-4 text-base btn-cancel-form">
                      Revise
                    </button>
                  )}
                </>
                )}
                </div>

            </form>
          </div>
          ):(
          <div className="form-container">
            {/* Title */}
            <div className="px-4">
              <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
              <p className="text-xs font-bold text-red-500">* - fields that need to be filled out</p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2">

              {/* 1st Column */}
              <div className="col-span-1 px-4">

                {/* Date */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="form-title"> 
                      Date: 
                    </label> 
                  </div>
                  <div className="w-full">
                    <input 
                      type="text" 
                      name="rep_date" 
                      id="rep_date" 
                      value={formatDate(today)} 
                      className="block w-full ppa-form-field"
                      disabled
                    />
                  </div>
                </div>

                {/* Property Number */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_property_no" className="form-title"> 
                      Property Number: 
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="rep_property_no"
                      id="rep_property_no"
                      autoComplete="rep_property_no"
                      value={propertyNo}
                      onChange={ev => setPropertyNo(ev.target.value)}
                      maxLength={255}
                      className="block w-full ppa-form-field"
                    />
                    {!propertyNo && inputErrors.property_number && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Acquisition Date */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_acquisition_date" className="form-title">    
                      Acquisition Date:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="date"
                      name="rep_acquisition_date"
                      id="rep_acquisition_date"
                      value={acquisitionDate}
                      onChange={ev => setAcquisitionDate(ev.target.value)}
                      max={currentDate}
                      className="block w-full ppa-form-field"
                    />
                    {!acquisitionDate && inputErrors.acquisition_date && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Acquisition Cost */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_acquisition_cost" className="form-title">
                      Acquisition Cost:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="relative flex items-center">
                      <span className="absolute top-4 left-0 flex items-center pl-2 text-gray-600">
                        ₱
                      </span>
                      <input
                        type="text"
                        name="rep_acquisition_cost"
                        id="rep_acquisition_cost"
                        autoComplete="rep_acquisition_cost"
                        value={acquisitionCost}
                        onChange={ev => {
                          const inputVal = ev.target.value;
                          // Allow only numeric input
                          if (/^\d*(\.\d{0,2})?$/.test(inputVal.replace(/,/g, ''))) {
                            setAcquisitionCost(inputVal.replace(/,/g, ''));
                          }
                        }}
                        className="block w-full ppa-form-field cost"
                      />
                    </div>
                    {!acquisitionCost && inputErrors.acquisition_cost && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Brand/Model */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_brand_model" className="form-title">
                      Brand/Model:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="brand_mrep_brand_model"
                      id="rep_brand_model"
                      autoComplete="rep_brand_model"
                      value={BrandModel}
                      maxLength={255}
                      onChange={ev => setBrandModel(ev.target.value)}
                      className="block w-full ppa-form-field"
                    />
                    {!BrandModel && inputErrors.brand_model && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Serial/Engine No */}
                <div className="items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_serial_engine_no" className="form-title">                  
                      Serial/Engine No.:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="rep_serial_engine_no"
                      id="rep_serial_engine_no"
                      autoComplete="rep_serial_engine_no"
                      value={SerialEngineNo}
                      maxLength={255}
                      onChange={ev => setSerialEngineNo(ev.target.value)}
                      className="block w-full ppa-form-field"
                    />
                    {!SerialEngineNo && inputErrors.serial_engine_no && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

              </div>

              {/* 2nd Column */}
              <div className="col-span-1 px-4">

                {/* Type of Property */}
                <div className="items-center mt-4">
                  <div className="w-full">
                    <label htmlFor="rep_type_of_property" className="flex form-title">
                      Type of Property:
                      {(!typeOfProperty && inputErrors.type_of_property) ? (
                        <p className="form-validation">This form is required</p>
                      ):( <p className="form-validation"> * </p> )}
                    </label> 
                  </div>
                  <div className="w-full">
                    <select 
                    name="rep_type_of_property" 
                    id="rep_type_of_property" 
                    autoComplete="rep_type_of_property"
                    value={typeOfProperty}
                    onChange={ev => {
                      setTypeOfProperty(ev.target.value);
                    }}
                    className={`block w-full ${(inputErrors.type_of_property) ? "ppa-form-error":"ppa-form-field"}`}
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                      <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="items-center mt-4">
                  <div className="w-full">
                    <label htmlFor="rep_description" className="flex form-title">
                      Description:
                      {(!propertyDescription && inputErrors.property_description) ? (
                        <p className="form-validation">This form is required</p>
                      ):( <p className="form-validation"> * </p> )}
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="rep_description"
                      id="rep_description"
                      value={propertyDescription}
                      maxLength={255}
                      onChange={ev => setPropertyDescription(ev.target.value)}
                      className={`block w-full ${(inputErrors.property_description) ? "ppa-form-error":"ppa-form-field"}`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="items-center mt-4">
                  <div className="w-full">
                    <label htmlFor="rep_location" className="flex form-title">
                      Location (Div/Section/Unit):
                      {(!propertyLocation && inputErrors.location) ? (
                        <p className="form-validation">This form is required</p>
                      ):( <p className="form-validation"> * </p> )}
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="rep_location"
                      id="rep_location"
                      value={propertyLocation}
                      maxLength={255}
                      onChange={ev => setPropertyLocation(ev.target.value)}
                      className={`block w-full ${(inputErrors.location) ? "ppa-form-error":"ppa-form-field"}`}
                    />
                  </div>
                </div>

                {/* Complain / Defect */}
                <div className="items-center mt-4">
                  <div className="w-full">
                    <label htmlFor="rep_complain" className="flex form-title">
                      Complain/Defect:
                      {(!ComplainDefect && inputErrors.complain) ? (
                        <p className="form-validation">This form is required</p>
                      ):( <p className="form-validation"> * </p> )}
                    </label> 
                  </div>
                  <div className="w-full">
                  <textarea
                    id="rep_complain"
                    name="rep_complain"
                    value={ComplainDefect}
                    style={{ resize: 'none', height: '134px' }}
                    maxLength={500}
                    onChange={ev => setComplainDefect(ev.target.value)}
                    className={`block w-full ${(inputErrors.complain) ? "ppa-form-error":"ppa-form-field"}`}
                  />
                  </div>
                </div>

                {/* Supervisor */}
                {(Admin || DivisionManager|| PortManager) ? null : (
                  <div className="items-center mt-4">
                    <div className="w-full">
                      <label htmlFor="rep_type_of_property" className="flex form-title">
                        Immediate Supervisor:
                        {(!selectedSupervisor.id && inputErrors.supervisor_id) ? (
                          <p className="form-validation">This form is required</p>
                        ):( <p className="form-validation"> * </p> )}
                      </label> 
                    </div>
                    <div className="w-full">
                      <select 
                      name="rep_supervisor" 
                      id="rep_supervisor" 
                      value={selectedSupervisor.id}
                      onChange={ev => {
                        const supervisorId = ev.target.value;
                        const supervisorData = supervisor.supervisorData.find(sup => sup.id === parseInt(supervisorId));
                        
                        setSelectedSupervisor(supervisorData ? { id: supervisorData.id, name: supervisorData.name } : { id: '', name: '' });
                      }}
                      className={`block w-full ${(inputErrors.supervisor_id) ? "ppa-form-error":"ppa-form-field"}`}
                      >
                        <option value="" disabled>Select your supervisor</option>
                        {supervisor?.supervisorData?.map((Data) => (
                          <option key={Data.id} value={Data.id}>
                            {Data.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

              </div>

              
            </div>

            {/* Button */}
            <div className="mt-10 pl-4 pb-4">
              {/* Check Form */}
              <button 
                onClick={handleConfirm} 
                className="py-2 px-4 text-base btn-default-form">
                Submit
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup
          popupContent={popupContent}
          popupMessage={popupMessage}
          justClose={justClose}
          closePopup={closePopup}
        />
      )}

    </PageComponent>
  );
}