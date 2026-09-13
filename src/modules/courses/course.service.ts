// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


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