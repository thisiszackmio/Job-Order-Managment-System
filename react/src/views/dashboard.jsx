import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench, faCalendarDays, faVanShuttle, faFileContract } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

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

    // Date Format 
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    //Time Format
    function formatTime(dateString) {
        const date = new Date(dateString);

        return date.toLocaleString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        });
    }

    // Greeting
    function getGreeting() {
        const hour = new Date().getHours();

        if (hour < 12) {
        return 'Good Morning';
        } else if (hour < 18) {
        return 'Good Afternoon';
        } else {
        return 'Good Evening';
        }
    }

    const currentDate = formatDate(new Date());

    // loading Function
    const [announcementLoading, setAnnouncementLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(true);
    const [personnelLoading, setPersonnelLoading] = useState(true);

    // ---- For Announcement ---- //
    const [announceList, setAnnounceList] = useState([]);

    const fetchAnnouncement = async () => {
        try{
        const response = await axiosClient.get('/showannouncements');
        const dataAnnouncement = response.data;

        // console.log(dataAnnouncement);

        if(dataAnnouncement){
            setAnnounceList(dataAnnouncement);
        }

        } catch(error){
        console.error(error);
        } finally {
        setAnnouncementLoading(false);
        }
    };

    // ---- For Number of Request ---- //
    const [totalReq, setTotalReq] = useState({
        inspection: { today: 0, count: 0 },
        facility: { today: 0, count: 0 },
        vehicle: { today: 0, count: 0 }
    });

    const fetchTotalRequest = async () => {
        try {
        const response = await axiosClient.get('/jomsdashboard');
        const dataTotalReq = response.data;

        // console.log(dataTotalReq);

        if(dataTotalReq){
            setTotalReq({
            inspection: dataTotalReq.inspection ?? { today: 0, count: 0 },
            facility: dataTotalReq.facility ?? { today: 0, count: 0 },
            vehicle: dataTotalReq.vehicle ?? { today: 0, count: 0 }
            });
        }

        } catch(error) {
        console.error(error);
        } finally {
        setFormLoading(false);
        }
    };

    // --- For Most Requested Personnel --- //
    const [reqPersonnel, setReqPersonnel] = useState({
        inspection: null,
        facility: null,
        vehicle: null
    });

    const fetchMostReq = async () => {
        try {
        const response = await axiosClient.get('/mostreq');
        const dataMostReq = response.data;

        if(dataMostReq){
            setReqPersonnel(dataMostReq);
        }

        } catch(error){
            console.error(error);
        } finally {
            setListLoading(false);
        }
    }

    // ---- For Reports ---- //
    const [reportData, setReportData] = useState({
        inspection: { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
        facility: { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
        vehicle: { approve: 0, disapprove: 0, pending: 0, cancel: 0 }
    });

    const fetchReports = async () => {
        try {
        const response = await axiosClient.get('/requestgraph');
        const dataReportData = response.data;

        // console.log(dataReportData);

        if(dataReportData){
            setReportData({
            inspection: dataReportData.inspection ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
            facility: dataReportData.facility ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
            vehicle: dataReportData.vehicle ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 }
            });
        }

        } catch(error) {
        console.error(error);
        } finally {
        setReportsLoading(false);
        }
    }

    // ---- For Logs ---- //
    const [isLogs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
        const response = await axiosClient.get('/getlogs');
        const dataLogs = response.data;

        // console.log(dataLogs);
        if(dataLogs){
            setLogs(dataLogs);
        }

        } catch(error){
        console.error(error);
        } finally {
        setLogsLoading(false);
        }
    }

    // ---- For Team ---- //
    const [teams, setTeams] = useState([]);

    const fetchTeams = async () => {
    try {
      const response = await axiosClient.get('/teams');
        const dataTeam = response.data;

        // console.log(dataTeam);
        if(dataTeam){
            setTeams(dataTeam);
        }

        } catch(error){
        console.error(error);
        } finally {
        setPersonnelLoading(false);
        }
    }


    // execute the function
    useEffect(() => {
        if (currentUserId) {
            fetchAnnouncement();
            fetchTotalRequest();
            fetchMostReq();
            fetchReports();
            fetchLogs();
            fetchTeams();
        }
    }, [currentUserId]);



    // Codes
    const ucode = currentUserCode;
    const codes = ucode.split(',').map(code => code.trim());
    const APM = codes.includes("PM");
    
    return(
    <>
        {/* Greetings */}
        <div className="greet-section">
            <div className="greeting">
                {getGreeting()} {currentUserName.gender == 'Male' ? "Sir":"Ma'am"} {APM && "APM"} {currentUserName.firstname}
                Hi
            </div>
        </div>

        {/* Announcement */}
        <div className="ppa-widget mt-6">
            <div className="joms-user-info-header">Announcement Board</div>
            <div className="joms-table-standard">
                <table className="ppa-table">
                    <thead>
                        <tr>
                        <th className="ppa-table-header">Description</th>
                        <th className="ppa-table-header">Date and Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcementLoading ? (
                            Array.from({ length: 1 }).map((_, index) => (  // 5 skeleton rows
                                <tr key={index}>
                                <td className="ppa-table-body">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                <td className="ppa-table-body">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                </tr>
                            ))
                        ):(
                            announceList?.length > 0 ? (
                                announceList.map(item => (
                                <tr key={item.id}>
                                    <td className="text-left ppa-table-body">{item.details}</td>
                                    <td className="text-left ppa-table-body">{formatDate(item.created_at)}</td>
                                </tr>
                                ))
                            ):(
                                <tr>
                                    <td colSpan={2} className="text-center ppa-table-body"> No Announcement </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Request Form Count */}
        <div className="ppa-cards-grid mt-6">
            {/* Inspection */}
            <div className="ppa-widget relative">
                <div className="ppa-inside">
                    <FontAwesomeIcon className="icon-reqcount" icon={faScrewdriverWrench} />
                    <div className="joms-dashboard-title text-right"> Inspection Repair Request </div>
                    <div className="joms-count flex mt-2">
                        {formLoading ? (
                            <div className="skeleton wskeleton-1/2 wsk-right hs-req mb-1"></div>
                        ):(totalReq.inspection.count)}
                    </div>
                    <div className="req-border"></div>
                    {formLoading ? (
                        <div className="skeleton hs-table mt-1"></div>
                    ):(
                        <div className="joms-word-count">No of Request Today: <strong>{totalReq.inspection.today}</strong></div>
                    )}
                </div>
            </div>
            {/* Facility */}
            <div className="ppa-widget relative">
                <div className="ppa-inside">
                    <FontAwesomeIcon className="icon-reqcount" icon={faCalendarDays} />
                    <div className="joms-dashboard-title text-right"> Facility/Venue Request </div>
                    <div className="joms-count flex mt-2">
                        {formLoading ? (
                            <div className="skeleton wskeleton-1/2 wsk-right hs-req mb-1"></div>
                        ):(totalReq.facility.count)}
                    </div>
                    <div className="req-border"></div>
                    {formLoading ? (
                        <div className="skeleton hs-table mt-1"></div>
                    ):(
                        <div className="joms-word-count">No of Request Today: <strong>{totalReq.facility.today}</strong></div>
                    )}
                </div>
            </div>
            {/* Venue */}
            <div className="ppa-widget relative">
                <div className="ppa-inside">
                    <FontAwesomeIcon className="icon-reqcount" icon={faVanShuttle} />
                    <div className="joms-dashboard-title text-right"> Vehicle Slip Request </div>
                    <div className="joms-count flex mt-2">
                        {formLoading ? (
                            <div className="skeleton wskeleton-1/2 wsk-right hs-req mb-1"></div>
                        ):(totalReq.vehicle.count)}
                    </div>
                    <div className="req-border"></div>
                    {formLoading ? (
                        <div className="skeleton hs-table mt-1"></div>
                    ):(
                        <div className="joms-word-count">No of Request Today: <strong>{totalReq.vehicle.today}</strong></div>
                    )}
                </div>
            </div>
            {/* Locator Slip */}
            <div className="ppa-widget relative">
                <div className="ppa-inside">
                    <FontAwesomeIcon className="icon-reqcount" icon={faFileContract} />
                    <div className="joms-dashboard-title text-right"> Locator Slip Request </div>
                    <div className="joms-count flex mt-2">
                        {formLoading ? (
                            <div className="skeleton wskeleton-1/2 wsk-right hs-req mb-1"></div>
                        ):(totalReq.vehicle.count)}
                    </div>
                    <div className="req-border"></div>
                    {formLoading ? (
                        <div className="skeleton hs-table mt-1"></div>
                    ):(
                        <div className="joms-word-count">No of Request Today: <strong>{totalReq.vehicle.today}</strong></div>
                    )}
                </div>
            </div>
        </div>

        {/* Most Requested Personnel */}
        <div className="ppa-widget mt-6">
            <div className="joms-user-info-header">Most Requested Personnel</div>
            <div className="ppa-cards-grid mrp-grid">
                {/* Inspection */}
                <div className="request-personnel">
                    <div className="joms-dashboard-title">Inspection Repair Request</div>

                    <div className="req-det mt-2">
                        {/* Avatar / avatar skeleton */}
                        {listLoading ? (
                        <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div>
                        ):(
                        <img
                            className="joms-most"
                            src={reqPersonnel?.inspection?.avatar_url}
                            alt="Personnel Avatar"
                        />
                        )}

                        <div className="mrp-main">
                            {listLoading ? (
                            <>
                                <div className="skeleton hs-table mt-1"></div>
                                <div className="skeleton hs-table mt-1"></div>
                            </>
                        ) : (
                            <>
                            <div className="joms-mp-name">
                                {reqPersonnel?.inspection?.user_name}
                            </div>

                            <div className="mrp-number">
                                <span className="joms-mp-total">
                                {reqPersonnel?.inspection?.inspection_total}
                                </span>
                                Total Request
                            </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Facility */}
                <div className="request-personnel">
                    <div className="joms-dashboard-title">Facility/Venue Request</div>

                    <div className="req-det mt-2">
                        {/* Avatar / avatar skeleton */}
                        {listLoading ? (
                        <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div>
                        ):(
                        <img
                            className="joms-most"
                            src={reqPersonnel?.facility?.avatar_url}
                            alt="Personnel Avatar"
                        />
                        )}

                        <div className="mrp-main">
                            {listLoading ? (
                            <>
                                <div className="skeleton hs-table mt-1"></div>
                                <div className="skeleton hs-table mt-1"></div>
                            </>
                        ) : (
                            <>
                            <div className="joms-mp-name">
                                {reqPersonnel?.facility?.user_name}
                            </div>

                            <div className="mrp-number">
                                <span className="joms-mp-total">
                                {reqPersonnel?.facility?.facility_total}
                                </span>
                                Total Request
                            </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Vehicle */}
                <div className="request-personnel">
                    <div className="joms-dashboard-title">Vehicle Slip Request</div>

                    <div className="req-det mt-2">
                        {/* Avatar / avatar skeleton */}
                        {listLoading ? (
                        <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div>
                        ):(
                        <img
                            className="joms-most"
                            src={reqPersonnel?.vehicle?.avatar_url}
                            alt="Personnel Avatar"
                        />
                        )}

                        <div className="mrp-main">
                            {listLoading ? (
                            <>
                                <div className="skeleton hs-table mt-1"></div>
                                <div className="skeleton hs-table mt-1"></div>
                            </>
                        ) : (
                            <>
                            <div className="joms-mp-name">
                                {reqPersonnel?.vehicle?.user_name}
                            </div>

                            <div className="mrp-number">
                                <span className="joms-mp-total">
                                {reqPersonnel?.vehicle?.vehicle_total}
                                </span>
                                Total Request
                            </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Locator */}
                <div className="request-personnel">
                    <div className="joms-dashboard-title">Locator Slip Request</div>

                    <div className="req-det mt-2">
                        {/* Avatar / avatar skeleton */}
                        {listLoading ? (
                        <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div>
                        ):(
                        <img
                            className="joms-most"
                            src={reqPersonnel?.vehicle?.avatar_url}
                            alt="Personnel Avatar"
                        />
                        )}

                        <div className="mrp-main">
                            {listLoading ? (
                            <>
                                <div className="skeleton hs-table mt-1"></div>
                                <div className="skeleton hs-table mt-1"></div>
                            </>
                        ) : (
                            <>
                            <div className="joms-mp-name">
                                {reqPersonnel?.vehicle?.user_name}
                            </div>

                            <div className="mrp-number">
                                <span className="joms-mp-total">
                                {reqPersonnel?.vehicle?.vehicle_total}
                                </span>
                                Total Request
                            </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Reports and Logs */}
        <div className="ppa-2-col mt-6">
            {/* For the Reports */}
            <div className="ppa-widget">
                <div className="joms-user-info-header">Reports</div>
                <div className="joms-table-standard">
                    <table className="ppa-table">
                        <thead>
                            <tr>
                                <th className="ppa-table-header">Request Form</th>
                                <th className="ppa-table-header text-center">Approve</th>
                                <th className="ppa-table-header text-center">Disapprove</th>
                                <th className="ppa-table-header text-center">Pending</th>
                                <th className="ppa-table-header text-center">Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* For inspection */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faScrewdriverWrench} />
                                        <div className="joms-title-report"> Inspection Repair </div>
                                    </div>
                                </td>
                                {reportsLoading ? (
                                <td colSpan={4} className="p-3 ppa-table-report">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                ):(
                                <>
                                <td className="ppa-table-body text-center"> {reportData.inspection.approve} </td>
                                <td className="ppa-table-body text-center"> {reportData.inspection.disapprove} </td>
                                <td className="ppa-table-body text-center"> {reportData.inspection.pending} </td>
                                <td className="ppa-table-body text-center"> {reportData.inspection.cancel} </td>
                                </>
                            )}
                            </tr>
                            {/* For Facility */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faCalendarDays} />
                                        <div className="joms-title-report"> Facility/Venue </div>
                                    </div>
                                </td>
                                {reportsLoading ? (
                                <td colSpan={4} className="p-3 ppa-table-report">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                ):(
                                <>
                                <td className="ppa-table-body text-center"> {reportData.facility.approve} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.disapprove} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.pending} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.cancel} </td>
                                </>
                            )}
                            </tr>
                            {/* For Vehicle */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faVanShuttle} />
                                        <div className="joms-title-report"> Vehicle Slip </div>
                                    </div>
                                </td>
                                {reportsLoading ? (
                                <td colSpan={4} className="p-3 ppa-table-report">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                ):(
                                <>
                                <td className="ppa-table-body text-center"> {reportData.facility.approve} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.disapprove} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.pending} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.cancel} </td>
                                </>
                            )}
                            </tr>
                            {/* For Locator */}
                            <tr>
                                <td className="ppa-table-body">
                                    <div className="report-wrap">
                                        <FontAwesomeIcon className="icon-rep" icon={faFileContract} />
                                        <div className="joms-title-report"> Locator Slip </div>
                                    </div>
                                </td>
                                {reportsLoading ? (
                                <td colSpan={4} className="p-3 ppa-table-report">
                                    <div className="skeleton hs-table"></div>
                                </td>
                                ):(
                                <>
                                <td className="ppa-table-body text-center"> {reportData.facility.approve} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.disapprove} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.pending} </td>
                                <td className="ppa-table-body text-center"> {reportData.facility.cancel} </td>
                                </>
                            )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* For the Logs */}
            <div className="ppa-widget">
                <div className="joms-user-info-header">Logs</div>
                <div className="joms-date"> As for <strong>{currentDate}</strong> </div>
                <div className="joms-table-standard">
                    <table className="ppa-table mt-3">
                        <thead>
                            <tr>
                                <th className="ppa-table-header">DateTime</th>
                                <th className="ppa-table-header">Category</th>
                                <th className="ppa-table-header">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (  // 5 skeleton rows
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
                                    </tr>
                                ))
                            ):(
                                isLogs?.length > 0 ? (
                                    isLogs.map(item => (
                                        <tr key={item.id}>
                                            <td className="col-log-date text-left ppa-table-body">{formatDate(item.created_at)} {formatTime(item.created_at)}</td>
                                            <td className="col-log-cat text-left ppa-table-body">{item.category}</td>
                                            <td className="col-log-desp text-left ppa-table-body">{item.message}</td>
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={3} className="text-center ppa-table-body"> No Logs </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Meet the team */}
        {!isMobile && (
            <div className="ppa-widget mt-6">
                <div className="joms-user-info-header">Meet the Personnel</div>
                <div className="joms-table-team mt-4">
                    <div className="team-grid">
                        {personnelLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div className="member-info" key={index}>
                                    <div className="team-avatar">
                                        <div className="avatar-skel" />
                                    </div>
                                </div> 
                            ))
                        ):(
                            teams.map(item => (
                                <div key={item.id} className="team-card" tabIndex={0} aria-labelledby={`tm-name-${item.id}`}>
                                    <div className="team-photo-wrap">
                                        <img src={item.avatar} alt={`${item.name} avatar`} className="team-photo" />
                                        <div className="team-overlay" aria-hidden="true">
                                            <div className="team-overlay-inner">
                                                <div id={`tm-name-${item.id}`} className="team-name">{item.name}</div>
                                                <div className="team-role">{item.division}</div>
                                                <div className="team-office">{item.position}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
    );
}