import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAllDebates from "./pages/UserAllDebates";
import { Reset } from "./pages/Reset";
import { UserContextProvider } from "./context/UserContext";
import About from "./pages/About";
import UserDashboard from "./pages/UserDashboard";
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
          <Route element={<UserProtected />}>
            <Route path="/userdebates" element={<UserAllDebates />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<AdminProtected />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<PublicProtected />}>
            <Route path="/aboutus" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/resetpassword" element={<Reset />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes */}
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
