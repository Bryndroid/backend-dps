import { Usuarios } from "@prisma/client";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { UserService } from "./user.service.js";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";

export class UserController{


    static async index(req:Request, res:Response){

        const allUsers = await UserService.findAll();
        const respuesta: ApiResponse<Usuarios> = {
            status: 200,
            message: "Usuarios encontrados",
            payload: allUsers[0],
            error: false
        }
        res.json(respuesta);
    }


    
}