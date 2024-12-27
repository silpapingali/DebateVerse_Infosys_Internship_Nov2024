import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './Navbar.css'; 

function Navbar() {
    const handleLogout = () => {
        
        const isConfirmed = window.confirm("Are you sure you want to logout?");
        if (isConfirmed) {
            
            window.location.href = '/'; 
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-primary navbar-dark custom-navbar">
                <div className="container-fluid">
                    
                    <div className="navbar-brand">DebateHub Admin Panel</div>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavAltMarkup" 
                        aria-controls="navbarNavAltMarkup" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                     
                        <div className="navbar-nav ms-auto">
                            <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
