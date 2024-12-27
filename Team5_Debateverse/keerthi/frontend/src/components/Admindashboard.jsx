import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admindashboard = () => {
  const { token } = useContext(store);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
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
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    console.log(filteredUsers)
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleUserClick = (userId) => {
    console.log(userId)
    console.log("Navigating to:", `/userdetails/${userId}`);
    navigate(`/userdetails/${userId}`); // Navigate to user details page with the user ID
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white/80">
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
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <p>No users found based on the search term.</p>
        ) : (
          filteredUsers.map((user, index) => {
            const { userId,totalDebates, totalLikes, totalVotes } = user;

            return (
              <div
                key={userId || index}
                className="relative bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300 cursor-pointer"
                onClick={() => handleUserClick(user.userId)} // Pass user._id to the handleUserClick function
              >
                <h4 className="font-semibold text-xl">{user.username}</h4>
                <p className="text-gray-500">Joined on {formatDate(user.createdDate)}</p>
                <div className="mt-4 flex flex-col items-start">
                  <p>Total Debates: {totalDebates}</p>
                  <div className="flex items-center mt-2">
                    <FaHeart className="text-red-500 mr-2" />
                    <p>Total Likes: {totalLikes}</p>
                  </div>
                  <p>Total Votes: {totalVotes}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Admindashboard;
