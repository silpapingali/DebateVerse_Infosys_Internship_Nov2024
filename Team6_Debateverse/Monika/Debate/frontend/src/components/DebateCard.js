import React from "react";

const DebateCard = ({ debate }) => (
  <div style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
    <h3>{debate.question}</h3>
    <div>
      {debate.options.map((option, idx) => (
        <div key={idx}>
          <span>{option.text}</span>
          <span> - {option.votes} votes</span>
        </div>
      ))}
    </div>
  </div>
);

export default DebateCard;
