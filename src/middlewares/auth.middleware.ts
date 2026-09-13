import { NextFunction, RequestHandler } from "express";
import { ApiResponse } from "../shared/interfaces/ApiResponse.js";
import { HttpStatusCode } from "../shared/constants/HttpStatus.js";
import { jwtConfig } from "../config/jwt.js";
import jwt from "jsonwebtoken";
export const authMiddleware: RequestHandler = (req, res, next) => {

    const response: ApiResponse<string> = {
        status: HttpStatusCode.SERVICE_UNAVAILABLE,
        message: "eRROr",
        payload: "",
        error: true,
    }

    const jwt_token = req.headers.authorization?.split(" ")[1];
    if (!jwt_token) {
        response.status = HttpStatusCode.BAD_REQUEST;
        response.message ="Datos Invalidos"
        return res.json(response)
    }
    try{
        const data = jwt.verify(jwt_token, jwtConfig.secret);
        
        next();
    }catch(error){
        response.status = HttpStatusCode.UNAUTHORIZED;
        response.message ='Sin Autorizacion';
        return res.json(response);
    }
    
}