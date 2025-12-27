import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import { useUserStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserPlus, faXmark, faUserAltSlash, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import Popup from "../../components/Popup";
import Restrict from "../../components/Restrict";

export default function AddPersonnel(){
  const { currentUserName, currentUserCode } = useUserStateContext();

  // Function
  const [loading, setLoading] = useState(true);

  const [addPersonnel, SetAddPersonnel] = useState(false);

  const [personnelList, setPersonnelList] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [personnel, setPersonnel] = useState([]);

  // Variable
  const [selectPersonnel, setSelectPersonnel] = useState({ id: '', name: '' });
  const [personnelCategory, setPersonnelCategory] = useState("");

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
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Set Personnel to Not Available
  function handleNotAvailableConfirmation(id){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('NotavailPersonnel');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">Do you want to set this personnel as not available?</p>
      </div>
    );
  }

  // Set to Not Available Function
  function NotAvailPersonnel(id){
    setSubmitLoading(true);

    axiosClient
    .put(`/notvailpersonnel/${id}`, {
      data: {
        authority: currentUserName.name
      }
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Successful</p>
          <p className="popup-message">Personnel marked as not available.</p>
        </div>
      );
    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Set Personnel to Available
  function handleAvailableConfirmation(id, status){
    setSelectedId(id);
    setShowPopup(true);
    setPopupContent('availablePersonnel');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">This personnel is {status === 1 ? "arrived?" : "available?"}</p>
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
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
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
        <p className="popup-message">You want to remove this personnel from the list?</p>
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
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setSubmitLoading(false);
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
        {/* List */}
        {!addPersonnel && (
          <div className="ppa-widget mt-8">
            <div className="flex justify-between items-center">
              {/* Header */}
              <div className="joms-user-info-header text-left"> 
                Personnel List
              </div>
              <div className="flex space-x-4 pt-8 pr-4"> 
                {!addPersonnel && (
                  <FontAwesomeIcon onClick={() => SetAddPersonnel(true)} className="icon-delete" title="Add Personnel" icon={faUserPlus} />
                )}
              </div>
            </div>

            {/* Table */}
            <div className="ppa-div-table p-4">
              <table className="ppa-table w-full">
                {/* Header */}
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-[25%] text-left ppa-table-header">Name</th>
                    <th className="px-4 py-2 w-[25%] text-left ppa-table-header">Assignment</th>
                    <th className="px-4 py-2 w-[25%] text-center ppa-table-header">Status</th>
                    <th className="px-4 py-2 w-[25%] text-center ppa-table-header">Action</th>
                  </tr>
                </thead>
                <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-5 text-center ppa-table-body">
                        <div className="flex justify-center items-center">
                          <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                          <span className="loading-table">Loading</span>
                        </div>
                      </td>
                    </tr>
                  ):(
                    personnelList.map.length > 0 ? (
                      personnelList.map(staffList => (
                        <tr key={staffList.personnel_id}>
                          <td className="px-4 py-4 text-left ppa-table-body">{staffList.personnel_name}</td>
                          <td className="px-4 py-4 text-left ppa-table-body">{staffList.assignment}</td>
                          <td className="px-4 py-4 text-center ppa-table-body">
                            <strong>{staffList.status == 3 ? (
                              <p className="text-red-700">Not Available</p>
                              ):staffList.status == 1 ? (
                                <p className="text-red-700">On Travel</p>
                              ):(
                                <p className="text-black">Available</p>
                              )}</strong>
                          </td>
                          <td className="px-4 py-4 text-center ppa-table-body">
                            {staffList.status == 3 ? (
                              <FontAwesomeIcon onClick={() => handleAvailableConfirmation(staffList.personnel_id, staffList.status)} className="icon-avail mr-4" title="Set Personnel to Available" icon={faUser} />
                            ):staffList.status == 1 ? (
                              <FontAwesomeIcon onClick={() => handleAvailableConfirmation(staffList.personnel_id, staffList.status)} className="icon-avail mr-4" title="Personnel Arrrived" icon={faHouse} />
                            ):(
                            <>
                              <FontAwesomeIcon onClick={() => handleNotAvailableConfirmation(staffList.personnel_id)} className="icon-avail mr-4" title="Set Personnel to Not Available" icon={faUserAltSlash} />
                              <FontAwesomeIcon onClick={() => handleRemovalConfirmation(staffList.personnel_id)} className="icon-remove" title="Removel Personnel" icon={faTrash} />
                            </>
                            )}
                          </td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={4} className="px-2 py-5 text-center ppa-table-body">
                          <div className="flex justify-center items-center w-full font-bold">
                            No records found
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        )}

        {/* Add Personnl */}
        {addPersonnel && (
          <div className="ppa-widget mt-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="joms-user-info-header text-left"> 
                Add Personnel
              </div>
              <div className="flex space-x-4 pt-8 pr-4"> 
                <FontAwesomeIcon onClick={() => {
                  SetAddPersonnel(false);
                  setSelectPersonnel({ id: '', name: '' });
                  setPersonnelCategory('');
                }} className="icon-delete" title="Close" icon={faXmark} />
              </div>
            </div>

            <div className="p-4 ppa-form-box mb-5 w-1/2">
              <form onSubmit={submitPersonnel}>
                {/* Select Personnnel */}
                <div className="items-center">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="form-title"> 
                      Select Personnel: 
                    </label> 
                  </div>
                  <div className="w-full">
                    <select 
                      name="personnel" 
                      id="personnel" 
                      value={selectPersonnel.id}
                      onChange={ev => {
                        const selectedId = parseInt(ev.target.value);
                        const selectedPersonnel = personnel.find(staff => staff.id === selectedId);
                        
                        setSelectPersonnel(selectedPersonnel ? { id: selectedPersonnel.id, name: selectedPersonnel.name } : { id: '', name: '' });
                      }}
                      className="block w-full ppa-form-field"
                    >
                      <option value="" disabled> -- </option>
                      {personnel.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select Assignment */}
                <div className="items-center mt-6">
                  <div className="w-40">
                    <label htmlFor="rep_date" className="form-title"> 
                      Select Assignment: 
                    </label> 
                  </div>
                  <div className="w-full">
                    <select 
                      name="personnel_category" 
                      id="personnel_category" 
                      value={personnelCategory}
                      onChange={ev => {
                        setPersonnelCategory(ev.target.value);
                      }}
                      className="block w-full ppa-form-field"
                    >
                      <option value="" disabled> -- </option>
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

                {/* Submit Button */}
                <div className="mt-6">
                  {selectPersonnel && personnelCategory && (
                    <button 
                      type="submit"
                      className={`py-2 px-3 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
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
                  )}
                </div>
              </form>
            </div>
            
          </div>
        )}
        
      </>
      ):(
        <Restrict />
      )}

      {/* Popup */}
      {showPopup && (
        <Popup 
          popupContent={popupContent}
          popupMessage={popupMessage}
          justClose={justclose}
          closePopup={closePopup}
          personnelId={selectedId}
          NotAvailPersonnel={NotAvailPersonnel}
          AvailableConfirmation={AvailableConfirmation}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
          RemovePersonnel={RemovePersonnel}
        />
      )}

    </PageComponent>
  )
}