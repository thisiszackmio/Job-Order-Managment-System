import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import submitAnimation from '/default/ring-loading.gif';
import loading_table from "/default/ring-loading.gif";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";


export default function UserDetailsJLMS(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  const {id} = useParams();

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

  const [loading, setLoading] = useState(true);
  const [pageRestrict, setPageRestrict] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Buttons
  const [activateForm, setActivateForm] = useState(false);
  const [enableDetail, setEnableDetails] = useState(false);
  const [enableAccount, setEnableAccount] = useState(false);
  const [enableCodeClearance, setEnableCodeClearance] = useState(false);
  const [enableAvatar, setEnableAvatar] = useState(false);
  const [enableEsig, setEnableEsig] = useState(false);

  // --- Get Details --- //
  const [userDet, getUserDet] = useState([]);

  const fetchUserDet = async () => {
    try {
      const response = await axiosClient.get(`/userdetail/${id}`);
      const dataUserDet = response.data;

      getUserDet(dataUserDet);

      if(Access) {
        setPageRestrict(true);
      } else{
        setPageRestrict(false);
      }

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    if(currentUserId){
      fetchUserDet();
    }
  }, [currentUserId]);

  // Error Const
  const [inputErrors, setInputErrors] = useState({});

  // Update User Details
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mname, setMname] = useState('');
  const [position, setPosition] = useState('');
  const [division, setDivision] = useState('');

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
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">User not Found!</p>
            <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
          </div>
        );
      }
      else if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      }
      else if(error.response && error.response.status === 422){
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }
      else {
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

  // Update Account Details
  const [username, setUsername] = useState('');
  const [getpassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">User not Found!</p>
              <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
            </div>
          );
        } else if (error.response && error.response.status === 204){
          // Something wrong on submitting
          setShowPopup(true);
          setPopupContent('check-error');
          setPopupMessage(
            <div>
              <p className="popup-title">There is something wrong</p>
              <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
            </div>
          );
        } else if(error.response && error.response.status === 422){
          const responseErrors = error.response.data.errors;
          setInputErrors(responseErrors);
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

  // Badge
  const [selectedRoles, setSelectedRoles] = useState('');

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

  // Update Badge
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
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">User not Found!</p>
            <p className="popup-message">You cannot update the user detail, please inform the developer (Error 404)</p>
          </div>
        );
      } else if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        // Empty Fields
        setShowPopup(true);
        setPopupContent('check-error');
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

  // Upload Avatar
  const [uploadedAvatarName, setUploadAvatarName] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');

  const handleAvatarChange = (e) => {
    const selectedAvatarFile = e.target.files[0];
    setUploadAvatarName(selectedAvatarFile.name);
    setUploadAvatar(selectedAvatarFile);
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
      if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
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
  const [uploadedEsigName, setUploadedEsigName] = useState('');
  const [uploadEsig, setUploadEsig] = useState('');

  const handleEsigChange = (e) => {
    const selectedEsigFile = e.target.files[0];
    setUploadedEsigName(selectedEsigFile.name);
    setUploadEsig(selectedEsigFile);
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
      if (error.response && error.response.status === 204){
        // Something wrong on submitting
        setShowPopup(true);
        setPopupContent('check-error');
        setPopupMessage(
          <div>
            <p className="popup-title">There is something wrong</p>
            <p className="popup-message">Please contact the developer on the issue (Error 204)</p>
          </div>
        );
      } else if (error.response && error.response.status === 422) {
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
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

  // Delete User
  const handleDeleteConfirmation = () => {
    setShowPopup(true);
    setPopupContent('delete_user');
    setPopupMessage(
      <div>
        <p className="popup-title">Remove User?</p>
        <p className="popup-message">If you confirm, this account will be disabled. Only the Site Admin can remove it from the system.</p>
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
          <p className="popup-message">Account disabled successfully</p>
        </div>
      );
    })
    .catch((error) => {
      setPopupContent('error');
      setPopupMessage(error.response.status);
      setShowPopup(true);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Activate Account
  const handleActivateUser = () => {
    setShowPopup(true);
    setPopupContent('activate_user');
    setPopupMessage(
      <div>
        <p className="popup-title">Reactivate this User??</p>
        <p className="popup-message">If you confirm, this account will be enable.</p>
      </div>
    );
  }

  // Activate Function
  function exeActivate(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/reactivate/${id}`, {
      name: `${userDet.firstname} ${userDet.middlename}. ${userDet.lastname}`,
      authority: currentUserName.name
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Account disabled successfully</p>
        </div>
      );
    })
    .catch((error) => {
      setPopupContent('error');
      setPopupMessage(error.response.status);
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
    fetchUserDet();
    setShowPopup(false);
    setLoading(true);
    setActivateForm(false);
    setEnableDetails(false);
    setEnableCodeClearance(false);
    setEnableAccount(false);
    setEnableAvatar(false);
    setEnableEsig(false);
    setUploadAvatarName('');
    setUploadedEsigName('');
    setSelectedRoles('');
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = codes.includes("HACK");
  const roles = ["NERD", "AUS"];
  const Access = roles.some(role => codes.includes(role));

  return(
    !pageRestrict ? (
      <Restrict />
    ):(
    <PageComponent title="Employee Details">
      <div className="ppa-widget request-form px-4 pb-6 mt-8">
        {/* Header */}
        <div className="joms-user-info-header text-left"> 
          Employee's Details
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading User Detail</span>
          </div>
        ):(
        <>
          {/* Det */}
          <div className="detail-container mt-5">
            {/* Avatar and Esig */}
            <div>
              {/* Avatar */}
              <div>
                <img
                  src={userDet.avatar}
                  alt="User"
                  className="user-image mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
              {/* Esig */}
              <div className="mt-4">
                <img
                  src={userDet?.esig}
                  alt="User Signature"
                  className="ppa-esignature-prf mb-2 mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
            </div>
            {/* Details */}
            <div>
              {/* Buttons */}
              <div className="flex space-x-3"> 
                {/* Back to the List */}
                <button 
                  onClick={() => window.location.href = '/joms/userlist'}
                  className="w-auto py-2 px-4 btn-primary"
                  disabled={activateForm}
                >
                  Back
                </button>
                {userDet?.status != 0 ? (
                <>
                  {/* Edit Details */}
                  <button 
                    onClick={() => {setEnableDetails(true); setActivateForm(true);}}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Update Details
                  </button>
                  {/* Edit Account */}
                  <button 
                    onClick={() => {setEnableAccount(true); setActivateForm(true);}}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Update Account
                  </button>
                  {/* Edit Badge */}
                  <button 
                    onClick={() => {setEnableCodeClearance(true); setActivateForm(true);}}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Update Badge
                  </button>
                  {/* Edit Avatar */}
                  <button 
                    onClick={() => {setEnableAvatar(true); setActivateForm(true);}}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Update Avatar
                  </button>
                  {/* Edit Esig */}
                  <button 
                    onClick={() => {setEnableEsig(true); setActivateForm(true);}}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Update Esig
                  </button>
                  {/* Delete */}
                  {SuperAdmin && (
                    <button 
                      onClick={() => handleDeleteConfirmation()}
                      className="w-auto py-2 px-4 btn-error"
                      disabled={activateForm}
                    >
                      Delete User
                    </button>
                  )}
                </>
                ):(
                <>
                  {/* Edit Account */}
                  <button 
                    onClick={() => handleActivateUser()}
                    className="w-auto py-2 px-4 btn-secondary"
                    disabled={activateForm}
                  >
                    Activate Account
                  </button>
                </>
                )}
              </div>
              {/* Data */}
              <div>
                {/* Type of Edit */}
                <div className="form-title-header mb-4 mt-6">
                  {enableDetail ? ("Update User Details:")
                  :enableAccount ? ("Update User Account:")
                  :enableCodeClearance ? ("Update User Badge:")
                  :enableAvatar ? ("Update User Avatar:")
                  :enableEsig ? ("Update User Esignature:"):null}
                </div>

                {/* Enable for Information Details */}
                {enableDetail && (
                <>
                  {/* User ID */}
                  <div className="flex items-center mt-3">
                    <div className="w-36">
                      <label className="det-form-title">
                        User ID:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-1/2">
                        {userDet?.id}
                      </div>
                    </div>
                  </div>

                  {/* User Name */}
                  <div className="flex items-start mt-3">
                    <div className="w-36">
                      <label className="det-form-title">
                        Name:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-1/4">
                        <input
                          type="text"
                          className="w-full ppa-form-edit"
                          value={fname}
                          onChange={ev => setFname(ev.target.value)}
                          placeholder="First Name"
                        />
                        {(!fname && inputErrors.firstname) && (
                          <p className="form-validation">This field cannot be empty.</p>
                        )}
                      </div>
                      <div className="w-1/4 mt-2">
                        <input
                          type="text"
                          className="w-full ppa-form-edit"
                          value={mname}
                          onChange={ev => setMname(ev.target.value)}
                          placeholder="M.I (Don't include dot)"
                          maxLength={2}
                        />
                        {(!mname && inputErrors.middlename) && (
                          <p className="form-validation">This field cannot be empty.</p>
                        )}
                      </div>
                      <div className="w-1/4 mt-2">
                        <input
                          type="text"
                          className="w-full ppa-form-edit"
                          value={lname}
                          onChange={ev => setLname(ev.target.value)}
                          placeholder="Last Name"
                        />
                        {(!lname && inputErrors.lastname) && (
                          <p className="form-validation">This field cannot be empty.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Position:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-full md:w-1/4">
                        <input
                          type="text"
                          className="w-full ppa-form-edit"
                          value={position}
                          onChange={ev => setPosition(ev.target.value)}
                          placeholder="Position/Plantia Position"
                        />
                        {(!position && inputErrors.position) && (
                          <p className="form-validation">This field cannot be empty.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Division */}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Division:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-full md:w-1/4">
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
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex justify-start mt-8">
                    {/* Submit */}
                    <button
                      onClick={ () => { submitUpdateDetail() } }
                      className={`w-auto px-4 py-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    >
                      {submitLoading ? (
                        <div className="flex justify-center">
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
                          setActivateForm(false);
                          setFname(userDet.firstname);
                          setMname(userDet.middlename);
                          setLname(userDet.lastname);
                          setPosition(userDet.position);
                        }} className="w-auto px-4 py-2 ml-2 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
                )}

                {/* Enable for Account Details*/}
                {enableAccount && (
                <>
                  {/* Username */}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Username:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-full md:w-1/4">
                          <input
                            type="text"
                            className="w-full ppa-form-edit"
                            value={username}
                            onChange={ev => setUsername(ev.target.value)}
                            readOnly={!SuperAdmin}
                          />
                        </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Password:
                      </label> 
                    </div>
                    <div className="w-full">
                      <div className="w-1/4 relative">
                        <input
                          className="w-full ppa-form-edit"
                          type={showPassword ? 'text' : 'password'}
                          value={getpassword}
                          onChange={ev => setPassword(ev.target.value)}
                          placeholder="Renew Password"
                        />
                        <button
                          type="button"
                          className="absolute px-3 h-full icon-form-showpass"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                      {(!getpassword && inputErrors.password) && (
                        <p className="form-validation">This field cannot be empty.</p>
                      )}
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex justify-start mt-8">
                    {/* Submit */}
                    <button
                      onClick={ () => { submitUpdateAccount() } }
                      className={`w-auto px-4 py-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    >
                      {submitLoading ? (
                        <div className="flex justify-center">
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
                          setActivateForm(false);
                          setInputErrors('');
                        }} className="w-auto px-4 py-2 ml-2 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
                )}
                
                {/* Enable for Badge Update */}
                {enableCodeClearance && (
                <div className="items-center mt-2">
                  <div className="w-full">
                    <label className="block text-lg font-bold leading-6 text-gray-900">
                      Badge: <span className="prev-badge">(Prev Badge: {userDet?.code_clearance})</span>
                    </label>
                    <div className="w-full">
                      {/* HACK */}
                      {SuperAdmin && (
                      <div className="relative flex items-center mt-4">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('HACK')}
                            onChange={(e) => handleCheckboxChange(e, 'HACK')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            HACK <span className="checkbox-description">- Full system control and access to all features.</span>
                          </label> 
                        </div>
                      </div>
                      )}
                      {/* PM */}
                      <div className="relative flex items-center mt-2">
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
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            PM <span className="checkbox-description">- Port Manager access; can view the Form List and Employee List only.</span>
                          </label> 
                        </div>
                      </div>
                      {/* DM */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('DM')}
                            onChange={(e) => handleCheckboxChange(e, 'DM')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            DM <span className="checkbox-description">- Division Manager access; can view the Form List and Employee List</span>
                          </label> 
                        </div>
                      </div>
                      {/* AM */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('AM')}
                            onChange={(e) => handleCheckboxChange(e, 'AM')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            AM <span className="checkbox-description">- Admin Manager access; can approve all forms.</span>
                          </label> 
                        </div>
                      </div>
                      {/* GSO */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('GSO')}
                            onChange={(e) => handleCheckboxChange(e, 'GSO')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            GSO <span className="checkbox-description">- General Services Officer access; can manage all forms, including editing and closing forms, and handle driver and vehicle assignments.</span>
                          </label> 
                        </div>
                      </div>
                      {/* AUS */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('AUS')}
                            onChange={(e) => handleCheckboxChange(e, 'AUS')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            AUS <span className="checkbox-description">- IT Access; full system control except for updating employee access permissions.</span>
                          </label> 
                        </div>
                      </div>
                      {/* AUI */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('AUI')}
                            onChange={(e) => handleCheckboxChange(e, 'AUI')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            AUI <span className="checkbox-description">- Authorized Personnel for Inspection and Repair Forms only.</span>
                          </label> 
                        </div>
                      </div>
                      {/* AUF */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('AUF')}
                            onChange={(e) => handleCheckboxChange(e, 'AUF')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            AUF <span className="checkbox-description">- Authorized Personnel for Facility Request Forms only.</span>
                          </label> 
                        </div>
                      </div>
                      {/* AUV */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('AUV')}
                            onChange={(e) => handleCheckboxChange(e, 'AUV')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            AUV <span className="checkbox-description">- Authorized Personnel for Vehicle Slip Forms, including vehicle and driver assignments.</span>
                          </label> 
                        </div>
                      </div>
                      {/* SEC */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('SEC')}
                            onChange={(e) => handleCheckboxChange(e, 'SEC')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            SEC <span className="checkbox-description">- Security Personnel access; can manage Vehicle Slip and Locator Slip forms.</span>
                          </label> 
                        </div>
                      </div>
                      {/* MEM */}
                      <div className="relative flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="pm-checkbox"
                            type="checkbox"
                            checked={selectedRoles.includes('MEM')}
                            onChange={(e) => handleCheckboxChange(e, 'MEM')}
                            className="focus:ring-gray-400 h-6 w-6 border-black-500 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="pm-checkbox" className="checkbox-name">
                            MEM <span className="checkbox-description">- Default system badge for regular users.</span>
                          </label> 
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="flex justify-start mt-8">
                    {/* Submit */}
                    <button
                      onClick={ () => { submitUpdateCodeClearance() } }
                      className={`w-auto px-4 py-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    >
                      {submitLoading ? (
                        <div className="flex justify-center">
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
                          setActivateForm(false);
                          setSelectedRoles('');
                        }} className="w-auto ml-2 px-4 py-2 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>  
                </div>
                )}

                {/* Enable for Avatar Update */}
                {enableAvatar && (
                <>
                  {/* Upload Avatar */}
                  <form id="user_avatar" onSubmit={SubmitAvatar} method="POST" action="#" encType="multipart/form-data">
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Upload Avatar:
                      </label> 
                    </div>
                    <div className="w-full">
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
                      {(!uploadedAvatarName && inputErrors.avatar) && (
                        <p className="form-validation">This field cannot be empty.</p>
                      )}
                    </div>
                  </div>
                  </form>

                  {/* Button */}
                  <div className="flex justify-start mt-8">
                    {/* Submit */}
                    <button 
                      form="user_avatar"
                      type="submit"
                      className={`w-auto px-4 py-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <div className="flex justify-center">
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
                          setActivateForm(false);
                          setInputErrors('');
                        }} className="w-auto ml-2 px-4 py-2 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
                )}

                {/* Enable for Esig Update */}
                {enableEsig && (
                <>
                  {/* Upload Esig */}
                  <form id="user_esig" onSubmit={SubmitEsig} action="#" method="POST" encType="multipart/form-data">
                  <div className="flex items-center mt-2">
                    <div className="w-36">
                      <label className="det-form-title">
                        Upload Esig:
                      </label> 
                    </div>
                    <div className="w-full">
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
                          <p className="pl-1 text-sm">PNG, JPG and JPEG only up to 2MB</p>
                          {uploadedEsigName &&  <label for="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedEsigName}</label> }
                        </div>
                      </div>
                      {(!uploadedEsigName && inputErrors.esig) && (
                        <p className="form-validation">This field cannot be empty.</p>
                      )}
                    </div>
                  </div>
                  </form>

                  {/* Button */}
                  <div className="flex justify-start mt-8">
                    {/* Submit */}
                    <button 
                      form="user_esig"
                      type="submit"
                      className={`w-auto px-4 py-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <div className="flex justify-center">
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
                          setActivateForm(false);
                          setInputErrors('');
                        }} className="w-auto ml-2 px-4 py-2 btn-cancel">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
                )}

                {/* User Status*/}
                {!activateForm && (
                <div className="flex items-center">
                  <div className="w-36">
                    <label className="det-form-title">
                      User Status:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.status === 0 && (<span className="user-deleted" title="Deleted"> Deactivate </span>)}
                      {userDet?.status === 1 && (<span className="user-active" title="Active"> Active </span>)}
                      {userDet?.status === 2 && (<span className="user-need" title="Not Activate"> Need Activate </span>)}
                    </div>
                  </div>
                </div>
                )}
                {/* User ID */}
                {!activateForm && (
                <div className="flex items-center mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      User ID:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.id}
                    </div>
                  </div>
                </div>
                )}
                {/* User NAme */}
                {!activateForm && (
                <div className="flex items-center mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      User Name:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.name}
                    </div>
                  </div>
                </div>
                )}
                {/* Position */}
                {!activateForm && (
                <div className="flex items-center mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      Position:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.position}
                    </div>
                  </div>
                </div>
                )}
                {/* Division */}
                {!activateForm && (
                <div className="flex items-center mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      Division:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.division}
                    </div>
                  </div>
                </div>
                )}
                {/* Username */}
                {!activateForm && (
                <div className="flex items-center mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      Username:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2">
                      {userDet?.username}
                    </div>
                  </div>
                </div>
                )}
                {/* Badge */}
                {!activateForm && (
                <div className="flex items-start mt-3">
                  <div className="w-36">
                    <label className="det-form-title">
                      Badge:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-1/2 flex flex-wrap gap-2">
                      {userDet?.code_clearance
                        ?.split(',')
                        .map((badge, index) => (
                          <span key={index} className={`badge-${badge.trim()}`}>
                            {badge.trim()}
                          </span>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </div>
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
          exeActivate={exeActivate}
          justClose={justClose}
          closePopup={closePopup}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
        />
      )}
    </PageComponent>
    )
  );
}