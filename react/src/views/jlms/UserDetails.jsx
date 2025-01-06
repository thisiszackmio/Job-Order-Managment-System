import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import submitAnimation from '/default/ring-loading.gif';
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';


export default function UserDetailsJLMS(){

  const { currentUserId, userCode } = useUserStateContext();

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Loading
  const [loadingArea, setLoadingArea] = useState(true);

  const [userDet, getUserDet] = useState([]);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const popupClass = 'popup-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } 
    else {
      removePopupClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup]);

  const {id} = useParams();

  // Get User Detail
  useEffect(() => {
    axiosClient
    .get(`/userdetail/${id}`)
    .then((response) => {
      const userDet = response.data;

      // Clerance Label
      const clearanceLabels = {
        'MEM': 'Member',
        'HACK': 'SuperAdmin',
        'AM': 'AdminManager',
        'PM': 'PortManager',
        'DM': 'DivisionManager',
        'PT': 'ProcurementTeam',
        'AP': 'Assign Personnel',
      };

      const cc = userDet.code_clearance.split(',').map(code => clearanceLabels[code.trim()] || code).join(', ');

      getUserDet({...userDet, cc});
    })
    .finally(() => {
      setLoadingArea(false);
    });
  }, [id]);

  // Variable
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mname, setMname] = useState('');
  const [position, setPosition] = useState('');
  const [division, setDivision] = useState('');
  const [username, setUsername] = useState('');
  const [uploadedAvatarName, setUploadAvatarName] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');
  const [uploadedEsigName, setUploadedEsigName] = useState('');
  const [uploadEsig, setUploadEsig] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [getpassword, setPassword] = useState('');

  // Function
  const [actionInProgress, setActionInProgress] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [enableEditUser, setEditUser] = useState(false);
  const [enableCC, setChangeCC] = useState(false);
  const [enableAvatar, setChangeAvatar] = useState(false);
  const [enableEsig, setChangeEsig] = useState(false);
  const [enablePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Cancel Form
  const handleCancel = () => {
    setEditUser(false);
    setChangeCC(false);
    setChangeEsig(false);
    setChangeAvatar(false);
    setChangePassword(false);
    setActionInProgress(false);
  };

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

  // Delete Account
  const handleDeleteConfirmation = () => {
    setShowPopup(true);
    setPopupContent('delete_user');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">If you delete this, Bye-Bye.</p>
      </div>
    );
  } 

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Divisions
  const divisions = [
    "Administrative Division",
    "Finance Division",
    "Office of the Port Manager",
    "Port Service Division",
    "Port Police Division",
    "Engineering Service Division",
    "Terminal Management Office - Tubod"
  ];

  //Submit Button on Update User Details
  function SubmitUserDetails(e){
    e.preventDefault();

    const logs = `${currentUserId.firstname} has updated ${userDet.firstname} ${userDet.lastname}'s user detail information.`;

    setSubmitLoading(true);

    const updateUserData = {
      firstname: fname ? fname : userDet.firstname,
      middlename: mname ? mname : userDet.middlename,
      lastname: lname ? lname : userDet.lastname,
      position: position ? position : userDet.position,
      division: division ? division : userDet.division,
      username: username ? username : userDet.username,
      logs : logs
    }

    const checkInputFields = [fname, mname, lname, position, division, username].some(Boolean);

    if(!checkInputFields){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered.</p>
        </div>
      );
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`updatedetail/${id}`, updateUserData)
      .then(() => {
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The user information has been updated</p>
          </div>
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // User not found
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">User not Found!</p>
              <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
            </div>
          );
        } else if (error.response && error.response.status === 204){
          // Something wrong on submitting
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">There is something wrong</p>
              <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
            </div>
          );
        } else {
          // System Error
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }

  }

  //Submit Button on Update Code Clearance
  function SubmitCodeClearance(e){
    e.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.firstname} has updated ${userDet.firstname} ${userDet.lastname}'s user code clearance.`;

    axiosClient
    .put(`updatecc/${id}`, {
      code_clearance: selectedRoles.join(', '),
      logs: logs
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The code clearance has been updated</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // User not found
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">User not Found!</p>
            <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
          </div>
        );
      } else if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        // Empty Fields
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Field is required</p>
            <p className="popup-message">You have left a field empty. A value must be entered.</p>
          </div>
        );
      } else {
        // System Error
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Button on Update Avatar
  function SubmitAvatar(e){
    e.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.firstname} has updated ${userDet.firstname} ${userDet.lastname}'s user avatar.`;

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('avatar', uploadAvatar);
    formData.append('logs', logs);

    axiosClient
    .post(`updateaavatar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The user avatar has been updated</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // User not found
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">User not Found!</p>
            <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
          </div>
        );
      } else if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        // Empty Fields
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Field is required</p>
            <p className="popup-message">You have left a field empty. A value must be entered.</p>
          </div>
        );
      } else {
        // System Error
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Button on Update Esig
  function SubmitEsig(e){
    e.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.firstname} has updated ${userDet.firstname} ${userDet.lastname}'s user e-signature.`;

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('esig', uploadEsig);
    formData.append('logs', logs);

    axiosClient
    .post(`updateesig/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">The user avatar has been updated</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // User not found
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">User not Found!</p>
            <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
          </div>
        );
      } else if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        // Empty Fields
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(
          <div>
            <p className="popup-title">Field is required</p>
            <p className="popup-message">You have left a field empty. A value must be entered.</p>
          </div>
        );
      } else {
        // System Error
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Button on Update Password
  function SubmitPwd(e){
    e.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUserId.firstname} has updated ${userDet.firstname} ${userDet.lastname}'s user password.`;

    if(!getpassword){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Field is required</p>
          <p className="popup-message">You have left a field empty. A value must be entered.</p>
        </div>
      );
      setSubmitLoading(false);
    }else{
      axiosClient
      .put(`updatepassword/${id}`, {
        password: getpassword,
        logs: logs
      })
      .then(() => {
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">The password has been updated</p>
          </div>
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // User not found
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">User not Found!</p>
              <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
            </div>
          );
        } else if (error.response && error.response.status === 204){
          // Something wrong on submitting
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">There is something wrong</p>
              <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
            </div>
          );
        } else if (error.response && error.response.status === 422) {
          // Empty Fields
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">Field is required</p>
              <p className="popup-message">You have left a field empty. A value must be entered.</p>
            </div>
          );
        } else {
          // System Error
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }

  }

  // Delete the account
  function handleDeleteClick(id){
    setSubmitLoading(true);

    const logs = `${currentUserId.firstname} has removed ${userDet.firstname} ${userDet.lastname} from the database.`;

    axiosClient
    .delete(`/deleteuser/${id}`, {
      params: { logs: logs }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Account deleted successfully</p>
        </div>
      );
    })
    .catch(() => {
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Popup Button Function
  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("HACK") || codes.includes("GSO") || codes.includes("AM") || codes.includes("PM") || codes.includes("DM");
  const SuperAdmin = codes.includes("HACK");

  return(
    Authorize ? (
      <PageComponent title="Employee Details">
        {/* Main Content */}
        <div className="font-roboto">
          {loadingArea ? (
            <div className="flex justify-center items-center">
              <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
              <span className="loading-table">Loading Employee Details</span>
            </div>
          ):(
          <>
            {/* Button */}
            <div className="flex">
              {/* Back to User */}
              <button className="py-2 px-4 btn-default">
                <Link to="/userlist">Back to User List</Link>
              </button>
              {(userDet?.status != 0 && SuperAdmin) ? (
              <>
                {/* Update Details */}
                <button 
                  onClick={() => {
                    setEditUser(true); 
                    setActionInProgress(true);
                  }} 
                  className="ml-2 py-2 px-4 btn-default"
                  disabled={actionInProgress}
                >
                  Update Details
                </button>

                {/* Change Code Clearance */}
                <button 
                  onClick={() => {
                    setChangeCC(true);
                    setActionInProgress(true);
                  }} 
                  className="ml-2 py-2 px-4 btn-default"
                  disabled={actionInProgress}
                >
                  Change CC
                </button>

                {/* Change Avatar */}
                <button 
                  onClick={() => {
                    setChangeAvatar(true);
                    setActionInProgress(true);
                  }} 
                  className="ml-2 py-2 px-4 btn-default"
                  disabled={actionInProgress}
                >
                  Change Avatar
                </button>

                {/* Change Esig */}
                <button 
                  onClick={() => {
                    setChangeEsig(true);
                    setActionInProgress(true);
                  }} 
                  className="ml-2 py-2 px-4 btn-default"
                  disabled={actionInProgress}
                >
                  Change Esig
                </button>

                {/* Change Password */}
                <button 
                  onClick={() => {
                    setChangePassword(true);
                    setActionInProgress(true);
                  }} 
                  className="ml-2 py-2 px-4 btn-default"
                  disabled={actionInProgress}
                >
                  Change Password
                </button>

                {/* Delete Account User */}
                {userDet.id === 1 ? null : (
                  <button
                    onClick={() => handleDeleteConfirmation()} 
                    className="ml-2 py-2 px-4 btn-cancel"
                  >
                    Delete User
                  </button>
                )}
              </>
              ):null}
            </div>

            {/* Employee List */}
            <div className="grid grid-cols-2 gap-4 mt-10">

            {/* User Details */}
            <div className="col-span-1">

              {/* Account Status*/}
              <div className="flex items-center">
                <div className="w-56">
                  <label className="block text-lg font-bold leading-6 text-gray-900">
                    User Status:
                  </label> 
                </div>
                <div className="w-full pl-1 text-lg">
                  {userDet?.status != 0 ? ("Active"):("Deleted")}
                </div>
              </div>

              {/* Name (If deleted) */}
              {userDet?.status == 0 ? (
              <div className="flex items-center mt-5">
                <div className="w-56">
                  <label className="block text-lg font-bold leading-6 text-gray-900">
                    Name:
                  </label> 
                </div>
                <div className="w-full pl-1 text-lg">
                  {userDet.name}
                </div>
                    
              </div>
              ):null}

              {userDet?.status != 0 ? (
              <>
                {/* User ID */}
                <div className="flex items-center mt-5">
                  <div className="w-56">
                    <label className="block text-lg font-bold leading-6 text-gray-900">
                      User ID:
                    </label> 
                  </div>
                  <div className="w-full pl-1 text-lg">
                    {userDet?.id}
                  </div>
                </div>

                {/* User Details Form */}
                <form id="user_details" onSubmit={SubmitUserDetails}>

                  {/* Name */}
                  <div className="flex items-center mt-5">
                    <div className="w-56">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        Name:
                      </label> 
                    </div>
                    {enableEditUser ? (
                      <div className="w-full">
                        <div className="flex flex-col space-y-2">

                          {/* First Name */}
                          <input
                            type="text"
                            name="ppa-fname"
                            id="ppa-fname"
                            value={fname}
                            onChange={ev => setFname(ev.target.value)}
                            placeholder={userDet.firstname}
                            className="w-full ppa-form"
                          />

                          {/* Middle Initial */}
                          <input
                            type="text"
                            name="ppa-mname"
                            id="ppa-mname"
                            value={mname}
                            onChange={ev => setMname(ev.target.value)}
                            placeholder={userDet.middlename}
                            className="w-full ppa-form"
                          />

                          {/* Last Name */}
                          <input
                            type="text"
                            name="ppa-lname"
                            id="ppa-lname"
                            value={lname}
                            onChange={ev => setLname(ev.target.value)}
                            placeholder={userDet.lastname}
                            className="w-full ppa-form"
                          />
                        </div>
                      </div>
                    ):(
                      <div className="w-full pl-1 text-lg">
                        {userDet.name}
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  <div className="flex items-center mt-5">
                    <div className="w-56">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                      Position:
                      </label> 
                    </div>
                    {enableEditUser ? (
                      <div className="w-full">
                        <input
                          type="text"
                          name="ppa-position"
                          id="ppa-position"
                          value={position}
                          onChange={ev => setPosition(ev.target.value)}
                          placeholder={userDet.position}
                          className="w-full ppa-form"
                        />
                      </div>
                    ):(
                      <div className="w-full pl-1 text-lg">
                        {userDet.position}
                      </div>
                    )}       
                  </div>

                  {/* Division */}
                  <div className="flex items-center mt-5">
                    <div className="w-56">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                      Division:
                      </label> 
                    </div>
                    {enableEditUser ? (
                      <div className="w-full">
                        <select 
                          name="ppa-division" 
                          id="ppa-division"
                          value={division}
                          onChange={ev => setDivision(ev.target.value)}
                          className="block w-full ppa-form"
                        >
                          <option value="" disabled style={{ color: '#A9A9A9' }}>Choose Division</option>
                          {divisions
                            .filter(div => div !== userDet.division)
                            .map(div => (
                              <option key={div} value={div}>{div}</option>
                            ))
                          }
                        </select>
                      </div>
                    ):(
                      <div className="w-full pl-1 text-lg">
                        {userDet.division}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex items-center mt-5">
                    <div className="w-56">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                      Username:
                      </label> 
                    </div>
                    {enableEditUser ? (
                      <div className="w-full">
                        <input
                          type="text"
                          name="ppa-username"
                          id="ppa-username"
                          value={username}
                          onChange={ev => setUsername(ev.target.value)}
                          placeholder={userDet.username}
                          className="w-full ppa-form"
                        />
                      </div>
                    ):(
                      <div className="w-full">
                        <div className="w-full pl-1 text-lg">
                        {userDet.username}
                        </div>
                      </div>
                    )}
                  </div>

                </form>
              
                {/* Code Clearance */}
                <form id="user_code" onSubmit={SubmitCodeClearance}>
                  <div className="flex items-center mt-5">
                    <div className="w-56">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        Code Clearance:
                      </label> 
                    </div>
                    {enableCC ? (
                      <div className="w-full">

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

                        {/* For PT - Procurement Team */}
                        <div className="relative flex items-center font-roboto mt-2">
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

                        {/* For HACK - IT Superadmin */}
                        <div className="relative flex items-center font-roboto mt-2">
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
                    ):(
                      <div className="w-full pl-1 text-lg">
                        {userDet.cc}
                      </div> 
                    )}     
                  </div>
                </form>
              </>
              ):null}

              {/* Avatar */}
              {enableAvatar && (
                <form id="user_avatar" onSubmit={SubmitAvatar} method="POST" action="#" encType="multipart/form-data">
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
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Esignature */}
              {enableEsig && (
                <form id="user_esig" onSubmit={SubmitEsig} action="#" method="POST" encType="multipart/form-data">
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
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Password */}
              {enablePassword && (
                <form id="user_pwd" onSubmit={SubmitPwd} action="#" method="POST">
                  <div className="flex items-center mt-10">
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
                </form>
              )}

            </div>

            {/* User Avatar and E-sig */}
            {userDet?.status != 0 ? (
              <div className="col-span-1 flex flex-col items-center">
                {/* Avatar */}
                <div>
                  <img src={userDet.avatar} onContextMenu={(e) => e.preventDefault()} draggable="false" className="user-image" alt="" />
                </div>
                {/* Esig */}
                <div className="esig-area flex flex-col items-center border-b border-black relative">
                  <img src={userDet.esig} alt="User Signature" className="ppa-esignature-prf" onContextMenu={(e) => e.preventDefault()} draggable="false" />
                  <span className="text-base font-bold ppa-user-name">{userDet.name}</span>
                </div>
              </div>
            ):null}

            </div>

            {/* Submit Button */}
            <div className="flex mt-10">

            {/* Submit button on Register User's */}
            <div>
              {enableEditUser && (
              <>
                {/* Submit */}
                <button 
                  form="user_details"
                  type="submit"
                  className={`py-2 px-4 ${ submitLoading ? 'process-btn' : 'btn-default' }`}
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
                
                {/* Delete Account User */}
                {!submitLoading && (
                  <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                    Cancel
                  </button>
                )}
                
              </>
              )}
            </div>

            {/* Submit button on  Code Clearance */}
            <div>
              {enableCC && (
              <>
                {/* Submit */}
                <button 
                  form="user_code"
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
                
                {/* Delete Account User */}
                {!submitLoading && (
                  <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                    Cancel
                  </button>
                )}
              </>
              )}
            </div>

            {/* Submit button on Avatar */}
            <div>
              {enableAvatar && (
              <>
                {/* Submit */}
                <button 
                  form="user_avatar"
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
                
                {/* Delete Account User */}
                {!submitLoading && (
                  <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                    Cancel
                  </button>
                )}
              </>
              )}
            </div>

            {/* Submit button on Esig */}
            <div>
              {enableEsig && (
              <>
                {/* Submit */}
                <button 
                  form="user_esig"
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
                
                {/* Delete Account User */}
                {!submitLoading && (
                  <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                    Cancel
                  </button>
                )}
              </>
              )}
            </div>

            {/* Submit button on Password */}
            <div>
              {enablePassword && (
              <>
                {/* Submit */}
                <button 
                  form="user_pwd"
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
                
                {/* Delete Account User */}
                {!submitLoading && (
                  <button onClick={handleCancel} className="ml-2 py-2 px-4 btn-cancel">
                    Cancel
                  </button>
                )}
              </>
              )}
            </div>

            </div>
          </>
          )}
        </div>

        {/* Popup */}
        {showPopup && (
          <Popup
            popupContent={popupContent}
            popupMessage={popupMessage}
            user={userDet?.id}
            handleDeleteUser={handleDeleteClick}
            justClose={justClose}
            closePopup={closePopup}
            submitLoading={submitLoading}
            submitAnimation={submitAnimation}
          />
        )}

      </PageComponent>
    ):(
      (() => { window.location = '/unauthorize'; return null; })()
    )
  )
}