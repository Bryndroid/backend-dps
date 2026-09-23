// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
import type {
    AiHarnessOptions,
    AiProvider,
    HarnessRequest,
    HarnessResponse,
} from "./../ai.types.js";
import { z, ZodError } from "zod";

interface ConversationState {
    previousInteractionId?: string;
}

export class AiHarness {
    // AHORA ACEPTAMOS UN ARRAY DE MODELOS
    private readonly models: string[];
    private readonly maxRetries: number;
    private readonly timeoutMs: number;

    constructor(
        private readonly provider: AiProvider,
        options: AiHarnessOptions,
    ) {
        // CORRECCIÓN: Aceptamos un modelo único (para retrocompatibilidad) o un array.
        // Si no se pasa nada, el default sigue siendo gemini-3.5-flash
        if (options.models && options.models.length > 0) {
            this.models = options.models;
        } else if (options.model) {
            this.models = [options.model];
        } else {
            this.models = ["gemini-3.5-flash"];
        }
        
        this.maxRetries = options.maxRetries ?? 1;
        this.timeoutMs = options.timeoutMs ?? 120000; 
    }

    async run<T>(request: HarnessRequest<T>): Promise<HarnessResponse<T>> {
        let attempts = 0;
        let currentModelIndex = 0; 
        
        console.log("[AiHarness] Iniciando ejecución con los siguientes parametros:");
        console.log(`Prompt:  ${request.prompt}`);
        console.log(`Comando: ${request.command}`); 

        let currentInput: string | object[] = request.prompt; // CORRECCIÓN: Tipado más estricto que 'any'
        let currentPreviousId: string | undefined = request.conversationId;

        while (attempts < this.maxRetries) {
            attempts++;
            
            // Lógica de Fallback de Modelos
            if (currentModelIndex >= this.models.length) {
                 // Si se nos acaban los modelos de respaldo, volvemos al principal (opcional)
                 // o podríamos lanzar un error de "Todos los modelos fallaron".
                 console.log("[AiHarness] Todos los modelos de la lista fallaron. Volviendo al modelo principal.");
                 currentModelIndex = 0; 
            }
            const activeModel = this.models[currentModelIndex];

            console.log(`[AiHarness] Iniciando ejecución intento ${attempts} usando el modelo: ${activeModel}`);

            try {
                // 1. Invocación al modelo asignado
                // CORRECCIÓN: AHORA SÍ ESTAMOS USANDO withTimeout
                const result = await this.withTimeout(this.provider.createInteraction({
                    model: activeModel, // Usamos el modelo activo del array
                    input: currentInput,
                    systemInstruction: request.systemInstruction,
                    previousInteractionId: currentPreviousId,
                    tools: request.tools,
                    schema: request.responseSchema ? z.toJSONSchema(request.responseSchema, { target: "openapi-3.0" }) : undefined,
                })); 

                currentPreviousId = result.id;

                // 2. Validación (HTTP fue 200 OK, pero revisamos la estructura de los datos)
                const parsedData = this.validateOutput<T>(result.text, request.responseSchema);

                return {
                    rawText: result.text,
                    data: parsedData,
                    conversationId: result.id ?? request.conversationId,
                    executedTools: [],
                };

            } catch (error: any) {
                console.error(`[AiHarness] Error en el intento ${attempts}:`, error.message || error);

                if (error instanceof TimeoutError) {
                    if (attempts >= this.maxRetries) throw error;
                    
                    // Si hay timeout, intentamos con el SIGUIENTE modelo en el array
                    console.log(`[AiHarness] Timeout con modelo ${activeModel}. Rotando al siguiente modelo...`);
                    currentModelIndex++;
                    continue;
                }

                if (error instanceof Error && 'status' in error) {
                    if (this.isRetryable(error)) {
                        if (attempts >= this.maxRetries) throw error;

                        // Si es 429 (Too Many Requests) u otro error de servidor, rotamos modelo
                        console.log(`[AiHarness] Error de red (${(error as any).status}) con modelo ${activeModel}. Rotando al siguiente modelo...`);
                        currentModelIndex++;
                        continue;
                    } else {
                        console.log("[AiHarness] Error crítico irrecuperable de red...");
                        throw new Error("Error irrecurable de red en la arquitectura de Harness");
                    }
                }

                if (attempts >= this.maxRetries) {
                    throw new Error(`[AiHarness] Falló la validación de salida tras ${this.maxRetries} intentos. Error final: ${error.message || error}`);
                }

                console.log("[AiHarness] Error de validación. Pidiendo corrección al mismo modelo...");
                currentInput = `El resultado anterior falló la validación. Arregla este Error y devuelve un formato válido. Detalle del error: ${error.message || error}`;
                // Nota: Aquí NO rotamos el modelo (currentModelIndex++), porque es un error de formato,
                // no de saturación de la API. Le damos al mismo modelo la oportunidad de autocorregirse.
            }
        }

        throw new Error("[AiHarness] Error inesperado en la ejecución del Harness");
    }

    private async withTimeout<T>(promise: Promise<T>): Promise<T> {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new TimeoutError()), this.timeoutMs);
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
        console.log(`Status del error HTTP: ${status}`);
        
        // CORRECCIÓN: Se agrega 429 (Too Many Requests) vital para el tier gratuito
        return status === 429 || status === 408 || status === 500 || status === 502 || status === 503 || status === 504;
    }

    private validateOutput<T>(text: string, responseSchema?: z.ZodType<T>): T {
        const rawJson = JSON.parse(text);

        if (!responseSchema) {
            return rawJson as T;
        }

        const result = responseSchema.safeParse(rawJson);

        if (!result.success) {
            throw result.error;
        }

        return result.data;
    }
}

export class TimeoutError extends Error {
    constructor(message = "Tiempo de espera agotado para el modelo") {
        super(message);
        this.name = "TimeoutError";
    }
}