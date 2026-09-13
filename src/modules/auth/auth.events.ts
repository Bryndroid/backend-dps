
//Aqui voy a guardar el token.

import { eventBus } from "../../events/EventBus.js";
import { AuthTokens } from "../../shared/interfaces/AuthTokens.js";
import { EventPayload } from "../../shared/interfaces/Context.js";

//Eventos de Auth
export enum AuthEvents {
    USER_LOGIN_SUCCESFULL = "user.login.succesfull",
    USER_RENUEVE_TOKEN = "user.renueve.token"
}


//Mis publicadores
export function publishUserLogin(payload: {auth:AuthTokens, userId:number}){
    const eventPayload: EventPayload<{auth:AuthTokens, userId:number}> ={
        idEvent: AuthEvents.USER_LOGIN_SUCCESFULL,
        producer: "auth",
        payload
    }

    eventBus.publish(AuthEvents.USER_LOGIN_SUCCESFULL, eventPayload);
}

export function publishUserRenueve(payload: {refreshToken: string, oldToken: string, refreshId: number}){
    const eventPayload: EventPayload<{refreshToken: string, oldToken: string, refreshId: number}> = {
        idEvent: AuthEvents.USER_RENUEVE_TOKEN,
        producer: "auth",
        payload
    }

    eventBus.publish(AuthEvents.USER_RENUEVE_TOKEN, eventPayload);
}



