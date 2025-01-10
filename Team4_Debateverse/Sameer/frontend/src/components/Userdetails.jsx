import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Users, Trash2, ThumbsUp, Shield, ShieldOff, BarChart3 } from 'lucide-react';
import { store } from "../App";
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDetails = () => {
  const { token } = useContext(store);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [debates, setDebates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/admindashboard");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/user/${id}`);
        setUser(userResponse.data);

        const debatesResponse = await axios.get(`http://localhost:5000/user/${id}/debates`);
        setDebates(debatesResponse.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const chartData = (debate) => {
    const totalVotes = debate.options.reduce((acc, option) => acc + option.votes, 0);
    return {
      labels: debate.options.map(option => option.optionText),
      datasets: [
        {
          label: 'Vote Share (%)',
          data: debate.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          borderColor: 'rgba(56, 189, 248, 0.8)',
          borderWidth: 1,
        }
      ]
    };
  };

  const deleteDebate = async (debateId) => {
    if (window.confirm("Are you sure you want to delete this debate?")) {
      try {
        await axios.delete(`http://localhost:5000/debate/${debateId}`);
        setDebates(debates.filter(debate => debate._id !== debateId));
      } catch (err) {
        console.error("Error deleting debate:", err);
      }
    }
  };

  const deleteOption = async (debateId, optionId) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      try {
        await axios.delete(`http://localhost:5000/debate/${debateId}/option/${optionId}`, {
          headers: { 'x-token': token }
        });
        setDebates(debates.map((debate) => {
          if (debate._id === debateId) {
            return {
              ...debate,
              options: debate.options.filter(option => option._id !== optionId)
            };
          }
          return debate;
        }));
      } catch (error) {
        console.error("Error deleting option:", error);
      }
    }
  };

  const unblockDebate = async (debateId) => {
    if (window.confirm("Are you sure you want to unblock this debate?")) {
      try {
        await axios.patch(
          `http://localhost:5000/${debateId}/unblock`,
          null,
          { headers: { "x-token": token } }
        );
        setDebates(prevDebates =>
          prevDebates.map(debate =>
            debate._id === debateId ? { ...debate, isblocked: false } : debate
          )
        );
      } catch (err) {
        console.error("Error unblocking debate:", err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-slate-200">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            {user.username}'s Profile
          </h2>
          <p className="text-slate-400">Joined on {formatDate(user.createdDate)}</p>
        </div>

        <div className="space-y-6">
          {debates.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-slate-200">No debates available</p>
            </div>
          ) : (
            debates.map((debate) => (
              <div
                key={debate._id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">{debate.question}</h3>
                    <p className="text-slate-400 text-sm">Posted on {formatDate(debate.createdDate)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5 text-green-400" />
                      <span className="text-slate-200">{debate.totalVotes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-slate-200">{debate.likes}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {debate.options.map((option, idx) => (
                    <div
                      key={option._id}
                      className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3"
                    >
                      <span className="text-slate-200">
                        {idx + 1}. {option.optionText}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-200">{option.votes}</span>
                        </div>
                        <button
                          onClick={() => deleteOption(debate._id, option._id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.03] rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                    <h4 className="text-slate-200">Vote Distribution</h4>
                  </div>
                  <div className="h-48">
                    <Bar 
                      data={chartData(debate)} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            labels: {
                              color: 'rgb(226, 232, 240)'
                            }
                          }
                        },
                        scales: {
                          y: {
                            ticks: { color: 'rgb(226, 232, 240)' }
                          },
                          x: {
                            ticks: { color: 'rgb(226, 232, 240)' }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {debate.isblocked ? (
                  <button
                    onClick={() => unblockDebate(debate._id)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300"
                  >
                    <ShieldOff className="w-4 h-4" />
                    <span>Unblock Debate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => deleteDebate(debate._id)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Block Debate</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;