import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');

    const handleInput = (event) => {
        setOtp(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!otp) {
            setError('OTP is required');
            return;
        }

        setError('');
        axios
            .post('http://localhost:8081/verify-otp', { email, otp })
            .then((response) => {
                setMessage(response.data.message);
                navigate(`/reset-password?token=${response.data.token}`);
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.message || 'Invalid OTP');
            });
    };

    return (
        <div
        className="d-flex justify-content-center align-items-center vh-100 position-relative"
        style={{ backgroundColor: '#007BFF' }} // Light grey background color
    >
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center">Verify OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label"><strong>OTP</strong></label>
                        <input
                            type="text"
                            placeholder="Enter the OTP sent to your email"
                            name="otp"
                            onChange={handleInput}
                            className="form-control rounded-0"
                        />
                        {error && <span className="text-danger">{error}</span>}
                        {message && <span className="text-success">{message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-0"><strong>Verify</strong></button>
                </form>
            </div>
        </div>
    );
}
