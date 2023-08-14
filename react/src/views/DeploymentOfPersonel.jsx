import PageComponent from "../components/PageComponent";
import React, { useState } from "react";
//import { useForm, useFieldArray } from "react-hook-form";


const options = {
  option1: ['Equipment', 'Computer', 'Furniture', 'Vehicle', 'Facility', 'Others'],
  option2: ['Technical Assistance', 'Janitorial Assistance', 'Others'],
};

const optionNames = {
  option1: 'Repair/Checkup',
  option2: 'Deployment of Personel',
  option3: 'Supplies',
}

export default function DeploymentofPersonel(){

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedSubOption, setSelectedSubOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [TextareaValue, setTextareaValue] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setSelectedSubOption('');
    setInputValue('');
    setTextareaValue('');
  };

  const handleSubOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSubOption(selectedValue);
  };

  const handleInputChange = (event) => {
    const inputText = event.target.value;
    setInputValue(inputText.toUpperCase());   
  };

  const handleTextareChange = (event) => {
    const Textarea = event.target.value;
    setTextareaValue(Textarea.toUpperCase());
    setShowSubmit(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the selected data
    console.log("Submitted:", selectedOption, selectedSubOption, inputValue, TextareaValue);
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
                  value={selectedOption} 
                  onChange={handleOptionChange}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="option1">Repair/Checkup</option>
                  <option value="option2">Deployment of Personel</option>
                  <option value="option3">Supplies</option>
                </select>
              </div>
              
              {/* Conditional Forms Here */}

              {/* For the REPAIR/CHECKUP only */}
              {selectedOption === 'option1' && (
                <div className="mt-10">
                  <div className="sm:col-span-3">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900"> {optionNames[selectedOption]} </h2>

                    {/* Select Type of Repair */}
                    <div className="mt-4">
                    <select 
                      value={selectedSubOption} 
                      onChange={handleSubOptionChange} 
                      name="repair_type" 
                      id="repair_type"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="" disabled> Type of Repair/Checkup </option>
                      {options[selectedOption].map((subOption) => (
                        <option key={subOption} value={subOption}>
                          {subOption}
                        </option>
                      ))}
                    </select>

                    {/* Input the Details */}
                    {selectedSubOption && selectedOption === 'option1' && (
                      <div className="mt-10">
                        <div className="sm:col-span-3">
                          <h2 className="text-base font-semibold leading-7 text-gray-900">Selected: {selectedSubOption}</h2>
                          <div className="mt-4">
                            <label htmlFor="details" className="block text-sm font-medium leading-6 text-gray-900"> Details: Observation / Description of Defect </label>
                            <div className="mt-2">
                              <textarea
                                id="repair_details"
                                name="repair_details"
                                rows={3}
                                value={inputValue}
                                onChange={handleInputChange}
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
                              value={TextareaValue}
                              onChange={handleTextareChange}
                              autoComplete="given-location"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              )}

              {/* For the DEPLOYMENT OF PERSONNEL only */}
              {selectedOption === 'option2' && (
                <div className="mt-10">
                  <div className="sm:col-span-3">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900"> {optionNames[selectedOption]} </h2>

                    {/* Select Type of Repair */}
                    <div className="mt-4">
                      <select 
                        value={selectedSubOption} 
                        onChange={handleSubOptionChange} 
                        name="assist_type" 
                        id="assist_type"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled> Type of Assistance </option>
                        {options[selectedOption].map((subOption) => (
                          <option key={subOption} value={subOption}>
                            {subOption}
                          </option>
                        ))}
                      </select>
                      
                      {/* Input the Details */}
                      {selectedSubOption && selectedOption === 'option2' && (
                        <div className="mt-10">
                          <div className="sm:col-span-3">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Selected: {selectedSubOption}</h2>
                            <div className="mt-4">
                              <label htmlFor="details" className="block text-sm font-medium leading-6 text-gray-900"> Details: Name or No. of Personnel </label>
                              <div className="mt-2">
                                <textarea
                                  id="assist_details"
                                  name="assist_details"
                                  rows={3}
                                  value={inputValue}
                                  onChange={handleInputChange}
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
                                    value={TextareaValue}
                                    onChange={handleTextareChange}
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
                  </div>
                </div>
              )}    

          </div>
        </div>
        {showSubmit  && (
          <div className="mt-4">
            {/* Additional form fields or components for the selected suboption */}
            <button 
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </PageComponent>
  )
}