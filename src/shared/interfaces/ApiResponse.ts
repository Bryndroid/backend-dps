export interface ApiResponse<T>{
    status: number,
    error: boolean,
    jwt?: string,
    refresh_token?: string, 
    message: string,
    payload: T
}