import React from 'react';
import { Minus, Heart, MessageSquare, X } from 'lucide-react';

const adminDebateCard = ({ debate, onRemoveOption, onUpdateDebate, onCloseDebate }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${!debate.isActive ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" />
            <span>{debate.likes} Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-500" />
            <span>{debate.responses}k</span>
          </div>
        </div>
        <button
          onClick={() => onCloseDebate(debate.id)}
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
          title={debate.isActive ? "Close Debate" : "Debate Closed"}
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Question:</h3>
        <p>{debate.question}</p>
      </div>

      <div className="space-y-3">
        {debate.options.map((option, index) => (
          <div key={index} className="flex items-center justify-between bg-orange-100 p-3 rounded">
            <span>{`${index + 1}: ${option}`}</span>
            {debate.isActive && (
              <button
                onClick={() => onRemoveOption(debate.id, index)}
                className="text-red-500 hover:text-red-700"
                title="Remove Option"
              >
                <Minus size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="h-40 bg-orange-50 rounded flex items-end">
          {debate.options.map((_, index) => (
            <div
              key={index}
              className="bg-orange-400 w-1/5 mx-1"
              style={{ height: `${Math.random() * 100}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {debate.isActive && (
          <button
            onClick={() => onUpdateDebate(debate.id)}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default adminDebateCard;