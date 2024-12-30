import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from '../App';
import { FaHeart } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required chart components
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
      setTotalVotes(debate.totalVotes - response.data.votes); // Assuming response contains the deleted option's votes
      setMessage("Option deleted successfully.");
    } catch (error) {
      console.error("Error deleting option:", error);
      setMessage("Error deleting option. Please try again.");
    }
  };

  const handleDeleteDebate = async () => {
    try {
      await axios.patch(`http://localhost:5000/debate/${debate._id}`, {
        headers: { 'x-token': token },
      });
      setMessage("Debate deleted successfully.");
      navigate("/debatesearch");
    } catch (error) {
      console.error("Error deleting debate:", error);
      setMessage("Error deleting debate. Please try again.");
    }
  };

  const chartData = {
    labels: debate?.options.map(option => option.optionText),
    datasets: [
      {
        label: 'Vote Share (%)',
        data: debate?.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  if (!debate) return <p>Loading debate details...</p>;

  return (
    <div className="flex items-center justify-center  min-h-screen py-8 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <div className="relative w-full">
          {role === "admin" && (
            <button className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
            onClick={handleDeleteDebate}>
              Block
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Moderate Debate</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaHeart className="text-red-500 text-2xl mr-2" />
            <span className="text-lg font-semibold">{likes.toLocaleString()} Likes</span>
          </div>
          <div className="flex items-center">
            <ImUsers size={24} />
            <span className="text-lg font-semibold">{totalVotes.toLocaleString()}</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">{debate.question}</h2>

        <div className="mb-6">
          {debate.options.map((option, index) => (
            <div key={option._id} className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-lg">{option.optionText}</p>
              </div>
              {role === "admin" && (
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteOption(debate._id, option._id)} // Pass debateId and optionId
                >
                  <RxCrossCircled size={20} />
                </button>
              )}
              <div className="flex items-center">
                <span className="text-lg font-semibold">{option.votes.toLocaleString()} Votes</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>

        {message && <div className="mt-2 text-center text-red-500">{message}</div>}
      </div>
    </div>
  );
};

export default AdminModerateDebate;
