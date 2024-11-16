import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Resetpopup from '../components/Resetpopup';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [showResetPopup, setShowResetPopup] = useState(false); // State to manage the visibility of the ResetPopup

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', loginData);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token); 
        toast.success(res.data.message);
        navigate('/'); 
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.inputerrors) {
        err.response.data.inputerrors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || 'Error! Please try again');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
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
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              required
              value={loginData.password}
              onChange={handleChange}
            />
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
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-500 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
      {showResetPopup && <Resetpopup onClose={() => setShowResetPopup(false)} />}
    </div>
  );
};

export default Login;