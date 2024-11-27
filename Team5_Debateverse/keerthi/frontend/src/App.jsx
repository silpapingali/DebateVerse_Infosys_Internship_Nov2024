import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; 
import ForgotPassword from "./ForgotPassword";
import NewDebate from "./NewDebate";
import MyDebates from "./MyDebates";
import Navbar from "./Navbar";
import DebateCard from "./DebateCard";
import ResetPassword from "./ResetPassword";


function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container mt-5 pt-4">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<NewDebate/>} />
        <Route path="/mydebates" element={<MyDebates/>} />
        <Route path="/debateCard" element={<DebateCard/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />

      </Routes>
      </div>
    </Router>

  );
}

export default App;
