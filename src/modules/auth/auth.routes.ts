import express from "express";
import { AuthController } from "./auth.controller.js";
const authRoutes = express.Router();


authRoutes.post("/login", AuthController.login);
authRoutes.post("/registro", AuthController.register)


authRoutes.post("/renueve_token", AuthController.renueve_token);
authRoutes.post("/logout", AuthController.logout)
export default authRoutes;