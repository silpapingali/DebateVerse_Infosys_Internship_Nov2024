import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../assets/Image.jpeg';
import Navbar from './Navbar';
import './About.css'; // Import the external CSS file

const About = () => {
  const navigate = useNavigate();

  const navigateToCreateDebate = () => {
    navigate('/createdebate');
  };

  return (
    <div>
      <Navbar />

      <div className="about-container">
        <h2 className="about-header">About DebateHub</h2>

        <img src={Image} alt="DebateHub" className="about-image" />

        <p className="about-text">
          DebateHub is a platform designed for individuals to engage in meaningful discussions and debates on various topics.
          Our mission is to foster critical thinking and encourage respectful dialogue among users.
        </p>

        <p className="about-text">
          Whether you're a seasoned debater or just starting out, DebateHub provides the tools and community to help you express
          your ideas and challenge others in a constructive manner.
        </p>

        <p className="about-text">
          Join us today and be part of a vibrant community of thinkers and debaters!
        </p>

        <button onClick={navigateToCreateDebate} className="about-createButton">
          Create Debate
        </button>
      </div>

      <footer className="about-footer">
        <p className="about-footerText">© 2024 DebateHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
