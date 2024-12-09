import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './CreateDebate.css'; 
import { jwtDecode } from 'jwt-decode';  

function CreateDebate() {
  const [debateText, setDebateText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate(); 

  
  const addOption = () => {
    if (options.length >= 7) {
      alert("You cannot add more than 7 options.");
    } else {
      setOptions([...options, '']);
    }
  };

  
  const removeOption = (index) => {
    if (options.length <= 2) {
      alert("You must have at least 2 options.");
    } else {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  
  const handleOptionChange = (index, event) => {
    const newOptions = options.map((option, i) =>
      i === index ? event.target.value : option
    );
    setOptions(newOptions);
  };

  
  const handleSubmit = () => {
    if (debateText && options.every(option => option.trim() !== '')) {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);  
          const userId = decodedToken.id;  
          
          console.log("Token had been sent with request:", token);

          const currentTime = Date.now() / 1000; 
    
          if (decodedToken.exp < currentTime) {
              alert("Token expired. Please log in again.");
              navigate('/')
          }

          const debateData = {
            text: debateText,
            options: options.map(option => ({ text: option })),
            created_by: userId, 
            created_on: new Date().toISOString().split('T')[0]  
          };

          
          axios.post('http://localhost:8081/debates', debateData, {
            headers: {
                Authorization: `Bearer ${token}`,  
            },
          })
          .then(response => {
            console.log('Debate posted:', response.data);
            navigate('/home');  
          })
          .catch(error => {
            console.error('Error posting debate:', error);
          });
        } catch (error) {
          console.error("Error decoding token:", error);
          alert("Invalid token, please login again.");
        }
      } else {
        console.log("No token found");
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Create Debate</h2>

      <div className="form-group mb-3">
        <label htmlFor="debateText">Debate Topic</label>
        <input
          id="debateText"
          type="text"
          className="form-control"
          value={debateText}
          onChange={(e) => setDebateText(e.target.value)}
          placeholder="Enter debate topic"
        />
      </div>

      <div className="mb-4">
        <label>Options</label>
        {options.map((option, index) => (
          <div key={index} className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e)}
              placeholder={`Option ${index + 1}`}
            />
            <button 
              className="btn btn-danger" 
              type="button" 
              onClick={() => removeOption(index)} 
              style={{ marginLeft: '10px' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          className="btn btn-secondary" 
          type="button" 
          onClick={addOption}
        >
          Add Option
        </button>
      </div>

      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-success" 
          onClick={handleSubmit}
        >
          Post Debate
        </button>
        <button 
          className="btn btn-warning" 
          onClick={() => navigate('/home')}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default CreateDebate;

