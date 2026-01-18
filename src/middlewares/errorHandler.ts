import type { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(createHttpError(404, `Path not found! - ${req.originalUrl}`));
}

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || err.status || 500;
  const stack = err.stack;

  if (stack && process.env.NODE_ENV === "development") {
    console.log(stack);
  }

  return res.status(statusCode).json({ message: err.message });
}
