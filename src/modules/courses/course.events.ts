// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


import { eventBus } from "../../events/EventBus.js";

import { EventPayload } from "../../shared/interfaces/Context.js";
import { UserPassModulePayload } from "../../shared/interfaces/UserPassModulet.js";

export enum CourseEvents {
  EXAM_COMPLETE = "exam.complete",
  QUIZ_STARTED = "quiz.started",
  USER_PASS_MODULE = 'user.pass.module'
}

export interface ExamCompleteStatus {
  userId: number,
  courseId: number,
  hasErrors: boolean,
  titleExam: string,
  topicHasErrors: string[] | null,
  totalErrors: number
}

export function publishModulePassed(data: UserPassModulePayload) {
  const payload: EventPayload<UserPassModulePayload> ={
    idEvent: CourseEvents.USER_PASS_MODULE,
    producer: "course",
    payload: data
  }
  eventBus.publish(CourseEvents.USER_PASS_MODULE, payload);
}


export function publishExamComplete(data: ExamCompleteStatus){

  const payload: EventPayload<ExamCompleteStatus> = {
    idEvent: CourseEvents.EXAM_COMPLETE,
    producer: "course",
    payload: data
  }

  eventBus.publish(CourseEvents.EXAM_COMPLETE, payload);
}