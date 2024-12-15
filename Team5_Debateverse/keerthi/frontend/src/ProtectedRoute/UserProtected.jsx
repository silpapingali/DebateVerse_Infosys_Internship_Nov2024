import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const UserProtected = () => {
  const { isAuth, role } = useContext(UserContext);
  console.log("in user", isAuth, role);
  return isAuth && role == "user" ? <Outlet /> : <Navigate to="/login" /> ;
};

export default UserProtected;