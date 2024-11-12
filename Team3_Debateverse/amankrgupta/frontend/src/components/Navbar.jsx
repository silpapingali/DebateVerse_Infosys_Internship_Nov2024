import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">DebateHub</div>
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/debates" className="text-gray-300 hover:text-white">Debates</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
          <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;