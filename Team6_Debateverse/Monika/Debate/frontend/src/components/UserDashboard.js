import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePostAdd } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { FaHeartCircleCheck, FaHeartCircleXmark } from "react-icons/fa6";
import axios from 'axios';

// Context for token (assumed to be provided in a parent component)
const Userdashboard = () => {
  const { token, setToken } = useContext();  // Access token from context
  const [debates, setDebates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');  // Navigate to login if token is not available
    } else {
      setIsLoggedIn(true); // User is logged in, show dashboard content
      fetchDebates();
    }
  }, [token, navigate]);

  // Function to fetch debates
  const fetchDebates = () => {
    axios
      .get('http://localhost:5000/debates', {
        headers: { 'x-token': token },
      })
      .then((res) => setDebates(res.data))
      .catch((err) => {
        console.error('Error fetching debates:', err);
        // Optionally handle logout here if error is related to invalid token
        if (err.response && err.response.status === 401) {
          setToken(null); // Remove invalid token and redirect to login
          navigate('/login');
        }
      });
  };

  // Function to handle creating a new debate
  const handleCreate = () => {
    navigate('/newdebate');  // Navigate to create new debate page
  };

  // Helper function to format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="p-4">
      {isLoggedIn && (
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-primary">Thank You for Logging In!</h1>
          <p className="text-xl">Welcome back to the dashboard.</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">My Debates</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Create New <MdOutlinePostAdd />
        </button>
      </div>
      <div>
        <div className="space-y-4 mt-4">
          {debates.length === 0 ? (
            <p className="text-1xl text-primary">No debates available, create your first debate.....</p>
          ) : (
            debates.map((debate, index) => (
              <div key={debate._id} className="relative bg-white/80 p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-10">
                <p className="text-sm text-blue-700 font-semibold mt-1">
                  Asked on: {formatDate(debate.createdDate)}
                </p>
                <h4 className="font-semibold text-xl">
                  {index + 1}. {debate.question}
                </h4>
                <div className="absolute top-4 right-4 m-4 flex items-center space-x-2">
                  <p className="text-lg font-bold text-gray-700">0</p>
                  <FaHeartCircleCheck className="text-red-500" size={24} />
                  <p className="text-lg font-bold text-gray-700">0</p>
                  <FaHeartCircleXmark size={24} />
                </div>
                <ul className="mt-2">
                  {debate.options.map((option, idx) => (
                    <li key={idx} className="flex justify-between items-center space-x-4">
                      <span className="flex-grow">{idx + 1}. {option}</span>
                      <div className="flex items-center justify-center space-x-2">
                        <ImUsers size={24} />
                        <p>{debate.votes ? debate.votes[idx] : 0}</p>
                        <AiFillMessage size={24} className="text-blue-500" />
                        <p>{debate.comments ? debate.comments[idx] : 0}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="my-6">
                  <p>Votes distribution:</p>
                  <div className="w-full h-40 bg-gray-200">
                    <p>Graph: Visualize votes for each option here</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
