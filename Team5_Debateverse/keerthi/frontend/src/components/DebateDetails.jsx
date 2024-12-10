import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllDebates, likeDebateRequest } from "../redux/slices/allDebatesSlice";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const DebateDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currPage = useSelector((state) => state.allDebates.currPage);
  const debates = useSelector((state) => state.allDebates.debates[currPage]) || [];
  const likes = useSelector((state) => state.allDebates.likes[currPage]) || {};
  const isLoading = useSelector((state) => state.allDebates.isLoading);

  useEffect(() => {
    dispatch(fetchAllDebates(currPage));
  }, [dispatch, currPage]);

  const handleLike = (debateId) => {
    dispatch(likeDebateRequest({ debateId }));
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleGoBack}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        Go Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Debate Details</h1>
      {debates.length === 0 && <p>No debates available at the moment.</p>}
      {debates.map((debate) => (
        <div
          key={debate._id}
          className="border p-4 rounded-lg shadow mb-4 space-y-2"
        >
          {/* Entire debate Like Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{debate.question}</h3>
            <button
              onClick={() => handleLike(debate._id)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
            >
              <HeartIcon className="h-5 w-5" />
              <span>{likes[debate._id] ?? 0}</span>
            </button>
          </div>
          {/* List options */}
          {debate?.options?.map((option) => (
            <div key={option._id} className="text-sm text-gray-700">
              {option.answer} - Votes: {option.votes}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DebateDetails;
