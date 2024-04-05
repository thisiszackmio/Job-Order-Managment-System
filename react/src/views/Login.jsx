import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import loadingAnimation from '../assets/loading.gif';

export default function Login() {
  const { setCurrentUser, setUserToken, setUserRole } = useUserStateContext ();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState({__html: ''}); 
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setError({ __html: "" });

      // Make a POST request to your login endpoint using axiosClient
      ///const response = await axiosClient.post("/login", credentials);
      const response = await axiosClient.post("/login", credentials);

      // Assuming the response contains the user's role in the 'role' field
      const userRole = response.data.role;

      setCurrentUser(response.data.user);
      setUserToken(response.data.token);
      setUserRole(userRole);
      

      // Now you have the user's role; you can store it in state, context, or any state management solution you use.
      // For example, if you are using React state and setUserRole is a state update function:
      return { userRole, data: response.data };
    } catch (error) {
      // Handle login error
      if (error.response) {
        const errorMessages = Object.values(error.response.data.errors)
          .flatMap((errorArray) => errorArray)
          .join('<br>');

        console.log(errorMessages);
        setError({ __html: errorMessages });
      }

      console.error(error);
    }
  };


  const onSubmit = (ev) => {

    ev.preventDefault();
    setError({ __html: "" });

    setIsLoading(true);

    handleLogin({ username, password }) // Call the handleLogin function with credentials
      .then(({userRole, data}) => {
        setCurrentUser(data.user);
         setUserToken(data.token);
         setUserRole(userRole);
        //  window.location.href = '/';
         window.location.href = '/dashboard';
      })
      .catch((error) => {
        setIsLoading(false);

        if (error.response) {
          const errorMessages = Object.values(error.response.data.errors)
              .flatMap((errorArray) => errorArray)
              .join('<br>');
  
          console.log(errorMessages);
          setError({ __html: errorMessages });
        }
        
        console.error(error);
      });

  };

  return (
    <>
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row ppa-cover" style={{ backgroundImage: "url('ppa_bg_2.png')" }}>
      <div className="lg:w-3/4 order-2 lg:order-1"></div>
      <div className="lg:w-1/4 order-1 lg:order-2 bg-white px-6 py-12 lg:px-8 ppa-col">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-40 w-auto"
              src="ppa_logo.png"
              alt="Your Company"
            />     
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Job Order Management System
            </h2>

            {error.__html && (
              <div className="mt-10 bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error} >
              </div>
            )}

          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {isLoading ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
            <img
              className="mx-auto h-44 w-auto"
              src="ppa_logo_animationn_v4.gif"
              alt="Your Company"
            />
            <span className="ml-2 animate-heartbeat">Redirecting...</span>
          </div>
          ):(
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>
          )}
          </div>

      </div>
    </div>
    </>
  )
}
  