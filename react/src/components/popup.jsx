import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Popup({ 
    show,
    userId,
    popupContent,
    popupMessage,
    onConfirm,
    onSuccess,
    inspectionID,
    InspPartB,
    submitFunction,
    adminApproval,
    submitApproval,
    submitDisapproval,
    MarkComplete,
    CancelReq,
    onClose,
    type = "default"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animations and scroll lock
  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      
      // Disable scroll
      document.documentElement.classList.add("popup-active");
      document.body.classList.add("popup-active");
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
      
      // Re-enable scroll
      document.documentElement.classList.remove("popup-active");
      document.body.classList.remove("popup-active");
    }

    return () => {
      document.documentElement.classList.remove("popup-active");
      document.body.classList.remove("popup-active");
    };
  }, [show]);

  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [show, onClose]);

  // Determine button layout based on type
  const showCancelButton = type === "default" || type === "logout";
  const confirmText = type === "logout" ? "Logout" : "OK";

  if (!shouldRender) return null;

  return (
    <div 
      className={`popup-overlay ${isVisible ? "show" : ""}`}
      onClick={onClose}
      aria-hidden={!show}
    >
      <div 
        className={`popup-container ${isVisible ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* <button className="popup-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button> */}

        {/* Notification Icons */}
        <div className="f-modal-alert">

            {/* Success */}
            {popupContent == 'success' && (
                <div className="f-modal-icon f-modal-success animate">
                    <span className="f-modal-line f-modal-tip animateSuccessTip"></span>
                    <span className="f-modal-line f-modal-long animateSuccessLong"></span>
                </div>
            )}

            {/* Error */}
            {(popupContent == 'check-error' ||
              popupContent == 'error') && (
                <div className="f-modal-icon f-modal-error animate">
                    <span className="f-modal-x-mark">
                        <span className="f-modal-line f-modal-left animateXLeft"></span>
                        <span className="f-modal-line f-modal-right animateXRight"></span>
                    </span>
                </div>
            )}

            {/* Warning */}
            {(popupContent === 'InspCancel' ||
              popupContent === 'InspAdmin' ||
              popupContent === 'InspGSO' ||
              popupContent === 'InspApprove' ||
              popupContent === 'InspDisapprove' ||
              popupContent === 'ManConfirm' ||
              popupContent === 'warning' ||
              popupContent === 'logout') && (
                <div className="f-modal-icon f-modal-warning animate">
                    <span className="f-modal-body scaleWarning"></span>
                    <span className="f-modal-dot pulseWarningIns"></span>
                </div>
            )}

        </div>

        <div className="popup-content">
          {popupMessage}
        </div>

        <div className="popup-actions">

          {/* Success */}
          {popupContent == 'success' && (
          <>
            <button className="full-btn btn-secondary" onClick={onSuccess}>
              Close
            </button>
          </>
          )}

          {/* Error */}
          {(popupContent == 'error' || popupContent == 'check-error') && (
          <>
            <button className="full-btn btn-error" onClick={onClose}>
              Cancel
            </button>
          </>
          )}

          {/* Logout */}
          {popupContent == 'logout' && (
          <>    
              {!submitFunction && (
                <button className="full-btn btn-cancel" onClick={onClose}>
                  Cancel
                </button>
              )}

              <button 
                type="submit"
                onClick={onConfirm}
                className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
                disabled={submitFunction}
              >
                {submitFunction ? (
                  <div className="flex justify-center">
                    <span className="btn-loader"></span>
                    <span className="ml-1">Processing</span>
                  </div>
                ):(
                  'Confirm'
                )}
              </button>
          </>
          )}

          {/* --- Cancel Form on Inspection Request --- */}
          {popupContent === 'InspCancel' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => CancelReq(inspectionID)}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

          {/* --- Inspection Supervisor Approval */}
          {popupContent === 'InspApprove' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => submitApproval(inspectionID)}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

          {/* --- Inspection Supervisor Disapproval --- */}
          {popupContent === 'InspDisapprove' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => submitDisapproval(inspectionID)}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

          {/* --- For the Part B Button --- */}
          {popupContent === 'InspGSO' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => InspPartB()}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

          {/* --- For the Admin Approval (Inspection) --- */}
          {popupContent === 'InspAdmin' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => adminApproval(inspectionID)}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

          {/* --- Manual Complete Confirmation --- */}
          {popupContent === 'ManConfirm' && (
          <>
            {/* Cancel */}
            {!submitFunction && (
              <button onClick={onClose} className="full-btn btn-cancel">
                Close
              </button>
            )}

            {/* Submit */}
            <button 
              type="submit"
              onClick={() => MarkComplete(inspectionID)}
              className={`full-btn ${ submitFunction ? 'btn-process' : 'btn-secondary' }`}
              disabled={submitFunction}
            >
              {submitFunction ? (
                <div className="flex justify-center">
                  <span className="btn-loader"></span>
                  <span className="ml-1">Processing</span>
                </div>
              ):(
                'Confirm'
              )}
            </button>
          </>
          )}

        </div>
      </div>
    </div>
  );
}
