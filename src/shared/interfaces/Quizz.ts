export interface Quizz{
    id: number,
    question: string,
    resolve_student: string[] | number[],
    resolve: string[] | number[]
}