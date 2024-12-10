import axios from "axios";
import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchUserDebates } from "../redux/slices/userDebateSlice";

const CreateDebate = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTextboxChanges = (index, value) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const addOption = () => {
    if (options.length < 7) {
      setOptions([...options, ""]);
    } else {
      toast.warning("Maximum 7 options Allowed");
    }
  };

  const removeOption = (index) => {
    if (options.length <= 2)
      return toast.warn("Minimum 2 options are required !");
    setOptions(options.filter((_, i) => index !== i));
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const data = { question, options };
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/debates/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/userdashboard"); // Redirect to dashboard after successful creation
      dispatch(fetchUserDebates());
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-400">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Create Debate</h1>
          <button
            onClick={() => navigate("/userdashboard")}
            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>
        <input
          type="text"
          required
          placeholder="Enter your Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 mb-6 font-semibold rounded-lg w-full"
        />
        {options.map((val, index) => (
          <div key={index} className="flex mb-2 justify-center items-center">
            <input
              type="text"
              value={val}
              className="p-2 rounded-lg w-full font-semibold"
              onChange={(e) => handleTextboxChanges(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button onClick={() => removeOption(index)}>
              <FaXmark size={20} />
            </button>
          </div>
        ))}

        <button
          onClick={addOption}
          className="px-8 w-full py-2 rounded-lg bg-blue-600 text-white font-bold mt-4"
        >
          Add Option
        </button>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={`px-8 w-full mt-10 py-2 text-white rounded-lg ${
            isLoading ? "bg-blue-600" : "bg-blue-700"
          } font-bold`}
        >
          {isLoading ? "Posting..." : "Post Debate"}
        </button>
      </div>
    </div>
  );
};

export default CreateDebate;
