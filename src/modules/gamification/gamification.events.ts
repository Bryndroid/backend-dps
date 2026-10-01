import { eventBus } from "../../events/EventBus.js";
import { EventPayload } from "../../shared/interfaces/Context.js";

export enum GameEvents {
    REQUEST_WEEK_QUIZZ = "request.week.quizz"
}

export interface WeekQuizzPayload{
    userId: number
} 


export async function publishWeekQuizz(data: WeekQuizzPayload){

    const payload: EventPayload<WeekQuizzPayload> = {
        idEvent: GameEvents.REQUEST_WEEK_QUIZZ,
        producer: "game_module",
        payload: data
    }
    eventBus.publish(GameEvents.REQUEST_WEEK_QUIZZ, payload);

}