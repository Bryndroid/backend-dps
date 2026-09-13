import { prisma } from "../../../config/database.js";
import { AuthTokens } from "../../../shared/interfaces/AuthTokens.js";
import { EventPayload } from "../../../shared/interfaces/Context.js";
import bcrypt from "bcrypt";


//Handler para guardar Refresh Token
export async function store_token(data: EventPayload<{ auth: AuthTokens, userId: number }>) {
    try {
        const refreshHash = await bcrypt.hash(data.payload.auth.refresh_token, 10);
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);
        await prisma.refreshToken.create({
            data: {
                tokenHash: refreshHash,
                usuarioId: data.payload.userId,
                expiresAt: fechaExpiracion
            }
        })
    } catch (error) {
        console.log(error);
    }

}

//Handler para actualizar refresh token

export async function update_token(data: EventPayload<{ refreshToken: string, oldToken: string, refreshId: number }>) {
    try {
        const newTokenHash = await bcrypt.hash(data.payload.refreshToken, 10);
        const oldTokenHash = await bcrypt.hash(data.payload.oldToken, 10);

        const nuevaFecha = new Date();
        nuevaFecha.setDate(nuevaFecha.getDate() + 7);

        await prisma.refreshToken.update({
            where: {
                id: data.payload.refreshId,
            },
            data: {
                tokenHash: newTokenHash,
                previousToken: oldTokenHash,
                expiresAt: nuevaFecha,
            },
        });
    } catch (error) {
        console.log(error);
    }
}

