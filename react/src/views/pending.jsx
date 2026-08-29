import React, { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useUserStateContext } from "../context/ContextProvider";
import { Link } from "react-router-dom"; 

export default function PendingRequests() {
    const { currentUserId, currentUserCode } = useUserStateContext();

    //Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Loading
    const [loading, setLoading] = useState(true);

    // Variable
    const [pendingRequest, getPendingRequest] = useState([]);
    const [pageRestrict, setPageRestrict] = useState(true);

    const fetchPendingRequests = async () => {
        try {
            const response = await axiosClient.get(`/pendingrequest/${currentUserId}`);
            const dataPending = response.data.pending_approved;

            // console.log(dataPending);
            getPendingRequest(dataPending);
        }catch(error){
            console.error(error);
        }finally {
            setLoading(false);
        }
    }

    // execute the function
    useEffect(() => {
        if (currentUserId) {
            fetchPendingRequests();
        }
    }, [currentUserId]);

    return(
        <div className="ppa-widget mt-4">
            <div className="joms-user-info-header">Pending Task/Approval</div>

            {/* Table */}
            <div className="table-wrapper mt-4">
                <table className="ppa-table insp-table">
                    <thead>
                        <tr>
                            <th className="ppa-table-header text-center ">#</th>
                            <th className="ppa-table-header">Type of Request</th>
                            <th className="ppa-table-header">Date of Request</th>
                            <th className="ppa-table-header">Requestor</th>
                            <th className="ppa-table-header text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
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
                                </tr>
                            ))
                        ):(
                            pendingRequest && pendingRequest?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center ppa-table-body"> No List </td>
                                </tr>
                            ):(
                                pendingRequest.map((getPenData)=>(
                                    <tr key={getPenData.id}>
                                        <td className="ppa-table-body table-id text-center">{getPenData.id}</td>
                                        <td className="ppa-table-body">{getPenData.type}</td>
                                        <td className="ppa-table-body">{formatDate(getPenData.date_request)}</td>
                                        <td className="ppa-table-body">{getPenData.requestor}</td>
                                        <td className="ppa-table-body text-center">
                                            <Link
                                                to={
                                                getPenData.type === "Pre/Post Repair Inspection Form"
                                                    ? `/joms/inspection/form/${getPenData.id}`
                                                    : getPenData.type === "Facility / Venue Form"
                                                    ? `/joms/facility/form/${getPenData.id}`
                                                    : `/joms/vehicle/form/${getPenData.id}`
                                                }
                                                className="btn-primary request-btn"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}