import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PasswordCorrect = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/request-password-reset', { email });
            setMessage(response.data.message);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Something went wrong. Please try again.');
            } else {
                setError('Unable to send the reset link. Please check your connection and try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="w-full max-w-sm mx-auto bg-white/5 backdrop-blur-sm border border-white/10 shadow-md rounded-2xl px-8 pt-6 pb-8">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                    Reset Your Password
                </h2>
                <p className="mb-4 text-slate-400">
                    Enter your registered email address, and we'll send you a secure link to reset your password. 
                    This will help you regain access to your account.
                </p>

                {message && <div className="mb-4 text-green-500 text-sm">{message}</div>}
                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-slate-200 text-sm font-medium mb-2"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-2 px-3 bg-slate-900/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                            required
                        />
                    </div>
                    {loading && (
                        <p className="text-blue-400 text-xs font-bold italic mb-4">
                            Sending reset link, please wait...
                        </p>
                    )}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-900 font-semibold rounded-lg hover:scale-105 transform transition duration-300 focus:outline-none ${
                            message ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!!message}
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-cyan-300 transition">
                        Log in here
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default PasswordCorrect;
