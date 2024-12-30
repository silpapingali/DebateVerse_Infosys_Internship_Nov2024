import { useEffect, useState } from "react";
import axios from "axios";
import DebateCard from "../components/DebateCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDebates } from "../redux/slices/allDebatesSlice";
import PagesButton from "../components/PagesButton";
import { FaFilter } from "react-icons/fa6";

const UserAllDebates = () => {
  const dispatch = useDispatch();
  const { debates, likes, totalRecords, currPage, isLoading, errorMessage } = useSelector((states) => states.allDebates);

  const [searchText, setSearchText] = useState("");  // State to store search input
  const [filteredDebates, setFilteredDebates] = useState([]);  // State to store filtered debates

  // Function to handle search
  const handleSearch = async (e) => {
    setSearchText(e.target.value);  // Update the search input

    if (e.target.value === "") {
      // If the search input is empty, reset to show all debates
      dispatch(fetchAllDebates(currPage));  // Fetch debates for current page
    } else {
      try {
        const res = await axios.post("http://localhost:3000/api/debates/search", { query: e.target.value });
        setFilteredDebates(res.data);  // Update the filtered debates
      } catch (error) {
        console.log('There was an error with the Axios request!', error);  // Log the error
      }
    }
  };

  useEffect(() => {
    if (searchText === "") {
      // Load debates for the current page if no search term is present
      dispatch(fetchAllDebates(currPage));
    }
  }, [currPage, searchText, dispatch]);  // Added dispatch and currPage to dependencies

  return (
    <div className="pt-16 lg:px-48 grid lg:grid-cols-[1fr,3fr] px-5 min-h-screen bg-blue-400">
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

            {/* Search Input */}
            <input
              type="text"
              name="searchText"
              id="searchText"
              className="p-2 rounded-lg bg-indigo-700 text-white"
              placeholder="Search Debates"
              value={searchText}
              onChange={handleSearch}  // Handle the search input change
            />

            {/* Display filtered debates or debates based on the current page */}
            {(searchText ? filteredDebates : debates[currPage]).map((deb, ind) => {
              return (
                <div key={ind} className="w-full">
                  <DebateCard debate={deb} Qno={(currPage - 1) * 10 + ind + 1} liked={likes[currPage][ind]} />
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
