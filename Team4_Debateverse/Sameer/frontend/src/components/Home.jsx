import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Award, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: "Engaging Debates",
      description: "Participate in thoughtful discussions on various topics with a diverse community of debaters."
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      title: "Vibrant Community",
      description: "Connect with like-minded individuals and learn from different perspectives."
    },
    {
      icon: <Award className="w-6 h-6 text-blue-400" />,
      title: "Skill Development",
      description: "Enhance your critical thinking and argumentation skills through structured debates."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      title: "Track Progress",
      description: "Monitor your debate performance and see your skills improve over time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative mb-8 inline-block">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
              Welcome to DebateHub
            </h1>
          </div>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Join our community of critical thinkers and engage in meaningful debates that shape perspectives and broaden horizons.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">
            Ready to Join the Discussion?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Create an account to participate in debates, track your progress, and connect with other debaters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-700 text-slate-200 font-medium hover:bg-slate-600 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;