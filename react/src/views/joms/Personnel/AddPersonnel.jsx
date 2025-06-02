import React, { useEffect, useState } from "react";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import submitAnimation from '/default/ring-loading.gif';
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckToSlot, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import Popup from "../../../components/Popup";
import Restrict from "../../../components/Restrict";

export default function AddPersonnel(){
  const { currentUserName, currentUserCode } = useUserStateContext();

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer (IP phone: <b>4048</b>). (Error 500)</p>
    </div>
  );

  // Function
  const [loading, setLoading] = useState(true);
  const [addPersonnel, SetAddPersonnel] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Disable the Scroll on Popup
  useEffect(() => {
    // Define the class to be added/removed
    const popupClass = 'popup-show';

    // Function to add the class to the body
    const addPopupClass = () => document.body.classList.add(popupClass);

    // Function to remove the class from the body
    const removePopupClass = () => document.body.classList.remove(popupClass);

    // Add or remove the class based on showPopup state
    if (showPopup) {
      addPopupClass();
    } else {
      removePopupClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
    };
  }, [showPopup]);

  const [personnelList, setPersonnelList] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  // Variable
  const [selectPersonnel, setSelectPersonnel] = useState({ id: '', name: '' });
  const [personnelCategory, setPersonnelCategory] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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

  // Assign Personnel
  function submitPersonnel(event){
    event.preventDefault();
    setSubmitLoading(true);

    const data = {
      personnel_id: selectPersonnel.id,
      personnel_name: selectPersonnel.name,
      assignment: personnelCategory,
      status: 0
    }

    axiosClient
    .post('/assignpersonnel', data)
    .then(() => {
      SetAddPersonnel(false);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Assignment Complete!</p>
          <p className="popup-message">You assign {selectPersonnel.name} as a {personnelCategory}</p>
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

  // Removal Popup 
  function handleRemovalConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('removePersonnel');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want remove? It cannot be undone.</p>
      </div>
    );
  }

  // Delete Personnel Function
  function RemovePersonnel(id){
    setSubmitLoading(true);

    axiosClient
    .delete(`/removepersonnel/${id}`, {
      data: {
        authority: currentUserName.name
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

  // Set Available Popup
  function handleAvailableConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availablePersonnel');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">This personnel is available?</p>
      </div>
    );
  }

  // Set Available Function
  function AvailableConfirmation(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/availpersonnel/${id}`, {
      authority: currentUserName.name
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Successful</p>
          <p className="popup-message">The personnel is available</p>
        </div>
      );
    })
    .catch((error)=>{
      if (error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(DevErrorText);
      }
    });
  }

  //Close Popup on Error
  const justclose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setShowPopup(false);
    setLoading(true);
    setSubmitLoading(false);
    setSelectPersonnel({ id: '', name: '' });
    setPersonnelCategory('');
    fetchPersonnelList();
    fetchPersonnel();
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperAdmin = codes.includes("HACK");
  const PersonnelAuthority = codes.includes("AU");
  const Access = Admin || GSO || SuperAdmin || PersonnelAuthority ;

  return(
    <PageComponent title="Personnel">

      {Access ? (
      <>
        {/* For Adding Personnel */}
        {addPersonnel && (
        <>
          <div className="ppa-form-header text-base flex justify-between items-center">
            <div>Assign Personnel</div>
            <div className="flex space-x-4">
              <FontAwesomeIcon onClick={() => {
                SetAddPersonnel(false);
                setSelectPersonnel({ id: '', name: '' });
                setPersonnelCategory('');
              }} className="icon-delete" title="Close" icon={faXmark} />
            </div>
          </div>
          <div className="p-2 ppa-form-box mb-5">
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
                <button 
                  type="submit"
                  className={`ml-3 py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                  disabled={submitLoading || !selectPersonnel.id || !personnelCategory}
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

              </div>
            </form>
          </div>
        </>
        )}

        {/* For the Personnel List */}
        <div className="ppa-form-header text-base flex justify-between items-center">
          <div>Personnel List</div>
          <div className="flex space-x-4"> 
            {!addPersonnel && (
              <FontAwesomeIcon onClick={() => SetAddPersonnel(true)} className="icon-delete" title="Add Personnel" icon={faUserPlus} />
            )}
          </div>
        </div>
        <div className="p-2 ppa-form-box">
          {/* Table */}
          <table className="ppa-table w-full mb-10 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Name</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Assignment</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Status</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
              {loading ? (
              <tr>
                <td colSpan={4} className="px-1 py-3 text-base text-center border-0 border-custom">
                  <div className="flex justify-center items-center">
                    <span className="loading-table">Fetching Data</span>
                  </div>
                </td>
              </tr>
              ):(
                personnelList.map.length > 0 ? (
                  personnelList.map(staffList => (
                      <tr key={staffList.personnel_id}>
                        <td className="px-3 py-2 text-center table-font">{staffList.personnel_name}</td>
                        <td className="px-3 py-2 text-center table-font">{staffList.assignment}</td>
                        <td className="px-3 py-2 text-center table-font">
                          <strong>{staffList.status == 1 ? ("On Travel"):("Available")}</strong>
                        </td>
                        <td className="px-3 py-2 text-center table-font">
                          {staffList.status == 1 ? (
                            <FontAwesomeIcon onClick={() => handleAvailableConfirmation(staffList.personnel_id)} className="icon-avail" title="Available" icon={faCheckToSlot} />
                          ):(
                            <FontAwesomeIcon onClick={() => handleRemovalConfirmation(staffList.personnel_id)} className="icon-remove" icon={faTrash} />
                          )}
                        </td>
                      </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={3} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </>
      ):(<Restrict />)}

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          justClose={justclose}
          closePopup={closePopup}
          personnelId={selectedId}
          RemovePersonnel={RemovePersonnel}
          AvailableConfirmation={AvailableConfirmation}
        />
      )}

    </PageComponent>
  );
}