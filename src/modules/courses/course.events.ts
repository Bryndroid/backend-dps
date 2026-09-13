// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


import { eventBus } from "../../events/EventBus.js";

import { EventPayload } from "../../shared/interfaces/Context.js";
import { Exam } from "../../shared/interfaces/Exam.js";

export enum CourseEvents {
  EXAM_GRADED = "exam.graded",
  QUIZ_STARTED = "quiz.started",
}

export function publishExamGraded(payload: Exam) {
  const eventPayload: EventPayload<Exam> ={
    idEvent: CourseEvents.EXAM_GRADED,
    producer: "exams",
    payload
  }
  eventBus.publish(CourseEvents.EXAM_GRADED, eventPayload);
}