import { useEffect, useState } from "react";
import CreateDebate from "../components/CreateDebate";
import DebateCard from "../components/DebateCard";
import { FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDebates } from "../redux/slices/userDebateSlice";
import PagesButton from "../components/PagesButton";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const {
    debates,
    totalRecords,
    totalPages,
    currPage,
    isLoading,
    errorMessage,
  } = useSelector((states) => states.userDebates);
  console.log(debates, totalPages, isLoading, errorMessage);

  const [isCreatePop, setIsCreatePop] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDebates(1));
  }, []);

  const showCreate = () => {
    setIsCreatePop(!isCreatePop);
  };

  return (
    <div className="pt-16 px-5 lg:px-72 min-h-screen bg-blue-400 p-1/2">
      {!isLoading && (
        <>
          <div className="flex py-5 justify-between items-center">
            <h1 className="text-2xl font-bold">{`My Debates (${totalRecords})`}</h1>
            <button
              onClick={showCreate}
              className="bg-blue-600 font-bold px-10 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
          <div className="flex justify-center items-center pb-5 flex-col gap-5">
            {debates[currPage].map((val, ind) => {
              return (
                <div key={ind} className="w-full">
                  <div className="flex justify-end pb-1">
                    <button>
                      <FaTrash size={26} />
                    </button>
                  </div>
                  <DebateCard
                    debate={val}
                    Qno={(currPage - 1) * 10 + ind + 1}
                  />
                </div>
              );
            })}
          </div>
          {isCreatePop && <CreateDebate showCreate={showCreate} />}
          <PagesButton />
        </>
      )}
    </div>
  );
};

export default UserDashboard;
