import { useContext, useState, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePostAdd } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { FaHeart } from "react-icons/fa6";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // Import Recharts components

const Userdashboard = () => {
  const { token, setToken } = useContext(store);
  const [data, setData] = useState(null);
  const [debates, setDebates] = useState([]); 
  const navigate = useNavigate();
  const role=localStorage.getItem('role');

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

  if (role !== "user") {
    return (
      <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-3xl mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p className='text-xl font-semibold mb-4 text-center text-red-600'>Access Denied users Only

              </p>
            </div>
    </div>
    );
  }

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
      {debate.isblocked && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-md">
          Debate is blocked
        </div>
      )}
      <p className="text-sm text-blue-700 font-semibold mt-1">
        Asked on: {formatDate(debate.createdDate)}
      </p>
      <h4 className="font-semibold text-xl">
        {debate.question}
      </h4>
      <div className="absolute top-4 right-16 m-4 flex items-center space-x-2">
        <p className="font-bold">{debate.likes || 0}</p>
        <FaHeart className="text-red-500 text-2xl mr-2" />
      </div>
      <ul className="mt-4 space-y-4">
  {debate.options.map((option, idx) => (
    <li
      key={idx}
      className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
        option.isremoved
          ? 'bg-red-100 text-red-700 cursor-not-allowed'
          : 'bg-gray-50 text-gray-800' 
      }`}
      title={option.isremoved ? 'This option is removed by Admin' : ''}
    >
      <span className="flex-grow text-base font-medium">
        {idx + 1}. {option.optionText}
      </span>
      <div className="flex items-center space-x-3">
        <ImUsers className="text-black-500" size={20} />
        <p className="text-lg font-semibold">{option.votes}</p>
      </div>
    </li>
  ))}
</ul>


      {/* Bar Chart for Votes Distribution */}
      <div className="my-6">
        <p className="text-lg font-medium">Votes distribution:</p>
        <div className="flex-grow-[8] h-60 bg-gray-300 px-4 py-2 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={debate.options.map((opt, idx) => ({
                name: idx + 1,
                votes: opt.votes,
              }))}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Options', position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: 'Votes', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip />
              <Bar dataKey="votes" fill="#6a0dad" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
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