import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DebateList() {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    
    axios
      .get('http://localhost:8081/api/debate/allDebates', {
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

  const generateBarChartData = (options) => {
    const labels = options.map((option) => option.text);
    const upvotes = options.map((option) => (option.upvotes ? option.upvotes.length : 0));

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
    <div
      style={{
        background: '#1e1e1e',
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
      }}
    >
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
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <h4>{debate.text}</h4>
              <p>Created on: {debate.created_on}</p>
              <p>Created by: {debate.created_by}</p>

              <div
                style={{
                  display: 'flex',
                  marginTop: '20px',
                  justifyContent: 'space-between',
                }}
              >
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
                        }}
                      >
                        <span>{option.text}</span>
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
