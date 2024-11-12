import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData]= useState({
    email:'',
    password:''
  })
  const handleChange=(e)=>{
    setLoginData(
      {
        ...loginData,
        [e.target.name]: e.target.value
      }
    )
  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    console.log(loginData);
    const response= await axios.post("http://localhost:3000/api/auth/login",
    loginData
    )
  }
  
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
              name='email'
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
              name='password'
              value={loginData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;