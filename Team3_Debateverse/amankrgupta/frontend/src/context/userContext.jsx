import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route

  useEffect(() => {
    const noAuthRequiredRoutes = ["/login", "/register"];
    if (noAuthRequiredRoutes.includes(location.pathname)) {
      return;
    }
    const getData = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        setIsAuthenticated(false);
        toast.error("You are not logged in!");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/api/debates/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
        navigate("/login")
      }
    };
    getData();
  }, [location.pathname]);

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
