import express from "express";

import {
	login,
	logout,
	signup,
	forgotPassword,
	verifyEmail,
	resetPassword,
	checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.post("/verify-email", verifyEmail);



export default router;
