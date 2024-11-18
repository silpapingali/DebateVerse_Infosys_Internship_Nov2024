import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [RegisterData, setRegisterData] = useState({
    email: "",
    password: "",
    role: "user",
    isVerified: false,
  });

  const handleChange = (e) => {
    setRegisterData({
      ...RegisterData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword != RegisterData.password) {
      toast.error("Password mismatch ! Check confirm password again");
      return;
    }
    if (RegisterData.password.length < 6) {
      toast.error("Password must be at least 6 characters long !");
      return;
    }
    console.log(RegisterData);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        RegisterData
      );
      if (res.status == 201) {
        toast.success(res.data.message);
        navigate("/login");
      } else toast.error(res.data.message);
    } catch (err) {
      if (err?.response?.data?.inputerrors) {
        err.response.data.inputerrors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Error! Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              value={RegisterData.email}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              value={RegisterData.password}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="text"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="flex gap-10">
              <div className="flex items-center mt-2">
                <input
                  id="user"
                  name="role"
                  type="radio"
                  value="user"
                  checked={RegisterData.role === "user"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="user"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  User
                </label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  id="admin"
                  name="role"
                  type="radio"
                  value="admin"
                  checked={RegisterData.role === "admin"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="admin"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Admin
                </label>
              </div>
            </div>
          </div>
          <div>
            <button
              disabled={IsLoading}
              type="submit"
              className={`w-full px-4 py-2 text-sm font-medium text-white ${
                IsLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {!IsLoading ? "Register" : "Registering..."}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-500 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
