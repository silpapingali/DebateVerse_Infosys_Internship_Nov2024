import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from "../store/authStore";

const CreateDebate = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (options.length < 7) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (title && description && options.every(opt => opt.trim())) {
      try {
        
          const response = await fetch("http://localhost:5000/api/debates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, options ,createdBy:user?.name}),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create the debate.");
          }
    
          const data = await response.json();
          alert("Debate created:");
          navigate("/");
        } catch (err) {
          console.error(err);
          setError(err.message);
        }
      
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-8">Create New Debate</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-white">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {options.length < 7 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center space-x-2 from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:text-green-700"
            >
              <Plus size={20} />
              <span>Add Option</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Debate'}
        </button>
      </form>
    </div>
  );
};

export default CreateDebate;
