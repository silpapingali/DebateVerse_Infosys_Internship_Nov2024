import React from 'react';
import { Users, MessageCircle, Vote } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl p-8 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Welcome to DebateHub
            </h2>
            <p className="text-slate-400 text-lg">
              Where ideas meet discourse, and perspectives shape understanding
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <FeatureCard 
              icon={<MessageCircle className="w-6 h-6 text-blue-400" />}
              title="Engage in Debates"
              description="Participate in thoughtful discussions on diverse topics that matter"
            />
            <FeatureCard 
              icon={<Vote className="w-6 h-6 text-cyan-400" />}
              title="Cast Your Votes"
              description="Use your 10 votes to support the viewpoints you believe in"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-blue-400" />}
              title="Community Driven"
              description="Join a community of thinkers, debaters, and knowledge seekers"
            />
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <p className="text-slate-200 text-lg leading-relaxed">
              DebateHub is an interactive platform where users can engage in thoughtful debates on a wide range of topics. 
              Create questions, offer multiple viewpoints, and allow the community to vote on the options.
            </p>
            <p className="text-slate-200 text-lg leading-relaxed">
              Every user receives <span className="font-medium text-cyan-300">10 votes</span> to distribute as they see fit. 
              Results are displayed in intuitive graphical formats, making it easy to visualize the distribution of opinions 
              across the community.
            </p>
            <div className="mt-6 p-4 bg-white/[0.03] rounded-xl border border-white/5">
              <p className="text-slate-300 text-center italic">
                "Our goal is to foster meaningful discussions where ideas can be freely exchanged, 
                respected, and explored in a constructive way."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02]">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-white/5 rounded-full">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-slate-200">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default About;