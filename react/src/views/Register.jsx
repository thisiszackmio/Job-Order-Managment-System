import { useState } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../axios.js";
import { userStateContext } from "../context/ContextProvider.jsx";

export default function Register() {
    const { setCurrentUser, setUserToken } = userStateContext();
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [division, setDivision] = useState('');
    const [code_clearance, setCodeClearance] = useState('')
    const [password, setPassword] = useState('');
    const [passwordCorfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState({__html: ''}); 
    
    const onSubmit = (ev) => {
      ev.preventDefault();
      setError({__html: '' })

      axiosClient.post("/register", {
          fname,
          lname,
          username,
          division,
          code_clearance,
          email,
          password,
          password_confirmation: passwordCorfirmation
        })
        .then(({ data }) => {
          //console.log(data);
          setCurrentUser(data.user)
          setUserToken(data.token)
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

    }

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
              Register Here for JOMS
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login with your account
              </Link>
            </p>

            {error.__html && (
              <div className="mt-10 bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error} >
              </div>
            )}

          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
              {/* Name */}
              <div>
                <label htmlFor="fname" className="block text-sm font-medium leading-6 text-gray-900">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    autoComplete="fname"
                    value={fname}
                    onChange={ev => setFname(ev.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

              </div>

              <div>
                <label htmlFor="lname" className="block text-sm font-medium leading-6 text-gray-900">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    autoComplete="lname"
                    required
                    value={lname}
                    onChange={ev => setLname(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="unsername" className="block text-sm font-medium leading-6 text-gray-900">
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
                    onChange={ev => setUsername(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Division */}
              <div>
                <label htmlFor="division" className="block text-sm font-medium leading-6 text-gray-900">
                  Division
                </label>
                <div className="mt-2">
                  <select 
                    name="division" 
                    id="division"
                    value={division}
                    onChange={ev => setDivision(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>Choose Division</option>
                    <option value="Administrative Division">Administrative Division</option>
                    <option value="Finance Division">Finance Division</option>
                    <option value="Office of the Port Manager">Office of the Port Manager</option>
                    <option value="Port Service Division">Port Service Division</option>
                    <option value="Port Police Division">Port Police Division</option>
                    <option value="Engineering Service Division">Engineering Service Division</option>
                    <option value="Terminal Management Office - Tubod">Terminal Management Office - Tubod</option>
                  </select>
                </div>
              </div>

              {/* Code Clearance */}
              <div>
                <label htmlFor="code_clearance" className="block text-sm font-medium leading-6 text-gray-900">
                  Code Clearance
                </label>
                <div className="mt-2">
                  <select 
                    name="code_clearance" 
                    id="code_clearance"
                    value={code_clearance}
                    onChange={ev => setCodeClearance(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>Choose Code Clearance</option>
                    <option value="1">1 - Division Manager</option>
                    <option value="2">2 - Authorize Person</option>
                    <option value="3">3 - Regular</option>
                    <option value="4">4 - Contract of Service</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Password Confirmation */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                    Password Confirmation
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    value={passwordCorfirmation}
                    onChange={ev => setPasswordConfirmation(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p>
          </div>
        </div>
      </>
    )
  }
  