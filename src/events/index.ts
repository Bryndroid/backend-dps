

import { eventBus } from "./EventBus.js";
import { Events} from "./EventTypes.js";

// Exams

import {store_token, update_token} from "../modules/auth/handlers/auth.handlers.js";
import { HarnessPassExam, HarnessPassModuleHandler, HarnessWeekQuiz } from "../modules/ai/ai.events.handler.js";

// ---------- EXAMS ----------


eventBus.subscribe(Events.course.USER_PASS_MODULE, HarnessPassModuleHandler);
eventBus.subscribe(Events.course.EXAM_COMPLETE, HarnessPassExam);
eventBus.subscribe(Events.game.REQUEST_WEEK_QUIZZ, HarnessWeekQuiz);


/* eventBus.subscribe(Events.auth.USER_LOGIN_SUCCESFULL, store_token);
eventBus.subscribe(Events.auth.USER_RENUEVE_TOKEN, update_token); */