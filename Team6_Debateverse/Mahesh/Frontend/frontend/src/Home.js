// ... other imports
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home() {
  const [debates, setDebates] = useState([]);
  const [showAll, setShowAll] = useState(false); // Control whether to show all debates
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8081/debates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        // Sort debates by created_on in descending order
        const sortedDebates = response.data.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
        setDebates(sortedDebates);
      })
      .catch(error => console.error("Error fetching debates:", error));
  }, []);

  // Commenting out the handleLike function to disable its functionality
  // const handleLike = (debateId) => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     console.error("No token found");
  //     return;
  //   }

  //   const decodedToken = jwtDecode(token);
  //   const userId = decodedToken.id;

  //   axios.post(
  //     `http://localhost:8081/debates/${debateId}/reactions`,
  //     { action: 'like', userId },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       // Update the likes count based on the response
  //       setDebates(prevDebates =>
  //         prevDebates.map(debate =>
  //           debate.id === debateId
  //             ? { ...debate, likes: response.data.likes } // Update to use the number of likes directly
  //             : debate
  //         )
  //       );
  //     })
  //     .catch(error => console.error("Error liking debate:", error));
  // };

  // Function to format the date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' }); // Full month name
    const year = date.getFullYear();

    // Determine the day suffix
    const suffix = 
      day % 10 === 1 && day !== 11 ? 'st' : 
      day % 10 === 2 && day !== 12 ? 'nd' : 
      day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    return `${day}${suffix} ${month}, ${year}`;
  };

  // Determine the debates to display based on showAll state
  const displayedDebates = showAll ? debates : debates.slice(0, 5);

  return (
    <div>
      <Navbar />
      <button
        className="btn btn-primary ms-auto"
        type="button"
        onClick={() => navigate('/create-debate')}
        style={{ position: 'relative', top: '50px', left: '1250px' }}
      >
        Create Debate
      </button>
      <h2 style={{ marginLeft: '60px' }}>My Debates</h2>
      <div style={{ marginLeft: '60px' }}>
        {displayedDebates.length > 0 ? (
          displayedDebates.map(debate => (
            <div
              key={debate.id }
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '80%',
                position: 'relative',
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
                  {debate.likes} likes {/* Updated to display likes as a number */}
                </span>
                <button
                  className="btn btn-light"
                  // The button is disabled to prevent any action
                  disabled
                  style={{
                    fontSize: '30px',
                    color: 'red',
                    border: 'none',
                    background: 'none',
                    cursor: 'not-allowed', // Change cursor to indicate it's not clickable
                    marginRight: '5px',
                  }}
                >
                  ❤️
                </button>
              </div>
              <h4>{debate.text}</h4>
              <p>Created on: {formatDate(debate.created_on)}</p>
              <div style={{ display: 'flex' }}>
                <div style={{ marginTop: '10px', width: '60%' }}>
                  {debate.options && debate.options.length > 0 ? (
                    debate.options.map((option, index) => (
                      <div
                        key={option.id}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: '#f9f9f9',
                          width: '100%',
                        }}
                      >
                        <strong>{index + 1}. </strong>
                        {option.text} - {option.upvotes || 0} votes {/* Display total votes */}
                      </div>
                    ))
                  ) : (
                    <p>No options available for this debate.</p>
                  )}
                </div>
                <div style={{ width: '35%', marginLeft: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {debate.options && debate.options.length > 0 ? (
                      <Bar
                        data={{
                          labels: debate.options.map((_, index) => (index + 1).toString()), // Use indices as labels
                          datasets: [
                            {
                              label: 'Vote Distribution',
                              data: debate.options.map(option => option.upvotes || 0),
                              backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false, // Allow the graph to fill the container
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                        style={{ width: '100%', height: '150px' }} // Set width and height for the bar graph
                      />
                    ) : (
                      <p>No options available for bar graph.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No debates found.</p>
        )}

        {!showAll && debates.length > 5 && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowAll(true)}
            style={{ marginTop: '20px' }}
          >
            View All
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;