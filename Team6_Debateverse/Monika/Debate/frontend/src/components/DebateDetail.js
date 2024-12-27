// DebateDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import DebateCard from "./DebateCard";

function DebateDetail() {
  const { id } = useParams(); 
  const [debate, setDebate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    axios
      .get(`http://localhost:8081/api/debate/debatedetail/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setDebate(response.data))
      .catch((error) => console.error("Error fetching debate details:", error));
  }, [id]);

  if (!debate) {
    return <p>Loading debate details...</p>;
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #4f5bd5, #bb2dbe)",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
      }}
    >
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
      <h2>Debate Details</h2>
      <div
        style={{
          margin: "20px 0",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
        }}
      >
        <h4>{debate.text}</h4>
        <p>Created By: {debate.created_by}</p>
        <p>Created On: {debate.created_on}</p>
        <p>Likes: {debate.likes}</p>

        <h5>Options:</h5>
        {debate.options.map((option) => (
          <div
            key={option.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <span>{option.text}</span> - Upvotes: {option.upvotes?.length || 0}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebateDetail;
