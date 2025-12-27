import { useEffect, useState, useRef  } from "react";
import axiosClient from "../../axios";
import PageComponent from "../../components/PageComponent";
import Popup from "../../components/Popup";
import loading_table from "/default/ring-loading.gif";
import submitAnimation from '/default/ring-loading.gif';
import { useUserStateContext } from "../../context/ContextProvider";
import Restrict from "../../components/Restrict";
import { faTrash, faPlus, faCheckToSlot, faXmark, faPenToSquare, faCheck, faUserAltSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AllAnnouncements(){

  const { currentUserCode } = useUserStateContext();

  // Function
  const [loading, setLoading] = useState(true);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState(null);
  const textareaRef = useRef(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [announceList, setAnnounceList] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editedDetails, setEditedDetails] = useState('');
  const maxCharacters = 1000;

  const handleEditClick = (id, details) => {
    setEditingId(id);
    setEditedDetails(details);
  };

  const handleChange = (ev) => {
    setEditedDetails(ev.target.value);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Retrieve Data on DB
  useEffect(()=>{
    axiosClient
    .get('/showannouncements')
    .then((response) => {
      const responseData = response.data;

      const mappedData = responseData.map((dataItem) => {
        const date = new Date(dataItem.created_at);

        // Format date
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' };
        const formattedDate = new Intl.DateTimeFormat('en-PH', optionsDate).format(date);

        // Format time
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Manila' };
        const formattedTime = new Intl.DateTimeFormat('en-PH', optionsTime).format(date);

        return{
          id: dataItem.id,
          date_of_request: `${formattedDate} ${formattedTime}`,
          details: dataItem.details,
        }
      });

      setAnnounceList({mappedData});
      setLoading(false);
    });
  },[]);

  // Update Announcement
  const handleSaveClick = (event, id) => {
    event.preventDefault();
    setSubmitLoading(true);

    axiosClient
    .put(`editannouncements/${id}`,{
      details: editedDetails
    })
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Announcement updated successfully.</p>
        </div>
      ); 
    })
    .catch((error) => {
      if (error.response) {
        const code = error.response.status;

        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(<ErrorPopup code={code} />);
      }   
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

  // Delete Confirmation
  const handleDeleteConfirmation = (id) => {
    setSelectedIdForDelete(id);
    setShowPopup(true);
    setPopupContent('warning');
    setPopupMessage(
      <div>
        <p className="popup-title">Are you sure?</p>
        <p className="popup-message">If you delete this, it can be undone.</p>
      </div>
    );
  } 

  // Delete Announcement
  const handleDelete = () => {
    if (selectedIdForDelete === null) return;
    
    setSubmitLoading(true);

    axiosClient
    .delete(`/deleteannouncements/${selectedIdForDelete}`)
    .then(() => {
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          <p className="popup-message">Announcement deleted successfully</p>
        </div>
      );
    })
    .catch((error) => {
      if (error.response) {
        const code = error.response.status;

        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(<ErrorPopup code={code} />);
      } 
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

  // Popup Button Function
  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.reload();
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("PM") || codes.includes("AM") || codes.includes("DM") || codes.includes("HACK") || codes.includes("GSO");

  return(
    <PageComponent title="All Announcement">
  
      {/* Main Content */}
      {Authorize ? (
        <div className="ppa-widget mt-8">
          <div className="flex justify-between items-center">
            {/* Header */}
              <div className="joms-user-info-header text-left"> 
                Announcement List
              </div>
          </div>

          {/* Table */}
          <div className="ppa-div-table p-4">
            <table className="ppa-table w-full">
              {/* Header */}
              <thead>
                <tr>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Date</th>
                  <th className="px-4 py-2 w-[60%] text-center ppa-table-header">Message</th>
                  <th className="px-4 py-2 w-[20%] text-center ppa-table-header">Action</th>
                </tr>
              </thead>
              <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-5 text-center ppa-table-body">
                      <div className="flex justify-center items-center">
                        <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                        <span className="loading-table">Loading</span>
                      </div>
                    </td>
                  </tr>
                ):(
                  announceList?.mappedData?.length > 0 ? (
                    announceList?.mappedData?.map((getData)=>(
                      <tr key={getData.id}>
                        <td className="px-4 py-4 text-left ppa-table-body">{getData.date_of_request}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">
                          {editingId === getData.id ? (
                          <>
                            <textarea
                              ref={textareaRef}
                              className="w-full ppa-form-field"
                              style={{ resize: "none",  overflow: "hidden" }}
                              type="text"
                              rows={3}
                              value={editedDetails}
                              onChange={handleChange}
                              maxLength={maxCharacters}
                            />
                            <p className="text-sm text-gray-500"> {maxCharacters - editedDetails.length} characters remaining </p>
                          </>
                          ):(
                            getData.details
                          )}
                        </td>
                        <td className="px-4 py-4 text-left ppa-table-body">
                          <div className="flex justify-center items-center space-x-4">
                            {editingId === getData.id ? (
                              submitLoading ? (
                                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                              ):(
                              <>

                                {/* Save */}
                                <FontAwesomeIcon
                                  onClick={() => handleSaveClick(event, getData.id)}
                                  className="icon-approve"
                                  icon={faCheck}
                                />

                                {/* Close */}
                                <FontAwesomeIcon
                                  className="icon-close"
                                  onClick={handleCancelClick}
                                  icon={faXmark}
                                />

                              </>
                              )
                            ):(
                              <>
                                {/* Edit */}
                                <FontAwesomeIcon 
                                  className="icon-edit"
                                  onClick={() => handleEditClick(getData.id, getData.details)}
                                  icon={faPenToSquare} 
                                />

                                {/* Remove */}
                                <FontAwesomeIcon 
                                  className="icon-remove"
                                  onClick={() => handleDeleteConfirmation(getData.id)}
                                  icon={faTrash} 
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={3} className="px-2 py-5 text-center ppa-table-body">
                        <div className="flex justify-center items-center w-full font-bold">
                          No announcements
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ):(
        <Restrict />
      )}
      
      {/* Popup */}
      {showPopup && (
        <Popup
          popupContent={popupContent}
          popupMessage={popupMessage}
          handleDelete={handleDelete}
          justClose={justClose}
          closePopup={closePopup}
          submitLoading={submitLoading}
          submitAnimation={submitAnimation}
        />
      )}
      
    </PageComponent>
  );
}