import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { store } from "../App";
import axios from "axios";

const Navbar = () => {
  const { token, setToken, role, setRole } = useContext(store);
  const [username, setUsername] = useState(null); // State for username
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUsername(null); // Clear username
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
        console.log("Dashboard Response:", response);
        setUsername(response.data.user.username); // Set username from response
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [token, role, navigate]);

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-2 bg-orange-500 mb-5">
      <nav className="max-w-screen-2xl px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 bg-orange-500">
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-primary text-3xl ${isActive ? "underline underline-offset-4 text-black" : ""}`
            }
          >
            <FaHome />
          </NavLink>
          {username && (
            <span className="text-primary font-primary font-bold">
              Welcome, {username}
            </span>
          )}
        </div>
        <div className="flex space-x-6 items-center">
          {!token ? (
            <>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-primary font-primary font-bold ${isActive ? "underline underline-offset-4 text-black" : ""}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-primary font-primary font-bold ${isActive ? "underline underline-offset-4 text-black" : ""}`
                }
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              {role === "admin" ? (
                <NavLink
                  to="/admindashboard"
                  className={({ isActive }) =>
                    `text-primary font-primary font-bold ${isActive ? "underline underline-offset-4 text-black" : ""}`
                  }
                >
                  Admin Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/userdashboard"
                  className={({ isActive }) =>
                    `text-primary font-primary font-bold ${isActive ? "underline underline-offset-4 text-black" : ""}`
                  }
                >
                  User Dashboard
                </NavLink>
              )}
              <NavLink
                to="/debatesearch"
                className={({ isActive }) =>
                  `text-primary font-primary font-bold ${isActive ? "underline underline-offset-4 text-black" : ""}`
                }
              >
                Debates
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-primary font-primary font-bold bg-transparent border-none cursor-pointer"
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
