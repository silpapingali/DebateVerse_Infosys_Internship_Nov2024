import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Plus, Minus, ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";


const DebateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState(0); // Track the number of votes the user has cast
  const { user } = useAuthStore();

  const isCreator = debate?.createdBy === user?.name;

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/debates/${id}`);
        setDebate(response.data);
        setLoading(false);

        // Calculate user votes (upvotes + downvotes for each option)
        const votes = response.data.options.reduce((count, option) => {
          const userUpvotes = option.upvotes.filter(vote => vote.userId === user._id).length;
          const userDownvotes = option.downvotes.filter(vote => vote.userId === user._id).length;
          return count + userUpvotes + userDownvotes;
        }, 0);
        setUserVotes(votes);
      } catch (err) {
        console.error("Error fetching debate:", err);
        setError("Failed to fetch debate.");
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id, user._id]);

  const handleVote = async (optionId, isUpvote) => {
    if (isCreator || userVotes >= 10) return; // Prevent voting after 10 votes

    try {
      const voteData = {
        id: id,
        optionId,
        userId: user?._id,
        isUpvote,
      };
      const response = await axios.put(`http://localhost:5000/api/debates/${id}/vote`, voteData);

      // Optimistically update the state to immediately reflect the new vote
      const updatedDebate = { ...debate };
      const updatedOptions = updatedDebate.options.map((option) => {
        if (option._id === optionId) {
          // Update upvotes and downvotes
          if (isUpvote) {
            const existingUpvote = option.upvotes.find(vote => vote.userId === user._id);
            if (existingUpvote) {
              existingUpvote.count += 1;
            } else {
              option.upvotes.push({ userId: user._id, count: 1 });
            }
            option.downvotes = option.downvotes.filter(vote => vote.userId !== user._id); // Remove from downvotes
          } else {
            const existingDownvote = option.downvotes.find(vote => vote.userId === user._id);
            if (existingDownvote) {
              existingDownvote.count += 1;
            } else {
              option.downvotes.push({ userId: user._id, count: 1 });
            }
            option.upvotes = option.upvotes.filter(vote => vote.userId !== user._id); // Remove from upvotes
          }
        }
        return option;
      });
      updatedDebate.options = updatedOptions;

      setDebate(updatedDebate);
      setUserVotes(prevVotes => prevVotes + 1); // Update user vote count
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleLike = async () => {
    if (isCreator) return; // Prevent creator from liking

    try {
      const response = await axios.post(`http://localhost:5000/api/debates/${id}/like`, {
        
        userId: user?._id,
      });
      

 
      setDebate(response.data.likes);
      navigate(-1);
      alert("liked debate");
    } catch (err) {

      console.error("Error liking debate:", err);
    }
  };
  const handleDisLike = async () => {
    if (isCreator) return; // Prevent creator from liking

    try {
      const response = await axios.post(`http://localhost:5000/api/debates/${id}/dislike`, {
        
        userId: user?._id,
      });
      

 
      setDebate(response.data.dislikes);
      navigate(-1);
      alert("disliked debate");
    } catch (err) {
      alert(" error disliking debate");
      console.error("Error disliking debate:", err);
    }
  };
  const handleVoteSubmit=async()=>{
    try{
      alert("votes submitted");
    }
    catch(err){
      alert("error voting");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 font-comic">Moderate Debate</h2>
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
              <span>{debate.likes.length} Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1 rounded text-white">
              {
      debate.options.reduce((totalVotes, option) => {
        // Add up the userVotes for each option
        return totalVotes + option.userVotes;
      }, 0)
    }
              </div>
              <span>Total Votes</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleLike}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                <ThumbsUp size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleDisLike}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                <ThumbsDown size={20} />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4 font-comic">Question:</h3>
            <p className="text-lg text-gray-800 font-comic">{debate.title}</p>
          </div>

          <div className="space-y-4 mb-8">
            {debate.options.map((option, index) => {
              const totalVotes = option.upvotes.reduce((sum, vote) => sum + vote.count, 0) - option.downvotes.reduce((sum, vote) => sum + vote.count, 0);
              const hasVoted = option.upvotes.some(vote => vote.userId === user._id) || option.downvotes.some(vote => vote.userId === user._id);
              return (
                <div key={option._id} className="flex items-center gap-4 font-comic">
                  <span>{index + 1}:</span>
                  <div className="flex-1 bg-orange-100 rounded-md p-3">
                    {option.text}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(option._id, false)}
                      disabled={isCreator  || userVotes >= 10}
                      className={`p-2 rounded ${isCreator  || userVotes >= 10||!debate.isActive ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:bg-red-50"}`}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-8 text-center">
                      {Math.max(totalVotes, 0)}
                    </span>
                    <button
                      onClick={() => handleVote(option._id, true)}
                      disabled={isCreator  || userVotes >= 10}
                      className={`p-2 rounded ${isCreator || userVotes >= 10 || !debate.isActive ? "text-gray-400 cursor-not-allowed" : "text-green-500 hover:bg-green-50"}`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
            <div className="mt-4 h-16 bg-green-50 rounded-lg flex items-end">
  {debate.options.map((option, index) => {
    const totalVotes = option.upvotes.reduce((sum, vote) => sum + vote.count, 0) - option.downvotes.reduce((sum, vote) => sum + vote.count, 0);
    const maxVotes = Math.max(...debate.options.map(opt => opt.upvotes.reduce((sum, vote) => sum + vote.count, 0) - opt.downvotes.reduce((sum, vote) => sum + vote.count, 0)));
    const heightPercentage = maxVotes ? (totalVotes / maxVotes) * 100 : 0; // Calculate the height as a percentage of the maxVotes

    return (
      <div
        key={index}
        className="bg-green-400 w-1/5 mx-0.5 transition-all"
        style={{ height: `${heightPercentage}%` }}
      />
    );
  })}
</div>

            </div>
            <div className="w-32">
              <button
                onClick={handleVoteSubmit}
                disabled={isCreator}
                className={`w-full h-full text-white text-xl font-bold rounded-lg transition-colors font-comic ${isCreator ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"}`}
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
