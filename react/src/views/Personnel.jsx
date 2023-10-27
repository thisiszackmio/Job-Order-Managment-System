import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStickyNote, faTrash  } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import loadingAnimation from '../assets/loading.gif';

export default function Personnel(){

  library.add(faStickyNote , faTrash);
  const { currentUser } = useUserStateContext();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  //User List
  const [users, setUsers] = useState([]);
  
  //Get Personnel User List
  const fetchUser = () => {
    axiosClient.get('/users')
      .then(response => {
        const usersData = response.data;

        setUsers(usersData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  //Register
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mname, setMname] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [division, setDivision] = useState('');
  const [code_clearance, setCodeClearance] = useState('')
  const [password, setPassword] = useState('');
  const [passwordCorfirmation, setPasswordConfirmation] = useState('');
  const [uploadEsignature, setUploadEsignature] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [error, setError] = useState({__html: ''});

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

    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("mname", mname);
    formData.append("lname", lname);
    formData.append("gender", gender);
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
      setShowPopup(true);
      setPopupMessage("Register Complete");
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
    })
    .finally(() => {
      setIsLoading(false);
    });

  };

  //Assign Personnel
  const [AssignPersonnel, setAssignPersonnel] = useState('');
  const [PersonnelCategory, setPersonnelCategory] = useState('');

  const submitPersonnel = (ev) => {
    ev.preventDefault();

    setSubmitLoading(true);

    const data = {
      user_id: AssignPersonnel, 
      type_of_personnel: PersonnelCategory,
    };

    axiosClient
      .post("/assignpersonnel", data)
      .then((response) => { 
        setShowPopup(true);
        setPopupMessage("Assign Personnel Successfully");    
        setSubmitLoading(false);

        setAssignPersonnel('');
        setPersonnelCategory('');
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setPopupMessage('Data already exists');
          setShowPopup(true);

          setAssignPersonnel('');
          setPersonnelCategory('');
        } else {
          setPopupMessage('Error fetching personnel data');
          setShowPopup(true);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  //Get Personnel
  const [getPersonnel, setGetPersonnel] = useState([]);

  const fetchPersonnel = () => {
    axiosClient.get('/getpersonnel')
    .then((response) => {
      const responseData = response.data;
      const viewPersonnel = Array.isArray(responseData) ? responseData : responseData.data;

      const mappedData = viewPersonnel.map((dataItem) => {
        const { personnel_details } = dataItem;
        const { ap_id, user_id, fname, mname, lname, type } = personnel_details;
        return {
          ap: ap_id,
          id: user_id,
          name: fname +' ' + mname+'. ' + lname,
          type: type
        }
      });
      setGetPersonnel(mappedData)

    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);
    });
  }

  //Remove Personnel
  function removePersonnel(id){
    //alert(id);

    const confirmed = window.confirm('Do you want to remove this personnel on category?');

    if(confirmed) {
      axiosClient.delete(`/removepersonnel/${id}`)
      .then((response) => {
        setPopupMessage('Remove Personnel Successfully');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error('Error fetching personnel data:', error);
      });
    } else {
      setPopupMessage('Remove Personnel is Decline');
      setShowPopup(true);
    }
  };

  //Close Popup
  const closePopup = () => {
    fetchPersonnel();
    setShowPopup(false);
  }

  //Load the data
  useEffect(()=>{
    fetchUser();
    fetchPersonnel();
  },[]);

  return(
  <PageComponent title="Personnel Page">
  {currentUser.code_clearance === 6 ? (
    <>

    <div className="flex">
      {/* Tab 1 */}
      <button
        className={`w-full px-4 py-2 m-0 ${
          activeTab === "tab1"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
        }`}
        onClick={() => handleTabClick("tab1")}
      >
        User List
      </button>
      {/* Tab 2 */}
      <button
        className={`w-full px-4 py-2 m-0 ${
          activeTab === "tab2"
          ? "bg-gray-200 border-b-4 border-gray-800"
          : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
        }`}
        onClick={() => handleTabClick("tab2")}
      >
        Assign Personnel
      </button>
      {/* Tab 3 */}
      <button
        className={`w-full px-4 py-2 m-0 ${
          activeTab === "tab3"
          ? "bg-gray-200 border-b-4 border-gray-800"
          : "bg-gray-200 bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
        }`}
        onClick={() => handleTabClick("tab3")}
      >
        Register
      </button>
    </div>

    <div className="mt-4">

    {/* User List */}
    {activeTab === "tab1" && 
    <div className="overflow-x-auto">
      <h2 className="text-left text-sm font-bold leading-9 tracking-tight text-gray-900">
        Legends of Code Clearance
      </h2>
      <td className="px-2 py-1 text-center border-r-2 border-custom">1 - Admin Division Manager</td>
      <td className="px-2 py-1 text-center border-r-2 border-custom">2 - Supervisor</td>
      <td className="px-2 py-1 text-center border-r-2 border-custom">3 - GSO and Authorize Person</td>
      <td className="px-2 py-1 text-center border-r-2 border-custom">4 - Other Division Manager</td>
      <td className="px-2 py-1 text-center border-r-2 border-custom">5 - Regular and COS Employee</td>
      <td className="px-2 py-1 text-center">6 - IT Personnel</td>

      <table className="border-collapse w-full mb-10 mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-1 uppercase border-2 border-custom">User No.</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Name</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Username</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Division</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-1 uppercase border-2 border-custom">Code Clearance</th>  
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-1 uppercase border-2 border-custom">Action</th>
          </tr>
        </thead>
        <tbody>
        {loading ? ( // Render loading spinner when loading is true
          <tr>
            <td colSpan={6} className="px-2 py-2 text-center border-2 border-custom">
              <div className="flex items-center justify-center">
                <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
                <span className="ml-2">Loading Userlist...</span>
              </div>
            </td>       
          </tr>
        ):(
        users.map(user => (
          <tr key={user.id}>
            <td className="px-2 py-2 text-center border-2 border-custom">{user.id}</td>
            <td className="px-2 py-2 text-center border-2 border-custom">{user.fname} {user.mname}. {user.lname}</td>
            <td className="px-2 py-2 text-center border-2 border-custom">{user.username.split('/').pop()}</td>
            <td className="px-2 py-2 text-center border-2 border-custom">{user.division}</td>
            <td className="px-2 py-2 text-center border-2 border-custom">{user.code_clearance}</td>
            <td className="px-2 py-2 text-center border-2 border-custom">
              <div className="flex justify-center">
                <Link to={`/editaccount/${user.id}`}>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    title="View Request"
                  >
                    <FontAwesomeIcon icon={faStickyNote} className="mr-0" />
                  </button>
                </Link>
              </div>
            </td>
          </tr>
          ))
        )}
        </tbody>
      </table>

    </div>
    }

    {/* Assign Personnel */}
    {activeTab === "tab2" && 
    <div className="mt-10">

      <form onSubmit={submitPersonnel}>

        <div className="grid grid-cols-3 gap-4">

        {/* Personnel Names */}
        <div className="col-span-1">
          <div>
            <div className="mt-2">
              <select 
                name="personnel" 
                id="personnel"
                value={AssignPersonnel}
                onChange={ev => setAssignPersonnel(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="" disabled>Choose Personnel</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assigned Category */}
        <div className="col-span-1">
          <div>
            <div className="mt-2">
              <select 
                name="assign" 
                id="assign"
                value={PersonnelCategory}
                onChange={ev => setPersonnelCategory(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="" disabled>Choose Assign Category</option>
                <option value="Driver/Mechanic">Driver/Mechanic</option>
                <option value="IT Service">IT Service</option>
                <option value="Janitorial Service">Janitorial Service</option>
                <option value="Electronics">Electronics</option>
                <option value="Electrical Works">Electrical Works</option>
                <option value="Watering Services">Watering Services</option>
                <option value="Engeneering Services">Engeneering Services</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Button */}
        <div className="col-span-1">
          <div className="mt-2">
            <button
              type="submit"
              className={`rounded-md w-full px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span className="ml-2">Processing</span>
                </div>
              ) : (
                'Assign'
              )}
            </button>
          </div>
        </div>

        </div>

      </form>

      <div className="mt-10">
        <div className="overflow-x-auto">
          <h2 className="text-left text-sm font-bold leading-9 tracking-tight text-gray-900">
            List of Assign Personnels
          </h2>
          <table className="border-collapse w-7/12 mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-center text-xs font-medium w-60 text-gray-600 uppercase border-2 border-custom">Name</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Type of Personnel</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Action</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-2 py-2 text-center border-2 border-custom">
                  <div className="flex items-center justify-center">
                    <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
                    <span className="ml-2">Loading Perosonnel...</span>
                  </div>
                </td>       
              </tr>
            ) : getPersonnel.length > 0 ? (
              getPersonnel.map((user) => (
                <tr key={user.id}>
                  <td className="px-2 py-2 text-center border-2 border-custom">{user.name}</td>
                  <td className="px-2 py-2 text-center border-2 border-custom">{user.type}</td>
                  <td className="px-2 py-2 text-center border-2 border-custom">
                    <div className="flex justify-center">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                        title="Delete"
                        onClick={() => removePersonnel(user.ap)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-2 py-2 text-center border-2 border-custom">
                  No records
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show Popup */}
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div className="fixed inset-0 bg-black opacity-40"></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
            <p className="text-lg text-center">{popupMessage}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
          </div>
        )}

    </div>
    }

    {/* Register */}
    {activeTab === "tab3" && 
    <div className="px-6 py-6">
      <div>
        <img
          className="mx-auto h-20 w-auto"
          src="ppa_logo.png"
          alt="Your Company"
        />
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register Here for JOMS
        </h2>

        {error.__html && (
          <div className="mt-10 bg-red-500 rounded py-2 px-3 text-white"
          dangerouslySetInnerHTML={error} >
          </div>
        )}
      </div>

      <div className="mt-10">
        <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST" enctype="multipart/form-data"> 

        <div className="grid grid-cols-4 gap-4">

          {/* First Name */}
          <div className="col-span-1">
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
          </div>

          {/* Middle Initial */}
          <div className="col-span-1">
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
          </div>

          {/* Last Name */}
          <div className="col-span-1">
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
          </div>

          {/* Gender */}
          <div className="col-span-1">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                Gender
              </label>
              <div className="mt-2">
                <select 
                  name="gender" 
                  id="gender"
                  value={gender}
                  onChange={ev => setGender(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Choose Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-4">
          
          {/* Username */}
          <div className="col-span-1">
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
          </div>
            
          {/* Division */}
          <div className="col-span-1">
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
          </div>

          {/* Code Clearance */}
          <div className="col-span-1">
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
                  <option value="1">1 - Admin Division Manager</option>
                  <option value="2">2 - Supervisor</option>
                  <option value="3">3 - Authorize Person</option>
                  <option value="4">4 - Other Division Manager</option>
                  <option value="5">5 - Regular and COS Employee</option>
                  <option value="6">6 - IT People</option>
                </select>
              </div>
            </div>
          </div>
        
        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* Password */}
          <div className="col-span-1">
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
          </div>

          {/* Password Confirmation */}
          <div className="col-span-1">
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

        {/* Buttons */}
        <div>
          <button
            type="submit"
            className={`rounded-md w-full px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
              submitLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span className="ml-2">Processing</span>
              </div>
            ) : (
              'Register'
            )}
          </button>
        </div>

        {/* Show Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent black overlay */}
          <div className="fixed inset-0 bg-black opacity-40"></div>
          {/* Popup content with background blur */}
          <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
            <p className="text-lg text-center">{popupMessage}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
          </div>
        )}

        </form>
      </div>
    </div>
    }

    </div>
    </>
  ):(
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        Access Denied. Only IT People can view this page.
      </div>
    </div>
  )}

    
  </PageComponent>
  );
};