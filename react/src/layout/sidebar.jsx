import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser, faClipboardList, faComputer, faFilePen, faFile, faClock, faIdCard, faGear, faGears, faUsers, faBullhorn, faList, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isOpen, isPinnedOpen, setIsHoverOpen, mobileOpen, onLogout }) {
    const { currentUserId, currentUserAvatar, setCurrentUserToken, currentUserCode, currentUserName } = useUserStateContext();

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

    // JOMS
    const words = [
        { letter: "J", word: "ob" },
        { letter: "O", word: "rder" },
        { letter: "M", word: "anagement" },
        { letter: "S", word: "ystem" }
    ];

    const handleMouseEnter = () => {
        if (!isPinnedOpen) {
        setIsHoverOpen(true);   // temporarily open on hover
        }
    };

    const handleMouseLeave = () => {
        if (!isPinnedOpen) {
        setIsHoverOpen(false);  // close when not hovering
        }
    };

    const [activeAccordion, setActiveAccordion] = useState(null);

    // Autoclose submenu if the sidebar is closed
    useEffect(() => {
    if (!isOpen) {
            setActiveAccordion(null);
        }
    }, [isOpen]);

    const handleToggle = (index) => {
        setActiveAccordion(index === activeAccordion ? null : index);
    };

    return(
        <div className={`ppa-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"} ${mobileOpen ? "mobile-open" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-hidden={mobileOpen ? "false" : "true"}
        >
            <aside className="sidebar-wrapper">
                {/* Company Info and Logo */}
                <div className={`company-info ${isOpen ? "open" : "closed"}`}>
                    <img
                        src="/default/logo-no-words.png"
                        alt="Mini Logo"
                        className="ppa-logo"
                    />
                    <span className="logo-text">
                        PPA PMO LNI
                    </span>
                </div>

                <div className="line-separate"></div>

                {/* System Name */}
                <div className={`text-title mt-3 ${isOpen  ? "full" : "mini"}`}>
                {words.map((item, index) => (
                    <div key={index} className="title-row">
                    <span className="first-letter">{item.letter}</span>
                    <span className={`word-part ${isOpen  ? "show" : "hide"}`}>
                        {item.word}
                    </span>
                    </div>
                ))}
                </div>

                <div className="line-separate"></div>

                {/* Navigation */}
                <ul className={`ppa-accordion ${isOpen ? 'nav-min':''}`}>
                    {/* User Profile */}
                    <li
                        className={`accordion-item ${activeAccordion === 0 ? 'active' : ''}`}
                        onClick={() => handleToggle(0)}
                    >
                        <div className={`company-info mt-3 ${isOpen ? "open" : "closed"}`}>
                            <img src={currentUserAvatar} alt="User Avatar" className="ppa-display-avatar" />
                            <span className={`logo-user-name ${isOpen ? "open" : "closed"}`}> {currentUserName.name} </span>

                            {/* Icon arrow */}
                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className={`icon-arrow ${
                                    activeAccordion === 0 ? "rotate" : ""
                                }`}
                            />
                        </div>
                    </li>

                    {/* User Profile dropdown */}
                    <section
                        className={`accordion-content ${
                            activeAccordion === 0 ? "open" : ""
                        }`}
                    >
                        <div className="accordion-inner">
                            <ul className="submenu">
                                <Link to="/joms/profile" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faUser} />
                                    <span>Profile</span>
                                </Link>

                                <Link to="/joms/myrequest" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faClipboardList} />
                                    <span>My Request</span>
                                </Link>
                            </ul>
                        </div>
                    </section>
                
                    <div className="line-separate"></div>

                    {/* Dashboard */}
                    <li className="accordion-item">
                        <Link to="/joms/dashboard" className={`nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faComputer} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                Dashboard
                            </span>
                        </Link>
                    </li>

                    
                    {/* Pending Requests */}
                    <li className="accordion-item">
                        <Link to="/joms/pending" className={`nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faClock} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                Pending Requests
                            </span>
                        </Link>
                    </li>

                    {/* Request Slip */}
                    <li
                        className={`accordion-item ${activeAccordion === 1 ? 'active' : ''}`}
                        onClick={() => handleToggle(1)}
                    >
                        <div className={`nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faFilePen} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                Request Forms
                            </span>

                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className={`icon-arrow ${activeAccordion === 1 ? "rotate" : ""}`}
                            />
                        </div>
                    </li>

                    {/* Request Slip Form */}
                    <section
                        className={`accordion-content ${
                            activeAccordion === 1 ? "open" : ""
                        }`}
                    >
                        <div className="accordion-inner">
                            <ul className="submenu">
                                <Link to="/joms/inspection/form" className="submenu-item">
                                    <div className="abbre">IR</div>
                                    <span>Inspection Request</span>
                                </Link>

                                <Link to="/joms/facility/form" className="submenu-item">
                                    <div className="abbre">FR</div>
                                    <span>Facility Request</span>
                                </Link>

                                <Link to="/joms/vehicle/form" className="submenu-item">
                                    <div className="abbre">VR</div>
                                    <span>Vehicle Request</span>
                                </Link>

                                <Link to="/joms/locator/form" className="submenu-item">
                                    <div className="abbre">LR</div>
                                    <span>Locator Request</span>
                                </Link>
                            </ul>
                        </div>
                    </section>

                    {/* Form List */}
                    <li
                        className={`accordion-item ${activeAccordion === 2 ? 'active' : ''}`}
                        onClick={() => handleToggle(2)}
                    >
                        <div className={`nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faFile} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                Request Form Lists
                            </span>

                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className={`icon-arrow ${activeAccordion === 2 ? "rotate" : ""}`}
                            />
                        </div>
                    </li>

                    {/* Form List Form */}
                    <section
                        className={`accordion-content ${
                            activeAccordion === 2 ? "open" : ""
                        }`}
                    >
                        <div className="accordion-inner">
                            <ul className="submenu">
                                <Link to="/joms/inspection" className="submenu-item">
                                    <div className="abbre">IL</div>
                                    <span>Inspection List</span>
                                </Link>

                                <Link to="/joms/facility" className="submenu-item">
                                    <div className="abbre">FL</div>
                                    <span>Facility List</span>
                                </Link>

                                <Link to="/joms/vehicle" className="submenu-item">
                                    <div className="abbre">VL</div>
                                    <span>Vehicle List</span>
                                </Link>

                                <Link to="/joms/locator" className="submenu-item">
                                    <div className="abbre">LL</div>
                                    <span>Locator List</span>
                                </Link>
                            </ul>
                        </div>
                    </section>

                    {/* Vehicle and Driver */}
                    <li className="accordion-item">
                        <Link to="/joms/vehicle/details" className={`company-info nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faIdCard} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                Driver and Vehicle Mgmt
                            </span>
                        </Link>
                    </li>

                    {/* General Settings */}
                    <li
                        className={`accordion-item ${activeAccordion === 3 ? 'active' : ''}`}
                        onClick={() => handleToggle(3)}
                    >
                        <div className={`nav-item ${isOpen ? "open" : "closed"}`}>
                            <FontAwesomeIcon className="icon-nav" icon={faGear} />

                            <span className={`nav-text ${isOpen ? "show" : "hide"}`}>
                                General Settings
                            </span>

                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className={`icon-arrow ${activeAccordion === 3 ? "rotate" : ""}`}
                            />
                        </div>
                    </li>

                    {/* Form List Form */}
                    <section
                        className={`accordion-content ${
                            activeAccordion === 3 ? "open" : ""
                        }`}
                    >
                        <div className="accordion-inner">
                            <ul className="submenu">
                                <Link to="/joms/profile" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faGears} />
                                    <span>System Settings</span>
                                </Link>

                                <Link to="/joms/profile" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faUsers} />
                                    <span>Users</span>
                                </Link>

                                <Link to="/joms/profile" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faBullhorn} />
                                    <span>Announcements</span>
                                </Link>

                                <Link to="/joms/profile" className="submenu-item">
                                    <FontAwesomeIcon className="icon-nav" icon={faList} />
                                    <span>Logs</span>
                                </Link>
                            </ul>
                        </div>
                    </section>
                </ul>
                
                {isMobile && (
                <div className="sidebar-footer accordion-item">
                    <button className="logout-mb-btn" onClick={onLogout}>
                        <FontAwesomeIcon className="icon-nav-lg" icon={faRightFromBracket} />
                        <span className={`nav-text ${isOpen ? "show" : "hide"}`}>Logout</span>
                    </button>
                </div>
                )}
            </aside>
        </div>
    );
}