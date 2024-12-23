import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchDebate = () => {
  const [debates, setDebates] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const queryParams = new URLSearchParams(location.search);
      const query = queryParams.get("query");
      const exactMatch = queryParams.get("exactMatch") === "true";

      try {
        const response = await axios.get("http://localhost:8081/api/debate/searchDebate", {
          params: { query, exactMatch },
        });
        setDebates(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <div>
      <h1>Search Results</h1>
      {debates.length > 0 ? (
        debates.map((debate) => <div key={debate.id}>{debate.title}</div>)
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchDebate;
