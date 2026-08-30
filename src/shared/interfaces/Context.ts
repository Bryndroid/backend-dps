export interface EventPayload<T>{
    idEvent: string,
    producer:string,
    payload: T
}