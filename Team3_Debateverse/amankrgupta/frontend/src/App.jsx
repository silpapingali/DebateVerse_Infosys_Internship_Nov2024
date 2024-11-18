import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Debates from "./pages/Debates";
import { Reset } from "./pages/Reset";
import { UserContextProvider } from "./context/userContext";
function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Debates />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<Reset />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
