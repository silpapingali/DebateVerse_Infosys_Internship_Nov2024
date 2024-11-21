import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './LoginValidation';

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // Only proceed if no validation errors exist
        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
        }
    };

    useEffect(() => {
        if (isSubmitting) {
            axios.post('http://localhost:8081/login', values)
                .then((res) => {
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);

                        // Decode the JWT to get the role
                        const token = res.data.token;
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        const role = decodedToken.role;

                        // Navigate based on the role
                        if (role === 'admin') {
                            navigate('/admin');
                        } else {
                            navigate('/home');
                        }
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 400) {
                        setLoginError(err.response.data.message);
                    } else {
                        setLoginError('An error occurred during login');
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    }, [isSubmitting, navigate, values]);

    return (
        <div
            className="d-flex justify-content-center align-items-center bg-primary vh-100 position-relative"
            style={{ backgroundColor: '#007bff' }} // Ensuring bg-primary effect
        >
            {/* Project Title in Background */}
            <h1
                className="position-absolute"
                style={{
                    top: '10px',
                    left: '10px',
                    fontSize: '4rem',
                    color: 'rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none',
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
                            value={values.email}
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
                            value={values.password}
                            onChange={handleInput}
                            className="form-control rounded-0"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    {loginError && <div className="text-danger text-center">{loginError}</div>}
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        <strong>Log in</strong>
                    </button>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-2">
                        <Link to="/forgot-password" className="text-decoration-none text-primary">
                            Forgot Password?
                        </Link>
                    </div>

                    <p className="text-center mt-3">Don't Have an Account?</p>
                    <Link
                        to="/signup"
                        className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
                    >
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}
