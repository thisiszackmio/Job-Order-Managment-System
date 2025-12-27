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

  const [requiredField, setRequiredField] = useState({});

  const handleChange = (ev) => {
    setDetails(ev.target.value);
  };

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Submit the Form
  function onSubmit(e){
    e.preventDefault();
    setSubmitLoading(true);

    const FormData = {
      date_of_request: today,
      details: details
    }

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
      if (error.response.status === 422) {
        const responseErrors = error.response.data.errors;
        setRequiredField(responseErrors);
      }else{
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }  
    })
    .finally(() => {
      setSubmitLoading(false);
    });

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
    window.location.href = '/joms/allannouncement';
  }

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("PM") || codes.includes("AM") || codes.includes("DM") || codes.includes("HACK") || codes.includes("GSO");

  return (
    <PageComponent title="Add Announcement">
      {/* Main Content */}
      {Authorize ? (
        <div className="ppa-widget mt-8">
          <div className="flex justify-between items-center">
            {/* Header */}
            <div className="joms-user-info-header text-left"> 
              Add Announcement Details
            </div>
          </div>

          <div className="p-4">
            <form onSubmit={onSubmit}>

              {/* Date */}
              <div className="flex items-center">
                <div className="w-40">
                  <label htmlFor="rep_date" className="flex form-title"> 
                    Date: 
                  </label> 
                </div>
                <div className="w-full">
                  <input 
                    type="date" 
                    name="rep_date" 
                    id="rep_date" 
                    defaultValue={today}
                    className="block w-full ppa-form-field"
                    readOnly
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center mt-4 ">
                <div className="w-40">
                  <label htmlFor="ppd_name" className="flex form-title"> Details: </label> 
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
                      className="block w-full ppa-form-field"
                    />
                    <p className="text-sm text-gray-500"> {maxCharacters - details.length} characters remaining </p>
                    {!details && requiredField.details && (
                      <p className="form-validation">This form is required</p>
                    )}
                  </div>
                </div>
              </div>  

              {/* Button */}
              <div className="mt-6">
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