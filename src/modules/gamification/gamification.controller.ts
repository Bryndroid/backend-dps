import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Request, Response } from "express";
import { GameService } from "./gamification.service.js";
import { AIQuiz } from "../ai/harness/validators/quizSchema.js";
import { publishWeekQuizz } from "./gamification.events.js";
import { RecompensasCatalogo } from "@prisma/client";

export class GameController {

    static async handleStrike(req: Request, res: Response) {

        const response: ApiResponse<{ strike: number, hasAument: boolean, dateLastStrike: Date, hasUsedShield: boolean, hasToday: Boolean } | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "Error",
            payload: null,
            error: true
        }

        const { id, date } = req.query;
        if (!id || !Number.isInteger(Number(id)) || !date || Number.isNaN(new Date(date as string).getTime())) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Datos invalidos";
            return res.status(response.status).json(response)
        }

        try {
            const { hasAument, strike, dateLastStrike, hasUsedShield, hasToday } = await GameService.handleStrike(parseInt(id as string), new Date(date as string));
            response.status = HttpStatusCode.ACCEPTED;
            response.error = false;
            response.payload = { strike: strike, hasAument: hasAument, dateLastStrike: dateLastStrike, hasUsedShield: hasUsedShield, hasToday: hasToday };
            response.message = hasAument ? "Racha actualizada." : hasToday ? "Racha mantenida" : "La racha termino.";
            return res.status(response.status).json(response);
        } catch (error) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = String(error);
            return res.status(response.status).json(response);
        }
    }

    static async reward(req: Request, res: Response){
        const response: ApiResponse< RecompensasCatalogo |null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "Error",
            payload: null,
            error: true
        }

        const { source, nameReward } = req.body;

        const rewardType = req.query.type as string;
        const userId = req.query.id as string;

        if(!rewardType || !userId || !Number.isInteger(Number(userId))){
            response.message = "Datos Incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try{

            const reward = await GameService.reward(parseInt(userId), rewardType, nameReward, source);

            response.message = "Recompensa Registrada";
            response.status = HttpStatusCode.ACCEPTED;
            response.payload = reward;
            response.error = false;

            return res.status(response.status).json(response);

        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }
    }

    static async rewardCatalog(req: Request, res: Response) {
        const response: ApiResponse<RecompensasCatalogo[]> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "Error",
            payload: [],
            error: true
        };

        try {
            const rewards = await GameService.rewardCatalog();

            response.status = HttpStatusCode.ACCEPTED;
            response.message = "Catálogo de recompensas devuelto";
            response.payload = rewards;
            response.error = false;

            return res.status(response.status).json(response);
        } catch (error) {
            response.status = HttpStatusCode.BAD_GATEWAY;
            response.message = String(error);

            return res.status(response.status).json(response);
        }

    }

    static async weekQuiz(req: Request, res: Response) {
        const response: ApiResponse<AIQuiz | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "Error",
            payload: null,
            error: true
        }
        
        const userId = req.query.id as string;

        if(!userId || !Number.isInteger(Number(userId))){
            response.message = "Datos Incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try{
            const AIQuiz = await GameService.weekQuiz(parseInt(userId));

            response.error = false;
            response.message = AIQuiz ? "Quizz Semanal devuelto" : "Creando quizz semanal...";
            response.status = HttpStatusCode.ACCEPTED;
            response.payload = AIQuiz;

            if(AIQuiz){
                return res.status(response.status).json(response);
            }else{
                res.status(response.status).json(response);
                publishWeekQuizz({userId: parseInt(userId)});
            }
        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.BAD_GATEWAY;
            return res.status(response.status).json(response);
        }
    }
}