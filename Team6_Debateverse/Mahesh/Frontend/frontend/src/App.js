import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Admin from './Admin';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ConfirmRegistration from "./ConfirmRegistration";
import CreateDebate from './CreateDebate';
import Debates from './Debates'; 
import Upvotes from './Upvotes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} /> 
        
        <Route path="/create-debate" element={<CreateDebate />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/confirm-registration/:token' element={<ConfirmRegistration />} />
        <Route path="/debates" element={<Debates />} />
        <Route path="/upvotes" element={<Upvotes />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
