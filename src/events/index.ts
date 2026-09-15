

import { eventBus } from "./EventBus.js";
import { Events} from "./EventTypes.js";

// Exams

import {store_token, update_token} from "../modules/auth/handlers/auth.handlers.js";

// ---------- EXAMS ----------

/* eventBus.subscribe(Events.auth.USER_LOGIN_SUCCESFULL, store_token);
eventBus.subscribe(Events.auth.USER_RENUEVE_TOKEN, update_token); */