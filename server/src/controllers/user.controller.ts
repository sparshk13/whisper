import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import * as userService from "../services/user.service.js";

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserProfile(req.userId!);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
