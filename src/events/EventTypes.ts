

import { AuthEvents } from "../modules/auth/auth.events.js";
import { CourseEvents } from "../modules/courses/course.events.js";
import { GameEvents } from "../modules/gamification/gamification.events.js";

export const Events = {
  course: CourseEvents,
  auth: AuthEvents,
  game: GameEvents,
} as const;