import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  
  const location = useLocation();
  
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            DebateHub
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`${location.pathname === '/' ? 'text-white' : 'text-orange-100'} hover:text-white`}
            >
              Dashboard
            </Link>
            <Link
              to="/debates"
              className={`${location.pathname === '/debates' ? 'text-white' : 'text-orange-100'} hover:text-white`}
            >
              Debates
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-orange-100 hover:text-white"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;