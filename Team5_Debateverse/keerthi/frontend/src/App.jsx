import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Register from './Register';
import Login from './Login';
import Home from './Home'; 
import Dashboard from './Dashboard'; 
import ForgotPassword from "./ForgotPassword";
import AdminHome from "./AdminHome";  
import UserHome from "./UserHome"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/user-home" element={<UserHome />} />
      </Routes>
    </Router>
  );
}

export default App;
