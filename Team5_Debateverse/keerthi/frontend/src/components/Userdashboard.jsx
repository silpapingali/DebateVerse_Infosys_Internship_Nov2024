import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePostAdd } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { FaHeart } from "react-icons/fa6";
import axios from 'axios';

const Userdashboard = () => {
  const { token, setToken } = useContext(store);
  const [data, setData] = useState(null);
  const [debates, setDebates] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }

    axios
      .get('http://localhost:5000/userdashboard', {
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

    // Fetch all debates
    axios
      .get('http://localhost:5000/debates', {  
        headers: {
          'x-token': token,
        },
      })
      .then((res) => setDebates(res.data))
      .catch((err) => {
        console.error('Error fetching debates:', err);
      });
  }, [token, navigate, setToken]);

  const handleCreate = () => {
    navigate('/newdebate');  
  };
  
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' }); 
    const year = d.getFullYear();
    const dayWithSuffix = day + getDaySuffix(day);
    return `${month} ${dayWithSuffix}, ${year}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">My Debates</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Create New <MdOutlinePostAdd />
        </button>
      </div>
      <div className='bg-white/80'>
        <div className="space-y-4 mt-4 max-h-[80vh] overflow-y-auto">
          {debates.length === 0 ? (
            <p className="text-1xl text-primary text-black">No debates available, create your first debate.....</p>
          ) : (
            debates.map((debate) => (
              <div
                key={debate._id}
                className="relative bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-10"
              >
                <p className="text-sm text-blue-700 font-semibold mt-1">
                  Asked on: {formatDate(debate.createdDate)}
                </p>
                <h4 className="font-semibold text-xl">
                  {debate.question}
                </h4>
                <div className="absolute top-4 right-4 m-4 flex items-center space-x-2">
                  <p className="text-lg font-bold text-gray-700">0</p>
                  <FaHeart className="text-red-500 text-2xl mr-2" />
                </div>
                <ul className="mt-2">
                  {debate.options.map((option, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center space-x-4"
                    >
                      <span className="flex-grow">{idx + 1}. {option.optionText}</span>
  
                      <div className="flex items-center justify-center space-x-2">
                        <ImUsers size={24} />
                        <p>{debate.votes ? debate.votes[idx] : 0}</p>
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