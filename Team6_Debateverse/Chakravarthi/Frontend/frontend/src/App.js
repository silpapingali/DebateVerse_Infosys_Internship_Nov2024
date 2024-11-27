import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './Signup'
import Home from './Home';
import Admin from './Admin'
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ConfirmRegistration from "./ConfirmRegistration";



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/confirm-registration/:token" element={<ConfirmRegistration />} />

    </Routes>
    </BrowserRouter>
  )
}

export default App