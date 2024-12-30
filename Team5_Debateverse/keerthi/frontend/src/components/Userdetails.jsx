import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa6";
import { store } from "../App";
import { MdOutlinePostAdd } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { FaTrashAlt } from "react-icons/fa"; // Trash can icon for delete
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart from chart.js
import { FaThumbsUp } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Userdetails = () => {
  const { token, role } = useContext(store);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [debates, setDebates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/admindashboard"); // Redirect to admin dashboard if no userId is found
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://localhost:5000/user/${id}`);
        setUser(userResponse.data);

        // Fetch debates of the user
        const debatesResponse = await axios.get(`http://localhost:5000/user/${id}/debates`);
        setDebates(debatesResponse.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  if (!user) {
    return <p>Loading...</p>; // Display loading while fetching user details
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Get month as a number (1-12)
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const chartData = (debate) => {
    const totalVotes = debate.options.reduce((acc, option) => acc + option.votes, 0); // Calculate total votes
    return {
      labels: debate.options.map(option => option.optionText),
      datasets: [
        {
          label: 'Vote Share (%)',
          data: debate.options.map(option => (totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0)),  // Calculate vote share as a percentage
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Function to handle deleting a debate
  const deleteDebate = async (debateId) => {
    try {
      await axios.delete(`http://localhost:5000/debate/${debateId}`);
      // After deletion, filter out the deleted debate from the state
      setDebates(debates.filter(debate => debate._id !== debateId));
    } catch (err) {
      console.error("Error deleting debate:", err);
    }
  };

  // Function to handle deleting an option from a debate
  const deleteOption = async (debateId, optionId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/debate/${debateId}/option/${optionId}`, {
        headers: { 'x-token': token }
      });
      const updatedDebates = debates.map((debate) => {
        if (debate._id === debateId) {
          debate.options = debate.options.filter(option => option._id !== optionId);
        }
        return debate;
      });
      setDebates(updatedDebates);
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  // Function to unblock a debate
  const unblockDebate = (debateId) => {
    console.log(debateId)
    axios
      .patch(`http://localhost:5000/${debateId}/unblock`, null, {
        headers: { "x-token": token },
      })
      .then(() => {
        // Update the debate list after unblocking
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate._id === debateId ? { ...debate, isblocked: false } : debate
          )
        );
      })
      .catch((err) => console.error("Error unblocking debate:", err));
  };

  return (
    <div className="p-4 bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{user.username}'s Details</h2>
      <p className="mb-4">Joined on {new Date(user.createdDate).toLocaleDateString()}</p>

      <div className='bg-white/80'>
        <div className="space-y-4 mt-4 max-h-[80vh] overflow-y-auto">
          {debates.length === 0 ? (
            <p className="text-1xl text-primary text-black">No debates available, create your first debate.....</p>
          ) : (
            debates.map((debate) => (
              <div
                key={debate._id}
                className="relative bg-white p-6 rounded-lg shadow-md mb-6"
              >
                <p className="text-sm text-blue-700 font-semibold mt-1">
                  Posted on: {formatDate(debate.createdDate)}
                </p>
                <h4 className="font-semibold text-xl">{debate.question}</h4>

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
                      key={option._id}
                      className="flex justify-between items-center space-x-4"
                    >
                      <span className="flex-grow">{idx + 1}. {option.optionText}</span>
                      <div className="flex items-center justify-center space-x-2">
                        <ImUsers size={24} />
                        <p>{debate.totalVotes ? option.votes : 0}</p>

                        {/* Button to delete option with a trash can icon */}
                        <button
                          onClick={() => deleteOption(debate._id, option._id)}
                          className="text-red-500 text-xl hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
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
                {debate.isblocked ? (
                  <button
                    onClick={() => unblockDebate(debate._id)}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  >
                    Unblock Debate
                  </button>
                ) : (
                  <button
                    onClick={() => deleteDebate(debate._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 mt-2"
                  >
                    Delete Debate
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

export default Userdetails;
