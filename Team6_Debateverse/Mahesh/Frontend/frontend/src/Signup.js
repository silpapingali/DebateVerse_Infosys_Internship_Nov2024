import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' 
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (isSubmitting && Object.keys(errors).length === 0) {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/'); // Navigate to login on success
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        setErrors({ email: "User already exists with this email." });
                    } else {
                        console.error(err);
                    }
                });
        }
        setIsSubmitting(false);
    }, [errors, isSubmitting, navigate, values]);

    return (
        <div className='d-flex justify-content-center align-items-center bg-black vh-100'>
            <div className='bg-white p-3 rounded w-25'>
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

                    <div className='mb-3'>
                        <label htmlFor='confirmPassword'><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name='confirmPassword'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword}</span>}
                    </div>

                    

                    <button type='submit' className='btn btn-success w-100 bg-primary'>Signup</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/" className='btn btn-default border w-100 bg-light text-decoration-none'>Login</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;


