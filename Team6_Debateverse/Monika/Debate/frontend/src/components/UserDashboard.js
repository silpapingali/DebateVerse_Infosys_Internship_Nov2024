import React, { useState, useEffect } from "react";
import axios from "axios";



const UserDashboard = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debates, setDebates] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchRecentDebates = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8081/api/debate/recentDebate");
        setDebates(Array.isArray(response.data.debates) ? response.data.debates : []);
      } catch (error) {
        console.error("Error fetching recent debates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentDebates();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchKeyword.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }

    try {
      setIsSearching(true);
      setIsLoading(true);
      const response = await axios.get("http://localhost:8081/api/debate/searchDebate", {
        params: { keyword: searchKeyword },
      });
     
      setDebates(Array.isArray(response.data.debates) ? response.data.debates : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", color: "black", minHeight: "100vh", padding: "30px 15px" }}>
      <div className="container">
        <h1 className="text-center mb-4" style={{ fontWeight: "600", fontSize: "2rem" }}>User Dashboard</h1>

     
        <form className="mb-4" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search debates..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>

    
        <div className="mb-5">
          <h2 className="mb-3" style={{ fontWeight: "500" }}>
            {isSearching ? "Search Results" : "Recent Debates"}
          </h2>
          {isLoading ? (
            <p className="text-center">Loading debates...</p>
          ) : Array.isArray(debates) && debates.length > 0 ? (
            <div className="row">
              {debates.map((debate) => (
                <div key={debate.id} className="col-md-6 col-lg-4 mb-4">
                
                  <div className="card shadow-sm border-0" style={{ borderRadius: "10px", overflow: "hidden" }}>
                    <div className="card-body" style={{ backgroundColor: "#ffffff", padding: "20px" }}>
                      <h5 className="card-title" style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "15px" }}>
                        {debate.title}
                      </h5>
                      <p className="card-text" style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "15px" }}>
                        {debate.description.length > 120
                          ? `${debate.description.substring(0, 120)}...`
                          : debate.description}
                      </p>
                      <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                        Created by: <span style={{ fontWeight: "bold" }}>{debate.created_by || "Unknown"}</span>
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                          <i className="fas fa-thumbs-up"></i> {debate.votes || 0} Votes
                        </span>
                        <button className="btn btn-outline-primary btn-sm">
                          View Debate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No debates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
