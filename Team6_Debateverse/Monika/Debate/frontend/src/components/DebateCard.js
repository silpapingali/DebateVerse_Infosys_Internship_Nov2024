import React, { useState } from "react";
import { format } from "date-fns";
import { FaHeart, FaThumbsUp, FaComment } from "react-icons/fa";


const DebateCard = ({ debate, liked, Qno, isMine,date }) => {
  const [isVotePopup, setIsVotePopup] = useState(false);

  const handleLike = () => {
    // Handle like functionality here
    console.log("Like clicked!");
  };



  const formattedDate = date && !isNaN(new Date(date).getTime())
    ? format(new Date(date), 'dd/MM/yyyy')
    : 'Invalid Date';

  return (
    <div className={`rounded-lg p-5 w-full text-white ${isMine ? "bg-blue-600" : "bg-indigo-600"}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-sm">
          Asked by <span className="text-red-400">{debate.createdBy}</span> on{" "}
          <span className="text-green-400">{format(new Date(debate.createdOn), "dd-MM-yyyy, hh:mm a")}</span>
        </h1>
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-bold ${liked ? "text-red-500" : ""}`}
        >
          <FaHeart fill={liked ? "red" : "white"} /> {debate.totalLikes}
        </button>
      </div>

      <div>
        <h1 className="font-extrabold text-lg py-2">
          {Qno}. {debate.question}
        </h1>
      </div>

      <div>
      <p>Date: {formattedDate}</p>
      {/* Other content */}
    </div>

      <div className="flex flex-col md:flex-row gap-5 justify-start">
        <div className="options w-full">
          {debate.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 font-bold"
            >
              <span>{`${index + 1}. ${option.answer}`}</span>
              <button className="flex items-center gap-2">
                <FaThumbsUp /> {option.votes}
              </button>
            </div>
          ))}
        </div>
      </div>

      {isVotePopup && (
        <div className="flex items-center mt-4 gap-2">
          <button className="p-2 bg-violet-500 rounded-full">
            <FaThumbsUp />
          </button>
          <span className="bg-blue-600 px-4 py-1 rounded-lg">Vote Count</span>
          <button className="p-2 bg-violet-500 rounded-full">
            <FaComment />
          </button>
        </div>
      )}

      <div className="flex justify-center mt-4 gap-2">
        {!isMine && (
          <button
            onClick={() => setIsVotePopup(!isVotePopup)}
            className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            {isVotePopup ? "Submit" : "Vote"}
          </button>
        )}
        {isVotePopup && (
          <button
            onClick={() => setIsVotePopup(false)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DebateCard;
