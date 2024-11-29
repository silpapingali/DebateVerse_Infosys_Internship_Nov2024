import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { userId, token } = useParams(); // Extract userId and token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/reset-password/${userId}/${token}`,
        { password }
      );
      if (response.data.Status === "Success") {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(response.data.Message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error in reset password:", error);
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-4 rounded w-25 shadow">
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          {message && <div className="text-info mb-3">{message}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
