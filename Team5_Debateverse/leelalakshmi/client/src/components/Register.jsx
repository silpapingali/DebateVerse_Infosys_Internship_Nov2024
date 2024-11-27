import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
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

    // Check if all fields are filled
    if (!data.email || !data.password || !data.confirmpassword) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.email)) {
      setErrorMessage('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    // Check if passwords match
    if (data.password !== data.confirmpassword) {
      setErrorMessage('Passwords do not match.');
      setSuccessMessage('');
      return;
    }

    setLoading(true); // Set loading state to true when the request starts
    try {
      const res = await axios.post('http://localhost:5000/register', data);

      // Display success message
      setSuccessMessage('Registration successful! Please check your email for confirmation.');
      setErrorMessage('');
      setLoading(false); // Reset loading state

      // Redirect to the success page after a delay (optional)
      navigate('/registersuccess');
    } catch (error) {
      // Handle errors based on the response from the backend
      if (error.response?.data?.error === 'User Already Exist') {
        console.log(error.response?.data?.error);
        setErrorMessage('Email already exists. Please log in.');
      } else if (error.response?.data?.error === 'Passwords do not match') {
        setErrorMessage('Passwords do not match.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
      setLoading(false); // Reset loading state
      setSuccessMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Register</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              onChange={changeHandler}
              name="email"
              id="email"
              placeholder="Email Address"
              value={data.email}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              onChange={changeHandler}
              name="password"
              id="password"
              placeholder="Password"
              value={data.password}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              onChange={changeHandler}
              name="confirmpassword"
              id="confirmpassword"
              placeholder="Confirm Password"
              value={data.confirmpassword}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-xs italic mb-4">{successMessage}</p>
          )}
          {loading && (
            <p className="text-blue-700 text-xs font-bold italic mb-4">Please wait...</p>
          )}
          <div>
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
              disabled={loading} // Disable the button while loading
            >
              Submit
            </button>
          </div>
        </form>
        <p className="align-baseline font-medium mt-4 mb-2 text-sm">
          Already have an account? Please{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
