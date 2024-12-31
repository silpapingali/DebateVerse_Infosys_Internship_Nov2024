import React, { useState } from "react";

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="pt-16 lg:px-72 flex items-start justify-start min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
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
        <button className="p-2 rounded-lg bg-emerald-500">Search</button>
      </div>
    </div>
  );
};

export default ManageUsers;
