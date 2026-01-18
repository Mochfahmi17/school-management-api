import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { ZodType } from "zod";

const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return result.error.issues.map((e) => res.status(400).json({ path: e.path[0], message: e.message }));
    }

    req.body = result.data;
    next();
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Something went wrong when validation!"));
  }
};

export default validate;
