import React, { useEffect, useState } from 'react';
import { Link, useSearchParams} from 'react-router-dom';
import axios from 'axios';

const VerifySuccess = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract token from URL

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/verify-email?token=${token}`);
        if (res.data.message === 'Email successfully verified!') {
          setVerified(true);
        }
      } catch (error) {
        setError('Invalid or expired verification link.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('No token provided.');
    }
  }, [token]);

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
        {verified ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Registration Complete!</h2>
            <p className="mb-4 text-gray-700">
              Your email has been successfully verified. You can now log in to access your account.
            </p>
            <Link
              to="/login"
              className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-red-500">Verification Failed!</h2>
            <p className="mb-4 text-gray-700">{error}</p>
            <Link
              to="/"
              className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
            >
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifySuccess;
