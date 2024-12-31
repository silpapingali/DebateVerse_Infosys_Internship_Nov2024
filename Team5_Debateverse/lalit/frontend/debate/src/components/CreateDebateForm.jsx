import React, { useState } from 'react';
import { postDebate } from '../api';

function CreateDebateForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await postDebate({ title, description });
      // Handle success (e.g., clear form, display success message)
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error("Error creating debate:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="bg-gray-200 p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Create New Debate</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            rows="4"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateDebateForm;