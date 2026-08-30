import express from "express"

import { CourseController } from "./course.controller.js";

const courseRoutes = express.Router();
const controller = new CourseController();

//Examenes
courseRoutes.post("/:course/exam", controller.handlerExam);//Este es el chetado
courseRoutes.post("/:course/exam/quiz", controller.handlerQuiz);
courseRoutes.post("/:course/exam/test", controller.handlerQuiz);//Donde el estudiante tenga que escribir
courseRoutes.post("/:course/exam/program", controller.handlerProgram);
export default courseRoutes