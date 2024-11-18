import React, { useState } from "react";
import "./Login.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';

function Login (){
    const [values, setValues] =useState({
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [errors, setErrors] =useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    };
    const handleSubmit =(event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login',values)
            .then(res => {
              if(res.data === "Success"){
                navigate('/home');
              }else {
                alert("No record existed");
              }
            })
            .catch(err => console.log(err));
        }
    };
    return(
        <div className="addUser" action="" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <form action=" " className='addUserForm'>
                <div className='inputGroup'>
                    <label htmlFor='email'>Email :</label>
                    <input type='email' id='email' placeholder='mail@gmail.com' name="email" onChange={handleInput} /><br></br>
                    {errors.email && <span className="text-danger">{errors.email} </span>}
                </div>
                <div className='inputGroup'>
                    <label htmlFor='password'>Password :</label>
                    <input type='password' id='password' placeholder='enter your password' name="password" onChange={handleInput} /><br></br>
                    {errors.password && <span className="text-danger">{errors.password} </span>}  
                </div>
            </form>
            <div>
                <button type="submit" className="bg-primary">Login</button>
                <p>Don't have an account?</p>
                <Link to="/register" className="bg-success">Create an Account</Link>
            </div>
        </div>
    );
};
export default Login;