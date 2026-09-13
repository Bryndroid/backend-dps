

import { AuthEvents } from "../modules/auth/auth.events.js";
import { CourseEvents } from "../modules/courses/course.events.js";
// import { AIEvents } from "../modules/ai/ai.events.js";
// import { GamificationEvents } from "../modules/gamification/gamification.events.js";

export const Events = {
  course: CourseEvents,
  auth: AuthEvents
  // ai: AIEvents,
  // gamification: GamificationEvents,
} as const;