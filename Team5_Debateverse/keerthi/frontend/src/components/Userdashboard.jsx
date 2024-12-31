import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePostAdd } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { FaHeart } from "react-icons/fa6";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { FaThumbsUp } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/userdashboard', {
          headers: { 'x-token': token },
        });
        console.log('User Dashboard Response:', response);
        setData(response.data.message);

        const debatesResponse = await axios.get('http://localhost:5000/debates', {
          headers: { 'x-token': token },
        });
        console.log('Debates Response:', debatesResponse);

        const sortedDebates = debatesResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setDebates(sortedDebates);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setToken(null);
          navigate('/login');
        } else {
          console.error('Error fetching data:', err);
        }
      }
    };

    fetchData();
  }, [token, navigate, setToken]);

  const handleCreate = () => {
    navigate('/newdebate');
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const chartData = (debate) => {
    const totalVotes = debate.options.reduce((acc, option) => acc + option.votes, 0);
    return {
      labels: debate.options.map(option => option.optionText),
      datasets: [
        {
          label: 'Vote Share (%)',
          data: debate.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  return (
    <div className="p-4 flex justify-center items-center h-screen ">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">My Debates</h2>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Create New <MdOutlinePostAdd />
          </button>
        </div>
        <div className="bg-white/80">
          <div className="space-y-4 mt-4 max-h-[80vh] overflow-y-auto">
            {debates.length === 0 ? (
              <p className="text-1xl text-primary text-black">
                No debates available, create your first debate.....
              </p>
            ) : (
              debates.map((debate) => (
                <div
                  key={debate._id}
                  className={`relative p-6 rounded-lg shadow-md mb-6 ${
                    debate.isblocked
                      ? "bg-red-100 border-2 border-red-500"
                      : "bg-white"
                  }`}
                >
                  {debate.isblocked && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-red-200 text-red-700 font-semibold px-4 py-2 rounded">
                    Blocked
                  </div>
                  
                  )}
                  <p className="text-sm text-blue-700 font-semibold mt-1">
                    Posted on: {formatDate(debate.createdDate)}
                  </p>
                  <h4 className="font-semibold text-xl">
                    {debate.question}
                  </h4>
                  <div className="absolute top-4 right-4 m-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FaThumbsUp className="text-green-500 text-2xl" />
                      <p className="text-lg font-bold text-gray-700">{debate.totalVotes}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaHeart className="text-red-500 text-2xl" />
                      <p className="text-lg font-bold text-gray-700">{debate.likes}</p>
                    </div>
                  </div>
                  <ul className="mt-2">
                    {debate.options.map((option, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center space-x-4"
                      >
                        <span className="flex-grow">
                          {idx + 1}. {option.optionText}
                        </span>
                        <div className="flex items-center justify-center space-x-2">
                          <ImUsers size={24} />
                          <p>{debate.totalVotes ? option.votes : 0}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="my-6">
                    <p>Votes distribution:</p>
                    <div className="mb-6 flex justify-center w-[60%] mx-auto h-48">
                      <Bar data={chartData(debate)} options={{ responsive: true }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
