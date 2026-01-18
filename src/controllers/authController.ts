import type { CookieOptions, NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return next(createHttpError(401, "User is not registered."));
    }

    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return next(
        createHttpError(
          401,
          "Password invalid! Please make sure your password is correct.",
        ),
      );
    }

    const token = generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ message: "Login successfully!" });
  } catch (error) {
    console.error("Login is error: ", error);
    return next(createHttpError(500, "Login is failed!"));
  }
};

export const currentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(createHttpError(401, "Unauthorized."));
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      return next(createHttpError(404, "User not found!"));
    }

    return res.status(200).json({
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
    });
  } catch (error) {
    console.error("Get user error: ", error);
    return next(createHttpError(500, "Failed to get current user!"));
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      expires: new Date(Date.now()),
    };
    res.cookie("token", "", cookieOptions);

    return res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    console.error("Logout error: ", error);
    return next(createHttpError(500, "Logout is failed!"));
  }
};
