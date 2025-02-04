import React, { useEffect, useState } from "react";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import { useUserStateContext } from "../../../context/ContextProvider";
import Popup from "../../../components/Popup";

export default function RepairRequestForm(){
  const { currentUserId, userCode } = useUserStateContext();

  // Get the avatar
  const dp = currentUserId?.avatar;
  const dpname = dp ? dp.substring(dp.lastIndexOf('/') + 1) : null;

  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const DivisionManager = codes.includes("DM");

  const [loading, setLoading] = useState(true);

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

  // Date
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

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

  const [supervisor, setSupervisor] = useState([]);
  const [gso, getGSO] = useState([]);
  const [inputErrors, setInputErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

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

  // Get GSO for notification
  useEffect(()=>{
    axiosClient
    .get(`/getgso`)
    .then((response) => {
      const gsoID = response.data.id;
      const gsoName = response.data.name;

      getGSO({gsoID, gsoName});
    })
    .finally(() => {
      setLoading(false);
    });
  },[]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit the Form
  function SubmitInspectionForm(event){
    event.preventDefault();

    setSubmitLoading(true);

    let remarks = Admin || DivisionManager ? 'Waiting for the GSO to fill out the Part B form' : 'Waiting for supervisor approval.' ;
    const notification = Admin || DivisionManager ? `${currentUserId.name} has submitted a request.` : `${currentUserId.name} has a request and needs your approval.`;
    
    const formData = {
      user_id: currentUserId.id,
      user_name: currentUserId.name,
      property_number: propertyNo,
      acquisition_date: acquisitionDate,
      acquisition_cost: acquisitionCost,
      brand_model: BrandModel,
      serial_engine_no: SerialEngineNo,
      type_of_property: typeOfProperty,
      property_description: propertyDescription,
      location: propertyLocation,
      complain: ComplainDefect,
      supervisor_id: Admin || DivisionManager ? currentUserId.id : selectedSupervisor.id,
      supervisor_name: Admin || DivisionManager ? currentUserId.name : selectedSupervisor.name,
      supervisor_status: Admin || DivisionManager ? 1 : 0,
      admin_status: 0,
      inspector_status: 0,
      form_status: DivisionManager ? 4 : Admin ? 5 : 0,
      form_remarks: remarks,
      
      //Notifications
      sender_avatar: dpname,
      sender_id: currentUserId.id,
      sender_name: currentUserId.name,
      notif_message: notification,
      receiver_id: Admin || DivisionManager ? gso.gsoID: selectedSupervisor.id,
      receiver_name: Admin || DivisionManager ? gso.gsoName : selectedSupervisor.name,
    };

    axiosClient
    .post("/submitinsprequest", formData)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Submission Complete!</p>
          {Admin || DivisionManager ? 
          <p className="popup-message">Waiting for the GSO to fill up the Part B form.</p> : 
          <p className="popup-message">Please wait for the supervisor's approval.</p>
          }
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 500) {
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

  // Popup Button Function
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

      {/* Main Content */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Request For Pre/Post Inspection Repair </div>
        <div className="p-4">

          <form onSubmit={SubmitInspectionForm}>

            {/* Part A */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
              <p className="text-xs text-red-500 font-bold">Please double check the form before submitting </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2">

              {/* 1st Column */}
              <div className="col-span-1">

                {/* Date */}
                <div className="flex items-center mt-6 ">
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
                <div className="flex items-center mt-4 ">
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
                      className="block w-full ppa-form"
                    />
                    {!propertyNo && inputErrors.property_number && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Acquisition Date */}
                <div className="flex items-center mt-4">
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
                <div className="flex items-center mt-4">
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
                <div className="flex items-center mt-4">
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
                      onChange={ev => setBrandModel(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!BrandModel && inputErrors.brand_model && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Serial/Engine No */}
                <div className="flex items-center mt-4">
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
                <div className="flex items-center mt-6">
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
                <div className="flex items-center mt-4">
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
                      onChange={ev => setPropertyDescription(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!propertyDescription && inputErrors.property_description && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mt-4">
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
                      onChange={ev => setPropertyLocation(ev.target.value)}
                      className="block w-full ppa-form"
                    />
                    {!propertyLocation && inputErrors.location && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>

                {/* Complain / Defect */}
                <div className="flex items-center mt-4">
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
                    onChange={ev => setComplainDefect(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                  {!ComplainDefect && inputErrors.complain && (
                    <p className="form-validation">This form is required</p>
                  )}
                  </div>
                </div>
                
                {/* Supervisor */}
                {Admin || DivisionManager ? null : (
                  <div className="flex items-center mt-4">
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

            </div>

            {/* Button */}
            <div className="mt-10">
              {/* Submit */}
              <button 
                type="submit"
                className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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