import { prisma } from "../../config/database.js";

export class UserService{

    static async findAll(){
        const allUsers = await prisma.usuarios.findMany();
        return allUsers;
    }
}