import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";

const ModerateDebate = () => {
 
  const location = useLocation();
  const navigate = useNavigate();
  const debate = location.state?.debate;
  const role = localStorage.getItem("role");

  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(debate?.totalVotes || 0); 
  const [likes, setLikes] = useState(debate?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

useEffect(() => {
  if (!debate) {
    navigate("/userdashboard");
  } else {
    setVotes(new Array(debate.options.length).fill(0));

    const fetchDebateData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/alldebates/${debate._id}`,{
          headers:{
            
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
}, [debate, navigate]);


  const handleVote = (index, increment) => {
    if (increment > 10) return;

    const newVotes = [...votes];
    newVotes[index] = Math.max(0, newVotes[index] + increment); 

    const newTotalVotes = newVotes.reduce((a, b) => a + b, 0);

    if (newTotalVotes <= 10) {
      setVotes(newVotes);
      setTotalVotes(debate.totalVotes + newTotalVotes);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      setLikes((prevLikes) => prevLikes + 1);
      setLiked(true);
      try {
        await axios.post(`http://localhost:8081/reaction/${debate._id}`);
      } catch (error) {
        console.error("Error liking debate:", error);
      }
    }
  };

  

  const calculateBarWidth = (voteCount) => {
    const maxVote = Math.max(...votes, 1); 
    return (voteCount / maxVote) * 100;
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
        optionIndex: index,
        increment: voteCount,
      }));
  
      const response = await axios.post(
        `http://localhost:8081/upvote/${debate._id}`,
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
    setTotalVotes((prevTotalVotes) => prevTotalVotes - totalNewVotes); 
    setVotes(new Array(debate.options.length).fill(0));
  };
 
  
  const resetVotesDelay = () => {
    setTimeout(() => {
      setMessage("");
      resetVotes();
    }, 2000); 
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
          onClick={() => navigate(-1)}
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
            
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">{debate.question}</h2>
        <div className="mb-6">
          {debate.options.map((option, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center space-x-2">
                  <ImUsers size={24} />
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
        {message && (
          <p
            className={`text-center font-bold text-sm mt-4 ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </p>
        )}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex-grow-[8] h-40 bg-gray-300 px-4 py-2 rounded-lg shadow-md">
            <h1 className="text-center font-bold">Bar Graph</h1>
          </div>
          <button
            onClick={handleSubmitVotes}
            className="flex-grow-[2] h-40 px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg shadow-md hover:bg-yellow-500 ml-4"
          >
            {role === "admin" ? "Update" : "Vote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerateDebate;