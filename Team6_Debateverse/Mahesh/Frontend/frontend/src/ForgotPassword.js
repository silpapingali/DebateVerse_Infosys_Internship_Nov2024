import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        axios.post('http://localhost:8081/forgot-password', { email })
            .then(res => {
                setMessage('A password reset link has been sent to your email.');
            })
            .catch(err => {
                console.error(err);
                setError('Failed to send password reset link. Please try again.');
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-black vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <form onSubmit={handleSubmit}>
                    <h3 className='mb-3'>Forgot Password</h3>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control rounded-0'
                        />
                    </div>
                    {message && <div className='alert alert-success'>{message}</div>}
                    {error && <div className='alert alert-danger'>{error}</div>}
                    <button type='submit' className='btn btn-success w-100 bg-primary'>
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
