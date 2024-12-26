import express from "express";
import { createDebate, getDebateById, getDebate, likeDebate, voteOption } from "../controllers/debate.controller.js";
import { debateValidationRules, validate } from "../middleware/debate.validation.js";

const router = express.Router();

// Route for creating a debate
router.post("/", debateValidationRules, validate, createDebate);
router.get("/",getDebate);
//Milestone 3
router.get("/:id",getDebateById);
router.post("/:id/like",likeDebate);
router.post("/:id/vote",voteOption);
export default router;
