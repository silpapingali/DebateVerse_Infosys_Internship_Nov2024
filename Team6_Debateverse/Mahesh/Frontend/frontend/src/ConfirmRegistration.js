import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  

const ConfirmRegistration = () => {
    const [status, setStatus] = useState("loading"); 
    const [message, setMessage] = useState(""); 
    const { token } = useParams();  

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid request. No confirmation token provided.");
            return;
        }

        
        const confirmRegistration = async () => {
            try {
                const response = await fetch(`http://localhost:8081/confirm-registration/${token}`, {
                    method: "GET",
                });

                if (response.ok) {
                    setStatus("success");
                    setMessage("Registration confirmed! You can now log in.");
                } else {
                    const errorData = await response.json();
                    setStatus("error");
                    setMessage(errorData.message || "Invalid or expired confirmation token.");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
                setMessage("Something went wrong while confirming your registration. Please try again later.");
            }
        };

        confirmRegistration();
    }, [token]);  

    return (
        <div style={styles.container}>
            {status === "loading" && (
                <div>
                    <div className="spinner-border text-primary" role="status" style={styles.icon}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Processing your request...</p>
                </div>
            )}

            {status === "success" && (
                <div style={styles.success}>
                    <div style={styles.icon}>✔️</div>
                    <h2>Registration Confirmed!</h2>
                    <p>{message}</p>
                    <a href="/" className="btn btn-primary">Go to Login</a>
                </div>
            )}

            {status === "error" && (
                <div style={styles.error}>
                    <div style={styles.icon}>❌</div>
                    <h2>Registration Failed</h2>
                    <p>{message}</p>
                    <a href="/signup" className="btn btn-secondary">Go to Signup</a>
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        textAlign: "center",
    },
    icon: {
        fontSize: "50px",
        marginBottom: "15px",
    },
    success: {
        color: "green",
    },
    error: {
        color: "red",
    },
};

export default ConfirmRegistration;
