import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RegisterSuccess = () => {
    const location = useLocation();
    const email = location.state?.email || "your registered email";

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
                <h2 className="text-xl font-semibold mb-4">Welcome aboard!</h2>
                <p className="mb-4 text-gray-700">
                    You must have received an email at <span className="font-semibold">{email}</span>. Please click on the link to complete your registration!
                </p>

                <p className="text-sm text-gray-700">
                    Already signed up? <Link to='/login' className='text-blue-500 hover:text-blue-700'>Sign in here</Link>.
                </p>
            </div>
        </div>
    );
};

export default RegisterSuccess;
