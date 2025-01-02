import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Signup from "./signup";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/Forgot-Password", { email })
      .then((result) => {
        if (result.data.Status === "Success") {
          navigate("/Login");
        }
      })

      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Forgot password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;
