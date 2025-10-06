import React, { useState } from "react";

const Popup = ({ 
  popupContent,
  popupMessage,
  handleDeleteUser,
  submitLoading,
  submitAnimation, 
  handlelSupervisorApproval,
  SubmitSupReason,
  handlelAdminApproval,
  justClose,
  handleDelete,
  closePopup,
  logout,
  CancelForm,
  SubmitApproval,
  SubmitAdminReason,
  SubmitAvailability,
  personnelId,
  vehicleId,
  NotAvailPersonnel,
  NotAvailVehicle,
  RemovePersonnel,
  AvailableConfirmation,
  CloseForceRequest,
  DeleteFormRequest,
  removeVehicleDet,
  vacantVehicle,
  inspectionData,
  form,
  facility,
  vehicle,
  user
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
      <div className={`absolute p-6 rounded-lg shadow-md bg-white ${closing ? "animate-fade-out" : "animate-fade-down"}`} style={{ width: "350px" }}>

        {/* Notification Icons */}
        <div className="f-modal-alert">

          {/* Success */}
          {popupContent == 'success' && (
            <div class="f-modal-icon f-modal-success animate">
              <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
              <span class="f-modal-line f-modal-long animateSuccessLong"></span>
            </div>
          )}

          {/* Error */}
          {(popupContent == 'error' ||
          popupContent == 'check-error') && (
            <div className="f-modal-icon f-modal-error animate">
              <span className="f-modal-x-mark">
                <span className="f-modal-line f-modal-left animateXLeft"></span>
                <span className="f-modal-line f-modal-right animateXRight"></span>
              </span>
            </div>
          )}

          {/* Warning */}
          {(popupContent == 'warning' ||
          popupContent == "cancelForm" ||
          popupContent == "gsofc" ||
          popupContent == 'delete_user' ||
          popupContent == 'NotavailPersonnel' ||
          popupContent == 'NotavailVehicle' ||
          popupContent == "subAvailability" ||
          popupContent == 'removePersonnel' ||
          popupContent == 'removeVehicle' ||
          popupContent == 'availableVehicle' ||
          popupContent == "gsoi" ||
          popupContent == "gsodelete" ||
          popupContent == "ama" ||
          popupContent == "dma" ||
          popupContent == "dmd" ||
          popupContent == "amif" ||
          popupContent == "adf" ||
          popupContent == "adminApproval" ||
          popupContent == "adminDisapproval" ||
          popupContent == 'Logout') && (
            <div class="f-modal-icon f-modal-warning animate">
              <span class="f-modal-body scaleWarning"></span>
              <span class="f-modal-dot pulseWarningIns"></span>
            </div>
          )}

        </div>

        {/* Popup Message */}
        <p className="text-lg text-center"> 
          {popupContent == 'error' ? (
            popupMessage == '404' ? (
              <>
                <p className="popup-title">Error {popupMessage}</p>
                <p className="popup-message"><span>Data not found.</span></p>
              </>
            ):popupMessage == '406' ? (
              <>
                <p className="popup-title">Error {popupMessage}</p>
                <p className="popup-message"><span>There was a problem on saving the data, please contact to the developer <strong>IP Phone 4084</strong>.</span></p>
              </>
            ):(
              <>
                <p className="popup-title">Error {popupMessage}</p>
                <p className="popup-message">There was a problem, please contact the developer <strong>IP Phone 4084</strong>.</p>
              </>
            )
          ):(
            popupMessage
          )} 
        </p>

        {/* Buttons */}
        <div className="flex justify-end mt-4">

          {/* Error Button */}
          {popupContent == 'error' && (
            <button onClick={justClose} className="w-full py-2 btn-cancel"> Close </button>
          )}

          {popupContent == 'check-error' && (
            <button onClick={justClose} className="w-full py-2 btn-cancel"> Close </button>
          )}

          {/* Delete Confirmation on Announcements */}
          {popupContent == 'warning' && (
          <>
            {/* Confirm */}
            <button 
              type="submit"
              onClick={handleDelete}
              className={`${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
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
              <button onClick={justClose} className=" w-1/2 btn-cancel ml-2">
                Close
              </button>
            )}
          </>
          )}

          {/* Delete User button */}
          {popupContent == 'delete_user' && (
          <>
            <button 
              type="submit"
              onClick={() => handleDeleteUser(user)}
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
            {!submitLoading && (
              <button onClick={justClose} className="w-1/2 py-2 btn-cancel ml-2">
                Close
              </button>
            )}
          </>
          )}

          {/* For Logout */}
          {popupContent == 'Logout' && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={logout}
              className={`${ submitLoading ? 'process-btn w-full' : 'btn-default w-1/2' }`}
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
              <button onClick={handleClose} className="btn-cancel ml-2 w-1/2">
                Close
              </button>
            )}
          </>
          )}

          {/* Success */}
          {popupContent == 'success' && (
            <button onClick={closePopup} className="w-full py-2 btn-default"> Close </button>
          )}

          {/* --- Set Personnel to Not Available --- */}
          {popupContent == 'NotavailPersonnel' && (
            <>
              {/* Submit */}
              <button 
                type="submit"
                onClick={() => NotAvailPersonnel(personnelId)}
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

          {/* --- Set Vehicle to Not Available --- */}
          {popupContent == 'NotavailVehicle' && (
            <>
              {/* Submit */}
              <button 
                type="submit"
                onClick={() => NotAvailVehicle(vehicleId)}
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

          {/* Set Available for Driver and Vehicle */}
          {popupContent == "subAvailability" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => SubmitAvailability(vehicle)}
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
              onClick={() => removeVehicleDet(vehicleId)}
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
              onClick={() => vacantVehicle(vehicleId)}
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

          {/* --- For Inspection Form Request --- */}

          {/* GSO Force Close */}
          {popupContent == "gsofc" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => CloseForceRequest(inspectionData)}
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

          {/* GSO for Inspection Form Part B */}
          {popupContent == "gsoi" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => form()}
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

          {/* GSO Delete Form on Facility*/}
          {popupContent == "gsodelete" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => DeleteFormRequest(facility)}
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

          {/* Admin Approval */}
          {popupContent == "ama" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => handlelAdminApproval(inspectionData)}
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

          {/* --- Sup Approval --- */}

          {/* DM Approval Function */}
          {popupContent == "dma" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => handlelSupervisorApproval(inspectionData)}
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

          {/* DM Disapproval Function */}
          {popupContent == "dmd" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => SubmitSupReason(inspectionData)}
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

          {/* --- Admin Approval --- */}

          {/* Admin Disapproval For Fac */}
          {popupContent == "amif" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              form={form}
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

          {/* Admin Approval For Fac */}
          {popupContent == "adf" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => handlelAdminApproval(facility)}
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
          
          {/* Admin Approval */}
          {popupContent == "adminApproval" && (
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

          {/* Admin Disapproval */}
          {popupContent == "adminDisapproval" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={SubmitAdminReason}
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

          {/* --- Cancel Form --- */}
          {popupContent == "cancelForm" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={CancelForm}
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