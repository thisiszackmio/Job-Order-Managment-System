import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import submitAnimation from '../assets/loading_nobg.gif';

export default function Login() {

  const { setCurrentId, setUserToken, setUserCode } = useUserStateContext();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Variable
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [inputErrors, setInputErrors] = useState('');

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
        // Handle errors from the response
        if (error.response && error.response.data) {
            setInputErrors(error.response.data.error || 'Login failed. Please try again.');
        } else {
            setInputErrors('An unexpected error occurred. Please try again later.');
        }
    } finally {
        setSubmitLoading(false);
    }
  };

  return (
    <>
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row ppa-cover font-roboto" style={{ backgroundImage: "url('ppa_bg.png')" }}>
      <div className="lg:w-3/4 order-2 lg:order-1"></div>
      <div className="lg:w-1/4 order-1 lg:order-2 bg-white px-6 py-10 lg:px-8 ppa-col">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="login-logo"
              src="ppa_logo.png"
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
                <button type="submit" className={`px-6 py-2 w-full login-btn ${ submitLoading && 'login-btn'}`} disabled={submitLoading}>
                  {submitLoading ? (
                    <div className="flex w-full items-center justify-center">
                      <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                      <span className="ml-2">Processing</span>
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
    </>
  )
}
  