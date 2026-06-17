import { Request, Response, NextFunction } from "express"
import AppError from "@/modules/shared/errors/app.error"
import { logger } from "@/modules/shared/utils/logger"


export default function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  logger.error({ err }, "Unhandled error")

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
    })
  }

  return res.status(500).json({
    error: "Internal Server Error",
    message: "Internal Server Error",
  })
}