import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import VoteGraph from "../components/VoteGraph";

const AdminDebateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const isCreator = debate?.createdBy === user?.name;

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/debates/${id}`);
        setDebate(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching debate:", err);
        setError("Failed to fetch debate.");
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  const handleClose = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/debates/${id}/close`, { isActive: false });
      setDebate(response.data); 
      alert("Debate closed successfully.");
      navigate(-1); 
    } catch (error) {
      console.error('Error closing debate:', error);
      alert("Failed to close the debate. Please try again.");
    }
  };

  const handleCloseOption = async (optionId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/debates/${id}/options/${optionId}`,{debateId:id, optionId: optionId});
      setDebate(response.data.debate); // Update the state with the modified debate
      
    } catch (err) {
      console.error('Error closing option:', err);
      
    }
  };
  const handleupdate=async()=>{
    try{
      alert("Changes have been updated");
    }
    catch(err){
      console.log('error moderating');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6 ">
      <div className="max-w-4xl mx-auto">
        <div className={`bg-white rounded-lg p-8 shadow-lg ${!debate.isActive ? 'opacity-30' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 font-comic">Moderate Debate</h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
            >
              Go Back
            </button>
          </div>

          <div className="flex items-center justify-between gap-8 mb-6 font-comic">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Heart className="text-red-500" size={24} />
                <span>{debate.likes.length} Likes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-1 rounded text-white">
                  {debate.options.reduce((totalVotes, option) => {
                    return totalVotes + option.userVotes;
                  }, 0)}
                </div>
                <span>Total Votes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4 font-comic">Question:</h3>
            <p className="text-lg text-gray-800 font-comic">{debate.title}</p>
          </div>

          <div className="space-y-4 mb-8">
            {debate.options.map((option, index) => {
              return (
                <div key={option._id} className="flex items-center gap-4 font-comic">
                  <span>{index + 1}:</span>
                  <div className="flex-1 bg-orange-100 rounded-md p-3">
                    {option.text}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCloseOption(option._id)}
                      className="p-2 rounded text-red-700 hover:bg-red-50"
                    >
                      <X size={20} />
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
                onClick={handleupdate}
                disabled={isCreator}
                className={`w-full h-full text-white text-xl font-bold rounded-lg transition-colors font-comic ${isCreator ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"}`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebateDetail;
