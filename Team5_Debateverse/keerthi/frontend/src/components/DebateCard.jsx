import React from "react";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const DebateCard = ({ debate, liked, Qno, isMine }) => {
  return (
    <div className="bg-orange-500 rounded-lg p-5 w-full text-white">
      {/* Header with creator and date */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">
          Posted by{" "}
          <span className="text-blue-600">{debate.createdBy}</span> on{" "}
          <span className="text-green-400">
            {format(new Date(debate.createdOn), "dd-MM-yyyy, hh:mm a")}
          </span>
        </h1>
        {/* Like button */}
        <button className="flex gap-2 items-center font-bold">
          <Heart fill={liked ? "red" : "white"} />
          {debate.totalLikes}
        </button>
      </div>

      {/* Debate question clickable - navigates to the details page */}
      <div>
        <Link to={`/debate/${debate._id}`}>
          <h1 className="font-extrabold text-lg py-2 hover:underline cursor-pointer">
            {Qno}. {debate.question}
          </h1>
        </Link>
      </div>

      {/* Displaying Options */}
      <div className="flex flex-col gap-3">
        {debate.options.map((option, ind) => (
          <div
            key={ind}
            className="flex justify-between items-center py-1 border-b border-white/20"
          >
            <h1 className="font-bold">{`${ind + 1}. ${option.answer}`}</h1>
            <div className="flex items-center gap-2 font-bold">
              {option.votes} <span className="ml-auto">👍</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebateCard;
