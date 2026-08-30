export interface ApiResponse<T>{
    status: number,
    error: boolean,
    jwt?: string 
    message: string,
    payload: T
}