import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaXmark } from "react-icons/fa6";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (searchQuery = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/admin/fetchallusers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { searchQuery },
        }
      );

      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users !");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (index) => {
    console.log(users[index].email);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/blockuser",
        { userEmail: users[index].email }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      fetchUsers();
      setIsLoading(false);
    }
  };
  const activateUser = async (index) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/activateuser",
        { userEmail: users[index].email }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      fetchUsers();
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchQuery);
  };

  const handleCancelSearch=()=>{
    fetchUsers();
    setSearchQuery("");
  }

  return (
    <div className="pt-16 lg:px-72 p-3 min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
      <div>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            name="searchText"
            id="searchText"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-full rounded-lg bg-indigo-700 text-white"
            placeholder="Search Debates"
          />
          <button onClick={handleCancelSearch}>
            <FaXmark size={30} />
          </button>
          <button
            onClick={handleSearch}
            className="p-2 rounded-lg bg-emerald-500"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 bg-indigo-500 p-3 rounded-xl"
            >
              <span className="font-semibold text-white">
                {user.email.split("@")[0]}
              </span>
              {user.status === "blocked" ? (
                <button
                  onClick={() => {
                    activateUser(index);
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg"
                >
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => {
                    blockUser(index);
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg"
                >
                  Block
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsers;