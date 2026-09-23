import express from "express";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const userRoutes = express.Router();


//Para obtener toda la info del usuario. Por query param
userRoutes.get("/",authMiddleware, UserController.index);
//Para actualizar algo del usuario, por query param para identificar el Id y dentro del payload lo que hay que cambiar
userRoutes.patch("/",authMiddleware,UserController.update);

//Para borrar la cuenta. Por query param
userRoutes.delete("/",authMiddleware,UserController.delete);


export default userRoutes