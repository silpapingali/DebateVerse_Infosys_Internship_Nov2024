import React, { useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const UserDashboard = () => {
  const { isAuth, role, userDebates } = useContext(UserContext);
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

      <div className="relative w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4">My Debates</h2>

        {/* Create New Debate Button */}
        <button
          onClick={() => navigate("/create-debate")}
          className="absolute top-0 right-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-transform"
        >
          Create New Debate
        </button>

        {/* Debates List */}
        <div className="space-y-4 mt-8">
          {userDebates.map((debate) => (
            <div
              key={debate.id}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-2"
            >
              {/* Date and Title */}
              <p className="text-gray-500 text-sm">
                Asked on {format(new Date(debate.date), "MMM dd, yyyy")}
              </p>
              <h3 className="text-xl font-semibold">{debate.title}</h3>

              {/* Options */}
              <div className="space-y-2">
                {debate.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span className="text-gray-800">{option}</span>
                    <div className="flex space-x-4 items-center">
                      <button className="hover:scale-110 transition-transform">
                        <span role="img" aria-label="like">👍</span>
                      </button>
                      <button className="hover:scale-110 transition-transform">
                        <span role="img" aria-label="comment">💬</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
