import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInput = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        setError('');
        axios
            .post('http://localhost:8081/forgot-password', { email })
            .then((response) => {
                setMessage(response.data.message);
                console.log(response.data);
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.message || 'Something went wrong');
            });
    };

    return (
        <div
        className="d-flex justify-content-center align-items-center vh-100 position-relative"
        style={{ backgroundColor: '#007BFF' }} // Light grey background color
    >
            <div className="bg-white p-3 rounded w-25">
                <h2 className="text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            name="email"
                            onChange={handleInput}
                            className="form-control rounded-0"
                        />
                        {error && <span className="text-danger">{error}</span>}
                        {message && <span className="text-success">{message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-0"><strong>Send OTP</strong></button>
                </form>
            </div>
        </div>
    );
}
