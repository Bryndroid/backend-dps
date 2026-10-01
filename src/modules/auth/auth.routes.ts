import express from "express";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const authRoutes = express.Router();


authRoutes.post("/login", AuthController.login);
authRoutes.post("/registro", AuthController.register)

authRoutes.post("/renueve_token", AuthController.renueve_token);

authRoutes.get("/logout",authMiddleware,AuthController.logout)
export default authRoutes;