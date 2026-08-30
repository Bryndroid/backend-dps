import { EventPayload } from "../../shared/interfaces/Context.js";
import { publishExamGraded } from "./course.events.js";

export class CourseService {


    static calificarQuiz() {
        //Proceso de calificacion y envio...
        console.log(" Calificando examen...");

        // Simulación de calificación.
        const score = 95;

        // Simulación de guardar en BD.
        const examResult = {
            examId: 101,
            userId: 1,
            score,
        };

        console.log("Examen guardado en la BD.");
        CourseService.handlerEvent(examResult);
        return examResult
    }

    static calificarProgram(){

    }

    static calificarExamen(){
        
    }

    private static handlerEvent(data: any) {
        
        publishExamGraded(data)
    }
}