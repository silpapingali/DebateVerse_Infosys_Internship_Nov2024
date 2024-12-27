import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRole } from '../redux/actions/userActions';



const Navbar = () => {
  const dispatch = useDispatch();
  

  const role = useSelector((state) => state.user.role);

  const handleLogout = () => {
    dispatch(setRole()); 
  };

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
        <Link to="/about" style={linkStyle}>About</Link>
        {role === 'admin' ? (
          <>
            <Link to="/admindashboard" style={linkStyle}>Admin Dashboard</Link>
            <Link to="/userlist" style={linkStyle}>Users</Link>
            <Link to="/debatelist" style={linkStyle}>Debates</Link>
          </>
        ) : (
          <>
            <Link to="/userdashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/debatelist" style={linkStyle}>Debates</Link>
          </>
        )}
        <Link to="/logout" style={linkStyle} onClick={handleLogout}>Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;
