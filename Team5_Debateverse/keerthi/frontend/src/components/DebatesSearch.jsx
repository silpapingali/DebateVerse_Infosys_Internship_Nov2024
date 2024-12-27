import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DebatesSearch = () => {
  const { token } = useContext(store);
  const [debates, setDebates] = useState([]);
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likesFilter, setLikesFilter] = useState(0);
  const [votesFilter, setVotesFilter] = useState(0);
  const [postedAfter, setPostedAfter] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  const [userId, setUserId] = useState(null);
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
        const filteredDebates = res.data.debates;
        console.log(filteredDebates) // Filter out the user's own debates
        setDebates(filteredDebates);
        setFilteredDebates(filteredDebates);
      })
      .catch((err) => console.error("Error fetching debates:", err));
  }, [token, navigate, userId]);

  const filterDebates = () => {
    let filtered = debates;

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
      filtered = filtered.filter((debate) =>
        debate.votes ? debate.votes.reduce((a, b) => a + b, 0) > votesFilter : false
      );
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
    navigate("/moderatedebate", { state: { debate } }); 
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white/80">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        <button
          onClick={() => navigate("/userdashboard")}
          className="mb-6 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
        >
          Back to Dashboard
        </button>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={() => setExactMatch(!exactMatch)}
              className="mr-2"
            />
            Exact Match
          </label>
        </div>
        <div className="mb-4">
          <label>Likes greater than:</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={likesFilter}
            onChange={(e) => setLikesFilter(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p>{likesFilter}+</p>
        </div>
        <div className="mb-4">
          <label>Votes greater than:</label>
          <input
            type="range"
            min="0"
            max="25000"
            step="1000"
            value={votesFilter}
            onChange={(e) => setVotesFilter(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p>{votesFilter}+</p>
        </div>
        <div className="mb-4">
          <label>Posted After:</label>
          <input
            type="date"
            value={postedAfter}
            onChange={(e) => setPostedAfter(e.target.value)}
            className="w-full mt-2"
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
            className="w-full py-2 pl-10 pr-4 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>
        {filteredDebates.length === 0 ? (
          <p>No debates found based on the filters.</p>
        ) : (
          filteredDebates.map((debate) => (
            <div
              key={debate._id}
              className="relative bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300 cursor-pointer"
              onClick={() => handleDebateClick(debate)}
            >
              <h4 className="font-semibold text-xl">{debate.question}</h4>
              <p className="text-gray-500">
                Posted by {debate.createdBy} on {formatDate(debate.createdDate)}
              </p>
              <div className="mt-4 flex items-center">
                <FaHeart className="text-red-500 mr-2" />
                <p>{debate.likes || 0} Likes</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebatesSearch;
