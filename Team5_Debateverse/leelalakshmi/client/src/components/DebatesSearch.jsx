import React, { useContext, useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ImUsers } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { FaHeartCircleXmark } from "react-icons/fa6";

const DebatesSearch = () => {
  const {token, setToken} = useContext(store);
  const [debates, setDebates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }


    // Fetch all debates
    axios
      .get('http://localhost:5000/alldebates', {  
        headers: {
          'x-token': token,
        },
      })
      .then((res) => setDebates(res.data))
      .catch((err) => {
        console.error('Error fetching debates:', err);
      });

  }, [token, navigate, setToken]);


  const handleSubmit=()=>{
    navigate('/userdashboard')
  }
  
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
      <div className="flex items-center  justify-end mb-4 space-x-4">
      <button
       onClick={handleSubmit}
        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
      >
        Go Back
      </button>

      <div className="relative w-full sm:w-96"> 
        <input 
          type="text" 
          placeholder="Search here"
          className="bg-white/90 w-full py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" 
        />
        <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
      </div>
      </div>
      <div>
        <div className="space-y-4 mt-4">
          {debates.length === 0 ? (
            <p className="text-1xl text-primary">No debates available, create your first debate.....</p>
          ) : (
            debates.map((debate) => (
              <div key={debate._id} className="relative bg-white/80 p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-10">
                
                <h4 className="font-semibold text-xl">
                {debate.question}
                </h4>
                
                <div className="absolute top-4 right-4 m-4 flex items-center space-x-2">
                   <p className="text-lg font-bold text-gray-700">0</p>
                   <FaHeartCircleCheck className="text-red-500" size={24} />
                   <p className="text-lg font-bold text-gray-700">0</p>
                   <FaHeartCircleXmark size={24}/>
                </div>
                <ul className="mt-2">
                  {debate.options.map((option, idx) => (
                    <li key={idx} className="flex justify-between items-center space-x-4">
                      <span className="flex-grow">{idx + 1}. {option}</span>

                      <div className="flex items-center justify-center space-x-2">
                        <ImUsers size={24} />
                        <p>{debate.votes ? debate.votes[idx] : 0}</p> 
                        <AiFillMessage size={24} className='text-blue-500'/>
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
                <div className="flex space-x-4">
                <p className="text-sm text-blue-700 font-semibold mt-1">
                  Asked on: {formatDate(debate.createdDate)}
                </p>
                <p className="text-sm text-blue-700 font-semibold mt-1">
                Posted By: {debate.createdBy}
                </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    
    
    
  );
};

export default DebatesSearch;
