import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";

export default function UserRegistrationJLMS(){

  const { currentUserCode } = useUserStateContext();

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

  // Variable
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState('');
  const [position, setPosition] = useState('');
  const [uploadedAvatarName, setUploadAvatarName] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');
  const [uploadedEsigName, setUploadedEsigName] = useState('');
  const [uploadEsig, setUploadEsig] = useState('');
  const [division, setDivision] = useState('');
  const [getusername, setUsername] = useState('');
  const [getpassword, setPassword] = useState('');
  const [passwordCorfirmation, setPasswordConfirmation] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Capitalize the first letter
  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Get The Avatar Image
  const handleAvatarChange = (e) => {
    const selectedAvatarFile = e.target.files[0];
    setUploadAvatarName(selectedAvatarFile.name);
    setUploadAvatar(selectedAvatarFile);
  }

  // Get The Esig Image
  const handleEsigChange = (e) => {
    const selectedEsigFile = e.target.files[0];
    setUploadedEsigName(selectedEsigFile.name);
    setUploadEsig(selectedEsigFile);
  }

  // Code Clearance
  const handleCheckboxChange = (e, role) => {
    const isChecked = e.target.checked;
    setSelectedRoles((prevRoles) => {
      if (isChecked) {
        // Add the role to the array if it is checked
        return [...prevRoles, role];
      } else {
        // Remove the role from the array if it is unchecked
        return prevRoles.filter((r) => r !== role);
      }
    });
  };

  // Function
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState('');
  const [inputErrors, setInputErrors] = useState({});

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit the Form
  function onSubmit(e){
    e.preventDefault();
    setSubmitLoading(true);

    //const remarks = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has registered ${fname} ${mname}. ${lname}'s account`;

    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("middlename", middleName);
    formData.append("lastname", lastName);
    formData.append("gender", gender);
    formData.append("division", division);
    formData.append("position", position);
    formData.append("code_clearance", selectedRoles.join(', '));
    formData.append("esig", uploadEsig);
    formData.append("avatar", uploadAvatar);
    formData.append("username", getusername);
    formData.append("password", getpassword);
    formData.append("consfirmPassword", passwordCorfirmation);
    formData.append("status", 2);

    // Axios Client
    axiosClient.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Custom-Header": "value"
      },
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Register Complete!</p>
          <p className="popup-message">The new user has been added to the database.</p>
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
        const passwordErrors = error.response.data.error;
        setInputErrors(responseErrors);
        setPasswordNotMatch(passwordErrors);
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
    window.location.href = '/joms/userlist';
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("HACK");

  return(
    <PageComponent title="Add Employee">

      {/* Main Content */}
      {Authorize ? (
      <>
        <div className="font-roboto ppa-form-box bg-white">
          <div className="ppa-form-header"> Input Employee Details  </div>

          <div className="p-4">
            {/* Form */}
            <form onSubmit={onSubmit} action="#" method="POST" encType="multipart/form-data">

              <div className="grid grid-cols-2">

                {/* 1st Column */}
                <div className="col-span-1">

                  {/* Name Surname */}
                  <div className="flex items-center mt-4">
                    <div className="w-40">
                      <label htmlFor="ppd_name" className="form-title-text"> Name: </label> 
                    </div>

                    <div className="w-full flex">
                      <div className="w-full">
                        <input
                          id="ppa-lname"
                          name="ppa-lname"
                          type="text"
                          value={lastName}
                          onChange={ev => setLastName(capitalizeFirstLetter(ev.target.value))}
                          placeholder="Surname"
                          className={`block w-full ${(!lastName && inputErrors.lastname) ? "ppa-form-error":"ppa-form"}`}
                        />
                      </div>
                    </div>
                  </div>  

                  {/* Name First Name */}
                  <div className="flex items-center mt-2">
                    <div className="w-40"></div>
                    <div className="w-full flex">
                      <div className="w-full">
                        <input
                          id="ppa-fname"
                          name="ppa-fname"
                          type="text"
                          value={firstName}
                          onChange={ev => setFirstName(capitalizeFirstLetter(ev.target.value))}
                          placeholder="First Name"
                          className={`block w-full ${(!firstName && inputErrors.firstname) ? "ppa-form-error":"ppa-form"}`}
                        />
                      </div>
                    </div>
                  </div> 

                  {/* Name Middle Initial */}
                  <div className="flex items-center mt-2">
                    <div className="w-40"></div>
                    <div className="w-full flex">
                      <div className="w-full">
                        <input
                          id="ppa-mname"
                          name="ppa-mname"
                          type="text"
                          value={middleName}
                          onChange={ev => setMiddleName(capitalizeFirstLetter(ev.target.value))}
                          maxLength={2}
                          placeholder="Middle Initial (e.g. A , Ll)"
                          className={`block w-full ${(!middleName && inputErrors.middlename) ? "ppa-form-error":"ppa-form"}`}
                        />
                        {!lastName && !firstName && !middleName && inputErrors.lastname && inputErrors.firstname && inputErrors.middlename ? (
                          <p className="form-validation">Please Input the given name</p>
                        ):!lastName && inputErrors && inputErrors.lastname ? (
                          <p className="form-validation">Last name is empty</p>
                        ):!firstName && inputErrors && inputErrors.firstname ? (
                          <p className="form-validation">First name is empty</p>
                        ):!middleName && inputErrors && inputErrors.middlename ? (
                          <p className="form-validation">Middle initial is required</p>
                        ):null}

                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="rep_property_no" className="form-title-text">
                        Gender:
                      </label> 
                    </div>
                    <div className="w-full">
                      <select 
                        name="gender" 
                        id="gender"
                        value={gender}
                        onChange={ev => setGender(ev.target.value)}
                        className={`block w-full ${(!gender && inputErrors.gender) ? "ppa-form-error":"ppa-form"}`}
                      >
                        <option value="" disabled style={{ color: '#A9A9A9' }}>Choose Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {!gender && inputErrors && inputErrors.gender && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div> 

                  {/* Position */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="ppa-position" className="form-title-text">
                        Position:
                      </label> 
                    </div>
                    <div className="w-full">
                      <input
                        id="ppa-position"
                        name="ppa-position"
                        type="text"
                        value={position}
                        onChange={ev => setPosition(capitalizeFirstLetter(ev.target.value))}
                        placeholder="Division Manager A"
                        className={`block w-full ${(!position && inputErrors.position) ? "ppa-form-error":"ppa-form"}`}
                      />
                      {!position && inputErrors && inputErrors.position && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Division */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="ppa-division" className="form-title-text">
                        Division:
                      </label> 
                    </div>
                    <div className="w-full">
                      <select 
                        name="ppa-division" 
                        id="ppa-division"
                        value={division}
                        onChange={ev => setDivision(ev.target.value)}
                        className={`block w-full ${(!division && inputErrors.division) ? "ppa-form-error":"ppa-form"}`}
                      >
                        <option value="" disabled style={{ color: '#A9A9A9' }}>Choose Division</option>
                        <option value="Administrative Division">Administrative Division</option>
                        <option value="Finance Division">Finance Division</option>
                        <option value="Office of the Port Manager">Office of the Port Manager</option>
                        <option value="Port Service Division">Port Service Division</option>
                        <option value="Port Police Division">Port Police Division</option>
                        <option value="Engineering Service Division">Engineering Service Division</option>
                        <option value="Terminal Management Office - Tubod">Terminal Management Office - Tubod</option>
                      </select>
                      {!division && inputErrors && inputErrors.division && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="ppa-username" className="form-title-text">
                        Username:
                      </label> 
                    </div>
                    <div className="w-full">
                      <input
                        id="ppa-username"
                        name="ppa-username"
                        type="text"
                        value={getusername}
                        onChange={ev => setUsername(ev.target.value)}
                        className={`block w-full ${(!getusername && inputErrors.username) ? "ppa-form-error":"ppa-form"}`}
                        autoComplete="new-username"
                      />
                      {!getusername && inputErrors && inputErrors.username && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="password" className="form-title-text">
                        Password:
                      </label> 
                    </div>
                    <div className="w-full relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={getpassword}
                        onChange={ev => setPassword(ev.target.value)}
                        className={`block w-full ${(!getpassword && inputErrors.password) ? "ppa-form-error":"ppa-form"}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bottom-0 px-3 h-full icon-form"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                      {!getpassword && inputErrors && inputErrors.password && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Password Confirmation*/}
                  <div className="flex items-center mt-2">
                    <div className="w-40">
                      <label htmlFor="rep_property_no" className="form-title-text">
                        Repeat Password:
                      </label> 
                    </div>
                    <div className="w-full relative">
                      <input
                        id="password"
                        name="password"
                        type={showPasswordConfirm ? 'text' : 'password'}
                        autoComplete="position"
                        value={passwordCorfirmation}
                        onChange={ev => setPasswordConfirmation(ev.target.value)}
                        className="block w-full ppa-form input-placeholder"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bottom-0 px-3 h-full icon-form"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      >
                        <FontAwesomeIcon icon={showPasswordConfirm ? faEyeSlash : faEye} />
                      </button>
                      {passwordNotMatch && (
                        <p className="form-validation">{passwordNotMatch}</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* 2nd Column */}
                <div className="col-span-1 pl-10">

                  {/* Avatar */}
                  <div className="items-center mt-4">
                    <div className="w-36">
                    <label htmlFor="ppa-avatar" className="form-title-text">
                        Upload Avatar:
                      </label> 
                    </div>

                    <div className="mt-2 w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <div className="mt-3 text-sm leading-6 text-gray-600">
                          <label htmlFor="ppa-avatar" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload your new avatar here</span>
                            <input 
                              id="ppa-avatar" 
                              name="ppa-avatar" 
                              type="file" 
                              accept=".png, .jpg, .jpeg"
                              className="sr-only" 
                              onChange={handleAvatarChange}  
                            />
                          </label>
                        </div>
                        <p className="pl-1 text-sm">PNG, JPG and JPEG only up to 2MB</p>
                        {uploadedAvatarName &&  <label for="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedAvatarName}</label> }
                        {!uploadedAvatarName && inputErrors && inputErrors.avatar && (
                          <p className="form-validation">This form is required</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Esig */}
                  <div className="items-center mt-2">
                    <div className="w-36">
                    <label htmlFor="ppa-esignature" className="form-title-text">
                        Upload Esig:
                      </label> 
                    </div>

                    <div className="mt-2 w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <div className="mt-3 text-sm leading-6 text-gray-600">
                          <label htmlFor="ppa-esignature" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload your new esig here</span>
                            <input 
                              id="ppa-esignature" 
                              name="ppa-esignature" 
                              type="file" 
                              accept=".png"
                              className="sr-only" 
                              onChange={handleEsigChange}  
                            />
                          </label>
                        </div>
                        <p className="pl-1 text-sm">PNG only up to 2MB</p>
                        {uploadedEsigName &&  <label for="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedEsigName}</label> }
                        {!uploadedEsigName && inputErrors && inputErrors.esig && (
                          <p className="form-validation">This form is required</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Code Clearance */}
                  <div className="items-center mt-2">

                    <div className="font-roboto">
                      <label htmlFor="rf_request" className="form-title-text">
                        Code Clearance:
                      </label> 
                    </div>

                    <div className="grid grid-cols-2">

                      {/* 1st Column */}
                      <div className="col-span-1">

                        {/* For PM - Port Manager */}
                        <div className="relative flex items-center font-roboto mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="pm-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('PM')}
                              onChange={(e) => handleCheckboxChange(e, 'PM')}
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
                        <div className="relative flex items-center font-roboto mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="am-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('AM')}
                              onChange={(e) => handleCheckboxChange(e, 'AM')}
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
                        <div className="relative flex items-center font-roboto mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="dm-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('DM')}
                              onChange={(e) => handleCheckboxChange(e, 'DM')}
                              className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="dm-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                              Division Manager (DM)
                            </label> 
                          </div>
                        </div>

                        {/* For GSO - General Service Officer */}
                        <div className="relative flex items-center font-roboto mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="gso-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('GSO')}
                              onChange={(e) => handleCheckboxChange(e, 'GSO')}
                              className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="gso-checkbox" className="block text-base font-medium leading-6 text-gray-900">
                              General Service Officer (GSO)
                            </label> 
                          </div>
                        </div>

                      </div>

                      {/* 2nd Column */}
                      <div className="col-span-1">

                        {/* For HACK - IT Superadmin */}
                        <div className="relative flex items-center font-roboto">
                          <div className="flex items-center h-5">
                            <input
                              id="hack-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('HACK')}
                              onChange={(e) => handleCheckboxChange(e, 'HACK')}
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
                        <div className="relative flex items-center font-roboto mt-2">
                          <div className="flex items-center h-5">
                            <input
                              id="mem-checkbox"
                              type="checkbox"
                              checked={selectedRoles.includes('MEM')}
                              onChange={(e) => handleCheckboxChange(e, 'MEM')}
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

                      {inputErrors && inputErrors.code_clearance && (
                        <p className="form-validation">This form is required</p>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* Button */}
              <div className="mt-10">
                {/* Submit */}
                <button 
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
                    'Submit'
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      </>
      ):(
      <Restrict />
      )}

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