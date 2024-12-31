import React from 'react';

function DebateCard({ debate }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">{debate.title}</h2>
      <p>{debate.description}</p>
      <div className="mt-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Join Debate
        </button>
      </div>
    </div>
  );
}

export default DebateCard;