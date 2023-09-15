import { useState } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../axios.js";
import { useUserStateContext } from "../context/ContextProvider.jsx";
import { useNavigate  } from 'react-router-dom';

export default function Register() {
    const { setCurrentUser, setUserToken } = useUserStateContext();
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [mname, setMname] = useState('');
    const [username, setUsername] = useState('');
    const [division, setDivision] = useState('');
    const [code_clearance, setCodeClearance] = useState('')
    const [password, setPassword] = useState('');
    const [passwordCorfirmation, setPasswordConfirmation] = useState('');
    const [uploadEsignature, setUploadEsignature] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [error, setError] = useState({__html: ''});

    const navigate = useNavigate();

    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleFname = (ev) => {
      const capitalizedValue = capitalizeFirstLetter(ev.target.value);
      setFname(capitalizedValue);
    }

    const handleMname = (ev) => {
      const capitalizedValue = capitalizeFirstLetter(ev.target.value);
      setMname(capitalizedValue);
    }

    const handleLname = (ev) => {
      const capitalizedValue = capitalizeFirstLetter(ev.target.value);
      setLname(capitalizedValue);
    }

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setUploadedFileName(selectedFile.name);
      setUploadEsignature(selectedFile);
    };
    
    const onSubmit = (ev) => {
      ev.preventDefault();
      setError({__html: '' })

      const formData = new FormData();
      formData.append("fname", fname);
      formData.append("mname", mname);
      formData.append("lname", lname);
      formData.append("image", uploadEsignature);
      formData.append("username", username);
      formData.append("division", division);
      formData.append("code_clearance", code_clearance);
      formData.append("password", password);
      formData.append("password_confirmation", passwordCorfirmation);

      
      axiosClient.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-rapidapi-host": "file-upload8.p.rapidapi.com",
          "x-rapidapi-key": "your-rapidapi-key-here",
        },
      })
        .then(({ data }) => {
          //console.log(data);
          navigate('/');
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
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST" enctype="multipart/form-data"> 
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
                    onChange={handleFname}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

              </div>

              <div>
                <label htmlFor="fname" className="block text-sm font-medium leading-6 text-gray-900">
                  Middle Initial
                </label>
                <div className="mt-2">
                  <input
                    id="mname"
                    name="mname"
                    type="text"
                    autoComplete="mname"
                    value={mname}
                    onChange={handleMname}
                    required
                    maxLength={2}
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
                    onChange={handleLname}
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
                    <option value="2">2 - Supervisor</option>
                    <option value="3">3 - Authorize Person</option>
                    <option value="4">4 - Regular Employee</option>
                    <option value="5">5 - Contract of Service Employee</option>
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

              {/* Upload Electronic Signature */}
              <div class="col-span-full">
                <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Upload Your E-Signature</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                      <label for="esignature" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input 
                          id="esignature" 
                          name="esignature" 
                          type="file" 
                          accept=".png"
                          class="sr-only" 
                          onChange={handleFileChange} 
                          required 
                        />
                      </label>
                      <p class="pl-1">PNG only up to 2MB</p>
                    </div>
                    {uploadedFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedFileName}</label> }
                  </div>
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
          </div>
        </div>
      </>
    )
  }
  