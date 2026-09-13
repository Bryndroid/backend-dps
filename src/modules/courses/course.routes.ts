// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


import express from "express"

import { CourseController } from "./course.controller.js";

import {authMiddleware} from "../../middlewares/auth.middleware.js";

const courseRoutes = express.Router();
const controller = new CourseController();


//Examenes
courseRoutes.post("/:course/exam",authMiddleware,controller.handlerExam);//Este es el chetado
courseRoutes.post("/:course/exam/quiz", controller.handlerQuiz);
courseRoutes.post("/:course/exam/test", controller.handlerQuiz);//Donde el estudiante tenga que escribir
courseRoutes.post("/:course/exam/program", controller.handlerProgram);
export default courseRoutes