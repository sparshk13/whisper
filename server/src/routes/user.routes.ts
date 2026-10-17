import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/me", authenticate, userController.getMe);
