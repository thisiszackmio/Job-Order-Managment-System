import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import ppaLogo from '/ppa_logo.png';
import { Outlet } from 'react-router';
import { useUserStateContext } from '../context/ContextProvider';
import axiosClient from '../axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const { currentUser, setCurrentUser, setUserToken  } = useUserStateContext();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleToggle = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  const navigate = useNavigate();

  const logout = () => {
    // Perform the logout logic
    axiosClient.post('/logout').then((response) => {
      setCurrentUser({});
      setUserToken(null);

      // Redirect to the login page using the navigate function
      navigate('/login');
    });
  };

  const restrictions = currentUser.code_clearance == '1' || currentUser.code_clearance == '3' || currentUser.code_clearance == '4' || currentUser.code_clearance == '10' ;
  const onlyNerd = currentUser.code_clearance == '10' ;

  return (
    <div className="w-full h-full font-roboto">
      <div>
        {/* Side Bar */}
        <div style={{ maxHeight: '100vh', position: 'fixed', overflowY: 'auto', overflowX: 'hidden'}} className="w-72 bg-ppa-themecolor shadow md:h-full flex">
          <div className="px-8">
            {/* Logo */}
            <div className="h-30 w-full flex items-center">
              <img style={{ width: '80%', margin: 'auto', marginTop: '15px' }} src={ppaLogo} alt="PPA PMO/LNI" width="144" height="30" viewBox="0 0 144 30"/>
            </div>

            <div className="text-title">
              <span className="first-letter">J</span>ob <span className="first-letter">O</span>rder <br />
              <span className="first-letter">M</span>anagement <br />
              <span className="first-letter">S</span>ystem v2
            </div>

            {/* Nav */}
            <ul className="mt-10 ppa-accordion">

              {/* Dashboard */}
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6">
                <Link to="/" className="flex items-center">
                  <p className="text-base leading-4 text-lg">Dashboard</p>
                </Link>
              </li>

              {/* My Request */}
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6 mt-6">
                <Link to={`/myrequest/${currentUser.id}`} className="flex items-center">
                  <p className="text-base leading-4 text-lg">My Request</p>
                </Link>
              </li>

              {/* Request Forms */}
              <li className="w-full justify-between text-white cursor-pointer items-center mb-6 mt-6">
                <input id="toggle1" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 1} onChange={() => handleToggle(1)} />
                <label for="toggle1" className="w-full justify-between text-white cursor-pointer items-center fle text-lg">
                  <span>Request Forms</span>
                  <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                </label>
                <section>
                  <ul id="menu1" className="pl-3 mt-4">
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/requestinspectionform">Pre/Post Repair Inspection Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                      <Link to="/facilityrequestform">Facility / Venue Request Form</Link>
                    </li>
                    <li className="flex w-full justify-between text-white cursor-pointer items-center">
                      <Link to="/vehiclesliprequestform">Vehicle Slip Form</Link>
                    </li>
                  </ul>
                </section>
              </li>

              {restrictions && (
              <>
                {/* Request List */}
                <li className="w-full justify-between text-white cursor-pointer items-center mb-6">
                  <input id="toggle2" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 2} onChange={() => handleToggle(2)}/>
                  <label for="toggle2" className="w-full justify-between text-white cursor-pointer items-center fle text-lg">
                    <span>Request List</span>
                    <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                  </label>
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/repairrequestform">Pre/Post Repair Inspection Form</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/facilityvenuerequestform">Facility / Venue Request Form</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center">
                        <Link to="/vehiclesliprequestformlist">Vehicle Slip Form</Link>
                      </li>
                    </ul>
                  </section>
                </li>
              </>
              )}

              {onlyNerd && (
              <>
                <li className="w-full justify-between text-white cursor-pointer items-center mb-6 mt-6">
                  <input id="toggle3" type="checkbox" className="accordion-toggle" name="toggle" checked={activeAccordion === 3} onChange={() => handleToggle(3)} />
                  <label for="toggle3" className="w-full justify-between text-white cursor-pointer items-center fle text-lg">
                    <span>Personnel</span>
                    <span className="absolute right-9 icon-arrow"><FontAwesomeIcon className="icon-arrow" icon={faChevronRight} /></span>
                  </label>
                  <section>
                    <ul id="menu1" className="pl-3 mt-4">
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/ppauserlist">User List</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                        <Link to="/ppauserassign">Assign Personnel</Link>
                      </li>
                      <li className="flex w-full justify-between text-white cursor-pointer items-center">
                        <Link to="/pparegistration">User Registration</Link>
                      </li>
                    </ul>
                  </section>
                </li>
              </>
              )}

            </ul>

            <ul className="buttom-nav">
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-4">
                <div className="flex items-center">
                  <a onClick={logout} className="text-base leading-4 text-lg">Logout</a>
                </div>
              </li>
              <li className="flex w-full justify-between text-white cursor-pointer items-center mb-6">
                <div className="flex items-center">
                  <p className="text-base leading-4 text-sm">User: {currentUser.fname} {currentUser.mname}. {currentUser.lname}</p>
                </div>
              </li>
            </ul>
            
          </div>
        </div>

        {/* Main Content */}
        <div className="ppa-content">
          <div style={{ minHeight: '100vh'}} className="w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default Sidebar;
