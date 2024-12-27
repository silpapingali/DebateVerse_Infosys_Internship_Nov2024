import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 

function Navbar() {
    const handleLogout = () => {
        const isConfirmed = window.confirm("Are you sure you want to logout?");
        if (isConfirmed) {
            window.location.href = '/'; 
        }
    };

    return (
        <nav>
            <h1>DEBATE-VERSE</h1>  {/* Update to h1 for proper title styling */}
            <div className="nav-links">
                <Link to="/register">Sign in</Link>
                <Link to="/home">Home</Link>
                <Link to="/debates">Debates</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
