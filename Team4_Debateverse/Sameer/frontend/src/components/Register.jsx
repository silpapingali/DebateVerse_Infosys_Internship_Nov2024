import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.username || !data.email || !data.password || !data.confirmpassword) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.email)) {
      setErrorMessage('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    if (data.password !== data.confirmpassword) {
      setErrorMessage('Passwords do not match.');
      setSuccessMessage('');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/register', data);

      setSuccessMessage('Registration successful! Please check your email for confirmation.');
      setErrorMessage('');
      setLoading(false);

      navigate('/registersuccess');
    } catch (error) {
      if (error.response?.data?.error === 'User Already Exist') {
        setErrorMessage('Email already exists. Please log in.');
      } else if (error.response?.data?.error === 'Passwords do not match') {
        setErrorMessage('Passwords do not match.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
      setLoading(false);
      setSuccessMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center bg-gray-900 text-gray-200">
      <div className="w-full max-w-sm mx-auto bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">Register</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="username">
              Name
            </label>
            <input
              type="text"
              onChange={changeHandler}
              name="username"
              id="username"
              placeholder="Your Name"
              value={data.username}
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              onChange={changeHandler}
              name="email"
              id="email"
              placeholder="Email Address"
              value={data.email}
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              onChange={changeHandler}
              name="password"
              id="password"
              placeholder="Password"
              value={data.password}
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              type="password"
              onChange={changeHandler}
              name="confirmpassword"
              id="confirmpassword"
              placeholder="Confirm Password"
              value={data.confirmpassword}
              className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm font-semibold mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm font-semibold mb-4">{successMessage}</p>
          )}
          {loading && (
            <p className="text-blue-400 text-sm font-semibold mb-4">Registering, please wait...</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-lg shadow-md disabled:opacity-50"
              disabled={loading}
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center font-medium mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
