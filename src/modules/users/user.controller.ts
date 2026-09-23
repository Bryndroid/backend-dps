import { Usuarios } from "@prisma/client";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { UserService } from "./user.service.js";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";

export class UserController {

    //Obtener info
    static async index(req: Request, res: Response) {

        const response: ApiResponse<Omit<Usuarios, "passwordHash" | "fechaRegistro"> | null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error",
            payload: null,
            error: true
        }
        const userId = req.query.id as string;

        if (!userId || !Number.isInteger(Number(userId))) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Datos Incompletos";
            return res.status(response.status).json(response);
        }

        try {

            const user = await UserService.findUser(parseInt(userId));
            response.message = "Usuario Encontrado";
            response.status = HttpStatusCode.OK;
            response.payload = user;
            response.error = false;
            return res.status(response.status).json(response);
        } catch (error) {
            response.status = HttpStatusCode.NOT_FOUND;
            response.message = String(error);
            return res.status(response.status).json(response);
        }
    }


    //Update de datos de la cuenta
    static async update(req: Request, res: Response) {
        const response: ApiResponse<Omit<Usuarios, "passwordHash" | "fechaRegistro"> | null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error",
            payload: null,
            error: true
        }
        //Que me mande todo, para no parsear que me trajo.
        const userId = req.query.id as string;
        const { name, email, password } = req.body;


        if (!userId || !Number.isInteger(Number(userId)) || !password) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Datos Incompletos";
            return res.status(response.status).json(response);
        }
        try {
            const updateUser = await UserService.updateUser(parseInt(userId), name, password, email);
            response.error = false;
            response.status = HttpStatusCode.OK;
            response.message = "Usuario actualizado";
            response.payload = updateUser;
            return res.status(response.status).json(response);

        } catch (error) {
            response.status = HttpStatusCode.NOT_FOUND;
            response.message = String(error);
            return res.status(response.status).json(response);
        }

    }
    //Eliminar cuenta
    static async delete(req: Request, res: Response) {
        const response: ApiResponse<null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error",
            payload: null,
            error: true
        }
        const userId = req.query.id as string;

        if(!userId || !Number.isInteger(Number(userId))){
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message ="Datos incompletos";
            return res.status(response.status).json(response);
        }

        try{
            await UserService.delete(parseInt(userId));
            response.message = "Usuario borrado."
            response.error = false;
            response.status = HttpStatusCode.OK;
            return res.status(response.status).json(response);
        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

    }


}