import { prisma } from "../../config/database.js";
import { AIQuiz } from "../ai/harness/validators/quizSchema.js";
import { STRIKE_CONFIG } from "./rules/streak.rule.js";

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
        if (diffDays === STRIKE_CONFIG.MIN_DAYS) {
            result.hasToday = true;
            result.strike = strikeUser.rachaValor as number;
            return result;
        }

        // Continúa la racha.
        if (diffDays === STRIKE_CONFIG.MAX_DAYS) {
            const aumento = await this.aumentStrike(strikeUser.id, strikeUser.rachaValor as number, date);

            result.hasAument = true;
            result.strike = aumento;

            return result;
        }

        // Fecha inválida (pasado).
        if (diffDays < STRIKE_CONFIG.MIN_DAYS) {
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


    static async weekQuiz(userId: number) {
        const userContext = await prisma.usuarioContexto.findFirst({
            where: {
                usuarioId: userId
            }
        });

        if (!userContext || (!userContext.resumenSemanaActual || userContext.resumenSemanaActual === "")) return null

        const AIQuiz = JSON.parse(userContext.resumenSemanaActual) as AIQuiz;

        await prisma.usuarioContexto.update({
            where: {
                id: userContext.id
            },
            data: {
                resumenSemanaActual: ""
            }
        });

        return AIQuiz;

    }

    static async reward(userId: number, rewardType: string, name: string, source: string) {
        const reward = await prisma.recompensasCatalogo.findFirst({
            where: {
                tipo: rewardType,
                nombre: name
            }
        });

        const user = await prisma.usuarios.findFirst({
            where: {
                id: userId
            }
        });

        if (!reward) throw new Error("Recompensa no registrada en catalogo");

        if (!user) throw new Error("Usuario no detectado");

        await prisma.$transaction(async (t) => {
            await t.recompensaUsuario.create({
                data: {
                    fechaObtencion: new Date(),
                    fuente: source,
                    recompensaId: reward.id,
                    usuarioId: userId
                }
            });

            switch(reward.tipo){
                case "STAR":
                    await t.usuarios.update({
                        where:{
                            id: userId
                        },
                        data: {
                            estrellasBalance: reward.valorObtenible + (user.estrellasBalance?? 0)
                        }
                    });
                    break
                case "ENERGY":
                    await t.usuarios.update({
                        where:{
                            id: userId
                        },
                        data: {
                            energiaBalance: reward.valorObtenible + (user.energiaBalance?? 0)
                        }
                    });
                    break
                case "SHIELD":
                    await t.usuarios.update({
                        where:{
                            id: userId
                        },
                        data: {
                            protectorRachaBalance: reward.valorObtenible + (user.protectorRachaBalance?? 0)
                        }
                    });
                    break
                case "AI_HINT":
                    await t.usuarios.update({
                        where:{
                            id: userId
                        },
                        data: {
                            aiPistaBalance: reward.valorObtenible + (user.aiPistaBalance?? 0)
                        }
                    });
                    break
                case "XP":
                    await t.usuarios.update({
                        where:{
                            id: userId
                        },
                        data: {
                            xpTotales: reward.valorObtenible + (user.xpTotales ?? 0)
                        }
                    });
                    break
                default:
                    throw new Error("Recompensa no detectada"); 
            }
        })



        return reward;
    }

    static async rewardCatalog() {
        return prisma.recompensasCatalogo.findMany({
            orderBy: {
                id: "asc",
            },
        });
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

        const nuevaRacha = currentStrike + STRIKE_CONFIG.AUMENT_STRIKE;

        await prisma.$transaction(async (tx) => {
            await tx.usuarios.update({
                where: {
                    id: userId,
                },
                data: {
                    protectorRachaBalance: {
                        decrement: STRIKE_CONFIG.DECREMENT_STRIKE,
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
        const nuevaRacha = currentStrike + STRIKE_CONFIG.AUMENT_STRIKE;

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
            //La racha anterior pasa al historial.
            await tx.historialRacha.update({
                where: {
                    id: strikeId,
                },
                data: {
                    activa: false,
                },
            });

            //Nueva racha activa.
            await tx.historialRacha.create({
                data: {
                    usuarioId: userId,
                    fecha: date,
                    rachaValor: STRIKE_CONFIG.RESET_STRIKE,
                    activa: true,
                },
            });
        });
    }
}