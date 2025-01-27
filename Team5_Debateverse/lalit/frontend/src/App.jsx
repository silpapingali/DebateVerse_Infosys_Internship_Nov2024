import React, { useState, createContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const store = createContext();

const App = () => {
  const [state, setState] = useState({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    username: localStorage.getItem("username") || "",
  });

  useEffect(() => {
    localStorage.setItem("token", state.token);
    localStorage.setItem("role", state.role);
    localStorage.setItem("username", state.username);
  }, [state]);

  const contextValue = {
    token: state.token,
    setToken: (token) => setState((prev) => ({ ...prev, token })),
    role: state.role,
    setRole: (role) => setState((prev) => ({ ...prev, role })),
    username: state.username,
    setUsername: (username) => setState((prev) => ({ ...prev, username })),
  };

  return (
    <div className="main-background bg-teal-200">
      <store.Provider value={contextValue}>
        <Navbar />
        <h1 className="text-center font-primary  pt-5  font-bold text-4xl md:text-5xl mt-5" style={{ fontFamily: "'Henny Penny', cursive" }}>
          DebateHub
        </h1>
        <main className="min-h-screen max-w-screen-2xl mx-auto px-4  font-primary">
          <Outlet />
        </main>
        <Footer />
      </store.Provider>
    </div>
  );
};

export default App;
