import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar';  
import VerifyOtp from './pages/VerifyOtp';  
import ForgotPassword from './pages/ForgotPassword';  
import ResetPassword from './pages/ResetPassword';  
import Login from './pages/Login';  
import Signup from './pages/Signup';  
import AdminDashboard from './components/AdminDashboard';  
import DebateList from './components/DebateList';  
import CreateDebate from './components/CreateDebate';
import DebateDetail from './components/DebateDetail'; 
import About from './components/About';
import Logout from './components/Logout';
import UserDashboard from './components/UserDashboard';
import DebateCard from './components/DebateCard';
import ModerateDebate from './components/ModerateDebate';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import { Provider } from 'react-redux';
import store from './redux/store';

export default function App() {
  
   
  

  return (
    <Provider store={store}>
    <BrowserRouter>
     
      <Navbar  />

      <Routes>
        
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/VerifyOtp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/debatedetail" element={<DebateDetail />} />
        <Route path="/debatelist" element={<DebateList />} />
        <Route path="/createdebate" element={<CreateDebate />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/debatecard" element={<DebateCard />} />
        <Route path="/moderatedebate" element={<ModerateDebate />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="//userdetail/:userId" element={<UserDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}
