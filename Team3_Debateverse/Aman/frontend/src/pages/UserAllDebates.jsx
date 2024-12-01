import { useEffect, useState } from "react";
import DebateCard from "../components/DebateCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDebates } from "../redux/slices/allDebatesSlice";
import PagesButton from "../components/PagesButton";

const UserAllDebates = () => {

  const dispatch = useDispatch();
  const {debates, totalRecords, currPage, isLoading, errorMessage} = useSelector((states)=> states.allDebates)
  // console.log(totalRecords, isLoading, errorMessage, debates);

  const [isCreatePop, setIsCreatePop] = useState(false);
  const showCreate = () => {
    setIsCreatePop(!isCreatePop);
  };

  useEffect(() => {
    console.log("in effect in all debates")
    dispatch(fetchAllDebates(1));
  }, []);

  return (
    <div className="pt-16 px-5 lg:px-72 min-h-screen bg-blue-400 p-1/2">
      {!isLoading && (
        <>
          <div className="flex py-5 justify-between items-center">
            <h1 className="text-2xl font-bold">{`Open Debates (${totalRecords})`}</h1>
          </div>
          <div className="flex justify-center items-center pb-5 flex-col gap-5">
            {debates[currPage].map((val, ind) => {
              return (
                <div key={ind} className="w-full">
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

export default UserAllDebates;
