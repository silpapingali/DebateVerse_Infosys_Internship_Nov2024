import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
        confirmpassword: ''
    });

    const [errorMessage, setErrorMessage] = useState(''); // To display backend errors
    const [successMessage, setSuccessMessage] = useState(''); // To display success feedback

    // Handle input changes
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();
        // Basic validation
        if (data.password !== data.confirmpassword) {
            setErrorMessage('Passwords do not match.');
            setSuccessMessage('');
            return;
        }

        try {
          const res = await axios.post('http://localhost:5000/register', data);
          alert('Registration successful! Please log in.');
          navigate('/login'); // Redirect to login on success
      } catch (error) {
          // Handle backend error for existing email
          if (error.response?.data?.error === 'User Already Exist') {
              setErrorMessage('Email already exists. Please log in.');
          } else {
              setErrorMessage('Registration failed. Please try again.');
          }
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
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmpassword">
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

                    <div>
                        <button
                            type="submit"
                            className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
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
