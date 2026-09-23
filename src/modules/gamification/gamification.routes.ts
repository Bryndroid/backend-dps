import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { GameController } from "./gamification.controller.js";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware.js";

const gameRoutes = express.Router();


//Cuando complete un modulo se manda el strike DESPUES del pass_module

gameRoutes.get("/rewards_catalogo", authMiddleware, GameController.rewardCatalog)

gameRoutes.get("/strike", authMiddleware, GameController.handleStrike);
//Y por ultimo se manda el quiz semanal si dentro del estado o asyncstorage no hay guardado un quiz por semana...
gameRoutes.get("/week_quiz",strictLimiter, authMiddleware, GameController.weekQuiz)
//Para registrar las misiones en mi base de datos de recompensas y actualizar la tabla user en caso de que se requiera.


gameRoutes.post("/reward", authMiddleware, GameController.reward);

//gameRoutes.post("/ai_hint"); Aqui voy a parsear que exista un escudo AI, generar la pista AI y ver si me puede ayudar. TODO: Ver si la ayuda es general (si genera un texto por debajo durante un examen para que el estudiante pueda seleccionar la respeusta correcta ) o si la ayuda es especifica. Me decanto por la primera opcion

//Aqui le va a dar click al boton y va a generar el quiz semanal. Al presionar ese boton debeb de existir un timer dentro de la App que explique ya no puede dar click al mismo boton. Esto para que no me genere otro quizz semanal.  
//gameRoutes.get("/quiz_semanal")
//Datos que necesito para el quiz semanal...
// XP_TOTALES: Si tiene arriba de X porcentaje lo catalogare como alguien experto
// ESTRELLAS_BALANCE: Si tiene arriba de X valor le aumentare la cantidad de preguntas. Maximo 5
// Cursos estado: Para especificamente hacer el quizz en base a estos cursos.
// Curso Titulo: Para completar el topic de arriba
// Conceptos_Debiles: Para determinar que contexto será el quizz
// Cantidad de erores: Para ordenar los Cursos Titulos del que mas errores tiene al que menos.
// Sacar todos los tipo de errores de todo usuario curso para obtener errores especificos.

export default gameRoutes;