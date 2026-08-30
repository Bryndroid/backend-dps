// modules/exams/exam.events.ts

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