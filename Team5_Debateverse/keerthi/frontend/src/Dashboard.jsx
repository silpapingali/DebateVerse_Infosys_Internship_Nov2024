import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                const response = await axios.get("http://localhost:3001/debates");
                setDebates(response.data);
            } catch (err) {
                setError("Failed to load debates.");
            } finally {
                setLoading(false);
            }
        };

        fetchDebates();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <button className="btn btn-primary mb-3" onClick={() => navigate("/create")}>
                Create New Debate
            </button>
            <h1>Dashboard</h1>
            {debates.length === 0 ? (
                <div>No debates found.</div>
            ) : (
                <ul className="list-group">
                    {debates.map((debate) => (
                        <li key={debate.id} className="list-group-item">
                            <h5>{debate.question}</h5>
                            <ul>
                                {debate.options.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
