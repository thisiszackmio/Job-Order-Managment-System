import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {

  return (
    <div className="ppa-cover">
      <div className="ppa-login">
        <div className="ppa-login-wrap">

          <div className="fnf-h1"> <strong>404</strong> </div>
          <div className="pnf"> <strong>PAGE NOT FOUND</strong> </div>
          <div className="pnf-text">
            <p>The page you are looking for does not exist or may have been moved.</p>
          </div>
          <div className="mt-5">
            <Link to={'/joms'}>
              <button 
                className="py-3 px-5 btn-primary"
                title="View Request"
              >
                Back to Dashboard
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;