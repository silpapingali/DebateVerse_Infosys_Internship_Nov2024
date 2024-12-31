import { useEffect, useState } from "react";
import CreateDebate from "../components/CreateDebate";
import DebateCard from "../components/DebateCard";
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

  const [isCreatePop, setIsCreatePop] = useState(false);
  useEffect(() => {
    if (isCreatePop) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCreatePop]);

  useEffect(() => {
    dispatch(fetchUserDebates(1));
  }, []);

  const showCreate = () => {
    setIsCreatePop(!isCreatePop);
  };

  return (
    <div className="pt-16 grid lg:grid-cols-[1fr,2fr,1fr] px-5 min-h-screen bg-blue-400">
      {!isLoading && (
        <>
          <div className="flex lg:col-start-2 justify-start items-center pb-5 flex-col gap-5">
            <div className="flex pt-5 w-full justify-between items-center">
              <h1 className="text-2xl font-bold">{`My Debates (${totalRecords})`}</h1>
              <button
                onClick={showCreate}
                className="bg-blue-600 font-bold px-10 py-2 rounded-lg text-white"
              >
                Create
              </button>
            </div>
            {debates[currPage].map((val, ind) => {
              return (
                <div key={ind} className="w-full">
                  <div className="flex justify-end pb-1">
                  </div>
                  <DebateCard
                    debate={val}
                    Qno={(currPage - 1) * 10 + ind + 1}
                    isMine={true}
                  />
                </div>
              );
            })}
            {isCreatePop && <CreateDebate showCreate={showCreate} />}
            <PagesButton
              from="user"
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
