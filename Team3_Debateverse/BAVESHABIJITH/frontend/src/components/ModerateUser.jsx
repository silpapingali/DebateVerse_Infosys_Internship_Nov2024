import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ModerateUser = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const popRef = useRef();

  const closePopup = (e) => {
    if (popRef.current == e.target) onClose();
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
  
  const blockUser = async (e) => {
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
  }
  const activateUser = async (e) => {
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
  }

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
                  {userStatus}
                </span>
              </label>
              {userStatus && (
                <button
                  onClick={userStatus === "active" ? blockUser : activateUser}
                  className={`w-full px-4 py-2 mt-4 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none ${
                    isLoading
                      ? "bg-gray-400"
                      : userStatus === "active"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700" 
                  }`}
                >
                  {
                    isLoading
                      ? "Fetching..."
                      : userStatus === "active"
                      ? "Block User" 
                      : "Activate User"
                  }
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 mt-4 text-sm font-medium text-white ${
                isLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }  border border-transparent rounded-md shadow-sm focus:outline-none`}
            >
              {isLoading ? "Fetching..." : "Fetch User Status"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModerateUser;