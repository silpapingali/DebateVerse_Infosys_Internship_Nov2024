import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus } from 'lucide-react';
import { upvote, downvote, likeDebate } from '../store/debateSlice';
import VoteGraph from '../components/VoteGraph';
import { useAuthStore } from "../store/authStore";
const DebateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const debate = useSelector((state) => 
    state.debates.debates.find(d => d.id === id)
  );
 const {user}=useAuthStore();
  const isCreator = debate?.createdBy === user?.username;

  if (!debate) {
    return <div>Debate not found</div>;
  }

  const handleVote = (optionId, isUpvote) => {
    if (isCreator) return;
    
    if (isUpvote) {
      dispatch(upvote({ debateId: id, optionId, userId: user?.username }));
    } else {
      dispatch(downvote({ debateId: id, optionId, userId: user?.username }));
    }
  };

  const handleLike = () => {
    if (!isCreator) {
      dispatch(likeDebate({ debateId: id, userId: user?.username }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 font-comic">
              Moderate Debate
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
            >
              Go Back
            </button>
          </div>

          <div className="flex items-center gap-8 mb-6 font-comic">
            <div className="flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              <span>{debate.likes} Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1 rounded text-white">
                {debate.options.reduce((sum, opt) => sum + opt.votes, 0)}
              </div>
              <span>Total Votes</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4 font-comic">
              Question:
            </h3>
            <p className="text-lg text-gray-800 font-comic">{debate.title}</p>
          </div>

          <div className="space-y-4 mb-8">
            {debate.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-4 font-comic">
                <span>{index + 1}:</span>
                <div className="flex-1 bg-orange-100 rounded-md p-3">
                  {option.text}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(option.id, false)}
                    disabled={isCreator}
                    className={`p-2 rounded ${
                      isCreator ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-8 text-center">{option.userVotes}</span>
                  <button
                    onClick={() => handleVote(option.id, true)}
                    disabled={isCreator}
                    className={`p-2 rounded ${
                      isCreator ? 'text-gray-400 cursor-not-allowed' : 'text-green-500 hover:bg-green-50'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <VoteGraph options={debate.options} />
            </div>
            <div className="w-32">
              <button
                onClick={handleLike}
                disabled={isCreator}
                className={`w-full h-full text-white text-xl font-bold rounded-lg transition-colors font-comic ${
                  isCreator ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg'
                }`}
              >
                Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;