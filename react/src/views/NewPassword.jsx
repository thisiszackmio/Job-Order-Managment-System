import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";
import axiosClient from "../axios";
import submitAnimation from '../assets/loading_nobg.gif';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function UserDetails(){

  const [submitLoading, setSubmitLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCorfirmation, setPasswordConfirmation] = useState('');

  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const { currentUser, setCurrentUser, setUserToken } = useUserStateContext();

  const navigate = useNavigate();

  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p>There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  useEffect(() => {
    // Redirect to dashboard if pwd_change is not 1
    if (currentUser && currentUser.pwd_change === 0) {
      window.location.href = '/';
      return null;
    }
  }, [currentUser]);

  const handleCopyCutPaste = (event) => {
    event.preventDefault();
  };

  const changePass = (ev) => {
    ev.preventDefault();

    setSubmitLoading(true);

    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} has update the password`;

    if(password != passwordCorfirmation){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Invalid Password</p>
          <p>Password and Confirm Password do not match.</p>
        </div>
      );
      setSubmitLoading(false);
    }else{

      axiosClient
      .put(`changeuserpwd/${currentUser.id}`, {
        password: password,
        logs: logs
      })
      .then(() => { 
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p>Your password has been updated.</p> 
            <p>Please log back into the system using your new password.</p>
          </div>
        );
        setSubmitLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // User Not Found
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">User not Found!</p>
              <p>You cannot update the user detail, please inform the developer (Error 404)</p>
            </div>
          );
          setSubmitLoading(false);
        } else if (error.response && error.response.status === 204){
          // Something wrong on the submitting
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">There is something wrong</p>
              <p>Please contact the developer on the issue (Error 204)</p>
            </div>
          );
          setSubmitLoading(false);
        } else if (error.response && error.response.status === 422){
          // Password validation
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(
            <div>
              <p className="popup-title">Invalid Password</p>
              <p>Password must contain at least 8 characters, one uppercase letter, one number, and one symbol.</p>
            </div>
          );
          setSubmitLoading(false);
        } else {
          // System Error
          setShowPopup(true);
          setPopupContent('error');
          setPopupMessage(DevErrorText);
          setSubmitLoading(false);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    }
  }

  //Close Popup on Error
  const justclose = () => {
    setShowPopup(false);
  }

  const closePopup = () => {
    axiosClient.post('/logout').then((response) => {
      setCurrentUser({});
      setUserToken(null);

      // Redirect to the login page using the navigate function
      navigate('/login');
    });
  }

  return (
  <PageComponent title="Change Password">
  <div className="font-roboto">

    <form id="change-pwd" onSubmit={changePass} className="mt-6">

      <div>
        <h2 className="text-base font-bold leading-7 font-roboto"> JOMS will ask you to change your password for security to avoid data compromise. </h2>
      </div>

        {/* New Password */}
        <div className="flex items-center mt-5">
          <div className="w-56">
            <label className="block text-lg font-bold leading-6 text-gray-900">
            New Password:
            </label> 
          </div>
          <div className="w-80 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              onCopy={handleCopyCutPaste}
              onCut={handleCopyCutPaste}
              onPaste={handleCopyCutPaste}
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              className="block w-full rounded-md border-1 p-1.5 form-text text-lg border-gray-300 focus:ring-0 focus:border-gray-400 bg-gray-200"
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
        <p style={{ paddingLeft: '225px' }} className="lower-text">At least 8 characters, one uppercase, number and symbol</p>

        {/* Confirm New Password */}
        <div className="flex items-center mt-5">
          <div className="w-56">
            <label className="block text-lg font-bold leading-6 text-gray-900">
            Confirm New Password:
            </label> 
          </div>
          <div className="w-80 relative">
            <input
              id="password"
              name="password"
              type={showPasswordConfirm ? 'text' : 'password'}
              required
              value={passwordCorfirmation}
              onChange={ev => setPasswordConfirmation(ev.target.value)}
              className="block w-full rounded-md border-1 p-1.5 form-text text-lg border-gray-300 focus:ring-0 focus:border-gray-400 bg-gray-200"
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

      </form>

    {/* Buttons */}
    <div className="flex mt-10">

      {/* Change Password */}
      <div>

        {/* Submit */}
        <button
          form="change-pwd"
          type="submit"
          className={`px-6 py-2 btn-submit ${
            submitLoading && 'btn-submitting'
          }`}
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

      </div>

    </div>

  </div>

  {/* Show Popup */}
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div className="fixed inset-0 bg-black opacity-40"></div>

      {/* Popup content with background blur */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>
        
        {/* Notification Icons */}
        <div class="f-modal-alert">

          {/* Error */}
          {popupContent == 'error' && (
            <div className="f-modal-icon f-modal-error animate">
              <span className="f-modal-x-mark">
                <span className="f-modal-line f-modal-left animateXLeft"></span>
                <span className="f-modal-line f-modal-right animateXRight"></span>
              </span>
            </div>
          )}

          {/* Warning */}
          {(popupContent == 'warning') && (
            <div class="f-modal-icon f-modal-warning scaleWarning">
              <span class="f-modal-body pulseWarningIns"></span>
              <span class="f-modal-dot pulseWarningIns"></span>
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
        <p className="text-lg text-center font-roboto"> {popupMessage} </p>

        {/* Buttons */}
        <div className="flex justify-center mt-4 font-roboto">

          {/* Error */}
          {popupContent == 'error' && (
            <button onClick={justclose} className="w-full py-2 btn-error">
              Close
            </button>
          )}

          {/* Success */}
          {popupContent == 'success' && (
            <button onClick={closePopup} className="w-full py-2 btn-success">
              Close
            </button>
          )}

        </div>

      </div>

    </div>
  )}
  {/* End Show Popup */}

  </PageComponent>
  )
}