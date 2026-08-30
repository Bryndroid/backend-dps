import { Usuarios } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { JWTpayload } from "../../shared/interfaces/JwtPayload.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class AuthService {
    static generateToken(data: JWTpayload) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        if (!jwtSecretKey) {
            throw new Error("JWT_SECRET_KEY no está configurada");
        }

        return jwt.sign(data, jwtSecretKey);
    }
    static isValidEmail(email: string) {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;

        return regex.test(email);
    }
    static async login(email: string, password: string) {

        const user = await prisma.usuarios.findUnique({
            where: {
                email
            }
        });
       
        if (!user) {
            throw new Error("Contraseña o correo incorrectos");
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        
        if(!validPassword){
            throw new Error("Contraseña o correo incorrectos");
        }
        const token  =  this.generateToken({id: user.id, email: user.email});
        return {token, user};
    }
    static async register(name: string, email: string, password: string){
        if(!name || !email || !password){
            throw new Error("Credenciales invalidas");

        }
        const user = this.ownerEmail(email);
        if(!user){
            throw new Error("Correo en uso");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if(!this.isValidEmail(email)){
            throw new Error("Correo invalido.");
        }
        const newUser = await prisma.usuarios.create({
            data: {
                nombre: name,
                email,
                passwordHash: hashedPassword,
                xpTotales: 100,
                fechaRegistro: new Date()
            },
            select: {
                nombre: true,
                email: true,
            }
        });
        return newUser;
    }
    static async ownerEmail(email: string) {
        const user = await prisma.usuarios.findFirst({
            where: {
                email
            }
        })
        return user;
    }

    
}