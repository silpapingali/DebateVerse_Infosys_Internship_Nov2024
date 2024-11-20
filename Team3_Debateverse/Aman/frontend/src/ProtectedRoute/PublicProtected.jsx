import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom';

const PublicProtected = () => {
    const {isAuth, role}= useContext(UserContext);
    const goto = (role=='user')? "/userdashboard" : "admindashboard";
    console.log(isAuth, role);
  return (
    !isAuth? <Outlet/> : <Navigate to={goto}/>
  )
}

export default PublicProtected