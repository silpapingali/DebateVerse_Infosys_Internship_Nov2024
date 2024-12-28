import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const DebatesSearch = () => {
  const { token } = useContext(store);
  const [debates, setDebates] = useState([]);
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likesFilter, setLikesFilter] = useState(0);
  const [votesFilter, setVotesFilter] = useState(0);
  const [postedAfter, setPostedAfter] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

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
        const unblockedDebates = res.data.filter((debate) => !debate.isblocked);
        setDebates(unblockedDebates);
        setFilteredDebates(unblockedDebates);
      })
      .catch((err) => console.error("Error fetching debates:", err));
  }, [token, navigate]);
  

  const filterDebates = () => {
    let filtered = [...debates]; 

    if (searchTerm) {
      filtered = filtered.filter((debate) =>
        exactMatch
          ? debate.question === searchTerm
          : debate.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (likesFilter > 0) {
      filtered = filtered.filter((debate) => {
        const likes = debate.likes || 0;
        return likes >= likesFilter;
      });
    }

    if (votesFilter > 0) {
      filtered = filtered.filter((debate) => {
        const votes = debate.totalVotes || 0; 
        return votes >= votesFilter;
      });
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
    if (debate.isblocked) {
      alert("This debate is blocked and cannot be accessed.");
    } else {
      navigate("/moderatedebate", { state: { debate } });
    }
  };

  const handleBackToDashboard = () => {
    // Redirect based on role
    if (role === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/userdashboard");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white/80">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        <button
          onClick={handleBackToDashboard}
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
            step="1"
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
            step="2"
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
          <p>No debates match the applied filters, or the debate might have been removed by the Admin.</p>
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
              <div className="key={debate._id} absolute top-3 right-4 w-1/4">
              <ResponsiveContainer width="100%" height={150}>
        <BarChart
          data={debate.options?.map((opt, idx) => ({
            name: `Option ${idx + 1}`,  
            votes: opt.votes || 0,     
          }))}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <XAxis dataKey="name" tick={false} />
          <YAxis tick={false} />
          <Bar dataKey="votes" fill="#6a0dad" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebatesSearch;
