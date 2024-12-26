import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from '../App';
import { FaHeart, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { Bar } from 'react-chartjs-2'; // Import the Bar chart from chart.js

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModerateDebate = () => {
  const { token } = useContext(store);
  const location = useLocation();
  const navigate = useNavigate();
  const debate = location.state?.debate;
  const role = localStorage.getItem("role");

  const [votes, setVotes] = useState(new Array(debate?.options.length).fill(0));
  const [totalVotes, setTotalVotes] = useState(debate?.totalVotes || 0); 
  const [likes, setLikes] = useState(debate?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

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

  const handleVote = (index, increment) => {
    if (increment > 10) return;

    const newVotes = [...votes];
    newVotes[index] = Math.max(0, newVotes[index] + increment);

    const newTotalVotes = newVotes.reduce((a, b) => a + b, 0);
    if (newTotalVotes <= 10) {
      setVotes(newVotes);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      setLikes((prevLikes) => prevLikes + 1);
      setLiked(true);
      try {
        await axios.post(`http://localhost:5000/like/${debate._id}`, {}, {
          headers: { 'x-token': token }
        });
      } catch (error) {
        console.error("Error liking debate:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (liked) {
      setLikes((prevLikes) => prevLikes - 1);
      setLiked(false);
      try {
        await axios.post(`http://localhost:5000/dislike/${debate._id}`, {}, {
          headers: { 'x-token': token }
        });
      } catch (error) {
        console.error("Error disliking debate:", error);
      }
    }
  };

  const calculateBarWidth = (voteCount) => {
    const maxVote = totalVotes > 0 ? totalVotes : 1; // Ensure we don't divide by zero
    return (voteCount / maxVote) * 100; // Return width as a percentage of totalVotes
  };

  const handleSubmitVotes = async () => {
    if (hasVoted) {
      setMessage("Error: You have already voted.");
      resetVotesDelay();
      return;
    }

    if (votes.every((vote) => vote === 0)) {
      setMessage("Error: You must vote for at least one option.");
      resetVotesDelay();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Error: Authentication required.");
      resetVotesDelay();
      return;
    }

    try {
      const voteData = votes.map((voteCount, index) => ({
        optionId: index,
        voteCount: voteCount,
      }));
      
      const response = await axios.post(
        `http://localhost:5000/vote/${debate._id}`,
        { votes: voteData },
        {
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        }
      );

      const { totalVotes } = response.data;
      setTotalVotes(totalVotes);
      setHasVoted(true);
      setMessage("Success: Your votes have been recorded.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      if (error.response?.data === "You have already voted for this debate.") {
        setMessage("Error: You have already voted for this debate.");
      } else {
        console.error("Error submitting votes:", error);
        setMessage("Error: Failed to record votes. Please try again.");
      }

      resetVotesDelay();
    }
  };

  const resetVotes = () => {
    const totalNewVotes = votes.reduce((a, b) => a + b, 0);
    setTotalVotes((prevTotalVotes) => prevTotalVotes + totalNewVotes);
    setVotes(new Array(debate.options.length).fill(0));
  };

  const resetVotesDelay = () => {
    setTimeout(() => {
      setMessage("");
      resetVotes();
    }, 500);
  };

  const handleGoBack = () => {
    if (debate) {
      navigate("/debatesearch");
    } else {
      navigate(-1);
    }
  };

  // Chart Data - Calculate percentage for voting data
  const chartData = {
    labels: debate?.options.map(option => option.optionText),
    datasets: [
      {
        label: 'Vote Share (%)',
        data: debate?.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),  // Calculate vote share as a percentage
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  if (!debate) return <p>Loading debate details...</p>;

  return (
    <div className="flex flex-col items-center bg-white/80 min-h-screen py-8 overflow-y-auto">
      <div className="relative w-full">
        {role === "admin" && (
          <button className="absolute right-4 top-2 text-red-600 hover:text-red-700">
            <RxCrossCircled size={24} />
          </button>
        )}
        <button
          onClick={handleGoBack}
          className="absolute left-4 top-2 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
        >
          Go Back
        </button>
      </div>
      <div className="w-11/12 md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
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
          <div className="flex items-center">
            <button onClick={handleLike}>
              <FaThumbsUp className="text-green-500 text-2xl inline-block mr-2" />
            </button>
            <button onClick={handleDislike}>
              <FaThumbsDown className="text-2xl inline-block mr-2 text-red" />
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">{debate.question}</h2>

        <div className="mb-6">
          {debate.options.map((option, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center space-x-2">
                  {option.votes}<ImUsers size={24} />
                  {index + 1}. {option.optionText}
                </span>
                <div className="flex items-center">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                    onClick={() => handleVote(index, 1)}
                  >
                    +
                  </button>
                  <span>{votes[index]}</span>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded-md ml-2"
                    onClick={() => handleVote(index, -1)}
                  >
                    -
                  </button>
                  {role === "admin" && (
                    <button className="ml-2 text-red-600 hover:text-red-700">
                      <RxCrossCircled size={24} />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${calculateBarWidth(votes[index])}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        {/* Bar Chart */}
        <div className="mb-6">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
        <button
          onClick={handleSubmitVotes}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          Submit Votes
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ModerateDebate;
