import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import Popup from "../../components/Popup";
import submitAnimation from '/default/ring-loading.gif';
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Restrict from "../../components/Restrict";

export default function AddAnnouncements(){

  const { currentUserCode } = useUserStateContext();

  // Date
  const today = new Date().toISOString().split('T')[0];

  const [submitLoading, setSubmitLoading] = useState(false);
  const [details, setDetails] = useState('');
  const maxCharacters = 1000;

  const handleChange = (ev) => {
    setDetails(ev.target.value);
  };

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

  // Dev Error Text
  const DevErrorText = (
    <div>
      <p className="popup-title">Something Wrong!</p>
      <p className="popup-message">There was a problem, please contact the developer. (Error 500)</p>
    </div>
  );

  // Submit the Form
  function onSubmit(e){
    e.preventDefault();
    setSubmitLoading(true);

    const FormData = {
      date_of_request: today,
      details: details
    }

    if(!details){
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(
        <div>
          <p className="popup-title">Invalid</p>
          <p className="popup-message">Please input the Details</p>
        </div>
      );
      setSubmitLoading(false);
    } else {
      axiosClient
      .post('/addannouncements', FormData)
      .then(() => { 
        setShowPopup(true);
        setPopupContent('success');
        setPopupMessage(
          <div>
            <p className="popup-title">Success</p>
            <p className="popup-message">Your announcement is being posted</p>
          </div>
        );
        fetchNotification();    
      })
      .catch((error) => {
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

  }

  // Popup Button Function
  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    window.location.href = '/allannouncement';
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("PM") || codes.includes("AM") || codes.includes("DM") || codes.includes("HACK") || codes.includes("GSO");

  return (
    <PageComponent title="Add Announcement">
      {/* Main Content */}
      {Authorize ? (
        <div className="font-roboto ppa-form-box">
          <div className="ppa-form-header"> Announcement Details </div>
          <div style={{ padding: '6px 10px 50px 10px' }}>

            <form onSubmit={onSubmit}>

              {/* Date */}
              <div className="flex items-center mt-6 ">
                <div className="w-40">
                  <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                    Date: 
                  </label> 
                </div>
                <div className="w-full">
                  <input 
                    type="date" 
                    name="rep_date" 
                    id="rep_date" 
                    defaultValue={today}
                    className="block w-full ppa-form"
                    readOnly
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppd_name" className="block text-base font-medium leading-6 text-black"> Details: </label> 
                </div>

                <div className="w-full flex">
                  <div className="w-full">
                    <textarea
                      id="ppa-lname"
                      name="ppa-lname"
                      rows={3}
                      onChange={handleChange}
                      value={details}
                      maxLength={maxCharacters}
                      style={{ resize: "none" }} 
                      className="block w-full ppa-form"
                    />
                    <p className="text-sm text-gray-500"> {maxCharacters - details.length} characters remaining </p>
                  </div>
                </div>
              </div>  

              {/* Button */}
              <div className="mt-10">
                {/* Submit */}
                <button 
                  type="submit"
                  className={`ml-2 py-2 px-4 ${ submitLoading ? 'process-btn-form' : 'btn-default-form' }`}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <div className="flex">
                      <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                      <span className="ml-1">Loading</span>
                    </div>
                  ):(
                    'Submit'
                  )}
                </button>
              </div>

            </form>

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
          justClose={justClose}
          closePopup={closePopup}
        />
      )}
    </PageComponent>  
  );
}