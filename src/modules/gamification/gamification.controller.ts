import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";
import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Request, Response } from "express";
import { GameService } from "./gamification.service.js";

export class GameController {

    static async handleStrike(req: Request, res: Response) {

        const response: ApiResponse<{ strike: number, hasAument: boolean, dateLastStrike: Date, hasUsedShield: boolean, hasToday: Boolean } | null> = {
            status: HttpStatusCode.SERVICE_UNAVAILABLE,
            message: "Error",
            payload: null,
            error: true
        }

        const { id, date } = req.query;
        if (!id || !date) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = "Datos invalidos";
            return res.json(response)
        }

        try {
            const { hasAument, strike, dateLastStrike, hasUsedShield, hasToday } = await GameService.handleStrike(parseInt(id as string), new Date(date as string));
            response.status = HttpStatusCode.ACCEPTED;
            response.error = false;
            response.payload = { strike: strike, hasAument: hasAument, dateLastStrike: dateLastStrike, hasUsedShield: hasUsedShield, hasToday: hasToday };
            response.message = hasAument? "Racha actualizada." : hasToday ?  "Racha mantenida" : "La racha termino.";
            return res.json(response);
        } catch (error) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = String(error);
            return res.json(response);
        }
    }
}