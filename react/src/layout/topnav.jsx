import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faBarsStaggered, faBell, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../api/axios";
import { useUserStateContext } from "../context/ContextProvider";
import { useEffect, useRef, useState } from "react";

export default function TopNav({ toggleSidebar, isSidebarOpen, onLogout, onMobileToggle }) {
    const { currentUserId }= useUserStateContext();

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

    const location = useLocation();

    const staticTitles = {
        "/joms/dashboard": "Dashboard",
        "/joms/profile": "Profile",
        "/joms/myrequest": "My Requests",
    };

    let pageTitle = staticTitles[location.pathname];

    if (!pageTitle) {
        const path = location.pathname;

        if (
            path.startsWith("/joms/inspection/form") ||
            path.startsWith("/joms/facility/form")  ||
            path.startsWith("/joms/vehicle/form")   ||
            path.startsWith("/joms/locator/form") ||
            path.startsWith("/joms/inspection") ||
            path.startsWith("/joms/facility")  ||
            path.startsWith("/joms/vehicle")   ||
            path.startsWith("/joms/locator")
        ) {
            pageTitle = "Form";
        } else {
            pageTitle = "Job Order Management System";
        }
    }

    // Notification Time
    function timeAgo(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffSec = Math.floor((now - date) / 1000);

        if (isNaN(diffSec)) return "";

        if (diffSec < 60) return "just now";
        if (diffSec < 3600) {
            const m = Math.floor(diffSec / 60);
            return `${m} minute${m > 1 ? "s" : ""} ago`;
        }
        if (diffSec < 86400) {
            const h = Math.floor(diffSec / 3600);
            return `${h} hour${h > 1 ? "s" : ""} ago`;
        }
        if (diffSec < 2592000) {
            const d = Math.floor(diffSec / 86400);
            return `${d} day${d > 1 ? "s" : ""} ago`;
        }
        const mo = Math.floor(diffSec / 2592000);
        return `${mo} month${mo > 1 ? "s" : ""} ago`;
        }

    // Functions
    const [showNoti, setShowNoti] = useState(false);
    const dropdownRef = useRef(null);

    const JOMS_TYPE_LABELS = {
        JOMS_Inspection: "Pre/Post Inspection Repair",
        JOMS_Facility: "Facility/Venue",
        JOMS_Vehicle: "Vehicle Slip",
        JOMS_Locator: "Locator Slip",
    };

    // Get Notification
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [count, setCount] = useState([]);

    const fetchNotification = async() => {
        try {
            const response = await axiosClient.get(`/notification/${currentUserId}`);
            const responseData = response.data;
            const notification = responseData.notifications;
            const notifcount = responseData.count;

            // console.log(notification);

            // Display
            setNotifications(notification);
            setCount(notifcount);

        } catch(error){
            console.error(error);
        } finally {
            setLoadingNotifications(false);
        }
    }

    useEffect(()=>{
        if(currentUserId){
        fetchNotification();
        // fetchUnreadNotification();
        }
    },[currentUserId]);

    return(
        <header className="topnav">
            <div className="topnav-left">
                {isMobile ? (
                <>
                    {/* For Mobile */}
                    <button className="sidebar-controller" onClick={onMobileToggle} aria-label="Open menu">
                        <FontAwesomeIcon icon={faBarsStaggered} />
                    </button>
                </>
                ):(
                <>
                    {/* For Desktop */}
                    <button className={`sidebar-controller ${isSidebarOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
                        <span className="icon-stack">
                            <FontAwesomeIcon
                            className="icon-controller icon-ellipsis"
                            icon={faEllipsisVertical}
                            />
                            <FontAwesomeIcon
                            className="icon-controller icon-bars"
                            icon={faBarsStaggered}
                            />
                        </span>
                    </button>
                </>
                )}

                <div className="ppa-page-title">
                    {pageTitle}
                </div>
            </div>

            <div className="topnav-right" ref={dropdownRef}>
                <button className="topnav-icon-btn relative" onClick={() => setShowNoti((v) => !v)}>
                    <FontAwesomeIcon className="icon-top icon-noti" icon={faBell} />
                    {count ? (
                        <span className="noti-badge">{count > 9 ? '9+' : count}</span>
                    ) : null}
                </button>

                {/* Show Notification */}
                {showNoti && (
                    <div className="noti-dropdown" role="dialog" aria-label="Notifications">
                        <div className="noti-header">
                            <span>Notifications</span>
                        </div>

                        <div className="noti-list">
                            {notifications.length === 0 && <div className="noti-empty">No notifications</div>}

                            {notifications.map((data) => (
                                <div key={data.id} className={`noti-item ${data.status == 0 ? "unread" : ""}`}>
                                    <img src={data.sender_avatar} className="noti-avatar" />
                                    <div className="noti-body">
                                        <div className="noti-title">
                                        {JOMS_TYPE_LABELS[data.joms_type] || data.joms_type}
                                        </div>
                                        <div className="noti-message">{data.message}</div>
                                        <div className="noti-time">
                                        {timeAgo(data.date_request)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button className="topnav-icon-btn topnav-logout" onClick={onLogout}>
                    <FontAwesomeIcon className="icon-top icon-logout" icon={faRightFromBracket} />
                </button>
            </div>
        </header>
    );
}