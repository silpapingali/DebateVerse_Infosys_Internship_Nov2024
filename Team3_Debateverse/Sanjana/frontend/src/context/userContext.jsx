import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // States for user authentication and role management
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");

  // State for managing debates created by the user
  const [userDebates, setUserDebates] = useState([]);
  

  useEffect(() => {
    console.log("in context");

    const noAuthRoutes = ["/", "/aboutus", "/login", "/register"];
    if (location.pathname === "/resetpassword") return;

    const getData = async () => {
      const token = localStorage.getItem("token");
      console.log(token);

      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:3000/api/auth/authcheck",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIsAuth(true);
          setRole(res.data.role);
          console.log(isAuth, role);
          return;
        } catch (err) {
          console.error(err);
        }
      }

      if (!noAuthRoutes.includes(location.pathname)) {
        toast.error("Session Expired! Please login again.");
        setIsAuth(false);
        navigate("/login");
      }
    };

    getData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAuth,
        setIsAuth,
        role,
        setRole,
        userDebates,
        setUserDebates, // Add functions to manage debates globally
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
