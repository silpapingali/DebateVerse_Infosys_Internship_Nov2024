import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app =express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());  

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
//Q1ouxb2DTnY6WX0k