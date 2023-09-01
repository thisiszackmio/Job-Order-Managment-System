import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useState } from "react";
import { useNavigate  } from 'react-router-dom';

export default function DeploymentofPersonel(){
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

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if(typeOfRequest === 'Equipment' || typeOfRequest === 'Computer' || typeOfRequest === 'Furniture' || typeOfRequest === 'Vehicle'){
      console.log(
        "Type of Request:", inspection,
        "\nDate:", inspectionDate,
        "\nProperty No.:", propertyNo,
        "\nAcquisitaion Date:", acquisitionDate,
        "\nAcquisition Cost:", acquisitionCost,
        "\nBrand/Model:", BrandModel,
        "\nSerial/Model No.:", SerialEngineNo,
        "\nType of Property:", typeOfProperty,
        "\nSpecify:", propertySpecify,
        "\nDescription:", propertyDescription,
        "\nLocation (Div/Section/Unit):", propertyDescription,
        "\nComplaint/Defect:", ComplainDefect
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
                      onChange={ev => setTypeOfProperty(ev.target.value)}
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
                </div>
              </div>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Facility' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Request for the use of Facility / Venue </h2>
              {/* -- */}
              <div className="mt-6">
              <label htmlFor="request_div" className="block text-sm font-medium leading-6 text-gray-900"> Requesting Office/Division : </label>
                <input
                  type="text"
                  name="request_div"
                  id="request_div"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Vehicle Request Slip' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Vehicle Request Slip </h2>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Use of Manlift' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Request for the use of Manlift </h2>
            </div>
            )}
            {/* End here */}

            {/* For Request for the use of Facility / Venue */}
            {typeOfRequest === 'Others' && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900"> 
                Request for Repair/Troubleshooting and Deployment of Personnel 
              </h2>
            </div>
            )}
            {/* End here */}
            
            {typeOfRequest !== ''  && (
              <div className="mt-4">
                <button 
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </PageComponent>
  )
}