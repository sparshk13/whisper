import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/errors.js";
import { logger } from "../config/logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(", ");
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    });
    return;
  }

  logger.error({ err, path: req.path }, "Unhandled server error");
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
