import { Request, Response } from "express";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Usuarios } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { JWTpayload } from "../../shared/interfaces/JwtPayload.js";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service.js";

export class AuthController{

    static async login(req:Request, res: Response){
        console.log('AUTH RESPONSE')
        const response: ApiResponse<Usuarios | null> = {
            status: 500,
            message: "eRROr",
            payload: null,
            error: true,
        }
        const {email, password} = req.body;

        if(!email || !password){
            response.status = 6969;
            response.message = "Envie datos validos";
            return res.json(response);
        }
        console.log(email);
        const {user, token} = await AuthService.login(email, password);
        response.status = 200;
        response.message = "Usuario logeado con exito"
        response.payload = user;
        response.jwt = token;
        response.error = false
        return res.json(response)
        
    }
    static async register(req: Request, res: Response){
        const response: ApiResponse<{nombre: string, email: string} | null> = {
            status: 500,
            message: "eRROr",
            payload: null,
            error: true,
        }
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            response.status = 6969;
            response.message = "Envie datos validos";
            return res.json(response);
        }

        try{
            const newUser = await AuthService.register(name, email, password);
            response.message = "Usuario creado con exito"
            response.payload = newUser,
            response.error = false
            return res.json(response)

        }catch(error){
            response.status = 400;
            response.message = error as string;
            return res.json(response);
        }
        
    }
    
}