import React from "react";

const OptionField = ({ 
  question, 
  setQuestion, 
  options, 
  addOption, 
  removeOption, 
  changeOption 
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Question Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Type your question here..."
        />
      </div>

      {/* Options List */}
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={option}
            onChange={(e) => changeOption(index, e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder={`Option ${index + 1}`}
          />
          <button
            onClick={() => removeOption(index)}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="w-full mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Option
      </button>
    </div>
  );
};

export default OptionField;
