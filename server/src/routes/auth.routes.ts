import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, authController.register);
authRouter.post("/login", authLimiter, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
