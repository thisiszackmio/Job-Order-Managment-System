import { useState } from "react";
import submitAnimation from '../assets/loading_nobg.gif';
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";

export default function AddEmployee(){

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Variables
  const [ppaNo, setPPANo] = useState('');
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  const [gender, setGender] = useState('');
  const [division, setDivision] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [uploadDisplayPicture, setUploadDisplayPicture] = useState('');
  const [displayPictureName, setDisplayPictureName] = useState('');
  const [uploadEsignature, setUploadEsignature] = useState('');
  const [displayEsignature, setDisplayEsignature] = useState('');

  // Capitalize the First Letter
  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Upload Display Picture
  const handleDisplayPicture = (e) => {
    const imageselect = e.target.files[0];
    setDisplayPictureName(imageselect.name);
    setUploadDisplayPicture(imageselect);
  };

  // Upload E-signature
  const handleEsignature = (e) => {
    const esignature = e.target.files[0];
    setDisplayEsignature(esignature.name);
    setUploadEsignature(esignature);
  };

  // Submit Form
  const registerEmployee = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("PPA_No", ppaNo);
    formData.append("fname", fname);
    formData.append("mname", mname);
    formData.append("lname", lname);
    formData.append("sex", gender);
    formData.append("division", division);
    formData.append("position", jobPosition); 
    formData.append("display_picture", uploadDisplayPicture);
    formData.append("esig", uploadEsignature);

   axiosClient.post("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-rapidapi-host": "file-upload8.p.rapidapi.com",
      "x-rapidapi-key": "your-rapidapi-key-here",
    },
   })
   .then(() => {
      alert("Done");
    })
    .catch((error) => {
      if(error.response.status === 500){
        setShowPopup(true);
        setPopupContent('error');
        setPopupTitle('There is something wrong');
        setPopupMessage('Please contact the developer on the issue (Database Error)')
      }
      else{
        const responseErrors = error.response.data.errors;
        setErrorForm(responseErrors);
      }
    })

  }

  return(
    <PageComponent title="Add Employee">
      <div className="font-roboto ppa-form-box">
        {/* Form */}
        <form onSubmit={registerEmployee} encType="multipart/form-data">

          <div className="ppa-form-header">
            Input Employee Details
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4" style={{ padding: '6px 10px 50px 10px' }}>

            {/* 1st Column */}
            <div className="col-span-1">

              {/* PPA Number */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppa_id" className="block text-base font-medium leading-6 text-black"> PPA ID: </label> 
                </div>
                <div className="w-3/4">
                  <input
                    type="text"
                    name="ppa_id"
                    id="ppa_id"
                    value={ppaNo}
                    onChange={ev => setPPANo(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                  {!ppaNo && errorForm.PPA_No && ( <p className="form-validation">This form is required</p> )}
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppd_name" className="block text-base font-medium leading-6 text-black"> Name: </label> 
                </div>
                <div className="w-3/4 flex">

                  {/* Surname */}
                  <div className="w-3/4 mr-5">
                    <input
                      id="lname"
                      name="lname"
                      type="text"
                      value={lname}
                      onChange={ev => setLname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="Surname"
                      className="block w-full ppa-form"
                    />
                  </div>

                  {/* First Name */}
                  <div className="w-3/4 mr-5">
                    <input
                      id="fname"
                      name="fname"
                      type="text"
                      value={fname}
                      onChange={ev => setFname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="First Name"
                      className="block w-full ppa-form"
                    />
                  </div>

                  {/* Middle Initial */}
                  <div className="w-1/5">
                    <input
                      id="mname"
                      name="mname"
                      type="text"
                      value={mname}
                      onChange={ev => setMname(capitalizeFirstLetter(ev.target.value))}
                      placeholder="M.I"
                      className="block w-full ppa-form"
                    />
                  </div>

                </div>
              </div>  
              {(!fname || !mname || !lname ) && (errorForm.fname || errorForm.mname || errorForm.lname ) && ( <p className="form-validation" style={{ position: 'relative', left: '156px' }}>This form is required</p> )} 

              {/* Gender */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Gender:
                  </label> 
                </div>
                <div className="w-3/4">
                  <select 
                    name="gender" 
                    id="gender"
                    value={gender}
                    onChange={ev => setGender(ev.target.value)}
                    className="block w-full ppa-form"
                    style={{ color: '#A9A9A9' }}
                  >
                    <option value="" disabled>Choose Gender</option>
                    <option value="Male" style={{ color: '#272727' }}>Male</option>
                    <option value="Female" style={{ color: '#272727' }}>Female</option>
                  </select>
                  {!gender && errorForm.sex && ( <p className="form-validation">This form is required</p> )}
                </div>
              </div> 

              {/* Division */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Division:
                  </label> 
                </div>
                <div className="w-3/4">
                  <select 
                    name="division" 
                    id="division"
                    value={division}
                    onChange={ev => setDivision(ev.target.value)}
                    className="block w-full ppa-form"
                    style={{ color: '#A9A9A9' }}
                  >
                    <option value="" disabled>Choose Division</option>
                    <option value="Administrative Division" style={{ color: '#272727' }}>Administrative Division</option>
                    <option value="Finance Division" style={{ color: '#272727' }}>Finance Division</option>
                    <option value="Office of the Port Manager" style={{ color: '#272727' }}>Office of the Port Manager</option>
                    <option value="Port Service Division" style={{ color: '#272727' }}>Port Service Division</option>
                    <option value="Port Police Division" style={{ color: '#272727' }}>Port Police Division</option>
                    <option value="Engineering Service Division" style={{ color: '#272727' }}>Engineering Service Division</option>
                    <option value="Terminal Management Office - Tubod" style={{ color: '#272727' }}>Terminal Management Office - Tubod</option>
                  </select>
                  {!division && errorForm.division && ( <p className="form-validation">This form is required</p> )}
                </div>
              </div>

              {/* Position */}
              <div className="flex items-center mt-4">
                <div className="w-40">
                  <label htmlFor="rep_property_no" className="block text-base font-medium leading-6 text-black">
                    Position:
                  </label> 
                </div>
                <div className="w-3/4">
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={jobPosition}
                    onChange={ev => setJobPosition(capitalizeFirstLetter(ev.target.value))}
                    placeholder="Division Manager A"
                    className="block w-full ppa-form"
                  />
                  {!jobPosition && errorForm.position && ( <p className="form-validation">This form is required</p> )}
                </div>
              </div>

            </div>

            {/* 2nd Column */}
            <div className="col-span-1">

              {/* Display Picture */}
              <div className="flex items-center mt-5">
                <div className="w-48">
                  <label htmlFor="display_picture" className="block text-base font-medium leading-6 text-black">
                    Upload Display Picture:
                  </label> 
                </div>

                <div className="mt-2 w-3/4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1 py-2">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 text-sm leading-6 text-gray-600">
                      <label htmlFor="display_picture" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload your display picture here</span>
                        <input 
                          id="display_picture" 
                          name="display_picture" 
                          type="file" 
                          accept=".png,.jpg,.jpeg"
                          className="sr-only" 
                          onChange={handleDisplayPicture}  
                        />
                        {!displayPictureName && errorForm.display_picture && ( <p className="form-validation">This form is required</p> )}
                      </label>
                    </div>
                    <p className="pl-1 text-sm">PNG, JPEG, and JPG up to 2MB</p>
                    {displayPictureName &&  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">File Name: {displayPictureName}</label> }
                  </div>
                </div>
              </div>

              {/* Electronic Signature */}
              <div className="flex items-center mt-5">
                <div className="w-48">
                  <label htmlFor="esignature" className="block text-base font-medium leading-6 text-black">
                    Upload E-Signature:
                  </label> 
                </div>

                <div className="mt-2 w-3/4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-1 py-2">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 text-sm leading-6 text-gray-600">
                      <label htmlFor="esignature" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload your E-sig here</span>
                        <input 
                          id="esignature" 
                          name="esignature" 
                          type="file" 
                          accept=".png"
                          className="sr-only" 
                          onChange={handleEsignature}  
                        />
                        {!displayEsignature && errorForm.esig && ( <p className="form-validation">This form is required</p> )}
                      </label>
                    </div>
                    <p className="pl-1 text-sm">PNG only up to 2MB</p>
                    {displayEsignature &&  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">File Name: {displayEsignature}</label> }
                  </div>
                </div>
              </div>
      
            </div>

          </div>

          {/* Button */}
          <button type="submit" className={`${ submitLoading ? 'btn-process' : 'btn-submit ml-4 mb-6'}`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex">
                <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                <span className="ml-2">Processing</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>

        </form>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent black overlay */}
            <div className="fixed inset-0 bg-black opacity-40 backdrop-blur"></div>
            {/* Popup content with background blur */}
            <div className="absolute rounded-lg p-4 shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>
              {/* Notification Icons */}
              <div class="f-modal-alert">
                {/* Error */}
                {popupContent === 'error' && (
                  <div className="f-modal-icon f-modal-error animate">
                    <span className="f-modal-x-mark">
                      <span className="f-modal-line f-modal-left animateXLeft"></span>
                      <span className="f-modal-line f-modal-right animateXRight"></span>
                    </span>
                  </div>
                )}
                {/* Success */}
                {popupContent === 'success' && (
                  <div class="f-modal-icon f-modal-success animate">
                    <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                    <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                  </div>
                )}
              </div>
              {/* Popup Title */}
              <p className="font-roboto popup-title"> {popupTitle} </p>

              {/* Popup Message */}
              <p className="font-roboto popup-message"> {popupMessage} </p>

              {/* Popup Button */}
              <div className="flex justify-center mt-6 font-roboto">

                {/* For Error */}
                {/* <button className="w-full btn-error"> Close </button> */}

                {/* For Success */}
                {/* <button className="w-full btn-submit"> Close </button> */}

                {/* For Warning */}
                {/* <button className="w-full btn-submit mr-1"> Confirm </button>
                <button className="w-full btn-error ml-1"> Cancel </button> */}

              </div>

            </div>
          </div>
        )}

      </div>
    </PageComponent>
  );
};