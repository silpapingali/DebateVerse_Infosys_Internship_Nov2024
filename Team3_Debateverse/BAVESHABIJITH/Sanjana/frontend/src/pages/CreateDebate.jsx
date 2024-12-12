import React, { useState, useContext } from "react";
import OptionField from "../components/OptionField";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const CreateDebate = () => {
  const [question, setQuestion] = useState(""); // State for question
  const [options, setOptions] = useState([""]); // State for options
  const { userDebates, setUserDebates } = useContext(UserContext); // Get userDebates from context
  const navigate = useNavigate();

  // Add a new option
  const addOption = () => setOptions([...options, ""]);

  // Remove an option
  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  // Update an option's value
  const changeOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Handle submission of debate
  const handleSubmit = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please provide a valid question and options.");
      return;
    }

    const newDebate = {
      id: Date.now(), // Unique ID
      title: question,
      options,
      date: new Date().toISOString(),
      likes: 0, // Initial likes count
    };

    // Update global state or local storage
    setUserDebates([...userDebates, newDebate]); // Add new debate to the user's debates

    // Clear inputs after submission
    setQuestion("");
    setOptions([""]);

    // Navigate back to the User Dashboard or My Debates page
    navigate("/userdashboard");
  };

  return (
    <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
      <h1 className="text-3xl font-bold mb-4 text-white">Create New Debate</h1>
      <div className="bg-white p-6 rounded shadow">
        {/* Input field for the question */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your debate question"
          />
        </div>

        {/* Option fields */}
        <OptionField
          options={options}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onChangeOption={changeOption}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Submit Debate
        </button>
      </div>
    </div>
  );
};

export default CreateDebate;
