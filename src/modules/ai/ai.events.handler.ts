import { error } from "node:console";
import { prisma } from "../../config/database.js";
import { EventPayload } from "../../shared/interfaces/Context.js";
import { UserPassModulePayload } from "../../shared/interfaces/UserPassModulet.js";
import { CommandContext } from "./ai.types.js";
import { AiHarness } from "./harness/ai.harness.service.js";
import { GeminiProvider } from "./harness/models/gemini.provider.js";
import { PromptService } from "./harness/prompts/promptBuilder.js";
import { WeekQuizzPayload } from "../gamification/gamification.events.js";
import { ExamCompleteStatus } from "../courses/course.events.js";

//Generar el examen sorpresa.
//Aqui ya viene con los campos "". TODO: Verificar si es buena idea traerlo asi...
export async function HarnessPassModuleHandler(data: EventPayload<UserPassModulePayload>) {
    try {

        //Obteniendo datos del estudiante
        const { userId, courseTitle, passedModule } = data.payload;

        const user = await prisma.usuarios.findFirst({
            where: {
                id: userId,
            },
            select: {
                nombre: true,
                usuarioContexto: {
                    select: {
                        conceptosDebiles: true,
                        porcentajeRefuerzo: true,

                    }
                },
            }
        });

        if (!user) {
            throw new Error("Error al encontrar el usuario");
        }
        const isQuiz = Math.random() < user.usuarioContexto[0].porcentajeRefuerzo.toNumber();
        if (!isQuiz) {
            console.log("[Tutor AI] Usuario Salvado Id: " + userId);
            return;
        }

        //GENERANDO AIQUIZZ
        const weakConcepts = user.usuarioContexto[0]?.conceptosDebiles ? user.usuarioContexto[0].conceptosDebiles.split(",") : [];
        const commandContext: CommandContext = {
            userId,
            studentName: user.nombre,
            courseTitle,
            passedModule,
            weakConcepts,
        };
        //Creando el prompt para el harness
        const request = (new PromptService("QUIZZ_ADVICE")).generatePrompt(commandContext);
        //Creo el harness en base al modelo de Gemini con el mismo comando. //En Options puedes mandarle un array constants de modelos que puede ocupar el AiHarness.
        const harness_gemini = new AiHarness(new GeminiProvider(), { command: request.command });

        //Genero la respuesta con Gemini
        const response = await harness_gemini.run(request);

        if (response.data && response.rawText) {
            console.log(response.data);
            console.log(response.rawText);

            console.log(`[Tutor AI] Guardando respuesta de Tutor IA...`);
            const result = await prisma.usuarioContexto.updateMany({
                where: {
                    usuarioId: userId
                },
                data: {
                    ultimoQuizGenerado: JSON.stringify(response.data)
                }
            });

            console.log(`[Tutor AI] Respuesta guardada: `);

        } else {
            console.log(`[Tutor AI] Usuario salvado por input invalido...`);
        }

    } catch (error) {
        console.error(String(error));
    }
}

//Generar el quizz semanal

export async function HarnessWeekQuiz(data: EventPayload<WeekQuizzPayload>) {
    try {
        const { userId } = data.payload;

        const userContext = await prisma.usuarios.findUnique({
            where: {
                id: userId,
            },
            select: {
                nombre: true,
                xpTotales: true,
                estrellasBalance: true,
                usuarioCurso: {
                    select: {
                        id: true,
                        cursoId: true,
                        conteoErrores: true,
                        curso: {
                            select: {
                                id: true,
                                titulo: true,
                                lenguajeProgramacion: true
                            }
                        }
                    },
                    orderBy: {
                        conteoErrores: "desc"
                    }
                },
                usuarioContexto: {
                    select: {
                        id: true,
                        conceptosDebiles: true
                    }
                }
            }
        });
        if (!userContext) throw new Error("Usuario No registrado");
        const params: CommandContext = {
            userId: userId,
            studentName: userContext?.nombre,
            courses: userContext?.usuarioCurso.reduce((p, c) => p + ", " + c.curso?.titulo, ""),
            language: userContext?.usuarioCurso.reduce((p, c) => p + ", " + c.curso?.lenguajeProgramacion, ""),
            total_xp: userContext?.xpTotales,
            weakConcepts: userContext?.usuarioContexto.map((c) => c.conceptosDebiles),
            total_stars: userContext?.estrellasBalance

        }
        const request = (new PromptService("WEEKLY_QUIZZ")).generatePrompt(params);

        const harness_gemini = new AiHarness(new GeminiProvider(), { command: request.command });

        const response = await harness_gemini.run(request);

        if (response.data) {
            console.log(response.data);
            console.log(response.rawText);

            console.log(`[Tutor AI] Guardando respuesta de Tutor IA...`);

            await prisma.usuarioContexto.updateMany({
                where: {
                    usuarioId: userId
                },
                data: {
                    resumenSemanaActual: response.rawText
                }
            });
            console.log(`[Tutor AI] Respuesta guardada...`);
        }

    } catch (error) {
        console.error(error);
    }
}

export async function HarnessPassExam(data: EventPayload<ExamCompleteStatus>) {
    try {
        const { userId, courseId, hasErrors, titleExam, topicHasErrors, totalErrors } = data.payload;
        const userCourse = await prisma.cursos.findUnique({
            where: {
                id: courseId,
            },
            select: {
                titulo: true,
            }
        });

        const user = await prisma.usuarioContexto.findFirst({
            where: {
                usuarioId: userId
            }
        })

        if (!userCourse || !user) throw new Error("Curso no identificado en el evento");

        const params: CommandContext = {
            userId: userId,
            weekConcepts: user.conceptosDebiles,
            courseTitle: userCourse.titulo,

            titleExam: titleExam,
            hasErrors: hasErrors,
            totalErrors: totalErrors,
            topicHasErrors: topicHasErrors
        }

        const request = (new PromptService("USER_ERRORS")).generatePrompt(params);

        const harness_gemini = new AiHarness(new GeminiProvider(), { command: request.command });

        const response = await harness_gemini.run(request);

        if(response.data){
            console.log(`[Tutor AI] Guardando respuesta de Tutor IA...`);
            await prisma.usuarioContexto.updateMany({
                where: {
                    usuarioId: userId
                },
                data: {
                    conceptosDebiles: response.rawText
                }
            });
            console.log(`[Tutor AI] Respuesta guardada...`);
        }

    } catch (error) {
        console.error(error);
    }
}