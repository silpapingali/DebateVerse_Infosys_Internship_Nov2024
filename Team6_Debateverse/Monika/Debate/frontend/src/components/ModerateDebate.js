import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ModerateDebate = () => {
    const { id } = useParams(); 
    const [debate, setDebate] = useState(null);

    useEffect(() => {
        
        axios
            .get(`http://localhost:5000/api/admin/debate/${id}`)
            .then((response) => {
                setDebate(response.data);
            })
            .catch((error) => {
                console.error('Error fetching debate details:', error);
            });
    }, [id]);

    if (!debate) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Moderate Debate</h1>
                <div className="debate-card">
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
                
                <div>
                    <button
                        onClick={() => {
                            
                            axios
                                .delete(`http://localhost:5000/api/admin/debate/${id}`)
                                .then(() => {
                                    alert('Debate deleted successfully');
                                })
                                .catch((error) => {
                                    console.error('Error deleting debate:', error);
                                });
                        }}
                    >
                        Delete Debate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModerateDebate;
