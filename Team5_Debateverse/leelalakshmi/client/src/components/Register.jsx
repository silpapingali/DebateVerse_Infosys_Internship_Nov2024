import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("");
    const {registerUser,signInWithGoogle} = useAuth()

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // Watch the values of both password fields
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        // Clear any existing error message
        try {
           await registerUser(data.email, data.password);  
           alert("user registered successfully")
            // Redirect to success page with the email in state
        navigate("/registersuccess", { state: { email: data.email } });
        } catch (error) {
             setMessage("Please provide a valid email and password")
             console.log(error)
        }
    };

    const handleGoogleSignIn = async () => {
        // Google sign-in logic goes here
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
                <h2 className="text-xl font-semibold mb-4">Please Register</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
    <div className='mb-4'>
        <label className='block text-gray-700 text-sm mb-2' htmlFor='email'>Email</label>
        <input 
            {...register("email", { required: "Email is required" })}
            type='email' 
            id='email' 
            placeholder='Email Address' 
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
        />
        {errors.email && <p className='text-red-500 text-xs italic'>{errors.email.message}</p>}
    </div>
    
    <div className='mb-4'>
        <label className='block text-gray-700 text-sm mb-2' htmlFor='password'>Password</label>
        <input 
            {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters long" } 
            })}
            type='password' 
            id='password' 
            placeholder='Password' 
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
        />
        {errors.password && <p className='text-red-500 text-xs italic'>{errors.password.message}</p>}
    </div>

    <div className='mb-4'>
        <label className='block text-gray-700 text-sm mb-2' htmlFor='confirmPassword'>Confirm Password</label>
        <input 
            {...register("confirmPassword", { required: "Please confirm your password" })}
            type='password' 
            id='confirmPassword' 
            placeholder='Confirm Password' 
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' 
        />
        {errors.confirmPassword && <p className='text-red-500 text-xs italic'>{errors.confirmPassword.message}</p>}
    </div>

    {message && (
        <p className='text-red-500 text-xs italic mb-3'>
            {message}
        </p>
    )}
    
    <button className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded focus:outline-none'>
        Register
    </button>
</form>


                <p className='align-baseline font-medium mt-4 mb-2 text-sm'>
                    Have an account? Please <Link to='/login' className='text-blue-500 hover:text-blue-700'>Login</Link>
                </p>

                {/* Google sign in */}
                <div>
                    <button 
                        onClick={handleGoogleSignIn}
                        className='w-full flex flex-wrap gap-1 items-center justify-center bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none'>
                        <FcGoogle className='mr-2' />
                        Register with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
