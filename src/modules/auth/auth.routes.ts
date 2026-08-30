import express from "express";
import { AuthController } from "./auth.controller.js";
const authRoutes = express.Router();


authRoutes.post("/login", AuthController.login);
authRoutes.post("/registro", AuthController.register);
export default authRoutes;