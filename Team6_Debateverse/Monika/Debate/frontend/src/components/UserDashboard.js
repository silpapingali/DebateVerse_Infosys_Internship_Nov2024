import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./UserDashboard.css";
import DebateCard from "./DebateCard";

const UserDashboard = () => {
  const [debates, setDebates] = useState([]); // List of all debates
  const [recentDebates, setRecentDebates] = useState([]); // List of recent debates
  const [searchTerm, setSearchTerm] = useState(""); // Search query
  const [exactMatch, setExactMatch] = useState(false); // Exact match toggle

  // Fetch all debates from the backend
  const fetchAllDebates = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/debate/alldebates");
      const allDebates = response.data;

      // Set all debates and extract the 3 most recent ones
      setDebates(allDebates);
      setRecentDebates(allDebates.slice(0, 3)); // Assuming the debates are sorted by creation date in descending order
    } catch (error) {
      console.error("Error fetching debates:", error);
    }
  };

  // Search debates by name, ID, or keyword
  const searchDebates = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/debate/searchDebate", {
        params: {
          query: searchTerm,
          exactMatch: exactMatch,
        },
      });
      setDebates(response.data);
    } catch (error) {
      console.error("Error searching debates:", error);
    }
  };

  // Fetch all debates on component mount
  useEffect(() => {
    fetchAllDebates();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="user-dashboard">
        <h1 className="text-center text-3xl my-4">DebateHub</h1>

        {/* Search Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-3/4">
            <input
              type="text"
              placeholder="Search debates by name, ID, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none"
            />
            <button
              onClick={searchDebates}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
              <FaSearch />
            </button>
          </div>

          {/* Exact Match Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exactMatch"
              checked={exactMatch}
              onChange={() => setExactMatch(!exactMatch)}
            />
            <label htmlFor="exactMatch" className="text-sm font-medium">
              Exact Match
            </label>
          </div>
        </div>

       {/* Recent Debates List */}
<div className="recent-debates mt-6">
  <h2 className="text-2xl font-semibold mb-3">Recent Debates</h2>
  {recentDebates.length > 0 ? (
    recentDebates.map((debate, index) => (
      <DebateCard
        key={debate.id}
        debate={debate}
        liked={debate.liked}
        Qno={index + 1}
        isMine={debate.isMine}
      />
    ))
  ) : (
    <p className="text-center mt-4">No recent debates available.</p>
  )}
</div>



        {/* See All Button */}
        <div className="flex justify-center mt-6">
          <Link to="/debatelist" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            See All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
