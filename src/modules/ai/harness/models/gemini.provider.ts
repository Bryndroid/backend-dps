// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.

import { FunctionDeclaration, GoogleGenAI } from "@google/genai";
import type { AiProvider, AiResponse, FunctionTool } from "../../ai.types.js";
//Esto si me gusta mucho
export class GeminiProvider implements AiProvider {
    private client: GoogleGenAI | undefined;
    private readonly apiKey?: string;


    constructor(apiKey = process.env.GEMINI_API_KEY) {
        this.apiKey = apiKey;
    }
    
    async createInteraction(input: {input: string;model: string;systemInstruction?: string;previousInteractionId?: string; tools?: FunctionTool[]; schema: object}): Promise<AiResponse> {

        if (!this.apiKey) {
            throw new Error("GEMINI_API_KEY no está configurada");
        }

        this.client ??= new GoogleGenAI({ apiKey: this.apiKey });

        const interaction = await this.client.interactions.create({
            model: input.model,
            input: input.input,
            system_instruction: input.systemInstruction,
            previous_interaction_id: input.previousInteractionId,
            tools: input.tools,
            response_format: {
                type: "text",
                mime_type: "application/json",
                schema: input.schema,
            },
            store: true,
        });
        
        const rawCalls = interaction.steps?.filter( (step) =>  step.type === "function_call" );
        const functionCalls = rawCalls?.length ? rawCalls.map((step) => ({ callId: step.id, name: step.name, args: step.arguments ?? {}, })) : undefined;
        
        return {
            id: interaction.id,
            text: interaction.output_text?.trim() ?? "",
            functionCalls
        };
    }
}
