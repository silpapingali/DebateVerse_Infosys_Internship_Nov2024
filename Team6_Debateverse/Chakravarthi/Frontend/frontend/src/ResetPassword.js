import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long, contain one capital letter, and one digit.");
            return;
        }

       
        axios.post('http://localhost:8081/reset-password', { token, password })
            .then(res => {
                setSuccess("Password reset successful!");
                setTimeout(() => navigate('/'), 3000);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to reset password. Please try again.");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="p-4 bg-white rounded">
                <h3>Reset Password</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;

