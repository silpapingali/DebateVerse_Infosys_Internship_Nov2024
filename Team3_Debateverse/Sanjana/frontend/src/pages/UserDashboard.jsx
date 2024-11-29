import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import OptionField from "../components/OptionField";
import { format } from "date-fns";

const UserDashboard = () => {
  const { isAuth, userId, role, userDebates } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
      <h1 className="text-5xl text-center font-bold mb-4 text-white">User Dashboard</h1>
      <p className="text-xl text-center mb-8 text-white">Role: {role || "Guest"}</p>

      {/* Your Debates Section */}
      <div className="w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-white mb-4"> My Debates</h2>
        <button
          onClick={() => navigate("/create-debate")}
          className="absolute top-0 right-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Create New Debate
        </button>
        <div className="space-y-4 mt-8">
          {userDebates.map((debate) => (
            <div
              key={debate.id}
              className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{debate.title}</h3>
                <p className="text-gray-600">
                  {format(new Date(debate.date), "MMM dd, yyyy")} - {debate.likes} Likes
                </p>
              </div>
              <button
                onClick={() => alert("Going to the debate page")}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
              >
                View Debate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
