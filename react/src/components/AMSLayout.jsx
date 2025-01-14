import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/default/ppa_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faChevronRight, faHouse, faTachometerAlt, faLayerGroup, faUserPlus, faTrash, faWarehouse, faBoxesStacked, faLandmark, faList, faTruck, faMapLocation, faFilePen, faFile, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../context/ContextProvider";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AMSLayout() {

  const { currentUserId, setCurrentId, setUserToken, userCode } = useUserStateContext();

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  useEffect(() => {
    if (isSidebarMinimized) {
      setActiveAccordion(null);
    }
  }, [isSidebarMinimized, setActiveAccordion]);

  // Logout Area
  const logout = () => {
    // Perform the logout logic
    const logMessage = `${currentUserId.name} has logged out of the system.`;

    axiosClient.post('/logout', { logMessage }).then(() => {
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('USER_CODE');
      localStorage.removeItem('loglevel');
      localStorage.removeItem('LAST_ACTIVITY');
      setUserToken(null);

      // Redirect to the login page
      navigate('/login');
    });
  };

  return (
    <div className="w-full h-full font-roboto">
      {/* Side Bar */}
      <div style={{ maxHeight: '100vh', position: 'fixed', overflowY: 'auto', overflowX: 'hidden'}} className={`w-72 bg-ppa-themecolor ppa-sidebar shadow flex transition-width duration-300 ${isSidebarMinimized ? 'sidebar-close' : 'sidebar-open'}`}>
        <div className={`transition-width duration-300 ${isSidebarMinimized ? 'minimized' : 'not-minimized'}`}>
          {/* Logo */}
          <div className="flex justify-center items-center py-2">
            <img src={ppaLogo} alt="PPA PMO/LNI" className={`transition-width duration-300 ${isSidebarMinimized ? 'img-minimize' : 'img-maximize items-center'}`} />
          </div>
          {/* Title Text */}
          {!isSidebarMinimized ? (
              <div className="text-title mb-10">
                <span className="first-letter">A</span>sset <br />
                <span className="first-letter">M</span>anagement <br />
                <span className="first-letter">S</span>ystem
              </div>
          ) : (
            <div className="text-title mb-10 vertical-text">
              <span className="block first-letter text-center">A</span>
              <span className="block first-letter text-center">M</span>
              <span className="block first-letter text-center">S</span>
            </div>
          )}

          {/* Nav */}
          <ul className={`mt-10 ppa-accordion ${isSidebarMinimized ? 'nav-min':''}`}>

            {/* Back to JLMS */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/" className="flex items-center">
                  <FontAwesomeIcon icon={faHouse} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Back to JLMS</p>}
                </Link>
              </div>
            </li>

            {/* Dashboard */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/ams" className="flex items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Dashboard</p>}
                </Link>
              </div>
            </li>

            {/* Asset Management */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-6 mt-6">

              <FontAwesomeIcon icon={faList} className={`${isSidebarMinimized ? 'flex justify-center items-center h-full icon-mini':''}`} />
              {!isSidebarMinimized && 
              <>
                <input id="toggle1" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 1} onChange={() => handleToggle(1)} />
                <label htmlFor="toggle1" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                  <span className="ml-4">Assest Management</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
              </>
              }

              {(activeAccordion === 1 || !isSidebarMinimized) && (
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/joms/inspection/form">Pre/Post Repair Inspection Form</Link>
                    </li>
                  </ul>
                </section>
              )} 

            </li>

          </ul>

        </div>
      </div>

      {/* Main Content */}
      <div className={`ppa-content transition-width duration-300 ${isSidebarMinimized ? 'adjust-content' : ''}`}>
        <div className="ppa-hamburger">
          <button onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} className="text-white">
            <FontAwesomeIcon icon={faBars} className="ham-haha" />
          </button>
        </div>
        <div style={{ minHeight: '100vh'}} className="w-full h-full content-here">
          <Outlet />
        </div>
      </div>
    </div>
  );
}