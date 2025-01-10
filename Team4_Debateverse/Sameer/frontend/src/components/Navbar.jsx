import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { store } from "../App";
import axios from "axios";

const Navbar = () => {
  const { token, setToken, role, setRole } = useContext(store);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const endpoint = role === "admin" ? "/admindashboard" : "/userdashboard";
        const response = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: {
            "x-token": token,
          },
        });
        setUsername(response.data.user.username);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [token, role, navigate]);

  const navLinkStyles = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-slate-700 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="w-full bg-slate-900 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl transition-transform duration-300 hover:scale-110 ${
                isActive ? "text-white" : "text-slate-300 hover:text-white"
              }`
            }
          >
            <FaHome />
          </NavLink>
          {username && (
            <span className="text-slate-300 font-medium">
              Welcome, <span className="text-white font-semibold">{username}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!token ? (
            <>
              <NavLink to="/about" className={navLinkStyles}>
                About
              </NavLink>
              <NavLink to="/login" className={navLinkStyles}>
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={role === "admin" ? "/admindashboard" : "/userdashboard"}
                className={navLinkStyles}
              >
                {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
              </NavLink>
              <NavLink to="/debatesearch" className={navLinkStyles}>
                Debates
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;