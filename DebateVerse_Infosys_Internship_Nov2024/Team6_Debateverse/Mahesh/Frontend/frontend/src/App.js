import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './Signup'
import Home from './Home';



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path="/home" element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App