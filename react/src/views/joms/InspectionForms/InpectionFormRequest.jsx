import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import Popup from "../../../components/Popup";

export default function RepairRequestForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  // Date
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");
  const DivisionManager = codes.includes("DM");

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
  const [loading, setLoading] = useState(true);

  const [supervisor, setSupervisor] = useState([]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

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
    })
    .finally(() => {
      setLoading(false);
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
      supervisor_status: Admin || DivisionManager || PortManager ? 1 : 0,
      admin_status: 0,
      inspector_status: 0,
      form_status: DivisionManager || PortManager ? 4 : Admin ? 5 : 0,
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
        setPopupMessage(DevErrorText);
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
      supervisor_status: Admin || DivisionManager || PortManager ? 1 : 0,
      admin_status: 0,
      inspector_status: 0,
      form_status: DivisionManager || PortManager ? 4 : Admin ? 5 : 0,
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
          <p className="popup-title">Submission Complete!</p>
          {Admin || DivisionManager || PortManager ? 
          <p className="popup-message">Waiting for the GSO to fill up the Part B form.</p> : 
          <p className="popup-message">Please wait for the supervisor's approval.</p>
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
    window.location.href = '/joms/myrequest';
  }

  return (
    <PageComponent title="Request Form">

      {/* Form Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Request For Pre/Post Inspection Repair </div>

        <div className="p-4">
          {confirmation ? (
          <>
            <form onSubmit={SubmitInspectionForm}>
              {/* Title */}
              <div>
                <h2 className="text-lg font-bold leading-7 text-gray-900">KINDLY double check your form PLEASE! </h2>
                <p className="text-sm font-bold text-red-500">NOTE: This will not be editable once submitted.</p>
              </div>

              <div className="grid grid-cols-2">

                {/* Part A left side */}
                <div className="col-span-1">
                  {/* Date */}
                  <div className="flex items-center mt-6">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900">
                      Date:
                      </label> 
                    </div>
                    <div className="w-1/2 ppa-form-view h-6">
                      {formatDate(today)}
                    </div>
                  </div>

                  {/* Property No */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Property No: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                    {propertyNo ? propertyNo : "N/A"}
                    </div>
                  </div>

                  {/* Acquisition Date */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Date: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                    {acquisitionDate ? formatDate(acquisitionDate) : "N/A"}
                    </div>
                  </div>

                  {/* Acquisition Cost */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Acquisition Cost: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {acquisitionCost ? new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP'
                      }).format(acquisitionCost) : "N/A" }
                    </div>
                  </div>

                  {/* Brand/Model */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Brand/Model: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {BrandModel ? BrandModel : "N/A"}
                    </div>
                  </div>

                  {/* Serial/Engine No */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Serial/Engine No: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {SerialEngineNo ? SerialEngineNo : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Part A left side */}
                <div className="col-span-1">
                  {/* Type of Property */}
                  <div className="flex items-center mt-6">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Type of Property: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {typeOfProperty}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Description: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {propertyDescription}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Location: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {propertyLocation}
                    </div>
                  </div>

                  {/* Supervisor */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label className="block text-base font-bold leading-6 text-gray-900"> Supervisor: </label> 
                    </div>
                    <div className="w-1/2 h-6 ppa-form-view">
                      {Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name}
                    </div>
                  </div>

                </div>

              </div>

              {/* Complain */}
              <div className="flex items-center mt-2">
                <div className="w-40">
                  <label className="block text-base font-bold leading-6 text-gray-900"> Complain: </label> 
                </div>
                <div className="w-3/4 h-6 ppa-form-view">
                  {ComplainDefect}
                </div>
              </div>

              {/* Button */}
              <div className="mt-10">
              {!buttonHide && (
              <>
                {/* Submit */}
                <button 
                  // form="fac_submit"
                  type="submit"
                  className={`py-2 px-4 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                  <button onClick={() => setConfirmation(false)} className="ml-2 py-2 px-4 btn-cancel-form">
                    Revise
                  </button>
                )}
              </>
              )}
              </div>
            </form>
          </>
          ):(
          <>
            {/* Part A */}
            <div>
              <h2 className="text-lg font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
              <p className="text-sm font-bold text-red-500">NOTE: This form cannot be edited after you submit your request.</p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2">

              {/* 1st Column */}
              <div className="col-span-1">

                {/* Date */}
                <div className="flex items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                      Date: 
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input 
                      type="date" 
                      name="rep_date" 
                      id="rep_date" 
                      defaultValue={today} 
                      onChange={ev => setInspectionDate(ev.target.value)}
                      className="block w-full ppa-form"
                      readOnly
                    />
                  </div>
                </div>

                {/* Property Number */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black"> Property Number: </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="rep_property_no"
                      id="rep_property_no"
                      autoComplete="rep_property_no"
                      value={propertyNo}
                      onChange={ev => setPropertyNo(ev.target.value)}
                      maxLength={255}
                      className="block w-full ppa-form"
                    />
                    {!propertyNo && inputErrors.property_number && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Acquisition Date */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_acquisition_date" className="block text-base font-medium leading-6 text-black">    
                      Acquisition Date:
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="date"
                      name="rep_acquisition_date"
                      id="rep_acquisition_date"
                      value={acquisitionDate}
                      onChange={ev => setAcquisitionDate(ev.target.value)}
                      max={currentDate}
                      className="block w-full ppa-form"
                    />
                    {!acquisitionDate && inputErrors.acquisition_date && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Acquisition Cost */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_acquisition_cost" className="block text-base font-medium leading-6 text-black">
                      Acquisition Cost:
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <div className="relative flex items-center">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
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
                        className="block w-full ppa-form cost"
                      />
                    </div>
                    {!acquisitionCost && inputErrors.acquisition_cost && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Brand/Model */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_brand_model" className="block text-base font-medium leading-6 text-black">
                      Brand/Model:
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="brand_mrep_brand_model"
                      id="rep_brand_model"
                      autoComplete="rep_brand_model"
                      value={BrandModel}
                      maxLength={255}
                      onChange={ev => setBrandModel(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!BrandModel && inputErrors.brand_model && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Serial/Engine No */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_serial_engine_no" className="block text-base font-medium leading-6 text-black">                  
                      Serial/Engine No.:
                    </label> 
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="rep_serial_engine_no"
                      id="rep_serial_engine_no"
                      autoComplete="rep_serial_engine_no"
                      value={SerialEngineNo}
                      maxLength={255}
                      onChange={ev => setSerialEngineNo(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!SerialEngineNo && inputErrors.serial_engine_no && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

              </div>

              {/* 2nd Column */}
              <div className="col-span-1">

                {/* Type of Property */}
                <div className="flex items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                      Type of Property:
                    </label> 
                  </div>
                  <div className="w-3/5">
                    <select 
                    name="rep_type_of_property" 
                    id="rep_type_of_property" 
                    autoComplete="rep_type_of_property"
                    value={typeOfProperty}
                    onChange={ev => {
                      setTypeOfProperty(ev.target.value);
                    }}
                    className="block w-full ppa-form"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                      <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                      <option value="Others">Others</option>
                    </select>
                    {!typeOfProperty && inputErrors.type_of_property && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_description" className="block text-base font-medium leading-6 text-black">
                      Description:
                    </label> 
                  </div>
                  <div className="w-3/5">
                    <input
                      type="text"
                      name="rep_description"
                      id="rep_description"
                      value={propertyDescription}
                      maxLength={255}
                      onChange={ev => setPropertyDescription(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!propertyDescription && inputErrors.property_description && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_location" className="block text-base font-medium leading-6 text-black">
                      Location (Div/Section/Unit):
                    </label> 
                  </div>
                  <div className="w-3/5">
                    <input
                      type="text"
                      name="rep_location"
                      id="rep_location"
                      value={propertyLocation}
                      maxLength={255}
                      onChange={ev => setPropertyLocation(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!propertyLocation && inputErrors.location && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Complain / Defect */}
                <div className="flex items-center mt-2">
                  <div className="w-40">
                    <label htmlFor="rep_complain" className="block text-base font-medium leading-6 text-black">
                      Complain/Defect:
                    </label> 
                  </div>
                  <div className="w-3/5">
                  <textarea
                    id="rep_complain"
                    name="rep_complain"
                    rows={3}
                    value={ComplainDefect}
                    style={{ resize: 'none' }}
                    maxLength={500}
                    onChange={ev => setComplainDefect(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                  {!ComplainDefect && inputErrors.complain && (
                    <p className="form-validation">This form is required</p>
                  )}
                  </div>
                </div>

                {/* Supervisor */}
                {(Admin || DivisionManager|| PortManager) ? null : (
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                        Immediate <br /> Supervisor:
                      </label> 
                    </div>
                    <div className="w-3/5">
                      <select 
                      name="rep_supervisor" 
                      id="rep_supervisor" 
                      value={selectedSupervisor.id}
                      onChange={ev => {
                        const supervisorId = ev.target.value;
                        const supervisorData = supervisor.supervisorData.find(sup => sup.id === parseInt(supervisorId));
                        
                        setSelectedSupervisor(supervisorData ? { id: supervisorData.id, name: supervisorData.name } : { id: '', name: '' });
                      }}
                      className="block w-full ppa-form"
                      >
                        <option value="" disabled>Select your supervisor</option>
                        {supervisor?.supervisorData?.map((Data) => (
                          <option key={Data.id} value={Data.id}>
                            {Data.name}
                          </option>
                        ))}
                      </select>
                      {!selectedSupervisor.id && inputErrors.supervisor_id && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Button */}
              <div className="mt-6">
                {/* Check Form */}
                <button 
                  onClick={handleConfirm} 
                  className="py-2 px-4 btn-default-form">
                  Submit
                </button>
              </div>
            </div>
          </>
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