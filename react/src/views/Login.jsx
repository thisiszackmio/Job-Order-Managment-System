import axiosClient from "../axios";
import { useEffect, useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';

export default function Login() {

  const { setCurrentId, setUserToken, setUserCode } = useUserStateContext();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Variable
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [inputErrors, setInputErrors] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [logoutMessage, setLogoutMessage] = useState("");

  // Submit the login
  const onSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitLoading(true);
    setInputErrors(''); // Clear previous errors
    setLogoutMessage('');

    try {
        const response = await axiosClient.post("/login", {
            username,
            password,
        });

        // Assuming the response contains these fields
        const { userid, token, code } = response.data;

        // Set the user state or context
        setCurrentId(userid);
        setUserToken(token);
        setUserCode(code);

        localStorage.removeItem("logoutReason");

        // Redirect to home page or dashboard
        window.location.href = '/';
    } catch (error) {
      const responseData = error.response?.data?.error;

      if(responseData == "TokenExist"){
        setShowPopup(true)
      }
      else if(responseData == "Invalid"){
        setInputErrors('Invalid Username / Password');
      }
      else if(responseData == "ChangePass"){
        setChangePass(true);
      }

    } finally {
      setSubmitLoading(false);
    }
  };

  // Update Password
  function onUpdateLogin(ev) {
    ev.preventDefault();
    setSubmitLoading(true);
  
    axiosClient
      .put("/updateuser", {
        username,
        currentPassword,
        newPassword,
        confirmPassword,
      })
      .then(() => {
        setInputErrors('Password updated successfully'); // Clear errors on success
        setChangePass(false);
      })
      .catch((error) => {
        const message = error.response?.data?.error;
  
        if (error.response.status === 422) {
          if (message === 'Incorrect password') {
            setInputErrors('Incorrect current password');
          } else if (message === 'User not found.') {
            setInputErrors('User does not exist');
          } else if (message === 'The confirmPassword and newPassword must match.') {
            setInputErrors('Confirm Password does not match');
          } else {
            setInputErrors('Please check your input');
          }
        } else {
          setInputErrors('An unexpected error occurred');
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }
  
  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
    setUsername('');
    setPassword('');
  }

  // Disable RightClick
  useEffect(() => {
    // Disable Right-Click
    const disableRightClick = (e) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", disableRightClick);

    // Disable Developer Tools Shortcuts
    const disableDevToolsShortcuts = (e) => {
      if (
        e.key === "F12" || // F12 Key
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === "C") || // Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J
        (e.ctrlKey && e.key === "U") // Ctrl+U (View Page Source)
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", disableDevToolsShortcuts);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("keydown", disableDevToolsShortcuts);
    };
  }, []);

  // Logout Reason
  useEffect(() => {
    // Check for a logout reason in localStorage
    const reason = localStorage.getItem("logoutReason");
    if (reason) {
      setLogoutMessage(reason);
      // Clear the reason after displaying it
      localStorage.removeItem("logoutReason");
    }
  }, []);

  return (
    <>
    {/* Login Page */}
    <div 
      className="min-h-screen ppa-cover font-roboto items-center justify-center flex flex-1 flex-col lg:flex-row"
      style={{ backgroundImage: "url('default/ppa_bg.png')" }}
    >
      <div className="w-3/4 ppa-login p-10 flex flex-wrap">
        {/* 1st Column */}
        <div className="lw-full lg:w-1/2 relative">
          <div className="login-welcome mb-2">
            Welcome to
          </div>
          <img className="login-logo mb-3" src="default/ppa_logo.png" alt="Your Company" />
          <div className="login-title">
            <div>Joint Local Management System</div>
          </div>
          <div className="absolute top-0 right-0 h-8 w-[2px] bg-white lg:h-[320px]"></div>
        </div>
        {/* 2nd Column */}
        <div className="w-full lg:w-1/2 items-center justify-center relative">
          <div className="login-wrap">
            <div className="login-word mb-6"> {changePass ? "Change Credentials" : "Login"} </div>

            {/* Error Code */}
            {logoutMessage ? (
              (logoutMessage) && (
                <div className="login-error mb-8 mt-2"> {logoutMessage} </div>
              )
            ):(
              inputErrors && ( 
                <div className="login-error mb-8 mt-2"> {inputErrors} </div> 
              )
            )}

            {changePass ? (
              <form onSubmit={onUpdateLogin} className="space-y-4" action="#" method="POST">
                {/* Current Password*/}
                <div className="relative">
                  
                  {/* Label with animated position */}
                  <label
                    htmlFor="old_password"
                    className={`ppa-label-login ${
                      isFocused || currentPassword ? "ppa-label-login-focused" : ""
                    }`}
                  >
                    Current Password
                  </label>

                  {/* Input field */}
                  <input
                    id="old_password"
                    name="old_password"
                    type="password"
                    value={currentPassword}
                    onChange={(ev) => setCurrentPassword(ev.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="block w-full ppa-form-login"
                  />

                </div>
                {/* New Password*/}
                <div className="relative" style={{ marginTop: '1.75rem' }}>
                  
                  {/* Label with animated position */}
                  <label
                    htmlFor="new_password"
                    className={`ppa-label-login ${
                      isFocused || newPassword ? "ppa-label-login-focused" : ""
                    }`}
                  >
                    New Password
                  </label>

                  {/* Input field */}
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(ev) => setNewPassword(ev.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="block w-full ppa-form-login"
                  />

                </div>
                {/* Confirm Password*/}
                <div className="relative" style={{ marginTop: '1.75rem' }}>
                  
                  {/* Label with animated position */}
                  <label
                    htmlFor="new_password"
                    className={`ppa-label-login ${
                      isFocused || confirmPassword ? "ppa-label-login-focused" : ""
                    }`}
                  >
                    Confirm Password
                  </label>

                  {/* Input field */}
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="block w-full ppa-form-login"
                  />

                </div>
                <p className="loginMessage">Password must contain at least one uppercase letter, one number, one symbol, and be at least 8 characters long. </p>
                {/* Submit Button */}
                <div>
                  <button type="submit" className={`px-6 py-2 w-full ${ submitLoading ? 'process-btn' : 'login-btn'}`} disabled={submitLoading}>
                    {submitLoading ? (
                      <div className="flex w-full items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Processing</span>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  <p className="loginMessage text-center">Already Update? <a onClick={() => setChangePass(false)} style={{ color: 'blue', cursor: 'pointer'}}>Login Here</a> </p>
                </div>
              </form>
            ):(
              <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
                {/* Username */}
                <div className="relative">
                  <label
                    htmlFor="username"
                    className={`ppa-label-login ${
                      isFocused || username ? "ppa-label-login-focused" : ""
                    }`}
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="block w-full ppa-form-login"
                  />

                </div>
                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className={`ppa-label-login ${
                      isFocused || password ? "ppa-label-login-focused" : ""
                    }`}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="block w-full ppa-form-login"
                  />
                </div>
                {/* Button */}
                <div>
                  <button type="submit" className={`px-6 py-2 w-full ${ submitLoading ? 'process-btn' : 'login-btn'}`} disabled={submitLoading}>
                    {submitLoading ? (
                      <div className="flex w-full items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Processing</span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Popup Form */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 font-roboto">
        {/* Semi-transparent black overlay with blur effect */}
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
        {/* Popup content */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
          {/* Notification Icons */}
          <div className="f-modal-alert">
            <div className="f-modal-icon f-modal-warning scaleWarning">
              <span className="f-modal-body pulseWarningIns"></span>
              <span className="f-modal-dot pulseWarningIns"></span>
            </div>
          </div>
          {/* Popup Message */}
          <p className="text-lg text-center"> 
            <p className="popup-title">Still Login</p>
            <p className="popup-message">It seems this account is active on another device. Please log out there before signing in on this device.</p>
          </p>
          {/* Buttons */}
          <div className="flex justify-center mt-4">
            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justClose} className="w-full py-2 btn-default ml-2">
                Noted
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
  