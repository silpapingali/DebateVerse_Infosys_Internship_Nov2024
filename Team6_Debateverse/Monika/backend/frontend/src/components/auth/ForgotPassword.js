import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState(""); // State for email input
    const [message, setMessage] = useState(""); // State for success message
    const [error, setError] = useState(""); // State for error message

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(''); // Clear previous message
        setError(''); // Clear previous error

        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage(response.data.message); // Show success message
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred'); // Show error message
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#007bff" }}>
            <div className="bg-white p-3 rounded w-25">
                <h2 className="text-center">Forgot Password</h2>
                {/* Display success message */}
                {message && <div className="alert alert-info text-center">{message}</div>}
                {/* Display error message */}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send OTP</button>
                </form>
            </div>
        </div>
    );
}
