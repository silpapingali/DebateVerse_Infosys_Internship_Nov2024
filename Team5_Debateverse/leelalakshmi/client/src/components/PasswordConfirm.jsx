import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordConfirm = () => {
    const { token } = useParams(); // Get the token from the URL parameters
    const navigate = useNavigate(); // To redirect after successful reset

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
                newPassword: password,
            });

            setMessage(response.data.message);
            setError('');
            // Optionally redirect the user to the login page after successful reset
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again later.');
            setMessage('');
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Just one last step</h2>
                <p className="mb-4 text-gray-700">
                    Confirm your new password and you can now login with the new one.
                </p>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}

                <form onSubmit={handleReset}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
                    >
                        Reset
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-700">
                    Go back to <Link to="/login" className="text-blue-500 hover:text-blue-700">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default PasswordConfirm;
