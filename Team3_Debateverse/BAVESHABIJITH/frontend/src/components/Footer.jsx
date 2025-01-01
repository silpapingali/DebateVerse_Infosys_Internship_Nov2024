import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-center">DebateHub</h2>
          <p className="text-sm text-center">© 2024 DebateHub. All rights reserved.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-5">
          <a href="/about" className="text-sm text-center hover:underline">About Us</a>
          <a href="/contact" className="text-sm text-center hover:underline">Contact</a>
          <a href="/privacy" className="text-sm text-center hover:underline">Privacy Policy</a>
          <a href="/terms" className="text-sm text-center hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;