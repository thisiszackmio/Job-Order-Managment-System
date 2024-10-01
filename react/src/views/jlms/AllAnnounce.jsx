import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import PageComponent from "../../components/PageComponent";
import submitAnimation from '../../assets/loading_nobg.gif';
import loadingAnimation from '/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../context/ContextProvider";

export default function AllAnnouncements(){

  const { userCode } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState(null);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
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
    } 
    else if(loading) {
      addLoadingClass();
    }
    else {
      removePopupClass();
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removePopupClass();
      removeLoadingClass();
    };
  }, [showPopup, loading]);

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
    .get('/showannouncements/')
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
    })
    .finally(() => {
      setLoading(false);
    });
  },[]);

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

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
          <p className="popup-message">Announcement update successfully</p>
        </div>
      ); 
    })
    .catch((error) => {
      //console.error(error);
      setPopupContent("error");
      setPopupMessage(DevErrorText);
      setShowPopup(true);   
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
  const handleDeleteClick = () => {
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
    .catch(() => {
      setPopupContent('error');
      setPopupMessage(DevErrorText);
      setShowPopup(true);
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  };

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
  const Authorize = codes.includes("PM") || codes.includes("AM") || codes.includes("DM") || codes.includes("HACK");

  return(
    Authorize ? (
      <PageComponent title="All Announcement">
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
            <div className="ppa-form-header"> Announcement List </div>
            <div style={{ padding: '6px 10px 10px 10px' }}>
              {/* Table */}
              <table className="ppa-table w-full mb-10 mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Date</th>
                    <th className="px-3 py-3 text-center text-sm w-1 font-medium text-gray-600 uppercase">Message</th>
                    <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#fff' }}>
                  {announceList?.mappedData?.length > 0 ? (
                    announceList?.mappedData?.map((getData)=>(
                      <tr key={getData.id}>
                        <td className="px-4 py-3 text-center align-top w-1/4 table-font">{getData.date_of_request}</td>
                        <td className="px-4 py-3 text-left table-font">
                          {editingId === getData.id ? (
                          <>
                            <textarea
                              className="w-full ppa-form"
                              style={{ resize: "none" }}
                              type="text"
                              rows={5}
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
                        <td className="w-1/4">
                          <div className="flex justify-center">
                            {editingId === getData.id ? (
                            <>
                              {/* Submit */}
                              <button 
                                type="submit"
                                onClick={() => handleSaveClick(event, getData.id)}
                                className={`ml-2 py-2 px-4 ${ submitLoading ? 'btn-submitLoading' : 'btn-default' }`}
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
                              {/* Cancel */}
                              <button
                                className="px-3 py-2 btn-cancel ml-2"
                                onClick={handleCancelClick}
                              >
                                Cancel
                              </button>
                            </>
                            ):(
                            <>
                              {/* Edit Button */}
                              <button 
                                className="px-3 py-2 btn-default mr-2"
                                onClick={() => handleEditClick(getData.id, getData.details)}
                              >
                                Edit
                              </button>
                              {/* Cancel Button */}
                              <button 
                                className="px-3 py-2 btn-cancel"
                                onClick={() => handleDeleteConfirmation(getData.id)}
                              >
                                Delete
                              </button>
                            </>
                            )}
                          </div>
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

                {/* Warning */}
                {(popupContent == "warning") && (
                <>
                  {/* Submit */}
                  <button 
                    type="submit"
                    onClick={handleDeleteClick}
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

                {/* Error Button */}
                {popupContent == 'error' && (
                  <button onClick={justclose} className="w-full py-2 btn-cancel">
                    Close
                  </button>
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
  );
}