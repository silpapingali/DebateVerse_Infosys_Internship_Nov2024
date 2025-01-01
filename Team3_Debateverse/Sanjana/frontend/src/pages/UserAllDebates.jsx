import { useEffect, useState } from "react";
import DebateCard from "../components/DebateCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDebates, setCurrPage } from "../redux/slices/allDebatesSlice";
import PagesButton from "../components/PagesButton";
import { FaFilter } from "react-icons/fa6";
import { toast } from "react-toastify";

const UserAllDebates = () => {
  const dispatch = useDispatch();
  const {
    debates,
    likes,
    totalRecords,
    totalPages,
    currPage,
    isLoading,
    errorMessage,
  } = useSelector((states) => states.allDebates);

  const [isVotePopup, setIsVotePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExact, setIsExact] = useState(false);
  const [votes, setVotes] = useState(0);
  const [likegt, setLikegt] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    console.log("in effect in all debates");
    dispatch(
      fetchAllDebates({ page: 1, isExact, votes, likegt, date, searchQuery })
    );
  }, []);

  const applyFilters = () => {
    setCurrPage(1);
    dispatch(
      fetchAllDebates({ page: 1, isExact, votes, likegt, date, searchQuery })
    );
  };
  const resetFilters = () => {
    setCurrPage(1);
    setIsExact(false);
    setVotes(0);
    setLikegt(0);
    setDate("");
    dispatch(
      fetchAllDebates({
        page: 1,
        isExact: false,
        votes: 0,
        likegt: 0,
        date: "",
        searchQuery,
      })
    );
  };

  return (
    <div className="pt-16 lg:px-48 grid lg:grid-cols-[1fr,3fr] px-5 min-h-screen bg-blue-400">
      {!isLoading && (
        <>
          <div className="hidden rounded-lg mb-1 lg:flex flex-col bg-indigo-500 p-4">
            <div className="mb-4">
              <label className="text-white">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isExact}
                  onChange={(e) => setIsExact(e.target.checked)}
                />
                Exact Match
              </label>
            </div>

            <div className="mb-4">
              <h2 className="text-white mb-2">Likes greater than: {likegt}</h2>
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                className="w-full"
                value={likegt}
                onChange={(e) => setLikegt(e.target.value)}
              />
            <div className="flex justify-between text-white">
              <h1>0</h1>
              <h1>10k</h1>
            </div>
            </div>

            <div className="mb-4">
              <h2 className="text-white mb-2">Votes greater than: {votes}</h2>
              <input
                type="range"
                min="0"
                max="2500"
                step="10"
                className="w-full"
                value={votes}
                onChange={(e) => setVotes(e.target.value)}
              />
              <div className="flex justify-between text-white">
              <h1>0</h1>
              <h1>25k</h1>
            </div>
            </div>

            <div className="mb-4">
              <h2 className="text-white mb-2">Posted after:</h2>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(e.target.value);
                }}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={applyFilters}
              className="bg-emerald-500 p-2 m-1 rounded-lg"
            >
              Apply filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-blue-500 p-2 m-1 rounded-lg"
            >
              Reset
            </button>
          </div>

          <div className="h-screen flex flex-col gap-3 lg:p-5 lg:pt-0 pb-5 overflow-auto">
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold">{`Open Debates (${totalRecords})`}</h1>
              <button className="p-2 lg:hidden rounded-lg">
                <FaFilter size={25} />
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                name="searchText"
                id="searchText"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 w-full rounded-lg bg-indigo-700 text-white"
                placeholder="Search Debates"
              />
              <button onClick={applyFilters} className="p-2 rounded-lg bg-emerald-500">Search</button>
            </div>

            {debates[currPage].length == 0 ? (
              <p className="text-xl font-bold">No Debates Found...</p>
            ) : (
              debates[currPage].map((deb, ind) => {
                return (
                  <div key={ind} className="w-full">
                    <DebateCard
                      debate={deb}
                      Qno={(currPage - 1) * 10 + ind + 1}
                      liked={likes[currPage][ind]}
                      
                    />
                  </div>
                );
              })
            )}
            <PagesButton
              from="all"
              totalPages={totalPages}
              debates={debates}
              currPage={currPage}
              searchQuery={searchQuery}
              isExact={isExact}
              votes={votes}
              likegt={likegt}
              date={date}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserAllDebates;