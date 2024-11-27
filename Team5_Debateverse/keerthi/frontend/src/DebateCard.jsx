import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DebateCard = () => {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get('http://localhost:3001/debates');
        setDebates(response.data);
      } catch (error) {
        console.error('Failed to fetch debates', error);
      }
    };

    fetchDebates();
  }, []);

  const handleVote = async (debateId, optionId) => {
    try {
      await axios.post(`http://localhost:3001/debates/vote/${debateId}`, {
        optionId,
      });
      alert('Vote counted');
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };

  const handleLike = async (debateId) => {
    try {
      await axios.post(`http://localhost:3001/debates/like/${debateId}`);
      alert('Debate liked');
    } catch (error) {
      console.error('Failed to like debate', error);
    }
  };

  return (
    <div>
      <h2>Debates</h2>
      {debates.map((debate) => (
        <div key={debate._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{debate.title}</h5>
            <ul className="list-group list-group-flush">
              {debate.options.map((option) => (
                <li className="list-group-item" key={option._id}>
                  {option.text} - Votes: {option.votes}
                  <button
                    className="btn btn-sm btn-primary ms-2"
                    onClick={() => handleVote(debate._id, option._id)}
                  >
                    Vote
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-sm btn-success mt-3"
              onClick={() => handleLike(debate._id)}
            >
              Like - {debate.likes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebateCard;
