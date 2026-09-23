// ESTE ES UN MODULO EN DESARROLLO Y CASI TODO ESTA SUJETO A CAMBIOS DRASTICOS.
// Practicamente solamente lo ocupe para realizar pruebas. MUCHAS PROBABILIDADES DE ELIMINAR ESTE MODULO POR COMPLETO. YA QUE SE MANEJA EN FIREBASE TODO ESTO. PERO PUEDE QUE NO XD.


import { prisma } from "../../config/database.js";
import { EventPayload } from "../../shared/interfaces/Context.js";
import { AIQuiz } from "../ai/harness/validators/quizSchema.js";
import { publishModulePassed } from "./course.events.js";

export class CourseService {

    static async register(idCourse: number, userId: number){
        try{
            const user = await this.isUser(userId);
            const userCourse = await this.isCourse(idCourse);
        
            const isRegistered= await prisma.usuarioCurso.findFirst({
                where:{
                    usuarioId: user.id,
                    cursoId: userCourse.id
                }
            });
            if(isRegistered){
                throw new Error("Este curso ya ha sido registrado.")
            }

            const courseRegister = await prisma.usuarioCurso.create({
                data:{
                    usuarioId: user.id,
                    cursoId: userCourse.id,
                    fechaInscripcion: new Date(),
                    conteoErrores: 0,
                    tipoErrores: "['primera_vez']",
                    progresoPorcentaje: 0.00,
                    estado:"EN CURSO" // EN CURSO | ABANDONADO | COMPLETADO
                }
            });

            return {
                idRegistro: courseRegister.id,
                titulo: userCourse.titulo,
                userName: user.nombre
            }

        }catch(error){
            throw new Error(String(error));
        }
    }

    //Falta parsear que exista ese curso en el backend
    static async handlerModule(courseId: number, userId: number, percentage: number){
    
        await prisma.usuarioCurso.updateMany({
            where: {
                usuarioId: userId,
                cursoId: courseId
            },
            data:{
                progresoPorcentaje: percentage,
                estado: percentage === 100 ? "FINALIZADO": "EN CURSO"
            }
        });

        
        const userContexto = await prisma.usuarioContexto.findFirst({
            where:{
                usuarioId: userId
            }
        });

        if(userContexto && userContexto.ultimoQuizGenerado !== ""){
            const AiQuizz = userContexto.ultimoQuizGenerado;
            await prisma.usuarioContexto.update({
                where:{
                    id: userContexto.id
                },
                data: {
                    ultimoQuizGenerado: ""
                }
            });
            
            return JSON.parse(AiQuizz) as AIQuiz
        }

        return null;

    }

    static async examComplete(courseId: number, userId: number,percentage: number){
        
        const course = await prisma.usuarioCurso.findFirst({
            where:{
                usuarioId: userId,
                cursoId: courseId
            }
        });

        if(!course) throw new Error("Curso no identificado");


        await prisma.usuarioCurso.update({
            where: {
                id: course.id
            },
            data:{
                progresoPorcentaje: percentage,
                estado: percentage === 100 ? "FINALIZADO": "EN CURSO"
            }
        });

    }   

    private static async isUser(userId: number){
        const user = await prisma.usuarios.findFirst({
            where:{
                id: userId
            }
        })

        if(!user) throw new Error("Usuario no identificado");

        return user;
    }

    static async finishCourse(userId: number, courseId: number){
        await prisma.usuarioCurso.updateMany({
            where:{
                usuarioId: userId,
                cursoId: courseId
            },
            data:{
                progresoPorcentaje: 100,
                estado: "FINALIZADO"
            }
        });


    }

    private static async isCourse(idCourse: number){
        const course = await prisma.cursos.findFirst({
            where: {
                id: idCourse
            }
        });

        if(!course) throw new Error("Curso no identificado");

        if(course.firebaseRef != 1){
            throw new Error("Curso inactivo.");
        }

        return course;
    }
    
}