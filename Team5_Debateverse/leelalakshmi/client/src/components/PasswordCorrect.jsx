import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios'; 

const PasswordCorrect = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError(''); 
        setLoading(true);
        try {

            const response = await axios.post('http://localhost:5000/request-password-reset', { email });
            setMessage(response.data.message); 
            setLoading(false);
        } catch (err) {
            
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Something went wrong.');
            } else {
                setError('Unable to send reset link. Please try again later.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Forgot Your Password?</h2>
                <p className="mb-4 text-gray-700">
                    If you forgetten your password please enter your email below, and we'll send you a link to reset your password.
                </p>

                {message && (
                    <div className="mb-4 text-green-600">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
                            Your Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                            required
                        />
                    </div>
                        {loading && (
                        <p className="text-blue-700 text-xs font-bold italic mb-4">Please wait...</p>
                            )}
                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none"
                        disabled={message}
                    >
                        Submit
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-700">
                    Remember your password? Click <Link to="/login" className="text-blue-500 hover:text-blue-700">here</Link> to log in.
                </p>
            </div>
        </div>
    );
};

export default PasswordCorrect;
