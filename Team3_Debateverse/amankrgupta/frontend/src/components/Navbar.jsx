import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, setIsAuth, role, isRole } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const Logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setIsAuth(false);
        toggleMenu();
        navigate("/login");
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <nav className="fixed w-full bg-[#1e3a8a] p-4 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={() => location.pathname='/'}
          className="text-white text-xl font-bold"
        >
          DebateHub
        </button>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-14 absolute md:relative top-14 md:top-0 left-0 w-full bg-[#1e3a8a] md:w-auto p-4 md:p-0`}
        >
          {isAuth && role == "user" && (
            <>
              <NavLink
                to="/userdashboard"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/userdebates"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                All Debates
              </NavLink>
              <button onClick={Logout}>
                <LogOut className="text-gray-200" />
              </button>
            </>
          )}
          {isAuth && role == "admin" && (
            <>
              <NavLink
                to="/admindashboard"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                Admin Dashboard
              </NavLink>
              <button onClick={Logout}>
                <LogOut className="text-gray-200" />
              </button>
            </>
          )}
          {!isAuth && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3 " : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/aboutus"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                About us
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "bg-white rounded-xl px-3" : "text-gray-400"
                }
                onClick={toggleMenu}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
