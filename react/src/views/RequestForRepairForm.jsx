import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function RepairRequestForm(){

  const {id} = useParams();
  const { currentUser } = useUserStateContext();

  const navigate = useNavigate ();

  //Restriction for accessing another form
  useEffect(() => {
    // Check the condition and redirect if necessary
    if (id !== currentUser.id) {
      navigate(`/repairrequestform/${currentUser.id}`);
    }
  }, [id, currentUser.id, navigate]);

  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];
  const [inputErrors, setInputErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [sumbitLoading, setSubmitLoading] = useState(false);

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Variables
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

  // Get Supervisor Names
  const fetchUsers = () => {
    axiosClient
    .get(`/getsupervisor/${id}`)
    .then((response) => {
      const responseData = response.data;
      const supDet = responseData.personnel_details;

      setUsers(supDet);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  };

  useEffect(()=>{ 
    fetchUsers(); 
  },[]);

  // Auto Approval for Supervisors and Manager
  let output;
  let admin;

  if (currentUser.code_clearance === 1 || currentUser.code_clearance === 2 || currentUser.code_clearance === 4) {
    output = 1;
    admin = 4;
  } else {
    output = 0;
    admin = 0;
  }

  // Submit Form
  const SubmitInspectionForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
      .post("/submitrepairformrequest",{
        // For Inspect Submission
        date_of_request: today,
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
        supervisor_name: 
        currentUser.code_clearance === 1 ? currentUser.id.toString() :
        currentUser.code_clearance === 2 ? currentUser.id.toString() : users.id.toString(),
        supervisor_approval: output,
        admin_approval: admin,
        inspector_status: 0
      })
      .then(() => { 
        setShowPopup(true);
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>Form submit successfully</p>
          </div>
        );    
        setSubmitLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          // If there are validation errors in the response, extract and store them.
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  return(
  <PageComponent title="Request on Pre/Post Repair Inspection Form">
  {id == currentUser.id && (
  <div>
    
    <form onSubmit={SubmitInspectionForm}>

      {/* Title */}
      <div>
        <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
        <p className="text-xs text-red-500">Please double check the form before submitting </p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">

          {/* Date */}
          <div className="flex items-center mt-6">
            <div className="w-36">
              <label htmlFor="rep_date" className="block text-base font-medium leading-6 text-gray-900">
                Date:
              </label> 
            </div>
            <div className="w-64">
              <input
                type="date"
                name="rep_date"
                id="rep_date"
                defaultValue= {today}
                onChange={ev => setInspectionDate(ev.target.value)}
                // min={today}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                readOnly
              />
            </div>
          </div>

          {/* Property Number */}
          <div className="flex items-center mt-2">
            <div className="w-36">
              <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-gray-900">
                Property No.:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="rep_property_no"
                id="rep_property_no"
                autoComplete="rep_property_no"
                value={propertyNo}
                onChange={ev => setPropertyNo(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!propertyNo && inputErrors.property_number && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Acquisition Date */}
          <div className="flex items-center mt-2">
            <div className="w-36">
              <label htmlFor="rep_acquisition_date" className="block text-base font-medium leading-6 text-gray-900">    
                Acquisition Date:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="date"
                name="rep_acquisition_date"
                id="rep_acquisition_date"
                value={acquisitionDate}
                onChange={ev => setAcquisitionDate(ev.target.value)}
                max={currentDate}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!acquisitionDate && inputErrors.acq_date && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Acquisition Cost */}
          <div className="flex items-center mt-2">
            <div className="w-36">
              <label htmlFor="rep_acquisition_cost" className="block text-base font-medium leading-6 text-gray-900">
                
                Acquisition Cost: <span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
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
                  if (/^\d*$/.test(inputVal)) {
                    setAcquisitionCost(inputVal);
                  }
                }}
                className="pl-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
            {!acquisitionCost && inputErrors.acq_cost && (
              <p className="text-red-500 text-xs italic">This field must be required</p>
            )}
            </div>
          </div>

          {/* Brand/Model */}
          <div className="flex items-center mt-2">
            <div className="w-36">
              <label htmlFor="rep_brand_model" className="block text-base font-medium leading-6 text-gray-900">
                Brand/Model: <span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="brand_mrep_brand_modelodel"
                id="rep_brand_model"
                autoComplete="rep_brand_model"
                value={BrandModel}
                onChange={ev => setBrandModel(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!BrandModel && inputErrors.brand_model && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Serial/Engine No */}
          <div className="flex items-center mt-2">
            <div className="w-36">
              <label htmlFor="rep_serial_engine_no" className="block text-base font-medium leading-6 text-gray-900">                  
                Serial/Engine No.:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="rep_serial_engine_no"
                id="rep_serial_engine_no"
                autoComplete="rep_serial_engine_no"
                value={SerialEngineNo}
                onChange={ev => setSerialEngineNo(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!SerialEngineNo && inputErrors.serial_engine_no && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

        </div>

        <div className="col-span-1">

          {/* Type of Property */}
          <div className="flex items-center mt-6">
            <div className="w-60">
              <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-gray-900">
                Type of Property:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <select 
              name="rep_type_of_property" 
              id="rep_type_of_property" 
              autoComplete="rep_type_of_property"
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
                <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                <option value="Others">Others</option>
              </select>
              {!typeOfProperty && inputErrors.type_of_property && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
              {typeOfProperty === 'Others' && (
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">Specify:</label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="specify"
                    id="specify"
                    value={propertySpecify}
                    onChange={ev => setPropertySpecify(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center mt-2">
            <div className="w-60">
              <label htmlFor="rep_description" className="block text-base font-medium leading-6 text-gray-900">
                Description:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="rep_description"
                id="rep_description"
                value={propertyDescription}
                onChange={ev => setPropertyDescription(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!propertyDescription && inputErrors.property_description && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center mt-2">
            <div className="w-60">
              <label htmlFor="rep_location" className="block text-base font-medium leading-6 text-gray-900">
                Location (Div/Section/Unit):<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
              <input
                type="text"
                name="rep_location"
                id="rep_location"
                value={propertyLocation}
                onChange={ev => setPropertyLocation(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
              {!propertyLocation && inputErrors.location && (
                <p className="text-red-500 text-xs italic">This field must be required</p>
              )}
            </div>
          </div>

          {/* Complain / Defect */}
          <div className="flex items-center mt-2">
            <div className="w-60">
              <label htmlFor="rep_complain" className="block text-base font-medium leading-6 text-gray-900">
                Complain/Defect:<span className="text-red-500">*</span>
              </label> 
            </div>
            <div className="w-64">
            <textarea
              id="rep_complain"
              name="rep_complain"
              rows={2}
              value={ComplainDefect}
              style={{ resize: 'none' }}
              onChange={ev => setComplainDefect(ev.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
            {!ComplainDefect && inputErrors.complain && (
              <p className="text-red-500 text-xs italic">This field must be required</p>
            )}
            </div>
          </div>

        </div>

      </div>  

      {/* Submit Button */}
      <div className="mt-6">
        <p className="text-xs mb-4"><span className="text-red-500">*</span> Indicates required field</p>
        <button
          type="submit"
          className={`rounded-md px-2 py-2 text-base font-medium text-white shadow-sm focus:outline-none ${
            sumbitLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          disabled={sumbitLoading}
        >
          {sumbitLoading ? (
            <div className="flex items-center justify-center">
              <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
              <span className="ml-2">Processing</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </div> 

    </form>

    {/* Show Popup */}
    {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div className="fixed inset-0 bg-black opacity-40"></div>

        {/* Popup content with background blur */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>

        {/* Notification Icons */}
        <div class="f-modal-alert">
          <div class="f-modal-icon f-modal-success animate">
            <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
            <span class="f-modal-line f-modal-long animateSuccessLong"></span>
          </div>
        </div>

        {/* Message */}
        <p className="text-lg text-center">{popupMessage}</p>

        {/* Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              window.location.href = `/myrequestinpectionform/${currentUser.id}`;
            }}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded"
          >
            View my request
          </button>
        </div>

      </div>
    </div>
    )}

  </div>
  )}
  </PageComponent>
  );

}