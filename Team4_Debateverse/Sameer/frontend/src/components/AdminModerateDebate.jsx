import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from '../App';
import { Heart, Users, XCircle, BarChart3, Shield } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminModerateDebate = () => {
  const { token } = useContext(store);
  const location = useLocation();
  const navigate = useNavigate();
  const debate = location.state?.debate;
  const role = localStorage.getItem("role");

  const [totalVotes, setTotalVotes] = useState(debate?.totalVotes || 0);
  const [likes, setLikes] = useState(debate?.likes || 0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!debate) {
      navigate("/debatesearch");
    } else {
      const fetchDebateData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/debate/${debate._id}`, {
            headers: {
              'x-token': token,
            },
          });
          const { totalVotes, likes } = response.data;
          setTotalVotes(totalVotes);
          setLikes(likes);
        } catch (error) {
          console.error("Error fetching debate data:", error);
          setMessage("Error loading debate data. Please try again.");
        }
      };
      fetchDebateData();
    }
  }, [token, debate, navigate]);

  const handleDeleteOption = async (debateId, optionId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/debate/${debateId}/option/${optionId}`, {
        headers: { 'x-token': token }
      });
      const updatedOptions = debate.options.filter(option => option._id !== optionId);
      debate.options = updatedOptions;
      setTotalVotes(debate.totalVotes - response.data.votes);
      setMessage("Option deleted successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting option:", error);
      setMessage("Error deleting option. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteDebate = async () => {
    if (window.confirm("Are you sure you want to block this debate?")) {
      try {
        await axios.patch(`http://localhost:5000/debate/${debate._id}`, {
          headers: { 'x-token': token },
        });
        setMessage("Debate blocked successfully.");
        setTimeout(() => navigate("/debatesearch"), 1500);
      } catch (error) {
        console.error("Error blocking debate:", error);
        setMessage("Error blocking debate. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const chartData = {
    labels: debate?.options.map(option => option.optionText),
    datasets: [
      {
        label: 'Vote Share (%)',
        data: debate?.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: 'rgba(56, 189, 248, 0.8)',
        borderWidth: 1,
      }
    ]
  };

  if (!debate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-slate-200">Loading debate details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="relative">
              <h1 className="text-2xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Moderate Debate
              </h1>
              
              {role === "admin" && (
                <button
                  onClick={handleDeleteDebate}
                  className="absolute top-0 right-0 flex items-center space-x-2 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300"
                >
                  <Shield className="w-4 h-4" />
                  <span>Block</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-slate-200 text-lg">{likes.toLocaleString()} Likes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-200 text-lg">{totalVotes.toLocaleString()} Votes</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-slate-200 text-center">{debate.question}</h2>

            <div className="space-y-3 mb-6">
              {debate.options.map((option, index) => (
                <div
                  key={option._id}
                  className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4"
                >
                  <span className="text-slate-200 text-lg">{option.optionText}</span>
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-200">{option.votes.toLocaleString()} Votes</span>
                    {role === "admin" && (
                      <button
                        onClick={() => handleDeleteOption(debate._id, option._id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <h3 className="text-slate-200">Vote Distribution</h3>
              </div>
              <div className="h-64">
                <Bar 
                  data={chartData} 
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

            {message && (
              <div className="mt-4 p-3 bg-white/[0.03] rounded-xl text-center">
                <p className={message.includes("Error") ? "text-red-400" : "text-green-400"}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModerateDebate;