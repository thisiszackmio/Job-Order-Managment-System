import { useNavigate } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosClient from "../../api/axios";
import Popup from "../../components/popup";
import { format } from "date-fns";

export default function InspectionRequest() {
    const { currentUserId, currentUserCode, currentUserName } = useUserStateContext();

    // Mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreen = () => {
        setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
        };

        checkScreen(); // run on load
        window.addEventListener('resize', checkScreen);

        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const navigate = useNavigate();

    // Loading
    const [loading, setLoading] = useState(true);

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupMessage, setPopupMessage] = useState("");

    // Date
    const today = new Date().toISOString().split('T')[0];

    //Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // For Currency
    const formatCurrency = (value) => {
        // Remove non-numeric except decimal
        const cleaned = value.replace(/[^\d.]/g, "");
        // Split into whole and decimal
        const [whole, decimal] = cleaned.split(".");
        // Add commas to whole part
        const formatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // Rejoin with decimal (max 2 places)
        return decimal ? `${formatted}.${decimal.slice(0, 2)}` : formatted;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const numericOnly = value.replace(/[^\d.]/g, "");
        
        if (/^\d*(\.\d{0,2})?$/.test(numericOnly)) {
        setAcquisitionCost(numericOnly); // store raw value
        }
    };

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

    // Function
    const [submitLoading, setSubmitLoading] = useState(false);

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

    async function submitInspForm() {
        setSubmitLoading(true);

        let remarks = Admin || DivisionManager || PortManager ? 
        'Waiting for the GSO response' : 
        'Waiting for supervisor approval' ;
        
        try{
            const formData = {
                user_id: currentUserId,
                user_name: currentUserName.name,
                property_number: propertyNo,
                acquisition_date: acquisitionDate ? format(acquisitionDate, "yyyy-MM-dd") : null,
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
            }

            // console.log(formData);

            await axiosClient.post("/submitinsprequest", formData);

            // Success Popup
            setPopupContent("success");
            setPopupMessage(
            <div>
                <p className="popup-title">Request Submitted</p>
                <p className="popup-message">Your inspection request has been submitted successfully.</p>
            </div>
            );
            setShowPopup(true);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const responseErrors = error.response.data.errors || {};
                setShowPopup(true);
                setPopupContent("error");
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">
                        {responseErrors.type_of_property ? "Please enter on Type of Property" : 
                            responseErrors.property_description ? "Please enter on Description" :  
                            responseErrors.location ? "Please enter on Location" :
                            responseErrors.complain ? "Please enter on Complain" :  "Please enter on Supervisor"
                        }
                    </p>
                    </div>
                );
            } else if(error.response){
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">
                        An issue occurred. Please contact the developer. <strong>Error code: {error.response.status}</strong>
                    </p>
                    </div>
                );
            } else {
                if(error.request){
                    setShowPopup(true);
                    setPopupContent('error');
                    setPopupMessage(
                        <div>
                            <p className="popup-title">Network Error</p>
                            <p className="popup-message">Cannot connect to server. Please check your connection or try again later.</p>
                        </div>
                    );
                }
            }
        } finally {
            setSubmitLoading(false);
        }
    }

    const ucode = currentUserCode;
    const codes = ucode.split(',').map(code => code.trim());
    const Admin = codes.includes("AM");
    const PortManager = codes.includes("PM");
    const DivisionManager = codes.includes("DM");

    //Close Popup on Success
    const successPopup = () => {
        setSubmitLoading(false);
        setShowPopup(false);
        navigate(`/joms/myrequest#inspection`);
    }

    //Close Popup on Error
    const justClose = () => {
        setShowPopup(false);
    }

    return(
    <>
        {/* Form Content */}
        <div className="ppa-widget mt-4">
            <div className="joms-user-info-header">Request for Pre/Post Inspection Repair</div>
            <div className="form-header">
                <div>
                    <div className="form-title-header">
                        Fill up the Form
                    </div>
                    <div className="form-title-description">
                        * - fields that need to be filled out
                    </div>
                </div>
                <div>
                    {/* Button */}
                    <button 
                    onClick={() => submitInspForm()}
                    type="submit"
                    className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex justify-center">
                        <span className="ml-1">Submitting</span>
                      </div>
                    ):(
                      'Confirm'
                    )}
                  </button>
                </div>
            </div>
            <div className="form-container mt-4">
               

                {/* 1st Column */}
                <div>
                    {/* Date */}
                    <div className="ppa-form-container">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Date</label>
                        </div>  
                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                            {formatDate(today)}
                        </div>
                    </div>

                    {/* Property Number */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Property Number</label>
                        </div>  
                        <input
                            type="text"
                            name="rep_property_no"
                            id="rep_property_no"
                            autoComplete="rep_property_no"
                            value={propertyNo}
                            onChange={ev => setPropertyNo(ev.target.value)}
                            maxLength={255}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Property Number"
                        />
                    </div>

                    {/* Acquisition Date */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Acquisition Date</label>
                        </div> 
                        <DatePicker
                            selected={acquisitionDate}
                            onChange={(date) => setAcquisitionDate(date)}
                            maxDate={today}
                            dateFormat="yyyy-MM-dd"
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholderText="Enter Acquisition Date"
                        />
                    </div>

                    {/* Acquisition Cost */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Acquisition Cost</label>
                        </div>  
                        <input
                            type="text"
                            name="rep_acquisition_cost"
                            id="rep_acquisition_cost"
                            value={acquisitionCost ? `₱ ${formatCurrency(acquisitionCost)}` : ""}
                            onChange={handleChange}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Acquisition Cost"
                        />
                    </div>

                    {/* Brand/Model */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Brand/Model</label>
                        </div>  
                        <input
                            type="text"
                            name="brand_mrep_brand_model"
                            id="rep_brand_model"
                            autoComplete="rep_brand_model"
                            value={BrandModel}
                            maxLength={255}
                            onChange={ev => setBrandModel(ev.target.value)}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Brand/Model"
                        />
                    </div>

                    {/* Serial/Engine No */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Serial/Engine No</label>
                        </div>  
                        <input
                            type="text"
                            name="rep_serial_engine_no"
                            id="rep_serial_engine_no"
                            autoComplete="rep_serial_engine_no"
                            value={SerialEngineNo}
                            maxLength={255}
                            onChange={ev => setSerialEngineNo(ev.target.value)}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Serial/Engine No"
                        />
                    </div>
                </div>

                {/* 2nd Column */}
                <div>
                    {/* Type of Property */}
                    <div className="ppa-form-container mob-mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Type of Property</label>
                            <span className="form-validation"> * </span>
                        </div>  
                        <select 
                            name="rep_type_of_property" 
                            id="rep_type_of_property" 
                            autoComplete="rep_type_of_property"
                            value={typeOfProperty}
                            onChange={ev => {
                            setTypeOfProperty(ev.target.value);
                            }}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                            <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Description</label>
                            <span className="form-validation"> * </span>
                        </div>  
                        <textarea
                            name="rep_description"
                            id="rep_description"
                            value={propertyDescription}
                            maxLength={255}
                            onChange={ev => setPropertyDescription(ev.target.value)}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Description"
                            rows={3}
                            style={{ resize: "none" }}
                        />
                    </div>

                    {/* Location  */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Location </label>
                            <span className="form-validation"> * </span>
                        </div>  
                        <input
                            type="text"
                            name="rep_location"
                            id="rep_location"
                            value={propertyLocation}
                            maxLength={255}
                            onChange={ev => setPropertyLocation(ev.target.value)}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                            placeholder="Enter Location "
                        />
                    </div>

                    {/* Supervisor */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Supervisor</label>
                            <span className="form-validation"> * </span>
                        </div>  
                        <select 
                            name="rep_supervisor" 
                            id="rep_supervisor" 
                            value={selectedSupervisor.id}
                            onChange={ev => {
                                const supervisorId = ev.target.value;
                                const supervisorData = supervisor.supervisorData.find(sup => sup.id === parseInt(supervisorId));
                                
                                setSelectedSupervisor(supervisorData ? { id: supervisorData.id, name: supervisorData.name } : { id: '', name: '' });
                            }}
                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                        >
                            <option value="" disabled>Select your supervisor</option>
                            {supervisor?.supervisorData?.map((Data) => (
                                <option key={Data.id} value={Data.id}>
                                {Data.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Complain */}
                <div className="ppa-form-container form-separate mt-2 mb-4">
                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                        <label>Complain</label>
                    </div>  
                    <input
                        type="text"
                        id="rep_complain"
                        name="rep_complain"
                        value={ComplainDefect}
                        maxLength={500}
                        onChange={ev => setComplainDefect(ev.target.value)}
                        className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                        placeholder="Enter Complain"
                    />
                </div>
            </div>
        </div>

        {/* Popup */}
        <Popup
            show={showPopup}
            popupContent={popupContent}
            popupMessage={popupMessage}
            onSuccess={successPopup}
            onClose={justClose}
        />
    </>
    );
}