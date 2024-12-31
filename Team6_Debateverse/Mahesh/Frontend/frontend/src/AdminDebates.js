import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2"; 
import Navbar from "./AdminNavbar"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { faker } from '@faker-js/faker'; 


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Admin() {
  const [debates, setDebates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [likesGreaterThan, setLikesGreaterThan] = useState(0);
  const [votesGreaterThan, setVotesGreaterThan] = useState(0);
  const [exactMatch, setExactMatch] = useState(false);
  const [postedAfter, setPostedAfter] = useState(null);
  const [showMore, setShowMore] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8081/alldebates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      const debatesWithRandomNames = response.data.map(debate => ({
        ...debate,
        created_by: faker.name.fullName(), 
      }));
      setDebates(debatesWithRandomNames);
    } catch (error) {
      console.error('Error fetching debates:', error);
    }
  };

  const handleDeleteDebate = (debateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    if (window.confirm(`Are you sure you want to delete this debate ?`)){
    axios
        .post(`http://localhost:8081/debates/${debateId}/delete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            
            setDebates((prevDebates) =>
                prevDebates.map((debate) =>
                    debate.id === debateId ? { ...debate, is_deleted: 'yes' } : debate
                )
            );
        })
        .catch((error) => console.error('Error deleting debate:', error));
      }
  };

  const handleDeleteOption = (optionId, debateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    if (window.confirm(`Are you sure you want to delete this option ?`)){
    axios
        .post(`http://localhost:8081/options/${optionId}/delete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            
            setDebates((prevDebates) =>
                prevDebates.map((debate) => {
                    if (debate.id === debateId) {
                        const updatedOptions = debate.options.map(option =>
                            option.id === optionId ? { ...option, is_deleted: 'yes' } : option
                        );
                        return { ...debate, options: updatedOptions };
                    }
                    return debate;
                })
            );
        })
        .catch((error) => console.error('Error deleting option:', error));
      }
  };

  const handleRetrieveDebate = (debateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    if (window.confirm(`Are you sure you want to retrieve this debate ?`)){

    axios
        .post(`http://localhost:8081/debates/${debateId}/retrieve`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
           
            setDebates((prevDebates) =>
                prevDebates.map((debate) =>
                    debate.id === debateId ? { ...debate, is_deleted: 'no' } : debate
                )
            );
        })
 .catch((error) => console.error('Error retrieving debate:', error));
      }
  };

  const handleRetrieveOption = (optionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    if (window.confirm(`Are you sure you want to retrieve this option ?`)){
    axios
        .post(`http://localhost:8081/options/${optionId}/retrieve`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
          
            setDebates((prevDebates) => {
                return prevDebates.map(debate => {
                    if (debate.options) {
                        const updatedOptions = debate.options.map(option => 
                            option.id === optionId ? { ...option, is_deleted: 'no' } : option
                        );
                        return { ...debate, options: updatedOptions };
                    }
                    return debate;
                });
            });
        })
        .catch((error) => console.error('Error retrieving option:', error));
      }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';

    return `${day}${suffix} ${month}, ${year}`;
  };

  const filteredDebates = debates.filter((debate) => {
    const matchesSearch = exactMatch
      ? debate.text.toLowerCase() === searchTerm.toLowerCase() 
      : debate.text.toLowerCase().includes(searchTerm.toLowerCase()); 
    const matchesLikes = debate.likes >= likesGreaterThan;
    const matchesVotes = debate.options.some(option => option.upvotes >= votesGreaterThan);
    const matchesDate = !postedAfter || new Date(debate.created_on) >= new Date(postedAfter);
    return matchesSearch && matchesLikes && matchesVotes && matchesDate;
  });

  const displayedDebates = showMore ? filteredDebates : filteredDebates.slice(0, 5);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 60px' }}>
        <h2>User Debates</h2>
      </div>
      <div style={{ marginLeft: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
        />
        <div style={{ marginBottom: '20px' }}>
          <label>
            Likes greater than:
            <input
              type="number"
              value={likesGreaterThan}
              onChange={(e) => setLikesGreaterThan(Number(e.target.value))}
              style={{ marginLeft: '10px', width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '20px' }}>
            Votes greater than:
            <input
              type="number"
              value={votesGreaterThan}
              onChange={(e) => setVotesGreaterThan(Number(e.target.value))}
              style={{ marginLeft: '10px', width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '20px' }}>
            Exact Match:
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={(e) => setExactMatch(e.target.checked)}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <label style={{ marginLeft: '20px' }}>
            Posted After:
            <input
              type="date"
              value={postedAfter}
              onChange={(e) => setPostedAfter(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        {displayedDebates.length > 0 ? (
          displayedDebates.map((debate) => (
            <div
              key={debate.id}
              style={{
                  marginBottom: '20px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  width: '80%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  opacity: debate.is_deleted === 'yes' ? 0.5 : 1, 
                }}
            >
              <div style={{ flex: 1, marginRight: '20px', width: '60%' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {debate.is_deleted === 'no' ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteDebate(debate.id)}
                      style={{
                        fontSize: '20px',
                        marginLeft: '10px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    >
                       ❌ Close Debate
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => handleRetrieveDebate(debate.id)}
                      style={{
                        fontSize: '20px',
                        marginLeft: '10px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 Retrieve Debate
                    </button>
                  )}
                </div>
                <h4>{debate.text}</h4>
                <p>Created by: {debate.email}</p> 
                <p>Created on: {formatDate(debate.created_on)}</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {debate.options && debate.options.length > 0 ? (
                    debate.options.map((option, index) => (
                      <div
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '10px',
                          opacity: option.is_deleted === 'yes' ? 0.5 : 1, 
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            background: `linear-gradient(to right, #4caf50, #a5d6a7)`,
                            height: '25px',
                            borderRadius: '5px',
                            textAlign: 'center',
                            lineHeight: '25px',
                            color: '#fff',
                            fontWeight: 'bold',
                            marginRight: '10px',
                          }}
                        >
                          {index + 1}. {option.text}
                        </div>
                        <div>
                          <span
                            style={{
                              backgroundColor: '#4caf50',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              color: '#fff',
                              fontWeight: 'bold',
                            }}
                          >
                            {option.upvotes || 0} votes
                          </span>
                        </div>
                        {option.is_deleted === 'yes' && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleRetrieveOption(option.id)} 
                            style={{
                              fontSize: '20px',
                              marginLeft: '10px',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            🔄 Retrieve Option
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteOption(option.id, debate.id)} 
                          style={{
                            fontSize: '20px',
                            marginLeft: '10px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete Option
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No options available for this debate.</p>
                  )}
                </div>
              </div>
              <div style={{ width: '300px', height: '150px', marginTop: '120px' }}>
                <Bar
                  data={{
                    labels: debate.options.map((_, index) => (index + 1).toString()),
                    datasets: [
                      {
                        label: 'Vote Distribution',
                        data: debate.options.map((option) => option.upvotes || 0),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y 
                      : {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No debates found.</p>
        )}
        {!showMore && filteredDebates.length > 5 && (
          <button onClick={() => setShowMore(true)} style={{ marginTop: '20px' }}>
            View All
          </button>
        )}
        {showMore && (
          <button onClick={() => setShowMore(false)} style={{ marginTop: '20px' }}>
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}

export default Admin;