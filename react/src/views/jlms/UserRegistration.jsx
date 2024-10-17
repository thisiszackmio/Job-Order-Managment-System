import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import submitAnimation from '../../assets/loading_nobg.gif';
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";

export default function UserRegistrationJLMS(){

  const { userCode } = useUserStateContext();

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
    formData.append("status", 1);

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
  const justclose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.href = '/userlist';
  }

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("HACK");

  return(
    Authorize ? (
      <PageComponent title="Add Employee">

        {/* Main Content */}
        <div className="font-roboto ppa-form-box">

          <div className="ppa-form-header"> Input Employee Details </div>
          <div style={{ padding: '6px 10px 50px 10px' }}>

            {/* Form */}
            <form onSubmit={onSubmit} action="#" method="POST" encType="multipart/form-data">

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
                          id="ppa-lname"
                          name="ppa-lname"
                          type="text"
                          value={lastName}
                          onChange={ev => setLastName(capitalizeFirstLetter(ev.target.value))}
                          placeholder="Surname"
                          className="block w-full ppa-form"
                        />
                        {!lastName && inputErrors && inputErrors.lastname && (
                          <p className="form-validation">This form is required</p>
                        )}
                      </div>
                    </div>
                  </div>  

                  {/* First Name */}
                  <div className="flex items-center mt-4 ">
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
                          className="block w-full ppa-form"
                        />
                        {!firstName && inputErrors && inputErrors.firstname && (
                          <p className="form-validation">This form is required</p>
                        )}
                      </div>
                    </div>
                  </div>  

                  {/* Middle Initial */}
                  <div className="flex items-center mt-4 ">
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
                          className="block w-full ppa-form"
                        />
                        {!middleName && inputErrors && inputErrors.middlename && (
                          <p className="form-validation">This form is required</p>
                        )}
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
                        value={gender}
                        onChange={ev => setGender(ev.target.value)}
                        className="block w-full ppa-form"
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
                  <div className="flex items-center mt-4">
                    <div className="w-40">
                      <label htmlFor="ppa-position" className="block text-base font-medium leading-6 text-black">
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
                        className="block w-full ppa-form"
                      />
                      {!position && inputErrors && inputErrors.position && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center mt-5">
                    <div className="w-36">
                    <label htmlFor="ppa-avatar" className="block text-base font-medium leading-6 text-black">
                        Upload Avatar:
                      </label> 
                    </div>

                    <div className="mt-2 w-80 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
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

                </div>

                {/* 2nd Column */}
                <div className="col-span-1">

                  {/* Division */}
                  <div className="flex items-center mt-4">
                    <div className="w-36">
                      <label htmlFor="ppa-division" className="block text-base font-medium leading-6 text-black">
                        Division:
                      </label> 
                    </div>
                    <div className="w-full">
                      <select 
                        name="ppa-division" 
                        id="ppa-division"
                        value={division}
                        onChange={ev => setDivision(ev.target.value)}
                        className="block w-full ppa-form"
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
                  <div className="flex items-center mt-4">
                    <div className="w-36">
                      <label htmlFor="ppa-username" className="block text-base font-medium leading-6 text-black">
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
                        className="block w-full ppa-form input-placeholder"
                        autoComplete="new-username"
                      />
                      {!getusername && inputErrors && inputErrors.username && (
                        <p className="form-validation">This form is required</p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center mt-4">
                    <div className="w-36">
                      <label htmlFor="password" className="block text-base font-medium leading-6 text-black">
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
                        className="block w-full ppa-form input-placeholder"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bottom-0 px-3 h-full icon-form"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                      {inputErrors && inputErrors && inputErrors.password && (
                        <p className="form-validation">This form is required</p>
                      )}
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

                  {/* Esig */}
                  <div className="flex items-center mt-5">
                    <div className="w-36">
                    <label htmlFor="ppa-esignature" className="block text-base font-medium leading-6 text-black">
                        Upload Esig:
                      </label> 
                    </div>

                    <div className="mt-2 w-80 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
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
                  <div className="relative flex items-center font-roboto">
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
                  <div className="relative flex items-center font-roboto">
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
                  <div className="relative flex items-center font-roboto">
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

                <div className="flex space-x-6 mt-6">

                  {/* For PT - Procurement Team */}
                  <div className="relative flex items-center font-roboto">
                    <div className="flex items-center h-5">
                      <input
                        id="pt-checkbox"
                        type="checkbox"
                        checked={selectedRoles.includes('PT')}
                        onChange={(e) => handleCheckboxChange(e, 'PT')}
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
                  <div className="relative flex items-center font-roboto">
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
                  <p className="form-validation mt-2">Code Clearance is required</p>
                )}

              </div>

              {/* Button */}
              <div className="mt-10">
                {/* Submit */}
                <button 
                  type="submit"
                  className={`ml-2 py-2 px-4 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <div className="flex">
                      <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                      <span className="ml-2">Loading</span>
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
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent black overlay with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            {/* Popup content */}
            <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
              {/* Notification Icons */}
              <div className="f-modal-alert">

                {/* Error */}
                {popupContent == 'error' && (
                  <div className="f-modal-icon f-modal-error animate">
                    <span className="f-modal-x-mark">
                      <span className="f-modal-line f-modal-left animateXLeft"></span>
                      <span className="f-modal-line f-modal-right animateXRight"></span>
                    </span>
                  </div>
                )}

                {/* Success */}
                {popupContent == 'success' && (
                  <div class="f-modal-icon f-modal-success animate">
                    <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                    <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                  </div>
                )}
                
              </div>
              {/* Popup Message */}
              <p className="text-lg text-center"> {popupMessage} </p>
              {/* Buttons */}
              <div className="flex justify-center mt-4">

                {/* Error Button */}
                {popupContent == 'error' && (
                  <button onClick={justclose} className="w-full py-2 btn-cancel">
                    Close
                  </button>
                )}

                {/* Success */}
                {popupContent == 'success' && (
                  <button onClick={closePopup} className="w-full py-2 btn-default">
                    Close
                  </button>
                )}

              </div>
            </div>
          </div>
        )}

      </PageComponent>
    ):(
      (() => { window.location = '/unauthorize'; return null; })()
    )
  );
}