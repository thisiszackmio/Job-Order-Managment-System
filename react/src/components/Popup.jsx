import React from "react";

export default function Popup({ 
  popupContent, 
  popupMessage, 
  closePopup, 
  justClose, 
  handleDelete, 
  submitLoading, 
  submitAnimation, 
  handleDeleteUser,
  handlelSupervisorApproval,
  handlelAdminApproval,
  handleCloseFormRequest,
  CloseForceRequest,
  SubmitSupReason,
  removeVehicleDet,
  SubmitApproval,
  handleCloseForm,
  inspectionData,
  facility,
  vehicle,
  form,
  user
}){
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent black overlay with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Popup content */}
      <div className="absolute p-6 rounded-lg shadow-md bg-white animate-fade-down" style={{ width: '350px' }}>
        {/* Notification Icons */}
        <div className="f-modal-alert">
          {/* Error */}
          {popupContent === 'error' && (
            <div className="f-modal-icon f-modal-error animate">
              <span className="f-modal-x-mark">
                <span className="f-modal-line f-modal-left animateXLeft"></span>
                <span className="f-modal-line f-modal-right animateXRight"></span>
              </span>
            </div>
          )}
          {/* Success */}
          {popupContent === 'success' && (
            <div className="f-modal-icon f-modal-success animate">
              <span className="f-modal-line f-modal-tip animateSuccessTip"></span>
              <span className="f-modal-line f-modal-long animateSuccessLong"></span>
            </div>
          )}
          {/* Warning */}
          {(popupContent == "warning" || 
            popupContent == "delete_user" ||
            popupContent == "dma" || popupContent == "dmd" || popupContent == "gsoi" || popupContent == "ama" || popupContent == "gsocr" || popupContent == "gsofc" ||
            popupContent == "adf" || popupContent == "amif" ||
            popupContent == "vdd" || popupContent == "amav" || popupContent == "amdv" || popupContent == "gsovcf")
            && (
            <div class="f-modal-icon f-modal-warning scaleWarning">
              <span class="f-modal-body pulseWarningIns"></span>
              <span class="f-modal-dot pulseWarningIns"></span>
            </div>
          )}
        </div>
        {/* Popup Message */}
        <p className="text-lg text-center"> {popupMessage} </p>
        {/* Buttons */}
        <div className="flex justify-center mt-4">
          {/* Error Button */}
          {popupContent == 'error' && (
            <button onClick={justClose} className="w-full py-2 btn-cancel"> Close </button>
          )}
          {/* Success */}
          {popupContent == 'success' && (
            <button onClick={closePopup} className="w-full py-2 btn-default"> Close </button>
          )}
          {/* Delete Confirmation on Announcements */}
          {popupContent == 'warning' && (
          <>
            {/* Confirm */}
            <button 
              type="submit"
              onClick={handleDelete}
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

          {/* --- For Add Vehicle Details --- */}
          {popupContent == "vdd" && (
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

          {/* --- For Inspection Form Request --- */}

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
          {/* GSO for Inspection Form Part B */}
          {popupContent == "gsoi" && (
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
          {/* GSO Close the request */}
          {popupContent == 'gsocr' && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => handleCloseFormRequest(inspectionData)}
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

          {/* --- For Facility Form Request --- */}

          {/* Admin Approval */}
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
          {/* Admin Disapproval */}
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

          {/* --- For Vehicle Slip --- */}

          {/* Admin Approval */}
          {popupContent == "amav" && (
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
          {popupContent == "amdv" && (
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

          {/* Close Force Request */}
          {popupContent == "gsovcf" && (
          <>
            {/* Submit */}
            <button 
              type="submit"
              onClick={() => handleCloseForm(vehicle)}
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
  )
}