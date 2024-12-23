import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashBoard.css';
import Navbar from './Navbar';

const App = () => {
    const [debates, setDebates] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        
        axios
            .get('http://localhost:8081/api/admin/recentDebates')
            .then((response) => {
                setDebates(response.data);
            })
            .catch((error) => {
                console.error('Error fetching debates:', error);
            });
    }, []);

    
    const handleDebateClick = (debateId) => {
        navigate(`/moderate/${debateId}`);
    };

    return (
        <div className="App">
            <Navbar />
            <header className="App-header">
                <h1>Admin Dashboard</h1>
            </header>
            <div className="container">
                {debates.map((debate, index) => (
                    <div
                        key={index}
                        className="debate-card"
                        onClick={() => handleDebateClick(debate.id)} 
                        style={{ cursor: 'pointer' }} 
                    >
                        <h3>{debate.text}</h3>
                        <p>Asked on: {new Date(debate.created_on).toLocaleDateString()}</p>
                        <p>{debate.likes} Likes</p>
                        <ul>
                            {debate.options.map((option) => (
                                <li key={option.id}>
                                    {option.text} ({option.upvotes} votes)
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div className="see-all">
                    <a href="/debatelist">See All</a>
                </div>
            </div>
        </div>
    );
};

export default App;
