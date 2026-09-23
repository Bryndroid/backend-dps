import express, { Request, Response } from 'express';
// Importamos rateLimit y las constantes nativas de la librería
import { rateLimit, MINUTE } from 'express-rate-limit';


// 1. Limiter Global: 100 peticiones por minuto
export const globalLimiter = rateLimit({
    windowMs: 1 * MINUTE,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Has superado el límite global de 100 peticiones por minuto.'
    }
});

// 2. Limiter Estricto (Crítico): 10 peticiones por minuto para endpoints sensibles
export const strictLimiter = rateLimit({
    windowMs: 1 * MINUTE,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Has superado el límite para esta acción crítica (10 peticiones por minuto).'
    }
});

