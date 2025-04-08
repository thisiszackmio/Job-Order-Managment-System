import React, { useState } from "react";

const Popup = ({ 
  popupContent,
  popupMessage,
  submitLoading,
  submitAnimation, 
  justClose,
  closePopup,
  vehicle,
  SubmitApproval,
  personnelId,
  RemovePersonnel,
  AvailableConfirmation,
  removeVehicleDet,
  vacantVehicle
}) => {

  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true); // Start fade-out animation
    setTimeout(() => {
      justClose(); // Call the actual close function after animation
    }, 300); // Match the duration of animation (300ms)
  };
  return(
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${closing ? "animate-fade-out" : ""}`}>
      {/* Semi-transparent black overlay with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Popup content */}
      <div className={`absolute p-6 rounded-lg shadow-md bg-white ${closing ? "animate-fade-out" : "animate-fade-down"}`} style={{ width: "430px" }}>
        {/* Popup Message */}
        <p className="text-lg text-center"> {popupMessage} </p>
        {/* Buttons */}
        <div className="flex justify-end mt-4">

          {/* Error Button */}
          {popupContent == 'error' && (
            <button onClick={justClose} className="w-full py-2 btn-cancel"> Close </button>
          )}

          {/* Success */}
          {popupContent == 'success' && (
            <button onClick={closePopup} className="w-full py-2 btn-default"> Close </button>
          )}

          {/* --- Remove Personnel on the List --- */}
          {popupContent == 'removePersonnel' && (
            <>
              {/* Submit */}
              <button 
                type="submit"
                onClick={() => RemovePersonnel(personnelId)}
                className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
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
                <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                  Close
                </button>
              )}
            </>
          )}

          {/* --- Available Personnel on the List --- */}
          {popupContent == 'availablePersonnel' && (
            <>
              {/* Submit */}
              <button 
                type="submit"
                onClick={() => AvailableConfirmation(personnelId)}
                className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
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
                <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                  Close
                </button>
              )}
            </>
          )}

          {/* --- Remove Vehile Details on the List --- */}
          {popupContent == 'removeVehicle' && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={removeVehicleDet}
              className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-1">Loading</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>

            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                Close
              </button>
            )}
          </>  
          )}

          {/* --- Remove Vehile Details on the List --- */}
          {popupContent == 'availableVehicle' && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={vacantVehicle}
              className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-1">Loading</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>

            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                Close
              </button>
            )}
          </>  
          )}

          {/* --- For Vehicle Form Request --- */}
          
          {/* Admin Approval */}
          {popupContent == "adminVehApproval" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={SubmitApproval}
              className={`py-2 px-4 ${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex justify-center">
                  <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                  <span className="ml-1">Loading</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>

            {/* Cancel */}
            {!submitLoading && (
              <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                Close
              </button>
            )}
          </>
          )}

        </div>
      </div>
    </div> 
  );
};

export default Popup;