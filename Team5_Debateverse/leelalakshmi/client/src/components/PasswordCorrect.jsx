import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PasswordCorrect = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform password reset email logic here
        navigate("/passwordconfirm");  // Redirects to PasswordConfirm after submitting
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Sorry about that!</h2>
                <p className="mb-4 text-gray-700">
                    If you have forgotten your password, please enter your email here and you will receive a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm mb-2' htmlFor='email'>Your Email</label>
                        <input 
                            type='email' 
                            name='email' 
                            id='email' 
                            placeholder='Email Address' 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                    </div>

                    <button type="submit" className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none'>
                        Submit
                    </button>
                </form>

                <p className='mt-4 text-sm text-gray-700'>
                    Want to try logging in? Click <Link to='/login' className='text-blue-500 hover:text-blue-700'>here</Link>.
                </p>
            </div>
        </div>
    );
};

export default PasswordCorrect;
