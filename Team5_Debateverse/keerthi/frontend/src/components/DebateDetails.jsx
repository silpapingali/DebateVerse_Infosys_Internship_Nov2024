import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllDebates, likeDebateRequest, voteOption } from "../redux/slices/allDebatesSlice";
import { HeartIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { useParams, useNavigate } from "react-router-dom";

const DebateDetails = () => {
  const { debateId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currPage = useSelector((state) => state.allDebates.currPage);
  const isLoading = useSelector((state) => state.allDebates.isLoading);

  const debate = useSelector((state) =>
    state.allDebates.debates[currPage]?.find((d) => d._id === debateId)
  );
  const likes = useSelector((state) =>
    state.allDebates.likes[currPage]?.[debateId] ?? 0
  );

  useEffect(() => {
    dispatch(fetchAllDebates(currPage));
  }, [dispatch, currPage]);

  const handleLike = () => {
    dispatch(likeDebateRequest({ debateId }));
  };

  const handleVote = (optionId) => {
    dispatch(voteOption({ debateId, optionId }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="text-center text-xl font-medium">Loading...</div>;
  }

  if (!debate) {
    return <div className="text-center text-xl font-medium">Debate not found.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-400">
      <div className="w-[600px] bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-bold mb-6 text-center">{debate.question}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLike}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            <span>{likes} Likes</span>
          </button>
        </div>

        <div className="space-y-3">
          {debate.options?.map((option) => (
            <div
              key={option._id}
              className="flex items-center justify-between border p-3 rounded-md shadow-sm bg-gray-50"
            >
              <span className="text-sm font-medium">{option.answer}</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 text-sm">Votes: {option.votes}</span>
                <button
                  onClick={() => handleVote(option._id)}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-sm"
                >
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="absolute bottom-4 right-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default DebateDetails;
