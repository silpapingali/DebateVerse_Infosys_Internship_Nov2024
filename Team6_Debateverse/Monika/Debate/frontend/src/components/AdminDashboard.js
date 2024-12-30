import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa"; 
import { Bar } from "react-chartjs-2"; 
import "chart.js/auto"; 

const AdminDashboard = () => {
  const [recentDebates, setRecentDebates] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchRecentDebates = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/admin/recentDebates");
        setRecentDebates(response.data.debates || []);
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
      const response = await axios.get("http://localhost:8081/api/admin/searchDebate", {
        params: { keyword: searchKeyword },
      });
      setRecentDebates(response.data.debates || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  
  const handleDebateClick = (debateId) => {
    navigate(`/debate/${debateId}`);
  };

  return (
    <div style={{ backgroundColor: "#1e1e1e", color: "white", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <h1 className="text-center mb-4">Admin Dashboard</h1>

        
        <form className="mb-4" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a debate..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>

        
        <div className="mb-5">
          <h2 className="mb-3">Recent Debates</h2>
          {isLoading ? (
            <p>Loading debates...</p>
          ) : recentDebates.length > 0 ? (
            <div className="row">
              {recentDebates.map((debate) => (
                <div
                  key={debate.id}
                  className="col-md-6 col-lg-4 mb-4"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="card bg-dark text-white h-100"
                    onClick={() => handleDebateClick(debate.id)}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{debate.text}</h5>
                      <p className="card-text">Created On: {new Date(debate.created_on).toLocaleString()}</p>
                      <p className="card-text">
                        <FaHeart style={{ color: "red" }} /> {debate.likes} Likes
                      </p>
                      <h6>Options and Votes:</h6>
                      <Bar
                        data={{
                          labels: debate.options.map((option) => option.text),
                          datasets: [
                            {
                              label: "Votes",
                              data: debate.options.map((option) => option.upvotes),
                              backgroundColor: "rgba(75, 192, 192, 0.6)",
                              borderColor: "rgba(75, 192, 192, 1)",
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          responsive: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent debates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
