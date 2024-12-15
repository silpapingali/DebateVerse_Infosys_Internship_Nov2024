import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DebateList() {
  const [debates, setDebates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch debates from backend and add dummy created_by names using faker
    axios
      .get('http://localhost:8081/alldebates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        const debatesWithNames = response.data.map((debate) => ({
          ...debate,
          created_by: faker.name.fullName(),
        }));
        setDebates(debatesWithNames);
      })
      .catch((error) => console.error('Error fetching debates:', error));
  }, []);

  const handleLike = (debateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .post(
        `http://localhost:8081/debateList/${debateId}/reactions`,
        { action: 'like' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update likes count in debates state
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === debateId
              ? { ...debate, likes: response.data.likes }
              : debate
          )
        );
      })
      .catch((error) => console.error('Error liking debate:', error));
  };

  const handleUpvoteOption = (debateId, optionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .post(
        `http://localhost:8081/options/${optionId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update upvotes count in debates state
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === debateId
              ? {
                  ...debate,
                  options: debate.options.map((option) =>
                    option.id === optionId
                      ? { ...option, upvotes: response.data.upvotes }
                      : option
                  ),
                }
              : debate
          )
        );
      })
      .catch((error) => console.error('Error upvoting option:', error));
  };

  const generateBarChartData = (options) => {
    const labels = options.map((option) => option.text);
    const upvotes = options.map((option) => option.upvotes ? option.upvotes.length : 0);

    return {
      labels,
      datasets: [
        {
          label: 'Upvotes',
          data: upvotes,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <Navbar />
      <h2 style={{ marginLeft: '60px' }}>All Debates</h2>
      <div style={{ marginLeft: '60px' }}>
        {debates.length > 0 ? (
          debates.map((debate) => (
            <div
              key={debate.id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '20px',
                width: '80%',
                position: 'relative',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
                  {debate.likes} likes
                </span>
                <button
                  className="btn btn-light"
                  onClick={() => handleLike(debate.id)}
                  style={{
                    fontSize: '30px',
                    color: 'red',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    marginRight: '5px',
                  }}
                >
                  ❤️
                </button>
              </div>

              <h4>{debate.text}</h4>
              <p>Created on: {debate.created_on}</p>

              <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h5>Options:</h5>
                  {debate.options && debate.options.length > 0 ? (
                    debate.options.map((option) => (
                      <div
                        key={option.id}
                        style={{
                          padding: '10px',
                          marginBottom: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{option.text}</span>
                        <button
                          onClick={() => handleUpvoteOption(debate.id, option.id)}
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          Upvote ({option.upvotes ? option.upvotes.length : 0})
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No options available for this debate.</p>
                  )}
                </div>

                <div style={{ width: '40%' }}>
                  {debate.options && debate.options.length > 0 ? (
                    <Bar
                      data={generateBarChartData(debate.options)}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Upvotes for Debate Options',
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No data to display graph.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No debates found.</p>
        )}
      </div>
    </div>
  );
}

export default DebateList;
