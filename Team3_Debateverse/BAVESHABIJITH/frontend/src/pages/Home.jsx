import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
        <h1 className="text-5xl text-center font-bold mb-4 text-white">
          Welcome to DebateHub
        </h1>
        <p className="text-xl text-center mb-8 text-white">
          Discuss, Interact, and Grow
        </p>
        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;