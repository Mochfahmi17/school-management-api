import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const allowRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createHttpError(403, "Forbidden: You don't have permission."),
      );
    }

    next();
  };
