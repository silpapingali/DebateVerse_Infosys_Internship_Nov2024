import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";
import Validation from './RegisterValidation';
import axios from 'axios';

function Register() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        role:"user",
    })

    const navigate = useNavigate();
    const [errors, setErrors] =useState({});

    const handleChange = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const handleSubmit =(event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === ""){
          axios.post('http://localhost:8080/register',values)
          .then(res => {
            navigate('/');
          })
          .catch(err => console.log(err));
        }
    };
    return (
        <div className='addUser'>
            <h3>Create an Account</h3>
            <form  className='addUserForm' onSubmit={handleSubmit}>
                <div className='inputGroup'>
                    <div>
                        <label htmlFor='name'>Name :</label>
                        <input type='text' id='name' placeholder='Enter your name' name='name' onChange={handleChange} required />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div>
                        <label htmlFor='email'>Email :</label>
                        <input type='email' id='email' placeholder='Enter your email' name='email' onChange={handleChange} required />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div>
                        <label htmlFor='password'>Password :</label>
                        <input type='password' id='Password' placeholder='Enter your password ' name='password' onChange={handleChange} required />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                </div>
                <button type='submit' className="bg-success">Create an Account</button>
            </form>
            <div className='login'>
                <p>Already have an account?</p>
                <Link to="/login" className="bg-primary">Login</Link>
            </div>
        </div>
    );
}

export default Register;
