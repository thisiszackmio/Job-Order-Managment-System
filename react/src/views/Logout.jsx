import React, { useEffect } from 'react';
import axiosClient from '../axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setCurrentId, setUserToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the logout logic
    axiosClient.post('/logout').then((response) => {
      setCurrentId({});
      localStorage.removeItem('TOKEN');
      setUserToken(null);

      // Redirect to the login page
      navigate('/');
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
