import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { Heart, ThumbsUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { likeRequest, setLiked } from "../redux/slices/allDebatesSlice";
import { BiSolidUpvote } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { setQno, setDebate, setLike, fetchVotes} from "../redux/slices/votingSlice";

const DebateCard = ({ debate, liked, Qno, isMine}) => {
  const dispatch = useDispatch();
  const likeBtn = useRef(null);
  const navigate= useNavigate();
  const onCardClick = (e) => {
    dispatch(fetchVotes(debate._id));
    dispatch(setDebate(debate));
    dispatch(setLike(liked));
    dispatch(setQno(Qno));
    console.log("Card Clicked");
    navigate("/voting");
  };

  const handleLike = (_id, index) => {
      dispatch(likeRequest(_id));
      liked
        ? dispatch(setLiked({ index, val: -1 }))
        : dispatch(setLiked({ index, val: 1 }));
  };

  return (
    <div
      onClick={(e) => onCardClick(e)}
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
          ref={likeBtn}
          disabled={isMine}
          onClick={(e) => {
            e.stopPropagation();
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
        <h1 className="font-extrabold text-xl py-2">
          {Qno}. {debate.question}
        </h1>
      </div>

      <div className="flex gap-5 flex-col md:flex-row justify-start md:items-center">
        <div className="options w-full">
          {debate.options.map((option, ind) => {
            return (
              <div
                key={ind}
                className="option w-full flex-wrap font-bold flex justify-between py-1 items-center"
              >
                <div className="w-full bg-blue-400 rounded-lg px-2 flex gap-3 flex-wrap justify-between items-center">
                  <h1 key={ind}>{`${ind + 1}. ${option.answer}`}</h1>
                  <button
                    className={`flex gap-2 justify-center font-bold items-center`}
                  >
                    <BiSolidUpvote size={28} fill="white" />
                    {option.votes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="graph w-1/3">
          <h1>This is for the graph.</h1>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;