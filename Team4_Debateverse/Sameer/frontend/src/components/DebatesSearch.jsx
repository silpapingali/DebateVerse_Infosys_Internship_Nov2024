import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart, FaThumbsUp } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Import the Bar chart

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DebatesSearch = () => {
  const { token, role } = useContext(store);
  const [debates, setDebates] = useState([]);
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likesFilter, setLikesFilter] = useState(0);
  const [votesFilter, setVotesFilter] = useState(0);
  const [postedAfter, setPostedAfter] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/alldebates", {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        const sortedDebates = res.data.debates.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setDebates(sortedDebates);
        setFilteredDebates(sortedDebates);
      })
      .catch((err) => console.error("Error fetching debates:", err));
  }, [token, navigate]);

  const filterDebates = () => {
    let filtered = [...debates];

    if (role === "user") {
      filtered = filtered.filter((debate) => debate.isblocked !== true);
    }

    if (searchTerm) {
      filtered = filtered.filter((debate) =>
        exactMatch
          ? debate.question === searchTerm
          : debate.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (likesFilter > 0) {
      filtered = filtered.filter((debate) => debate.likes > likesFilter);
    }

    if (votesFilter > 0) {
      filtered = filtered.filter((debate) => debate.totalVotes > votesFilter);
    }

    if (postedAfter) {
      const filterDate = new Date(postedAfter);
      filtered = filtered.filter((debate) => new Date(debate.createdDate) > filterDate);
    }

    setFilteredDebates(filtered);
  };

  useEffect(() => {
    filterDebates();
  }, [searchTerm, likesFilter, votesFilter, postedAfter, exactMatch, debates]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleDebateClick = (debate) => {
    if (role === "admin") {
      navigate("/adminmoderatedebate", { state: { debate } });
    } else {
      navigate("/moderatedebate", { state: { debate } });
    }
  };

  const handleUnblock = (debateId) => {
    axios
      .patch(`http://localhost:5000/${debateId}/unblock`, null, {
        headers: { "x-token": token },
      })
      .then(() => {
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate._id === debateId ? { ...debate, isblocked: false } : debate
          )
        );
      })
      .catch((err) => console.error("Error unblocking debate:", err));
  };

  const getBarChartData = (debate) => ({
    labels: debate.options.map((_, index) => `Option ${index + 1}`),
    datasets: [
      {
        label: "Votes",
        data: debate.options.map((option) => option.votes || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <div className="w-full md:w-1/4 p-4 bg-white/10 backdrop-blur-sm shadow-lg rounded-2xl">
        <button
          onClick={() => navigate("/userdashboard")}
          className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-300 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-200"
        >
          Back to Dashboard
        </button>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={() => setExactMatch(!exactMatch)}
              className="mr-2 accent-cyan-400"
            />
            Exact Match
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Likes greater than:</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={likesFilter}
            onChange={(e) => setLikesFilter(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm mt-2">{likesFilter}+</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Votes greater than:</label>
          <input
            type="range"
            min="0"
            max="5000"
            step="5"
            value={votesFilter}
            onChange={(e) => setVotesFilter(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm mt-2">{votesFilter}+</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Posted After:</label>
          <input
            type="date"
            value={postedAfter}
            onChange={(e) => setPostedAfter(e.target.value)}
            className="w-full bg-white/10 p-2 rounded-lg"
          />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white/10 rounded-lg shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-200"
          />
          <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>
        {filteredDebates.length === 0 ? (
          <p className="text-slate-400">No debates found based on the filters.</p>
        ) : (
          filteredDebates.map((debate) => (
            <div
              key={debate._id}
              className="relative bg-white/10 p-4 rounded-2xl shadow-lg mb-4 backdrop-blur-sm hover:scale-105 transition duration-200"
              onClick={() => {
                if (!debate.isblocked) {
                  handleDebateClick(debate);
                }
              }}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
                    {debate.question}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Posted by {debate.createdBy} on {formatDate(debate.createdDate)}
                  </p>
                  {role === "admin" && debate.isblocked === true && (
                    <button
                      onClick={() => handleUnblock(debate._id)}
                      className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                    >
                      Unblock
                    </button>
                  )}
                  <div className="flex space-x-4 mt-4">
                    <div className="flex items-center">
                      <FaHeart className="text-red-500 mr-2" />
                      <p>{debate.likes || 0} Likes</p>
                    </div>
                    <div className="flex items-center">
                      <FaThumbsUp className="text-green-500 mr-2" />
                      <p>{debate.totalVotes || 0} Votes</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 w-80 h-48">
                  <Bar data={getBarChartData(debate)} options={chartOptions} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebatesSearch;
