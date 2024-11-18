import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setMessage("Invalid Email format.");
      return;
    }
  
    axios
      .post("http://localhost:3001/forgot-password", { email })
      .then((response) => {
        if (response.data.Status === "Success") {
          setMessage("Password reset link sent to your email.");
        } else {
          setMessage(response.data.Message || "An error occurred.");
        }
      })
      .catch((error) => {
        setMessage("Failed to send the reset link. Please try again. or Unable to reset password at this time. Please try again.");
      });
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-4 rounded w-25 shadow">
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          {message && <div className="text-info mb-3">{message}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
