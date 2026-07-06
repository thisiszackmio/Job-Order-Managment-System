import React, { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import axiosClient from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function MyRequest() {
    const { currentUserId } = useUserStateContext();

    // Loading
    const [loadingInsp, setLoadingInsp] = useState(true);
    const [loadingFac, setLoadingFac] = useState(true);
    const [loadingVeh, setLoadingVeh] = useState(true);
    const [loadingLoc, setLoadingLoc] = useState(true);

    //Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    //Time Format
    function formatTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':');
        let amOrPm = 'am';
        let formattedHours = parseInt(hours, 10);
    
        if (formattedHours >= 12) {
        amOrPm = 'pm';
        if (formattedHours > 12) {
            formattedHours -= 12;
        }
        }
    
        const formattedTime = `${formattedHours}:${minutes}${amOrPm}`;
        return formattedTime;
    }

    const [activeTab, setActiveTab] = useState("inspection");

    const changeTab = (tab) => {
        setActiveTab(tab);
        window.location.hash = tab;
    };

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");

        if (hash === "facility" || hash === "vehicle" || hash === "inspection") {
        setActiveTab(hash);
        }
    }, []);

    // --- Inspection Data --- //
    const [inspectionForm, getInspectionForm] = useState([]);
    const [currentInspPage, setCurrentInspPage] = useState(1);
    const [lastInspPage, setLastInspPage] = useState(1);
    const [searchInsp, setSearchInsp] = useState('');

    const fetchInspection = async (page = 1, searchValue = searchInsp) => {
        try {
            setLoadingInsp(true);
            
            const InspRes = await axiosClient.get(`/jomsmyinsprequest/${currentUserId}?inspection_page=${page}&search=${searchValue}`);

            // console.log(InspRes.data.data);
            getInspectionForm(InspRes.data.data);
            setCurrentInspPage(InspRes.data.current_page);
            setLastInspPage(InspRes.data.last_page);

        } catch(error){
            console.error(error);
        } finally {
            setLoadingInsp(false);
        }
    }

    // --- Facility Data --- // 
    const [facilityForm, getFacilityForm] = useState([]);
    const [currentFacPage, setCurrentFacPage] = useState(1);
    const [lastFacPage, setLastFacPage] = useState(1);
    const [searchFac, setSearchFac] = useState('');

    const fetchFacility = async (page = 1, searchValue = searchFac) => {
        try {
        setLoadingFac(true);
        const FacRes = await axiosClient.get(`/jomsmyfacrequest/${currentUserId}?facility_page=${page}&search=${searchValue}`);

        // console.log(FacRes.data.last_page);
        getFacilityForm(FacRes.data.data);
        setCurrentFacPage(FacRes.data.current_page);
        setLastFacPage(FacRes.data.last_page);

        } catch(error){
        console.error(error);
        } finally {
        setLoadingFac(false);
        }
    }

    // --- Vehicle Data --- // 
    const [vehicleForm, getVehicleForm] = useState([]);
    const [currentVehPage, setCurrentVehPage] = useState(1);
    const [lastVehPage, setLastVehPage] = useState(1);
    const [searchVeh, setSearchVeh] = useState('');

    const fetchVehicle = async (page = 1, searchValue = searchVeh) => {
        try {
        setLoadingVeh(true);
        const VehRes = await axiosClient.get(`/jomsmyvehrequest/${currentUserId}?facility_page=${page}&search=${searchValue}`);

        // console.log(VehRes.data.data);
        getVehicleForm(VehRes.data.data);
        setCurrentVehPage(VehRes.data.current_page);
        setLastVehPage(VehRes.data.last_page);

        } catch(error){
        console.error(error);
        } finally {
        setLoadingVeh(false);
        }
    }

    // execute the function
    useEffect(() => {
        if (currentUserId) {
            fetchInspection();
            fetchFacility();
            fetchVehicle();
        }
    }, [currentUserId]);

    // For search in Inspection
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        fetchInspection(1, searchInsp);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchInsp]);

    // For search in Facility
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        fetchFacility(1, searchFac);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchFac]);

    // For search in Vehicle
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        fetchVehicle(1, searchVeh);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchVeh]);

    return(
    <>
        {/* Form Content */}
        <div className="ppa-widget mt-4">
            {/* Tabs */}
            <div className="tab-wrapper">
            {["inspection", "facility", "vehicle", "locator"].map((tab) => (
                <button key={tab} onClick={() => changeTab(tab)}
                className={`transition-all tab-btn ${
                    activeTab === tab
                    ? "tab-active"
                    : ""
                }`}
                >
                {tab === "inspection"
                    ? "Pre/Post Inspection Repair"
                    : tab === "facility"
                    ? "Facility/Venue"
                    : tab === "vehicle" ? "Vehicle Slip"
                    : "Locator Slip"}
                </button>
            ))}
            </div>

            {/* Inspection Tab */}
            {activeTab === "inspection" && (
            <div className="tab-container">
                {/* Top */}
                <div className="tab-header">
                    <div>
                        {/* Search (LEFT) */}
                        <input
                            type="text"
                            placeholder="Search here ..."
                            value={searchFac}
                            onChange={(e) =>
                            setSearchFac(e.target.value)
                            }
                            className="ppa-form-search"
                        />
                    </div>
                    <div>
                        <div className="ppa-page">
                            Page <b>{currentInspPage}</b> of <b>{lastInspPage}</b>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {lastInspPage > 1 && (
                    <div className="mt-4">
                        {/* Prev */}
                        <button
                        disabled={currentInspPage === 1}
                        onClick={() => fetchInspection(currentInspPage - 1)}
                        className="ppa-pagination padding-arrow arrow-left"
                        >
                        <FontAwesomeIcon
                            title="Prev"
                            icon={faChevronLeft}
                        />
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const pages = [];

                            // Always show first page
                            pages.push(1);

                            // Current page range
                            for (
                            let i = Math.max(2, currentInspPage - 1);
                            i <= Math.min(lastInspPage - 1, currentInspPage + 1);
                            i++
                            ) {
                            pages.push(i);
                            }

                            // Always show last page
                            if (lastInspPage > 1) {
                            pages.push(lastInspPage);
                            }

                            // Remove duplicates
                            const uniquePages = [...new Set(pages)];

                            return uniquePages.map((page, index) => {
                            const prevPage = uniquePages[index - 1];

                            return (
                                <React.Fragment key={page}>

                                {/* Show dots */}
                                {prevPage && page - prevPage > 1 && (
                                    <span>...</span>
                                )}

                                {/* Page Button */}
                                <button
                                    onClick={() => fetchInspection(page)}
                                    className={`${
                                    currentInspPage === page
                                        ? 'ppa-pagination-active ppa-page-num'
                                        : 'ppa-pagination ppa-page-num'
                                    }`}
                                >
                                    {page}
                                </button>

                                </React.Fragment>
                            );
                            });
                        })()}

                        {/* Next */}
                        <button
                            disabled={currentInspPage === lastInspPage}
                            onClick={() => fetchInspection(currentInspPage + 1)}
                            className="ppa-pagination padding-arrow arrow-right"
                        >
                            <FontAwesomeIcon
                            title="Next"
                            icon={faChevronRight}
                            />
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="table-wrapper mt-4">
                    <table className="ppa-table">
                        <thead>
                            <tr>
                                <th className="ppa-table-header text-center">#</th>
                                <th className="ppa-table-header">Date Request</th>
                                <th className="ppa-table-header">Type of Property</th>
                                <th className="ppa-table-header">Description</th>
                                <th className="ppa-table-header">Complain/Defect</th>
                                <th className="ppa-table-header">Approver</th>
                                <th className="ppa-table-header">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingInsp ? (
                                Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                                    <tr key={index}>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                    </tr>
                                ))
                            ):(
                                inspectionForm && inspectionForm?.length > 0 ? (
                                    inspectionForm.map(getInspData => (
                                        <tr key={getInspData.repair_id}>
                                            <td className="ppa-table-body">
                                                <Link 
                                                    to={`/joms/inspection/form/${getInspData.repair_id}`} 
                                                    className="link-hover-flip"
                                                >
                                                    <span className="repair-id"><b>{getInspData.repair_id}</b></span>
                                                    <span className="eye-icon">
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="ppa-table-body">{formatDate(getInspData.repair_date_request)}</td>
                                            <td className="ppa-table-body">{getInspData.repair_type}</td>
                                            <td className="ppa-table-body">{getInspData.repair_description}</td>
                                            <td className="ppa-table-body">{getInspData.repair_complain}</td>
                                            <td className="ppa-table-body">{getInspData.repair_supervisor_name}</td>
                                            <td className="ppa-table-body">{getInspData.repair_remarks}</td>
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={7} className="text-center ppa-table-body"> No Announcement </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {/* Facility Tab */}
            {activeTab === "facility" && (
            <div className="tab-container">
                {/* Top */}
                <div className="tab-header">
                    <div>
                        {/* Search (LEFT) */}
                        <input
                            type="text"
                            placeholder="Search here ..."
                            value={searchFac}
                            onChange={(e) =>
                            setSearchFac(e.target.value)
                            }
                            className="ppa-form-search"
                        />
                    </div>
                    <div>
                        <div className="ppa-page">
                            Page <b>{currentFacPage}</b> of <b>{lastFacPage}</b>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {lastFacPage > 1 && (
                    <div className="mt-4">
                        {/* Prev */}
                        <button
                        disabled={currentFacPage === 1}
                        onClick={() => fetchFacility(currentFacPage - 1)}
                        className="ppa-pagination padding-arrow arrow-left"
                        >
                        <FontAwesomeIcon
                            title="Prev"
                            icon={faChevronLeft}
                        />
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const pages = [];

                            // Always show first page
                            pages.push(1);

                            // Current page range
                            for (
                            let i = Math.max(2, currentFacPage - 1);
                            i <= Math.min(lastFacPage - 1, currentFacPage + 1);
                            i++
                            ) {
                            pages.push(i);
                            }

                            // Always show last page
                            if (lastFacPage > 1) {
                            pages.push(lastFacPage);
                            }

                            // Remove duplicates
                            const uniquePages = [...new Set(pages)];

                            return uniquePages.map((page, index) => {
                            const prevPage = uniquePages[index - 1];

                            return (
                                <React.Fragment key={page}>

                                {/* Show dots */}
                                {prevPage && page - prevPage > 1 && (
                                    <span>...</span>
                                )}

                                {/* Page Button */}
                                <button
                                    onClick={() => fetchFacility(page)}
                                    className={`${
                                    currentFacPage === page
                                        ? 'ppa-pagination-active ppa-page-num'
                                        : 'ppa-pagination ppa-page-num'
                                    }`}
                                >
                                    {page}
                                </button>

                                </React.Fragment>
                            );
                            });
                        })()}

                        {/* Next */}
                        <button
                            disabled={currentFacPage === lastFacPage}
                            onClick={() => fetchFacility(currentFacPage + 1)}
                            className="ppa-pagination padding-arrow arrow-right"
                        >
                            <FontAwesomeIcon
                            title="Next"
                            icon={faChevronRight}
                            />
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="table-wrapper mt-4">
                    <table className="ppa-table">
                        <thead>
                            <tr>
                                <th className="ppa-table-header text-center">#</th>
                                <th className="ppa-table-header">Date Request</th>
                                <th className="ppa-table-header">Request Office</th>
                                <th className="ppa-table-header">Activity</th>
                                <th className="ppa-table-header">Date</th>
                                <th className="ppa-table-header">Facility/Venue</th>
                                <th className="ppa-table-header">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingFac ? (
                                Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                                    <tr key={index}>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                    </tr>
                                ))
                            ):(
                                facilityForm  && facilityForm ?.length > 0 ? (
                                    facilityForm.map(getFacData  => (
                                        <tr key={getFacData.fac_id}>
                                            <td className="ppa-table-body">
                                                <Link 
                                                    to={`/joms/facilityvenue/form/${getFacData.fac_id}`} 
                                                    className="link-hover-flip"
                                                >
                                                    <span className="repair-id"><b>{getFacData.fac_id}</b></span>
                                                    <span className="eye-icon">
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="ppa-table-body">{formatDate(getFacData.fac_date_request)}</td>
                                            <td className="ppa-table-body">{getFacData.fac_request_office}</td>
                                            <td className="ppa-table-body">{getFacData.fac_title_of_activity}</td>
                                            <td className="ppa-table-body">
                                                {formatDate(getFacData?.fac_date_start) ===
                                                formatDate(getFacData?.fac_date_end) ? (
                                                    `${formatDate(getFacData.fac_date_start)} @ ${formatTime(
                                                    getFacData.fac_time_start
                                                    )} to ${formatTime(getFacData.fac_time_end)}`
                                                ) : (
                                                    `${formatDate(getFacData.fac_date_start)} @ ${formatTime(
                                                    getFacData.fac_time_start
                                                    )} to ${formatDate(getFacData.fac_date_end)} @ ${formatTime(
                                                    getFacData.fac_time_end
                                                    )}`
                                                )}
                                            </td>
                                            <td className="ppa-table-body">
                                                {getFacData.mph ? "Multi-Purpose Hall" : null}
                                                {getFacData.conference ? "Conference" : null}
                                                {getFacData.dorm ? "Dormitory" : null}
                                                {getFacData.other ? "Other" : null}
                                            </td>
                                            <td className="ppa-table-body">{getFacData.fac_remarks}</td>
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={7} className="text-center ppa-table-body"> No Announcement </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {/* Vehicle Tab */}
            {activeTab === "vehicle" && (
            <div className="tab-container">
                {/* Top */}
                <div className="tab-header">
                    <div>
                        {/* Search (LEFT) */}
                        <input
                            type="text"
                            placeholder="Search here ..."
                            value={searchVeh}
                            onChange={(e) =>
                            setSearchVeh(e.target.value)
                            }
                            className="ppa-form-search"
                        />
                    </div>
                    <div>
                        <div className="ppa-page">
                            Page <b>{currentVehPage}</b> of <b>{lastVehPage}</b>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {lastVehPage > 1 && (
                    <div className="mt-4">
                        {/* Prev */}
                        <button
                        disabled={currentVehPage === 1}
                        onClick={() => fetchVehicle(currentVehPage - 1)}
                        className="ppa-pagination padding-arrow arrow-left"
                        >
                        <FontAwesomeIcon
                            title="Prev"
                            icon={faChevronLeft}
                        />
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const pages = [];

                            // Always show first page
                            pages.push(1);

                            // Current page range
                            for (
                            let i = Math.max(2, currentVehPage - 1);
                            i <= Math.min(lastVehPage - 1, currentVehPage + 1);
                            i++
                            ) {
                            pages.push(i);
                            }

                            // Always show last page
                            if (lastVehPage > 1) {
                            pages.push(lastVehPage);
                            }

                            // Remove duplicates
                            const uniquePages = [...new Set(pages)];

                            return uniquePages.map((page, index) => {
                            const prevPage = uniquePages[index - 1];

                            return (
                                <React.Fragment key={page}>

                                {/* Show dots */}
                                {prevPage && page - prevPage > 1 && (
                                    <span>...</span>
                                )}

                                {/* Page Button */}
                                <button
                                    onClick={() => fetchVehicle(page)}
                                    className={`${
                                    currentVehPage === page
                                        ? 'ppa-pagination-active ppa-page-num'
                                        : 'ppa-pagination ppa-page-num'
                                    }`}
                                >
                                    {page}
                                </button>

                                </React.Fragment>
                            );
                            });
                        })()}

                        {/* Next */}
                        <button
                            disabled={currentVehPage === lastVehPage}
                            onClick={() => fetchVehicle(currentVehPage + 1)}
                            className="ppa-pagination padding-arrow arrow-right"
                        >
                            <FontAwesomeIcon
                            title="Next"
                            icon={faChevronRight}
                            />
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="table-wrapper mt-4">
                    <table className="ppa-table">
                        <thead>
                            <tr>
                                <th className="ppa-table-header text-center">#</th>
                                <th className="ppa-table-header">Date Request</th>
                                <th className="ppa-table-header">Purpose</th>
                                <th className="ppa-table-header">Arrival</th>
                                <th className="ppa-table-header">Vehicle</th>
                                <th className="ppa-table-header">Driver</th>
                                <th className="ppa-table-header">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingVeh ? (
                                Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                                    <tr key={index}>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                        <td className="ppa-table-body">
                                            <div className="skeleton hs-table"></div>
                                        </td>
                                    </tr>
                                ))
                            ):(
                                vehicleForm   && vehicleForm  ?.length > 0 ? (
                                    vehicleForm .map(getVehData  => (
                                        <tr key={getVehData.veh_id}>
                                            <td className="ppa-table-body">
                                                <Link 
                                                    to={`/joms/facilityvenue/form/${getVehData.veh_id}`} 
                                                    className="link-hover-flip"
                                                >
                                                    <span className="repair-id"><b>{getVehData.veh_id}</b></span>
                                                    <span className="eye-icon">
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="ppa-table-body">{formatDate(getVehData.veh_date_req)}</td>
                                            <td className="ppa-table-body">{getVehData.veh_purpose}</td>
                                            <td className="ppa-table-body">{formatDate(getVehData.veh_date)} @ {formatTime(getVehData.veh_time)}</td>
                                            <td className="ppa-table-body">{getVehData.veh_vehicle ? getVehData.veh_vehicle : "No Assign Vehicle"}</td>
                                            <td className="ppa-table-body">{getVehData.veh_driver ? getVehData.veh_driver : "No Assign Driver" }</td>
                                            <td className="ppa-table-body">{getVehData.remarks}</td>
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={7} className="text-center ppa-table-body"> No Announcement </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {/* Vehicle Tab */}
            {activeTab === "locator" && (
            <div className="tab-container">
                Coming Soon
            </div>
            )}
        </div>
    </>
    );
}