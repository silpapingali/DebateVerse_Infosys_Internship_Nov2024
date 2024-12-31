import React from 'react';
import { Users, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";

const AdminNavbar = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate=useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const isActive = (path) => {
    return location.pathname === path ? 'text-green-200' : 'text-white';
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-white text-2xl font-bold">
          DebateHub
        </Link>
        <div className="flex space-x-6">
          <Link
            to="/admin"
            className={`${isActive('/admin')} hover:text-orange-200 flex items-center gap-2`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`${isActive('/admin/users')} hover:text-orange-200 flex items-center gap-2`}
          >
            <Users size={20} />
            Users
          </Link>
          <Link
            to="/admin/debates"
            className={`${isActive('/admin/debates')} hover:text-orange-200 flex items-center gap-2`}
          >
            <MessageSquare size={20} />
            Debates
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:text-orange-200 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;