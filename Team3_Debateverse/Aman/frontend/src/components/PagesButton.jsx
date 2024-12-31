import React from "react";
import { useDispatch } from "react-redux";
import { fetchUserDebates, setCurrPage } from "../redux/slices/userDebateSlice";
import { toast } from "react-toastify";
import {
  fetchAllDebates,
  setCurrPage as allSetCurrPage,
} from "../redux/slices/allDebatesSlice";

const PagesButton = ({
  from,
  totalPages,
  currPage,
  debates,
  isExact = false,
  votes = 0,
  likegt = 0,
  date = null,
  searchQuery= null
}) => {
  const dispatch = useDispatch();

  const handlePageClick = (i) => {
    if (from == "all") {
      if (i > totalPages) return toast.warning("No More Pages !");
      scrollTo({ top: 0, behavior: "smooth" });
      dispatch(allSetCurrPage(i));
      if (!debates[i])
        dispatch(fetchAllDebates({ page: i, isExact, votes, likegt, date, searchQuery }));
    } else if (from == "user") {
      if (i > totalPages) return toast.warning("No More Pages !");
      scrollTo({ top: 0, behavior: "smooth" });
      dispatch(setCurrPage(i));
      if (!debates[i]) dispatch(fetchUserDebates(i));
    }
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageClick(i)}
        className={`py-2 px-5 font-bold ${
          currPage == i ? "bg-blue-900 text-white border" : "bg-blue-500"
        } hover:bg-blue-600`}
      >
        {i}
      </button>
    );
  }

  return (
    totalPages > 1 && (
      <div className="flex justify-center items-center py-3">
        {pages}
        <button
          onClick={() => handlePageClick(currPage + 1)}
          className={`py-2 px-5 font-bold bg-blue-500 hover:bg-blue-600 hover:border`}
        >
          Next Page
        </button>
      </div>
    )
  );
};

export default PagesButton;
