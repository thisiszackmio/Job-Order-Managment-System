import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import submitAnimation from '../assets/bouncing.gif';

export default function RequestForm(){

  const { currentUser } = useUserStateContext();
  const [activeTab, setActiveTab] = useState("tab1");

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [inputErrors, setInputErrors] = useState({});

  //Get data from the database on PPD Regular Employees on requesting vehicles
  const [users, setUsers] = useState([]);
  const [sumbitLoading, setSubmitLoading] = useState(false);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    axiosClient.get('/ppausers')
      .then(response => {
        const usersData = response.data;
        setUsers(usersData); // Update state when data arrives
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //For Inspection Form
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

  const handleSupervisorName= (event) => {
    const selectedValue = event.target.value;
    setSupervisorApproval(selectedValue);
  
    const selectedIndex = event.target.selectedIndex;
    const selectedLabel = event.target.options[selectedIndex].text;
    setSelectedOptionValue(selectedLabel);
  };

  // Submit the Inspection Form
  const SubmitInspectionForm = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
      .post("/inspectionformrequest",{
        // For Inspect Submission
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
        setShowPopup(true);
        setPopupMessage("Form Submitted Successfully");    
        setSubmitLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          // If there are validation errors in the response, extract and store them.
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
        }
        console.error(error);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return(
    <PageComponent title="Request Form">

      <div className="flex">
        {/* Tab 1 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab1"
              ? "bg-gray-200 border-b-4 border-gray-800"
              : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Request for Repair Inspection
        </button>
        {/* Tab 2 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab2"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Request for use of Facility/Venue
        </button>
        {/* Tab 3 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab3"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab3")}
        >
          Request for Vehicle Slip
        </button>
        {/* Tab 4 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab4"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab4")}
        >
          Request for use of Manlift
        </button>
        {/* Tab 5 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab5"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab5")}
        >
          Other Request
        </button>
      </div>

      <div className="mt-4">
        {/* Tab 1 (Request For Repair Inspection) */}
        {activeTab === "tab1" && 
        <div className="mt-6">
          <form onSubmit={SubmitInspectionForm}>
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Part A: To be filled-up by Requesting Party </h2>
              <p className="text-xs font-bold leading-7 text-red-500">Please double check the form before submitting</p>
            </div>
          
            <div className="grid grid-cols-2 gap-4">

              <div className="col-span-1">

              {/* Date */}
              <div className="flex mt-6">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Date:
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="date"
                    name="insp_date"
                    id="insp_date"
                    value= {inspectionDate}
                    onChange={ev => setInspectionDate(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.date_of_request && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.date_of_request}</p>
                  )}
                </div>
              </div>

              {/* Property Number */}
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Property No. :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="property_no"
                    id="property_no"
                    autoComplete="property_no"
                    value={propertyNo}
                    onChange={ev => setPropertyNo(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.property_number && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.property_number}</p>
                  )}
                </div>
              </div>

              {/* Acquisition Date */}
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Acquisition Date :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="date"
                    name="acquisition_date"
                    id="acquisition_date"
                    value={acquisitionDate}
                    onChange={ev => setAcquisitionDate(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.acq_date && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.acq_date}</p>
                  )}
                </div>
              </div>

              {/* Acquisition Cost */}
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Acquisition Cost :
                  </label> 
                </div>
                <div className="w-64">
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
                    ₱
                  </span>
                  <input
                    type="text"
                    name="acquisition_cost"
                    id="acquisition_cost"
                    autoComplete="acquisition_cost"
                    value={acquisitionCost}
                    onChange={ev => setAcquisitionCost(ev.target.value)}
                    className="pl-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
                {inputErrors.acq_cost && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.acq_cost}</p>
                  )}
                </div>
              </div>

              {/* Brand/Model */}
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Brand/Model :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="brand_model"
                    id="brand_model"
                    autoComplete="brand_model"
                    value={BrandModel}
                    onChange={ev => setBrandModel(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.brand_model && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.brand_model}</p>
                  )}
                </div>
              </div>

              {/* Serial/Engine No */}
              <div className="flex mt-4">
                <div className="w-36">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Serial/Engine No. :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="serial_engine_no"
                    id="serial_engine_no"
                    autoComplete="serial_engine_no"
                    value={SerialEngineNo}
                    onChange={ev => setSerialEngineNo(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.serial_engine_no && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.serial_engine_no}</p>
                  )}
                </div>
              </div>

              </div>

              <div className="col-span-1">

              {/* Type of Property */}
              <div className="flex mt-6">
                <div className="w-60">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Type of Property :
                  </label> 
                </div>
                <div className="w-64">
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
                    <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                    <option value="Others">Others</option>
                  </select>
                  {inputErrors.type_of_property && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.type_of_property}</p>
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
              <div className="flex mt-4">
                <div className="w-60">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Description :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={propertyDescription}
                    onChange={ev => setPropertyDescription(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.property_description && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.property_description}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex mt-4">
                <div className="w-60">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Location (Div/Section/Unit) :
                  </label> 
                </div>
                <div className="w-64">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={propertyLocation}
                    onChange={ev => setPropertyLocation(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                  {inputErrors.location && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.location}</p>
                  )}
                </div>
              </div>

              {/* Complain / Defect */}
              <div className="flex mt-4">
                <div className="w-60">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Complain/Defect :
                  </label> 
                </div>
                <div className="w-64">
                <textarea
                  id="complain"
                  name="complain"
                  rows={2}
                  value={ComplainDefect}
                  onChange={ev => setComplainDefect(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                {inputErrors.complain && (
                    <p className="text-red-500 text-xs mt-2">{inputErrors.complain}</p>
                  )}
                </div>
              </div>

              {/* Supervisor Name */}
              <div className="flex mt-4">
                <div className="w-60">
                  <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
                    <span className="text-red-500">*</span>
                    Immediate Supervisor :
                  </label> 
                </div>
                <div className="w-64">
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
                {inputErrors.supervisor_name && (
                  <p className="text-red-500 text-xs mt-2">{inputErrors.supervisor_name}</p>
                )}
                </div>
              </div>

              </div>
                
            </div>
            
            {/* Submit Button */}
            <div className="mt-10">
              <p className="text-xs mb-4"><span className="text-red-500">*</span> Indicates required field</p>
            <button
              type="submit"
              className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                sumbitLoading ? 'bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
              disabled={sumbitLoading}
            >
              {sumbitLoading ? (
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Processing...</span>
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
           <div
             className="fixed inset-0 bg-black opacity-40" // Close on overlay click
           ></div>
           {/* Popup content with background blur */}
           <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
             <p className="text-lg">{popupMessage}</p>
             <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  window.location.href = `/my_request/${currentUser.id}`;
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
           </div>
          </div>
          )}
        </div>
        }

        {activeTab === "tab2" && <div>Coming Soon</div>}
        {activeTab === "tab3" && <div>Coming Soon</div>}
        {activeTab === "tab4" && <div>Coming Soon</div>}
        {activeTab === "tab5" && <div>Coming Soon</div>}
      </div>

    </PageComponent>
  );
};