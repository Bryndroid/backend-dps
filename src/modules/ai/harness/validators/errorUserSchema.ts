import { array, z } from 'zod';
export const errorSchema = z.array(z.string().describe("Aqui iran los puntos negativos del estudiante que debe de mejorar")).describe("Aqui iran contenidos TODOS los conceptos debiles del estudiante");


export type errorUser = z.infer<typeof errorSchema>;