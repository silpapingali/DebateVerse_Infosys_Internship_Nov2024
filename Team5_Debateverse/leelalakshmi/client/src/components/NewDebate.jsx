import { useState } from 'react'
import { RiChatSmileFill } from "react-icons/ri";
import { MdOutlinePostAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinFill } from "react-icons/ri";
import axios from 'axios';
const NewDebate = () => {
  const [question, setQuestion] = useState(''); 
  const [options, setOptions] = useState(['']); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleAddOption = () => {
    if (options.length >= 7) {
      setErrorMessage('You can add a maximum of 7 options');
    } else {
      setErrorMessage(''); 
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = () => {
    if (options.length <= 2) {
      setErrorMessage('You must add at least 2 options');
    } else {
      setErrorMessage(''); 
      setOptions(options.slice(0, -1));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!question.trim()) {
      setErrorMessage('The debate question cannot be empty.');
      return;
    }
    if (options.some(option => !option.trim())) {
      setErrorMessage('All options must be filled out.');
      return;
    }
    setErrorMessage('');
    const debateData = { question, options, createdBy: localStorage.getItem('username') };
    console.log('Debate Posted:', debateData);
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/debates',debateData,{
        headers: {
          'Content-Type': 'application/json',
        }
    });
      setSuccessMessage('Your New debate created successfully.');
      setQuestion(""); 
      setOptions(["", ""]); 
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating debate:', error);
    setErrorMessage('Failed to create debate. Please try again.');
    }finally{
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    navigate('/userdashboard'); 
  };
  return (
    <div className="bg-white/80 p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">New Debate</h2>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>

      <label className="block text-lg font-medium mb-2">Question:</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your debate question"
        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      
      <div>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-4">
            <RiChatSmileFill size={24} />
            <span className="mr-3 text-lg">{index + 1}:</span>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={() => handleRemoveOption(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <RiDeleteBinFill />
            </button>
          </div>
        ))}

        {successMessage && (
          <div className="text-green-600 text-sm mb-4">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={handleAddOption}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              +
            </button>
            <button
              onClick={() => handleRemoveOption(options.length - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              -
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 font-medium rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {loading ? "Posting..." : "Post"} <MdOutlinePostAdd />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDebate;