import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import ResetPopup from "../components/ResetPopup";
import { UserContext } from "../context/UserContext";

const Login = () => {

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuth, setRole } = useContext(UserContext);
  const [params] = useSearchParams();
  const status = params.get("status");

  if (status) {
    status == "true"
      ? toast.success("Congratulations! You are Verified Please login")
      : toast.error("Invalid URL ! Login to receive verification link again");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginData.password.length < 6) {
      toast.error("Password must be at least 6 characters long !");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        loginData
      );
      localStorage.setItem("token", res.data.token);
      setIsAuth(true);
      setRole(res.data.role);
      toast.success(res.data.message);
      res.data.role == "user"
        ? navigate("/userdashboard")
        : navigate("/admindashboard");
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.inputerrors) {
        err.response.data.inputerrors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Error! Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              required
              value={loginData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              name="password"
              required
              value={loginData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-11 right-1 flex items-center px-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowResetPopup(true)}
              className="text-sm text-indigo-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-500 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
      {showResetPopup && (
        <ResetPopup onClose={() => setShowResetPopup(false)} />
      )}
    </div>
  );
};

export default Login;
