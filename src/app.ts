//Configura Express
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import configAPI from './config/api.js';
import userRoutes from './modules/users/user.routes.js';
import examRoutes from './modules/courses/course.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import gameRoutes from './modules/gamification/gamification.routes.js';

const app = express();
const port = 3000;

app.set("port", process.env.PORT || port);

app.use(configAPI);
app.use(authRoutes)
app.use(userRoutes);
app.use(examRoutes);
app.use(gameRoutes);
app.use("/ai", aiRoutes);

export default app;