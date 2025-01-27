import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admindashboard = () => {
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
    console.log(users)
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
    const confirmUnblock = window.confirm("Are you sure you want to unblock this user and his debates?");
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
    <div className="flex flex-col md:flex-row h-screen ">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>

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
            max="1000"
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
            max="5000"
            step="5"
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
        {filteredUsers.length === 0 ? (
          <p>No users found based on the filters.</p>
        ) : (
          filteredUsers.map((user, index) => {
            const { userId, totalDebates, totalLikes, totalVotes, username, isblocked } = user;

            return (
              <div
                key={userId || index}
                className="relative bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  if (!isblocked){
                    handleUserClick(user.userId)}
                }}
              >
                <h4 className="font-semibold text-xl">{username}</h4>
                <p className="text-gray-500">Joined on {formatDate(user.createdDate)}</p>
                <div className="mt-4 flex flex-col items-start">
                  <p>Total Debates: {totalDebates}</p>
                  <div className="flex items-center mt-2">
                    <FaHeart className="text-red-500 mr-2" />
                    <p>Total Likes: {totalLikes}</p>
                  </div>
                  <p>Total Votes: {totalVotes}</p>
                </div>

                {isblocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnblockUser(userId);
                    }}
                    className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(userId);
                    }}
                  >
                    Block
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Admindashboard;
