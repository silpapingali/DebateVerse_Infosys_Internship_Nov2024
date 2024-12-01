import React, { useState } from "react";
import { format } from "date-fns";
import { Heart, MessageCircleMore, ThumbsUp } from "lucide-react";

const DebateCard = ({ debate, Qno }) => {
  const [isLike, setIsLike] = useState(false);

  const handleLike = () => {
    setIsLike(!isLike);
  };

  return (
    <div className="bg-blue-600 rounded-lg p-5 w-full">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">
          Asked by <span className="text-green-400">{debate.createdBy}</span> on{" "}
          <span className="text-green-400">
            {format(new Date(debate.createdOn), "dd-MM-yyyy,  hh:mm a")}
          </span>
        </h1>
        <button
          onClick={handleLike}
          className={`flex gap-3 justify-center ${
            isLike ? "text-red-500" : ""
          } font-bold items-center`}
        >
          <Heart fill={isLike ? "red" : ""} />
          {debate.totalLikes}
        </button>
      </div>

      <div>
        <h1 className="font-extrabold text-lg py-2">
          {Qno}. {debate.question}
        </h1>
      </div>

      <div className="flex gap-5 flex-col md:flex-row justify-between md:items-center">
        <div className="options lg:w-1/2">
          {debate.options.map((option, ind) => {
            return (
              <div
                key={ind}
                className="option w-full font-bold flex justify-between gap-10 py-1 items-center"
              >
                <h1 key={ind}>{`${ind + 1}. ${option.answer}`}</h1>
                <div className="flex gap-5 justify-between items-center">
                  <button
                    className={`flex gap-2 justify-center font-bold items-center`}
                  >
                    <ThumbsUp />
                    {option.votes}
                  </button>
                  <button
                    className={`flex gap-2 justify-center font-bold items-center`}
                  >
                    <MessageCircleMore />
                    {option.votes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="graph">
          <h1>This is for the graph.</h1>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
