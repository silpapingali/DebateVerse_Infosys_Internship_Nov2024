import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import these from react-router-dom


import DebateCard from './components/DebateCard';  // Correct path to the component
import Navbar from './components/Navbar';  // Correct path to the Navbar component
import VerifyOtp from './pages/VerifyOtp';  // Correct path to the component
import ForgotPassword from './pages/ForgotPassword';  // Correct path
import ResetPassword from './pages/ResetPassword';  // Correct path
import Login from './pages/Login';  // Correct path
import Signup from './pages/Signup';  // Assuming you have a Signup component
import AdminDashboard from './components/AdminDashboard';  // Assuming you have AdminDashboard component
import UserDashboard from './components/UserDashboard';  // Assuming you have UserDashboard component
import DebateList from './components/DebateList';  // Assuming you have DebateList component











export default function App() {
  return (
    
   
    <BrowserRouter>
       
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/debatelist" element={<DebateList />} />
        

      </Routes>
    </BrowserRouter>
  )
}
