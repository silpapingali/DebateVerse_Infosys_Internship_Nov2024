import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const UserDashboard = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debates, setDebates] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchKeyword.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/api/debate/searchDebate", {
        params: { keyword: searchKeyword },
      });
      setDebates(response.data.debates); 
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search debates..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      
      <div>
        <h2>Search Results</h2>
        {debates.length > 0 ? (
          debates.map((debate) => (
            <div key={debate.id}>
              <h3>{debate.text}</h3>
              <p>Created On: {new Date(debate.created_on).toLocaleString()}</p>
              <p>Likes: {debate.likes}</p>
              <h4>Options:</h4>
              <ul>
                {debate.options.map((option) => (
                  <li key={option.id}>
                    {option.text} (Upvotes: {option.upvotes})
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
