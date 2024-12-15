import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Forgotpassword.css"; 

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
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Something went wrong');
            });
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            name="email"
                            onChange={handleInput}
                            className="input-field"
                        />
                        {error && <span className="error-text">{error}</span>}
                        {message && <span className="success-text">{message}</span>}
                    </div>
                    <button type="submit" className="submit-button"><strong>Send OTP</strong></button>
                </form>
            </div>
        </div>
    );
}
