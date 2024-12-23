import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        axios
            .post('http://localhost:8081/api/auth/resetPassword', { password, token })
            .then((response) => {
                setMessage(response.data.message);
                navigate('/');
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
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label"><strong>New Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control rounded-0"
                        />
                        {error && <span className="text-danger">{error}</span>}
                        {message && <span className="text-success">{message}</span>}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0"><strong>Reset Password</strong></button>
                </form>
            </div>
        </div>
    );
}
