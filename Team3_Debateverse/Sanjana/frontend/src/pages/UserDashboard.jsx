import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext"; // Assuming you have UserContext
import { useNavigate } from "react-router-dom";
import OptionField from "../components/OptionField"; // OptionField component to create a debate
import { format } from 'date-fns'; // To format the date

const UserDashboard = () => {
  const { isAuth, userId, role } = useContext(UserContext); // Assuming UserContext provides user data
  const navigate = useNavigate();

  // States for managing debates and new debate options
  const [debates, setDebates] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

  // Fetch user-specific debates (mocking data for now)
  useEffect(() => {
    if (isAuth) {
      // Simulate fetching data for logged-in user
      // You can replace this with an actual API call based on `userId` or `role`
      const fetchedDebates = [
        {
          id: 1,
          title: "Debate 1",
          date: new Date(),
          likes: 10,
        },
        {
          id: 2,
          title: "Debate 2",
          date: new Date(),
          likes: 15,
        },
      ];
      setDebates(fetchedDebates);
    }
  }, [isAuth]);

  // Handle adding a new debate
  const addDebate = () => {
    const newDebate = {
      id: debates.length + 1,
      title: question,
      date: new Date(),
      likes: 0,
    };
    setDebates([...debates, newDebate]);
    setQuestion(""); // Reset question field
    setOptions([""]); // Reset options
  };

  // If the user is not authenticated, redirect to login page
  if (!isAuth) {
    navigate("/login");
    return null; // Don't render anything until authenticated
  }

  return (
    <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
      <h1 className="text-5xl text-center font-bold mb-4 text-white">User Dashboard</h1>
      <p className="text-xl text-center mb-8 text-white">Role: {role || "Guest"}</p>

      {/* Create New Debate Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Debate</h2>
        <OptionField
          question={question}
          setQuestion={setQuestion}
          options={options}
          addOption={() => setOptions([...options, ""])}
          removeOption={(index) => setOptions(options.filter((_, i) => i !== index))}
          changeOption={(index, value) => {
            const updatedOptions = [...options];
            updatedOptions[index] = value;
            setOptions(updatedOptions);
          }}
        />
        <button
          onClick={addDebate}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
        >
          Post Debate
        </button>
      </div>

      {/* Displaying Debates Section */}
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Your Debates</h2>
        <div className="space-y-4">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{debate.title}</h3>
                <p className="text-gray-600">
                  {format(new Date(debate.date), "MMM dd, yyyy")} - {debate.likes} Likes
                </p>
              </div>
              <button
                onClick={() => alert("Going to the debate page")}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
              >
                View Debate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
