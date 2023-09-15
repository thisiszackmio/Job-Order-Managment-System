import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";

export default function Login() {
  const { setCurrentUser, setUserToken, setUserRole } = useUserStateContext ();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState({__html: ''}); 

  const userRole = 'admin';

  const handleLogin = async (credentials) => {
    try {
      // Make a POST request to your login endpoint using axiosClient
      const response = await axiosClient.post("/login", credentials);

      // Assuming the response contains the user's role in the 'role' field
      const userRole = response.data.role;

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

    handleLogin({ username, password }) // Call the handleLogin function with credentials
      .then(({userRole, data}) => {
        setCurrentUser(data.user);
         setUserToken(data.token);
         setUserRole(userRole);
      })
      .catch((error) => {
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Job Order Managment System
            </h2>

            {error.__html && (
              <div className="mt-10 bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error} >
              </div>
            )}

          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          </div>
        </div>
      </>
    )
  }
  