import React, { useState } from "react";
import { format } from "date-fns";
import { FaHeart, FaThumbsUp, FaComment } from "react-icons/fa";

const DebateCard = ({ debate, liked = false, Qno, isMine = false, date, onLike }) => {
  const [isVotePopup, setIsVotePopup] = useState(false);
  const [localLiked, setLocalLiked] = useState(liked); // Track like state locally
  const [voteCounts, setVoteCounts] = useState(debate.options?.map(option => option.votes || 0)); // Track vote counts for each option

  const handleLike = () => {
    // Toggle like state locally and trigger callback to update the database
    setLocalLiked(!localLiked);
    if (onLike) onLike(!localLiked); // Assuming onLike function is passed as prop to handle like in the parent component
  };

  const handleVote = (index) => {
    // Increment vote count for selected option
    const newVotes = [...voteCounts];
    newVotes[index] += 1;
    setVoteCounts(newVotes);

    // Logic to update the votes in your database or send it to the parent component
    // Example: onVote(index, newVotes); (if necessary)
  };

  const formattedDate =
    date && !isNaN(new Date(date).getTime())
      ? format(new Date(date), "dd/MM/yyyy")
      : "Invalid Date";

  const createdOnDate =
    debate.createdOn && !isNaN(new Date(debate.createdOn).getTime())
      ? format(new Date(debate.createdOn), "dd-MM-yyyy, hh:mm a")
      : "Unknown Date";

  return (
    <div
      className={`rounded-lg p-5 w-full text-white ${isMine ? "bg-blue-600" : "bg-indigo-600"}`}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-sm">
          Asked by{" "}
          <span className="text-red-400">{debate.createdBy || "Anonymous"}</span>{" "}
          on <span className="text-green-400">{createdOnDate}</span>
        </h1>
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-bold ${localLiked ? "text-red-500" : ""}`}
        >
          <FaHeart fill={localLiked ? "red" : "white"} /> {debate.totalLikes || 0}
        </button>
      </div>

      <div>
        <h1 className="font-extrabold text-lg py-2">
          {Qno || "?"}. {debate.question || "No question provided"}
        </h1>
      </div>

      <div>
        <p>Date: {formattedDate}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 justify-start">
        <div className="options w-full">
          {debate.options && debate.options.length > 0 ? (
            debate.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 py-2 font-bold">
                <span>{`${index + 1}. ${option.answer || "No answer"}`}</span>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => handleVote(index)}
                  >
                    <FaThumbsUp /> {voteCounts[index] || 0}
                  </button>
                  <div
                    className="w-full h-2 bg-gray-400 rounded-full"
                    style={{
                      width: `${(voteCounts[index] / Math.max(...voteCounts, 1)) * 100}%`, // Bar length based on votes
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p>No options available</p>
          )}
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
