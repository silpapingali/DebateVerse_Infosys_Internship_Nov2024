import React, { useState, useEffect } from "react";
import axios from "axios";

const MyDebates = () => {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get("http://localhost:3001/debates");
        setDebates(response.data);
      } catch (error) {
        console.error("Failed to fetch debates", error);
      }
    };

    fetchDebates();
  }, []);

  return (
    <div>
      <h2>My Debates</h2>
      {debates.map((debate) => (
        <div key={debate._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{debate.title}</h5>
            <ul className="list-group list-group-flush">
              {debate.options.map((option) => (
                <li className="list-group-item" key={option._id}>
                  {option.text} - Votes: {option.votes}
                </li>
              ))}
            </ul>
            <p className="mt-3">Likes: {debate.likes}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyDebates;
