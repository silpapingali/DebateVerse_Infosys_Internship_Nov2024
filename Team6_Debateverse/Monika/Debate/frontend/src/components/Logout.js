import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  
  const handleLogout = () => {
    try {
      
      localStorage.removeItem('authToken'); 

      
      setShowMessage(true);

     
      setTimeout(() => {
        setShowMessage(false);
        navigate('/'); 
      }, 3000); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 
  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div>
     
      {showMessage && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 shadow-lg z-50">
          Logout successful
        </div>
      )}

      
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h2 className="text-gray-500 font-medium">Logging out...</h2>
      </div>
    </div>
  );
};

export default Logout;
