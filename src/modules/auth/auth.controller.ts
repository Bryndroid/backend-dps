import { Request, Response } from "express";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Usuarios } from "@prisma/client";

import { AuthService } from "./auth.service.js";
import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";
import { AuthTokens } from "../../shared/interfaces/AuthTokens.js";
import { publishUserLogin, publishUserRenueve } from "./auth.events.js";

export class AuthController {

    static async login(req: Request, res: Response) {
        //Generando respuesta defualt
        const response: ApiResponse<Omit<Usuarios, "passwordHash" | "fechaRegistro"> | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "eRROr",
            payload: null,
            error: true,
        }
        const { email, password } = req.body;
        //Validación de datos nullos.
        if (!email || !password) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Envie datos validos";
            return res.json(response);
        }
        //Verificación de proceso mediante errors de AuthService.
        try {
            const { cleanUser, token } = await AuthService.login(email, password);

            console.log(`[AuthController] Usuario ${cleanUser} logeado`);

            response.status = HttpStatusCode.OK;
            response.message = "Usuario logeado con exito"
            response.payload = cleanUser;
            response.jwt = token.jwt;
            response.refresh_token = token.refresh_token;
            response.error = false;
            res.json(response);
            
            publishUserLogin({auth: token, userId: cleanUser.id});
        } catch (error) {
            response.error = true; 
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = String(error);
            return res.json(response);
        }
        

    }
    static async register(req: Request, res: Response) {
        //Generando respuesta defualt
        const response: ApiResponse<{ nombre: string, email: string } | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "eRROr",
            payload: null,
            error: true,
        }
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Envie datos validos";
            return res.json(response);
        }

        try {
            const newUser = await AuthService.register(name, email, password);
            response.status = HttpStatusCode.CREATED;
            response.message = "Usuario creado con exito"
            response.payload = newUser,
            response.error = false
            console.log(`[AuthController] Usuario email ${newUser.email} registrado`);
            return res.json(response)

        } catch (error) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = String(error);
            return res.json(response);
        }

    }

    static async logout(req: Request, res: Response) {

        const response: ApiResponse<{ jwt: string, refresh_token: string, lifetime: string } | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "eRROr",
            payload: null,
            error: true,
        }

        const requestJWT = req.headers["authorization"];
        const refreshToken = req.headers["x-refresh-token"];
        if(!refreshToken || !requestJWT){
            
        }

    }

    static async renueve_token(req: Request, res: Response) {

        const response: ApiResponse<null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "eRROr",
            payload: null,
            error: true,
        }

        const refreshToken = req.headers["x-refresh-token"] as string;
        console.log("ljnsdfghjlksdgfalkjgsfalkjsdfgjkl");
        const {nombre, email} = req.body;

        if(!nombre || !email){
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = 'Datos invalidos';
            return res.send(response);
        }

        try{
            const {newJWT, newRefreshToken, refreshId,} = await AuthService.refresh_token(refreshToken, nombre, email);
            response.error= false;
            response.message ='Actualizacion completa'
            response.jwt = newJWT,
            response.refresh_token = newRefreshToken;
            res.send(response);
            publishUserRenueve({refreshToken: newRefreshToken, oldToken: refreshToken, refreshId: refreshId})
        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.CONFLICT;
            return res.send(response);
        }
    }
}