import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Userdashboard = () => {
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if there's no token
      return;
    }

    // Send GET request to fetch user data
    axios
      .get('http://localhost:5000/userdashboard', {
        headers: {
          'x-token': token,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        // Handle invalid or expired token
        if (err.response && err.response.status === 401) {
          // If token is invalid or expired, redirect to login page
          setToken(null); // Clear the token from the context
          navigate('/login'); // Redirect to login page
        } else {
          console.error(err); // Log any other errors
        }
      });
  }, [token, navigate, setToken]);

  // If there's no token, immediately redirect to login
  if (!token) {
    return navigate('/login');
  }

  return (
    <div>
      {data && (
        <center className="font-primary text-primary">
          Welcome to user dashboard<br />
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
            onClick={() => setToken(null)} // Log out and clear the token
          >
            Logout
          </button>
        </center>
      )}
    </div>
  );
};

export default Userdashboard;
