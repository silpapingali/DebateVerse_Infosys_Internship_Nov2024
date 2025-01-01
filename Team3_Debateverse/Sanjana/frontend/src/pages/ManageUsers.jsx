// ManageUsers.jsx
import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ModerateUser = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const popRef = useRef();

  const closePopup = (e) => {
    if (popRef.current === e.target) onClose();
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const fetchUserStatus = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/fetchuserstatus",
        { userEmail: email }
      );
      setUserStatus(res.data.status);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/fetchallusers");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Error fetching users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/blockuser",
        { userEmail: email }
      );
      setUserStatus("blocked");
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const activateUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/activateuser",
        { userEmail: email }
      );
      setUserStatus("active");
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={popRef}
      onClick={closePopup}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm bg-gray-400 flex justify-center items-center"
    >
      <div className="p-2 flex flex-col w-full max-w-md bg-white rounded">
        <button className="place-self-end" onClick={onClose}>
          <X size={30} />
        </button>
        <div className="m-10">
          <h1 className="text-2xl mb-5 font-bold text-center text-gray-700">
            Moderate User
          </h1>
          <form onSubmit={fetchUserStatus}>
            <input
              onChange={handleChange}
              type="email"
              required
              value={email}
              placeholder="Enter user email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4">
              <label className="font-bold text-gray-700">
                User Status: &nbsp;
                <span
                  className={`pt-1 ${
                    userStatus === "active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {userStatus || "Not fetched yet"}
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Check Status
            </button>
          </form>
          <div className="mt-4">
            <button
              onClick={blockUser}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Block User
            </button>
            <button
              onClick={activateUser}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Activate User
            </button>
          </div>
          <div className="mt-5">
            <button
              onClick={fetchAllUsers}
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Fetch All Users
            </button>
            {isLoading && <div>Loading...</div>}
            {users.length > 0 && (
              <ul className="mt-2">
                {users.map((user) => (
                  <li key={user._id}>{user.email}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerateUser;
