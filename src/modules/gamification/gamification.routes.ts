import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { GameController } from "./gamification.controller.js";

const gameRoutes = express.Router();



gameRoutes.get("/strike", authMiddleware, GameController.handleStrike);

export default gameRoutes;