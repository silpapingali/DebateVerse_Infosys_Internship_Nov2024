import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from '../App';
import { FaHeart, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModerateDebate = () => {
  const { token } = useContext(store);
  const location = useLocation();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(location.state?.debate || null);
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(debate?.totalVotes || 0); 
  const [likes, setLikes] = useState(debate?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!debate) {
      navigate("/debatesearch");
    } else {
      setVotes(new Array(debate.options.length).fill(0));

      const fetchDebateData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/debate/${debate._id}`,{
            headers:{
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
      setTotalVotes(debate.totalVotes + newTotalVotes);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      try {
        const response = await axios.post(
          `http://localhost:5000/like/${debate._id}`,
          {},
          {
            headers: {
              "x-token": token,
            },
          }
        );
        setLikes(response.data.likes);
        setLiked(true);
      } catch (error) {
        if (error.response?.data === "You have already liked for this debate.") {
          setMessage("Error: You have already liked for this debate.");
        } else {
          console.error("Error on likes:", error);
          setMessage("Error: Failed to like, Please try again.");
        }
      }
    } else {
      setMessage("Error: You have already liked");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };
  
  const handleDislike = async () => {
    if (liked || debate.likedBy.includes(username)) {
      try {
        const response = await axios.post(
          `http://localhost:5000/dislike/${debate._id}`,
          {},
          {
            headers: {
              "x-token": token,
            },
          }
        );
        setLikes(response.data.likes);
        setLiked(false);
      } catch (error) {
        console.error("Error disliking debate:", error);
      }
    } else {
      setMessage("Error: You have not liked this debate yet, so you cannot dislike it.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }  
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
    setTotalVotes((prevTotalVotes) => prevTotalVotes - totalNewVotes); 
    setVotes(new Array(debate.options.length).fill(0));
  };
 
  const resetVotesDelay = () => {
    setTimeout(() => {
      setMessage("");
      resetVotes();
    }, 2000); 
  };

  const handleDeleteDebate = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/debate/block/${debate._id}`, {}, {
        headers: { 'x-token': token },
      });
      alert(response.data.message);
      navigate("/debatesearch");
    } catch (error) {
      console.error("Error blocking debate:", error);
      alert("Error: Failed to block debate.");
    }
  };
  
  const handleDeleteOption = async (optionId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/debate/${debate._id}/option/${optionId}/remove`,
        {},
        { headers: { 'x-token': token } }
      );
      alert(response.data.message);
  
      const updatedOptions = debate.options.map((option) =>
        option._id === optionId ? { ...option, isremoved: true } : option
      );
      setDebate({ ...debate, options: updatedOptions });
    } catch (error) {
      console.error("Error removing option:", error);
      alert("Error: Failed to remove option.");
    }
  };
  


  if (!debate) return <p>Loading debate details...</p>;

  return (
    <div className="flex flex-col items-center bg-white/80 min-h-screen py-8 overflow-y-auto">
      <div className="relative w-full">
        {role === "admin" && (
          <button 
            onClick={handleDeleteDebate}
            className="absolute right-4 top-2 text-red-600 hover:text-red-700"
          >
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
            <button onClick={handleDislike}>
              <FaThumbsDown className="text-2xl inline-block mr-2 text-red" />
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">{debate.question}</h2>
        {message && (
          <p
            className={`text-center text-sm mt-4 ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </p>
        )}
        <div className="mb-6">
        {debate.options
  .filter((option) => !option.isremoved) // Filter only options where isremoved is false
  .map((option, index) => (
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
            <button
              onClick={() => handleDeleteOption(option._id)}
              className="ml-2 text-red-600 hover:text-red-700"
            >
              <RxCrossCircled size={24} />
            </button>
          )}
        </div>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={debate.options.map((opt, idx) => ({
                  name: idx + 1,
                  votes: opt.votes,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Options', position: 'bottom', offset: -10 }} />
                <YAxis label={{ value: 'Votes', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip />
                <Bar dataKey="votes" fill='#6a0dad' barSize={30} />
              </BarChart>
            </ResponsiveContainer>
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