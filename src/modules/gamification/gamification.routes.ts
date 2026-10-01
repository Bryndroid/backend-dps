import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { GameController } from "./gamification.controller.js";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware.js";

const gameRoutes = express.Router();


gameRoutes.get("/rewards_catalogo", authMiddleware, GameController.rewardCatalog)

gameRoutes.get("/strike", authMiddleware, GameController.handleStrike);
gameRoutes.get("/week_quiz",strictLimiter, authMiddleware, GameController.weekQuiz)

gameRoutes.post("/reward", authMiddleware, GameController.reward);

export default gameRoutes;