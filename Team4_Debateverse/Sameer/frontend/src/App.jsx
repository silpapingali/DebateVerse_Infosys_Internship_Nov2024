import React, { useState, createContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "@fontsource/inter";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 font-sans">
      <store.Provider value={contextValue}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
            <h1 className="relative text-center font-bold text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 hover:scale-105">
              DebateHub
            </h1>
          </div>

          <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </store.Provider>
    </div>
  );
};

export default App;