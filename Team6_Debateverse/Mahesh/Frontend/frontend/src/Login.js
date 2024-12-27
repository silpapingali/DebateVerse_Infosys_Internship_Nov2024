import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';


function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (isSubmitting) {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);

                        const token = res.data.token;
                        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
                        const role = decodedToken.role; // Role is in the payload

                        if (role === 'admin') {
                            navigate('/admin');
                        } else {
                            navigate('/home');
                        }
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        setLoginError(err.response.data.message); 
                    } else {
                        setLoginError('An error occurred during login');
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setIsSubmitting(false);
        }
    }, [errors, isSubmitting, navigate, values]);

    return (
        <div className='d-flex justify-content-center align-items-center bg-gradient vh-100'>
            <div className='card shadow-lg p-4 rounded w-25'>
                <h2 className='text-center mb-4'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name='email'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name='password'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    {loginError && <div className='alert alert-danger'>{loginError}</div>}
                    <button
                        type='submit'
                        className='btn btn-primary w-100'>
                        Log in
                    </button>
                    <p className='text-center mt-3'>You agree to our terms and policies</p>
                    <Link to="/forgot-password" className='text-decoration-none'>Forgot Password?</Link>
                    <Link to="/signup" className='btn btn-light border w-100 text-decoration-none mt-2'>
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
