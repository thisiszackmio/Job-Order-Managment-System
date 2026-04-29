import axiosClient from "../axios";
import submitAnimation from '/default/ring-loading.gif';
import { useEffect, useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const { setCurrentUserId, setCurrentUserName, setCurrentUserAvatar, setCurrentUserToken, setCurrentUserCode } = useUserStateContext();

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

  // Variable
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeMethod, setChangeMethod] = useState('');

  // Conditional
  const [userExist, setUserExist] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error
  const [inputErrors, setInputErrors] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      navigate('/joms/dashboard', { replace: true });
    }
  }, []);

  // Login Function
  async function onLogin(ev){
    if (ev) ev.preventDefault();

    setSubmitLoading(true);
    setInputErrors('');

    const LoginData = {
      username,
      password,
      method: changeMethod,
      loginType: "Regular",
    }

    try {
      const response = await axiosClient.post("/login", LoginData);

      // console.log(response);

      // Assuming the response contains these fields
      const { userId, userDet, userAvatar, token, code } = response.data;

      // Set the user state or context
      setCurrentUserId(userId);
      setCurrentUserToken(token);
      setCurrentUserCode(code);
      setCurrentUserName(userDet);
      setCurrentUserAvatar(userAvatar);

      localStorage.removeItem("logoutReason");

      window.location.href = '/joms/dashboard';


    }catch(error){
      const responseData = error.response?.data?.error;
      if(responseData == "NotFound"){
        setInputErrors('The user does not exist.');
      }
      else if(responseData == "TokenExist"){
        setUserExist(true);
        setChangeMethod('exist');
      }
      else if(responseData == "Invalid"){
        setInputErrors('Invalid Credentials');
      }
      else if(responseData == "AccountDisabled"){
        setInputErrors('This account has been disabled.');
      }
      else if(responseData == "ChangePass"){
        setChangePass(true);
      }
      else{
        setInputErrors(error);
      }
      
    }finally{
      setSubmitLoading(false);
    }
  }

  // Update Password Function
  function onUpdateLogin(ev){
    if (ev) ev.preventDefault();

    // setSubmitLoading(true);

    const UpdateCredentials = {
      username,
      currentPassword,
      newPassword,
      confirmPassword,
    }

    axiosClient
      .put("/updateuser", UpdateCredentials)
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
    <div className="ppa-cover">
      <div className="ppa-login">

        <div className="ppa-login-wrap">

          {/* Logo */}
          <img className="login-logo" src="/default/img/ppa_logo.png" alt="Your Company" />

          <div className="ppa-login-card">
            <div className="ppa-login-title">
              <div className="login-title">Job Order Management System</div>
            </div>

            <div className="login-detail">
              <div className="login-word"> {userExist ? "Still Login" : changePass ? "Update Credentials" : "Login" } </div>

              {/* Error Code */}
              {inputErrors && (
                <div className="login-error mb-2 mt-2"> {inputErrors} </div>
              )}

              {/* Login Details */}
              <div className="login-form">
                {userExist ? (
                <>
                  <div className="login-exist-message">
                    This account is currently active on another computer or browser. If you proceed, this device will become active instead.
                  </div>
                  <button type="button" onClick={() => { onLogin();   ("exist"); }}  className={`px-6 py-2 w-full mt-6 ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}>
                    Proceed
                  </button>
                  <p className="loginMessage text-center mt-1">Click here to <a onClick={() => {setUserExist(false)}} style={{ color: 'blue', cursor: 'pointer'}}>Login</a> </p>
                </>
                ):(
                  changePass ? (
                    <form onSubmit={onUpdateLogin} className="mt-2 formlg-change" action="#" method="POST">

                      {/* Current Password */}
                      <div className="relative">
                        <input
                          id="old_password"
                          name="old_password"
                          type="password"
                          value={currentPassword}
                          onChange={(ev) => setCurrentPassword(ev.target.value)}
                          className="block w-full ppa-form-login"
                          placeholder="Current Password"
                        />
                      </div>

                      {/* New Password */}
                      <div className="relative mt-4">
                        <input
                          id="new_password"
                          name="new_password"
                          type="password"
                          value={newPassword}
                          onChange={(ev) => setNewPassword(ev.target.value)}
                          className="block w-full ppa-form-login"
                          placeholder="New Password"
                        />
                      </div>

                      {/* Confirm New Password */}
                      <div className="relative mt-4">
                        <input
                          id="confirm_password"
                          name="confirm_password"
                          type="password"
                          value={confirmPassword}
                          onChange={(ev) => setConfirmPassword(ev.target.value)}
                          className="block w-full ppa-form-login"
                          placeholder="Confirm New Password"
                        />
                      </div>

                      {/* Password Contains */}
                      <div className="password-contains">
                        <span className="pc-title">Password must contain</span> <br />
                        <span className="pc-des">- At least one uppercase letter</span> <br />
                        <span className="pc-des">- One number</span> <br />
                        <span className="pc-des">- One symbol</span> <br />
                        <span className="pc-des">- And be at least 8 characters long</span> <br />
                      </div>

                      {/* Submit Button */}
                      <div className="mt-5">
                        <button type="submit" className={`px-6 py-2 w-full ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}>
                          {submitLoading ? (
                            <div className="flex w-full items-center justify-center">
                              <span className="ml-1">Processing</span>
                            </div>
                          ) : (
                            'Submit'
                          )}
                        </button>
                        <p className="loginMessage text-center mt-1">Login? <a onClick={() => setChangePass(false)} style={{ color: 'blue', cursor: 'pointer'}}>Click Here</a> </p>
                      </div>

                    </form>
                  ):(
                    <form onSubmit={onLogin} className="mt-2 formlg-def" action="#" method="POST">

                      {/* Username */}
                      <div className="relative">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={username}
                          onChange={(ev) => setUsername(ev.target.value)}
                          className="block ppa-form-login"
                          placeholder="Username"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative mt-4">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(ev) => setPassword(ev.target.value)}
                          className="block ppa-form-login"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          className="absolute px-3 h-full icon-form-showpass"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>

                      {/* Button */}
                      <div className="mt-5">
                        <button type="submit" onClick={() => setChangeMethod("login")} className={`px-6 py-2 w-full ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}>
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
                  )
                )}
              </div>
            </div>

            <p className="system-version py-5">JOMS version 2.0</p>
          </div>

        </div>

      </div>
    </div>
  );



}
  