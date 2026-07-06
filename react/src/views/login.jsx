import axios from "../api/axios";
import { useUserStateContext  } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
    const { setCurrentUserId, setCurrentUserName, setCurrentUserAvatar, setCurrentUserToken, setCurrentUserCode } = useUserStateContext();

    // Conditional
    const [userExist, setUserExist] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Error
    const [inputErrors, setInputErrors] = useState('');

    // Variables
    const [changeMethod, setChangeMethod] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
        };

        try {
            const response = await axios.post("/login", LoginData);
            
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

        } catch (error) { 
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
        } finally { 
            setSubmitLoading(false);
        }
    }

    // Update Password Function
    function onUpdateLogin(ev){
        if (ev) ev.preventDefault();

        setSubmitLoading(true);

    const UpdateCredentials = {
      username,
      currentPassword,
      newPassword,
      confirmPassword,
    }

    axios.put("/updateuser", UpdateCredentials)
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
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      });
    }

    return(
        <div className="ppa-cover">
            <div className="ppa-login">
                <div className="ppa-login-wrap">

                    {/* Logo */}
                    <img className="login-logo" src="/default/ppa_logo-st.png" alt="Your Company" />

                    <div className="ppa-login-card">

                        <div className="ppa-login-title">
                            <div className="login-title">Job Order Management System</div>
                        </div>

                        <div className="login-detail mt-2">
                            <div> {userExist ? "Still Login" : changePass ? "Update Credentials" : "Login" } </div>
                        </div>

                        {/* Error */}
                        <div className="login-error"> {inputErrors} </div>

                        {/* Login Details */}
                        <div className="login-form">
                            {userExist ? (
                            <>
                                <div className="login-exist-message">
                                    This account is currently active on another computer or browser. If you proceed, this device will become active instead.
                                </div>
                                <div className="input-group-custom mt-3">
                                    <button type="button" onClick={() => { onLogin();   ("exist"); }}  className={`full-btn mt-6 ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}>
                                        {submitLoading ? (
                                            <div className="flex w-full items-center justify-center">
                                            <span className="btn-loader"></span>
                                            <span className="ml-1">Processing</span>
                                            </div>
                                        ) : (
                                            'Proceed'
                                        )}
                                    </button>
                                </div>
                                <p className="loginMessage text-center mt-1">Click here to <button type="button" onClick={() => setUserExist(false) } className="link-direct">Login</button> </p>
                            </>
                            ):(
                                changePass ? (
                                    <form onSubmit={onUpdateLogin} className="mt-2 formlg-change" action="#" method="POST">
                                        {/* Old Password */}
                                        <div className="input-group-custom">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />

                                            <input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                                className="block ppa-form"
                                                placeholder="Current Password"
                                                value={currentPassword}
                                                onChange={(ev) => setCurrentPassword(ev.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* New Password */}
                                        <div className="input-group-custom mt-3">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />

                                            <input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                                className="block ppa-form"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(ev) => setNewPassword(ev.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="input-group-custom mt-3">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />

                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                className="block ppa-form"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(ev) => setConfirmPassword(ev.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Password Contains */}
                                        <div className="password-contains mt-3">
                                            <span className="pc-title">Password must contain</span> <br />
                                            <span className="pc-des">- At least one uppercase letter</span> <br />
                                            <span className="pc-des">- One number</span> <br />
                                            <span className="pc-des">- One symbol</span> <br />
                                            <span className="pc-des">- And be at least 8 characters long</span> <br />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="input-group-custom mt-3">
                                            <button type="submit" className={`full-btn ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}>
                                            {submitLoading ? (
                                                <div className="flex w-full items-center justify-center">
                                                <span className="btn-loader"></span>
                                                <span className="ml-1">Processing</span>
                                                </div>
                                            ) : (
                                                'Submit'
                                            )}
                                            </button>
                                        </div>

                                        <p className="loginMessage text-center mt-1">Click here to <button type="button" onClick={() => setChangePass(false) } className="link-direct">Login</button> </p>
                                    </form>
                                ):(
                                    <form onSubmit={onLogin} className="mt-2 formlg-def" action="#" method="POST">
                                        {/* Username */}
                                        <div className="input-group-custom">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />

                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                className="block ppa-form"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(ev) => setUsername(ev.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="input-group-custom mt-3">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />

                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="block ppa-form"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(ev) => setPassword(ev.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Button */}
                                        <div className="input-group-custom mt-3">
                                            <button type="submit" 
                                                onClick={() => setChangeMethod("login")} className={`full-btn ${ submitLoading ? 'btn-process' : 'btn-primary'}`} disabled={submitLoading}
                                            >
                                            {submitLoading ? (
                                                <div className="flex w-full items-center justify-center">
                                                <span className="btn-loader"></span>
                                                <span className="ml-1">Processing</span>
                                                </div>
                                            ) : (
                                                'Login'
                                            )}
                                            </button>
                                        </div>

                                        <div className="system-version p-4">JOMS version 2.1</div>

                                    </form>
                                )
                            )}
                        </div>

                    </div>

                </div> 
            </div>
        </div>  
    );
}