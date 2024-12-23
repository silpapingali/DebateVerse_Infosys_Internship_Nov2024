import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation in React Router v6
import Image from '../assets/Image.jpeg'; // Adjust path as per your folder structure
import Navbar from './Navbar'; // Assuming Navbar component is in the same folder

const About = () => {
  const navigate = useNavigate(); // For navigation

  // Navigate to create debate page
  const navigateToCreateDebate = () => {
    navigate('/createdebate');
  };

  return (
    <div>
      <Navbar /> {/* Navbar component */}
      
      <div style={styles.container}>
        <h2 style={styles.header}>About DebateHub</h2>
        
        {/* Image with responsive and centered styling */}
        <img 
          src={Image} 
          alt="DebateHub" 
          style={styles.image} 
        />
        
        <p style={styles.text}>
          DebateHub is a platform designed for individuals to engage in meaningful discussions and debates on various topics. 
          Our mission is to foster critical thinking and encourage respectful dialogue among users.
        </p>
        
        <p style={styles.text}>
          Whether you're a seasoned debater or just starting out, DebateHub provides the tools and community to help you express 
          your ideas and challenge others in a constructive manner.
        </p>
        
        <p style={styles.text}>
          Join us today and be part of a vibrant community of thinkers and debaters!
        </p>

        {/* Create Debate Button */}
        <button onClick={navigateToCreateDebate} style={styles.createButton}>
          Create Debate
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 DebateHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Inline styles for better styling
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    background: '#1e1e1e', // Simple dark background (pitch-like)
    color: 'white', // Ensures text is visible on dark background
    minHeight: '100vh', // Full height for proper gradient coverage
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  image: {
    width: '50%',
    height: 'auto',
    borderRadius: '4px',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional shadow for the image
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  createButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff', // Simple blue button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
    backgroundColor: '#333', // Dark footer
    color: 'white',
    textAlign: 'center',
    padding: '10px',
  },
  footerText: {
    fontSize: '1rem',
  },
};
export default About;
