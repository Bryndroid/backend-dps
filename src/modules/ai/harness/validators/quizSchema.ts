import { z } from 'zod';
//Son importantes los .describe dentro de Zod para darle contexto a la IA adjuntada como metadata del objeto

export const AIQuizSchema = z.object({
    contentType: z.enum(['quizz', 'code']).describe('Identificador si es teoría o practica de programación'),
    weekConcept: z.string().describe("El concepto débil que se planea mejorar"),
    message: z.string().max(50).describe("Descripción de lo que será el mini quizz / code"),
    rewardType: z.enum(['XP']).describe("Unicamente recompensa con XP, que por default es 100"),

    topics: z.array(z.object({
        id: z.number().max(4),
        question: z.string().max(50).describe("Pregunta / Planteamiento de la problematica"),
        code: z.string().nullable().describe("Si se refiere a un contentType de code, se renderizará un código de lo contrario se mantendrá nullo"),

        options: z.array(z.object({
            id: z.enum(["A", "B", "C", "D"]),
            description: z.string().max(40)
            //Aqui podría meter más descripción
        })).describe("Las opciones de respuesta que puede elegir el estudiante"),
        
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        explanation: z.string().max(60).describe("Explicar cuando se seleccione una respuesta correcta.")

    }))
});


export const AIAdvice = z.object({
    contentTpe: z.enum(['advice']),
    mesasage: z.string().max(50).describe("Mensaje motivacional corto para mejorar la conecntración."),

})