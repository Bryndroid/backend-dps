

import { ApiResponse } from "../../shared/interfaces/ApiResponse.js";
import { Request, Response } from "express";
import { CourseService } from "./course.service.js";
import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";
import { AIQuiz } from "../ai/harness/validators/quizSchema.js";
import { publishExamComplete, publishModulePassed } from "./course.events.js";
//El controlador debe de ser stateless
export class CourseController {




    //TODO: Por ver, ya que debo de ver que tipo de contexto me puede funcionar.
    static async handlerModule(req: Request, res: Response) {
        const response: ApiResponse<AIQuiz | null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "",
            payload: null,
            error: true,
        }
        const { percentage, userId, passedModule, courseTitle } = req.body;
        const courseId = req.params.course as string;

        if (!courseId || !Number.isInteger(Number(courseId)) || !userId || !Number.isInteger(Number(userId)) || !Number.isFinite(Number(percentage)) || percentage < 0 || percentage > 100 || passedModule === undefined || !courseTitle) {
            response.message = "Datos incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try {
            const AiQuiz = await CourseService.handlerModule(parseInt(courseId), userId, percentage);

            response.status = HttpStatusCode.ACCEPTED;
            response.message = "Avance registrado";
            response.payload = AiQuiz;
            response.error = false;
            if (AiQuiz) {
                return res.status(response.status).json(response);
            } else {
                res.status(response.status).json(response);
                publishModulePassed({ userId: userId, courseTitle: courseTitle, passedModule: passedModule });
            }
        } catch (error) {
            response.message = String(error);
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

    }

    static async register(req: Request, res: Response) {
        const response: ApiResponse<string | null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error",
            payload: null,
            error: true
        }
        const idCourse = req.params.course as string;
        const userId = req.query.id as string;

        if (!idCourse || !Number.isInteger(Number(idCourse)) || !userId || !Number.isInteger(Number(userId))) {
            response.message = "Datos incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try {
            const { titulo, userName } = await CourseService.register(parseInt(idCourse), parseInt(userId));
            response.message = "Registro exitoso."
            response.status = HttpStatusCode.CREATED
            response.payload = `Se registro exitosamente el curso por titulo ${titulo} al usuario ${userName}`
            response.error = false
            return res.status(response.status).json(response);
        } catch (error) {
            response.status = HttpStatusCode.BAD_REQUEST;
            response.message = String(error);
            return res.status(response.status).json(response);
        }
    }

    static async update(req: Request, res: Response) {
        const response: ApiResponse<AIQuiz | null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "",
            payload: null,
            error: true,
        }
    }

    static async examComplete(req: Request, res: Response) {
        const response: ApiResponse<null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "",
            payload: null,
            error: true,
        }

        const {percentage, titleExam, totalErrors, topicsHasError, hasErrors} = req.body;

        const idCourse = req.params.course as string;
        const userId = req.query.id as string;

        if (!idCourse || !Number.isInteger(Number(idCourse)) || !userId || !Number.isInteger(Number(userId)) || !Number.isFinite(Number(percentage)) || percentage < 0 || percentage > 100 || !titleExam || totalErrors === undefined || topicsHasError === undefined || hasErrors === undefined) {
            response.message = "Datos incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try{
            await CourseService.examComplete(parseInt(idCourse), parseInt(userId), parseInt(percentage));

            response.error = false;
            response.message = "Avance registrado";
            response.status = HttpStatusCode.ACCEPTED;
            res.status(response.status).json(response);


        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.BAD_GATEWAY;
            return res.status(response.status).json(response);
        }
        publishExamComplete({userId:parseInt(userId),courseId: parseInt(idCourse), hasErrors: hasErrors, titleExam: titleExam, topicHasErrors: topicsHasError, totalErrors: totalErrors});

    }

    static async finishCourse(req: Request, res: Response){
        const response: ApiResponse<null> = {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "",
            payload: null,
            error: true,
        }

        const idCourse = req.params.course as string;
        const userId = req.query.id as string;

        if(!userId || !Number.isInteger(Number(userId)) || !idCourse || !Number.isInteger(Number(idCourse))){
            response.message = "Datos Incompletos";
            response.status = HttpStatusCode.BAD_REQUEST;
            return res.status(response.status).json(response);
        }

        try{
            await CourseService.finishCourse(parseInt(userId), parseInt(idCourse));

            response.error = false;
            response.message = "Estado actualizado: Curso terminado con éxito";
            response.status = HttpStatusCode.ACCEPTED;
            return res.status(response.status).json(response);
        }catch(error){
            response.message = String(error);
            response.status = HttpStatusCode.BAD_GATEWAY;
            return res.status(response.status).json(response);   
        }
    }
}

