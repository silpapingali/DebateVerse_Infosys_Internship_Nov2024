import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './Home';
import Admin from './Admin';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyOtp from './components/auth/VerifyOtp';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ /reset-password/:token" element={<ResetPassword />} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Admin" element={<Admin/>}/>
      
      </Routes>
    </BrowserRouter>
  );
}
