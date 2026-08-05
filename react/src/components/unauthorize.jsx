import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">Access Denied</h1>
        <p className="unauthorized-message">
          You are not allowed to access this page.
        </p>
        <p className="unauthorized-message">
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="unauthorized-buttons">
          <button onClick={() => navigate(-1)} className="btn-cancel py-2 m-3">
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </button>
          <Link to="/" className="btn-secondary py-2">
            <FontAwesomeIcon icon={faHome} /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;