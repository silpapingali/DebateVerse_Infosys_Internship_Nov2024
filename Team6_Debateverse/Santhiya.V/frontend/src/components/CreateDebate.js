import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateDebate() {
  const [debateText, setDebateText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  // Get userId from localStorage or user context
  const createdBy = localStorage.getItem('userId'); // Or fetch it from context

  // Add a new option
  const addOption = () => {
    if (options.length >= 7) {
      alert("You cannot add more than 7 options.");
    } else {
      setOptions([...options, '']);
    }
  };

  // Remove an option
  const removeOption = (index) => {
    if (options.length <= 2) {
      alert("You must have at least 2 options.");
    } else {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Handle input change for options
  const handleOptionChange = (index, event) => {
    const newOptions = options.map((option, i) =>
      i === index ? event.target.value : option
    );
    setOptions(newOptions);
  };

  // Submit the debate and options
  const handleSubmit = () => {
    if (debateText && options.every(option => option.trim() !== '')) {
        const token = localStorage.getItem('token');

        if (token) {
            const debateData = {
                text: debateText,
                options: options.map(option => ({ text: option })),
                created_by: createdBy, // Ensure this matches your logic for fetching the user ID
                created_on: new Date().toISOString().split('T')[0]
            };

            console.log("Submitting Debate Data:", debateData); // Log debate data

            axios.post('http://localhost:8080/debatetopic', debateData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                console.log('Debate created successfully:', response.data);
                alert('Debate created successfully!');
                navigate('/home'); // Navigate to home after successful post
            })
            .catch(error => {
                console.error('Error creating debate:', error.response ? error.response.data : error);
                alert('Failed to create debate. Please try again.');
            });
        } else {
            alert('User not authenticated. Please log in.');
        }
    } else {
        alert('Please fill in all fields and provide at least 2 options.');
    }
  };

  return (
    <div 
      className="container my-5" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}
    >
      <div className="card p-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h2>Create Debate</h2>

        <div className="form-group">
          <label>Debate Topic</label>
          <input
            type="text"
            className="form-control"
            value={debateText}
            onChange={(e) => setDebateText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
              />
              <button type="button" onClick={() => removeOption(index)} className="btn btn-danger">-</button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addOption}>+</button>
        </div>

        <button className="btn btn-success" onClick={handleSubmit}>Post Debate</button>
      </div>
    </div>
  );
}

export default CreateDebate;

