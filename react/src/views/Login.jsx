import axiosClient from "../axios";
import { useEffect, useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';
import ppabg from '/default/ppa_bg.png';

export default function Login() {
  const { setCurrentUserId, setCurrentUserName, setCurrentUserAvatar, setCurrentUserToken, setCurrentUserCode } = useUserStateContext();

  // Variable
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeMethod, setChangeMethod] = useState('');

  const [userExist, setUserExist] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [inputErrors, setInputErrors] = useState('');
  const [logoutMessage, setLogoutMessage] = useState("");

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

  // Login Function
  const onLogin = async (ev) =>{
    if (ev) ev.preventDefault();
    setSubmitLoading(true);
    setInputErrors(''); // Clear previous errors
    setLogoutMessage('');

    try {
        const response = await axiosClient.post("/login", {
            username,
            password,
            method: changeMethod,
        });

        // Assuming the response contains these fields
        const { userId, userDet, userAvatar, token, code } = response.data;

        // Set the user state or context
        setCurrentUserId(userId);
        setCurrentUserToken(token);
        setCurrentUserCode(code);
        setCurrentUserName(userDet);
        setCurrentUserAvatar(userAvatar);

        localStorage.removeItem("logoutReason");

        // Redirect to home page or dashboard
        window.location.href = '/joms';
    } catch (error) {
      const responseData = error.response?.data?.error;

      if(responseData == "TokenExist"){
        setUserExist(true);
        setChangeMethod('continue');
      }
      else if(responseData == "Invalid"){
        setInputErrors('Invalid Username / Password');
      }
      else if(responseData == "ChangePass"){
        setChangePass(true);
      }
      else{
        setInputErrors('There is something wrong! Please contact the developer');
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

  return(
    <div className="min-h-screen ppa-cover bg-cover bg-center bg-no-repeat bg-[url('/default/ppa_bg.png')] flex flex-1 font-roboto items-center justify-center flex-col lg:flex-row">
      <div className="w-3/4 ppa-login p-10 flex flex-wrap">
        {/* 1st Column */}
        <div className="lw-full lg:w-1/2 relative">
          <div className="login-welcome mb-2">
            Welcome to
          </div>
          <img className="login-logo mb-3" src="/default/ppa_logo.png" alt="Your Company" />
          <div className="login-title">
            <div>Job Order Management System</div>
          </div>
          <div className="absolute top-0 right-0 h-8 w-[2px] bg-white lg:h-[320px]"></div>
        </div>
        {/* 2nd Column */}
        <div className="w-full lg:w-1/2 items-center justify-center relative">
          <div className="login-wrap">
            <div className="login-word mb-6"> {userExist ? "Still Login" : changePass ? "Update Credentials" : "Login"} </div>
            {/* Error Code */}
            {logoutMessage && (
              <div className="login-error mb-8 mt-2"> {logoutMessage} </div>
            )}
            {inputErrors && (
              <div className="login-error mb-8 mt-2"> {inputErrors} </div>
            )}
            {userExist ? (
            <>
              <div className="login-exist-message">
              This account is currently active on another computer or browser. If you proceed, this device will become active instead.
              </div>  
              <button type="button" onClick={() => { onLogin(); setChangeMethod("continue"); }}  className={`px-6 py-2 w-full ${ submitLoading ? 'process-btn-lg' : 'login-btn'}`} disabled={submitLoading}>
                Proceed
              </button>
              <p className="loginMessage text-center">Click here to <a onClick={() => {setUserExist(false)}} style={{ color: 'blue', cursor: 'pointer'}}>Login</a> </p>
            </>
            ):(
              changePass ? (
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
                  <div className="relative">
                    
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
                  <div className="relative">
                    
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
                    <button type="submit" className={`px-6 py-2 w-full ${ submitLoading ? 'process-btn-lg' : 'login-btn'}`} disabled={submitLoading}>
                      {submitLoading ? (
                        <div className="flex w-full items-center justify-center">
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
                <form onSubmit={onLogin} className="space-y-6" action="#" method="POST">
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
                    <button type="submit" onClick={() => setChangeMethod("login")} className={`px-6 py-2 w-full ${ submitLoading ? 'process-btn-lg' : 'login-btn'}`} disabled={submitLoading}>
                      {submitLoading ? (
                        <div className="flex w-full items-center justify-center">
                          <span className="ml-1">Processing</span>
                        </div>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
  