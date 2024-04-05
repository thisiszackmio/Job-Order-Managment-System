import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useUserStateContext } from "../context/ContextProvider";
import axiosClient from "../axios";
import ReactPaginate from "react-paginate";
import submitAnimation from '../assets/loading_nobg.gif';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function UserAssign(){

  const { userRole, currentUser } = useUserStateContext();
  
  const [personnel, setPersonnel] = useState([]);
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [addPersonnel, setAddPersonnel] = useState(false);

  const [selectPersonnel, setSelectPersonnel] = useState("");
  const [PersonnelCategory, setPersonnelCategory] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p>There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Get User Data
  const fetchPersonnel = () => {
    axiosClient
    .get('/getpersonnel')
    .then(response => {
      const userData = response.data;

      const getUser = userData
      ? userData.map((users) => {
        return {
          id: users.personnel_id,
          name: users.personnel_name,
          type: users.personnel_type,
          count: users.count
        }
      })
      : null;
      
      setPersonnel(getUser);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  // Search Personnel (For Add Personnel)
  const GetPersonnel = () => {
    axiosClient
    .get('/personnelname')
    .then(response => {
      const userData = response.data;

      const postUser = userData
      ? userData.map((users) => {
        return {
          id: users.id,
          name: users.name
        }
      })
      : null
      
      setAssignPersonnel(postUser);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchPersonnel();
    GetPersonnel();
  },[]);

  // For Search Filter

  //Search Filter and Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  const filteredPersonnel = personnel.filter((data) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentUsers = filteredPersonnel.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCountUser = Math.ceil(filteredPersonnel.length / itemsPerPage);

  // Submit Form (Add Personnel)
  const submitPersonnel = (event) => {
    event.preventDefault();

    const selectedUser = assignPersonnel.find(user => user.id === parseInt(selectPersonnel));
    const logs = `${currentUser.fname} ${currentUser.mname}. ${currentUser.lname} added ${selectedUser ? selectedUser.name : 'unknown user'} on assign personnel as ${PersonnelCategory}`;

    setSubmitLoading(true);

    const data = {
      user_id: selectPersonnel, 
      type_of_personnel: PersonnelCategory,
      logs: logs
    };

    axiosClient
      .post("/assignpersonnel", data)
      .then((response) => { 

        setPopupContent('success')
        setShowPopup(true);
        setPopupMessage(
          <div>
            <p className="popup-title">Done</p>
            <p>Form submit successfully</p>
          </div>
        );    
        setSubmitLoading(false);
      })
      .catch((error) => {
        setPopupContent('error')
        setShowPopup(true);
        setPopupMessage(DevErrorText);    
        setSubmitLoading(false);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  // Popup
  const handleAddForm = () => {
    setAddPersonnel(true);
  }

  // Remove Assign Personnel
  function removePersonnel(id, name){
    //alert(id);

    const logs = `${currentUser.fname} ${currentUser.mname ? currentUser.mname + '.' : ''} ${currentUser.lname} removed ${name} from assign personnel`;
    
    axiosClient.delete(`/removepersonnel/${id}`, {
      data: { logs: logs } 
    })
    .then((response) => {

      setPopupContent('success')
        setShowPopup(true);
        setPopupMessage(
          <div>
            <p className="popup-title">Done</p>
            <p>Assign person remove successfully</p>
          </div>
        );    
    })
    .catch((error) => {
      setPopupContent('error')
      setShowPopup(true);
      setPopupMessage(DevErrorText);   
    });

  };

  //Close Popup on Error
  const justclose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closebtn = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  // Restrictions
  const Authorize = userRole == 'h4ck3rZ@1Oppa';

  return Authorize ? (
  <PageComponent title="Assign Personnel Details">
  {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Personnel Details</span>
    </div>
  ):(
  <>
  <div className="font-roboto">

    {/* Search Filter */}
    <div className="mt-10 flex">

      {/* Search */}
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search Here"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-96 p-2 border border-gray-300 rounded text-sm"
        />
      </div>

      {/* Count */}
      <div className="ml-4" style={{ position: "relative", bottom: "-25px" }}>
        <div className="text-right text-sm/[17px]">
        Total of {personnel.length} user's list
        </div>
      </div>
      
    </div>

    <table className="border-collapse w-full mt-2">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom border-header">Name</th>
          <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom border-header">Assignment</th>
          <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom border-header">No of Apperance</th>
          <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom border-header">Action</th>
        </tr>
      </thead>
      <tbody>
      {currentUsers.length > 0 ? (
        currentUsers.map((data) => (
          <tr key={data.id}>
            <td className="px-1 py-2 align-top border border-custom w-3/12 table-font text-center">{data.name}</td>
            <td className="px-1 py-2 align-top border border-custom w-3/12 table-font text-center">{data.type}</td>
            <td className="px-1 py-2 align-top border border-custom w-1/5 table-font text-center">{data.count == 0 ? "No Apperance" : data.count}</td>
            <td className="px-1 py-2 align-top border border-custom w-3/12 table-font text-center">
              <button
                onClick={() => removePersonnel(data.id, data.name)}
                className="py-1 px-6 btn-error"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ):(
        <tr>
          <td colSpan={4} className="px-6 py-2 text-center border-0 border-custom"> No data </td>
        </tr>
      )}
      </tbody>      
    </table>

    <div className="flex">

      {/* Pagination */}
      <div className="flex-grow">
        <ReactPaginate
          previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
          nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
          breakLabel="..."
          pageCount={pageCountUser}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
        />
      </div>

      {/* Add Button */}
      {addPersonnel ? (
        <div className="flex items-center">
    
          <form id="assign-personnel" onSubmit={submitPersonnel} className="flex items-center">
    
            {/* For Select Personnel */}
            <div className="mt-2">
              <select 
                name="personnel" 
                id="personnel"
                value={selectPersonnel}
                onChange={ev => setSelectPersonnel(ev.target.value)}
                className="block w-80 rounded-md border-1 p-1.5 form-text text-lg border-gray-300 focus:ring-0 focus:border-gray-400 bg-gray-200"
                required
              >
                <option value="" disabled>Select Personnel</option>
                {assignPersonnel.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
    
            {/* Assignment */}
            <div className="mt-2 ml-2">
              <select 
                name="assign" 
                id="assign"
                value={PersonnelCategory}
                onChange={ev => setPersonnelCategory(ev.target.value)}
                className="block w-80 rounded-md border-1 p-1.5 form-text text-lg border-gray-300 focus:ring-0 focus:border-gray-400 bg-gray-200"
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

            {/* Button */}
            <button type="submit" className={`px-6 py-2 ml-2 mt-2 btn-submit 
              ${ submitLoading && 'btn-submitting' }`} disabled={submitLoading}
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
    
        </div>
      ):(
        <div style={{ position: "relative", bottom: "-5px" }}>
          <button onClick={handleAddForm} className="px-6 py-2 btn-submit">
            Add Personnel
          </button>
        </div>
      )}
        
    </div>

  </div>

  {/* Show Popup */}
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Semi-transparent black overlay */}
      <div className="fixed inset-0 bg-black opacity-40"></div>

      {/* Popup content with background blur */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg animate-fade-down" style={{ width: '350px' }}>
        
        {/* Notification Icons */}
        <div class="f-modal-alert">

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
          {(popupContent == 'warning' || popupContent == 'warningD') && (
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
        <p className="text-lg text-center font-roboto"> {popupMessage} </p>

        {/* Buttons */}
        <div className="flex justify-center mt-4 font-roboto">

          {/* Warning */}
          {popupContent == 'warning' && (
          <>
            {/* Confirm */}
            {!submitLoading && (
              <button form="user_details" className="w-1/2 py-2 popup-confirm">
                <FontAwesomeIcon icon={faCheck} /> Confirm
              </button>
            )}

            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justclose} className="w-1/2 py-2 popup-cancel">
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}

            {/* Process */}
            {submitLoading && (
              <button className="w-full cursor-not-allowed py-2 btn-process">
                <div className="flex items-center justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-2">Processing</span>
                </div>
              </button>
            )}
          </>
          )}

          {/* success */}
          {popupContent == 'success' && (
            <button
              onClick={closebtn}
              className="w-full py-2 btn-success"
            >
              Close
            </button>
          )}

          {/* Error */}
          {popupContent == 'error' && (
            <button onClick={justclose} className="w-1/2 py-2 btn-error">
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          )}

        </div>

      </div>

    </div>
  )}

  </>
  )}
  </PageComponent>
  ):(
    (() => {
      window.location = '/forbidden';
      return null; 
    })()
  );

}