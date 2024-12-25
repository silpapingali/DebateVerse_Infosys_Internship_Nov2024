import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDebates } from "../redux/slices/userDebateSlice";
import DebateCard from "../components/DebateCard";
import PagesButton from "../components/PagesButton";
import { FaTrash } from "react-icons/fa6";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    debates,
    totalRecords,
    totalPages,
    currPage,
    isLoading,
    errorMessage,
  } = useSelector((states) => states.userDebates);

  useEffect(() => {
    dispatch(fetchUserDebates(1));
  }, [dispatch]);

  const redirectToCreateDebate = () => {
    navigate("/create-debate");
  };

  return (
    <div className="pt-16 grid lg:grid-cols-[1fr,2fr,1fr] px-5 min-h-screen bg-emerald-400">
      {!isLoading && (
        <>
          <div className="flex lg:col-start-2 justify-start items-center pb-5 flex-col gap-5">
            <div className="flex pt-5 w-full justify-between items-center">
              <h1 className="text-2xl font-bold">{`My Debates (${totalRecords})`}</h1>
              <button
                onClick={redirectToCreateDebate}
                className="bg-orange-500 font-bold px-10 py-2 rounded-lg text-white"
              >
                Create
              </button>
            </div>
            {debates[currPage].map((val, ind) => (
              <div key={ind} className="w-full">
                <div className="flex justify-end pb-1">
                  <button>
                    <FaTrash size={26} />
                  </button>
                </div>
                <DebateCard
                  debate={val}
                  Qno={(currPage - 1) * 10 + ind + 1}
                  isMine={true}
                />
              </div>
            ))}
            <PagesButton
              totalPages={totalPages}
              debates={debates}
              currPage={currPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
