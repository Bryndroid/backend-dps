// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.

export interface HarnessRequest {
    input: string;
    conversationId?: string;
    systemInstruction?: string;
}

export interface HarnessResponse {
    text: string;
    interactionId?: string;
    conversationId?: string;
    attempts: number;
}

export interface AiProvider {
    createInteraction(input: {
        input: string;
        model: string;
        systemInstruction?: string;
        previousInteractionId?: string;
    }): Promise<{ id?: string; text: string }>;
}

export interface AiHarnessOptions {
    model?: string;
    maxInputLength?: number;
    maxRetries?: number;
    timeoutMs?: number;
}
