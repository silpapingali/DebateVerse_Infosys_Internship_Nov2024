import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams(); // Retrieve the token from the URL
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if passwords match before making the API call
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        axios.post('http://localhost:8081/reset-password', { token, password: newPassword })
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
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#007bff" }}>
            <div className="bg-white p-3 rounded w-25">
                <h2 className="text-center">Reset Password</h2>
                {message && <div className="alert alert-info text-center">{message}</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="newPassword"><strong>New Password</strong></label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                </form>
            </div>
        </div>
    );
}
