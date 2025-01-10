import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const RegisterSuccess = () => {
  const location = useLocation();
  const email = location.state?.email || "your registered email";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Welcome aboard!
          </h2>
          
          <div className="flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-blue-400" />
          </div>

          <p className="mb-6 text-slate-200 leading-relaxed">
            You must have received an email at{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {email}
            </span>
            <br />Please click on the link to complete your registration!
          </p>

          <div className="mt-8">
            <Link 
              to="/login"
              className="group inline-flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <span>Already signed up? Sign in here</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;