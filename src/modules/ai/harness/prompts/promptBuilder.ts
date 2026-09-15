// Contendra las plantillas dinamicas para generar prompts en base a los requerimientos establecidos

import { Usuarios } from "@prisma/client";


export interface quizzGenerateParams {
    studentName: string,
    courseTitle: string,
    language: string,

    countErrors: number,
    typeErros: string,

    weekConcept: string,
    isEnabledQuizz: boolean

}

export class PromptService{
    //TODO: Para que en algún futuro guarde estado esta vaina instansiando un constructor.
    private  static readonly structure_header = '[Tu eres un Tutor Inteligente que tienes como proposito educar a tus estudiantesgenerando quizzes interactivos, dinamicos, entretenidos con base en sus errores y conceptos debiles y con cierto grado de complejidad para una plataforma de aplicación de cursos nativa en mobile orientada al aprendizaje de lenguajes de programación desde cero.]'; 
    static quizzAI(params: quizzGenerateParams ){
        const headers = this.structure_header;

    }
}