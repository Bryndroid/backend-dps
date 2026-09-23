import { Usuarios } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { JWTpayload } from "../../shared/interfaces/JwtPayload.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { USER_DEFAULT_BUNDLE } from "../../shared/constants/InitBundle.js";
import { AuthTokens } from "../../shared/interfaces/AuthTokens.js";
import { jwtConfig } from "../../config/jwt.js";
import { HttpStatusCode } from "../../shared/constants/HttpStatus.js";


export class AuthService {
    //Login logic
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
        const { passwordHash, fechaRegistro, ...cleanUser } = user;
        if (!validPassword) {
            throw new Error("Contraseña o correo incorrectos");
        }
        try {

            const token = this.generateTokens({ id: user.id, nombre: user.nombre, email: user.email });
            await this.store_token(token, cleanUser.id);

            return { token, cleanUser };
             
        } catch (error) {
            throw new Error("Error critico al procesar tokens");
        }
    }
    //Register Logic
    static async register(name: string, email: string, password: string) {

        const user = await this.ownerEmail(email);

        if (user) {
            throw new Error("Correo en uso");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!this.isValidEmail(email)) {
            throw new Error("Correo invalido.");
        }
        //TODO: Luego ver si puedo manejar algo de esto por eventos, por lo menos del usuarioContexto.
        const newUser = await prisma.usuarios.create({
            data: {
                nombre: name,
                email,
                passwordHash: hashedPassword,
                xpTotales: USER_DEFAULT_BUNDLE.XP,
                energiaBalance: USER_DEFAULT_BUNDLE.ENERGIA,
                estrellasBalance: USER_DEFAULT_BUNDLE.STARS,
                aiPistaBalance: USER_DEFAULT_BUNDLE.AI_HINT,
                protectorRachaBalance: USER_DEFAULT_BUNDLE.SHIELD,
                fechaRegistro: new Date(),

                historialRacha: {
                    create: {
                        fecha: new Date(),
                        rachaValor: 1,
                        activa: true,
                    },
                },
                usuarioContexto: {
                    create: {
                        //TODO: Esto por verficiar con el frontend.
                        conceptosDebiles: `["principiante", "UsuarioNuevo"]`,
                        porcentajeRefuerzo: 0.15,
                        ultimoQuizGenerado:"",
                        resumenSemanaActual: "",
                        ultimoConsejoTopic: ""
                    }
                }
            },
            select: {
                nombre: true,
                email: true,
            },
        });
        
        return newUser;
    }
    //Logout logic - Borro el campo asociado al refresh token que me mande el usuario.
    static async logout(refresh_token: string, userId: number) {

        const refreshTokens= await prisma.refreshToken.findMany(
            {
                where: {
                    usuarioId: userId
                }
            }
        )
        let session = null;

        for (const token of refreshTokens){
            const match = await bcrypt.compare(refresh_token, token.tokenHash);

            if(match){
                session = token;
                break;
            }
        }

        if (!session) {
            throw new Error("Refresh token inválido.");
        }

        if (session.previousToken) {
            const reused = await bcrypt.compare(refresh_token, session.previousToken);

            if (reused) {
                throw new Error("Refresh token reutilizado.");
            }
        }

        if (session.expiresAt <= new Date()) {
            await prisma.refreshToken.delete({
                where: { id: session.id },
            });

            throw new Error("El refresh token ha expirado.");
        }
       
        try{
            await prisma.refreshToken.delete({
                where: {
                    id: session.id
                }
            })
            return;
        }catch(error){
            console.error(error);
            throw new Error("Error al procesar tu consulta.")
        }

    }
    //Refresh logic
    static async refresh_token(refreshToken: string, userName: string, userEmail: string) {
        const user = await this.ownerEmail(userEmail);

        if (!user) {
            throw new Error("Token inválido.");
        }


        const refreshTokens = await prisma.refreshToken.findMany({
            where: {
                usuarioId: user.id,
            },
        });

        // Encontrar cuál registro corresponde al refresh token recibido.
        let session = null;

        for (const token of refreshTokens) {
            const match = await bcrypt.compare(refreshToken, token.tokenHash);

            if (match) {
                session = token;
                break;
            }
        }

        if (!session) {
            throw new Error("Refresh token inválido.");
        }

        if (session.previousToken) {
            const reused = await bcrypt.compare(refreshToken, session.previousToken);

            if (reused) {
                throw new Error("Refresh token reutilizado.");
            }
        }

        if (session.expiresAt <= new Date()) {
            await prisma.refreshToken.delete({
                where: { id: session.id },
            });

            throw new Error("El refresh token ha expirado.");
        }

        try {
            //Generar nuevos tokens.
            const newJWT = jwt.sign(
                { id: user.id, nombre: userName, email: userEmail },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            const newRefreshToken = crypto.randomBytes(32).toString("hex");
            await this.update_token(newRefreshToken, refreshToken, session.id);
            return {
                newJWT,
                newRefreshToken,
                refreshId: session.id,
            };
        } catch (error) {
            throw new Error("Error critico en el procesamiento de tokens.");
        }

    }

    // FUNCIONES DE RESPALDO
    static generateTokens(data: JWTpayload): AuthTokens {

        const jwt_token = jwt.sign(data, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
        const refresh_token = crypto.randomBytes(32).toString("hex");
        return { jwt: jwt_token, refresh_token }
    }
    static isValidEmail(email: string) {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;

        return regex.test(email);
    }
    static async ownerEmail(email: string) {
        const user = await prisma.usuarios.findFirst({
            where: {
                email
            }
        })
        return user;
    }

    static async store_token(auth: AuthTokens, userId: number) {

        const refreshHash = await bcrypt.hash(auth.refresh_token, 10);
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);
        await prisma.refreshToken.create({
            data: {
                tokenHash: refreshHash,
                usuarioId: userId,
                expiresAt: fechaExpiracion
            }
        })


    }

    static async update_token(refreshToken: string, oldToken: string, refreshId: number) {

        const newTokenHash = await bcrypt.hash(refreshToken, 10);
        const oldTokenHash = await bcrypt.hash(oldToken, 10);

        const nuevaFecha = new Date();
        nuevaFecha.setDate(nuevaFecha.getDate() + 7);

        await prisma.refreshToken.update({
            where: {
                id: refreshId,
            },
            data: {
                tokenHash: newTokenHash,
                previousToken: oldTokenHash,
                expiresAt: nuevaFecha,
            },
        });

    }


}