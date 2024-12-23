import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const CreateDebate = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formStyle = {
    border: "1px solid #ccc",
    padding: "16px",
    margin: "16px auto",
    width: "60%",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const labelStyle = { display: "block", margin: "8px 0", fontWeight: "bold" };
  const inputStyle = { padding: "8px", width: "90%", margin: "8px 0" };
  const buttonStyle = {
    margin: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#2196f3",
    color: "white",
  };
  const removeButtonStyle = {
    marginLeft: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#f44336",
    color: "white",
  };
  const addButtonStyle = {
    marginLeft: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#4caf50",
    color: "white",
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 7) {
      setOptions([...options, ""]);
      setMessage("");
    } else {
      setMessage("You can only add up to 7 options.");
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      setMessage("");
    } else {
      setMessage("You must have at least 2 options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (question.trim() && options.every((opt) => opt.trim())) {
      try {
        const response = await fetch("http://localhost:8081/api/debate/createdebate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            options: options,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setQuestion("");
          setOptions(["", ""]);
          setMessage("Debate successfully created!");

          
          setTimeout(() => {
            navigate("/debatelist");
          }, 2000);
        } else {
          setMessage(`Error: ${data.message || "Unable to create debate."}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage("Please enter a valid question and at least two options.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ ...formStyle, marginBottom: "8px" }}>
        <h2>New Debate</h2>
        {message && (
          <p
            style={{
              color: message.includes("successfully") ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Question:
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <h4>Options:</h4>
          {options.map((option, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span style={{ marginRight: "8px", fontWeight: "bold" }}>{index + 1}.</span>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                style={removeButtonStyle}
              >
                -
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} style={addButtonStyle}>
            +
          </button>
          <button type="submit" style={buttonStyle}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDebate;
