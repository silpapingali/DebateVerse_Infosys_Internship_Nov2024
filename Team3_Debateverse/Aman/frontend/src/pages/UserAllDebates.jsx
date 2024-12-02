import { useEffect, useState } from "react";
import DebateCard from "../components/DebateCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDebates } from "../redux/slices/allDebatesSlice";
import PagesButton from "../components/PagesButton";
import { FaFilter } from "react-icons/fa6";

const UserAllDebates = () => {
  const dispatch = useDispatch();
  const { debates, likes, totalRecords, currPage, isLoading, errorMessage } =
    useSelector((states) => states.allDebates);

  const [isCreatePop, setIsCreatePop] = useState(false);
  const showCreate = () => {
    setIsCreatePop(!isCreatePop);
  };

  useEffect(() => {
    console.log("in effect in all debates");
    dispatch(fetchAllDebates(1));
  }, []);

  return (
    <div className="pt-16 lg:px-52 grid lg:grid-cols-[1fr,2fr] px-5 min-h-screen bg-blue-400">
      {!isLoading && (
        <>
          <div className="hidden rounded-lg mb-1 lg:flex justify-center items-start bg-blue-600 h-screen">
            <h1 className="text-xl font-bold">this is for sorting</h1>
          </div>

          <div className="h-screen flex flex-col gap-5 lg:p-5 pb-5 overflow-auto">
            <div className="flex pt-5 w-full justify-between items-center">
              <h1 className="text-2xl font-bold">{`Open Debates (${totalRecords})`}</h1>
              <button className="p-2 lg:hidden rounded-lg">
                  <FaFilter size={25} />
                </button>
            </div>
            <input type="text" name="searchText" id="searchText" className="px-2 py-1 rounded-lg bg-indigo-700 text-white" placeholder="Search Debates"/>
            {debates[currPage].map((deb, ind) => {
              return (
                <div key={ind} className="w-full">
                  <DebateCard
                    debate={deb}
                    Qno={(currPage - 1) * 10 + ind + 1}
                    liked={likes[currPage][ind]}
                  />
                </div>
              );
            })}
          </div>
          <PagesButton />
        </>
      )}
    </div>
  );
};

export default UserAllDebates;
