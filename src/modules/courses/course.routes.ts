import express from "express"

import { CourseController } from "./course.controller.js";

import {authMiddleware} from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware.js";

const courseRoutes = express.Router();


courseRoutes.get("/:course/register", authMiddleware, CourseController.register);

courseRoutes.post("/:course/pass_module", strictLimiter, authMiddleware, CourseController.handlerModule);

courseRoutes.post("/:course/exam_complete", strictLimiter,authMiddleware, CourseController.examComplete);

courseRoutes.post("/:course/finish", authMiddleware, CourseController.finishCourse);

export default courseRoutes