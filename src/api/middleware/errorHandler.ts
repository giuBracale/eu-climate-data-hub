import { Request, Response, NextFunction } from "express"
import AppError from "../../domain/errors/AppError"

export default function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error(err)

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  return res.status(500).json({
    error: "Internal Server Error"
  })
}