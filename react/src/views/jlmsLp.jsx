import ppalogo from '/default/ppa_logo-st.png';
import { Link } from "react-router-dom";

export default function JLMS(){
  return(
  <>
    <header className="ppa-logo-name">
      <div className="ppa-wrap">
        <img src={ppalogo} alt="PPA PMO/LNI" className="ppa-img-logo" />
        <div className="ppa-ld-text">
          <div className="ppa-ltitle">
            JLMS
          </div>
          <h1 className="ppa-lword">
            Joint Local Management System
          </h1>
        </div>
      </div>
    </header>

    <div className="d-flex flex-column justify-content-center mt-5">

      <div className="row justify-content-center mb-3 custom-gutter text-center">
        {/* AMS */}
        <div className="col-12 col-md-3 mb-2 mb-md-0">
          <Link to={`/ams/`}> 
            <div className="relative text-center">
                <div className="ppa-system-abbr">
                    <img className="jlms-icons object-contain" src="default/jlms/asset.gif" alt="Your Company" />
                    <div className="ppa-system-title">AMS</div>
                </div>
                <div className="ppa-system-text">
                    Asset Management System
                </div>
            </div>
          </Link>
        </div>
        {/* JOMS */}
        <div className="col-12 col-md-3 mb-2 mb-md-0">
          <Link to={`/joms/login`}> 
            <div className="relative text-center">
                <div className="ppa-system-abbr">
                    <img className="jlms-icons object-contain" src="default/jlms/task-unscreen.gif" alt="Your Company" />
                    <div className="ppa-system-title">JOMS</div>
                </div>
                <div className="ppa-system-text">
                    Job Order Management System
                </div>
            </div>
          </Link>
        </div>
        {/* PPS */}
        <div className="col-12 col-md-3">
          {/* <Link to={`/ams/`}> </Link> */}
            <div className="relative text-center">
                <div className="ppa-system-abbr">
                    <img className="jlms-icons object-contain" src="default/jlms/personnel-unscreen.gif" alt="Your Company" />
                    <div className="ppa-system-title">PPS</div>
                </div>
                <div className="ppa-system-text">
                    Personnel Profiling System
                </div>
                🚧 Coming Soon
            </div>
        </div>
      </div>

      <div className="row justify-content-center text-center mt-0 mt-md-5">
        {/* DTS */}
        <div className="col-12 col-md-3 mb-2 mb-md-0">
          {/* <Link to={`/ams/`}> </Link> */}
            <div className="relative text-center">
                <div className="ppa-system-abbr">
                    <img className="jlms-icons object-contain" src="default/jlms/form-unscreen.gif" alt="Your Company" />
                    <div className="ppa-system-title">DTS</div>
                </div>
                <div className="ppa-system-text">
                    Document Tracking System
                </div>
                🚧 Coming Soon
            </div>
        </div>
        
        {/* DIS */}
        <div className="col-12 col-md-3">
          {/* <Link to={`/ams/`}> </Link> */}
            <div className="relative text-center">
                <div className="ppa-system-abbr">
                    <img className="jlms-icons object-contain" src="default/jlms/file-info-unscreen.gif" alt="Your Company" />
                    <div className="ppa-system-title">DIS</div>
                </div>
                <div className="ppa-system-text">
                    Database of Issuance System
                </div>
                🚧 Coming Soon
            </div>
        </div>
      </div>

    </div>

    <footer className="footer-content">
      <p>&copy; 2026 All rights reserved. Developed by PPA PMO/LNI - IT Team </p>
    </footer>
  </>
  );
}