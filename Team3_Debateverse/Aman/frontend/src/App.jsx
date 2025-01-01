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
import Voting from "./pages/Voting";
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          
            <Route path="/userdebates" element={<UserAllDebates />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/voting" element={<Voting/>}/>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/manageusers" element={<ManageUsers/>}/>

          <Route element={<PublicProtected />}>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/login"/>}/>
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
