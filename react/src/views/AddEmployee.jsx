import { useState } from "react";
import submitAnimation from '../assets/loading_nobg.gif';
import PageComponent from "../components/PageComponent";

export default function AddEmployee(){

  const [submitLoading, setSubmitLoading] = useState(false);

  return(
    <PageComponent title="Add Employee">
      <div className="font-roboto ppa-form-box">
        <form>

          <div className="ppa-form-header">
            Input Employee Details
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4" style={{ padding: '6px 10px 50px 10px' }}>

            {/* 1st Column */}
            <div className="col-span-1">

              {/* PPA Number */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppa_id" className="block text-base font-medium leading-6 text-black"> PPA ID: </label> 
                </div>
                <div className="w-3/4">
                  <input
                    type="text"
                    name="ppa_id"
                    id="ppa_id"
                    // value={propertyNo}
                    // onChange={ev => setPropertyNo(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppd_name" className="block text-base font-medium leading-6 text-black"> Name: </label> 
                </div>
                <div className="w-3/4 flex">

                  {/* Surname */}
                  <div className="w-3/4 mr-5">
                    <input
                      id="lname"
                      name="lname"
                      type="text"
                      // value={fname}
                      // onChange={ev => setFname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="Surname"
                      className="block w-full ppa-form"
                    />
                  </div>

                  {/* First Name */}
                  <div className="w-3/4 mr-5">
                    <input
                      id="fname"
                      name="fname"
                      type="text"
                      // value={fname}
                      // onChange={ev => setFname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="First Name"
                      className="block w-full ppa-form"
                    />
                  </div>

                  {/* Middle Initial */}
                  <div className="w-1/5">
                    <input
                      id="mname"
                      name="mname"
                      type="text"
                      // value={fname}
                      // onChange={ev => setFname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="M.I"
                      className="block w-full ppa-form"
                    />
                  </div>
                </div>
              </div>   

              {/* Gender */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Gender:
                  </label> 
                </div>
                <div className="w-3/4">
                  <select 
                    name="gender" 
                    id="gender"
                    // value={gender}
                    // onChange={ev => setGender(ev.target.value)}
                    className="block w-full ppa-form"
                    style={{ color: '#A9A9A9' }}
                  >
                    <option value="" disabled>Choose Gender</option>
                    <option value="Male" style={{ color: '#272727' }}>Male</option>
                    <option value="Female" style={{ color: '#272727' }}>Female</option>
                  </select>
                </div>
              </div> 

              {/* Division */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Division:
                  </label> 
                </div>
                <div className="w-3/4">
                  <select 
                    name="division" 
                    id="division"
                    // value={division}
                    // onChange={ev => setDivision(ev.target.value)}
                    className="block w-full ppa-form"
                    style={{ color: '#A9A9A9' }}
                  >
                    <option value="" disabled>Choose Division</option>
                    <option value="Administrative Division" style={{ color: '#272727' }}>Administrative Division</option>
                    <option value="Finance Division" style={{ color: '#272727' }}>Finance Division</option>
                    <option value="Office of the Port Manager" style={{ color: '#272727' }}>Office of the Port Manager</option>
                    <option value="Port Service Division" style={{ color: '#272727' }}>Port Service Division</option>
                    <option value="Port Police Division" style={{ color: '#272727' }}>Port Police Division</option>
                    <option value="Engineering Service Division" style={{ color: '#272727' }}>Engineering Service Division</option>
                    <option value="Terminal Management Office - Tubod" style={{ color: '#272727' }}>Terminal Management Office - Tubod</option>
                  </select>
                </div>
              </div>

              {/* Position */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Position:
                  </label> 
                </div>
                <div className="w-3/4">
                  <input
                    id="position"
                    name="position"
                    type="text"
                    autoComplete="position"
                    // value={jobPosition}
                    // onChange={ev => setJobPosition(capitalizeFirstLetter(ev.target.value))}
                    placeholder="Division Manager A"
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

            </div>

            {/* 2nd Column */}
            <div className="col-span-1">

              {/* Display Picture */}
              <div className="flex items-center mt-5">
                <div className="w-48">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Upload Display Picture:
                  </label> 
                </div>

                <div class="mt-2 w-3/4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1 py-2">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 text-sm leading-6 text-gray-600">
                      <label for="esignature" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload your display picture here</span>
                        <input 
                      
                          id="diplay_picture" 
                          name="diplay_picture" 
                          type="file" 
                          accept=".png"
                          class="sr-only" 
                          // onChange={handleFileChange}  
                        />
                      </label>
                    </div>
                    <p class="pl-1 text-sm">PNG only up to 2MB</p>
                    {/* {uploadedFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedFileName}</label> } */}
                  </div>
                </div>
              </div>

              {/* Electronic Signature */}
              <div className="flex items-center mt-5">
                <div className="w-48">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Upload E-Sig:
                  </label> 
                </div>

                <div class="mt-2 w-3/4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1 py-2">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 text-sm leading-6 text-gray-600">
                      <label for="esignature" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload your E-sig here</span>
                        <input 
                      
                          id="esignature" 
                          name="esignature" 
                          type="file" 
                          accept=".png"
                          class="sr-only" 
                          // onChange={handleFileChange}  
                        />
                      </label>
                    </div>
                    <p class="pl-1 text-sm">PNG only up to 2MB</p>
                    {/* {uploadedFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedFileName}</label> } */}
                  </div>
                </div>
              </div>
      
            </div>

          </div>

          {/* Button */}
          <button type="submit" className={`btn-submit ${ submitLoading && 'btn-submitting'}`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Processing</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>

        </form>
      </div>
    </PageComponent>
  );
};