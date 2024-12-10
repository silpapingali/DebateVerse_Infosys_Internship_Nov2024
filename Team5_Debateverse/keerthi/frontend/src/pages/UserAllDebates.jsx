import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDebates } from "../redux/slices/allDebatesSlice";
import PagesButton from "../components/PagesButton";
import { FaFilter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const UserAllDebates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { debates, likes, totalRecords, currPage, isLoading } = useSelector(
    (states) => states.allDebates
  );

  useEffect(() => {
    dispatch(fetchAllDebates(1)); // Fetching the first page of debates
  }, [dispatch]);

  const handleNavigate = (debateId) => {
    navigate(`/debate/${debateId}`);
  };

  return (
    <div className="pt-16 lg:px-48 grid lg:grid-cols-[1fr,3fr] px-5 min-h-screen bg-emerald-400">
      {!isLoading && (
        <>
          {/* Sidebar for sorting */}
          <div className="hidden rounded-lg mb-1 lg:flex justify-center items-start bg-orange-500 h-screen">
            <h1 className="text-xl font-bold">Sorting Options</h1>
          </div>

          {/* Debates list */}
          <div className="h-screen flex flex-col gap-5 lg:p-5 pb-5 overflow-auto">
            <div className="flex pt-5 w-full justify-between items-center">
              <h1 className="text-2xl font-bold">{`Open Debates (${totalRecords})`}</h1>
              <button className="p-2 lg:hidden rounded-lg">
                <FaFilter size={25} />
              </button>
            </div>
            <input
              type="text"
              name="searchText"
              id="searchText"
              className="p-2 rounded-lg bg-orange-500 text-white"
              placeholder="Search Debates"
            />
            {debates[currPage].map((deb, ind) => (
              <div
                key={ind}
                className="cursor-pointer p-5 rounded-lg bg-white shadow-md flex flex-col gap-2"
                onClick={() => handleNavigate(deb._id)} // Navigate to DebateCard
              >
                <h1 className="text-lg font-bold">{deb.question}</h1>
                <p className="text-sm text-gray-500">
                  Posted by <span className="text-blue-600">{deb.createdBy}</span> on{" "}
                  {new Date(deb.createdOn).toLocaleDateString()}
                </p>
                <div className="flex justify-end items-center text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">{deb.totalLikes}</span> Likes
                  </span>
                </div>
              </div>
            ))}
          </div>
          <PagesButton />
        </>
      )}
    </div>
  );
};

export default UserAllDebates;
