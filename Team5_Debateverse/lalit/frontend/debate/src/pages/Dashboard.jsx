import React, { useState, useEffect } from 'react';
import useAuth from '../utils/auth';
import DebateCard from '../components/DebateCard';
import CreateDebateForm from '../components/CreateDebateForm';
import { getDebates } from '../api';

function Dashboard() {
  const { user } = useAuth();
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await getDebates();
        setDebates(response.data);
      } catch (error) {
        console.error("Error fetching debates:", error);
      }
    };

    fetchDebates();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Debate Hub</h1>
      <p>Welcome, {user.username}!</p>

      {/* Create Debate Form */}
      <CreateDebateForm />

      {/* Debate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {debates.map((debate) => (
          <DebateCard key={debate.id} debate={debate} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;