import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../utils/auth';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleSignup({ username, password });
    } catch (error) {
      console.error('Signup error:', error);
      // Display error message to the user
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;