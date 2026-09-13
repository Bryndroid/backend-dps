// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.

import type {
    AiHarnessOptions,
    AiProvider,
    HarnessRequest,
    HarnessResponse,
} from "./ai.types.js";

interface ConversationState {
    previousInteractionId?: string;
}
//TODO: Migrar esto a operaciones desacopladas independientes. Probablemente evitar ocupar tantos mapeos / diccionarios de TS y simplicar el control
//Priorizar el funcionamiento y que acceda a datos de mi bd. Luego plantear estatregias de eficiencia de tokens.
export class AiHarness {
    private readonly conversations = new Map<string, ConversationState>();
    private readonly model: string;
    private readonly maxInputLength: number;
    private readonly maxRetries: number;
    private readonly timeoutMs: number;

    constructor(
        private readonly provider: AiProvider,
        options: AiHarnessOptions = {},
    ) {
        this.model = options.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
        this.maxInputLength = options.maxInputLength ?? 4_000;
        this.maxRetries = options.maxRetries ?? 2;
        this.timeoutMs = options.timeoutMs ?? 30_000;
    }

    async run(request: HarnessRequest): Promise<HarnessResponse> {
        const input = typeof request.input === "string" ? request.input.trim() : "";
        if (!input) {
            throw new Error("El campo input es obligatorio");
        }
        if (input.length > this.maxInputLength) {
            throw new Error(`El campo input no puede superar ${this.maxInputLength} caracteres`);
        }

        const state = request.conversationId ? this.conversations.get(request.conversationId) ?? {} : {};
        let attempts = 0;
        let lastError: unknown;

        while (attempts <= this.maxRetries) {
            attempts += 1;
            try {
                const result = await this.withTimeout(
                    this.provider.createInteraction({
                        input,
                        model: this.model,
                        systemInstruction: request.systemInstruction,
                        previousInteractionId: state.previousInteractionId,
                    }),
                );

                if (!result.text) {
                    throw new Error("Gemini devolvió una respuesta vacía");
                }

                if (request.conversationId && result.id) {
                    this.conversations.set(request.conversationId, {
                        previousInteractionId: result.id,
                    });
                }

                return {
                    text: result.text,
                    interactionId: result.id,
                    conversationId: request.conversationId,
                    attempts,
                };
            } catch (error) {
                lastError = error;
                if (attempts > this.maxRetries || !this.isRetryable(error)) {
                    throw error;
                }
            }
        }

        throw lastError instanceof Error ? lastError : new Error("La interacción con Gemini falló");
    }

    private async withTimeout<T>(promise: Promise<T>): Promise<T> {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("Tiempo de espera agotado para Gemini")), this.timeoutMs);
        });

        try {
            return await Promise.race([promise, timeout]);
        } finally {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }

    private isRetryable(error: unknown): boolean {
        if (!(error instanceof Error)) {
            return false;
        }

        const status = (error as Error & { status?: number }).status;
        return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
    }
}
