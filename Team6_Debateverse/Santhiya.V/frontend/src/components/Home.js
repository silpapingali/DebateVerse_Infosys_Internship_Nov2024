import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        navigate('/');
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-black vh-100'>
            <div className='bg-white p-5 rounded text-center'>
                <h2 className='mb-4'>Login Successful!</h2>
                <p className='mb-4'>Welcome to your dashboard</p>
                <button 
                    className='btn btn-danger'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Home;
