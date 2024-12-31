import React, { useState } from 'react';
import useAuth from '../utils/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { handleForgotPassword } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleForgotPassword(email);
      // Display success message to the user
    } catch (error) {
      console.error('Forgot password error:', error);
      // Display error message to the user
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;