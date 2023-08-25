import PageComponent from "../components/PageComponent";
import React, { useState } from "react";
//import { useForm, useFieldArray } from "react-hook-form";

export default function DeploymentofPersonel(){
  const currentDate = new Date();
  //const requestDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
  const requestDate = currentDate.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', });

  const [typeOfService, setTypeOfService] = useState('');
  const [typeOfRepair, setTypeOfRepair] = useState('');
  const [detailRepair, setDetailRepair] = useState('');
  const [locationRepair, setLocationRepair] = useState('');
  const [typeOfPersonnel, setTypeOfPersonnel] = useState('');
  const [detailPersonnel, setDetailPersonnel] = useState('');
  const [personnelPurpose, setPersonnelPurpose] = useState('');
  const [locationPersonnel, setLocationPersonnel] = useState('');
  const [detailSupply, setDetailSupply] = useState('');
  const [noOfSupply, setNoOfSupply] = useState('');

  const [showInputField, setShowInputField] = useState(false);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // For Repair/Check-up
  const handleTypeRepair = (ev) => {
    const selectedValue = ev.target.value;
    setTypeOfRepair(selectedValue);
    setShowInputField(ev.target.value !== '')
  }

  const handleDetailRepair = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setDetailRepair(capitalizedValue);
  }

  const handleLocationRepair = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setLocationRepair(capitalizedValue);
  }

  const isButtonVisibleOnRepair = detailRepair !== '' && locationRepair !== '';

  // For Deployment of Personnel
  const handleTypePersonel = (ev) => {
    const selectedValue = ev.target.value;
    setTypeOfPersonnel(selectedValue);
    setShowInputField(ev.target.value !== '')
  }

  const handleDetailPersonnel = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setDetailPersonnel(capitalizedValue);
  }

  const handlePersonnelPurpose = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setPersonnelPurpose(capitalizedValue);
  }

  const handleLocationPersonnel = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setLocationPersonnel(capitalizedValue);
  }

  const isButtonVisibleOnDeployment = detailPersonnel !== '' && personnelPurpose !== '' && locationPersonnel !== '';

  // For Supplies

  const handleDetailSupply = (ev) => {
    const capitalizedValue = capitalizeFirstLetter(ev.target.value);
    setDetailSupply(capitalizedValue);
  }

  const isButtonVisibleOnSupplies = detailSupply !== '' && noOfSupply !== '';

  // Testing for the output
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the selected data
  
    console.log(
      "Type of Service:", typeOfService,
      "\nDate:", requestDate,
      "\nRepair/Checkup: {",
      "\nType of Repair/Checkup:", typeOfRepair,
      "\nDetails on Repair/Checkup:", detailRepair,
      "\nLocation on Repair/Checkup:", locationRepair,
      "\n}",
      "\nDeployment of Personnel: {",
      "\nType of Personnel:", typeOfPersonnel,
      "\nDetails on Personnel:", detailPersonnel,
      "\nPurpose:", personnelPurpose,
      "\nLocation on Deployment of Personnel:", locationPersonnel,
      "\n}",
      "\nSupplies: {",
      "\nDetails on Supplies:", detailSupply,
      "\nNo of Supplies:", noOfSupply,
      "\n}"
    )

  };


  return(
    <PageComponent title="Request For Repair/Troubleshooting (Equipment/Facility) and Deployment of Personnel">
      <form onSubmit={handleSubmit}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="first-name" className="block text-lg font-medium text-gray-900"> Select Request </label>
              <div className="mt-2">
                <select 
                  name="dps_request" 
                  id="dps_request" 
                  autoComplete="request-name" 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  value={typeOfService} 
                  onChange={ev => setTypeOfService(ev.target.value)}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Repair/Checkup">Repair/Checkup</option>
                  <option value="Deployment of Personel">Deployment of Personel</option>
                  <option value="Supplies">Supplies</option>
                </select>
              </div>
              
              {/* Conditional Forms Here */}

              {/*For the REPAIR/CHECKUP*/}
              {typeOfService === 'Repair/Checkup' && (
                <div className="mt-10">
                  <div className="sm:col-span-3">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Type of Repair/Checkup </h2>

                    {/* Select Type of Repair */}
                    <div className="mt-4">
                    <select 
                      name="repair_type" 
                      id="repair_type"
                      value={typeOfRepair} 
                      onChange={handleTypeRepair}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >

                      <option value="" disabled> Type of Repair/Checkup </option>
                      <option value="Equipment"> Equipment </option>
                      <option value="Computer"> Computer </option>
                      <option value="Furniture"> Furniture </option>
                      <option value="Vehicle"> Vehicle </option>
                      <option value="Facility"> Facility </option>
                      <option value="Others"> Others </option>
                  
                    </select>

                    {/* Input the Details */}
                    {typeOfService === 'Repair/Checkup' && showInputField && (
                      <div className="mt-10">
                        <div className="sm:col-span-3">
                          <h2 className="text-base font-semibold leading-7 text-gray-900">Select Repair/Checkup: <b><i>{typeOfRepair}</i></b></h2>
                          <div className="mt-4">
                            <label htmlFor="details" className="block text-sm font-medium leading-6 text-gray-900"> Details: Observation / Description of Defect </label>
                            <div className="mt-2">
                              <textarea
                                id="repair_details"
                                name="repair_details"
                                rows={3}
                                value={detailRepair}
                                onChange={handleDetailRepair}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Input the Location */}
                          <div className="mt-4">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900"> Location </label>
                            <div className="mt-2">
                            <input
                              type="text"
                              name="repair_location"
                              id="repair_location"
                              value={locationRepair}
                              onChange={handleLocationRepair}
                              autoComplete="given-location"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                          </div>   
                        </div>
                      </div>
                    )}
                    </div>

                    {isButtonVisibleOnRepair  && (
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
              )}
              {/* End of Repair/Checkup */}

              {/*For the DEPLOYMENT OF PERSONNEL*/}
              {typeOfService === 'Deployment of Personel' && (
                <div className="mt-10">
                  <div className="sm:col-span-3">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Type of Deployment Of Personel </h2>

                    {/* Select Type of Repair */}
                    <div className="mt-4">
                      <select 
                        name="assist_type" 
                        id="assist_type"
                        value={typeOfPersonnel}
                        onChange={handleTypePersonel}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled> Type of Assistance </option>
                        <option value="Technical Assistance"> Technical Assistance </option>
                        <option value="Janitorial Assistance"> Janitorial Assistance </option>
                        <option value="Other"> Other </option>
                        
                      </select>
                      
                      {/* Input the Details */}
                      {typeOfService === 'Deployment of Personel' && showInputField && (
                        <div className="mt-10">
                          <div className="sm:col-span-3">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Select Personal Deployment: <b><i>{typeOfPersonnel}</i></b> </h2>
                            <div className="mt-4">
                              <label htmlFor="assist_details" className="block text-sm font-medium leading-6 text-gray-900"> Details: Name or No. of Personnel </label>
                              <div className="mt-2">
                                <textarea
                                  id="assist_details"
                                  name="assist_details"
                                  rows={3}
                                  value={detailPersonnel}
                                  onChange={handleDetailPersonnel}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              <label htmlFor="assist_purpose" className="block text-sm font-medium leading-6 text-gray-900"> Purpose: </label>
                              <div className="mt-2">
                                <textarea
                                  id="assist_purpose"
                                  name="assist_purpose"
                                  rows={2}
                                  value={personnelPurpose}
                                  onChange={handlePersonnelPurpose}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            {/* Input the Location */}
                            <div className="mt-10">
                              <div className="sm:col-span-3">
                                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900"> Location </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="assist_location"
                                    id="assist_location"
                                    value={locationPersonnel}
                                    onChange={handleLocationPersonnel}
                                    autoComplete="given-location"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                      {isButtonVisibleOnDeployment  && (
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
              )}  
              {/*End for DEPLOYMENT OF PERSONNEL*/}  

              {/*For the Supplies*/}
              {typeOfService === 'Supplies' && (
                <div className="mt-10">
                  {/* Input the Details */}
                    <div className="sm:col-span-3">
                      <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Supplies </h2>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="details" className="block text-sm font-medium leading-6 text-gray-900"> Details: </label>
                      <div className="mt-2">
                        <textarea
                          id="supply_details"
                          name="supply_details"
                          rows={3}
                          value={detailSupply}
                          onChange={handleDetailSupply}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* Input the No. of Supplies */}
                    <div className="mt-10">
                      <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900"> No. of Supplies </label>
                      <div className="mt-2">
                      <input
                        type="number"
                        id="supply_no"
                        name="supply_no"
                        value={noOfSupply}
                        onChange={ev => setNoOfSupply(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Enter a number"
                      />
                      </div>
                    </div>
                    {isButtonVisibleOnSupplies  && (
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
              )}
              {/* End Of Supplies */}
          </div>
        </div>
      </form>
    </PageComponent>
  )
}