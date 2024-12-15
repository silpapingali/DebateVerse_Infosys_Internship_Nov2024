import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  // Clear user session or authentication tokens
  const handleLogout = () => {
    // For example, clear tokens from localStorage or sessionStorage
    localStorage.removeItem('authToken');

    // Redirect the user to the login page
    navigate('/');
  };

  // Immediately log the user out when they visit the logout page
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null; // Optionally, return a loading message or spinner while logging out
};

export default Logout;
