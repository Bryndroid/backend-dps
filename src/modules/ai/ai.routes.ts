// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.

import express, { type Request, type Response } from "express";
import { AiHarness } from "./harness/ai.harness.service.js";
import { GeminiProvider } from "./gemini.provider.js";

const aiRoutes = express.Router();
const harness = new AiHarness(new GeminiProvider());

aiRoutes.post("/example", async (req: Request, res: Response) => {
    const result = await harness.run({
        input: req.body?.input,
        conversationId: req.body?.conversationId,
        systemInstruction: "Responde en español de forma breve y clara.",
    });

    res.status(200).json({
        success: true,
        data: result,
    });
});

export default aiRoutes;
