// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


import express from "express"

import { CourseController } from "./course.controller.js";

import {authMiddleware} from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware.js";

const courseRoutes = express.Router();


/* courseRoutes.post("/pawa", authMiddleware, CourseController.handlerModule) */


courseRoutes.get("/:course/register", authMiddleware, CourseController.register);
//Para yo modificar parametros dentro del course.
//Aqui dentro del payload me mandaras unicamente la fecha desde que le volvio a dar click y el id como una query dentro del url
/* courseRoutes.patch("/:course", authMiddleware, CourseController.update); */

//Aqui me tendrás que mandar el titulo del module, su user id, y el course id que va dentro de la request. Me tienes que mandar el porcentaje de avance
courseRoutes.post("/:course/pass_module", strictLimiter, authMiddleware, CourseController.handlerModule);

//Aqui me mandaras todo el payload del examen completo (sus respuestas buenas y malas) y yo lo voy a verificar, aumentar el progreso y te voy a retornar las recompensas, ya sea en modo star o de cualquier otro modo. Puede que ponga un evento de exam_complete para que la IA pueda generar un historial de errores y actualizar el contexto.... Me tienes que mandar el porcentaje de avance. También aqui voy a a actualizar el porcentaje
courseRoutes.post("/:course/exam_complete", strictLimiter,authMiddleware, CourseController.examComplete);

//Aqui me mandaras el porcentaje de avance al 100,
//Aqui me falta ver, ya que si o si debe de ser un evento que la IA tome accion, quizas que realice la accion de igualmente verificar y actualizar usuario contexto.
// {}
courseRoutes.post("/:course/finish", authMiddleware, CourseController.finishCourse);

export default courseRoutes