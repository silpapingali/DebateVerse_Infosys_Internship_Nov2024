import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";
import Validation from './RegisterValidation';
import axios from 'axios';

function Register() {

    const [values, setValues] =useState({
        name :"",
        email:"",
        password:""
    })
    const navigate = useNavigate();
    const [errors, setErrors] =useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit =(event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === ""){
          axios.post('http://localhost:8081/register',values)
          .then(res => {
            navigate('/');
          })
          .catch(err => console.log(err));
        }
    }


  return (
    <div className='addUser'>
        <h3>Create an Account</h3>
        <form action="" className='addUserForm' onSubmit={handleSubmit}>
          <div className='inputGroup'>
            <div>
              <label htmlFor='name'>Name :</label>
              <input type='text' id='name' placeholder='enter your name' name='name' onChange={handleInput} /><br></br>
              {errors.name && <span className="text-danger">{errors.name} </span>}
            </div>
              <div>
                <label htmlFor='email'>Email :</label>
                <input type='email' id='email' placeholder='Enter your email' name='email' onChange={handleInput} /><br></br>
                {errors.email && <span className="text-danger">{errors.email} </span>}
              </div>
              <div>
                <label htmlFor='password'>Password :</label>
                <input type='password' id='Password' placeholder='Enter your password ' name='password' onChange={handleInput} /><br></br>
                {errors.password && <span className="text-danger">{errors.password} </span>}
              </div>
            </div>
        </form>
        <div className='login'>
          <button type='submit' className="bg-success">Create an Account</button>
          <p>Already have an account ?</p>
          <Link to="/login" className="bg-primary">Login</Link>
        </div>
    </div>
  );
};

export default Register;
