import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupValidation from './SignupValidation';
import axios from 'axios';

export default function Signup() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '' // Added confirmPassword field
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = SignupValidation(values);
        setErrors(validationErrors);
    
        
        if (!validationErrors.email && !validationErrors.password && !validationErrors.confirmPassword) {
            
            axios.post('http://localhost:8081/api/auth/signup', { 
                email: values.email,
                password: values.password
            })
                .then(res => {
                    console.log(res.data.message); 
                    navigate('/'); 
                })
                .catch(err => {
                    if (err.response) {
                        console.log(err.response.data.message); 
                    } else {
                        console.log('Error:', err.message); 
                    }
                });
        }
    };
    

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <h1
                className="position-absolute"
                style={{
                    top: '10px',
                    left: '10px',
                    fontSize: '2rem',
                    color: 'rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                    zIndex: '0',
                }}
            >
                Debate Verse
            </h1>

            <div className='bg-white p-3 rounded w-25'>
                <h2 className="text-center">Sign-up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword}</span>}
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#28a745', color: '#fff' }}
                        className='btn btn-success w-100 rounded-0'
                    >
                        <strong>Signup</strong>
                    </button>
                    <p>Already Have an Account?</p>
                    <Link to="/" className="btn btn-default border w-100 rounded-0 text-decoration-none mb-3">
                        Log In
                    </Link>
                </form>
            </div>
        </div>
    );
}
