import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
//import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  //const {currentUser,logout} = useAuth()
  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* Left side: Home Icon */}
        <div>
          <Link to='/'>
            <FaHome className="text-primary text-3xl ml-6" />
          </Link>
        </div>


        {/* Right side: About, Login/Register */}
        <div className="flex space-x-6">
          <Link to='/about' className="text-primary font-primary font-bold">About</Link>
          <Link to='/login' className="text-primary font-primary font-bold">Login</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
