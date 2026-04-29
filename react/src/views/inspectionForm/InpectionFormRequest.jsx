import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import { useUserStateContext } from "../../context/ContextProvider";
import Popup from "../../components/Popup";

export default function RepairRequestForm(){
  const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

  const navigate = useNavigate();

  // Loading
  const [loading, setLoading] = useState(true);

  // Date
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date().toISOString().split('T')[0];

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Function
  const [buttonHide, setButtonHide] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // Variable
  const [propertyNo, setPropertyNo] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [BrandModel, setBrandModel] = useState('');
  const [SerialEngineNo, setSerialEngineNo] = useState('');
  const [typeOfProperty, setTypeOfProperty] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [ComplainDefect, setComplainDefect] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState({ id: '', name: '' });

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

  // Get Supervisor
  const [supervisor, setSupervisor] = useState([]);
  useEffect(()=>{
    axiosClient
    .get(`/getsupervisor`)
    .then((response) => {
      const responseData = response.data;

      const supervisorData = responseData.map((dataItem) => {
        return {
          id: dataItem.id,
          name: dataItem.name,
        }
      })

      setSupervisor({supervisorData});
    })
    .finally(() => {
      setLoading(false);
    });
  },[]);

  // Check Form
  function handleConfirm(event){
    event.preventDefault();
    setSubmitLoading(true);

    const formData = {
      form: "Check",
      user_id: currentUserId,
      user_name: currentUserName.name,
      type_of_property: typeOfProperty,
      property_description: propertyDescription,
      location: propertyLocation,
      complain: ComplainDefect,
      supervisor_id: Admin || DivisionManager || PortManager ? currentUserId : selectedSupervisor.id,
      supervisor_name: Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name,
      form_status: PortManager ? 8 : Admin ? 9 : DivisionManager ? 10 : 11,
    };

    axiosClient
    .post("/submitinsprequest", formData)
    .then((response)=>{
      console.log();
      if(response.data.message === "Check"){
        setConfirmation(true);
      }
    })
    .catch((error)=>{
      if(error.response.status === 500) {
        setShowPopup(true);
        setPopupContent('error');
        setPopupMessage(error.response.status);
      }else{
        const responseErrors = error.response.data.errors;
        setPopupContent("check-error");
        setPopupMessage(
          <div>
            <p className="popup-title">Error</p>
            <p className="popup-message">
              {responseErrors.type_of_property ? "Please enter on Type of Property" : 
               responseErrors.property_description ? "Please enter on Description" :  
               responseErrors.location ? "Please enter on Location" :
               responseErrors.complain ? "Please enter on Complain" :  "Please enter on Supervisor"}
            </p>
          </div>
        );
        setShowPopup(true);
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  // Submit Form
  function submitInspForm(){
    setSubmitLoading(true);

    let remarks = Admin || DivisionManager || PortManager ? 'Waiting for the GSO to fill out the Part B form' : 'Waiting for supervisor approval.' ;

    const formData = {
      form: "Uncheck",
      user_id: currentUserId,
      user_name: currentUserName.name,
      property_number: propertyNo,
      acquisition_date: acquisitionDate,
      acquisition_cost: acquisitionCost,
      brand_model: BrandModel,
      serial_engine_no: SerialEngineNo,
      type_of_property: typeOfProperty,
      property_description: propertyDescription,
      location: propertyLocation,
      complain: ComplainDefect,
      supervisor_id: Admin || DivisionManager || PortManager ? currentUserId : selectedSupervisor.id,
      supervisor_name: Admin || DivisionManager || PortManager ? currentUserName.name : selectedSupervisor.name,
      form_status: PortManager ? 8 : Admin ? 9 : DivisionManager ? 10 : 11,
      form_remarks: remarks,
    };

    axiosClient
    .post("/submitinsprequest", formData)
    .then(() => {
      setButtonHide(true);
      setShowPopup(true);
      setPopupContent('success');
      setPopupMessage(
        <div>
          <p className="popup-title">Success</p>
          {Admin || DivisionManager || PortManager ? 
          <p className="popup-message">Waiting for the GSO to fill up the Part B form.</p> : 
          <p className="popup-message">Waiting for the supervisor's approval.</p>
          }
        </div>
      );
    })
    .finally(() => {
      setSubmitLoading(false);
    });
  }

  //Close Popup on Error
  const justClose = () => {
    setShowPopup(false);
  }

  //Close Popup on Success
  const closePopup = () => {
    setSubmitLoading(false);
    setShowPopup(false);
    navigate(`/joms/myrequest#inspection`);
  }

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const PortManager = codes.includes("PM");
  const DivisionManager = codes.includes("DM");

  return (
    <PageComponent title="Request Form">

      {/* Form Content */}
      <div className="ppa-widget px-4 pb-10 mt-8">
        <div className="joms-user-info-header text-left"> Request for Pre/Post Inspection Repair </div>
        {/* Form Area */}
        <div className="form-container">
          {/* Title and Button */}
          <div className="flex justify-between items-center"> 
            {/* Title */}
            <div className="px-2">
              <h2 className="text-base font-bold leading-7 text-gray-900"> 
                {confirmation ? (
                  "Part A: To be filled-up by Requesting Party"
                ):(
                  "Fill up the Form"
                )} 
              </h2>
              <p className="text-xs font-bold text-red-500">
                {confirmation ? (
                  "Please double check your FORM before submitting"
                ):(
                  "* - fields that need to be filled out"
                )} 
              </p>
            </div>
            {/* Button */}
            <div className="px-2 pb-4 flex justify-start">
              {confirmation ? (
                !buttonHide && (
                <>
                  {/* Submit */}
                  <button 
                    onClick={() => submitInspForm()}
                    type="submit"
                    className={`w-auto py-1.5 px-6 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-1">Submitting</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>
    
                  {/* Cancel */}
                  {!submitLoading && (
                    <button onClick={() => setConfirmation(false)} className="w-auto ml-2 py-1.5 px-6 btn-cancel">
                      Revise
                    </button>
                  )}
                </>
                )
              ):(
              <>
                {/* Check Form */}
                <button 
                  onClick={handleConfirm} 
                  className="w-auto py-1.5 px-6 btn-primary">
                  Submit
                </button>
              </>
              )}
            </div>
          </div>

          {/* Field */}
          <div className="grid grid-cols-2 gap-10 px-2">
            {/* 1st Column */}
            <div className="col-span-1">

              {/* Date */}
              <div className="flex items-center mt-5">
                <div className="w-52 form-title">
                  <label htmlFor="rep_date"> 
                    Date
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    <div className="block w-full ppa-form-confirm h-[40px]">
                      {formatDate(today)}
                    </div>
                  )}
                </div>
              </div>

              {/* Property Number */}
              <div className="flex items-center mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_property_no"> 
                    Property Number
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        name="rep_property_no"
                        id="rep_property_no"
                        autoComplete="rep_property_no"
                        value={propertyNo}
                        onChange={ev => setPropertyNo(ev.target.value)}
                        maxLength={255}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {propertyNo }
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Acquisition Date */}
              <div className="flex items-center mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_acquisition_date"> 
                    Acquisition Date
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    confirmation ? (
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {acquisitionDate ? formatDate(acquisitionDate) : ""}
                      </div>
                    ):(
                      <input
                        type="date"
                        name="rep_acquisition_date"
                        id="rep_acquisition_date"
                        value={acquisitionDate}
                        onChange={ev => setAcquisitionDate(ev.target.value)}
                        max={currentDate}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Acquisition Cost */}
              <div className="flex items-center mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_acquisition_cost"> 
                    Acquisition Cost
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    <div className="relative flex items-center">
                      <span className="absolute left-0 flex items-center pl-2 text-gray-600">
                        ₱
                      </span>
                      {!confirmation ? (
                        <input
                          type="text"
                          name="rep_acquisition_cost"
                          id="rep_acquisition_cost"
                          autoComplete="rep_acquisition_cost"
                          value={acquisitionCost}
                          onChange={ev => {
                            const inputVal = ev.target.value;
                            // Allow only numeric input
                            if (/^\d*(\.\d{0,2})?$/.test(inputVal.replace(/,/g, ''))) {
                              setAcquisitionCost(inputVal.replace(/,/g, ''));
                            }
                          }}
                          className="block w-full cost focus:ring-0 ppa-form-field"
                        />
                      ):(
                        <div className="w-full ppa-form-confirm h-[40px]">
                          {acquisitionCost}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Brand/Model */}
              <div className="flex items-center mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="brand_mrep_brand_model"> 
                    Brand/Model
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        name="brand_mrep_brand_model"
                        id="rep_brand_model"
                        autoComplete="rep_brand_model"
                        value={BrandModel}
                        maxLength={255}
                        onChange={ev => setBrandModel(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {BrandModel}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Serial/Engine No */}
              <div className="flex items-center mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_serial_engine_no"> 
                    Serial/Engine No
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        name="rep_serial_engine_no"
                        id="rep_serial_engine_no"
                        autoComplete="rep_serial_engine_no"
                        value={SerialEngineNo}
                        maxLength={255}
                        onChange={ev => setSerialEngineNo(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm h-[40px]">
                        {SerialEngineNo}
                      </div>
                    )
                  )}
                </div>
              </div>

            </div>

            {/* 2nd Column */}
            <div className="col-span-1">

              {/* Type of Property */}
              <div className="flex items-center mt-5">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_type_of_property"> 
                    Type of Property
                    <span className="form-validation ml-2"> * </span>
                  </label> 
                </div>
                <div className="w-full">
                  {loading ? (
                    <div className="skeleton-form"></div>
                  ):(
                    !confirmation ? (
                      <select 
                        name="rep_type_of_property" 
                        id="rep_type_of_property" 
                        autoComplete="rep_type_of_property"
                        value={typeOfProperty}
                        onChange={ev => {
                          setTypeOfProperty(ev.target.value);
                        }}
                        className="block w-full focus:ring-0 ppa-form-field"
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                        <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                        <option value="Others">Others</option>
                      </select>
                    ):(
                      <div className="block w-full ppa-form-confirm">
                        {typeOfProperty}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex items-stretch mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_description"> 
                    Description
                    <span className="form-validation ml-2"> * </span>
                  </label> 
                </div>
                <div className="w-full flex">
                  {loading ? (
                    <div className="skeleton-form w-full"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        name="rep_description"
                        id="rep_description"
                        value={propertyDescription}
                        maxLength={255}
                        onChange={ev => setPropertyDescription(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm flex items-center">
                        {propertyDescription}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-stretch mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_location"> 
                    Location
                    <span className="form-validation ml-2"> * </span>
                  </label>
                </div>
                <div className="w-full flex">
                  {loading ? (
                    <div className="skeleton-form w-full"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        name="rep_location"
                        id="rep_location"
                        value={propertyLocation}
                        maxLength={255}
                        onChange={ev => setPropertyLocation(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm flex items-center">
                        {propertyLocation}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Complain/Defect */}
              <div className="flex items-stretch mt-2">
                <div className="w-52 flex form-title">
                  <label htmlFor="rep_complain"> 
                    Complain/Defect
                    <span className="form-validation ml-2"> * </span>
                  </label>
                </div>
                <div className="w-full flex">
                  {loading ? (
                    <div className="skeleton-form w-full"></div>
                  ):(
                    !confirmation ? (
                      <input
                        type="text"
                        id="rep_complain"
                        name="rep_complain"
                        value={ComplainDefect}
                        maxLength={500}
                        onChange={ev => setComplainDefect(ev.target.value)}
                        className="block w-full focus:ring-0 ppa-form-field"
                      />
                    ):(
                      <div className="w-full ppa-form-confirm flex items-center">
                        {ComplainDefect}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Supervisor */}
              {(Admin || DivisionManager|| PortManager) ? null : (
                <div className="flex items-center mt-2">
                  <div className="w-52 flex form-title">
                    <label htmlFor="rep_supervisor"> 
                      Supervisor
                      <span className="form-validation ml-2"> * </span>
                    </label> 
                  </div>
                  <div className="w-full">
                    {loading ? (
                      <div className="skeleton-form"></div>
                    ):(
                      !confirmation ? (
                        <select 
                          name="rep_supervisor" 
                          id="rep_supervisor" 
                          value={selectedSupervisor.id}
                          onChange={ev => {
                            const supervisorId = ev.target.value;
                            const supervisorData = supervisor.supervisorData.find(sup => sup.id === parseInt(supervisorId));
                            
                            setSelectedSupervisor(supervisorData ? { id: supervisorData.id, name: supervisorData.name } : { id: '', name: '' });
                          }}
                          className="block w-full focus:ring-0 ppa-form-field"
                        >
                          <option value="" disabled>Select your supervisor</option>
                          {supervisor?.supervisorData?.map((Data) => (
                            <option key={Data.id} value={Data.id}>
                              {Data.name}
                            </option>
                          ))}
                        </select>
                      ):(
                        <div className="block w-full ppa-form-confirm">
                          {selectedSupervisor.name}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

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