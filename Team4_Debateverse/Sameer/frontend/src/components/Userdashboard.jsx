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

const UserDashboard = () => {
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
        setData(response.data.message);

        const debatesResponse = await axios.get('http://localhost:5000/debates', {
          headers: { 'x-token': token },
        });

        const sortedDebates = debatesResponse.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setDebates(sortedDebates);
      } catch (err) {
        if (err.response?.status === 401) {
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
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 0.8)',
          borderWidth: 1,
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              My Debates
            </h2>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <MdOutlinePostAdd className="text-xl" />
              Create New Debate
            </button>
          </div>

          <div className="space-y-6 max-h-[75vh] overflow-y-auto px-2">
            {debates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-300 text-lg">
                  No debates available. Start by creating your first debate!
                </p>
              </div>
            ) : (
              debates.map((debate) => (
                <div
                  key={debate._id}
                  className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border ${
                    debate.isblocked
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-white/10"
                  }`}
                >
                  {debate.isblocked && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center backdrop-blur-sm bg-red-500/10">
                      <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg">
                        <AlertCircle className="text-red-400" />
                        <span className="text-red-400 font-semibold">Blocked</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-blue-400 text-sm mb-2">
                        Posted on: {formatDate(debate.createdDate)}
                      </p>
                      <h3 className="text-xl font-semibold text-slate-200">
                        {debate.question}
                      </h3>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <FaThumbsUp className="text-emerald-400" />
                        <span className="text-slate-300">{debate.totalVotes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-rose-400" />
                        <span className="text-slate-300">{debate.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {debate.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/5"
                      >
                        <span className="text-slate-300">
                          {idx + 1}. {option.optionText}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400">
                          <ImUsers />
                          <span>{debate.totalVotes ? option.votes : 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-slate-300 mb-4">Vote Distribution</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <Bar 
                        data={chartData(debate)} 
                        options={{ 
                          responsive: true,
                          plugins: {
                            legend: {
                              labels: {
                                color: 'rgb(148, 163, 184)'
                              }
                            }
                          },
                          scales: {
                            y: {
                              ticks: { color: 'rgb(148, 163, 184)' },
                              grid: { color: 'rgba(148, 163, 184, 0.1)' }
                            },
                            x: {
                              ticks: { color: 'rgb(148, 163, 184)' },
                              grid: { color: 'rgba(148, 163, 184, 0.1)' }
                            }
                          }
                        }}
                      />
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

export default UserDashboard;