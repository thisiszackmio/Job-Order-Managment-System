import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStickyNote, faSpinner  } from '@fortawesome/free-solid-svg-icons';

export default function RequestList()
{
  const { currentUser } = useUserStateContext();

  const {id} = useParams();

  library.add(faSpinner, faStickyNote);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [getCodeClearance, setCodeClearance] = useState(false);
  const [getSignature, setSignature] = useState(false);
  const [getPassword, setPassword] = useState(false);
  const [uploadedUpdateFileName, setUploadedUpdateFileName] = useState("");
  const [uploadUpdateEsignature, setUploadUpdateEsignature] = useState('');
  const [getUpdatePassword, setUpdatePassword] = useState('');

  const [popupMessage, setPopupMessage] = useState('');

  const [updateCodeClearance, setUpdateCodeClearance] = useState('');

  const enableCodeClearance = () => { setCodeClearance(true); }
  const ChangePass = () => { setPassword(true); }

  const enableSignature = () => { setSignature(true); }

  const disableForm = () => { 
    setCodeClearance(false);
    setSignature(false); 
    setPassword(false);
  };

  //Fixing Later
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setUploadedUpdateFileName(selectedFile.name);
    setUploadUpdateEsignature(selectedFile);
  };

  useEffect(() => {
    axiosClient
    .get(`/users/${id}`)
    .then(response => {
      const usersData = response.data;
      const getuserData = usersData.users;
      const getuserSign = usersData.signature;

      setUsers({
        getuserData:getuserData,
        getuserSign:getuserSign
      });
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  //Code Clearance
  const changeCodeClearance = (event) => {
    event.preventDefault();

    //alert(updateCodeClearance);

    setSubmitLoading(true);

    axiosClient
    .put(`changecc/${id}`, {
      code_clearance: updateCodeClearance,
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Code Clearance Change Done");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  };

  //Signature (Pending)
  const changeSignature = (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    //alert(uploadUpdateEsignature)

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('image', uploadUpdateEsignature);

  axiosClient
    .post(`changesg/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    })
    .then(({ data }) => {
      setShowPopup(true);
      setPopupMessage("ESignature Update Done");
      setSubmitLoading(false);
      //alert("done");
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

  //Password
  const UpdatePassword = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    axiosClient
    .put(`changepwd/${id}`, {
      password: getUpdatePassword,
    })
    .then((response) => { 
      setShowPopup(true);
      setPopupMessage("Password Change Done");    
      setSubmitLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }
  

  return(
    <PageComponent title="Edit User">
    {currentUser.code_clearance === 6 ?(
    <>
    {loading ? (
      <tr>
        <td colSpan="6" className="px-6 py-4 text-center whitespace-nowrap">
          <FontAwesomeIcon icon={faSpinner} spin /> Loading...
        </td>
      </tr>
    ) : (
    <div className="overflow-x-auto">

      {/* Name */}
      <div className="flex mt-4">
        <div className="w-20">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Name:
          </label>
        </div>
        <div className="w-64">
          {users.getuserData.fname} {users.getuserData.mname}. {users.getuserData.lname}
        </div>
      </div>

      {/* Division */}
      <div className="flex mt-4">
        <div className="w-20">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Division:
          </label>
        </div>
        <div className="w-64">
          {users.getuserData.division}
        </div>
      </div>

      {/* Gender */}
      <div className="flex mt-4">
        <div className="w-20">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Gender:
          </label>
        </div>
        <div className="w-64">
          {users.getuserData.gender}
        </div>
      </div>

      {/* Username */}
      <div className="flex mt-4">
        <div className="w-24">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Username:
          </label>
        </div>
        <div className="w-64">
          {users.getuserData.username.split('/').pop()}
        </div>
      </div>

      {/* Code Clearance */}
      <div className="flex mt-4">
        <div className="w-40">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Code Clearance:
          </label>
        </div>
        {/* Edit Code Clearance */}
        {getCodeClearance ? (
        <div className="flex w-5/12">
          <form onSubmit={changeCodeClearance}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <select 
                name="type_of_property" 
                id="type_of_property" 
                autoComplete="type_of_property"
                value={updateCodeClearance}
                onChange={ev => setUpdateCodeClearance(ev.target.value)}
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
            <div className="col-span-1">
              <div className="flex">
                {/* Back to Account Page */}
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
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
                    'Submit'
                  )}
                </button>
                {/* Change Code Clearance */}
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={disableForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          
          
          </form>
        </div>
        ):(
        <div className="w-64">
          {users.getuserData.code_clearance}
        </div>
        )}  
      </div>

      {/* Signature */}
      <div className="flex mt-4">
        <div className="w-32">
          <label htmlFor="insp_date" className="block text-base font-medium leading-6 text-gray-900">
            Signature:
          </label>
        </div>
        <div className="w-full">
        {getSignature ? (
          <div className="flex w-full">
            <form onSubmit={changeSignature} method="POST" action="#" enctype="multipart/form-data">
              <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Upload Your E-Signature</label>
              {/* Upload */}
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
                  {uploadedUpdateFileName &&  <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">File Name: {uploadedUpdateFileName}</label> }
                </div>
              </div>
            
              {/* Button */}
              <div className="flex mt-5">
                {/* Back to Account Page */}
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
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
                    'Submit'
                  )}
                </button>
                {/* Change Code Clearance */}
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={disableForm}
                >
                  Cancel
                </button>
              </div>
              
            </form>
          </div>
        ):(
          <img src={users.getuserSign} alt="" />
        )}
        </div>
      </div>
      
      {getPassword ? (
      <div className="w-60 mt-10">
        {/* Password */}
        <div className="col-span-1">
          <form onSubmit={UpdatePassword}>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="text"
                autoComplete="current-password"
                required
                value={getUpdatePassword}
                onChange={ev => setUpdatePassword(ev.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Button */}
            <div className="flex mt-5">
                {/* Back to Account Page */}
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
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
                    'Submit'
                  )}
                </button>
                {/* Change Code Clearance */}
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={disableForm}
                >
                  Cancel
                </button>
              </div>
          </form>
        </div>
      </div>
      ):null}
      

      {/* Button */}
      <div className="mt-20 flex">
        {/* Back to Account Page */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link to="/account">Back to Account</Link>
        </button>
        {/* Change Code Clearance */}
        {users.getuserData.id === 1 ? null : (
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={enableCodeClearance}
          >
            Change Code Clearance
          </button>
        )}
        {/* Change Signature */}
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={enableSignature}
        >
          Change Signature
        </button>
        {/* Change Password */}
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={ChangePass}
        >
          Change Password
        </button>
      </div>

      {/* Show Popup */}
      {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Semi-transparent black overlay */}
        <div
          className="fixed inset-0 bg-black opacity-40" // Close on overlay click
        ></div>
        {/* Popup content with background blur */}
        <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
          <p className="text-lg text-center">{popupMessage}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                window.location.href = '/account';
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
        </div>
      )}

    </div>
    )}
    </>
    ): 
    (
    <div>Access Denied. Only IT People can view this page.</div>
    )}
    </PageComponent>
  )
}