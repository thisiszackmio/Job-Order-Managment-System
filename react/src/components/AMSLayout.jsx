import { useEffect, useState } from "react";
import { Menu, Transition } from '@headlessui/react';
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/ppa_logo.png';
import defaultImage from '/default/default-avatar.jpg'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faChevronRight, faHouse, faTachometerAlt, faLayerGroup, faUserPlus, faTrash, faWarehouse, faBoxesStacked, faLandmark, faList, faTruck, faMapLocation, faFilePen, faFile, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AMSLayout() {

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
            <li className={`w-full justify-between text-white cursor-pointer items-center ${isSidebarMinimized ? 'mb-6':'mb-3'}`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/" className="flex items-center">
                  <FontAwesomeIcon icon={faHouse} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Go to JLMS</p>}
                </Link>
              </div>
            </li>

            {/* Dashboard */}
            <li className={`w-full justify-between text-white cursor-pointer items-center ${isSidebarMinimized ? 'mb-6':'mb-3'}`}>
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <Link to="/ams/dashboard" className="flex items-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {!isSidebarMinimized && <p className="ml-4 text-lg">Dashboard</p>}
                </Link>
              </div>
            </li>

            {/* Manage */}
            <li className={`w-full justify-between text-white cursor-pointer items-center ${isSidebarMinimized ? 'mb-6':'mb-3'}`}> 
                    
              <FontAwesomeIcon icon={faLayerGroup} />
              {!isSidebarMinimized && 
              <>
                <input id="toggle1" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 1} onChange={() => handleToggle(1)} />
                <label htmlFor="toggle1" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                  <span className="ml-4">Manage</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
              </>
              }
              
              {(activeAccordion === 1 || !isSidebarMinimized) && (
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/ams/accountable-officer">
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Accountable Officer
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">
                        <FontAwesomeIcon icon={faTrash} className="mr-2" /> Recent Deleted Asset
                      </Link>
                    </li>
                  </ul>
                </section>
              )}
              
            </li>

            {/* Assest Management */}
            <li className={`w-full justify-between text-white cursor-pointer items-center ${isSidebarMinimized ? 'mb-6':'mb-3'}`}> 
                    
              <FontAwesomeIcon icon={faWarehouse} />
              {!isSidebarMinimized && 
              <>
                <input id="toggle2" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 2} onChange={() => handleToggle(2)} />
                <label htmlFor="toggle2" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                  <span className="ml-4">Assest Management</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
              </>
              }
              
              {(activeAccordion === 2 || !isSidebarMinimized) && (
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/ams/asset-classification">
                        <FontAwesomeIcon icon={faList} className="mr-2" /> Classification of Asset
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Assets
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" /> All Assets
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">
                        <FontAwesomeIcon icon={faLandmark} className="mr-2" /> Land Assets
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">
                        <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" /> Add Semi-Expendable Asset
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">
                        <FontAwesomeIcon icon={faTruck} className="mr-2" /> Supplier
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">
                        <FontAwesomeIcon icon={faMapLocation} className="mr-2" /> Location
                      </Link>
                    </li>
                  </ul>
                </section>
              )}
              
            </li>

            {/* Report */}
            <li className={`w-full justify-between text-white cursor-pointer items-center ${isSidebarMinimized ? 'mb-6':'mb-3'}`}> 
                    
              <FontAwesomeIcon icon={faFilePen} />
              {!isSidebarMinimized && 
              <>
                <input id="toggle3" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 3} onChange={() => handleToggle(3)} />
                <label htmlFor="toggle3" className="w-full justify-between text-white cursor-pointer items-center text-lg">
                  <span className="ml-4">Report</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
              </>
              }
              
              {(activeAccordion === 3 || !isSidebarMinimized) && (
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faFile} className="mr-2" /> Inventory Count of Assets
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faFile} className="mr-2" /> Property Acknowledgment Receipt
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faFile} className="mr-2" /> Transfer (Comming Soon)
                      </Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">
                      <FontAwesomeIcon icon={faFile} className="mr-2" /> Return (Comming Soon)
                      </Link>
                    </li>
                  </ul>
                </section>
              )}
              
            </li>

          </ul>

          {/* Logout */}
          <ul>
            {/* Logout */}
            <li className="w-full justify-between text-white cursor-pointer items-center mb-3 mt-3">
              <div className={`${isSidebarMinimized ? 'flex justify-center items-center h-full':''}`}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {!isSidebarMinimized && <a className="text-base  ml-4 leading-4 text-lg">Logout</a>}
              </div>
            </li>
            {/* Account */}
            <li className="flex w-full justify-between text-white cursor-pointer items-center pb-3">
              <div className="flex items-center">
              <img src={defaultImage} className="ppa-display-picture" alt="" />
              {!isSidebarMinimized ? 
                <p className="text-base leading-4 text-sm">
                  <Link to={`/`}> Zack-Mio A. Sermon </Link>
                </p> 
              : null }  
              </div>
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