import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Forgotpassword from './components/Forgotpassword';
import Login from './components/Login';
import Admin from './components/Admin';
import Home from './components/Home';
import Otp from './components/Otp';
import ResetPassword from './components/ResetPassword';
import CreateDebate from './components/CreateDebate';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>  {/* Move Router to wrap everything */}
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/createdebate' element={<CreateDebate />} />
          <Route path='/login' element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path='/forgotpassword' element={<Forgotpassword />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
