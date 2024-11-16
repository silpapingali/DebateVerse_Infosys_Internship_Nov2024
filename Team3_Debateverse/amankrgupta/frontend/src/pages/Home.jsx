import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl text-center font-bold mb-8">Welcome to Dashboard</h1>
    </div>
  );
};

export default Home;