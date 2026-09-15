import express from "express";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const authRoutes = express.Router();


authRoutes.post("/login", AuthController.login);
authRoutes.post("/registro", AuthController.register)

//Aqui seras redireccionado cuando alguna request que requiere de JWT presentes un jwt expirado. Entonces si aqui recibes una respuesta mala (que no sea error), borraras todos los tokens desde tu lado, ya que se tratará de que alguien te ha robado los tokens.
authRoutes.post("/renueve_token", AuthController.renueve_token);

//Aqui si es exitoso el logout, se borran los tokens de los dos lados.

authRoutes.get("/logout",authMiddleware,AuthController.logout)
export default authRoutes;