import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./home";
import Dashboard from "./dashboard";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./Resetpassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route path="/Forgot-Password" element={<ForgotPassword />}></Route>
        <Route
          path="/Forgot-Password/Reset-password/:id/:token"
          element={<ResetPassword />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
