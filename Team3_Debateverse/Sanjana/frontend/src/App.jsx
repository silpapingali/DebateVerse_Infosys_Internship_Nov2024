import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDebates from "./pages/UserDebates";
import { Reset } from "./pages/Reset";
import { UserContextProvider } from "./context/UserContext";
import About from "./pages/About";
import UserDashboard from "./pages/UserDashboard";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import CreateDebate from "./pages/CreateDebate"; // Import the CreateDebate component
import UserProtected from "./ProtectedRoute/UserProtected";
import AdminProtected from "./ProtectedRoute/AdminProtected";
import PublicProtected from "./ProtectedRoute/PublicProtected";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          {/* User-specific routes */}
          <Route element={<UserProtected />}>
            <Route path="/userdebates" element={<UserDebates />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/create-debate" element={<CreateDebate />} /> {/* Add CreateDebate route */}
          </Route>
          
          {/* Admin-specific routes */}
          <Route element={<AdminProtected />}>
            <Route path="/userdebates" element={<UserDebates />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>

          {/* Public routes */}
          <Route element={<PublicProtected />}>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/resetpassword" element={<Reset />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
