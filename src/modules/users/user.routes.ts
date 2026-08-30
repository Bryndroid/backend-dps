import express from "express";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { UserController } from "./user.controller.js";
const userRoutes = express.Router();

userRoutes.get("/", async (req, res)=>{
    res.send("Cumplido");
});

userRoutes.get("/ejemplo", UserController.index);
export default userRoutes