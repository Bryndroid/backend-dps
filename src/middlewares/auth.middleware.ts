import { NextFunction, RequestHandler } from "express";
import { ApiResponse } from "../shared/interfaces/ApiResponse.js";
import { HttpStatusCode } from "../shared/constants/HttpStatus.js";
import { jwtConfig } from "../config/jwt.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/database.js";
export const authMiddleware: RequestHandler =  async (req, res, next) => {

    const response: ApiResponse<null> = {
        status: HttpStatusCode.SERVICE_UNAVAILABLE,
        message: "eRROr",
        payload: null,
        error: true,
    }

    const jwt_token = req.headers.authorization?.split(" ")[1];
    if (!jwt_token) {
        response.status = HttpStatusCode.BAD_REQUEST;
        response.message = "Credenciales Incompletas"
        return res.status(response.status).json(response)
    }
    try {
        const result = jwt.verify(jwt_token, jwtConfig.secret) as JwtPayload;
        
        const user = await prisma.usuarios.findFirst({
            where: {
                email: result.email
            }
        });
        if(!user) throw new Error("XD");
        next();
    } catch (error) {
        response.status = HttpStatusCode.UNAUTHORIZED;
        response.message = 'Sin Autorizacionssss';
        console.log(error);
        return res.status(response.status).json(response);
    }

}