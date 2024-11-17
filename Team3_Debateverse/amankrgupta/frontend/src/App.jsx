import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Debates from './pages/Debates';
import { Reset } from './pages/Reset';
function App() {
  return (
    <Router >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/debates" element={<Debates />} />
        <Route path="/resetpassword" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;