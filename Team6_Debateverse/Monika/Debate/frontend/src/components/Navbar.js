import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashBoard.css';

const Navbar = ({ role }) => {
  const navbarStyle = {
    backgroundColor: "#ff9800",
    padding: "20px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    fontSize: "18px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    margin: "0 12px",
  };

  return (
    <div style={navbarStyle}>
      <span style={{ fontWeight: "bold", fontSize: "20px" }}>DebateVerse</span>
      <div>
        {/* Links for All Users */}
        <Link to="/about" style={linkStyle}>
          About
        </Link>
        <Link to="/userdashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/debatelist" style={linkStyle}>
          Debate
        </Link>

        {/* Additional Links for Admin */}
        {role === 'admin' && (
          <>
            <Link to="/usermanagement" style={linkStyle}>
              User Management
            </Link>
            <Link to="/admindashboard" style={linkStyle}>
              Admin Dashboard
            </Link>
          </>
        )}

        {/* Logout Link */}
        <Link to="/logout" style={linkStyle}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
