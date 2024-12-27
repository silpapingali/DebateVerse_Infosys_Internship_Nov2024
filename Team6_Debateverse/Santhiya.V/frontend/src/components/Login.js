import React, { useState } from "react";
import "./Login.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!validationErrors.email && !validationErrors.password) {
            axios.post('http://localhost:8080/login', values)
                .then(res => {
                    if (res.data.success) {
                        const userRole = res.data.role; // Assuming backend returns the role
                        if (userRole === "admin") {
                            navigate('/admin');
                        } else if (userRole === "user") {
                            navigate('/home');
                        }
                    } else {
                        alert("Invalid credentials or user not found");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="addUser">
            <h3>Login</h3>
            <form className='addUserForm' onSubmit={handleSubmit}>
                <div className='inputGroup'>
                    <label htmlFor='email'>Email :</label>
                    <input type='email' id='email' placeholder='mail@gmail.com' name="email" onChange={handleInput} required />
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>
                <div className='inputGroup'>
                    <label htmlFor='password'>Password :</label>
                    <input type='password' id='password' placeholder='Enter your password' name="password" onChange={handleInput} required />
                    {errors.password && <span className="text-danger">{errors.password}</span>}
                    <div className="forgot">
                        <Link to="/forgotpassword">Forgot Password</Link> 
                    </div>
                </div>
                <button type="submit" className="bg-primary">Login</button>
            </form>
            <div>
                <p>Don't have an account?</p>
                <Link to="/register" className="bg-success">Create an Account</Link>
            </div>
        </div>
    );
}

export default Login;
