import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"; // Ensure you import your Navbar component

function Upvotes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { debateId } = location.state || {};
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingVotes, setRemainingVotes] = useState(10); // Initialize with 10 votes

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get(`http://localhost:8081/debates/${debateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDebate(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching debate:", error);
        setLoading(false);
      });
  }, [debateId]);

  const handleUpvote = (optionId) => {
    if (remainingVotes <= 0) {
      alert("You have no votes left!");
      return;
    }

    const updatedOptions = debate.options.map((option) => {
      if (option.id === optionId) {
        return { ...option, votes: (option.votes || 0) + 1 };
      }
      return option;
    });

    setDebate({ ...debate, options: updatedOptions });
    setRemainingVotes(remainingVotes - 1);
  };

  const handleDownvote = (optionId) => {
    const option = debate.options.find((option) => option.id === optionId);
    if (!option || (option.votes || 0) <= 0) {
      alert("No votes to remove!");
      return;
    }

    const updatedOptions = debate.options.map((option) => {
      if (option.id === optionId) {
        return { ...option, votes: (option.votes || 0) - 1 };
      }
      return option;
    });

    setDebate({ ...debate, options: updatedOptions });
    setRemainingVotes(remainingVotes + 1);
  };

  const handleSubmit = () => {
    if (remainingVotes > 0) {
      alert(`You have ${remainingVotes} votes left. Please use all your votes before submitting.`);
      return;
    }
  
    const votesData = debate.options.map((option) => ({
      optionId: option.id,
      votes: option.votes || 0,
    }));
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
  
    axios
      .post(`http://localhost:8081/debates/${debateId}/submitVotes`, { votes: votesData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Votes submitted successfully!");
        navigate('/debates'); // Navigate back to the debates page
      })
      .catch((error) => {
        console.error("Error submitting votes:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!debate) {
    return <p>No debate data available.</p>;
  }

  return (
    <div>
      <Navbar /> {/* Place Navbar here */}
      <div style={styles.container}>
        <h4 style={styles.title}>{debate.text}</h4>
        <p>Remaining Votes: {remainingVotes}</p>
        <div style={styles.optionsContainer}>
          {debate.options && debate.options.length > 0 ? (
            debate.options.map((option) => (
              <div key={option.id} style={styles.option}>
                <div style={styles.optionText}>
                  {option.text} ({option.votes || 0} votes)
                </div>
                <div style={styles.voteButtons}>
                  <button
                    onClick={() => handleUpvote(option.id)}
                    style={styles.voteButton}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDownvote(option.id)}
                    style={styles.voteButton}
                  >
                    -
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No options available for upvoting.</p>
          )}
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            Go Back
          </button>
          <button onClick={handleSubmit} style={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "800px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "left", // Align title to the left
  },
  optionsContainer: {
    marginBottom: "20px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    height: "60px",
  },
  optionText: {
    flex: 1,
    fontSize: "18px",
    color: "#333",
  },
  voteButtons: {
    display: "flex",
    flexDirection: "row", // Align buttons horizontally
    alignItems: "center",
    gap: "10px", // Add space between buttons
  },
  voteButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  backButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px", // Add margin to separate from the submit button
  },
  submitButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start", // Align buttons to the left
    marginTop: "20px", // Add margin to separate from the options
  },
};

export default Upvotes;