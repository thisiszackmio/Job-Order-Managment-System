import { useEffect, useState } from "react";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import UnauthorizedPage from "../../components/unauthorize";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faPen, faPenToSquare, faCircleXmark, faFilePdf, faFileCircleXmark, faPrint, faDownload, faStamp, faCircle } from "@fortawesome/free-solid-svg-icons";
import Popup from "../../components/popup";

export default function InspectionForm() {
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

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchInspection(id);
            fetchActivity();
        }
    }, [id]);

    //Date Format
    const today = new Date().toISOString().split('T')[0]; 
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
            setUpdateAcquisitionCost(numericOnly);
        }
    };

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupMessage, setPopupMessage] = useState("");

    // Loading Function
    const [formLoading, setFormLoading] = useState(true);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [activityLoading, setActivityLoading] = useState(true);

    // PDF 
    const [showPDF, setShowPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    // Function
    const [pageRestrict, setPageRestrict] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [enableSupDecline, setEnableSupDecline] = useState(false);
    
    // Forms
    const [partBForm, setPartBForm] = useState(false);
    const [partCForm, setPartCForm] = useState(false);
    const [partDForm, setPartDForm] = useState(false);
    const [enablePartA, setEnablePartA] = useState(false);
    const [enablePartB, setEnablePartB] = useState(false);
    const [enablePartC, setEnablePartC] = useState(false);
    const [enablePartD, setEnablePartD] = useState(false);

    // --- Data --- //
    const [inspectionData, setInspectionData] = useState([]);
    const [paginatedInspection, setPaginatedInspection] = useState([]);
    const [nameData, setNameData] = useState([]);

    const fetchInspection = async () => {
        try {
        const response = await axiosClient.get(`/showinsprequest/${id}`);
        const dataInspection = response.data;

        // console.log(dataInspection.form);
          setInspectionData(dataInspection.form);
          setPaginatedInspection({
            prev: dataInspection.prev_id,
            next: dataInspection.next_id
          });
          setNameData({
            gso: dataInspection.gso_name,
            admin: dataInspection.admin_name
          });

        if(dataInspection.form?.user_id == currentUserId || accessOnly) {
            setPageRestrict(true);
        }else{
            setPageRestrict(false);
        }

        } catch(error){
        if(error.response && error.response.data){
            if(error.response.data.error == "No-Form"){ 
            window.location = '/404';
            }
        } else {
            console.error("Unexpected error:", error);
        }
        } finally {
            setFormLoading(false);
        }
    }

    // --- Get the Personnel (Based on Type of Property) --- //
    const [getPersonnel, setGetPersonnel] = useState([]);

    const fetchDisplayPersonnel = async () => {
        try {
        const response = await axiosClient.get(`/displaypersonnel/${id}`);
        const dataPersonnel = response.data;

        // console.log(dataPersonnel);
        setGetPersonnel(dataPersonnel);

        } catch(error){
        console.error("Unexpected error:", error);
        }
    }

    // --- Auto Close Form --- //
    const setFormClosed = () => {

        if(GSO || inspectionData?.form?.user_id == currentUserId || SuperHacker){
        axiosClient
            .get(`/closeinspectionrequest/${id}`)
            .then(response => {
                console.log(response.data.message); // Show success message
            })
            .catch(error => {
                if(error.response){
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
                }
            })
            .finally(() => {
                setFormLoading(false);
            });
        }
        
    }

    // --- Activity (for tracking) --- //
    const [trackingForm, setTrackingForm] = useState({});

    const fetchActivity = async () => {
        try {
        const response = await axiosClient.get(`/formtracking/${id}`,{
            params: { type: 'Repair' }
        });
        const dataActivity = response.data;

        // console.log(dataActivity);
        setTrackingForm(dataActivity);

        } catch(error) {
        console.error("Unexpected error:", error);
        } finally {
            setActivityLoading(false);
        }
    }

    useEffect(() => { 
        if(currentUserId){
            fetchActivity();
            fetchInspection();
            setFormClosed();
        }
        if(partBForm || enablePartB){
            fetchDisplayPersonnel();
        } 
    }, [currentUserId, partBForm, enablePartB]);

    // --- Pagination --- //
    // Previous Page
    const handlePrev = () => {
        if (!paginatedInspection?.prev) return; // stop if no previous
        setFormLoading(true);
        setActivityLoading(true);
        navigate(`/joms/inspection/form/${paginatedInspection?.prev}`);
    };

    // Next Page
    const handleNext = () => {
        if (!paginatedInspection?.next) return; // stop if no next
        setFormLoading(true);
        setActivityLoading(true);
        navigate(`/joms/inspection/form/${paginatedInspection?.next}`);
    };

    // Update Part A useState
    const [updatepropertyNo, setUpdatePropertyNo] = useState(inspectionData?.property_number ?? "");
    const [updateacquisitionDate, setUpdateAcquisitionDate] = useState(inspectionData?.acquisition_date ?? "");
    const [updateacquisitionCost, setUpdateAcquisitionCost] = useState(inspectionData?.acquisition_cost ?? "");
    const [updateBrandModel, setUpdateBrandModel] = useState(inspectionData?.brand_model ?? "");
    const [updateSerialEngineNo, setUpdateSerialEngineNo] = useState(inspectionData?.serial_engine_no ?? "");
    const [updateTypeofProperty, setUpdateTypeofProperty] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [updateLocation, setUpdateLocation] = useState('');
    const [updateComplain, setUpdateComplain] = useState('');

    // Update Part A
    async function UpdatePartA(){
        setSubmitLoading(true);

        const dataA = {
            user_id: currentUserId,
            user_name: currentUserName.name,
            property_number: updatepropertyNo,
            acquisition_date: updateacquisitionDate ? format(updateacquisitionDate, "yyyy-MM-dd") : null,
            acquisition_cost: updateacquisitionCost,
            brand_model: updateBrandModel,
            serial_engine_no: updateSerialEngineNo,
            type_of_property: updateTypeofProperty,
            property_description: updateDescription,
            location: updateLocation,
            complain: updateComplain,
            code: ucode,
        }

        axiosClient
        .put(`/updateinsprequestparta/${id}`, dataA)
        .then((response) => {
            const responseData = response.data.message;

            if(responseData === 'Closed'){
            setShowPopup(true);
            setPopupContent('check-error');
            setPopupMessage(
                <div>
                <p className="popup-title">Invalid!</p>
                <p className="popup-message">This form has already been closed.</p>
                </div>
            )
            } else if(responseData === 'UnEdited'){
            setShowPopup(true);
            setPopupContent('check-error');
            setPopupMessage(
                <div>
                <p className="popup-title">Invalid!</p>
                <p className="popup-message">This form cannot be edited.</p>
                </div>
            )
            } else {
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been updated.</p>
                </div>
            );
            setShowPopup(true);
            }
        })
        .catch((error) => {
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setPopupContent("check-error");
                    setPopupMessage(
                    <div>
                        <p className="popup-title">Error</p>
                        <p className="popup-message">
                        {responseErrors.property_description ? "Empty fields on Description" : 
                        responseErrors.location ? "Empty fields on Location" :
                        "Empty fields on Complain"}
                        </p>
                    </div>
                    );
                    setShowPopup(true);
                } else {
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
                }
            } else if (error.request) {
                // Request was made but no response (network error)
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                    <div>
                    <p className="popup-title">Network Error</p>
                    <p className="popup-message">Unable to reach the server. Please check your connection.</p>
                    </div>
                );
            } else {
                // Something else happened
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">{error.message || 'An unexpected error occurred'}</p>
                    </div>
                );
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // Update / Enable Part B 
    const [partBdate, setPartBdate] = useState('');
    const [lastfilledDate, setLastFilledDate] = useState('');
    const [natureRepair, setNatureRepair] = useState('');
    const [pointPersonnel, setPointPersonnel] = useState({ pid: '', pname: '' });
    const [updatePartBdate, setUpdatePartBdate] = useState(inspectionData?.date_of_filling?.split("T")[0] ?? "");
    const [updatelastfilledDate, setUpdateLastFilledDate] = useState(inspectionData?.date_of_last_repair ?? "");
    const [updatenatureRepair, setUpdateNatureRepair] = useState(inspectionData?.nature_of_last_repair ?? "");
    const [updatepointPersonnel, setUpdatePointPersonnel] = useState({ pid: '', pname: '' });

    // Fill up (GSO) Part B
    const handleGSOSubmitConfirmation = () => {
        setShowPopup(true);
        setPopupContent('InspGSO');
        setPopupMessage(
        <div>
            <p className="popup-title">Confirmation</p>
            <p className="popup-message">Do you want to proceed without data for the Date of Last Repair or the Nature of Last Repair?</p>
        </div>
        );
    }

    // Fill up Part B
    async function SubmitPartB(){
        setSubmitLoading(true);

        const dataPB = {
            gsoId: currentUserId,
            date_of_filling: partBdate ? format(partBdate, "yyyy-MM-dd") : null,
            date_of_last_repair: lastfilledDate ? format(lastfilledDate, "yyyy-MM-dd") : null,
            nature_of_last_repair: natureRepair,
            personnel_id: pointPersonnel.pid,
            personnel_name: pointPersonnel.pname, 
        }

        axiosClient
        .put(`/submitinsprequestpartb/${id}`, dataPB)
        .then(() => {
            setShowPopup(true);
            setPopupContent('success');
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">Form submitted successfully.</p>
                </div>
            );
        })
        .catch((error) => {
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setPopupContent("check-error");
                    setPopupMessage(
                    <div>
                        <p className="popup-title">Error</p>
                        <p className="popup-message">
                        {responseErrors.date_of_filling ? "Empty fields on Date" : 
                            "Empty fields on Assign Personnel"}
                        </p>
                    </div>
                    );
                    setShowPopup(true);
                } else {
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
                }
            } else if (error.request) {
                // Request was made but no response (network error)
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                    <div>
                    <p className="popup-title">Network Error</p>
                    <p className="popup-message">Unable to reach the server. Please check your connection.</p>
                    </div>
                );
            } else {
                // Something else happened
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">{error.message || 'An unexpected error occurred'}</p>
                    </div>
                );
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // Update Part B
    async function  UpdatePartB() {
        setSubmitLoading(true);

        const dataB = {
            user_name: currentUserName.name,
            date_of_filling: updatePartBdate ? format(updatePartBdate, "yyyy-MM-dd") : null,
            date_of_last_repair : updatelastfilledDate ? format(updatelastfilledDate, "yyyy-MM-dd") : null,
            nature_of_last_repair: updatenatureRepair,
            personnel_id: updatepointPersonnel.pid ? updatepointPersonnel.pid : inspectionData?.personnel_id,
            personnel_name: updatepointPersonnel.pname ? updatepointPersonnel.pname : inspectionData?.personnel_name,
            code: ucode
        }

        axiosClient
        .put(`/updateinsprequestpartb/${id}`, dataB)
            .then(() => {
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been updated.</p>
                </div>
            );
        setShowPopup(true);
        })
        .catch((error) => {
            if (error.response) {
                // Server responded with an error
                if (error.response.status === 409) {
                setPopupContent("check-error");
                setPopupMessage(
                    <div>
                    <p className="popup-title">Invalid</p>
                    <p className="popup-message">This form is already closed!</p>
                    </div>
                );
                setShowPopup(true);
                } else if (error.response.status === 408) {
                setPopupContent("check-error");
                setPopupMessage(
                    <div>
                    <p className="popup-title">Invalid</p>
                    <p className="popup-message">You can no longer reassign the personnel.</p>
                    </div>
                );
                setShowPopup(true);
                } else if (error.response.status === 422) {
                const responseErrors = error.response.data?.errors || {};
                setPopupContent("check-error");
                setPopupMessage(
                    <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">
                        {responseErrors.date_of_filling ? "Empty fields on Date" : "Validation error"}
                    </p>
                    </div>
                );
                setShowPopup(true);
                } else {
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
                }
            } else if (error.request) {
                // No response received (network error)
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                <div>
                    <p className="popup-title">Network Error</p>
                    <p className="popup-message">Could not connect to server. Please check your connection.</p>
                </div>
                );
            } else {
                // Other errors (setup, etc.)
                setShowPopup(true);
                setPopupContent('error');
                setPopupMessage(
                <div>
                    <p className="popup-title">Error</p>
                    <p className="popup-message">{error.message || 'An unexpected error occurred'}</p>
                </div>
                );
            }
        })
        .finally(() => {
        setSubmitLoading(false);
        });
    }

    // Update / Enable Part C useState
    const [findings, setFindings] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [partCDate, setPartCDate] = useState('');
    const [updatefindings, setUpdateFindings] = useState('');
    const [updaterecommendations, setUpdateRecommendations] = useState('');

    // Fill up Part C
    async function SubmitPartC() {
        setSubmitLoading(true);

        const dataPC = {
            user_name: currentUserName.name,
            before_repair_date: partCDate ? format(partCDate, "yyyy-MM-dd") : null,
            findings: findings,
            recommendations: recommendations
        }

        axiosClient
        .put(`/submitinsprequestpartc/${id}`, dataPC)
        .then(() => {
            setShowPopup(true);
            setPopupContent('success');
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">Form submitted successfully.</p>
                </div>
            );
        })
        .catch((error)=>{
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setPopupContent("check-error");
                    setPopupMessage(
                    <div>
                        <p className="popup-title">Error</p>
                        <p className="popup-message">
                        {responseErrors.before_repair_date ? "Empty fields on Date" : 
                        responseErrors.findings ? "Empty fields on Findings":
                        "Empty fields on Recommendations"}
                        </p>
                    </div>
                    );
                    setShowPopup(true);
                } else {
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
                }
            }
        })
        .finally(() => {
        setSubmitLoading(false);
        });
    }

    // Update Part C
    async function UpdatePartC(){
        setSubmitLoading(true);

        const dataC = {
            user_name: currentUserName.name,
            before_repair_date: partCDate ? format(partCDate, "yyyy-MM-dd") : null,
            findings : updatefindings,
            recommendations: updaterecommendations,
            code: ucode
        }

        axiosClient
        .put(`/updateinsprequestpartc/${id}`, dataC)
        .then(() => {
            setShowPopup(true);
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been updated.</p>
                </div>
            );
        })
        .catch((error) => {
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setPopupContent("check-error");
                    setPopupMessage(
                    <div>
                        <p className="popup-title">Error</p>
                        <p className="popup-message">
                        {responseErrors.before_repair_date ? "Empty fields on Date" : 
                        responseErrors.findings ? "Empty fields on Findings":
                        "Empty fields on Recommendations"}
                        </p>
                    </div>
                    );
                    setShowPopup(true);
                } else {
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
                }
            }
        })
        .finally(() => {
        setSubmitLoading(false);
        });
    }

    // Update / Enable Part D useState
    const [partDDate, setPartDDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [updateremarks, setUpdateRemarks] = useState('');

    // Fill up Part D
    async function SubmitPartD(){
        setSubmitLoading(true);

        const dataPD = {
            user_name: currentUserName.name,
            after_reapir_date: partDDate ? format(partDDate, "yyyy-MM-dd") : null,
            remarks: remarks,
        }

        axiosClient
        .put(`/submitinsprequestpartd/${id}`, dataPD)
        .then(() => {
            setShowPopup(true);
            setPopupContent('success');
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">Form submitted successfully.</p>
                </div>
            );
        })
        .catch((error)=>{
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setShowPopup(true);
                    setPopupContent("check-error");
                    setPopupMessage(
                        <div>
                            <p className="popup-title">Error</p>
                            <p className="popup-message">
                            {responseErrors.after_reapir_date ? "Empty fields on Date" : 
                            "Empty fields on Remarks"}
                            </p>
                        </div>
                    );
                } else {
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
                }
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // Update Part D
    async function UpdatePartD(){
        setSubmitLoading(true);

        const dataD = {
            after_reapir_date : partDDate ? format(partDDate, "yyyy-MM-dd") : null ,
            user_name: currentUserName.name,
            remarks : updateremarks,
            code: ucode
        }

        axiosClient
        .put(`/updateinsprequestpartd/${id}`, dataD)
        .then(() => {
            setShowPopup(true);
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been updated.</p>
                </div>
            );
        })
        .catch((error) => {
            // Check if error.response exists
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 422) {
                    const responseErrors = error.response.data?.errors || {};
                    setShowPopup(true);
                    setPopupContent("check-error");
                    setPopupMessage(
                        <div>
                            <p className="popup-title">Error</p>
                            <p className="popup-message">
                            {responseErrors.after_reapir_date ? "Empty fields on Date" : 
                            "Empty fields on Remarks"}
                            </p>
                        </div>
                    );
                } else {
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
                }
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // Update state when inspectionData updates
    useEffect(() => {
        setUpdatePropertyNo(inspectionData?.property_number ?? "");
        setUpdateAcquisitionDate(inspectionData?.acquisition_date ?? "");
        setUpdateAcquisitionCost(inspectionData?.acquisition_cost ?? "");
        setUpdateBrandModel(inspectionData?.brand_model ?? "");
        setUpdateSerialEngineNo(inspectionData?.serial_engine_no ?? "");
        setUpdateTypeofProperty(inspectionData?.type_of_property ?? "");
        setUpdateDescription(inspectionData?.property_description ?? "");
        setUpdateLocation(inspectionData?.location ?? "");
        setUpdateComplain(inspectionData?.complain ?? "");
        setUpdatePartBdate(inspectionData?.date_of_filling ?? "");
        setUpdateLastFilledDate(inspectionData?.date_of_last_repair ?? "");
        setUpdateNatureRepair(inspectionData?.nature_of_last_repair ?? "");
        setPartCDate(inspectionData?.before_repair_date ?? "");
        setUpdateFindings(inspectionData?.findings ?? "");
        setUpdateRecommendations(inspectionData?.recommendations ?? "");
        setPartDDate(inspectionData?.after_reapir_date ?? "")
        setUpdateRemarks(inspectionData?.remarks ?? "");
    },[
        inspectionData?.property_number,
        inspectionData?.acquisition_date,
        inspectionData?.acquisition_cost,
        inspectionData?.brand_model,
        inspectionData?.serial_engine_no,
        inspectionData?.type_of_property,
        inspectionData?.property_description,
        inspectionData?.location,
        inspectionData?.complain,
        inspectionData?.date_of_filling,
        inspectionData?.date_of_last_repair,
        inspectionData?.nature_of_last_repair,
        inspectionData?.before_repair_date,
        inspectionData?.findings,
        inspectionData?.recommendations,
        inspectionData?.after_reapir_date,
        inspectionData?.remarks
    ]);

    // --- Approval Functions --- //
    // For the Supervisor Approval
    const handleSupApprovalConfirmation = () => {
        setShowPopup(true);
        setPopupContent('InspApprove');
        setPopupMessage(
        <div>
            <p className="popup-title">Are you sure?</p>
            <p className="popup-message">Do you want to approve {inspectionData?.user_name}'s request?</p>
        </div>
        );
    }

    async function handlelSupervisorApproval(id) {
        setSubmitLoading(true);
    
        axiosClient
        .put(`/supinsprequestapprove/${id}`)
        .then((response) => {
            const responseData = response.data.message;

            if(responseData === 'Canceled Already'){
                setShowPopup(true);
                setPopupContent('check-error');
                setPopupMessage(
                <div>
                    <p className="popup-title">Invalid</p>
                    <p className="popup-message">This form has already been canceled.</p>
                </div>
                );
            } else {
                setShowPopup(true);
                setPopupContent("success");
                setPopupMessage(
                <div>
                    <p className="popup-title">Success</p>
                    <p className="popup-message">The form has been approved</p>
                </div>
                );
            }
        })
        .catch((error)=>{
            if(error.response){
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
            }
        })
        .finally(() => {
        setSubmitLoading(false);
        });
    }

    // --- Disaprrovel Function --- //
    const [reason, setReason] = useState('');
    function handleSupDeclineConfirmation(){
        if(!reason){
            setPopupContent("check-error");
            setPopupMessage(
            <div>
                <p className="popup-title">Error</p>
                <p className="popup-message">
                    Enter on Disapproval Reason
                </p>
            </div>
            );
            setShowPopup(true);
        }else{
            setShowPopup(true);
            setPopupContent('InspDisapprove');
            setPopupMessage(
                <div>
                <p className="popup-title">Are you sure?</p>
                <p className="popup-message">Do you want to disapprove {inspectionData?.user_name}'s request? It cannot be undone.</p>
                </div>
            );
        }
    }

    async function SubmitSupReason(id){
        axiosClient
        .put(`/supinsprequestdisapprove/${id}`, {
            reason:reason,
        })
        .then(() => {
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been disapproved</p>
                </div>
            );
            setShowPopup(true);
            })
        .catch((error)=>{
            if(error.response){
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
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // --- Admin Manager Approval --- //
    const handleAdminApprovalConfirmation = () => {
        setShowPopup(true);
        setPopupContent('InspAdmin');
        setPopupMessage(
        <div>
            <p className="popup-title">Confirmation</p>
            <p className="popup-message">Do you want to approve {inspectionData?.user_name}'s request?</p>
        </div>
        );
    }

    async function handlelAdminApproval(){
        setSubmitLoading(true);

        const data = {
        user_id: currentUserId,
        }

        axiosClient
        .put(`/admininsprequestapprove/${id}`, data)
        .then(() => {
            setShowPopup(true);
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">The form has been approved</p>
                </div>
            );
        })
        .catch((error)=>{
            if(error.response){
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
            }
        })
        .finally(() => {
        setSubmitLoading(false);
        });
    }

    // --- Cancel Function --- //
    const handleCloseForm = () => {
        setShowPopup(true);
        setPopupContent('InspCancel');
        setPopupMessage(
        <div>
            <p className="popup-title">Are you sure?</p>
            <p className="popup-message">Do you want to cancel this form? It cannot be restore.</p>
        </div>
        );
    }

    async function CancelForm(id){
        setSubmitLoading(true);

        axiosClient
        .put(`/cancelinspectionrequest/${id}`, {
            user_name:currentUserName.name,
        })
        .then(() => {
            setShowPopup(true);
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">This form has been successfully canceled.</p>
                </div>
            );
        })
        .catch((error)=>{
            if(error.response){
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
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    // --- PDF Function --- //
    const loadPDF = async () => {
        try {
            setShowPDF(true);
            setLoadingPDF(true);

            const response = await axiosClient.get(
                `/inspection/pdf/${id}`,
                { responseType: "blob" }
            );

            // 🔥 GET FILENAME FROM HEADER
            const disposition = response.headers["content-disposition"];
            let filename = "Inspection.pdf";

            if (disposition) {
                const match = disposition.match(/filename="?(.+)"?/);
                if (match && match[1]) {
                filename = match[1];
                }
            }

        const file = new Blob([response.data], {
            type: "application/pdf",
        });

            const fileURL = URL.createObjectURL(file);

            setPdfUrl(fileURL);

        } catch (error) {
            console.error("Error loading PDF:", error);
        } finally {
            setLoadingPDF(false);
        }
    };

    const downloadPDF = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `Pre-Post-Repair-Inspection-Control-Number-${id}.pdf`;
        link.click();
    };

    const printPDF = () => {
        if (!pdfUrl) return;

        const printWindow = window.open(pdfUrl);
        if (printWindow) {
            // Some browsers need a short delay before printing
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            console.error("Failed to open print window. Check popup blocker.");
        }
    };

    // --- Manual Complete --- //
    const handleManualCompleteConfirmation = () => {
        setShowPopup(true);
        setPopupContent('ManConfirm');
        setPopupMessage(
        <div>
            <p className="popup-title">Mark as Complete</p>
            <p className="popup-message">Do you want to mark this form as complete?</p>
        </div>
        );
    }

    async function ManualCompleteConfirmation(id) {
        setSubmitLoading(true);

        axiosClient
        .put(`/manualcomplete/${id}`, {
            user_name:currentUserName.name,
        })
        .then(() => {
            setShowPopup(true);
            setPopupContent("success");
            setPopupMessage(
                <div>
                <p className="popup-title">Success</p>
                <p className="popup-message">This form has been marked as complete.</p>
                </div>
            );
        })
        .catch((error)=>{
            if(error.response){
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
            }
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }

    //Close Popup on Success
    const successPopup = () => {
        fetchInspection();
        setEnablePartA(false);
        setPartBForm(false);
        setEnablePartB(false);
        setPartCForm(false);
        setEnablePartC(false);
        setPartDForm(false);
        setEnablePartD(false);
        setFormLoading(true);
        setEnableSupDecline(false);
        setSubmitLoading(false);
        setShowPopup(false);
        setShowPDF(false);
    }

    //Close Popup on Error
    const justClose = () => {
        setShowPopup(false);
    }

    // Restrictions Condition
    const ucode = currentUserCode;
    const codes = ucode.split(',').map(code => code.trim());
    const PortManager = codes.includes("PM"); 
    const Admin = codes.includes("AM");
    const GSO = codes.includes("GSO");
    const DivisionManager = codes.includes("DM");
    const SuperHacker = codes.includes("HACK");
    const ITAdmin = codes.includes("AUS");
    const AuthorityAccess = codes.includes("AUI");
    const roles = ["HACK", "AUS", "AM", "AUI", "PM", "DM", "GSO" ];
    const accessOnly = roles.some(role => codes.includes(role));

    return(
        !pageRestrict ? (<UnauthorizedPage />):(
        <>
            {/* 2 Columns */}
            <div className="form-request-page mt-4">
                {/* Form Content */}
                <div className="ppa-widget">
                    <div className="joms-user-info-header">Request for Pre/Post Inspection Repair</div>

                    <div className="form-container-view mt-3">
                        {showPDF ? (
                            loadingPDF ? (
                                <div className="pdf-animation-container">
                                    <div className="pdf-loading-box printer">
                                    <div className="printer-icon">
                                        <div className="printer-top"></div>
                                        <div className="printer-body">
                                        <div className="printer-slot"></div>
                                        </div>
                                        <div className="printer-paper">
                                        <div className="paper-line"></div>
                                        <div className="paper-line short"></div>
                                        </div>
                                    </div>

                                    <div className="pdf-loading-text">
                                        Generating PDF…
                                        <div className="pdf-loading-sub">
                                        Please wait while we generate your document
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            ):(
                            <>
                                <div className="pdf-btn-container mt-4 mb-2">
                                    <FontAwesomeIcon onClick={downloadPDF} className="icon-edit-form" title="Download PDF" icon={faDownload} />
                                    <FontAwesomeIcon onClick={printPDF} className="icon-edit-form" title="Print PDF" icon={faPrint} />
                                    <FontAwesomeIcon onClick={() => setShowPDF(false)} className="icon-edit-form" title="Close PDF Viewer" icon={faFileCircleXmark} />
                                </div>
                                {/* PDF Content */}
                                <iframe
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&zoom=67&navpanes=0`}
                                    width="100%"
                                    height="800px"
                                    title="Inspection PDF"
                                />
                            </>
                            )
                        ):(
                        <>
                            {/* Button Pagination */}
                            {(GSO || DivisionManager || Admin || SuperHacker || ITAdmin || AuthorityAccess) && (
                            <div className="ppa-form-btn-wrapper">
                                {/* Prev */}
                                <button
                                    onClick={handlePrev}
                                    disabled={!paginatedInspection?.prev || formLoading}
                                    className={`${
                                        paginatedInspection?.prev
                                        ? "ppa-arrow-btn"
                                        : "ppa-arrow-btn ppa-arrow-btn-disabled"
                                    }`}
                                    style={{
                                        visibility: paginatedInspection?.prev ? "visible" : "hidden"
                                    }}
                                    >
                                    <span className="ppa-arrow-btn-content">
                                        <FontAwesomeIcon
                                        className="ppa-arrow-btn-icon"
                                        title="Prev"
                                        icon={faArrowLeft}
                                        />
                                        &nbsp; Page{" "}
                                        {paginatedInspection?.prev && paginatedInspection?.prev}
                                    </span>
                                </button>

                                {/* Next */}
                                <button
                                    onClick={handleNext}
                                    disabled={!paginatedInspection?.next || formLoading}
                                    className={`${
                                        paginatedInspection?.next
                                        ? "ppa-arrow-btn"
                                        : "ppa-arrow-btn ppa-arrow-btn-disabled"
                                    }`}
                                    style={{
                                        visibility: paginatedInspection?.next ? "visible" : "hidden"
                                    }}
                                    >
                                    <span className="ppa-arrow-btn-content">
                                        Page{" "}
                                        {paginatedInspection?.next && paginatedInspection?.next}
                                        &nbsp;
                                        <FontAwesomeIcon
                                        className="ppa-arrow-btn-icon"
                                        title="Next"
                                        icon={faArrowRight}
                                        />
                                    </span>
                                </button>
                            </div>
                            )}

                            {/* Form */}
                            <div className="mt-5">
                                {/* Status */}
                                <div className="ppa-form-container mt-2">
                                    <div className={`ppa-form-status ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                        <label>Status:</label>
                                    </div>  
                                    {formLoading ? (
                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                    ):(
                                        <div className={`ppa-form-field-status pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                            {!partBForm && !partCForm && !partDForm && !enablePartA && !enablePartB && !enablePartC && !enablePartD ? (
                                                DivisionManager && inspectionData?.form_status == 11 ? ("Waiting for your approval.")
                                                :GSO && inspectionData?.form_status == 5 ? ("You have entered the Part B form, and it is now pending Admin Manager approval.")
                                                :Admin && inspectionData?.form_status == 5 ? ("Waiting for your approval.")
                                                :currentUserId == inspectionData?.form?.personnel_id && inspectionData?.form?.form_status == 4 ? ("You are assign on this request.")
                                                :currentUserId == inspectionData?.form?.personnel_id && inspectionData?.form?.form_status == 3 ? ("You are assign on this request.")
                                                :(currentUserId == inspectionData?.form?.personnel_id || GSO || SuperHacker) && inspectionData?.form?.form_status == 2 ? ("The assigned personnel has completed the form. It will only be editable for 24 hours (if you see this).")
                                                :(
                                                [5, 11].includes(inspectionData?.form_status) &&
                                                inspectionData?.date_of_filling &&
                                                inspectionData?.before_repair_date &&
                                                inspectionData?.after_reapir_date ? (
                                                    <>
                                                    Form was completed, but no approval from {[11].includes(inspectionData?.form_status) && "Immediate Supervisor "} {[11].includes(inspectionData?.form_status) ? "and" : null} {[5, 11].includes(inspectionData?.form_status) && "Admin Manager"}.
                                                    </>
                                                ):(
                                                    inspectionData?.form_remarks
                                                )
                                                )
                                            ):(
                                            <>
                                                {enablePartA && ("Part A Form enable")}
                                                {(enablePartB || partBForm) && ("Part B Form enable")}
                                                {(enablePartC || partCForm) && ("Part C Form enable")}
                                                {(enablePartD || partDForm) && ("Part D Form enable")}
                                            </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Control Number and buttons */}
                                <div className="form-request-top-header mt-3">
                                    <div>
                                        {/* Control Number */}
                                        <div className="ppa-form-container">
                                            <div className={`ppa-form-title ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                <label>Control No.</label>
                                            </div>  
                                            {formLoading ? (
                                                <div className={`skeleton-form ctrl-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                            ):(
                                                <div className={`ppa-form-field ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                    {id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-btn-align">
                                        {!formLoading && (
                                            (!enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm) ? (
                                            <>
                                                {/* --- For Cancel Function --- */}
                                                {/* For Authorize Personnel */}
                                                {!inspectionData?.date_of_filling && !inspectionData?.before_repair_date && !inspectionData?.after_reapir_date && [8, 9, 10, 11].includes(inspectionData?.form_status) && (
                                                    (GSO || SuperHacker || AuthorityAccess) && (
                                                        <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-function-form" title="Cancel Request" icon={faCircleXmark} />
                                                    )
                                                )}

                                                {/* For the Reqestor */}
                                                {inspectionData?.user_id == currentUserId && !SuperHacker && !GSO && !AuthorityAccess && (
                                                    [8, 9, 10, 11].includes(inspectionData?.form_status) && (
                                                        <FontAwesomeIcon onClick={() => handleCloseForm()} className="icon-function-form" title="Cancel Request" icon={faCircleXmark} />
                                                    )
                                                )}

                                                {/* --- For Generate PDF --- */}
                                                {!isMobile && (
                                                <>
                                                    {/* For GSO and SuperAdmin */}
                                                    {![0, 7].includes(inspectionData?.form_status) && (GSO || SuperHacker || AuthorityAccess) && (
                                                        <FontAwesomeIcon onClick={loadPDF} className="icon-function-form" title="Get PDF" icon={faFilePdf} />
                                                    )}
                                                </>
                                                )}

                                                {/* For the Admin Manager */}
                                                {Admin && (
                                                    inspectionData?.form_status == 5 && (
                                                        <button
                                                            onClick={() => handleAdminApprovalConfirmation()} 
                                                            className="full-btn btn-secondary"
                                                        >
                                                            Approve
                                                        </button>
                                                    )
                                                )}

                                                {/* For the Supervisor or DM */}
                                                {DivisionManager && (
                                                    enableSupDecline ? (
                                                    <>
                                                        <button onClick={() => handleSupDeclineConfirmation()} className="w-full md:auto py-1.5 px-4 text-sm btn-secondary"> Submit </button>
                                                        <button onClick={() => { setEnableSupDecline(false); setReason(''); setReasonError(false); }} className="w-full md:auto py-1.5 px-4 text-sm btn-cancel"> Cancel </button>
                                                    </>
                                                    ):(
                                                        inspectionData?.form_status === 11 && (
                                                            <>
                                                                {/* Approve */}
                                                                <button onClick={() => handleSupApprovalConfirmation()} className="w-full md:auto py-1.5 px-4 text-sm btn-secondary"> Approve </button>
                                                                {/* Decline */}
                                                                {!inspectionData?.form?.before_repair_date && !inspectionData?.form?.after_reapir_date && (
                                                                    <button onClick={() => setEnableSupDecline(true)} className="w-full md:auto py-1.5 px-4 text-sm btn-cancel"> Disapprove </button>
                                                                )}
                                                            </>
                                                        )
                                                    )
                                                )}

                                                {/* Mark as Complete */}
                                                {GSO && (
                                                    inspectionData?.date_of_filling && inspectionData?.before_repair_date && inspectionData?.after_reapir_date && [5, 8, 9, 10, 11].includes(inspectionData?.form_status) && (
                                                        <FontAwesomeIcon onClick={() => handleManualCompleteConfirmation()} className="icon-function-form" title="Cancel Request" icon={faStamp} />
                                                    )
                                                )}
                                            </>
                                            ):(
                                            <>
                                                {/* Enable Part A Update */}
                                                {enablePartA && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                            setEnablePartA(false);
                                                            setUpdateDescription(inspectionData?.property_description);
                                                            setUpdateLocation(inspectionData?.location);
                                                            setUpdateComplain(inspectionData?.complain);
                                                        }} className="w-full py-1.5 px-4 text-sm btn-cancel">
                                                        Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button 
                                                        type="submit"
                                                        onClick={() => UpdatePartA()}
                                                        className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                        {submitLoading ? (
                                                        <div className="flex justify-center">
                                                            <span className="ml-1">Updating</span>
                                                        </div>
                                                        ):(
                                                        'Update'
                                                        )}
                                                    </button>
                                                </>
                                                )}

                                                {/* Enable Part B Input */}
                                                {partBForm && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                    <button onClick={() => { 
                                                        setPartBForm(false); 
                                                        setPointPersonnel({ pid: '', pname: '' });
                                                        setNatureRepair('');
                                                        setLastFilledDate('');
                                                        }} 
                                                        className="full-btn btn-cancel"
                                                    >
                                                        Cancel
                                                    </button>
                                                    )}

                                                    {/* Submuit */}
                                                    {(lastfilledDate || natureRepair) ? (
                                                        <button type="submit"
                                                            onClick={() => SubmitPartB()}
                                                            className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                            disabled={submitLoading}
                                                        >
                                                        {submitLoading ? (
                                                            <div className="flex justify-center">
                                                            <span className="btn-loader"></span>
                                                            <span className="ml-1">Submitting</span>
                                                            </div>
                                                        ):(
                                                        'Submit'
                                                        )}
                                                        </button>
                                                    ):(
                                                    <button type="submit"
                                                        onClick={() => handleGSOSubmitConfirmation()} 
                                                        className="w-full md:w-auto py-1.5 px-4 text-sm mr-2 btn-secondary"
                                                    >
                                                        Submit
                                                    </button>
                                                    )}
                                                </>
                                                )}

                                                {/* Enable Part B Update */}
                                                {enablePartB && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                            setEnablePartB(false); 
                                                            setPointPersonnel({ pid: inspectionData?.personnel_id, pname: inspectionData?.personnel_name });
                                                            setUpdatePartBdate(inspectionData?.date_of_filling);
                                                            setUpdateLastFilledDate(inspectionData?.date_of_last_repair);
                                                            setUpdateNatureRepair(inspectionData?.nature_of_last_repair);
                                                        }} className="w-full py-1.5 px-4 text-sm btn-cancel">
                                                        Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button 
                                                        type="submit"
                                                        onClick={() =>  UpdatePartB()}
                                                        className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                        {submitLoading ? (
                                                        <div className="flex justify-center">
                                                            <span className="ml-1">Updating</span>
                                                        </div>
                                                        ):(
                                                        'Update'
                                                        )}
                                                    </button>
                                                </> 
                                                )}

                                                {/* Enable Part C Input */}
                                                {partCForm && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                                setPartCForm(false);
                                                            }} 
                                                            className="full-btn btn-cancel"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button type="submit"
                                                        onClick={() => SubmitPartC()}
                                                        className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                    {submitLoading ? (
                                                        <div className="flex justify-center">
                                                        <span className="btn-loader"></span>
                                                        <span className="ml-1">Submitting</span>
                                                        </div>
                                                    ):(
                                                    'Submit'
                                                    )}
                                                    </button>
                                                </>
                                                )}

                                                {/* Enable Part C Update */}
                                                {enablePartC && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                            setEnablePartC(false);
                                                            setPartCDate(inspectionData?.before_repair_date);
                                                            setUpdateFindings(inspectionData?.findings);
                                                            setUpdateRecommendations(inspectionData?.recommendations);
                                                        }} className="w-full py-1.5 px-4 text-sm btn-cancel">
                                                        Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button 
                                                        type="submit"
                                                        onClick={() =>  UpdatePartC()}
                                                        className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                        {submitLoading ? (
                                                        <div className="flex justify-center">
                                                            <span className="ml-1">Updating</span>
                                                        </div>
                                                        ):(
                                                        'Update'
                                                        )}
                                                    </button>
                                                </> 
                                                )}

                                                {/* Enable Part C Input */}
                                                {partDForm && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                                setPartDForm(false);
                                                            }} 
                                                            className="full-btn btn-cancel"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button type="submit"
                                                        onClick={() => SubmitPartD()}
                                                        className={`w-full md:w-auto py-1.5 px-4 text-sm mr-2 ${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                    {submitLoading ? (
                                                        <div className="flex justify-center">
                                                        <span className="btn-loader"></span>
                                                        <span className="ml-1">Submitting</span>
                                                        </div>
                                                    ):(
                                                    'Submit'
                                                    )}
                                                    </button>
                                                </>
                                                )}

                                                {/* Enable Part D Update */}
                                                {enablePartD && (
                                                <>
                                                    {/* Cancel */}
                                                    {!submitLoading && (
                                                        <button onClick={() => { 
                                                            setEnablePartD(false);
                                                            setPartDDate(inspectionData?.after_reapir_date);
                                                            setUpdateRemarks(inspectionData?.remarks);
                                                        }} className="w-full py-1.5 px-4 text-sm btn-cancel">
                                                        Cancel
                                                        </button>
                                                    )}

                                                    {/* Submit */}
                                                    <button 
                                                        type="submit"
                                                        onClick={() =>  UpdatePartD()}
                                                        className={`${ submitLoading ? 'btn-process' : 'btn-secondary' }`}
                                                        disabled={submitLoading}
                                                    >
                                                        {submitLoading ? (
                                                        <div className="flex justify-center">
                                                            <span className="ml-1">Updating</span>
                                                        </div>
                                                        ):(
                                                        'Update'
                                                        )}
                                                    </button>
                                                </> 
                                                )}
                                            </>
                                            )
                                        )}
                                    </div>
                                </div>

                                {enableSupDecline ? (
                                <>
                                    {/* Reason for disapproval */}
                                    <form id="submitSupReason" onSubmit={SubmitSupReason}>
                                        <div className="ppa-form-container form-separate mt-4">
                                            <div className={`ppa-form-title ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                <label>Reason</label>
                                            </div> 
                                            {formLoading ? (
                                                <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                            ):(
                                                <input
                                                    type="text"
                                                    name="reason"
                                                    id="reason"
                                                    value={reason}
                                                    onChange={ev => setReason(ev.target.value)}
                                                    maxLength={500}
                                                    className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                    placeholder="Input your reasons"
                                                />
                                            )} 
                                        </div>
                                    </form>
                                </>
                                ):(
                                <>
                                    {/* Part A */}
                                    <div className="ppa-form-border mt-4">
                                        {/* Header */}
                                        <div className="ppa-form-header">
                                            <div className="form-title-header">
                                                Part A: To be filled-up by Requesting Party
                                            </div>
                                            <div>
                                            {!formLoading && !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && (
                                            <>
                                                {/* All Access */}
                                                {(SuperHacker || GSO || AuthorityAccess) && inspectionData?.form_status != 0 && (
                                                    <FontAwesomeIcon onClick={() => { setEnablePartA(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                                                )}

                                                {/* Requestor */}
                                                {!SuperHacker && !GSO && currentUserId == inspectionData?.user_id && [8, 9, 10 ,11].includes(inspectionData?.form_status) && (
                                                    <FontAwesomeIcon onClick={() => { setEnablePartA(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                                                )}
                                            </>
                                            )}
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="form-container-wrapper">
                                            {/* Note */}
                                            {!PortManager && !Admin && !GSO && !SuperHacker && (
                                            <div className="ppa-form-container form-separate">
                                                <div className="form-notes">
                                                    <span className="note-header">Note:</span> This form can only be edited before the supervisor approves it.
                                                </div>
                                            </div>
                                            )}

                                            {/* 1st Column */}
                                            <div>
                                                {/* Date */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Date</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {formatDate(inspectionData?.date_request)}
                                                        </div>
                                                    )} 
                                                </div>

                                                {/* Property No */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Property No.</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <input
                                                                type="text"
                                                                name="rep_property_no"
                                                                id="rep_property_no"
                                                                autoComplete="rep_property_no"
                                                                value={updatepropertyNo}
                                                                onChange={ev => setUpdatePropertyNo(ev.target.value)}
                                                                maxLength={255}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Enter Property Number"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.property_number}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>

                                                {/* Acquisition Date */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Acquisition Date</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <DatePicker
                                                                selected={updateacquisitionDate}
                                                                onChange={date => setUpdateAcquisitionDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Acquisition Date"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.acquisition_date ? formatDate(inspectionData?.acquisition_date) : null}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>

                                                {/* Acquisition Cost */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Acquisition Cost</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <input
                                                                type="text"
                                                                name="rep_acquisition_cost"
                                                                id="rep_acquisition_cost"
                                                                value={updateacquisitionCost ? `₱ ${formatCurrency(updateacquisitionCost)}` : ""}
                                                                onChange={handleChange}
                                                                maxLength={255}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Enter Acquisition Cost"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.acquisition_cost 
                                                                ? new Intl.NumberFormat('en-PH', {
                                                                    style: 'currency',
                                                                    currency: 'PHP'
                                                                    }).format(inspectionData?.acquisition_cost) 
                                                                : ''}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>

                                                {/* Brand/Model */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Brand/Model</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <input
                                                                type="text"
                                                                name="brand_mrep_brand_model"
                                                                id="rep_brand_model"
                                                                autoComplete="rep_brand_model"
                                                                value={updateBrandModel}
                                                                onChange={ev => setUpdateBrandModel(ev.target.value)}
                                                                maxLength={255}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Input Brand/Model"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.brand_model}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>

                                                {/* Serial/Engine No */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Serial/Engine No</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <input
                                                                type="text"
                                                                name="rep_serial_engine_no"
                                                                id="rep_serial_engine_no"
                                                                autoComplete="rep_serial_engine_no"
                                                                value={updateSerialEngineNo}
                                                                onChange={ev => setUpdateSerialEngineNo(ev.target.value)}
                                                                maxLength={255}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Input Serial/Engine No"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.serial_engine_no}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>
                                            </div>

                                            {/* 2nd Column */}
                                            <div>
                                                {/* Type of Property */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Type of Property</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <select 
                                                                name="rep_type_of_property" 
                                                                id="rep_type_of_property" 
                                                                autoComplete="rep_type_of_property"
                                                                value={updateTypeofProperty || inspectionData?.type_of_property}
                                                                onChange={ev => setUpdateTypeofProperty(ev.target.value)}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            >
                                                                <option value="" disabled>Select an option</option>
                                                                <option value="Vehicle Supplies & Materials">Vehicle Supplies & Materials</option>
                                                                <option value="IT Equipment & Related Materials">IT Equipment & Related Materials</option>
                                                                <option value="Others">Others</option>
                                                            </select>
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.type_of_property}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>
                                                
                                                {/* Description */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Description</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <textarea
                                                                type="text"
                                                                name="rep_description"
                                                                id="rep_description"
                                                                value={updateDescription}
                                                                onChange={ev => setUpdateDescription(ev.target.value)}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Enter Description"
                                                                rows={3}
                                                                style={{ resize: "none" }}
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.property_description}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>

                                                {/* Location */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Location</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        enablePartA ? (
                                                            <input
                                                                type="text"
                                                                name="rep_location"
                                                                id="rep_location"
                                                                value={updateLocation}
                                                                onChange={ev => setUpdateLocation(ev.target.value)}
                                                                maxLength={255}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholder="Enter Location"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.location}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>
                                                
                                                {/* Requestor */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Requestor</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.user_name}
                                                        </div>
                                                    )} 
                                                </div>

                                                {/* Supervisor */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Supervisor</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.supervisor_name}
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>

                                            {/* Complain */}
                                            <div className="ppa-form-container form-separate mt-2 mb-4">
                                                <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                    <label>Complain</label>
                                                </div> 
                                                {formLoading ? (
                                                    <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                ):(
                                                    enablePartA ? (
                                                        <input
                                                            type="text"
                                                            name="rep_property_no"
                                                            id="rep_property_no"
                                                            value={updateComplain}
                                                            onChange={ev => setUpdateComplain(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Complain"
                                                        />
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.complain}
                                                        </div>
                                                    )
                                                )} 
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part B */}
                                    <div className="ppa-form-border mt-4">
                                        {/* Header */}
                                        <div className="ppa-form-header">
                                            <div className="form-title-header">
                                                Part B: To be filled-up by Administrative Division
                                            </div>
                                            <div>
                                            {!formLoading && !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && (
                                            <>
                                                {/* SuperHacker */}
                                                {SuperHacker && inspectionData?.form_status != 0 && inspectionData?.date_of_filling && (
                                                    <FontAwesomeIcon onClick={() => { setEnablePartB(true); }} className="icon-edit-form" title="Edit Part A" icon={faPenToSquare} />
                                                )}

                                                {/* GSO and Authority */}
                                                {(GSO || AuthorityAccess) && (
                                                    [6, 8, 9, 10].includes(inspectionData?.form_status) ? (
                                                        <FontAwesomeIcon onClick={() => { setPartBForm(true); }} className="icon-edit-form" title="Enable Form" icon={faPen} />
                                                    ):(
                                                        <FontAwesomeIcon onClick={() => { setEnablePartB(true); }} className="icon-edit-form self-center" title="Edit Part B" icon={faPenToSquare} />
                                                    )
                                                )}
                                            </>
                                            )}
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="form-container-wrapper">
                                            {/* 1st Column */}
                                            <div>
                                                {/* Date */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Date</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        partBForm ? (
                                                        <DatePicker
                                                                selected={partBdate}
                                                                onChange={date => setPartBdate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        )
                                                        :enablePartB ? (
                                                            <DatePicker
                                                                selected={updatePartBdate}
                                                                onChange={date => setUpdatePartBdate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.date_of_filling ? formatDate(inspectionData?.date_of_filling) : null}
                                                            </div>
                                                        )
                                                        
                                                    )} 
                                                </div>

                                                {/* Date of Last Repair */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Date of Last Repair</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        partBForm ? (
                                                        <DatePicker
                                                                selected={lastfilledDate}
                                                                onChange={date => setLastFilledDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        )
                                                        :enablePartB ? (
                                                            <DatePicker
                                                                selected={updatelastfilledDate}
                                                                onChange={date => setUpdateLastFilledDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.date_of_filling ? (
                                                                    inspectionData?.date_of_last_repair ? formatDate(inspectionData?.date_of_last_repair) : 'N/A'
                                                                ) : null  }
                                                            </div>
                                                        )
                                                        
                                                    )} 
                                                </div>

                                                {/* Assign Personnel */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Assign Personnel</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        partBForm ? (
                                                            <select 
                                                                name="rep_type_of_property" 
                                                                id="rep_type_of_property" 
                                                                autoComplete="rep_type_of_property"
                                                                value={pointPersonnel.pid}
                                                                onChange={ev => {
                                                                    const selectedPid = parseInt(ev.target.value);
                                                                    const selectedPersonnel = getPersonnel.find(staff => staff.personnel_id === selectedPid);

                                                                    setPointPersonnel(selectedPersonnel ? { pid: selectedPersonnel.personnel_id, pname: selectedPersonnel.personnel_name } : { pid: '', pname: '' });
                                                                }}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            >
                                                                <option value="" disabled>Select an option</option>
                                                                {getPersonnel.map(data => (
                                                                <option key={data.personnel_id} value={data.personnel_id}>
                                                                    {data.personnel_name}
                                                                </option>
                                                                ))}
                                                            </select>
                                                        )
                                                        :enablePartB ? (
                                                            <select 
                                                                name="rep_type_of_property" 
                                                                id="rep_type_of_property" 
                                                                autoComplete="rep_type_of_property"
                                                                value={updatepointPersonnel.pid}
                                                                onChange={ev => {
                                                                const selectedPid = parseInt(ev.target.value);
                                                                const selectedPersonnel = getPersonnel.find(staff => staff.personnel_id === selectedPid);

                                                                setUpdatePointPersonnel(
                                                                    selectedPersonnel 
                                                                    ? { pid: selectedPersonnel.personnel_id, pname: selectedPersonnel.personnel_name } 
                                                                    : { pid: '', pname: '' }
                                                                );
                                                                }}
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                disabled={SuperHacker || ![5, 6, 8, 9, 10, 11].includes(inspectionData?.form_status)}
                                                            >
                                                                {/* Disabled option for current personnel */}
                                                                <option value="" disabled>
                                                                {inspectionData?.personnel_name ? `${inspectionData.personnel_name}`  : "Select Personnel"} 
                                                                </option>

                                                                {/* Filter out current personnel */}
                                                                {getPersonnel
                                                                .map(data => (
                                                                    <option key={data.personnel_id} value={data.personnel_id}>
                                                                    {data.personnel_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.personnel_name}
                                                            </div>
                                                        )
                                                    )} 
                                                </div>
                                            </div>

                                            {/* 2nd Column */}
                                            <div>
                                                {/* Requested By */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Requested By</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.date_of_filling ? nameData?.gso : null}
                                                        </div>
                                                    )} 
                                                </div>

                                                {/* Noted By */}
                                                <div className="ppa-form-container mt-2">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Noted By</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.date_of_filling ? nameData?.admin : null}
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>

                                            {/* Nature of Last Repair */}
                                            <div className="ppa-form-container form-separate mt-2 mb-4">
                                                <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                    <label>Nature of Last Repair</label>
                                                </div> 
                                                {formLoading ? (
                                                    <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                ):(
                                                    partBForm ? (
                                                        <input
                                                            id="nature_repair"
                                                            name="nature_repair"
                                                            value={natureRepair}
                                                            onChange={ev => setNatureRepair(ev.target.value)}
                                                            maxLength={255}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Nature of Last Repair"
                                                        />
                                                    )
                                                    :enablePartB ? (
                                                        <input
                                                            id="nature_repair"
                                                            name="nature_repair"
                                                            value={updatenatureRepair}
                                                            onChange={ev => setUpdateNatureRepair(ev.target.value)}
                                                            maxLength={255}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Nature of Last Repair"
                                                        />
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.date_of_filling ? (
                                                                inspectionData?.nature_of_last_repair ? inspectionData?.nature_of_last_repair : 'N/A'
                                                            ) : null}
                                                        </div>
                                                    )
                                                    
                                                )} 
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part C */}
                                    <div className="ppa-form-border mt-4">
                                        {/* Header */}
                                        <div className="ppa-form-header">
                                            <div className="form-title-header">
                                                Part C: To be filled-up by the DESIGNATED INSPECTOR before repair job                                            </div>
                                            <div>
                                            {!formLoading && !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && (
                                            <>
                                                {/* SuperHacker */}
                                                {SuperHacker && (
                                                    inspectionData?.form_status == 4 && inspectionData?.personnel_id == currentUserId ? (
                                                        <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-edit-form" title="Enable Form" icon={faPen} />
                                                    ):[1, 2, 3].includes(inspectionData?.form_status) ? (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form" title="Edit Part C" icon={faPenToSquare} />
                                                    ):null 
                                                )}

                                                {/* Authority and GSO */}
                                                {(GSO || AuthorityAccess) && (
                                                    inspectionData?.date_of_filling && (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form" title="Edit Part C" icon={faPenToSquare} />
                                                    )  
                                                )}

                                                {/* Assign Personnel */}
                                                {inspectionData?.personnel_id == currentUserId && !SuperHacker && (
                                                    inspectionData?.form_status == 4 ? (
                                                        <FontAwesomeIcon onClick={() => { setPartCForm(true); }} className="icon-edit-form" title="Enable Form" icon={faPen} />
                                                    ):[2, 3].includes(inspectionData?.form?.form_status) ? (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartC(true); }} className="icon-edit-form" title="Edit Part C" icon={faPenToSquare} />
                                                    ):null
                                                )}
                                            </>
                                            )}
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="form-container-wrapper">
                                            {/* 1st Column */}
                                            <div>
                                                {/* Date */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Date</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        partCForm ? (
                                                        <DatePicker
                                                                selected={partCDate}
                                                                onChange={date => setPartCDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        )
                                                        :enablePartC ? (
                                                            <DatePicker
                                                                selected={partCDate}
                                                                onChange={date => setPartCDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.before_repair_date ? formatDate(inspectionData?.before_repair_date) : null}
                                                            </div>
                                                        )
                                                        
                                                    )} 
                                                </div>
                                            </div>

                                            {/* 2nd Column */}
                                            <div>
                                                {/* Assign Personnel */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Assign Personnel</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.before_repair_date ? inspectionData?.personnel_name : null}
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>

                                            {/* Fidings */}
                                            <div className="ppa-form-container form-separate mt-2">
                                                <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                    <label>Fidings</label>
                                                </div> 
                                                {formLoading ? (
                                                    <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                ):(
                                                    partCForm ? (
                                                        <input
                                                            id="findings"
                                                            name="findings"
                                                            value= {findings}
                                                            onChange={ev => setFindings(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Findings"
                                                        />
                                                    )
                                                    :enablePartC ? (
                                                        <input
                                                            id="findings"
                                                            name="findings"
                                                            value= {updatefindings}
                                                            onChange={ev => setUpdateFindings(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Findings"
                                                        />
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.findings ? inspectionData?.findings : null}
                                                        </div>
                                                    )
                                                    
                                                )} 
                                            </div>

                                            {/* Recomendations */}
                                            <div className="ppa-form-container form-separate mt-2 mb-4">
                                                <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                    <label>Recomendations</label>
                                                </div> 
                                                {formLoading ? (
                                                    <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                ):(
                                                    partCForm ? (
                                                        <input
                                                            id="recomendations"
                                                            name="recomendations"
                                                            value={recommendations}
                                                            onChange={ev => setRecommendations(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Recomendations"
                                                        />
                                                    )
                                                    :enablePartC ? (
                                                        <input
                                                            id="recomendations"
                                                            name="recomendations"
                                                            value= {updaterecommendations}
                                                            onChange={ev => setUpdateRecommendations(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Recomendations"
                                                        />
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.recommendations ? inspectionData?.recommendations : null}
                                                        </div>
                                                    )
                                                    
                                                )} 
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part D */}
                                    <div className="mt-4 mb-4">
                                        {/* Header */}
                                        <div className="ppa-form-header">
                                            <div className="form-title-header">
                                                Part D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.
                                            </div>
                                            <div>
                                            {!formLoading && !enablePartA && !enablePartB && !enablePartC && !enablePartD && !partBForm && !partCForm && !partDForm && (
                                            <>
                                                {/* SuperHacker */}
                                                {SuperHacker && (
                                                    (inspectionData?.form_status == 3 && inspectionData?.personnel_id == currentUserId) ? (
                                                        <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-edit-form" title="Enable Form" icon={faPen} />
                                                    ):[1, 2, 3].includes(inspectionData?.form_status) ? (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-edit-form" title="Edit Part D" icon={faPenToSquare} />
                                                    ):null
                                                )}

                                                {/* Authority and GSO */}
                                                {(GSO || AuthorityAccess) && (
                                                    inspectionData?.before_repair_date && (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-edit-form" title="Edit Part D" icon={faPenToSquare} />
                                                    )
                                                )}

                                                {/* Assign Personnel */}
                                                {inspectionData?.personnel_id == currentUserId && !SuperHacker && (
                                                    inspectionData?.form_status == 3 ? (
                                                        <FontAwesomeIcon onClick={() => { setPartDForm(true); }} className="icon-form self-center" title="Enable Form" icon={faPen} />
                                                    ):inspectionData?.form_status == 2 ? (
                                                        <FontAwesomeIcon onClick={() => { setEnablePartD(true); }} className="icon-form self-center" title="Edit Part D" icon={faPenToSquare} />
                                                    ):null
                                                )}
                                            </>
                                            )}
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <div className="form-container-wrapper">
                                            {/* 1st Column */}
                                            <div>
                                                {/* Date */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Date</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        partDForm ? (
                                                        <DatePicker
                                                                selected={partDDate}
                                                                onChange={date => setPartDDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        )
                                                        :enablePartD ? (
                                                            <DatePicker
                                                                selected={partDDate}
                                                                onChange={date => setPartDDate(date)}
                                                                maxDate={today}
                                                                dateFormat="yyyy-MM-dd"
                                                                className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                                placeholderText="Enter Date"
                                                            />
                                                        ):(
                                                            <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                                {inspectionData?.after_reapir_date ? formatDate(inspectionData?.after_reapir_date) : null}
                                                            </div>
                                                        )
                                                        
                                                    )} 
                                                </div>
                                            </div>

                                            {/* 2nd Column */}
                                            <div>
                                                {/* Assign Personnel */}
                                                <div className="ppa-form-container mt-3">
                                                    <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                        <label>Assign Personnel</label>
                                                    </div> 
                                                    {formLoading ? (
                                                        <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.after_reapir_date ? inspectionData?.personnel_name : null}
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>

                                            {/* Remarks */}
                                            <div className="ppa-form-container form-separate mt-2">
                                                <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                                                    <label>Remarks</label>
                                                </div> 
                                                {formLoading ? (
                                                    <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                                                ):(
                                                    partDForm ? (
                                                        <input
                                                            id="remarks"
                                                            name="remarks"
                                                            value= {remarks}
                                                            onChange={ev => setRemarks(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Remarks"
                                                        />
                                                    )
                                                    :enablePartD ? (
                                                        <input
                                                            id="remarks"
                                                            name="remarks"
                                                            value={updateremarks}
                                                            onChange={ev => setUpdateRemarks(ev.target.value)}
                                                            maxLength={500}
                                                            className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}
                                                            placeholder="Enter Remarks"
                                                        />
                                                    ):(
                                                        <div className={`ppa-form-field pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                                            {inspectionData?.remarks ? inspectionData?.remarks : null}
                                                        </div>
                                                    )
                                                    
                                                )} 
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        </>
                        )}
                    </div>
                </div>

                {/* Activity */}
                <div className="ppa-widget mb-act">
                    <div className="joms-user-info-header">Activity</div>
                    <div className="activity-container">
                        {activityLoading ? (
                            <div className="activity-loading">
                                <div className="activity-spinner">
                                <span></span><span></span><span></span>
                                </div>
                                <div className="activity-text">
                                Loading activity…
                                </div>
                            </div>
                        ):(
                            trackingForm?.length > 0 ? (
                                trackingForm?.map(list => (
                                    <div key={list.id}>
                                        <div className="activity-combined">
                                            <FontAwesomeIcon className="icon-activity" icon={faCircle} />
                                            <div className="activity-datetime">
                                            {list.date} {list.time}
                                            </div>
                                            <div className="activity-remarks">
                                            {list.remarks}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ):(
                                "Wala"
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Popup */}
            <Popup
                show={showPopup}
                popupContent={popupContent}
                popupMessage={popupMessage}
                inspectionID={inspectionData?.id}
                submitFunction={submitLoading}
                submitDisapproval={SubmitSupReason}
                submitApproval={handlelSupervisorApproval}
                adminApproval={handlelAdminApproval}
                InspPartB={SubmitPartB}
                MarkComplete={ManualCompleteConfirmation}
                CancelReq={CancelForm}
                onSuccess={successPopup}
                onClose={justClose}
            />
        </>
        )
    );
}