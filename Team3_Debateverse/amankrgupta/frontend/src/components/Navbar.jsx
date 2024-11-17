import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-xl font-bold text-white">DebateHub</div>
        <div className="hidden space-x-4 md:flex">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/debates" className="text-gray-300 hover:text-white">Debates</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
          <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-300 hover:text-white">Home</Link>
            <Link to="/debates" className="block text-gray-300 hover:text-white">Debates</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white">Contact</Link>
            <Link to="/about" className="block text-gray-300 hover:text-white">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;