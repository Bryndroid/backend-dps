import { GoogleGenAI } from "@google/genai";
import type { AiProvider } from "./ai.types.js";
//Esto si me gusta mucho
export class GeminiProvider implements AiProvider {
    private client: GoogleGenAI | undefined;
    private readonly apiKey?: string;

    constructor(apiKey = process.env.GEMINI_API_KEY) {
        this.apiKey = apiKey;
    }

    async createInteraction(input: {
        input: string;
        model: string;
        systemInstruction?: string;
        previousInteractionId?: string;
    }): Promise<{ id?: string; text: string }> {
        if (!this.apiKey) {
            throw new Error("GEMINI_API_KEY no está configurada");
        }
        this.client ??= new GoogleGenAI({ apiKey: this.apiKey });

        const interaction = await this.client.interactions.create({
            model: input.model,
            input: input.input,
            system_instruction: input.systemInstruction,
            previous_interaction_id: input.previousInteractionId,
            store: true,
        });

        return {
            id: interaction.id,
            text: interaction.output_text?.trim() ?? "",
        };
    }
}
