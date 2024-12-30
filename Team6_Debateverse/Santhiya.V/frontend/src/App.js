import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar';  
import Otp from './components/Otp';  
import Forgotpassword from './components/Forgotpassword';  
import ResetPassword from './components/ResetPassword';  
import Login from './components/Login';  
import Register from './components/Register';  
import Admin from './components/Admin';  
import Debates from './components/Debates';  
import CreateDebate from './components/CreateDebate'; 
import About from './components/About';
import UserDashboard from './components/UserDashboard';
import ModerateDebate from './components/ModerateDebate';
import { Provider } from 'react-redux';

function App() {
  return (
    <BrowserRouter>  {/* Move Router to wrap everything */}
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Forgot-password' element={<Forgotpassword />} />
          <Route path='/Otp' element={<Otp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/debates" element={<Debates />} />
          <Route path="/createdebate" element={<CreateDebate />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/moderatedebate" element={<ModerateDebate />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
