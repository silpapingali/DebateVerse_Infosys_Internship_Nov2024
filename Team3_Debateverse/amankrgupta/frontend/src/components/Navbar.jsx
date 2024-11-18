import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);
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
        setIsAuthenticated(false);
        toggleMenu();
        navigate("/login");
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <nav className="w-full bg-[#1e3a8a] p-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-white text-xl font-bold"
        >
          DebateHub
        </button>

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu: Show hidden on small screens, always visible on larger screens */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex flex-col md:flex-row items-center justify-center gap-3 md:space-x-14 absolute md:relative top-16 md:top-0 left-0 w-full bg-[#1e3a8a] md:w-auto p-4 md:p-0`}
        >
          {isAuthenticated && (
            <>
              <Link
                onClick={toggleMenu}
                to="/"
                className={`hover:text-white ${
                  location.pathname === "/"
                    ? "underline text-white"
                    : "text-gray-400"
                }`}
              >
                Home
              </Link>
              <Link
                onClick={toggleMenu}
                to="/dashboard"
                className={`hover:text-white ${
                  location.pathname === "/dashboard"
                    ? "underline text-white"
                    : "text-gray-400"
                }`}
              >
                Dashboard
              </Link>
              <button onClick={Logout}>
                <LogOut className="text-gray-200" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
