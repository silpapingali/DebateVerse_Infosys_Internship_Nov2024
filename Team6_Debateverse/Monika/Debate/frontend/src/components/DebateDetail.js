import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DebateDetails({ match }) {
  const [debate, setDebate] = useState(null);
  const debateId = match.params.id;

  useEffect(() => {
    axios
      .get(`http://localhost:8081/debates/${debateId}`)
      .then((response) => {
        setDebate(response.data);
      })
      .catch((error) => console.error('Error fetching debate details:', error));
  }, [debateId]);

  if (!debate) return <div>Loading...</div>;

  return (
    <div>
      <h2>{debate.text}</h2>
      <div>
        {debate.options.map((option) => (
          <div key={option.id}>
            <p>{option.text}</p>
            <button>Upvote</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebateDetails;
