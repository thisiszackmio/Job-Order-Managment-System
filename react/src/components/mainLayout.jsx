import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../layout/sidebar";
import TopNav from "../layout/topnav";
import Footer from "../layout/footer";
import Popup from "./popup";
import axios from "axios";
import axiosClient from "../api/axios";
import { useUserStateContext } from "../context/ContextProvider";

export default function MainLayout() {
    const { currentUserId, currentUserAvatar, setCurrentUserToken, currentUserCode } = useUserStateContext();

    const [isPinnedOpen, setIsPinnedOpen] = useState(true);   // toggle button
    const [isHoverOpen, setIsHoverOpen] = useState(false);    // mouseover

    const [isMobileOpen, setIsMobileOpen] = useState(false); // For mobile responsive

    // toggle from TopNav
    const handleMobileToggle = () => {
    setIsMobileOpen(v => !v);
    };

    // close helper (used for backdrop and Esc)
    const closeMobile = () => setIsMobileOpen(false);

    // disable page scroll when mobile drawer open
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileOpen]);

    const [submitLoading, setSubmitLoading] = useState(false);

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupMessage, setPopupMessage] = useState("");

    const [maintenance, setMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);

    // For Maintenance Mode
    useEffect(() => {
        axiosClient.get("/settings/maintenance").then(response => {
        setMaintenance(response.data.maintenance);
        setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") closeMobile();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const isSidebarOpen = isPinnedOpen || isHoverOpen;

    const toggleSidebar = () => {
        setIsPinnedOpen(prev => !prev);
        // when closing pinned, also clear hover
        if (isPinnedOpen) setIsHoverOpen(false);
    };

    const layoutClass = isPinnedOpen ? "pinned-open" : "pinned-closed";

    const navigate = useNavigate();

    // Open logout confirmation popup
    const handleLogout = () => {
        // CLOSE SIDEBAR (mobile + any hover)
        setIsMobileOpen(false);
        setIsHoverOpen(false);

        setShowPopup(true);
        setPopupContent('logout');
        setPopupMessage(
            <div>
                <p className="popup-title">Logout Confirmation</p>
                <p className="popup-message">Are you sure you want to log out?</p>
            </div>
        );
    };

    // Logout handler
    const confirmLogout  = () => {
        setSubmitLoading(true);

        axiosClient
        .post('/logout')
        .then(() => {
            localStorage.removeItem('USER_ID');
            localStorage.removeItem('TOKEN');
            localStorage.removeItem('USER_CODE');
            localStorage.removeItem('USER_DET');
            localStorage.removeItem('USER_AVATAR');
            setCurrentUserToken(null);
            navigate('/login');
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    };

    // Close popup
    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className={`app-wrapper ${layoutClass}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                isPinnedOpen={isPinnedOpen}
                setIsHoverOpen={setIsHoverOpen}
                mobileOpen={isMobileOpen}
                onLogout={handleLogout}
            />

            {/* backdrop for mobile drawers */}
            <div
                className={`sidebar-backdrop ${isMobileOpen ? "show" : ""}`}
                onClick={closeMobile}
                aria-hidden={!isMobileOpen}
            />

            <div className="main-container">
                <TopNav 
                    toggleSidebar={toggleSidebar} 
                    onMobileToggle={handleMobileToggle}
                    isSidebarOpen={isSidebarOpen} 
                    onLogout={handleLogout}
                />

                {loading ? (
                    <div className="app-preloader">
                        <div className="ppa-boat-loading">
                        <div className="ppa-boat-scene">
                            <div className="ppa-water"></div>

                            <div className="ppa-boat">
                            {/* Cargo containers */}
                            <div className="boat-containers">
                                <span className="container c1"></span>
                                <span className="container c2"></span>
                                <span className="container c3"></span>
                            </div>

                            {/* Boat hull */}
                            <div className="boat-hull"></div>

                            {/* Bridge */}
                            <div className="boat-bridge">
                                <div className="bridge-window"></div>
                            </div>
                            </div>
                        </div>

                        <div className="boat-loading-text">
                            Please Wait
                            <div className="boat-loading-sub">We’re preparing the system for you…</div>
                        </div>
                        </div>
                    </div>
                ):(
                    <main className="main-content">
                        <Outlet />
                    </main>  
                )}

                {!loading && <Footer /> }
            </div>

            {/* Popup */}
            <Popup
                show={showPopup}
                userId={currentUserId}
                popupContent={popupContent}
                popupMessage={popupMessage}
                submitFunction={submitLoading}
                onConfirm={confirmLogout}
                onClose={closePopup}
            />
        </div>
    );
}