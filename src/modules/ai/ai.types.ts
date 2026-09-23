// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.

import { FunctionDeclaration } from "@google/genai";
import { z } from "zod";

export type CommandsHarness = "QUIZZ_ADVICE" | "WEEKLY_QUIZZ" | "TEST_HINT" | "USER_ERRORS";

export interface FunctionTool {
    type: "function",
    name: string,
    description: string,
    parameters: Record<string, any>;
}
export interface AiResponse { 
    id?: string; 
    text: string; 
    functionCalls?: any[] 
}

export interface AiProvider {
    createInteraction(input: {
        input: any;
        model: string;
        systemInstruction?: string;
        previousInteractionId?: string;
        schema?: object,
        tools?: FunctionTool[];
    }): Promise<AiResponse>;
}

export interface AiHarnessOptions {
    model?: string;         // Mantenido por retrocompatibilidad
    models?: string[];      // NUEVO: Array de modelos de respaldo
    maxInputLength?: number;
    maxRetries?: number;
    timeoutMs?: number;
    command: CommandsHarness;
}



export interface HarnessResponse<T = unknown> {
    rawText: string;
    data?: T;                     // Resultado parseado y tipado con Zod (si aplica)
    conversationId?: string;
    executedTools: string[];      // Lista de herramientas que la IA ejecutó durante la llamada
}
export interface CommandContext {
    userId: number,
    studentName?: string,
    courseTitle?: string,
    passedModule?: string;
    weakConcepts?: string[];
    [key: string]: any;
}
export interface HarnessRequest<T = unknown> {
    command: CommandsHarness;
    systemInstruction: string;
    prompt: string;
    responseSchema?: z.ZodType<T>;
    tools?: FunctionTool[];
    conversationId?: string;
}