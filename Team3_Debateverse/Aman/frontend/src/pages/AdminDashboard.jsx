import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../redux/slices/adminDashboardSlice";
import ModerateUser from "../components/ModerateUser";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    openDebates,
    closedDebates,
    activeUsers,
    blockedUsers,
    isLoading,
    errorMessage,
  } = useSelector((states) => states.adminDashboard);

  const [moderateUserPopup, setModerateUserPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchStats());
  }, []);

  return (
    <div className="pt-16 gap-5 flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
      {!isLoading && (
        <>
        <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Actions</h1>
              <div className="flex flex-col md:flex-row gap-4">
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg shadow-md transition duration-300">
                  Moderate Debates
                </button>
                <button
                  onClick={() => setModerateUserPopup(!moderateUserPopup)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg shadow-md transition duration-300"
                >
                  Moderate User
                </button>
              </div>
            </div>
          <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Statistics</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">All users:</h2>
                <p className="text-xl">{activeUsers + blockedUsers}</p>
              </div>
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Active users:</h2>
                <p className="text-xl">{activeUsers}</p>
              </div>
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Blocked users:</h2>
                <p className="text-xl">{blockedUsers}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">All Debates:</h2>
                <p className="text-xl">{openDebates + closedDebates}</p>
              </div>
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Open Debates:</h2>
                <p className="text-xl">{openDebates}</p>
              </div>
              <div className="flex-1 p-4 bg-indigo-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Closed Debates:</h2>
                <p className="text-xl">{closedDebates}</p>
              </div>
            </div>
          </div>

          <div>
            {moderateUserPopup && (
              <ModerateUser onClose={() => setModerateUserPopup(false)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
