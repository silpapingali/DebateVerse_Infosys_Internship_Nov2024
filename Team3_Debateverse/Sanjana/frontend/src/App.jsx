import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAllDebates from "./pages/UserAllDebates";
import { Reset } from "./pages/Reset";
import { UserContextProvider } from "./context/UserContext";
import About from "./pages/About";
import UserDashboard from "./pages/UserDashboard";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import UserProtected from "./ProtectedRoute/UserProtected";
import AdminProtected from "./ProtectedRoute/AdminProtected";
import PublicProtected from "./ProtectedRoute/PublicProtected";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          <Route path="/userdebates" element={<UserAllDebates />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/aboutus" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<Reset />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Footer />
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
