import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { faker } from '@faker-js/faker'; 

function DebateList() {
  const [debates, setDebates] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/debate/alldebates', {
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
        `http://localhost:8081/api/debate/${debateId}/reactions`,
        { action: 'like' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === debateId
              ? { ...debate, likes: Array.isArray(response.data.likes) ? response.data.likes : [] }
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
        `http://localhost:8081/api/options/${optionId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === debateId
              ? {
                  ...debate,
                  options: debate.options.map((option) =>
                    option.id === optionId
                      ? { ...option, upvotes: Array.isArray(response.data.upvotes) ? response.data.upvotes : [] }
                      : option
                  ),
                }
              : debate
          )
        );
      })
      .catch((error) => console.error('Error upvoting option:', error));
  };

  return (
    <div>
      <h2 style={{ marginLeft: '60px' }}>All Debates</h2>
      <div style={{ marginLeft: '60px' }}>
        {debates.length > 0 ? (
          debates.map((debate) => (
            <div
              key={debate.id}
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
                  {Array.isArray(debate.likes) ? debate.likes.length : 0} likes
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
              <p>Created by: {debate.created_by}</p>
              <p>Created on: {debate.created_on}</p>

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
                        {option.text}
                        <div>
                          <span>{Array.isArray(option.upvotes) ? option.upvotes.length : 0} upvotes</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No options available for this debate.</p>
                  )}
                </div>

                <div style={{ width: '35%', marginLeft: '20px' }}>
                  <h4>Upvotes Bar Graph</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {debate.options && debate.options.length > 0 ? (
                      debate.options.map((option, index) => (
                        <div
                          key={option.id}
                          style={{
                            width: '80%',
                            height: '30px',
                            backgroundColor: 'lightblue',
                            marginBottom: '10px',
                            textAlign: 'center',
                            lineHeight: '30px',
                            color: '#000',
                            position: 'relative',
                          }}
                        >
                          {Array.isArray(option.upvotes) ? option.upvotes.length : 0} upvotes
                          <div
                            style={{
                              height: '100%',
                              width: `${(Array.isArray(option.upvotes) ? option.upvotes.length : 0) * 10}%`,
                              backgroundColor: 'green',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                          />
                        </div>
                      ))
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
      </div>
    </div>
  );
}

export default DebateList;
