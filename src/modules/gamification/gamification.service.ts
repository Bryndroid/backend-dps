import { prisma } from "../../config/database.js";

export class GameService {
    static async handleStrike(idUser: number, date: Date) {
        const result = {
            hasAument: false,
            strike: 0,
            dateLastStrike: new Date(),
            hasUsedShield: false,
            hasToday: false
        };

        const strikeUser = await prisma.historialRacha.findFirst({
            where: {
                usuarioId: idUser,
                activa: true,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        protectorRachaBalance: true,
                    },
                },
            },
        });

        if (!strikeUser) {
            throw new Error("El usuario no tiene una racha activa.");
        }

        const diffDays = this.getDiffDays(strikeUser.fecha as Date, date);

        result.dateLastStrike = strikeUser.fecha as Date;

        // Ya reclamó hoy.
        if (diffDays === 0) {
            result.hasToday = true;
            result.strike = strikeUser.rachaValor as number;
            return result;
        }

        // Continúa la racha.
        if (diffDays === 1) {
            const aumento = await this.aumentStrike(strikeUser.id, strikeUser.rachaValor as number, date);

            result.hasAument = true;
            result.strike = aumento;

            return result;
        }

        // Fecha inválida (pasado).
        if (diffDays < 0) {
            throw new Error("La fecha enviada es inválida.");
        }

        // Perdió la racha.
        if ((strikeUser?.usuario?.protectorRachaBalance ?? 0) > 0) {
            const nuevaRacha = await this.useShield(strikeUser.id, idUser, strikeUser.rachaValor as number, date);

            result.hasAument = true;
            result.hasUsedShield = true;
            result.strike = nuevaRacha;

            return result;
        }

        // No tenía escudo.
        await this.resetStrike(strikeUser.id, idUser, date);

        result.strike = 1;
        return result;

    }

    // ---------- Funciones auxiliares ----------

    static getDiffDays(lastDate: Date, currentDate: Date): number {
        const last = new Date(lastDate);
        const current = new Date(currentDate);

        last.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);

        return Math.floor(
            (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    static async useShield(strikeId: number, userId: number, currentStrike: number, date: Date): Promise<number> {

        const nuevaRacha = currentStrike + 1;

        await prisma.$transaction(async (tx) => {
            await tx.usuarios.update({
                where: {
                    id: userId,
                },
                data: {
                    protectorRachaBalance: {
                        decrement: 1,
                    },
                },
            });

            await tx.historialRacha.update({
                where: {
                    id: strikeId,
                },
                data: {
                    fecha: date,
                    rachaValor: nuevaRacha,
                },
            });
        });

        return nuevaRacha;
    }

    static async aumentStrike(strikeId: number, currentStrike: number, date: Date): Promise<number> {
        const nuevaRacha = currentStrike + 1;

        await prisma.historialRacha.update({
            where: {
                id: strikeId,
            },
            data: {
                rachaValor: nuevaRacha,
                fecha: date,
            },
        });

        return nuevaRacha;
    }

    static async resetStrike(strikeId: number, userId: number, date: Date): Promise<void> {

        await prisma.$transaction(async (tx) => {
            // La racha anterior pasa al historial.
            await tx.historialRacha.update({
                where: {
                    id: strikeId,
                },
                data: {
                    activa: false,
                },
            });

            // Nueva racha activa.
            await tx.historialRacha.create({
                data: {
                    usuarioId: userId,
                    fecha: date,
                    rachaValor: 1,
                    activa: true,
                },
            });
        });
    }
}