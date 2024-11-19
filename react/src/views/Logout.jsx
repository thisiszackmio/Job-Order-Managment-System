import React, { useEffect } from 'react';
import axiosClient from '../axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setCurrentId, setUserToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the logout logic
    axiosClient.post('/logout').then(() => {
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('USER_CODE');
      localStorage.removeItem('loglevel');
      localStorage.removeItem('LAST_ACTIVITY');
      setUserToken(null);

      // Redirect to the login page
      navigate('/login');
    });
  }, [navigate, setCurrentId, setUserToken]);

  return (
    <div>
      Logging out...
      {/* You can add a loading spinner or message here */}
    </div>
  );
};

export default Logout;
