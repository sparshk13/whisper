import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../types/errors.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  sub: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("UNAUTHORIZED", "Missing or invalid authorization header", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    throw new AppError("UNAUTHORIZED", "Invalid or expired token", 401);
  }
};
