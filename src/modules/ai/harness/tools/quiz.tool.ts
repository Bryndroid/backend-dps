import { FunctionDeclaration, Type } from "@google/genai";
import { AIQuiz } from "../validators/quizSchema.js";
import { FunctionTool } from "../../ai.types.js";
// DEPRECATED JAJAJAJAJ
export const storeQuizToolDeclaration: FunctionTool = {
  type: "function",
  name: "store_context_user",
  description:
    "Guarda en la base de datos el mini quizz/ejercicio de código generado para el estudiante.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      userId: {
        type: Type.NUMBER,
        description: "ID del estudiante recibido",
      },
      quiz: {
        type: Type.OBJECT,
        description:
          "Objeto del quizz generado que debe coincidir con el AIQuizSchema",
        properties: {
          contentType: {
            type: Type.STRING,
            enum: ["quizz", "code"],
          },
          weekConcept: {
            type: Type.STRING,
          },
          message: {
            type: Type.STRING,
          },
          rewardType: {
            type: Type.STRING,
            enum: ["XP"],
          },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.NUMBER,
                },
                question: {
                  type: Type.STRING,
                },
                code: {
                  type: Type.STRING,
                  nullable: true,
                },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: {
                        type: Type.STRING,
                        enum: ["A", "B", "C", "D"],
                      },
                      description: {
                        type: Type.STRING,
                      },
                    },
                    required: ["id", "description"],
                  },
                },
                correctAnswer: {
                  type: Type.STRING,
                  enum: ["A", "B", "C", "D"],
                },
                explanation: {
                  type: Type.STRING,
                },
              },
              required: [
                "id",
                "question",
                "options",
                "correctAnswer",
                "explanation",
              ],
            },
          },
        },
        required: [
          "contentType",
          "weekConcept",
          "message",
          "rewardType",
          "topics",
        ],
      },
    },
    required: ["userId", "quiz"],
  },
};

// Handler que ejecuta la acción real
export const quizzToolHandlers: Record<string, (args: any) => Promise<any> > = {
  //Esto se debe de parsear desde este lado
  store_context_user: async (args: {userId: number, quiz: any}) => {
    // 2. Persistir en la BD a través de Prisma
    /*
    const saved = await prisma.usuarioQuizz.create({
      data: {
        usuarioId: args.userId,
        conceptoDebil: validatedQuiz.weekConcept,
        tipoContenido: validatedQuiz.contentType,
        mensaje: validatedQuiz.message,
        payloadJson: JSON.stringify(validatedQuiz),
      },
    });

    return { success: true, quizId: saved.id };
    */

    console.log(
      `[Tool store_context_user] Quizz guardado con éxito para el estudiante ID ${args.userId}`
    );
    console.log(args.quiz);

    return {
      success: true,
      message: "Quizz guardado exitosamente",
    };
  },
};