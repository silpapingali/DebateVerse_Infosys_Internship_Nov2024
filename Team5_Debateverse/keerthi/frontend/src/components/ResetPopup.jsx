import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ResetPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const popRef = useRef();

  const closePopup = (e) => {
    if (popRef.current == e.target) onClose();
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/resetrequest",
        { email, password: "" }
      );
      toast.success(res.data.message);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error! Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={popRef}
      onClick={closePopup}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm bg-gray-400 flex justify-center items-center"
    >
      <div className="p-2 flex flex-col w-full max-w-md bg-white rounded">
        <button className="place-self-end" onClick={onClose}>
          <X size={30} />
        </button>
        <div className="m-10">
          <h1 className="text-2xl mb-5 font-bold text-center text-gray-700">
            Reset Password
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              type="email"
              required
              value={email}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className={`w-full px-4 py-2 mt-4 text-sm font-medium text-white ${
                isLoading
                  ? "bg-emerald-400"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }  border border-transparent rounded-md shadow-sm focus:outline-none`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPopup;