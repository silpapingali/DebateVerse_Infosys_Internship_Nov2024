import express from "express";
import { getDebateById, getDebate, likeDebate, voteOption } from "../controllers/debate.controller.js";
import { closeDebate } from "../controllers/close.controller.js";

const router = express.Router();

// Route for creating a debate

router.get("/",getDebate);
//Milestone 3
router.get("/:id",getDebateById);
router.put("/:id/like",likeDebate);
router.put("/:id/vote",voteOption);
router.put("/:id/close",closeDebate)
export default router;
