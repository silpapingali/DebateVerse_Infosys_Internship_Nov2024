import React, { useState } from "react";
import axios from "axios";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", ""]); // State for OTP digits
    const [email, setEmail] = useState(""); // State for email
    const [message, setMessage] = useState(""); // State for success message
    const [error, setError] = useState(""); // State for error message

    const handleChange = (value, index) => {
        // Update the specific OTP digit
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Ensure only a single digit is entered
        setOtp(newOtp);

        // Move focus to the next input box automatically
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        setError(""); // Clear previous errors

        const enteredOtp = otp.join(""); // Combine the OTP digits into a single string

        try {
            const response = await axios.post("http://localhost:5000/verify-otp", { email, otp: enteredOtp });
            localStorage.setItem("resetToken", response.data.token); // Store reset token
            setMessage("OTP verified successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while verifying the OTP.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#007bff" }}>
            <div className="bg-white p-3 rounded w-25">
                <h2 className="text-center">Verify OTP</h2>
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
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                className="form-control text-center"
                                style={{ width: "50px", fontSize: "20px" }}
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                                        document.getElementById(`otp-${index - 1}`).focus();
                                    }
                                }}
                                required
                            />
                        ))}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
                </form>
            </div>
        </div>
    );
}
