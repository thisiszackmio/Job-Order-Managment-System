import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

export default function UserRegistrationJLMS(){

  // Function
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return(
    <PageComponent title="Add Employee">
      {/* Main Content */}
      <div className="font-roboto ppa-form-box">

        <div className="ppa-form-header"> Input Employee Details </div>
        <div style={{ padding: '6px 10px 50px 10px' }}>

          {/* Form */}
          <form action="">

            <div className="grid grid-cols-2 gap-12">

              {/* 1st Column */}
              <div className="col-span-1">

                {/* Name */}
                <div className="flex items-center mt-4 ">
                  <div className="w-40">
                    <label htmlFor="ppd_name" className="block text-base font-medium leading-6 text-black"> Name: </label> 
                  </div>

                  {/* Surname */}
                  <div className="w-full flex">
                    <div className="w-full">
                      <input
                        id="lname"
                        name="lname"
                        type="text"
                        // value={lname}
                        // onChange={ev => setLname(capitalizeFirstLetter(ev.target.value))}
                        placeholder="Surname"
                        className="block w-full ppa-form"
                      />
                    </div>
                  </div>
                </div>  

                {/* First Name */}
                <div className="flex items-center mt-4 ">
                  <div className="w-40"></div>
                  <div className="w-full flex">
                    <div className="w-full">
                      <input
                        id="lname"
                        name="lname"
                        type="text"
                        // value={lname}
                        // onChange={ev => setLname(capitalizeFirstLetter(ev.target.value))}
                        placeholder="First Name"
                        className="block w-full ppa-form"
                      />
                    </div>
                  </div>
                </div>  

                {/* Middle Initial */}
                <div className="flex items-center mt-4 ">
                  <div className="w-40"></div>
                  <div className="w-full flex">
                    <div className="w-full">
                      <input
                        id="lname"
                        name="lname"
                        type="text"
                        // value={lname}
                        // onChange={ev => setLname(capitalizeFirstLetter(ev.target.value))}
                        placeholder="Middle Initial"
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
                  <div className="w-full">
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

                {/* Position */}
                <div className="flex items-center mt-4">
                  <div className="w-40">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                      Position:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      id="position"
                      name="position"
                      type="text"
                      // value={jobPosition}
                      // onChange={ev => setJobPosition(capitalizeFirstLetter(ev.target.value))}
                      placeholder="Division Manager A"
                      className="block w-full ppa-form"
                    />
                    
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center mt-5">
                  <div className="w-36">
                  <label htmlFor="avatar" className="block text-base font-medium leading-6 text-black">
                      Upload Avatar:
                    </label> 
                  </div>

                  <div class="mt-2 w-80 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
                    <div class="text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                      </svg>
                      <div class="mt-3 text-sm leading-6 text-gray-600">
                        <label for="esignature" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Upload your new avatar here</span>
                          <input 
                            id="esignature" 
                            name="esignature" 
                            type="file" 
                            accept=".png, .jpg, .jpeg"
                            class="sr-only" 
                            // onChange={handleFileChange}  
                          />
                        </label>
                      </div>
                      <p class="pl-1 text-sm">PNG, JPG and JPEG only up to 2MB</p>
                      {/* {uploadedFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedFileName}</label> } */}
                    </div>
                  </div>
                </div>

              </div>

              {/* 2nd Column */}
              <div className="col-span-1">

                {/* Division */}
                <div className="flex items-center mt-4">
                  <div className="w-36">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                      Division:
                    </label> 
                  </div>
                  <div className="w-full">
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

                {/* Username */}
                <div className="flex items-center mt-4">
                  <div className="w-36">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                      Username:
                    </label> 
                  </div>
                  <div className="w-full">
                    <input
                      id="position"
                      name="position"
                      type="text"
                      // value={username}
                      // onChange={ev => setUsername(ev.target.value)}
                      className="block w-full ppa-form input-placeholder"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center mt-4">
                  <div className="w-36">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                      Password:
                    </label> 
                  </div>
                  <div className="w-full relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      // value={password}
                      // onChange={ev => setPassword(ev.target.value)}
                      className="block w-full ppa-form input-placeholder"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bottom-0 px-3 h-full icon-form"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Password Confirmation*/}
                <div className="flex items-center mt-4">
                  <div className="w-36">
                    <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                      Repeat Password:
                    </label> 
                  </div>
                  <div className="w-full relative">
                    <input
                      id="password"
                      name="password"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      autoComplete="position"
                      // value={passwordCorfirmation}
                      // onChange={ev => setPasswordConfirmation(ev.target.value)}
                      className="block w-full ppa-form input-placeholder"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bottom-0 px-3 h-full icon-form"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    >
                      <FontAwesomeIcon icon={showPasswordConfirm ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Esig */}
                <div className="flex items-center mt-5">
                  <div className="w-36">
                  <label htmlFor="avatar" className="block text-base font-medium leading-6 text-black">
                      Upload Esig:
                    </label> 
                  </div>

                  <div class="mt-2 w-80 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
                    <div class="text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                      </svg>
                      <div class="mt-3 text-sm leading-6 text-gray-600">
                        <label for="esignature" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Upload your new esig here</span>
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

            {/* Code Clearance */}
            <div>

              <div className="mt-6 font-roboto">
                <label htmlFor="rf_request" className="block text-base leading-6 text-black">
                  Code Clearance:
                </label> 
              </div>

              <div className="flex space-x-6 mt-6">

                {/* For PM - Port Manager */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="pm-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="pm-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      Port Manager (PM)
                    </label> 
                  </div>
                </div>

                {/* For AM - Admin Manager */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="am-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="am-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      Admin Manager (AM)
                    </label> 
                  </div>
                </div>

                {/* For DM - Division Manager */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="dm-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="dm-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      Division Manager (DM)
                    </label> 
                  </div>
                </div>

              </div>

              <div className="flex space-x-6 mt-6">

                {/* For PT - Procurement Team */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="pt-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="pt-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      Procurement Team (PT)
                    </label> 
                  </div>
                </div>

                {/* For HACK - IT Superadmin */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="hack-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="hack-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      IT People (HACK)
                    </label> 
                  </div>
                </div>

                {/* For MEM - Members (COS and Regular) */}
                <div className="relative flex items-center font-roboto">
                  <div className="flex items-center h-5">
                    <input
                      id="mem-checkbox"
                      type="checkbox"
                      className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="mem-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                      Members (MEM)
                    </label> 
                  </div>
                </div>

              </div>

            </div>

            {/* Button */}
            <div className="mt-10">
              {/* Edit Button */}
              <button className="btn-default">
                Submit
              </button>
            </div>
            
          </form>
        </div>

      </div>

    </PageComponent>
  );
}