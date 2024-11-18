import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
        <h1 className="text-5xl text-center font-bold mb-4 text-white">
          Welcome to your Dashboard
        </h1>
        <p className="text-xl text-center mb-8 text-white">
        </p>
      </div>
    </div>
  );
};

export default Home;
