import React from 'react';
import { Link } from 'react-router-dom';

const PasswordConfirm = () => {
    const handleReset = (event) => {
        event.preventDefault();
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Just one last step</h2>
                <p className="mb-4 text-gray-700">
                    Confirm your new password and you can now login with the new one.
                </p>

                <form onSubmit={handleReset}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm mb-2' htmlFor='password'>Password</label>
                        <input 
                            type='password' 
                            name='password' 
                            id='password' 
                            placeholder='Password' 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm mb-2' htmlFor='confirmPassword'>Confirm Password</label>
                        <input 
                            type='password' 
                            name='confirmPassword' 
                            id='confirmPassword' 
                            placeholder='Confirm Password' 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                    </div>

                    <button type="submit" className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none'>
                        Reset
                    </button>
                </form>

                <p className='mt-4 text-sm text-gray-700'>
                    Go back to <Link to='/login' className='text-blue-500 hover:text-blue-700'>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default PasswordConfirm;
