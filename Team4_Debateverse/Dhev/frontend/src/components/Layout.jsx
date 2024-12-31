
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import AdminNavbar from './adminNavbar';
import { useAuthStore } from "../store/authStore";
const Layout = () => {
 
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900  ' ">
      {user?.role === 'admin' && <AdminNavbar />}
      {user?.role === 'user' && <Navbar />}
      <main className="container mx-auto px-4 py-8 ">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;