import { HistorialRacha } from "@prisma/client";
import { prisma } from "../../config/database.js";
import bcrypt from "bcrypt";
//Aqui solo será para hacer CRUD con la informacion del usuario.
//TODO: AQUI NO DEBE DE SER FIRST OR THROW YA QUE ESE ERROR TIRA MUCHA INFO XD
export class UserService {

    static async findUser(userId: number) {
        const user = await prisma.usuarios.findUnique({
            where: {
                id: userId
            },
            omit: {
                passwordHash: true,
                fechaRegistro: true,
            },
        });

        if(!user){
            throw new Error("Usuario no registrado.");
        }

        return user;
    }


    static async updateUser(userId: number, name: string, password: string, email: string) {
        const user = await prisma.usuarios.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            throw new Error("Usuario no registrado.");
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error("Contraseña Incorrecta");
        }

        if (!this.isValidEmail(email)) {
            throw new Error("Email Invalido");
        }

        const updateUser = await prisma.usuarios.update({
            where: {
                id: user.id
            },
            data: {
                nombre: name,
                email: email
            },
            omit: {
                passwordHash: true,
                fechaRegistro: true,
            },
        });

        return updateUser;

    }

    static async delete(userId: number) {

        const user = await prisma.usuarios.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            throw new Error("Usuario no registrado.");
        }

        await prisma.$transaction([
            prisma.refreshToken.deleteMany({
                where: { usuarioId: userId }
            }),
            prisma.usuarioContexto.deleteMany({
                where: { usuarioId: userId }
            }),
            prisma.historialRacha.deleteMany({
                where: { usuarioId: userId }
            }),
            prisma.usuarioCurso.deleteMany({
                where: { usuarioId: userId}
            }),
            prisma.usuarios.delete({
                where: { id: userId }
            })
        ]);
        
    }

    static isValidEmail(email: string) {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;

        return regex.test(email);
    }

}