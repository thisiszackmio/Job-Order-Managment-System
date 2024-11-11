import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import submitAnimation from '/default/ring-loading.gif';

export default function Login() {

  const { setCurrentId, setUserToken, setUserCode } = useUserStateContext();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Variable
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [inputErrors, setInputErrors] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Submit the login
  const onSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitLoading(true);
    setInputErrors(''); // Clear previous errors

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

        // Redirect to home page or dashboard
        window.location.href = '/';
    } catch (error) {
      const responseData = error.response?.data?.error;

      if(responseData == "TokenExist"){
        setShowPopup(true)
      }

    } finally {
        setSubmitLoading(false);
    }
  };

  //Close Popup on Error
  function justClose() {
    setShowPopup(false);
    setUsername('');
    setPassword('');
  }

  return (
    <>
    {/* Login Page */}
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row ppa-cover font-roboto" style={{ backgroundImage: "url('default/ppa_bg.png')" }}>
      <div className="lg:w-3/4 order-2 lg:order-1"></div>
      <div className="lg:w-1/4 order-1 lg:order-2 bg-white px-6 py-10 lg:px-8 ppa-col">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="login-logo"
              src="default/ppa_logo.png"
              alt="Your Company"
            />     
            <div className="mb-10 login-title">
              <div>Joint Local</div>
              <div>Management System</div>
            </div>

            {inputErrors && (
              <div className="login-error">
                {inputErrors}
              </div>
            )}

          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">

              {/* Username */}
              <div>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              {/* Login Button */}
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
            <p className="popup-message">This user is still logged in. Do you want to log out to sign in on this device?</p>
          </p>
          {/* Buttons */}
          <div className="flex justify-center mt-4">
            {/* Confirm */}
            <button 
              type="submit"
              onClick={() => SubmitSupReason(inspectionData)}
              className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-1">Loading</span>
                </div>
              ):(
                'Yes, Please'
              )}
            </button>

            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
  