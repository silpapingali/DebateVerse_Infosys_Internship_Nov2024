import React from 'react';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import VerifyOtp from './VerifyOtp';
import ResetPassword from './ResetPassword';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/Signup' element={<Signup/>}></Route>
        <Route path='/Home' element={<Home/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    
      </Routes>
    </BrowserRouter>
  )
}
