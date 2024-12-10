import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
  const { isAuth, role } = useContext(UserContext);
  console.log("in admin", isAuth, role);
  return isAuth && role == "admin" ? <Outlet /> : <Navigate to="/login" /> ;
};

export default AdminProtected;