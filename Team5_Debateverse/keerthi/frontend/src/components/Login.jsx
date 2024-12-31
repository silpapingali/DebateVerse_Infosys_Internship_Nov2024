import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../App';

const Login = () => {
    const navigate = useNavigate();
    const { token, setToken, role, setRole, username, setUsername } = useContext(store);
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            setErrorMessage('Please enter both email and password');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.email)) {
            setErrorMessage('Invalid email format');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/login', data);
            setToken(res.data.token);
            setRole(res.data.role);
            if (res.data.username) {
                setUsername(res.data.username);
            } else {
                console.error('Username is not defined in the login response.');
            }
            if (res.data.role === 'admin') {
                navigate('/admindashboard');
            } else {
                navigate('/userdashboard');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                switch (errorMessage) {
                    case 'USER_NOT_FOUND':
                        setErrorMessage('Email not found. Please check your email address.');
                        break;
                    case 'PASSWORD_MISSMATCH':
                        navigate('/passwordcorrect');
                        break;
                    case 'Email not verified':
                        setErrorMessage('Email not verified. Please check your email inbox.');
                        break;
                    case 'ACCOUNT_BLOCKED':
                        setErrorMessage('Your account has been blocked by the admin.');
                        break;
                    case 'DATABASE_ISSUE':
                        setErrorMessage('Database issue: Unable to login at this time. Please try again later.');
                        break;
                    case 'SERVER_ISSUE':
                        setErrorMessage('Server issue: Unable to process your request at the moment. Please try again later.');
                        break;
                    default:
                        setErrorMessage('Login failed. Please try again.');
                }
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
            console.error(error.response?.data?.error || error.message);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Please Login</h2>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            onChange={changeHandler}
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
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={changeHandler}
                            value={data.password}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
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
                    Haven't an account? Please{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
