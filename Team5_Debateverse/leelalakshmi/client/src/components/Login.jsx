import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [message, setMessage] = useState("");
    const {loginUser,signInWithGoogle} = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // Mock validation check
        try {
            await loginUser(data.email,data.password);
            alert("Login successfull");
            navigate("/")
        } catch (error) {
            setMessage("Please provide a valid email and password")
            console.log(error) 
        }
        
    };

    const handleGoogleSignIn = async () => {
        // Google sign-in logic
        try {
            await signInWithGoogle();
            alert("Login successful!")
            navigate("/")
        } catch (error) {
            alert("Google sign in failed")
            console.log(error) 
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white/80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Please Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm mb-2' htmlFor='email'>Email</label>
                        <input 
                            {...register("email", { required: true })}
                            type='email' 
                            name='email' 
                            id='email' 
                            placeholder='Email Address' 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">Email is required</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm mb-2' htmlFor='password'>Password</label>
                        <input 
                            {...register("password", { required: true })}
                            type='password' 
                            name='password' 
                            id='password' 
                            placeholder='Password' 
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">Password is required</p>}
                    </div>

                    {message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>}

                    <div>
                        <button className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none'>Submit</button>
                    </div>
                </form>

                <p className='align-baseline font-medium mt-4 mb-2 text-sm'>
                    Haven't an account? Please <Link to='/register' className='text-blue-500 hover:text-blue-700'>Register</Link>
                </p>

                {/* Google sign-in */}
                <div>
                    <button 
                        onClick={handleGoogleSignIn}
                        className='w-full flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none'
                    >
                        <FcGoogle className='mr-2' />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;