

import { eventBus } from "./EventBus.js";
import { Events} from "./EventTypes.js";

// Exams
import { rewardXpHandler } from "../modules/gamification/handlers/examGraded.handler.js";

// ---------- EXAMS ----------
eventBus.subscribe(Events.course.EXAM_GRADED, rewardXpHandler);
