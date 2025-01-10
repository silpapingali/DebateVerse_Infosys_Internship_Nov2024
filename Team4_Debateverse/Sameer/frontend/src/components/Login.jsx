import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setRole, setUsername } = useContext(store);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      setErrorMessage("Invalid email format");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/login", data);
      setToken(res.data.token);
      setRole(res.data.role);
      setUsername(res.data.username || "User");
      if (res.data.role === "admin") navigate("/admindashboard");
      else navigate("/userdashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
          <h2 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={changeHandler}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={changeHandler}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <p className="text-sm text-center text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
            <p className="text-sm text-center text-slate-400">
              Forgot your password?{" "}
              <Link
                to="/passwordcorrect"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Reset it here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;