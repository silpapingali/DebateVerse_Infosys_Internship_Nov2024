import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navbarStyle = {
    backgroundColor: "#4caf50",
    padding: "12px",
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
        <Link to="/about" style={linkStyle}>
          About
        </Link>
        <Link to="/user-dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/debatelist" style={linkStyle}>
          Debate
        </Link>
        
        <Link to="/logout" style={linkStyle}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
