import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

export const getAllSubjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ data: subjects });
  } catch (error) {
    console.error("Get data all subjects is error: ", error);
    return next(createHttpError(500, "Failed to get all data subjects."));
  }
};

export const addSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {} = req.body;
  } catch (error) {
    console.error("Add subject is error: ", error);
    return next(createHttpError(500, "Failed to add subjects."));
  }
};
