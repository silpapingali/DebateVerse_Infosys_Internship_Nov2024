import React from "react";
import { format } from "date-fns";

const DebateCard = ({ debate }) => {
  const maxLikes = Math.max(...debate.options.map((opt) => opt.likes));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <p className="text-gray-600 text-sm mb-2">
        Asked on {format(new Date(debate.date), "MMM dd, yyyy")}
      </p>
      <h3 className="text-lg font-bold mb-4">{debate.title}</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Options with Likes and Comments */}
        <div className="space-y-2">
          {debate.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
            >
              <span className="text-gray-800">{option.text}</span>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>{option.likes}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>{option.comments}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Graph */}
        <div className="flex flex-col space-y-2">
          {debate.options.map((option, index) => {
            const percentage = maxLikes > 0 ? (option.likes / maxLikes) * 100 : 0;
            return (
              <div key={index} className="flex items-center">
                <div
                  className="h-4 bg-orange-500 rounded"
                  style={{ width: `${percentage}%` }}
                />
                <span className="ml-2 text-sm text-gray-600">{option.likes}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
