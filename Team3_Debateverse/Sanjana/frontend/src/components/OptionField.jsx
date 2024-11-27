import React from "react";

const OptionField = ({ options, onAddOption, onRemoveOption, onChangeOption }) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Options:</label>
      {options.map((option, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={option}
            onChange={(e) => onChangeOption(index, e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder={`Option ${index + 1}`}
          />
          <button
            onClick={() => onRemoveOption(index)}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={onAddOption}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Add Option
      </button>
    </div>
  );
};

export default OptionField;
