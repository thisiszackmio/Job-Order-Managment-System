import { useEffect, useState } from "react";
import { useUserStateContext } from "../context/ContextProvider";
import axiosClient from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench, faCalendarDays, faVanShuttle, faFileContract } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const { currentUserId } = useUserStateContext();

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

    const [loading, setLoading] = useState(true);

    // --- Get Details --- //
    const [userDet, getUserDet] = useState([]);

    const fetchUserDet = async () => {
        try {
        const response = await axiosClient.get(`/userdetail/${currentUserId}`);
        const dataUserDet = response.data;

        // console.log(dataUserDet);
        getUserDet(dataUserDet);

        } catch(error){
            console.error("Unexpected error:", error);
        } finally {
        setLoading(false);
        }
    }

    // --- Count Request --- //
    const [reqCount, setReqCount] = useState([]);

    const fetchUserCount = async () => {
        try {
        const response = await axiosClient.get(`/usercountreq/${currentUserId}`);
        const dataUserCount = response.data;

        // console.log(dataUserCount);
        setReqCount(dataUserCount);

        } catch(error){
            console.error("Unexpected error:", error);
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => { 
        if(currentUserId){
        fetchUserDet();
        fetchUserCount();
        }
    }, [currentUserId]);

    const clearanceOrder = [ 'PM', 'AM', 'DM', 'GSO', 'HACK', 'AUS', 'AUI', 'AUF', 'AUV', 'SEC', 'AP', 'MEM' ];

    const sortedClearance =
    userDet?.code_clearance
        ?.split(',')
        .map(item => item.trim())
        .sort((a, b) => clearanceOrder.indexOf(a) - clearanceOrder.indexOf(b)) || [];

    return(
    <div className="ppa-widget mt-4">
        <div className="joms-user-info-header">Profile Details</div>
        <div className="profile-col-grid mt-5">
            {/* Avatar and Esig */}
            <div>
                {/* Avatar */}
                <div className="user-image-wrap">
                    {loading ? (
                        <div className="skeleton-user-image mb-5"></div>
                    ):(
                        <img
                        src={userDet.avatar}
                        alt="User"
                        className="user-image mx-auto"
                        loading="lazy"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                        />
                    )}
                </div>
                {/* Name and Esig */}
                {!loading && (
                <div className="ppa-signature-block relative">
                    <img
                    src={userDet?.esig}
                    alt="User Signature"
                    className="ppa-esignature-prf mx-auto"
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    />
                    <div className="ppa-job">
                        <div className="ppa-pro-name">{userDet.name}</div>
                        <div className="ppa-pro-position">{userDet?.position}</div>
                    </div>
                </div>
                )}
            </div>
            {/* Details */}
            <div>
                <div className="ppa-pro-form-wrapper">
                    {/* ID */}
                    <div className="ppa-form-container">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>User ID</label>
                        </div>  
                        {loading ? (
                            <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                        ):(
                        <>
                            <div className={`ppa-form-view pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                {userDet.userId}
                            </div>
                        </>    
                        )}
                    </div>

                    {/* Name */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>User Name</label>
                        </div>
                        {loading ? (
                            <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                        ):(
                        <>
                            <div className={`ppa-form-view pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                {userDet.name}
                            </div>
                        </>    
                        )}
                    </div>

                    {/* Position */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Position</label>
                        </div>
                        {loading ? (
                            <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                        ):(
                        <>
                            <div className={`ppa-form-view pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                {userDet.position}
                            </div>
                        </>    
                        )}
                    </div>

                    {/* Division */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Division</label>
                        </div>
                        {loading ? (
                            <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                        ):(
                        <>
                            <div className={`ppa-form-view pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}>
                                {userDet.division}
                            </div>
                        </>    
                        )}   
                    </div>

                    {/* Badge */}
                    <div className="ppa-form-container mt-2">
                        <div className={`ppa-form-title pro-title-width-insp ${isMobile ? 'border-form-title-mobile' : 'border-form-title'}`}>
                            <label>Badge</label>
                        </div>
                        {loading ? (
                            <div className={`skeleton-form pro-form-full-width ${isMobile ? 'border-form-field-mobile':'border-form-field'}`}></div>
                        ):(
                        <>
                            <div className="pro-form-full-width badge-container">
                                {sortedClearance.map((code, index) => (
                                    <div
                                    key={index}
                                    className={`ppa-badge badge-${code} ${
                                        index === sortedClearance.length - 1
                                        ? 'radius-right'
                                        : ''
                                    }`}
                                    >
                                    {code}
                                    </div>
                                ))}
                            </div>
                        </>    
                        )} 
                    </div>

                    {/* Request Count */}
                    {!loading && (
                    <table className="ppa-table mt-4 mb-4">
                        <thead>
                            <tr>
                                <th className="ppa-table-header">Request Form</th>
                                <th className="ppa-table-header text-center">Form Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* For Inspection */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faScrewdriverWrench} />
                                        <div className="joms-title-report"> Inspection Repair </div>
                                    </div>
                                </td>
                                <td className="ppa-table-body text-center"> {reqCount.inspection} </td>
                            </tr>
                            {/* Facility */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faCalendarDays} />
                                        <div className="joms-title-report"> Facility/Venue </div>
                                    </div>
                                </td>
                                <td className="ppa-table-body text-center"> {reqCount.facility} </td>
                            </tr>
                            {/* Vehicle */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faVanShuttle} />
                                        <div className="joms-title-report"> Vehicle Slip </div>
                                    </div>
                                </td>
                                <td className="ppa-table-body text-center"> {reqCount.vehicle} </td>
                            </tr>
                            {/* Locator */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faFileContract} />
                                        <div className="joms-title-report"> Locator Slip </div>
                                    </div>
                                </td>
                                <td className="ppa-table-body text-center"> {reqCount.vehicle} </td>
                            </tr>
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}