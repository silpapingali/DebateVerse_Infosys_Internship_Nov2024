import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 position-relative" style={{ backgroundColor: '#f0f0f0' }}>
            {/* Project Title in Background */}
            <h1
                className="position-absolute"
                style={{
                    top: '10px', // Adjust the positioning to move it to a corner
                    left: '10px', // Use right: '10px' to place in the top-right corner
                    fontSize: '4rem',
                    color: 'rgba(0, 0, 0, 0.1)', // Light color with low opacity for background effect
                    pointerEvents: 'none', // Prevents the text from interfering with clicks
                    zIndex: '0',
                }}
            >
                Debate Verse
            </h1>

            <div className="bg-white p-3 rounded w-25 position-relative" style={{ zIndex: '1' }}>
                <h3 className="text-center">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={handleInput}
                            className="form-control rounded-0"
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={handleInput}
                            className="form-control rounded-0"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0"><strong>Log in</strong></button>
                    <p className="text-center mt-3">Don't Have an Account?</p>
                    <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}
