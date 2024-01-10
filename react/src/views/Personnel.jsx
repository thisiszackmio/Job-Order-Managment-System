import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStickyNote, faTrash  } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import loadingAnimation from '../assets/loading.gif';
import ReactPaginate from "react-paginate";
import submitAnimation from '../assets/bouncing.gif';

export default function Personnel(){

  library.add(faStickyNote , faTrash);
  const { currentUser } = useUserStateContext();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //Search
  const [searchText, setSearchText] = useState("");

  //Table Pagination Limit
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
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

  //Table Pagination and Search Filter
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  const filteredUsers = displayedUsers.filter((user) => {
    return (
        user.fname.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lname.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const renderedUsers = filteredUsers.map((user) => (
    <tr key={user.id}>
      <td className="px-1 py-1 text-sm text-center border border-custom font-bold">{user.id}</td>
      <td className="px-1 py-1 text-sm text-center border border-custom">
      {`${user.lname.toUpperCase()}, ${user.fname} ${user.mname}.`}
      </td>
      <td className="px-1 py-1 text-sm text-center border border-custom">
        <i>{user.username.split("/").pop()}</i>
      </td>
      <td className="px-1 py-1 text-sm text-center border border-custom">{user.position}</td>
      <td className="px-1 py-1 text-sm text-center border border-custom">{user.division}</td>
      <td className="px-1 py-1 text-sm text-center border border-custom">{user.code_clearance}</td>
      <td className="px-1 py-1 text-sm text-center border border-custom">
        <div className="flex justify-center">
          <Link to={`/editaccount/${user.id}`}>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              title="View Request"
            >
              <FontAwesomeIcon icon={faStickyNote} className="mr-0" />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  ));

  //Register
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mname, setMname] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [division, setDivision] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [code_clearance, setCodeClearance] = useState('')
  const [password, setPassword] = useState('');
  const [passwordCorfirmation, setPasswordConfirmation] = useState('');
  const [uploadEsignature, setUploadEsignature] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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

    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("mname", mname);
    formData.append("lname", lname);
    formData.append("gender", gender);
    formData.append("image", uploadEsignature);
    formData.append("username", username);
    formData.append("division", division);
    formData.append("position", jobPosition);
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
        const responseErrors = error.response.data.errors;
        setInputErrors(responseErrors);
      }
      console.error(error);
    })
    .finally(() => {
      setSubmitLoading(false);
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
    <div>

      <h2 className="text-left text-sm font-bold leading-9 tracking-tight text-gray-900">
        Legends of Code Clearance
      </h2>
      <td className="px-2 py-1 text-center text-sm border-r border-custom">1 - Admin Division Manager</td>
      <td className="px-2 py-1 text-center text-sm border-r border-custom">2 - Supervisor</td>
      <td className="px-2 py-1 text-center text-sm border-r border-custom">3 - GSO and Authorize Person</td>
      <td className="px-2 py-1 text-center text-sm border-r border-custom">4 - Other Division Manager</td>
      <td className="px-2 py-1 text-center text-sm border-r border-custom">5 - Regular and COS Employee</td>
      <td className="px-2 py-1 text-center">6 - IT Personnel</td>
      
      <div className="flex mt-6 mb-0">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name"
            value={searchText}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="pagination-container ml-auto">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(users.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
      
      <table className="border-collapse w-full mb-10 mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 w-1 uppercase border border-custom">User No.</th>
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Name</th>
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Username</th>
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Plantilla Position Title</th>
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Division</th>
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 w-1 uppercase border border-custom">Code Clearance</th>  
            <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 w-1 uppercase border border-custom">Action</th>
          </tr>
        </thead>
        <tbody>
        {loading ? (
          <tr>
            <td colSpan={7} className="px-2 py-2 text-center border border-custom">
              <div className="flex items-center justify-center">
                <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
                <span className="ml-2">Loading Userlist...</span>
              </div>
            </td>       
          </tr>
        ):( renderedUsers )}
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
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Processing...</span>
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
          <table className="border-collapse w-full mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-center text-xs font-medium w-4/12 text-gray-600 uppercase border border-custom">Name</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Personnel</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-2 py-2 text-center border border-custom">
                  <div className="flex items-center justify-center">
                    <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
                    <span className="ml-2">Loading Perosonnel...</span>
                  </div>
                </td>       
              </tr>
            ) : getPersonnel.length > 0 ? (
              getPersonnel.map((user) => (
                <tr key={user.id}>
                  <td className="px-1 py-1 text-sm text-center border border-custom">{user.name}</td>
                  <td className="px-1 py-1 text-sm text-center border border-custom">{user.type}</td>
                  <td className="px-1 py-1 text-sm text-center border border-custom">
                    <div className="flex justify-center">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        title="Delete"
                        onClick={() => removePersonnel(user.ap)}
                      >
                        <FontAwesomeIcon icon={faTrash} size="1g" className="mr-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-2 py-2 text-center border border-custom">
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
          <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round"/></svg>
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {inputErrors.fname && (
                  <p className="text-red-500 text-xs mt-2">First Name is Required</p>
                )}
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
                  maxLength={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {inputErrors.mname && (
                  <p className="text-red-500 text-xs mt-2">Middle Initial is Required</p>
                )}
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
                  value={lname}
                  onChange={handleLname}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {inputErrors.lname && (
                  <p className="text-red-500 text-xs mt-2">Last Name is Required</p>
                )}
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
              {inputErrors.gender && (
                <p className="text-red-500 text-xs mt-2">Gender is Required</p>
              )}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-4 gap-4">
          
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
                  value={username}
                  onChange={ev => setUsername(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {inputErrors.username && (
                  <p className="text-red-500 text-xs mt-2">Username is Required</p>
                )}
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
              {inputErrors.division && (
                <p className="text-red-500 text-xs mt-2">Division is Required</p>
              )}
            </div>
          </div>

          {/* Plantilla Position Title */}
          <div className="col-span-1">
            <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
            Plantilla Position Title
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={jobPosition}
                onChange={ev => setJobPosition(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {inputErrors.position && (
                <p className="text-red-500 text-xs mt-2">Position is Required</p>
              )}
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
                {inputErrors.code_clearance && (
                  <p className="text-red-500 text-xs mt-2">Code Clearance is Required</p>
                )}
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
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="absolute text-sm inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
             </div>
             {inputErrors.password && (
                <p className="text-red-500 text-xs mt-2">
                  {inputErrors.password.map((error, index) => (
                    <tr key={index}>
                      <td>{error}</td>
                    </tr>
                  ))}
                </p>
              )}
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
                  type={showPassword ? 'text' : 'password'}
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
                  />
                </label>
                <p class="pl-1">PNG only up to 2MB</p>
              </div>
              {uploadedFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedFileName}</label> }
            </div>
          </div>
          {inputErrors.image && (
            <p className="text-red-500 text-xs mt-2">E Signature is Required</p>
          )}
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
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Processing...</span>
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
          <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round"/></svg>
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