import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const AdminDashboard = () => {
  const { isAuth, role } = useContext(UserContext);
  const handleClick = () => {
    console.log(isAuth, role);
  };
  return (
    <div>
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
        <h1 className="text-5xl text-center font-bold mb-4 text-white">
          This is admin Dashboard
        </h1>
        <p className="text-xl text-center mb-8 text-white"></p>
        <button onClick={handleClick}>click</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
