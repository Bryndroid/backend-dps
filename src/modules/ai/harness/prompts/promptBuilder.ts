// Contendra las plantillas dinamicas para generar prompts en base a los requerimientos establecidos

import { Usuarios } from "@prisma/client";
import { CommandContext, CommandsHarness, HarnessRequest } from "../../ai.types.js";
import { AIAdviceSchema, AIQuizSchema } from "../validators/quizSchema.js";
import { z } from 'zod';
import { AiHarness } from "../ai.harness.service.js";
import { errorSchema } from "../validators/errorUserSchema.js";

export interface quizzGenerateParams {
    studentName: string,
    courseTitle: string,
    language: string,
    currentModuleTitle: string,

    countErrors: number,
    typeErros: string,
    weekConcept: string,
    isEnabledQuizz: boolean,
    quizzType: "quizz" | "code"
}

export class PromptService {
    private readonly command: CommandsHarness;
    private readonly structure_header = '[Tu eres un Tutor Inteligente que tienes como proposito educar a tus estudiantesgenerando quizzes interactivos, dinamicos, entretenidos con base en sus errores y conceptos debiles y con cierto grado de complejidad para una plataforma de aplicación de cursos nativa en mobile orientada al aprendizaje de lenguajes de programación desde cero. También si el campo se te requiere debes de generar mensajes motivacionales en base al perfil, modulo y parametros generales que se te asignen. NO generes mensaje de bienvenida, unicamente genera lo que se te ORDENE.]';
    constructor(command: CommandsHarness) {
        this.command = command;
    }

    generatePrompt(params: CommandContext): HarnessRequest {

        switch (this.command) {
            case "QUIZZ_ADVICE":
                return {
                    command: this.command,
                    systemInstruction: this.structure_header,
                    prompt: this.quizzAI(params),
                    responseSchema: AIQuizSchema
                }

            case "WEEKLY_QUIZZ":
                return {
                    command: this.command,
                    systemInstruction: this.structure_header,
                    prompt: this.weekQuizAI(params),
                    responseSchema: AIQuizSchema
                }
            case "TEST_HINT":
                return {
                    command: this.command,
                    systemInstruction: this.structure_header,
                    prompt: this.hintAI(params),
                    responseSchema: AIQuizSchema // Por cambiar xd.
                }

            case "USER_ERRORS":
                return {
                    command: this.command,
                    systemInstruction: this.structure_header,
                    prompt: this.userErrorAI(params),
                    responseSchema: errorSchema
                }
            default:
                throw new Error(`[PromptBuilder] Comando no soportado: ${params}`);
        }
    }

    private quizzAI(params: CommandContext) {

        return `

        [CONTEXTO ACADEMICO]
        Curso: ${params.courseTitle} (${params.language})
        Tema Modulo: ${params.passedModule}

        [ESTUDIANTE PERFIL]
        nombre: ${params.studentName}
        concepto debil a mejorar: ${params.weakConcepts?.reduce((p, c) => p + " " + c)}
        Con esta información crea un quizz de máximo 2 preguntas con enfoque en el tematica del curso, si existe, el lenguaje y con los demás parametros que estan en este prompt. Sigue obligatoriamente el schema que se te otorga para crear el quizz. El quizz debe de ser retador en cuanto al modulo que se esta cursando y el curso.
        `.trim();
    }
    //TODO: Falta balancear la XPs
    private weekQuizAI(params: CommandContext) {
        return `
        
        [CONTEXTO ACADEMICO]
        Cursos Activos: ${params.courses} 
        Cursos Lenguajes: ${params.language}

        [ESTUDIANTE PERFIL]
        nombre: ${params.studentName}
        experiencia: ${params.total_xp > 500 ? "Moderada" : "baja"} 
        conceptos debiles a mejorar: ${params.weakConcepts?.reduce((p, c) => p + " " + c)}
        Con esta información crea un quizz de máximo ${params.total_stars > 15 ? "5" : "3"} preguntas con enfoque en el tematica del curso, si existe, el lenguaje y con los demás parametros que estan en este prompt. Sigue obligatoriamente el schema que se te otorga para crear el quizz. El quizz debe de ser retador y debe de enfocarse en las debilidades del estudiante. Si existe muchos cursos cursados y la cantidad de preguntas no abarca te ENFOCARAS unicamente en las debilidades y en los cursos que estan primero en la cadena "Cursos Activos" ya que estan por orden de cantidad de errores.
        `
    }

    private hintAI(params: CommandContext) {
        return `
        [CONTEXTO ACADEMICO]
        
        `
    }

    private userErrorAI(params: CommandContext) {
        return `
    [CONTEXTO ACADÉMICO]

    Curso: ${params.courseTitle ?? "No especificado"}

    Errores actuales del estudiante: ${JSON.stringify(params.weakConcepts ?? [])}

    Resultado del nuevo examen:
    - Examen: ${params.titleExam ?? "No especificado"}
    - Tiene errores: ${params.hasErrors}
    - Total de errores: ${params.totalErrors ?? 0}
    - Errores detectados: ${JSON.stringify(params.topicHasErrors ?? [])}

    Actualiza la lista de conceptos que el estudiante debe reforzar. 

    Reglas:
    - Responde únicamente un arreglo JSON de strings.
    - Si no hay conceptos por reforzar, responde [].
    - No repitas conceptos ya existentes.
    - Conserva conceptos anteriores si el estudiante aún demuestra esa debilidad.
    - Elimina conceptos anteriores si el nuevo examen indica que ya fueron corregidos.
    - Agrega únicamente conceptos nuevos detectados en este examen.
    - No incluyas explicaciones, texto adicional ni otro formato.
    `;
    }
}