//Configura Express
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import configAPI from './config/api.js';
import userRoutes from './modules/users/user.routes.js';
import courseRoutes from './modules/courses/course.routes.js';

import authRoutes from './modules/auth/auth.routes.js';
import gameRoutes from './modules/gamification/gamification.routes.js';
import { globalLimiter, strictLimiter } from './middlewares/rateLimiter.middleware.js';

const app = express();
const port = 3000;

app.set("port", process.env.PORT || port);
app.use(globalLimiter);


app.use(configAPI);
app.use(authRoutes)//ya
app.use("/user",userRoutes);//ya
app.use("/course",courseRoutes);//ya
app.use("/game",gameRoutes);



export default app;