

import { CourseEvents } from "../modules/courses/course.events.js";
// import { AIEvents } from "../modules/ai/ai.events.js";
// import { GamificationEvents } from "../modules/gamification/gamification.events.js";

export const Events = {
  course: CourseEvents,

  // ai: AIEvents,
  // gamification: GamificationEvents,
} as const;