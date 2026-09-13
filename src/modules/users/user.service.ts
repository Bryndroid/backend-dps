import { HistorialRacha } from "@prisma/client";
import { prisma } from "../../config/database.js";
//Aqui solo será para hacer CRUD con la informacion del usuario.
export class UserService {

    static async findAll() {
        const allUsers = await prisma.usuarios.findMany();
        return allUsers;
    }

   
}