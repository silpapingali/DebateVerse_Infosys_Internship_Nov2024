import React, { useContext, useEffect, useState } from "react";
import { Search, Heart, Shield, ShieldOff } from 'lucide-react';
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const { token } = useContext(store);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allusers", {
          headers: {
            "x-token": token,
          },
        });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        exactMatch
          ? user.username === searchTerm
          : user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (likesFilter > 0) {
      filtered = filtered.filter((user) => user.totalLikes > likesFilter);
    }

    if (votesFilter > 0) {
      filtered = filtered.filter((user) => user.totalVotes > votesFilter);
    }

    if (postedAfter) {
      const filterDate = new Date(postedAfter);
      filtered = filtered.filter((user) => new Date(user.createdDate) > filterDate);
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, likesFilter, votesFilter, postedAfter, exactMatch, users]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleUserClick = (userId) => {
    navigate(`/userdetails/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to block this user and their debates?");
    if (confirmDelete) {
      try {
        await axios.patch(
          `http://localhost:5000/blockuser/${userId}`,
          {},
          { headers: { "x-token": token } }
        );

        await axios.patch(
          `http://localhost:5000/blockuserdebates/${userId}`,
          {},
          { headers: { "x-token": token } }
        );

        setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));

        alert("User and their debates have been blocked.");
      } catch (err) {
        console.error("Error blocking user:", err);
        alert("An error occurred while blocking the user.");
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    const confirmUnblock = window.confirm("Are you sure you want to unblock this user and their debates?");
    if (confirmUnblock) {
      try {
        await axios.patch(
          `http://localhost:5000/unblockuser/${userId}`,
          {},
          { headers: { "x-token": token } }
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId ? { ...user, isBlocked: false } : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId ? { ...user, isBlocked: false } : user
          )
        );

        alert("User has been unblocked.");
      } catch (err) {
        console.error("Error unblocking user:", err);
        alert("An error occurred while unblocking the user.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <div className="w-full md:w-1/4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Filters</h2>
              
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-white/10 border border-white/20 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>

              {/* Exact Match */}
              <label className="flex items-center space-x-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={exactMatch}
                  onChange={() => setExactMatch(!exactMatch)}
                  className="rounded border-white/20 bg-white/10 text-blue-400 focus:ring-blue-400/50"
                />
                <span>Exact Match</span>
              </label>

              {/* Likes Filter */}
              <div>
                <label className="text-slate-200">Likes greater than:</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="1"
                  value={likesFilter}
                  onChange={(e) => setLikesFilter(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-400"
                />
                <p className="text-slate-400 text-sm mt-1">{likesFilter}+</p>
              </div>

              {/* Votes Filter */}
              <div>
                <label className="text-slate-200">Votes greater than:</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="5"
                  value={votesFilter}
                  onChange={(e) => setVotesFilter(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-400"
                />
                <p className="text-slate-400 text-sm mt-1">{votesFilter}+</p>
              </div>

              {/* Date Filter */}
              <div>
                <label className="text-slate-200">Posted After:</label>
                <input
                  type="date"
                  value={postedAfter}
                  onChange={(e) => setPostedAfter(e.target.value)}
                  className="w-full mt-2 bg-white/10 border border-white/20 rounded-xl p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1">
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-slate-200">No users found based on the filters.</p>
                </div>
              ) : (
                filteredUsers.map((user, index) => {
                  const { userId, totalDebates, totalLikes, totalVotes, username, isblocked } = user;

                  return (
                    <div
                      key={userId || index}
                      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 
                        ${!isblocked ? 'hover:bg-white/[0.08] cursor-pointer' : 'opacity-75'}`}
                      onClick={() => {
                        if (!isblocked) {
                          handleUserClick(user.userId);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-slate-200">{username}</h4>
                          <p className="text-slate-400 text-sm">Joined on {formatDate(user.createdDate)}</p>
                        </div>
                        
                        {isblocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnblockUser(userId);
                            }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300"
                          >
                            <ShieldOff className="w-4 h-4" />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(userId);
                            }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Block</span>
                          </button>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <p className="text-slate-400 text-sm">Total Debates</p>
                          <p className="text-slate-200 text-lg font-medium">{totalDebates}</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <p className="text-slate-400 text-sm">Total Likes</p>
                          </div>
                          <p className="text-slate-200 text-lg font-medium">{totalLikes}</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <p className="text-slate-400 text-sm">Total Votes</p>
                          <p className="text-slate-200 text-lg font-medium">{totalVotes}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;