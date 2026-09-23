

import { AuthEvents } from "../modules/auth/auth.events.js";
import { CourseEvents } from "../modules/courses/course.events.js";
// import { AIEvents } from "../modules/ai/ai.events.js";
import { GameEvents } from "../modules/gamification/gamification.events.js";

export const Events = {
  course: CourseEvents,
  auth: AuthEvents,
  // ai: AIEvents,
  game: GameEvents,
} as const;