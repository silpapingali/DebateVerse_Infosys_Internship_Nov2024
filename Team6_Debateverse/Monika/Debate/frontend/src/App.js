import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import these from react-router-dom

// import { AuthContext, AuthProvider } from './context/AuthContext';

import DebateCard from './components/DebateCard';  // Correct path to the component
import Navbar from './components/Navbar';  // Correct path to the Navbar component
import VerifyOtp from './pages/VerifyOtp';  // Correct path to the component
import ForgotPassword from './pages/ForgotPassword';  // Correct path
import ResetPassword from './pages/ResetPassword';  // Correct path
import Login from './pages/Login';  // Correct path
import Signup from './pages/Signup';  // Assuming you have a Signup component
import AdminDashboard from './components/AdminDashboard';  // Assuming you have AdminDashboard component
import DebateList from './components/DebateList';  // Assuming you have DebateList component
import CreateDebate from './components/CreateDebate';
import DebateDetail from './components/DebateDetail'; // Adjust the path as needed

import About from './components/About';
import Logout from './components/Logout';
  












export default function App() {
  return (
    
   
    <BrowserRouter>
       
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/debatedetail" element={<DebateDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/debatelist" element={<DebateList />} />
        <Route path="/createdebate" element={<CreateDebate />} />
        <Route path="/logout" element={<Logout />} />
        
        
        <Route path="/About" element={<About />} />
        
        

      </Routes>
    </BrowserRouter>
  )
}
