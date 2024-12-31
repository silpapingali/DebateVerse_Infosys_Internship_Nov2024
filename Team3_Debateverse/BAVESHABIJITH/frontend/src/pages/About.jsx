import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate= useNavigate();
  return (
    <div className="pt-16 flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500 p-4">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">About DebateHub</h1>
        <div className="flex flex-wrap gap-5 mb-6">
          <div className="flex-1 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2 text-indigo-600">Our Mission</h2>
            <p className="text-base text-gray-700">
              Our mission is to foster a community where people can share their ideas, challenge each other's viewpoints, and grow through constructive dialogue. We believe that through respectful and informed debates, we can all learn and evolve.
            </p>
          </div>

         
          <div className="flex-1 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2 text-indigo-600">How It Works</h2>
            <ul className="list-disc list-inside text-base text-gray-700">
              <li>Create debates on topics you're passionate about.</li>
              <li>Invite others to join the discussion and share their perspectives.</li>
              <li>Engage in thoughtful and respectful debates.</li>
              <li>Vote on the best arguments and see which side prevails.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap ">
          <div className="flex-1 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2 text-indigo-600">Join the Community</h2>
            <p className="text-base text-gray-700">
              Join DebateHub today and become part of a vibrant community of thinkers, debaters, and learners. Whether you're here to share your knowledge or to learn from others, DebateHub is the place for you.
            </p>
            <div className="text-center">
              <button
                onClick={() => navigate("/register")}
                className="mt-6 px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;