import express from "express";
import { getUsers,toggleUserStatus } from "../controllers/usercontroller.js";
const router = express.Router();

// Route to get all users
router.get('/', getUsers);

// Route to toggle user status
router.put('/:id', toggleUserStatus);

export default router;
