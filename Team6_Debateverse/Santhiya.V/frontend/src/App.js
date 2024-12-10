import React from 'react';
import { BrowserRouter as Router,Routes,Route,Link } from 'react-router-dom';
import Register from './components/Register';
import Forgotpassword from './components/Forgotpassword';
import Login from './components/Login';
import Home from './components/Home';
import Otp from './components/Otp';
import ResetPassword from './components/ResetPassword';
import './App.css';


function App() {
  return (
    <div class="App">
      <Router>
        <div>
          <header>
            <h2 class="main">debate-verse</h2>
              <nav class="main" className='right-aligned-routes'> 
                <Link to="/home" class="button" >Home</Link>
                <Link to="/register" class="button" >Register</Link>
                <Link to="/login" class="button" >Login</Link>
              </nav>
          </header>
    
          <Routes> 
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/forgotpassword' element={<Forgotpassword />} />
            <Route path='/otp' element={<Otp />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;





