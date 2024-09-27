import React, { useEffect, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import submitAnimation from '../../../assets/loading_nobg.gif';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function AddPersonnel(){

  const { currentUserId, userCode } = useUserStateContext();

  // Variable
  const [selectPersonnel, setSelectPersonnel] = useState({ id: '', name: '' });
  const [personnelCategory, setPersonnelCategory] = useState("");

  // Function
  const [loading, setLoading] = useState(true);
  const [personnelList, setPersonnelList] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Disable the Scroll on Popup
  useEffect(() => {
    // Define the class to be added/removed
    const popupClass = 'popup-show';
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } else if (loading) {
      addLoadingClass();
    } else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup, loading]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Get Personnel List
  const fetchPersonnelList = () => {
    axiosClient
    .get('/showpersonnel')
    .then((response) => {
      const responseData = response.data;

      setPersonnelList(responseData);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get Personnel Data
  const fetchPersonnel = () => {
    axiosClient
    .get('/getpersonnel')
    .then((response) => {
      const responseData = response.data;

      setPersonnel(responseData);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(()=>{
    fetchPersonnelList();
    fetchPersonnel();
  },[]);

  // Removal Popup 
  const handleRemovalConfirmation = (id) => {
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('warning');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want remove? It cannot be undone.</p>
      </div>
    );
  }

  // Submit the form
  const submitPersonnel = (event) => {
    event.preventDefault();

    setSubmitLoading(true);

    const logs = `${selectPersonnel.name} has been assigned to the ${personnelCategory}'s list.`

    const data = {
      personnel_id: selectPersonnel.id,
      personnel_name: selectPersonnel.name,
      assignment: personnelCategory,
      logs: logs
    }

    axiosClient
    .post('/assignpersonnel', data)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Assignment Complete!</p>
          <p className="popup-message">Your assign {selectPersonnel.name} on {personnelCategory}</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });

  }

  // Delete the Form
  const RemovePersonnel = () => {

    setSubmitLoading(true);

    const logs = `${currentUserId?.name} has removed one of the assigned personnel from the list.`;

    axiosClient
    .delete(`/removepersonnel/${selectedId}`, {
      data: {
        logs: logs
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Remove Successful</p>
          <p className="popup-message">The assign user has been remove on the database</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
    
  }

  // Popup Button Function
  //Close Popup on Error
  const justclose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperAdmin = codes.includes("HACK");
  const Access = Admin || GSO || SuperAdmin ;

  return(
    Access ? (
      <PageComponent title="Personnel">
        {loading ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
            <img
              className="mx-auto h-44 w-auto"
              src={loadingAnimation}
              alt="Your Company"
            />
            <span className="loading-text loading-animation">
            {Array.from("Loading...").map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
            ))}
            </span>
          </div>
        ):(
        <>
          {/* Main Content */}
          <div className="font-roboto ppa-form-box">
            <div className="ppa-form-header">Personnel List</div>

            <div className="p-2">

              {/* Table */}
              <table className="ppa-table w-full mb-10 mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Name</th>
                    <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Assignment</th>
                    <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#fff' }}>
                {personnelList.map.length > 0 ? (
                  personnelList.map(staffList => (
                    <tr key={staffList.personnel_id}>
                      <td className="px-3 py-2 text-center table-font">{staffList.personnel_name}</td>
                      <td className="px-3 py-2 text-center table-font">{staffList.assignment}</td>
                      <td className="px-3 py-2 text-center table-font">
                        <button
                          onClick={() => handleRemovalConfirmation(staffList.personnel_id)}
                          className="py-1 px-6"
                        >
                          <FontAwesomeIcon className="text-red-500" icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={3} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>

            </div>

          </div>

          {/* Add Personnel */}
          <div className="font-roboto ppa-form-box mt-4">
            <div className="ppa-form-header">Assign Personnel</div>
            <div className="p-2">

              <form onSubmit={submitPersonnel}>

                <div className="flex items-center">
                  {/* Select Personnnel */}
                  <select 
                    name="personnel" 
                    id="personnel" 
                    value={selectPersonnel.id}
                    onChange={ev => {
                      const selectedId = parseInt(ev.target.value);
                      const selectedPersonnel = personnel.find(staff => staff.id === selectedId);
                      
                      setSelectPersonnel(selectedPersonnel ? { id: selectedPersonnel.id, name: selectedPersonnel.name } : { id: '', name: '' });
                    }}
                    className="block w-2/5 ppa-form"
                  >
                    <option value="" disabled>Select a Personnel</option>
                    {personnel.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                  </select>

                  {/* Select Personnnel */}
                  <select 
                    name="personnel_category" 
                    id="personnel_category" 
                    value={personnelCategory}
                    onChange={ev => {
                      setPersonnelCategory(ev.target.value);
                    }}
                    className="block w-2/5 ppa-form ml-4"
                  >
                    <option value="" disabled>Select an Assignment </option>
                    <option value="Driver/Mechanic">Driver/Mechanic</option>
                    <option value="IT Service">IT Service</option>
                    <option value="Janitorial Service">Janitorial Service</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical Works">Electrical Works</option>
                    <option value="Watering Services">Watering Services</option>
                    <option value="Engeneering Services">Engeneering Services</option>
                  </select>

                  {/* Submit */}
                  <div className="w-1/5">
                  {(selectPersonnel.id && personnelCategory) && (
                  <>
                    <button 
                      type="submit"
                      className={`ml-3 py-2 px-3 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
                      disabled={submitLoading}
                    >
                    {submitLoading ? (
                      <div className="flex">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Loading</span>
                      </div>
                    ):(
                    'Submit'
                    )}
                    </button>
                  </>
                  )}                  
                  </div>
                  
                </div>

              </form>

            </div>
          </div>
        </>
        )}

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent black overlay with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            {/* Popup content */}
            <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
              {/* Notification Icons */}
              <div className="f-modal-alert">

                {/* Error */}
                {popupContent == 'error' && (
                  <div className="f-modal-icon f-modal-error animate">
                    <span className="f-modal-x-mark">
                      <span className="f-modal-line f-modal-left animateXLeft"></span>
                      <span className="f-modal-line f-modal-right animateXRight"></span>
                    </span>
                  </div>
                )}

                {/* Warning */}
                {(popupContent == "warning") && (
                  <div class="f-modal-icon f-modal-warning scaleWarning">
                    <span class="f-modal-body pulseWarningIns"></span>
                    <span class="f-modal-dot pulseWarningIns"></span>
                  </div>
                )}

                {/* Success */}
                {popupContent == 'success' && (
                  <div class="f-modal-icon f-modal-success animate">
                    <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                    <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                  </div>
                )}
                
              </div>
              {/* Popup Message */}
              <p className="text-lg text-center"> {popupMessage} </p>
              {/* Buttons */}
              <div className="flex justify-center mt-4">

                {/* Error Button */}
                {popupContent == 'error' && (
                  <button onClick={justclose} className="w-full py-2 btn-cancel">
                    Close
                  </button>
                )}

                {(popupContent == 'warning') && (
                <>
                  {/* Submit */}
                  <button 
                    type="submit"
                    onClick={RemovePersonnel}
                    className={`py-2 px-4 ${ submitLoading ? 'btn-submitLoading w-full' : 'btn-default w-1/2' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Loading</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>

                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={justclose} className="w-1/2 py-2 btn-cancel ml-2">
                      Close
                    </button>
                  )}
                </>
                )}

                {/* Success */}
                {popupContent == 'success' && (
                  <button onClick={closePopup} className="w-full py-2 btn-default">
                    Close
                  </button>
                )}

              </div>
            </div>
          </div>
        )}

      </PageComponent>
    ):(
      (() => { window.location = '/unauthorize'; return null; })()
    )
  )
}