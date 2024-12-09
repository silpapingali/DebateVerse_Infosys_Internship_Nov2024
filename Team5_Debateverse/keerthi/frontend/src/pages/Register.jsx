import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [RegisterData, setRegisterData] = useState({
    email: "",
    password: "",
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
        "http://localhost:8000/api/auth/register",
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
    <div className="pt-16 flex items-center justify-center min-h-screen bg-emerald-400">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold color-red text-center">Register</h2>
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
              required
              placeholder="Enter your email"
              onChange={handleChange}
              value={RegisterData.email}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={RegisterData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute inset-y-11 right-1 flex items-center px-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Enter your password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button
              type="button"
              className="absolute inset-y-11 right-1 flex items-center px-3 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div>
            <button
              disabled={IsLoading}
              type="submit"
              className={`w-full px-4 py-2 text-sm font-medium text-white ${
                IsLoading
                  ? "bg-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700"
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