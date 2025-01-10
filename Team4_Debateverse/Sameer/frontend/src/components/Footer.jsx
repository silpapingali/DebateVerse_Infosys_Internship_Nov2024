import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text font-semibold">
            DebateHub
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;