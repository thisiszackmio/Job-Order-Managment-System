import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../api/axios";
import UnauthorizedPage from "../../components/unauthorize";

export default function InspectionList() {
    const { currentUserId, currentUserCode } = useUserStateContext();

    //Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const [loading, setLoading] = useState(true);
    const [pageRestrict, setPageRestrict] = useState(true);

    // Get User Employee's Data
    const [formlist, setFormList] = useState([]);
    const [currentInspPage, setCurrentInspPage] = useState(1);
    const [lastInspPage, setLastInspPage] = useState(1);
    const [searchInsp, setSearchInsp] = useState('');

    const fetchInspectionList = async (page = 1, searchValue = searchInsp) => {
        try{
            setLoading(true);
            const InspRes = await axiosClient.get(`/allinspection?inspection_page=${page}&search=${searchValue}`);
            
            // console.log(InspRes.data.data);
            setFormList(InspRes.data.data);
            setCurrentInspPage(InspRes.data.current_page);
            setLastInspPage(InspRes.data.last_page);

        if(accessOnly){
            setPageRestrict(true);
        }else{
            setPageRestrict(false);
        }

        }catch(error){
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { 
        if(currentUserId){
            fetchInspectionList();
        }
    }, [currentUserId]);

    // For search in Inspection
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        fetchInspection(1, searchInsp);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchInsp]);

    // Restrictions Condition
    const ucode = currentUserCode;
    const codes = ucode.split(',').map(code => code.trim());
    const roles = ["HACK", "AUS", "AM", "AUI", "PM", "DM", "GSO" ];
    const accessOnly = roles.some(role => codes.includes(role));

    return(
        !pageRestrict ? (<UnauthorizedPage />):(
            <div className="ppa-widget mt-4">
                <div className="joms-user-info-header">Pre/Post Repair Inspection Form List</div>

                <div className="joms-table mt-4">
                    {/* Top */}
                    <div className="tab-header">
                        <div>
                            {/* Search (LEFT) */}
                            <input
                                type="text"
                                placeholder="Search here ..."
                                value={searchInsp}
                                onChange={(e) =>
                                setSearchInsp(e.target.value)
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
                            onClick={() => fetchInspectionList(currentInspPage - 1)}
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
                                        onClick={() => fetchInspectionList(page)}
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
                                onClick={() => fetchInspectionList(currentInspPage + 1)}
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
                        <table className="ppa-table insp-table">
                            <thead>
                                <tr>
                                    <th className="ppa-table-header text-center ">#</th>
                                    <th className="ppa-table-header">Date Request</th>
                                    <th className="ppa-table-header">Type of Property</th>
                                    <th className="ppa-table-header">Description</th>
                                    <th className="ppa-table-header">Complain/Defect</th>
                                    <th className="ppa-table-header">Requestor</th>
                                    <th className="ppa-table-header">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 15 }).map((_, index) => (  // 5 skeleton rows
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
                                    formlist && formlist?.length > 0 ? (
                                        formlist.map(getInspData => (
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
                                                <td className="ppa-table-body">{getInspData.repair_requestor}</td>
                                                <td className="ppa-table-body">{getInspData.repair_remarks}</td>
                                            </tr>
                                        ))
                                    ):(
                                        <tr>
                                            <td colSpan={7} className="text-center ppa-table-body"> No List </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table> 
                    </div>
                    
                </div>
            </div>
        )
    );
}