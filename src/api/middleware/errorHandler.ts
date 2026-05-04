import { Request, Response, NextFunction } from "express"
import AppError from "@errors/AppError"
import { logger } from "@utils/logger"


export default function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  logger.error({ err }, "Unhandled error")

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  return res.status(500).json({
    error: "Internal Server Error"
  })
}