import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import VoteGraph from '../components/VoteGraph';
import { useAuthStore } from "../store/authStore";

const UserDebates = () => {
  const {user} =useAuthStore();
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/debates");
        const data = await response.json();
        setDebates(data);
      } catch (error) {
        console.error("Error fetching debates: ", error);
      }
    };
    fetchDebates();
  }, []);

  const userDebates = debates.filter((debate) => debate.createdBy === user?.name);

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-6">
          Debates by {user?.name}
        </h1>
        
        <div className="space-y-6">
          {userDebates.map((debate) => (
            <div key={debate.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">{debate.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted on {new Date(debate.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500">❤ {debate.likes}</span>
                </div>
              </div>
              
              <div className="mt-4 h-16 bg-green-50 rounded-lg flex items-end">
                {debate.options.map((_, index) => (
                  <div
                    key={index}
                    className="bg-green-400 w-1/5 mx-0.5 transition-all"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <span className={`px-2 py-1 rounded text-sm ${
                  debate.isActive 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {debate.isActive ? 'Active' : 'Closed'}
                </span>
                </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDebates;