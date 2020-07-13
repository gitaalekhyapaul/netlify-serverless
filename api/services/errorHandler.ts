import { Request, Response, NextFunction } from "express";

export class CustomError extends Error {
  httpCode: number;
  constructor(
    httpCode: number = 500,
    errorMessage: string = "Internal Server Error"
  ) {
    super(errorMessage);
    this.httpCode = httpCode;
  }
}

interface Err extends Error {
  httpCode: number;
  name: string;
  stack?: string;
  message: string;
}

export const errorHandler = (
  err: Err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.httpCode).json({
    success: false,
    error: err.message,
  });
};
