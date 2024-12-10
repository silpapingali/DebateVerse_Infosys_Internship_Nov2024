import React, { useContext, useState } from "react";
import { format } from "date-fns";
import { Heart, MessageCircleMore, ThumbsUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { likeRequest, setLiked } from "../redux/slices/allDebatesSlice";
import Vote from "./Vote";
import { FaPlus, FaMinus } from "react-icons/fa";

const DebateCard = ({ debate, liked, Qno, isMine }) => {
  const dispatch = useDispatch();
  // console.log(liked);

  const [isVotePopup, setIsVotePopup] = useState(0);

  const handleLike = (_id, index) => {
    dispatch(likeRequest(_id));
    liked
      ? dispatch(setLiked({ index, val: -1 }))
      : dispatch(setLiked({ index, val: 1 }));
  };

  return (
    <div
      className={`${
        isMine ? "bg-blue-600" : "bg-indigo-600"
      } rounded-lg p-5 w-full text-white `}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">
          Asked by <span className="text-red-400">{debate.createdBy}</span> on{" "}
          <span className="text-green-400">
            {format(new Date(debate.createdOn), "dd-MM-yyyy,  hh:mm a")}
          </span>
        </h1>
        <button
          disabled={isMine}
          onClick={() => {
            handleLike(debate._id, Qno - 1);
          }}
          className={`flex gap-3 justify-center ${
            liked ? "text-red-500" : ""
          } font-bold items-center`}
        >
          <Heart fill={liked ? "red" : "white"} />
          {debate.totalLikes}
        </button>
      </div>

      <div>
        <h1 className="font-extrabold text-lg py-2">
          {Qno}. {debate.question}
        </h1>
      </div>

      <div className="flex gap-5 flex-col md:flex-row justify-start md:items-center">
        <div className="options w-full">
          {debate.options.map((option, ind) => {
            return (
              <div
                key={ind}
                className="option w-full gap-3 flex-wrap font-bold flex justify-start py-1 items-center"
              >
                <h1 key={ind}>{`${ind + 1}. ${option.answer}`}</h1>
                <div className="flex ml-10 gap-5 justify-start items-center">
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
                {isVotePopup != 0 && (
                  <div className="flex justify-center items-center gap-1 md:ml-10">
                    <button className="p-2 rounded-full bg-violet-500">
                      <FaMinus size={16} />
                    </button>
                    <h1 className="px-5 py-1 bg-blue-600 rounded-xl">5</h1>
                    <button className="p-2 rounded-full bg-violet-500">
                      <FaPlus size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="graph w-1/3">
          <h1>This is for the graph.</h1>
        </div>
      </div>
      <div className="flex mt-5 gap-2 flex-col md:flex-row justify-center items-center">
        {!isMine && (
          <button
            onClick={() => {
              setIsVotePopup(Qno);
            }}
            className="w-full bg-emerald-500 rounded-lg p-2 font-bold text-lg"
          >
            {isVotePopup ? "Submit" : "Vote"}
          </button>
        )}
        {isVotePopup != 0 && (
          <button
            onClick={() => {
              setIsVotePopup(0);
            }}
            className="w-full bg-red-500 rounded-lg p-2 font-bold text-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DebateCard;
