import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VoteGraph from '../components/VoteGraph';
import { useAuthStore } from "../store/authStore";
const UserDebates = () => {
  const { username } = useParams();
  const debates = useSelector((state) => 
    state.debates.debates.filter(debate => debate.createdBy === username)
  );

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-6">
          Debates by {username}
        </h1>
        
        <div className="space-y-6">
          {debates.map((debate) => (
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
              
              <VoteGraph options={debate.options} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDebates;