import { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { store } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admindashboard = () => {
  const { token } = useContext(store);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [votesFilter, setVotesFilter] = useState(0);
  const [debatesFilter, setDebatesFilter] = useState(0);
  const [joinedAfter, setJoinedAfter] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  const [popupUser, setPopupUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role=localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/allusers", {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
        setFilteredUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user role:", err);
        setLoading(false);
        navigate("/login");
      });
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

    if (votesFilter > 0) {
      filtered = filtered.filter((user) => user.totalVotes > votesFilter);
    }

    if (debatesFilter > 0) {
      filtered = filtered.filter((user) => user.totalDebatesCreated > debatesFilter);
    }

    if (joinedAfter) {
      const filterDate = new Date(joinedAfter);
      filtered = filtered.filter((user) => new Date(user.joinedDate) > filterDate);
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, votesFilter, debatesFilter, joinedAfter, exactMatch, users]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };


const toggleBlockStatus = (userId, isBlocked) => {
  axios
    .put(
      `http://localhost:5000/blockuser/${userId}`,
      { isblocked: !isBlocked },
      {
        headers: {
          "x-token": token,
        },
      }
    )
    .then((response) => {
      const updatedUser = response.data.user;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      setPopupUser(null); 
    })
    .catch((err) => console.error("Error updating block status:", err));
};


  const openPopup = (user) => {
    setPopupUser(user);
  };

  const closePopup = () => {
    setPopupUser(null);
  };

  const getUserClass = (isBlocked) => {
    return isBlocked ? "bg-red-100 border-red-500" : "";
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  if (role !== "admin") {
    return (
      <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-3xl mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p className='text-xl font-semibold mb-4 text-center text-red-600'>Access Denied admin Only

              </p>
            </div>
    </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white/80">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
        >
          Back
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
          <label>Votes greater than:</label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1"
            value={votesFilter}
            onChange={(e) => setVotesFilter(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p>{votesFilter}+</p>
        </div>
        <div className="mb-4">
          <label>Debates created greater than:</label>
          <input
            type="range"
            min="0"
            max="500"
            step="1"
            value={debatesFilter}
            onChange={(e) => setDebatesFilter(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p>{debatesFilter}+</p>
        </div>
        <div className="mb-4">
          <label>Joined After:</label>
          <input
            type="date"
            value={joinedAfter}
            onChange={(e) => setJoinedAfter(e.target.value)}
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
        {filteredUsers.length === 0 ? (
          <p>No users found based on the filters.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`relative bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer border-2 ${getUserClass(user.isblocked)}`}
            >
              <h4 className="font-semibold text-lg">{user.username}</h4>
              <p className="text-gray-500">
                {user.totalDebatesCreated} debates | {user.totalVotes} votes | Joined{" "}
                {formatDate(user.joinedDate)}
              </p>
              <FaEdit
                className="absolute right-4 top-4 text-gray-600 hover:text-blue-500 cursor-pointer"
                onClick={() => openPopup(user)}
              />
            </div>
          ))
        )}
      </div>

      {popupUser && (
        <div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/50"
          onClick={closePopup}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">{popupUser.isblocked ? "Unblock" : "Block"} User</h3>
            <p>
              Are you sure you want to {popupUser.isblocked ? "unblock" : "block"}{" "}
              {popupUser.username}?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 ${popupUser.isblocked ? "bg-green-500" : "bg-red-500"} text-white rounded-lg`}
                onClick={() => toggleBlockStatus(popupUser._id, popupUser.isblocked)}
              >
                {popupUser.isblocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admindashboard;
