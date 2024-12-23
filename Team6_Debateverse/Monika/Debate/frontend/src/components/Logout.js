import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  // Logout logic
  const handleLogout = () => {
    try {
      // Clear authentication tokens or user session data
      localStorage.removeItem('authToken'); // Example: Remove the auth token

      // Display the logout success message
      setShowMessage(true);

      // Automatically hide the message and redirect after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
        navigate('/'); // Redirect to the login page
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Trigger the logout process as soon as the component is mounted
  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div>
      {/* Top popup message */}
      {showMessage && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 shadow-lg z-50">
          Logout successful
        </div>
      )}

      {/* Background fallback while logging out */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h2 className="text-gray-500 font-medium">Logging out...</h2>
      </div>
    </div>
  );
};

export default Logout;
