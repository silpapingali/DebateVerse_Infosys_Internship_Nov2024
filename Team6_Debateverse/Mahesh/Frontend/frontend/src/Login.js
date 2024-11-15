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
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
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
                    } else {
                        setLoginError('Invalid email or password');
                    }
                })
                .catch(err => {
                    console.log(err);
                    setLoginError('An error occurred during login');
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setIsSubmitting(false);
        }
    }, [errors, isSubmitting, navigate, values]);

    return (
        <div className='d-flex justify-content-center align-items-center bg-black vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <form action='' onSubmit={handleSubmit}>
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
                        className='btn btn-success w-100 bg-primary'>
                        Log in
                    </button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light text-decoration-none'>
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
