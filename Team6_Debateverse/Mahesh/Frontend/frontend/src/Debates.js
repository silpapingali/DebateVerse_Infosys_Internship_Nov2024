import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2"; 
import Navbar from "./Navbar"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jwtDecode } from 'jwt-decode';
import { faker } from '@faker-js/faker'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Debates() {
  const [debates, setDebates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [likesGreaterThan, setLikesGreaterThan] = useState(0);
  const [votesGreaterThan, setVotesGreaterThan] = useState(0);
  const [exactMatch, setExactMatch] = useState(false);
  const [postedAfter, setPostedAfter] = useState(null);
  const [showMore, setShowMore] = useState(false); 
  const [likedDebates, setLikedDebates] = useState(new Set()); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get('http://localhost:8081/alldebates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const debatesWithRandomNames = response.data.map(debate => ({
          ...debate,
          created_by: faker.name.fullName(),
        }));
        setDebates(debatesWithRandomNames);

        
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const likedResponse = await axios.get(`http://localhost:8081/user/${userId}/likedDebates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const likedSet = new Set(likedResponse.data.map(like => like.debate_id));
        setLikedDebates(likedSet);
      } catch (error) {
        console.error('Error fetching debates:', error);
      }
    };

    fetchDebates();
  }, []);

  const handleLike = (debateId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    axios
      .post(
        `http://localhost:8081/debates/${debateId}/reactions`,
        { action: 'like' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedLikes = response.data.likes;

        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === debateId
              ? { ...debate, likes: updatedLikes }
              : debate
          )
        );

        
        setLikedDebates((prev) => {
          const newLikedDebates = new Set(prev);
          if (newLikedDebates.has(debateId)) {
            newLikedDebates.delete(debateId); 
          } else {
            newLikedDebates.add(debateId); 
          }
          return newLikedDebates;
        });
      })
      .catch((error) => console.error('Error liking debate:', error));
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
        ? ' nd'
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

  const navigateToUpvotes = (debateId) => {
    navigate('/upvotes', { state: { debateId } });
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 60px' }}>
        <h2>All Debates</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          Go Back
        </button>
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
              {debate.is_deleted === 'yes' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(255, 0, 0, 0.7)',
                  color: '#fff',
                  padding: '5px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                }}>
                  This debate has been deleted by the admin
                </div>
              )}
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
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#555',
                    }}
                  >
                    {debate.likes} {debate.likes === 1 ? 'like' : 'likes'}
                  </span>
                  <button
                    className="btn btn-light"
                    onClick={() => handleLike(debate.id)}
                    style={{
                      fontSize: '30px',
                      color: likedDebates.has(debate.id) ? 'gray' : 'red',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      marginRight: '5px',
                      opacity: debate.is_deleted === 'yes' ? 0.5 : 1, 
                      pointerEvents: debate.is_deleted === 'yes' ? 'none' : 'auto', 
                    }}
                  >
                    ❤️
                  </button>
                  <button
                    className="btn btn-light"
                    onClick={() => navigateToUpvotes(debate.id)}
                    style={{
                      fontSize: '20px',
                      color: 'blue',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      marginLeft: '10px',
                      opacity: debate.is_deleted === 'yes' ? 0.5 : 1, 
                      pointerEvents: debate.is_deleted === 'yes' ? 'none' : 'auto', 
                    }}
                  >
                    👍 Vote
                  </button>
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
        <div style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}>
          This option has been deleted by the admin
        </div>
      )}
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
                      y:{beginAtZero: true,
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

export default Debates;