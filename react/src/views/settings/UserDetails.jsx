import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import submitAnimation from '/default/ring-loading.gif';
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faGear, faEyeSlash, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";


export default function UserDetailsJLMS(){
  const { currentUserCode, currentUserName } = useUserStateContext();

  const {id} = useParams();

  // Date Time Format
  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';

    const dateObj = new Date(dateTimeString);

    // Date: Jun 18, 2025
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString(undefined, options);

    // Time: 2:45 pm
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'pm' : 'am';

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    const formattedTime = `${hours}:${minutes} ${amOrPm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

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

  const [submitLoading, setSubmitLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userDet, getUserDet] = useState([]);

  const [typeOfEdit, setTyprOfEdit] = useState('');
  const [defaultForm, setDefaultForm] = useState(false); 
  const [enableDetail, setEnableDetails] = useState(false);
  const [enableAccount, setEnableAccount] = useState(false);
  const [enableCodeClearance, setEnableCodeClearance] = useState(false);

  // For the Edit Details
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mname, setMname] = useState('');
  const [position, setPosition] = useState('');
  const [division, setDivision] = useState('');

  // Account
  const [username, setUsername] = useState('');
  const [getpassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Code Clearancce
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Avatar
  const [enableAvatar, setEnableAvatar] = useState(false);
  const [uploadedAvatarName, setUploadAvatarName] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');

  // Esig
  const [enableEsig, setEnableEsig] = useState(false);
  const [uploadedEsigName, setUploadedEsigName] = useState('');
  const [uploadEsig, setUploadEsig] = useState('');

  const [getSec, setGetSec] = useState([]);

  // Get User Active Login
  useEffect(() => {
    axiosClient
    .get(`/getsecurity/${id}`)
    .then((response) => {
      const security = response.data;

      setGetSec(security);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

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

  // Default Form
  useEffect(() => {
    setFname(userDet.firstname);
    setLname(userDet.lastname);
    setMname(userDet.middlename);
    setPosition(userDet.position);
    setUsername(userDet.username);
  },[
    userDet.firstname,
    userDet.lastname,
    userDet.middlename,
    userDet.position,
    userDet.username
  ]);

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
        'AU': 'Authority Person',
        'NERD': 'SuperHacker'
      };

      const cc = userDet.code_clearance.split(',').map((code, index) => {
                    const label = clearanceLabels[code.trim()] || code.trim();
                    return <li className="ppa-user-code" key={index}>{label}</li>;
                  });

      getUserDet({...userDet, cc});
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id, loading]);

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

  // Get The Esig Image
  const handleEsigChange = (e) => {
    const selectedEsigFile = e.target.files[0];
    setUploadedEsigName(selectedEsigFile.name);
    setUploadEsig(selectedEsigFile);
  }

  // Get The Avatar Image
  const handleAvatarChange = (e) => {
    const selectedAvatarFile = e.target.files[0];
    setUploadAvatarName(selectedAvatarFile.name);
    setUploadAvatar(selectedAvatarFile);
  }

  // Edit Function
  function EditFunction(){
    switch(typeOfEdit){
      case 'UD':
        setEnableDetails(true);
        setDefaultForm(true); 
        break;

      case 'UP':
        setEnableAccount(true);
        setDefaultForm(true);
        break;

      case 'UC':
        setEnableCodeClearance(true);
        setDefaultForm(true);
        break;

      case 'UA':
        setEnableAvatar(true);
        setDefaultForm(true);
        break;

      case 'UE':
        setEnableEsig(true);
        setDefaultForm(true);
        break;

      default:
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage('There is no options');
        break;
    }
  }

  // Update Details
  function submitUpdateDetail(){
    setSubmitLoading(true);

    const UpdateData = {
      firstname: fname,
      lastname: lname,
      middlename: mname,
      position: position,
      division: division ? division : userDet.division,
      authority: currentUserName.name
    };

    axiosClient
    .put(`updatedetail/${id}`, UpdateData)
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
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Account
  function submitUpdateAccount(){
    setSubmitLoading(true);

    const UpdateAcc = {
      name: `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`,
      username,
      password: getpassword,
      authority: currentUserName.name
    };

    axiosClient
      .put(`updatepassword/${id}`, UpdateAcc)
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
          setPopupMessage(error.response.status);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  // Update Code Clearance
  function submitUpdateCodeClearance(){
    setSubmitLoading(true);

    axiosClient
    .put(`updatecc/${id}`, {
      code_clearance: selectedRoles.join(', '),
      name: `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`,
      authority: currentUserName.name
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
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Avatar
  function SubmitAvatar(e){
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('avatar', uploadAvatar);
    formData.append('name', `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`);
    formData.append('authority', currentUserName.name);

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
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Update Esig
  function SubmitEsig(e){
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('esig', uploadEsig);
    formData.append('name', `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`);
    formData.append('authority', currentUserName.name);

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
          <p className="popup-message">The user esign has been updated</p>
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
        setPopupMessage(error.response.status);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Remove Token
  function handleDeleteToken(id){
    setSubmitLoading(true);

    const logs = `${currentUserName.firstname} has removed ${userDet.firstname} session.`;

    axiosClient
    .delete(`/deletesecurity/${id}`, {
      params: { logs: logs }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Token remove successfully</p>
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
  
  // Delete the account
  function handleDeleteClick(id){
    setSubmitLoading(true);

    axiosClient
    .delete(`/deleteuser/${id}`, {
      params: { 
        name: `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`,
        authority: currentUserName.name
    }
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

  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setShowPopup(false);
    setLoading(true);
    setTyprOfEdit('');
    setDefaultForm(false);
    setEnableDetails(false);
    setEnableAccount(false);
    setEnableCodeClearance(false);
    setEnableAvatar(false);
    setEnableEsig(false);
    setUploadAvatarName('');
    setUploadAvatar('');
    setUploadedEsigName('');
    setUploadEsig('');
    setGetSec();
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperHacker = codes.includes("HACK") || codes.includes("NERD");

  return(
  <PageComponent title="Employee Details">

    {loading ? (
      <div className="flex items-left h-20 space-x-4">
        {/* Loading Animation */}
        <FontAwesomeIcon
          icon={faGear}
          className="text-4xl text-blue-700 gear"
        />
        <span className="loading">Loading...</span>
      </div>
    ):(
      SuperHacker ? (
      <>
        {/* Detail */}
        <div className="grid grid-cols-[64%_34%] gap-5 mt-6">
          
          {/* User Details */}
          <div>
            <div className="ppa-widget">
              <div className="joms-user-info-header text-left"> USER INFORMATION </div>
              <div className="px-4 pb-4">
                {!defaultForm && (
                <div className="ppa-form-header text-base flex justify-between items-center h-10">
                  <FontAwesomeIcon onClick={() => window.location.href = '/joms/userlist'}  className="icon-delete" title="Back to User List" icon={faLeftLong} />
                  <div className="flex space-x-3"> 
                    {userDet?.status != 0 && userDet?.id != 1 && (
                      <FontAwesomeIcon onClick={() => handleDeleteConfirmation()}  className="icon-delete" title="Delete User" icon={faTrash} />
                    )}
                  </div>
                </div>
                )}
                {/* Form Edit */}
                {userDet?.status != 0 && (
                  defaultForm ? (
                  <>
                    {/* Edit Details */}
                    {enableDetail && (
                      <div className="flex justify-end">
                        {/* Submit */}
                        <button
                          onClick={ () => { submitUpdateDetail() } }
                          className={`${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnableDetails(false);
                              setDefaultForm(false);
                              setTyprOfEdit('');
                            }} className="ml-2 btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {/* Edit Accounts */}
                    {enableAccount && (
                      <div className="flex justify-end">
                        {/* Submit */}
                        <button
                          onClick={ () => { submitUpdateAccount() } }
                          className={`${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnableAccount(false);
                              setDefaultForm(false);
                              setTyprOfEdit('');
                            }} className="ml-2 btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {/* Edit Code Clearancec */}
                    {enableCodeClearance && (
                      <div className="flex justify-end">
                        {/* Submit */}
                        <button
                          onClick={ () => { submitUpdateCodeClearance() } }
                          className={`${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnableCodeClearance(false);
                              setDefaultForm(false);
                              setTyprOfEdit('');
                            }} className="ml-2 btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {/* Edit Avatar */}
                    {enableAvatar && (
                      <div className="flex justify-end">
                        {/* Submit */}
                        <button 
                          form="user_avatar"
                          type="submit"
                          className={`${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnableAvatar(false);
                              setDefaultForm(false);
                              setTyprOfEdit('');
                            }} className="ml-2 btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {/* Edit Esig */}
                    {enableEsig && (
                      <div className="flex justify-end">
                        {/* Submit */}
                        <button 
                          form="user_esig"
                          type="submit"
                          className={`${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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

                        {/* Cancel */}
                        {!submitLoading && (
                          <button onClick={() => { 
                              setEnableEsig(false);
                              setDefaultForm(false);
                              setTyprOfEdit('');
                            }} className="ml-2 btn-cancel-form">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </>
                  ):(
                  <div className="grid grid-cols-[120px_1fr_auto] gap-3 items-center mt-4 w-full">
                    {/* Label */}
                    <label htmlFor="rep_type_of_property" className="form-title">
                      Edit Items:
                    </label>
                    {/* Select */}
                    <select 
                      name="rep_type_of_property" 
                      id="rep_type_of_property" 
                      autoComplete="rep_type_of_property"
                      value={typeOfEdit}
                      onChange={ev => setTyprOfEdit(ev.target.value)}
                      className="block w-full ppa-form-edit"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="UD">Update Details</option>
                      <option value="UP">Update Account</option>
                      <option value="UC">Update Code Clearance</option>
                      <option value="UA">Update Avatar</option>
                      <option value="UE">Update Esignature</option>
                    </select>

                    {/* Button */}
                    {typeOfEdit && (
                      <button 
                        onClick={EditFunction}
                        className="py-2 px-4 btn-default whitespace-nowrap"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                  )
                )}

                {/* Details */}
                <div className="mt-8">

                  {/* User Status*/}
                  <div className="flex items-center">
                    <div className="w-36">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        User Status:
                      </label> 
                    </div>
                    <div className="w-full pl-1 text-lg">
                      {(enableDetail || enableAccount || enableCodeClearance || enableAvatar || enableEsig) ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={
                              userDet?.status === 0
                              ? 'Deleted'
                              : userDet?.status === 1
                              ? 'Active'
                              : userDet?.status === 2
                              ? 'Need Activate'
                              : ''
                            }
                            disabled
                          />
                        </div>
                      ):(
                      <>
                        {userDet?.status == 0 && "Deleted"}
                        {userDet?.status == 1 && "Active"}
                        {userDet?.status == 2 && "Need Activate"}
                      </>
                      )}
                    </div>
                  </div>

                  {/* User ID*/}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        User ID:
                      </label> 
                    </div>
                    <div className="w-full pl-1 text-lg">
                      {(enableDetail || enableAccount || enableCodeClearance || enableAvatar || enableEsig) ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={userDet?.id}
                            disabled
                          />
                        </div>
                      ):(
                      <>
                        {userDet?.id}
                      </>
                      )}
                    </div>
                  </div>

                  {/* User Name*/}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        {enableDetail ? ("First Name:"):("User Name:")}
                      </label> 
                    </div>
                    <div className="w-full pl-1 text-lg">
                      {enableDetail ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={fname}
                            onChange={ev => setFname(ev.target.value)}
                            placeholder={userDet.firstname}
                          />
                        </div>
                      ):(enableAccount || enableCodeClearance || enableAvatar || enableEsig) ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={userDet?.name}
                            disabled
                          />
                        </div>
                      ):(
                      <>
                        {userDet.name}
                      </>
                      )}
                    </div>
                  </div>
                  
                  {/* Middle Name */}
                  {enableDetail && (
                    <div className="flex items-center mt-2">
                      <div className="w-36">
                        <label className="block text-lg font-bold leading-6 text-gray-900">
                          Middle Initial:
                        </label> 
                      </div>
                      <div className="w-full pl-1 text-lg">
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={mname}
                            onChange={ev => setMname(ev.target.value)}
                            placeholder={userDet.middlename}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Name */}
                  {enableDetail && (
                    <div className="flex items-center mt-2">
                      <div className="w-36">
                        <label className="block text-lg font-bold leading-6 text-gray-900">
                          Last Name:
                        </label> 
                      </div>
                      <div className="w-full pl-1 text-lg">
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={lname}
                            onChange={ev => setLname(ev.target.value)}
                            placeholder={userDet.lastname}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Position */}
                  {!enableAccount && !enableCodeClearance && !enableAvatar && !enableEsig && (
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        Position:
                      </label> 
                    </div>
                    <div className="w-full pl-1 text-lg">
                      {enableDetail ? (
                        <div className="w-1/2">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={position}
                            onChange={ev => setPosition(ev.target.value)}
                            placeholder={userDet.position}
                          />
                        </div>
                      ):(
                      <>
                        {userDet.position}
                      </>
                      )}
                    </div>      
                  </div>
                  )}

                  {/* User Division */}
                  {!enableAccount && !enableCodeClearance && !enableAvatar && !enableEsig && (
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="block text-lg font-bold leading-6 text-gray-900">
                        Division:
                      </label> 
                    </div>
                    <div className="w-full pl-1 text-lg">
                      {enableDetail ? (
                        <div className="w-1/2">
                          <select
                            type="text"
                            className="w-full ppa-form-edit"
                            value={division}
                            onChange={ev => setDivision(ev.target.value)}
                          >
                            <option value="" disabled style={{ color: '#A9A9A9' }}>{userDet.division}</option>
                            {divisions
                              .filter(div => div !== userDet.division)
                              .map(div => (
                                <option key={div} value={div}>{div}</option>
                              ))
                            }
                          </select>
                        </div>
                      ):(
                      <>
                        {userDet.division}
                      </>
                      )}
                    </div>      
                  </div>
                  )}

                  {/* User username */}
                  {!enableDetail && !enableCodeClearance && !enableAvatar && !enableEsig && (
                    <div className="flex items-center mt-2">
                      <div className="w-36">
                        <label className="block text-lg font-bold leading-6 text-gray-900">
                          Username:
                        </label> 
                      </div>
                      <div className="w-full pl-1 text-lg">
                        {enableAccount ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              className="w-full ppa-form-edit"
                              value={username}
                              onChange={ev => setUsername(ev.target.value)}
                            />
                          </div>
                        ):(
                        <>
                          {userDet.username}
                        </>
                        )}
                      </div>      
                    </div>
                  )}

                  {/* User Password */}
                  {enableAccount && (
                    <div className="flex items-center mt-2">
                      <div className="w-36">
                        <label className="block text-lg font-bold leading-6 text-gray-900">
                          Password:
                        </label> 
                      </div>
                      <div className="w-full pl-1 text-lg">
                        <div className="w-1/2 relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={getpassword}
                            onChange={ev => setPassword(ev.target.value)}
                            className="w-full ppa-form-edit input-placeholder"
                          />
                          <button
                            type="button"
                            className="absolute px-3 h-full icon-form"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Code Clearance */}
                  {!enableDetail && !enableAccount && !enableAvatar && !enableEsig && (
                    <div className="items-center mt-2">
                      <div className="w-36">
                        <label className="block text-lg font-bold leading-6 text-gray-900">
                          Code Clearance:
                        </label> 
                      </div>
                      <div className="w-full text-lg mt-2">
                        {enableCodeClearance ? (
                        <>
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
                        </>
                        ):(
                        <>
                          {userDet.cc}
                        </>
                        )}
                      </div>      
                    </div>
                  )}

                  {/* Upload Avatar */}
                  {enableAvatar && (
                    <div className="items-center mt-2">
                      <form id="user_avatar" onSubmit={SubmitAvatar} method="POST" action="#" encType="multipart/form-data">
                        <div className="flex items-center">
                          <div className="w-36">
                          <label htmlFor="ppa-avatar" className="block text-lg font-bold leading-6 text-gray-900">
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
                    </div>
                  )}

                  {/* Upload Esig */}
                  {enableEsig && (
                    <div className="items-center mt-2">
                      <form id="user_esig" onSubmit={SubmitEsig} action="#" method="POST" encType="multipart/form-data">
                        <div className="flex items-center">
                          <div className="w-36">
                          <label htmlFor="ppa-esignature" className="block text-lg font-bold leading-6 text-gray-900">
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
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Tracking the Logins */}
            {userDet?.status != 0 && (
            <div className="ppa-widget mt-12">
              <div className="joms-user-info-header text-left"> LOGIN TRACKING </div>
              <div className="px-4 pb-4">
                <div className="ppa-div-table">
                  <table className="ppa-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left ppa-table-header">Date Time</th>
                        <th className="px-4 py-2 text-left ppa-table-header">Browser</th>
                        <th className="px-4 py-2 text-center ppa-table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: '#fff' }}>
                      {getSec?.user_id ? (
                        <tr key={getSec.id}>
                          <td className="px-4 py-2 text-left ppa-table-body">{formatDateTime(getSec.datetime)}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{getSec.browser}</td>
                          <td className="px-4 py-2 text-center ppa-table-body">
                            {/* Update Details */}
                            <button onClick={() => handleDeleteToken(getSec.user_id)} 
                              className="py-2 px-4 btn-cancel-form"
                            >
                              Remove Token
                            </button>
                          </td>
                        </tr>
                      ):(
                        <tr>
                          <td colSpan={3} className="px-2 py-5 text-center ppa-table-body">
                            No Tracking
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}

          </div>

          {/* User's Avatar and E-sig */}
          {userDet?.status != 0 && (
          <div>
            {!defaultForm && (
            <>
              {/* Avatar */}
              <div className="ppa-widget">
                <div className="joms-user-info-header text-left"> AVATAR </div>
                <div className="px-4 pb-4 flex justify-center">
                  <img
                    src={userDet.avatar}
                    alt="User"
                    className="user-image mx-auto"
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />
                </div>
              </div>

              {/* Esig */}
              <div className="ppa-widget mt-10">
                <div className="joms-user-info-header text-left">E-SIGNATURE</div>

                <div className="px-4 pb-20 mt-10 flex flex-col items-center justify-center relative">
                  <img
                    src={userDet?.esig}
                    alt="User Signature"
                    className="ppa-esignature-prf mb-2"
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />

                  <span className="text-pdf font-bold uppercase text-center">
                    {userDet?.name}
                  </span>
                </div>
              </div>
            </>
            )}
          </div>
          )}

        </div>
      </>
      ):(
        <Restrict />
      )
    )}

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
  );
}