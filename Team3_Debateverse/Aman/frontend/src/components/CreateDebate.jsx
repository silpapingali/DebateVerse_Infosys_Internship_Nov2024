import axios from "axios";
import React, { useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserDebates } from "../redux/slices/userDebateSlice";

const CreateDebate = ({ showCreate }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const popDiv = useRef();

  const dispatch = useDispatch();

  const handleTextboxChanges = (index, value) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
    console.log(options);
  };
  const addOption = () => {
    if (options.length < 7) {
      setOptions([...options, ""]);
      console.log(options.length);
    } else {
      toast.warning("Maximum 7 options Allowed");
    }
  };
  const removeOption = (index) => {
    if (options.length <= 2)
      return toast.warn("Minimum 2 options are required !");
    setOptions(options.filter((_, i) => index != i));
    console.log(options);
  };
  const closeCreate = (e) => {
    if (popDiv.current == e.target) showCreate();
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const data = { question, options };
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/debates/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      showCreate();
      dispatch(fetchUserDebates());
    } catch (err) {
      // console.log(err, "in catch");
      toast.error(err?.response?.data?.message || "Server error !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={popDiv}
      onClick={closeCreate}
      className="fixed inset-0 flex justify-center items-center backdrop-blur-sm"
    >
      <div className="bg-blue-500 md:w-1/2 relative rounded-lg p-5 md:p-20">
        <button onClick={showCreate} className="absolute top-3 right-3">
          <FaXmark size={40} />
        </button>
        <h1 className="text-center text-3xl font-bold mb-10">Create Debate</h1>
        <input
          type="text"
          required
          placeholder="Enter your Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 mb-6 font-semibold rounded-lg w-full"
        />
        {options.map((val, index) => {
          return (
            <div key={index} className="flex mb-2 justify-center items-center">
              <input
                type="text"
                value={val}
                className="p-2 rounded-lg w-full font-semibold"
                onChange={(e) => handleTextboxChanges(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <button onClick={() => removeOption(index)} className="">
                <FaXmark size={40} />
              </button>
            </div>
          );
        })}

        <button
          onClick={addOption}
          className={`px-8 w-full py-2 rounded-lg bg-blue-700 font-bold`}
        >
          Add Options
        </button>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={`px-8 w-full mt-10 py-2 rounded-lg ${
            isLoading ? "bg-green-700" : "bg-green-500"
          } font-bold`}
        >
          {isLoading ? "Posting..." : "Post Debate"}
        </button>
      </div>
    </div>
  );
};

export default CreateDebate;
