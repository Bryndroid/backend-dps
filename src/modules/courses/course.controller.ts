import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Request, Response } from "express";
import { CourseService } from "./course.service.js";
//El controlador debe de ser stateless
export class CourseController {

    async handlerQuiz(req: Request, res: Response) {
        const {course}= req.params;

        const result = await CourseService.calificarQuiz();

        console.log("3️⃣ Enviando respuesta HTTP...");

        res.status(201).json({
            success: true,
            message: "Examen calificado correctamente para el curso: " + course,
            data: result,
        });

        console.log("4️⃣ El cliente ya recibió el 201.");

    }

    async handlerProgram(req: Request, res: Response){
        const result = await CourseService.calificarProgram();
    }

    async handlerExam(req: Request, res: Response){
        const result = await CourseService.calificarExamen();
    }
    private handlerEvent() {
        console.log("hsfgsakdfjka")
    }
}