import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admindashboard = () => {
  const {token, setToken}= useContext(store);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }

    axios
      .get('http://localhost:5000/admindashboard', {
        headers: {
          'x-token': token,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setToken(null); 
          navigate('/login'); 
        } else {
          console.error(err); 
        }
      });
  }, [token, navigate, setToken]);

  if (!token) {
    return navigate('/login');
  }

  return (
    <div>
      {data && (
        <center className="font-primary text-primary">
          Welcome to Admin dashboard<br />
        </center>
      )}
    </div>
  );
};

export default Admindashboard;
