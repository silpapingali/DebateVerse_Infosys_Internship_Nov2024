import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewDebate = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/debates/create", { title, options });
      alert("Debate created successfully!");
      setTitle("");
      setOptions(["", ""]);
    } catch (error) {
      console.error("Error creating debate:", error);
      alert("Failed to create debate.");
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2 className="mt-4">Create New Debate</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Debate Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {options.map((option, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">Option {index + 1}</label>
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={() => setOptions([...options, ""])}
        >
          Add Option
        </button>
        <button type="submit" className="btn btn-primary me-2">
          Create Debate
        </button>
        <button type="button" className="btn btn-outline-dark" onClick={handleGoBack}>
          Go Back
        </button>
      </form>
    </div>
  );
};

export default NewDebate;
