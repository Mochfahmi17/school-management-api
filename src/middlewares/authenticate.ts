import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import verifyToken from "../utils/verifyToken";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(createHttpError(401, "Unauthorized."));
  }

  const secret = process.env.SECRET_KEY_TOKEN;
  if (!secret) {
    throw new Error("SECRET_KEY_TOKEN not found!");
  }

  const decode = verifyToken(token, secret) as jwt.JwtPayload;
  if (!decode || !decode.id) {
    return next(createHttpError(401, "Invalid or expired token."));
  }

  req.user = { id: decode.id, role: decode.role };
  next();
};

export default authenticate;
