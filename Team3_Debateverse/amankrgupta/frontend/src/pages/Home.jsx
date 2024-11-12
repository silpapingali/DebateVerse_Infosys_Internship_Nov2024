import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;