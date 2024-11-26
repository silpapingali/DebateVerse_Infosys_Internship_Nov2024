import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


const UserDashboard = () => {
  const { isAuth, role } = useContext(UserContext);
  const navigate = useNavigate();

  // State to manage options
  const [options, setOptions] = useState([""]);

  // Handlers for managing options
  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };
  const changeOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Handle submit button click
  const handleClick = () => {
    console.log("isAuth:", isAuth, "role:", role);
    console.log("Current Options:", options);
    // Here, you could submit the options data to an API if needed
  };

  // If the user is not authenticated, redirect to the login page
  if (!isAuth) {
    navigate("/login");
    return null;  // Don't render anything until the user is authenticated
  }

  return (
    <div>
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-700">
        <h1 className="text-5xl text-center font-bold mb-4 text-white">
          This is My Dashboard
        </h1>
        <p className="text-xl text-center mb-8 text-white">
          Role: {role ? role : "Guest"}
        </p>

        {/* OptionField Component */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <OptionField
            options={options}
            onAddOption={addOption}
            onRemoveOption={removeOption}
            onChangeOption={changeOption}
            maxOptions={7} // Set maximum number of options
          />
          <button
            onClick={handleClick}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
